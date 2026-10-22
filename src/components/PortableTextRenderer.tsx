import { PortableText } from '@portabletext/react'
import { replaceDateVarsInBlocks } from '@/lib/dateVars'
import { CalloutBlock } from './CalloutBlock'
import { WageringCalculator } from './WageringCalculator'
import { ProviderBox } from './ProviderBox'
import { CashbackCalculator } from './CashbackCalculator'
import { PageLinksBlock } from './PageLinksBlock'
import { FaqBlock } from './FaqBlock'
import { ProsConsBlock } from './ProsConsBlock'
import { LatestPostsBlock } from './LatestPostsBlock'
import { TableBlock } from './TableBlock'
import { headingId } from '@/lib/headingId'
import { CasinoKort } from './CasinoKort'
import { BonusKort } from './BonusKort'
import { HowToBlock } from './HowToBlock'
import { AuthorOpinionBlock } from './AuthorOpinionBlock'
import { DropdownBlock } from './DropdownBlock'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt?: string
  readingTime?: number
  category?: { name: string; emoji?: string; slug: { current: string } }
}

export function PortableTextRenderer({ value, posts }: { value: any[]; posts?: Post[] }) {
  const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''

  // First occurrence _key of each block type — used to give hero "Quick links"
  // buttons a single, stable scroll target (avoids duplicate ids).
  const firstKeyByType: Record<string, string> = {}
  for (const b of value || []) {
    if (b?._type && b?._key && !(b._type in firstKeyByType)) firstKeyByType[b._type] = b._key
  }
  const anchorFor: Record<string, string> = {
    prosConsBlock: 'pros-cons',
    howToBlock: 'how-to',
    faqBlock: 'faq',
  }
  const withAnchor = (type: string, key: string, node: any) =>
    key && firstKeyByType[type] === key && anchorFor[type]
      ? <div id={anchorFor[type]} style={{ scrollMarginTop: '80px' }}>{node}</div>
      : node

  const components = {
    block: {
      h2: ({ children, value: v }: any) => {
        const text = v?.children?.map((c: any) => c.text).join('') || ''
        return (
          <h2 id={headingId(text)} className="sv-h2" style={{ fontFamily: 'var(--font-display)', fontSize: '25px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', margin: '40px 0 16px', scrollMarginTop: '72px' }}>
            {children}
          </h2>
        )
      },
      h3: ({ children, value: v }: any) => {
        const text = v?.children?.map((c: any) => c.text).join('') || ''
        return (
          <h3 id={headingId(text)} style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', margin: '28px 0 10px', scrollMarginTop: '72px' }}>
            {children}
          </h3>
        )
      },
      h4: ({ children, value: v }: any) => {
        const text = v?.children?.map((c: any) => c.text).join('') || ''
        return (
          <h4 id={headingId(text)} style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--text)', margin: '20px 0 8px', scrollMarginTop: '72px' }}>
            {children}
          </h4>
        )
      },
      normal: ({ children }: any) => (
        <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '18px' }}>
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="sv-quote">
          <span className="sv-quote-mark" aria-hidden="true">&ldquo;</span>
          <div className="sv-quote-text">{children}</div>
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{children}</strong>,
      em: ({ children }: any) => <em>{children}</em>,
      link: ({ value, children }: any) => {
        const rel = ['noopener', 'noreferrer', value.nofollow ? 'nofollow' : ''].filter(Boolean).join(' ')
        return (
          <a href={value.href} target={value.blank ? '_blank' : '_self'} rel={rel}
            style={{ color: 'var(--green)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
            {children}
          </a>
        )
      },
    },
    list: {
      bullet: ({ children }: any) => <ul className="sv-ul">{children}</ul>,
      number: ({ children }: any) => <ol className="sv-ol">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: any) => <li>{children}</li>,
      number: ({ children }: any) => <li>{children}</li>,
    },
    types: {
      ctaButton: ({ value }: any) => {
        if (!value?.url) return null
        return (
          <div style={{ margin: '28px 0' }}>
            <a
              href={value.url}
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
              className="sv-op-cta"
              style={{ display: 'flex', width: '100%', fontSize: '16px', padding: '15px 24px' }}
            >
              {value.text || 'Hämta bonus'} →
            </a>
          </div>
        )
      },
      dropdownBlock: ({ value }: any) => <DropdownBlock value={value} />,
      calloutBlock: ({ value }: any) => <CalloutBlock value={value} />,
      faqBlock: ({ value }: any) => withAnchor('faqBlock', value._key, <FaqBlock value={value} />),
      prosConsBlock: ({ value }: any) => withAnchor('prosConsBlock', value._key, <ProsConsBlock value={value} />),
      wageringCalculatorBlock: ({ value }: any) => <WageringCalculator value={value} />,
      providerBoxBlock: ({ value }: any) => <ProviderBox value={value} />,
      cashbackCalculatorBlock: ({ value }: any) => <CashbackCalculator value={value} />,
      pageLinksBlock: ({ value }: any) => <PageLinksBlock value={value} />,
      tableBlock: ({ value }: any) => <TableBlock value={value} />,
      casinoKortBlock: ({ value }: any) => <CasinoKort value={value} />,
      bonusKortBlock: ({ value }: any) => <BonusKort value={value} />,
      howToBlock: ({ value }: any) => withAnchor('howToBlock', value._key, <HowToBlock value={value} />),
      authorOpinionBlock: ({ value }: any) => <AuthorOpinionBlock value={value} />,
      latestPostsBlock: ({ value: blockValue }: any) =>
        posts ? <LatestPostsBlock value={blockValue} posts={posts} /> : null,
      image: ({ value }: any) => {
        if (!value?.asset?._ref || !pid) return null
        const ref = value.asset._ref.replace('image-', '').replace(/-(\w+)$/, '.$1')
        return (
          <img
            src={`https://cdn.sanity.io/images/${pid}/production/${ref}`}
            alt={value.alt || ''}
            style={{ width: '100%', borderRadius: '8px', margin: '24px 0', display: 'block' }}
          />
        )
      },
    },
  }

  return <PortableText value={replaceDateVarsInBlocks(value)} components={components} />
}
