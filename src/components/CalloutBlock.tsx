import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getAuthorById } from '@/lib/sanity'

interface CalloutBlockProps {
  value: {
    variant?: 'info' | 'tip' | 'warning' | 'quote'
    title?: string
    body?: any[] | string
    author?: { _ref?: string }
  }
}

const richTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 8px' }}>{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="sv-ul" style={{ margin: '6px 0 8px' }}>{children}</ul>,
    number: ({ children }: any) => <ol className="sv-ol" style={{ margin: '6px 0 8px' }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li style={{ fontSize: '14.5px' }}>{children}</li>,
    number: ({ children }: any) => <li style={{ fontSize: '14.5px' }}>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 700, color: 'var(--text)' }}>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ value, children }: any) => {
      const relParts = ['noopener', 'noreferrer', value?.nofollow ? 'nofollow' : ''].filter(Boolean)
      return (
        <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel={relParts.join(' ')}
          style={{ color: 'var(--green)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          {children}
        </a>
      )
    },
  },
}

const svg = (d: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
const ICONS = {
  info: svg(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  tip: svg(<><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z" /></>),
  warning: svg(<><path d="M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>),
}

function Body({ body }: { body?: any[] | string }) {
  if (!body) return null
  return Array.isArray(body)
    ? <PortableText value={body} components={richTextComponents} />
    : <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{body}</p>
}

function Person({ person, className }: { person: any; className: string }) {
  if (!person?.name) return null
  return (
    <div className={className}>
      {person.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={person.imageUrl} alt={person.name} loading="lazy" />
      )}
      <div style={{ lineHeight: 1.3 }}>
        {person.slug?.current
          ? <Link href={`/author/${person.slug.current}/`} style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)', textDecoration: 'none' }}>{person.name}</Link>
          : <strong style={{ fontSize: '13.5px', color: 'var(--text)' }}>{person.name}</strong>}
        {person.role && <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>{person.role}</span>}
      </div>
    </div>
  )
}

export async function CalloutBlock({ value }: CalloutBlockProps) {
  const { variant = 'info', title, body, author } = value

  // Resolve the credited author (optional) at render time.
  let person = null
  if (author?._ref) {
    try { person = await getAuthorById(author._ref) } catch { person = null }
  }

  // Quote variant — navy quote card (same style as blockquotes in body text).
  if (variant === 'quote') {
    return (
      <figure className="sv-quote">
        <span className="sv-quote-mark" aria-hidden="true">&ldquo;</span>
        {title && <div className="sv-quote-title">{title}</div>}
        <div className="sv-quote-text"><Body body={body} /></div>
        <Person person={person} className="sv-quote-by" />
      </figure>
    )
  }

  const kind = (['info', 'tip', 'warning'] as const).includes(variant as any) ? (variant as 'info' | 'tip' | 'warning') : 'info'

  return (
    <aside className={`sv-callout sv-callout--${kind}`}>
      <span className="sv-callout-icon">{ICONS[kind]}</span>
      <div style={{ minWidth: 0 }}>
        {title && <div className="sv-callout-title">{title}</div>}
        <div className="sv-callout-body" style={!title ? { marginTop: '10px' } : undefined}><Body body={body} /></div>
        <Person person={person} className="sv-callout-by" />
      </div>
    </aside>
  )
}
