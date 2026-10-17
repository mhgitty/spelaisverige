interface ProsConsBlockProps { value: { title?: string; pros?: string[]; cons?: string[] } }

const ThumbUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3z" />
    <path d="M7 10l4-7a2 2 0 0 1 2.9 1.9L13 9h5.6a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17.2 20H7" />
  </svg>
)
const ThumbDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>
    <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3z" />
    <path d="M7 10l4-7a2 2 0 0 1 2.9 1.9L13 9h5.6a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17.2 20H7" />
  </svg>
)

export function ProsConsColumn({ kind, items }: { kind: 'pro' | 'con'; items: string[] }) {
  const isPro = kind === 'pro'
  return (
    <div className={`sv-pc-col sv-pc-col--${kind}`}>
      <div className="sv-pc-head">
        <span className="sv-pc-headicon">{isPro ? <ThumbUp /> : <ThumbDown />}</span>
        {isPro ? 'Fördelar' : 'Nackdelar'}
        <span className="sv-pc-count">{items.length}</span>
      </div>
      <ul className="sv-pc-list">
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  )
}

/** Pros & cons — one split card with an optional navy title bar. */
export function ProsConsBlock({ value }: ProsConsBlockProps) {
  const pros = (value?.pros || []).filter(Boolean)
  const cons = (value?.cons || []).filter(Boolean)
  if (pros.length === 0 && cons.length === 0) return null
  const single = pros.length === 0 || cons.length === 0

  return (
    <div className="sv-block">
      <div className="sv-pc">
        {value.title && <h3 className="sv-pc-title">{value.title}</h3>}
        <div className={`sv-pc-grid${single ? ' sv-pc-grid--single' : ''}`}>
          {pros.length > 0 && <ProsConsColumn kind="pro" items={pros} />}
          {cons.length > 0 && <ProsConsColumn kind="con" items={cons} />}
        </div>
      </div>
    </div>
  )
}
