interface FaqBlockProps { value: { items?: { question: string; answer: string }[] } }

/**
 * FAQ — numbered accordion on native <details>/<summary>.
 * No client JS needed; every answer stays in the HTML (good for SEO).
 * The first question is open by default.
 */
export function FaqBlock({ value }: FaqBlockProps) {
  const items = (value?.items || []).filter((i) => i?.question)
  if (items.length === 0) return null

  // Emit FAQPage structured data for any FAQ block, on any page that renders it.
  const faqs = items.filter((i) => i?.question && i?.answer)
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  return (
    <div className="sv-block">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="sv-faq">
        {items.map((item, i) => (
          <details key={i} className="sv-faq-item" open={i === 0}>
            <summary className="sv-faq-q">
              <span className="sv-faq-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="sv-faq-qtext">{item.question}</span>
              <span className="sv-faq-toggle" aria-hidden="true" />
            </summary>
            {item.answer && <div className="sv-faq-a">{item.answer}</div>}
          </details>
        ))}
      </div>
    </div>
  )
}
