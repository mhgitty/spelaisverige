import Link from 'next/link'
import { Breadcrumbs } from './Breadcrumbs'
import { replaceDateVars } from '@/lib/dateVars'

/* ─────────────────────────────────────────────────────────────────────────
   Casino review hero — "Nordisk" design.
   Left: identity, USP, reviewer + updated date, top pros (from the review's
   own Pros & Cons block), key facts, payment + software logos, quick links.
   Right: rating ring + verdict, welcome bonus, CTA, terms, responsible gaming.
   Every part is optional — anything not filled in is simply left out.
   ───────────────────────────────────────────────────────────────────────── */

type Ref = { _id: string; name?: string; slug?: string; logo?: { url?: string; alt?: string } }

interface Props {
  bm: any
  author?: { name?: string; slug?: { current?: string }; imageUrl?: string } | null
  buttons?: { text: string; targetId: string }[]
  hasBody?: boolean
}

function verdict(score: number) {
  if (score >= 9) return 'Toppklass'
  if (score >= 8) return 'Utmärkt'
  if (score >= 7) return 'Mycket bra'
  if (score >= 6) return 'Bra'
  if (score >= 5) return 'Godkänt'
  return 'Svagt'
}
function ringColor(score: number) {
  if (score >= 8) return 'var(--green)'
  if (score >= 6.5) return '#E0A400'
  if (score >= 5) return '#EA580C'
  return 'var(--red)'
}

function ScoreRing({ score }: { score: number }) {
  const r = 36
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(10, score)) / 10
  return (
    <div className="sv-ring" role="img" aria-label={`Betyg ${score.toFixed(1)} av 10`}>
      <svg width="86" height="86" viewBox="0 0 86 86">
        <circle cx="43" cy="43" r={r} fill="none" stroke="#E6EEF6" strokeWidth="8" />
        <circle cx="43" cy="43" r={r} fill="none" stroke={ringColor(score)} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`} />
      </svg>
      <div className="sv-ring-val">
        <span className="sv-ring-num">{score.toFixed(1)}</span>
        <span className="sv-ring-of">av 10</span>
      </div>
    </div>
  )
}

const ico = (d: React.ReactNode) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
const FACT_ICONS = {
  deposit: ico(<><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>),
  wager: ico(<><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v5h-5" /></>),
  founded: ico(<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></>),
  license: ico(<><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></>),
}

function LogoRow({ label, items, base }: { label: string; items: Ref[]; base: string }) {
  if (!items.length) return null
  const MAX = 6
  const shown = items.slice(0, MAX)
  const extra = items.length - shown.length
  return (
    <div className="sv-rh-logorow">
      <span className="sv-rh-logorow-label">{label}</span>
      {shown.map((it) => {
        const inner = (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {it.logo?.url && <img src={it.logo.url} alt={it.logo.alt || it.name || ''} />}
            {it.name}
          </>
        )
        const cls = `sv-rh-chip${it.logo?.url ? '' : ' sv-rh-chip--text'}`
        return it.slug
          ? <Link key={it._id} href={`${base}${it.slug}/`} className={cls}>{inner}</Link>
          : <span key={it._id} className={cls}>{inner}</span>
      })}
      {extra > 0 && <span className="sv-rh-chip sv-rh-chip--more">+{extra} till</span>}
    </div>
  )
}

export function ReviewHero({ bm, author, buttons = [], hasBody }: Props) {
  const title = replaceDateVars(bm.titel || `${bm.name} Recension`)
  const score: number | null = typeof bm.score === 'number' ? bm.score : null

  // Top pros pulled from the review's own Pros & Cons block (first one in the body).
  const pcBlock = (bm.body || []).find((b: any) => b?._type === 'prosConsBlock')
  const highlights: string[] = (pcBlock?.pros || []).filter(Boolean).slice(0, 3)

  const updated = bm._updatedAt
    ? new Date(bm._updatedAt).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const facts: { key: keyof typeof FACT_ICONS; label: string; value: string }[] = []
  if (bm.minIndbetaling != null && `${bm.minIndbetaling}`.trim() !== '') facts.push({ key: 'deposit', label: 'Min. insättning', value: `${bm.minIndbetaling} kr` })
  if (bm.gennemspilskrav) facts.push({ key: 'wager', label: 'Omsättningskrav', value: bm.gennemspilskrav })
  if (bm.lanceringsdato) facts.push({ key: 'founded', label: 'Grundat', value: bm.lanceringsdato })
  if (bm.license) facts.push({ key: 'license', label: 'Licens', value: bm.license })

  const payments: Ref[] = (bm.paymentMethods || []).filter((x: any) => x?._id)
  const software: Ref[] = (bm.software || []).filter((x: any) => x?._id)

  const jumps = [
    ...(hasBody ? [{ text: 'Läs recensionen', targetId: 'recension' }] : []),
    ...buttons.filter((b) => b.targetId !== 'comparison-list'),
  ]

  const stars = score != null ? Math.round(score / 2) : 0
  const hasCard = score != null || bm.indbetalingsbonus || bm.url || bm.terms

  return (
    <section className="sv-rh">
      <div className={`sv-rh-inner${hasCard ? '' : ' sv-rh-inner--nocard'}`}>
        {/* ── Identity ───────────────────────────────────────────── */}
        <div className="sv-rh-idwrap">
          <Breadcrumbs crumbs={[
            { label: 'Hem', href: '/' },
            { label: 'Casinorecensioner', href: '/online-casinos/recensioner/' },
            { label: bm.name },
          ]} />
          <div className="sv-rh-id">
            {bm.logo?.url && (
              <div className="sv-rh-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bm.logo.url} alt={bm.logo.alt || bm.name} />
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <span className="sv-eyebrow">Casinorecension</span>
              <h1>{title}</h1>
            </div>
          </div>
          {bm.usp && <p className="sv-rh-usp">{replaceDateVars(bm.usp)}</p>}

          {(author?.name || updated) && (
            <div className="sv-rh-meta">
              {author?.name && (
                <span className="sv-rh-meta-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {author.imageUrl && <img src={author.imageUrl} alt={author.name} />}
                  <span>Granskad av{' '}
                    {author.slug?.current
                      ? <Link href={`/author/${author.slug.current}/`}>{author.name}</Link>
                      : <strong style={{ color: '#fff' }}>{author.name}</strong>}
                  </span>
                </span>
              )}
              {updated && <span className="sv-rh-meta-item">Uppdaterad {updated}</span>}
            </div>
          )}
        </div>

        {/* ── Rating + bonus card ────────────────────────────────── */}
        {hasCard && (
          <aside className="sv-bc-wrap">
            <div className="sv-bc">
              {score != null && (
                <div className="sv-bc-top">
                  <ScoreRing score={score} />
                  <div>
                    <div className="sv-bc-verdict-label">Vårt betyg</div>
                    <div className="sv-bc-verdict">{verdict(score)}</div>
                    <div className="sv-bc-stars" aria-hidden="true">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
                  </div>
                </div>
              )}
              {bm.indbetalingsbonus && (
                <div className="sv-bc-bonus">
                  <div className="sv-bc-bonus-label">Välkomstbonus</div>
                  <div className="sv-bc-bonus-text">{replaceDateVars(bm.indbetalingsbonus)}</div>
                </div>
              )}
              {bm.url && (
                <a href={bm.url} target="_blank" rel="nofollow noopener noreferrer sponsored" className="sv-bc-cta">
                  {bm.indbetalingsbonus ? 'Hämta bonusen' : `Besök ${bm.name}`} →
                </a>
              )}
              {bm.terms && <p className="sv-bc-terms">{bm.terms}</p>}
              <div className="sv-bc-rg">
                <span className="sv-age">18+</span>
                <span>Spela ansvarsfullt</span>
                <a href="https://www.spelpaus.se" target="_blank" rel="noopener noreferrer">Spelpaus.se</a>
                <a href="https://www.stodlinjen.se" target="_blank" rel="noopener noreferrer">Stödlinjen.se</a>
              </div>
            </div>
          </aside>
        )}

        {/* ── Details ────────────────────────────────────────────── */}
        <div className="sv-rh-rest">
          {highlights.length > 0 && (
            <ul className="sv-rh-highlights" aria-label="Därför gillar vi casinot">
              {highlights.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          )}

          {facts.length > 0 && (
            <div className="sv-rh-facts">
              {facts.map((f) => (
                <div key={f.key} className="sv-rh-fact">
                  <div className="sv-rh-fact-label">{FACT_ICONS[f.key]}{f.label}</div>
                  <div className="sv-rh-fact-value">{f.value}</div>
                </div>
              ))}
            </div>
          )}

          {(payments.length > 0 || software.length > 0) && (
            <div className="sv-rh-logos">
              <LogoRow label="Betalningsmetoder" items={payments} base="/online-casinos/betalningsmetoder/" />
              <LogoRow label="Spelutvecklare" items={software} base="/online-casinos/speltillverkare/" />
            </div>
          )}

          {jumps.length > 0 && (
            <nav className="sv-rh-jumps" aria-label="Hoppa till">
              {jumps.map((j) => <a key={j.targetId} href={`#${j.targetId}`} className="sv-rh-jump">{j.text} ↓</a>)}
            </nav>
          )}
        </div>
      </div>
    </section>
  )
}
