import { PortableText } from '@portabletext/react'
import { opBodyComponents, OpScore } from './CasinoKort'

interface BonusKortData {
  customTitle?: string
  customBody?: any[]
  imageUrl?: string | null
  bonus?: {
    name: string
    bonusText: string
    logoUrl: string | null
    logoAlt: string | null
    score: number | null
    offerUrl: string
    terms: string | null
  }
}

/** Bonus card inside body text — same operator-card style as the casino card. */
export function BonusKort({ value }: { value: BonusKortData }) {
  const bonus = value.bonus
  if (!bonus) return null

  const name = value.customTitle || bonus.name
  const hasBody = Array.isArray(value.customBody) && value.customBody.length > 0
  const hasDetails = !!value.imageUrl || hasBody || !!bonus.terms

  return (
    <div className="sv-op">
      <div className="sv-op-head">
        <div className="sv-op-logo">
          {bonus.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bonus.logoUrl} alt={bonus.logoAlt || name} />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 className="sv-op-name">{name}</h3>
          {bonus.bonusText && <div className="sv-op-bonus">{bonus.bonusText}</div>}
          <OpScore score={bonus.score} />
        </div>
        {bonus.offerUrl && (
          <a href={bonus.offerUrl} target="_blank" rel="nofollow noopener noreferrer sponsored" className="sv-op-cta">
            Hämta bonus →
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
          {bonus.terms && <p className="sv-op-terms">{bonus.terms}</p>}
        </div>
      )}
    </div>
  )
}
