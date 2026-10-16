import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { ComparisonTable } from '@/components/ComparisonTable'
import { HreflangLinks } from '@/components/HreflangLinks'
import { PaymentMethodHero } from '@/components/PaymentMethodHero'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { MobileToc } from '@/components/MobileToc'
import { RelatedPages } from '@/components/RelatedPages'
import { ComparisonJumpButton } from '@/components/ComparisonJumpButton'
import { getPaymentMethodBySlug, client } from '@/lib/sanity'
import { replaceDateVars } from '@/lib/dateVars'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

const BASE = 'https://spelaisverige.com'
const LISTING = '/online-casinos/betalningsmetoder/'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const methods = await client.fetch<Array<{ slug: { current: string } }>>(
    `*[_type == "paymentMethod" && (market == "global" || !defined(market)) && defined(slug.current)] { slug }`
  ).catch(() => [])
  return methods.map((m) => ({ slug: m.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const method = await getPaymentMethodBySlug(slug).catch(() => null)
  if (!method) return {}
  const title = replaceDateVars(method.metaTitle || `Casinon med ${method.name} — betala med ${method.name}`)
  const description = replaceDateVars(method.metaDescription || `Hitta de bästa onlinecasinona som accepterar ${method.name}. Jämför uttagstider, avgifter och bonusar.`)
  const canonical = `${BASE}${LISTING}${slug}/`
  const ogUrl = method.logo?.url || `${BASE}/og.png`
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: 'article', images: [{ url: ogUrl }] } }
}

export default async function PaymentMethodPage({ params }: Props) {
  const { slug } = await params
  const method = await getPaymentMethodBySlug(slug).catch(() => null)
  if (!method) notFound()

  const canonical = `${BASE}${LISTING}${slug}/`
  const label = method.name || slug.replace(/-/g, ' ').replace(/^\w/, (c: string) => c.toUpperCase())
  const hasBody = Array.isArray(method.body) && method.body.length > 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hem',               item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Betalningsmetoder', item: `${BASE}${LISTING}` },
      { '@type': 'ListItem', position: 3, name: label,               item: canonical },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <HreflangLinks docId={(method as any)._id} />
      <Navbar />

      {/* Breadcrumbs (above hero card) */}
      <div style={{ background: 'var(--bg-hero)', paddingTop: '32px', paddingBottom: '0' }}>
        <div style={{ maxWidth: '1250px', margin: '0 auto', padding: '0 15px' }}>
          <Breadcrumbs crumbs={[
            { label: 'Hem', href: '/' },
            { label: 'Betalningsmetoder', href: LISTING },
            { label },
          ]} />
        </div>
      </div>

      {/* Hero card */}
      <PaymentMethodHero
        name={method.name}
        titel={replaceDateVars(method.titel)}
        logo={method.logo}
        paymentCategory={method.paymentCategory}
        withdrawalTime={method.withdrawalTime}
        transactionFees={method.transactionFees}
        eligibleForBonuses={method.eligibleForBonuses}
        intro={method.intro}
      />

      {/* Comparison table — configured on the CMS document in Sanity Studio */}
      <ComparisonJumpButton data={method} />
      {(method as any).showComparisonTable && (method as any).comparisonTable && (
        <div className="section" style={{ paddingBottom: hasBody ? '0' : undefined }}>
          {(method as any).comparisonTableTitle && (
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>
              {replaceDateVars((method as any).comparisonTableTitle)}
            </h2>
          )}
          <ComparisonTable data={(method as any).comparisonTable} />
        </div>
      )}

      {/* Body content */}
      {hasBody && (
        <div className="article-layout">
          <article className="article-content">
            <MobileToc body={method.body} />
            <PortableTextRenderer value={method.body} />
          </article>
          <aside className="toc-sidebar">
            <TableOfContents body={method.body} />
          </aside>
        </div>
      )}

      <RelatedPages docId={method?._id} />
      <Footer />
    </>
  )
}
