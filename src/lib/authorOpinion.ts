// Turns a casino review's "author's opinion" section — an H3 such as
// "Hugos dom om Felicebet …" or "Hugo Johanssons omdöme om Fiestaslots Casino"
// followed by its plain paragraphs — into a single authorOpinionBlock.
//
// Used in two places:
//  • /api/normalize-blocks (Sanity webhook) — rewrites the document itself.
//  • the review page at render time — so existing reviews show the block
//    immediately, even before the document has been re-saved.

type Block = { _type?: string; _key?: string; style?: string; listItem?: string; children?: any[]; [k: string]: any }

// "dom om", "omdöme om", "åsikt om", "syn på", "intryck av", "tankar om", "betyg på" …
export const OPINION_HEADING = /\b(dom|omdöme|åsikt|syn|intryck|tankar|betyg|recension|uppfattning)\s+(om|på|av)\b/i

const blockText = (b: Block) => (b?.children || []).map((c: any) => c?.text || '').join('')

export function convertOpinion(body: Block[] | null | undefined): Block[] | null {
  if (!Array.isArray(body) || !body.length) return null
  if (body.some((b) => b?._type === 'authorOpinionBlock')) return null

  // Only look near the top of the review, where the opinion section lives.
  const i = body.findIndex(
    (b, idx) => idx < 12 && b?._type === 'block' && b.style === 'h3' && OPINION_HEADING.test(blockText(b))
  )
  if (i < 0) return null

  // Collect the plain paragraphs that follow (stop at the next heading / list / block).
  let j = i + 1
  while (j < body.length && body[j]?._type === 'block' && (body[j].style || 'normal') === 'normal' && !body[j].listItem) j++
  if (j === i + 1) return null

  const opinion: Block = {
    _type: 'authorOpinionBlock',
    _key: `op${body[i]._key || i}`.slice(0, 24),
    title: blockText(body[i]).trim(),
    body: body.slice(i + 1, j),
  }
  return [...body.slice(0, i), opinion, ...body.slice(j)]
}
