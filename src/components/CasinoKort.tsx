import { PortableText } from '@portabletext/react'
import { ProsConsColumn } from './ProsConsBlock'

export const opBodyComponents = {
  block: { normal: ({ children }: any) => <p>{children}</p> },
  list: {
    bullet: ({ children }: any) => <ul className="sv-ul" style={{ margin: '6px 0 10px' }}>{children}</ul>,
    number: ({ children }: any) => <ol className="sv-ol" style={{ margin: '6px 0 10px' }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li style={{ fontSize: '14.5px' }}>{children}</li>,
    number: ({ children }: any) => <li style={{ fontSize: '14.5px' }}>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ color: 'var(--text)', fontWeight: 700 }}>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
  },
}

export function OpScore({ score }: { score?: number | null }) {
  if (score == null) return null
  return <div className="sv-op-score"><span>★</span> {score.toFixed(1)} / 10</div>
}

interface CasinoKortData {
  customTitle?: string
  customBody?: any[]
  imageUrl?: string | null
  pros?: string[]
  cons?: string[]
  bookmaker?: {
    name: string
    score: number | null
    logoUrl: string | null
    logoAlt: string | null
    url: string
  }
}

/** Casino card inside body text — "operator card": header row + details panel. */
export function CasinoKort({ value }: { value: CasinoKortData }) {
  const bm = value.bookmaker
  if (!bm) return null

  const name = value.customTitle || bm.name
  const pros = (value.pros || []).filter(Boolean)
  const cons = (value.cons || []).filter(Boolean)
  const hasBody = Array.isArray(value.customBody) && value.customBody.length > 0
  const hasDetails = !!value.imageUrl || hasBody || pros.length > 0 || cons.length > 0

  return (
    <div className="sv-op">
      <div className="sv-op-head">
        <div className="sv-op-logo">
          {bm.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bm.logoUrl} alt={bm.logoAlt || name} />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 className="sv-op-name">{name}</h3>
          <OpScore score={bm.score} />
        </div>
        {bm.url && (
          <a href={bm.url} target="_blank" rel="nofollow noopener noreferrer sponsored" className="sv-op-cta">
            Besök casino →
          </a>
        )}
      </div>

      {hasDetails && (
        <div className="sv-op-body">
          {value.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="sv-op-img" src={value.imageUrl} alt={name} />
          )}
          {hasBody && <PortableText value={value.customBody!} components={opBodyComponents} />}
          {(pros.length > 0 || cons.length > 0) && (
            <div className="sv-op-pc" style={pros.length === 0 || cons.length === 0 ? { gridTemplateColumns: '1fr' } : undefined}>
              {pros.length > 0 && <ProsConsColumn kind="pro" items={pros} />}
              {cons.length > 0 && <ProsConsColumn kind="con" items={cons} />}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
