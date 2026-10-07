import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CmsPageView } from '@/components/CmsPageView'
import { SlotsArchive } from '@/components/SlotsArchive'
import { getSlotmachinesForArchive, getArchiveFeaturedSlotIds, getPageByPath, getSiteSettings, getHreflangScript } from '@/lib/sanity'
import type { Metadata } from 'next'

export const revalidate = 3600
const BASE = 'https://spelaisverige.com'
const PATH = '/online-slots'
const HOME = '/'
const LANG = 'sv'
const FLAG = '🌍'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByPath(['online-slots']).catch(() => null)
  const title = (page as any)?.metaTitle || (page as any)?.title || 'Onlineslots'
  const description = (page as any)?.metaDescription || 'Bläddra, sök och filtrera onlineslots efter leverantör, RTP, volatilitet, funktioner och mer.'
  const canonical = `${BASE}${PATH}/`
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
}

export default async function SlotsArchivePage() {
  const [slots, featuredIds, page] = await Promise.all([
    getSlotmachinesForArchive(),
    getArchiveFeaturedSlotIds(),
    getPageByPath(['online-slots']).catch(() => null),
  ])

  const archive = (
    <div style={{ maxWidth: '1250px', margin: '0 auto', padding: '26px 15px 8px' }}>
      <SlotsArchive slots={slots as any} basePath={PATH} flag={FLAG} featuredIds={featuredIds} />
    </div>
  )

  // Om en CMS-sida "online-slots" finns, rendera den (hero, snabblänkar, datum-vars,
  // TOC, body) och placera arkivet direkt efter heron.
  if (page) {
    const [settings, hreflangScript] = await Promise.all([
      getSiteSettings().catch(() => null),
      getHreflangScript((page as any)._id).catch(() => null),
    ])
    return (
      <>
        <Navbar />
        <CmsPageView
          page={page}
          settings={settings}
          hreflangScript={hreflangScript}
          slug={['online-slots']}
          homeHref={HOME}
          lang={LANG}
          canonical={`${BASE}${PATH}/`}
          afterHero={archive}
        />
        <Footer />
      </>
    )
  }

  // Ingen CMS-sida — minimal hero + arkiv.
  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--bg-hero)', paddingTop: '32px', paddingBottom: '28px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1250px', margin: '0 auto', padding: '0 15px' }}>
          <Breadcrumbs crumbs={[{ label: 'Hem', href: HOME }, { label: 'Onlineslots' }]} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, color: 'var(--text)', margin: '18px 0 0', lineHeight: 1.15 }}>Onlineslots</h1>
        </div>
      </div>
      {archive}
      <Footer />
    </>
  )
}
