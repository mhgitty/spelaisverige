import { PortableText } from '@portabletext/react'

interface HowToItem {
  title?: string
  body?: string | any[]
}

// Plain-text extraction from a Portable Text array (or a plain string) for
// use in the HowTo structured data.
function toPlainText(body?: string | any[]): string {
  if (!body) return ''
  if (typeof body === 'string') return body
  return body
    .map((blk) => (blk?.children || []).map((c: any) => c?.text || '').join(''))
    .join(' ')
    .trim()
}

const stepBodyComponents = {
  block: { normal: ({ children }: any) => <p>{children}</p> },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 700, color: 'var(--text)' }}>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ value, children }: any) => {
      const rel = ['noopener', 'noreferrer', value?.nofollow ? 'nofollow' : ''].filter(Boolean).join(' ')
      return (
        <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel={rel}
          style={{ color: 'var(--green)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          {children}
        </a>
      )
    },
  },
}

interface HowToBlockProps {
  value: {
    title?: string
    intro?: string
    totalMinutes?: number
    items?: HowToItem[]
  }
}

/** How-to — vertical timeline: yellow step markers joined by a dashed line. */
export function HowToBlock({ value }: HowToBlockProps) {
  if (!value?.items?.length) return null

  const mins = typeof value.totalMinutes === 'number' && value.totalMinutes > 0 ? value.totalMinutes : null
  const steps = value.items.filter((s) => s?.title || s?.body)
  if (steps.length === 0) return null

  // Emit HowTo structured data from the steps we already collect.
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: value.title || 'Så gör du',
    ...(value.intro ? { description: value.intro } : {}),
    ...(mins ? { totalTime: `PT${mins}M` } : {}),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      ...(s.title ? { name: s.title } : {}),
      text: toPlainText(s.body) || s.title,
    })),
  }

  const hasHead = !!(value.title || mins || value.intro)

  return (
    <div className="sv-block">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <div className="sv-howto">
        {hasHead && (
          <div className="sv-howto-head">
            <div className="sv-howto-headrow">
              <span className="sv-eyebrow">Steg för steg · {steps.length} steg</span>
              {mins && (
                <span className="sv-howto-time">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  ≈ {mins} min
                </span>
              )}
            </div>
            {value.title && <h2 className="sv-howto-title">{value.title}</h2>}
            {value.intro && <p className="sv-howto-intro">{value.intro}</p>}
          </div>
        )}

        <ol className="sv-steps">
          {steps.map((item, i) => {
            const hasBody = Array.isArray(item.body) ? item.body.length > 0 : !!item.body
            return (
              <li key={i} className="sv-step">
                <span className="sv-step-num" aria-hidden="true">{i + 1}</span>
                <div>
                  {item.title && <h3 className="sv-step-title">{item.title}</h3>}
                  {hasBody && (
                    <div className="sv-step-body" style={!item.title ? { marginTop: '9px' } : undefined}>
                      {Array.isArray(item.body)
                        ? <PortableText value={item.body} components={stepBodyComponents} />
                        : <p>{item.body}</p>}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
