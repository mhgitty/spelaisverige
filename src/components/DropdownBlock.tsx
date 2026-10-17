import { PortableText } from '@portabletext/react'

const innerComponents = {
  block: {
    normal: ({ children }: any) => <p>{children}</p>,
    h3: ({ children }: any) => (
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--text)', margin: '16px 0 8px' }}>{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '14px 0 6px' }}>{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="sv-ul">{children}</ul>,
    number: ({ children }: any) => <ol className="sv-ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 700, color: 'var(--text)' }}>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        style={{ color: 'var(--green)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
      >
        {children}
      </a>
    ),
  },
}

interface DropdownBlockProps {
  value: {
    title?: string
    content?: any[]
    defaultOpen?: boolean
  }
}

/** Expandable section — same visual language as the FAQ accordion. */
export function DropdownBlock({ value }: DropdownBlockProps) {
  if (!value?.title) return null
  const hasContent = Array.isArray(value.content) && value.content.length > 0

  return (
    <details className="sv-faq-item sv-dd" open={value.defaultOpen ?? false} style={{ margin: '16px 0' }}>
      <summary className="sv-faq-q">
        <h2 className="sv-faq-qtext">{value.title}</h2>
        <span className="sv-faq-toggle" aria-hidden="true" />
      </summary>
      {hasContent && (
        <div className="sv-faq-a sv-faq-a--rich">
          <PortableText value={value.content!} components={innerComponents} />
        </div>
      )}
    </details>
  )
}
