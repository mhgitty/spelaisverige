import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { StickyCtaBar } from '@/components/StickyCtaBar'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { MobileToc } from '@/components/MobileToc'
import { JsonLd } from '@/components/JsonLd'
import { getBookmakerBySlug, getPosts, getSiteSettings, clientNoCdn, getHreflangScript } from '@/lib/sanity'
import { HreflangHead } from '@/components/HreflangHead'
import { replaceDateVars } from '@/lib/dateVars'
import { notFound } from 'next/navigation'
import { AuthorBio } from '@/components/AuthorBio'
import { ReviewHero } from '@/components/ReviewHero'
import { heroButtonsFor } from '@/lib/heroButtons'
import { RelatedPages } from '@/components/RelatedPages'
import type { Metadata } from 'next'

export const revalidate = 3600

const BASE = 'https://spelaisverige.com'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const bookmakers = await clientNoCdn.fetch<Array<{ slug: { current: string } }>>(
    `*[_type == "bookmaker" && (market == "global" || !defined(market)) && defined(slug.current)] { slug }`
  ).catch(() => [])
  return bookmakers.map((b) => ({ slug: b.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const bm = await getBookmakerBySlug(slug).catch(() => null)
  if (!bm) return {}
  const title = replaceDateVars(bm.metaTitle || `${bm.name} Recension — bonus & erbjudanden`)
  const description = replaceDateVars(bm.metaDescription || `Läs vår recension av ${bm.name}. Se bonus, omsättningskrav och vårt betyg.`)
  const canonical = `${BASE}/online-casinos/recensioner/${slug}/`
  const img = bm.ogImage?.url ? bm.ogImage : bm.logo?.url ? bm.logo : null
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title, description, url: canonical, type: 'article',
      images: img ? [{ url: img.url, alt: img.alt || title }] : [{ url: `${BASE}/og.png` }],
    },
    twitter: {
      title, description,
      ...(img ? { images: [img.url] } : {}),
    },
  }
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params
  const [bm, latestPosts, settings] = await Promise.all([
    getBookmakerBySlug(slug).catch(() => null),
    getPosts(6),
    getSiteSettings().catch(() => null),
  ])
  if (!bm) notFound()
  const hreflangScript = await getHreflangScript(bm._id).catch(() => null)
  const author = settings?.defaultAuthor ?? null

  const canonical = `${BASE}/online-casinos/recensioner/${slug}/`
  const hasBody = Array.isArray(bm.body) && bm.body.length > 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Hem', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Casinorecensioner', item: `${BASE}/online-casinos/recensioner/` },
          { '@type': 'ListItem', position: 3, name: bm.name, item: canonical },
        ],
      },
      {
        '@type': 'Review',
        itemReviewed: { '@type': 'Organization', name: bm.name, url: bm.url },
        reviewRating: bm.score != null ? { '@type': 'Rating', ratingValue: bm.score, bestRating: 10 } : undefined,
        author: author?.name ? { '@type': 'Person', name: author.name } : { '@type': 'Organization', name: 'Spelaisverige' },
        publisher: { '@type': 'Organization', name: 'Spelaisverige', url: BASE },
        ...(bm._updatedAt ? { dateModified: bm._updatedAt } : {}),
        url: canonical,
      },
    ],
  }

  return (
    <>
      <HreflangHead script={hreflangScript} />
      <JsonLd data={jsonLd} />
      <Navbar />

      <ReviewHero bm={bm} author={author} buttons={heroButtonsFor(bm)} hasBody={hasBody} />

      {bm.url && (
        <StickyCtaBar url={bm.url} name={bm.name} logoUrl={bm.logo?.url ?? null} logoAlt={bm.logo?.alt ?? null} bonus={bm.indbetalingsbonus ?? null} terms={bm.terms ?? null} />
      )}

      {hasBody && (
        <div id="recension" className="article-layout" style={{ scrollMarginTop: '72px' }}>
          <article className="article-content">
            <MobileToc body={bm.body} />
            <PortableTextRenderer value={bm.body} posts={latestPosts as any} />
          </article>
          <aside className="toc-sidebar">
            <TableOfContents body={bm.body} />
          </aside>
        </div>
      )}

      {author && (
        <div className="section" style={{ paddingTop: '0' }}>
          <AuthorBio author={author} compact />
        </div>
      )}

      <Footer />
      <RelatedPages docId={bm?._id} />
    </>
  )
}
