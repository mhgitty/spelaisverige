const MONTHS_SV = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
]

/**
 * Replace [year]/[år], [month]/[månad], [date]/[datum] tokens with current Swedish date values.
 * Safe to call with null/undefined — returns the input unchanged.
 */
export function replaceDateVars(input: string | any[] | null | undefined): string {
  // Accept Portable Text (rich text arrays) too — flatten to plain text first.
  let str: string
  if (Array.isArray(input)) {
    str = input
      .filter((b: any) => b?._type === 'block' && Array.isArray(b.children))
      .map((b: any) => b.children.map((c: any) => c?.text || '').join(''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  } else if (typeof input === 'string') {
    str = input
  } else {
    return ''
  }
  if (!str) return ''
  const now = new Date()
  const year  = now.getFullYear().toString()
  const month = MONTHS_SV[now.getMonth()]
  const date  = now.getDate().toString()
  return str
    .replace(/\[year\]/gi,         year)
    .replace(/\[år\]/gi,           year)
    .replace(/\[månad\]/gi,        month)
    .replace(/\[datum\]/gi,        date)
    .replace(/%%currentyear%%/gi,  year)
    .replace(/\[month\]/gi,        month)
    .replace(/%%currentmonth%%/gi, month)
    .replace(/\[date\]/gi,         date)
    .replace(/%%currentdate%%/gi,  date)
}

/**
 * Walk a Portable Text block array and replace date tokens in every text span.
 * Returns a new array — does not mutate the original.
 */
export function replaceDateVarsInBlocks(blocks: any[]): any[] {
  if (!Array.isArray(blocks)) return blocks
  return blocks.map((block) => {
    if (block._type === 'block' && Array.isArray(block.children)) {
      return {
        ...block,
        children: block.children.map((child: any) =>
          child._type === 'span' && typeof child.text === 'string'
            ? { ...child, text: replaceDateVars(child.text) }
            : child
        ),
      }
    }
    return block
  })
}
