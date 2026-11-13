import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { RichIntro } from '@/components/RichIntro'
import { getPosts, getHomepage, getHreflangScript } from '@/lib/sanity'
import { HreflangHead } from '@/components/HreflangHead'
import { replaceDateVars } from '@/lib/dateVars'
import { heroButtonsFor } from '@/lib/heroButtons'
import { ComparisonTable } from '@/components/ComparisonTable'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { MobileToc } from '@/components/MobileToc'
import type { Metadata } from 'next'

export const revalidate = 300

const BASE = 'https://spelaisverige.com'

export async function generateMetadata(): Promise<Metadata> {
  const hp = await getHomepage().catch(() => null)
  const title = replaceDateVars(hp?.metaTitle || 'Bästa onlinecasinobonusarna — Jämför topperbjudanden')
  const description = replaceDateVars(hp?.metaDescription || 'Din oberoende svenska guide till onlinecasinobonusar. Vi jämför och recenserar alla de bästa casinona.')
  return {
    title,
    description,
    alternates: { canonical: BASE + '/' },
    openGraph: { title, description, url: BASE + '/', type: 'website', images: hp?.ogImage?.url ? [{ url: hp.ogImage.url }] : [{ url: `${BASE}/og.png` }] },
    twitter: { title, description },
  }
}

export default async function HomePage() {
  const [posts, hp] = await Promise.all([
    getPosts(20).catch(() => []),
    getHomepage().catch(() => null),
  ])

  const hasBody = Array.isArray(hp?.body) && hp.body.length > 0
  const heroButtons = heroButtonsFor(hp)

  const heroHeading = replaceDateVars(hp?.heroHeading || 'Hitta de bästa onlinecasinobonusarna')
  const heroIntro = hp?.intro ?? 'Vi jämför och recenserar alla de bästa onlinecasinona. Hitta den bästa välkomstbonusen och kom igång idag.'

  const latestSectionTitle   = hp?.latestSectionTitle   || 'Senaste'
  const featuredSectionTitle = hp?.featuredSectionTitle || 'Utvalda'


  const faqs = (hp?.body ?? [])
    .filter((b: any) => b._type === 'faqBlock')
    .flatMap((b: any) => b.items ?? [])
    .filter((f: any) => f.question && f.answer)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: 'Spelaisverige.com',
        inLanguage: 'sv-SE',
      },
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: 'Spelaisverige',
        url: BASE,
        logo: { '@type': 'ImageObject', url: `${BASE}/logo.webp` },
      },
      ...(faqs.length > 0 ? [{
        '@type': 'FAQPage',
        mainEntity: faqs.map((f: any) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }] : []),
    ],
  }

  const hreflangScript = await getHreflangScript('homepage').catch(() => null)

  const postList = posts as any[]

  // Group posts by category for Featured section
  const categoryMap: Record<string, { name: string; slug: string; posts: any[] }> = {}
  for (const post of postList) {
    const catName = post.category?.name
    if (!catName) continue
    if (!categoryMap[catName]) {
      categoryMap[catName] = {
        name: catName,
        slug: post.category?.slug?.current ?? '',
        posts: [],
      }
    }
    if (categoryMap[catName].posts.length < 4) {
      categoryMap[catName].posts.push(post)
    }
  }
  const featuredCategories = Object.values(categoryMap).filter(c => c.posts.length > 0).slice(0, 4)

  const featuredPost = postList[0] ?? null
  const sidebarPosts = postList.slice(1, 5)

  return (
    <>
      <HreflangHead script={hreflangScript} />
      <JsonLd data={jsonLd} />
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
          <h1 className="hero-heading">
            {heroHeading}
          </h1>
          <p className="hero-subtext">
            {typeof heroIntro === 'string' ? replaceDateVars(heroIntro) : <RichIntro value={heroIntro} />}
          </p>
          {heroButtons.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '8px' }}>
                Snabblänkar
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {heroButtons.map((b) => {
                  const outline = b.variant === 'outline'
                  return (
                    <a key={b.targetId} href={`#${b.targetId}`} className="hero-compare-btn" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      background: outline ? 'transparent' : 'var(--green)', color: outline ? 'var(--green)' : '#fff',
                      border: '1.5px solid var(--green)', fontSize: '14.5px', fontWeight: 700,
                      padding: '10.5px 18px', borderRadius: '10px', textDecoration: 'none',
                      boxShadow: outline ? 'none' : '0 4px 14px rgba(28,127,192,0.28)',
                    }}>
                      {replaceDateVars(b.text)}
                      <span aria-hidden="true" style={{ fontSize: '16px', lineHeight: 1 }}>↓</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Comparison list — configured on the Homepage document in Sanity */}
      {hp?.showComparisonTable && hp?.comparisonTable && (
        <div className="section" style={{ paddingBottom: hasBody ? '0' : undefined }}>
          {hp.comparisonTableTitle && (
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>
              {replaceDateVars(hp.comparisonTableTitle)}
            </h2>
          )}
          <ComparisonTable data={hp.comparisonTable} />
        </div>
      )}

      {/* Body content ("Content" field on the Homepage document) */}
      {hasBody && (
        <div className="article-layout">
          <article className="article-content">
            <MobileToc body={hp.body} />
            <PortableTextRenderer value={hp.body} posts={posts as any} />
          </article>
          <aside className="toc-sidebar">
            <TableOfContents body={hp.body} />
          </aside>
        </div>
      )}

      <div style={{ maxWidth: '1250px', margin: '0 auto', padding: '0 15px' }}>

        {/* ── 1. LATEST SECTION ───────────────────────────────────────────── */}
        {postList.length > 0 && (
          <section style={{ marginTop: '48px' }}>
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: '12px',
              background: 'var(--bg-card)',
              padding: '28px',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '24px',
              }}>{latestSectionTitle}</h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
                gap: '24px',
              }}
                className="latest-grid"
              >
                {/* Featured post */}
                {featuredPost && (
                  <a href={`/${featuredPost.slug?.current ?? ''}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      {featuredPost.featuredImage?.url && (
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                          <Image
                            src={featuredPost.featuredImage.url}
                            alt={featuredPost.featuredImage.alt ?? featuredPost.title ?? ''}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 560px"
                          />
                        </div>
                      )}
                      {featuredPost.category?.name && (
                        <span style={{
                          display: 'inline-block',
                          background: 'var(--green)',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          width: 'fit-content',
                        }}>
                          {featuredPost.category.name}
                        </span>
                      )}
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--text)',
                        marginBottom: '10px',
                        lineHeight: 1.3,
                      }}>{featuredPost.title}</h3>
                      {featuredPost.excerpt && (
                        <p style={{ fontSize: '14px', color: 'var(--text-muted, #888)', lineHeight: 1.6, marginBottom: '10px' }}>
                          {featuredPost.excerpt}
                        </p>
                      )}
                      {featuredPost.publishedAt && (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted, #888)' }}>
                          {new Date(featuredPost.publishedAt).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </a>
                )}

                {/* Sidebar posts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sidebarPosts.map((post: any) => (
                    <a key={post._id} href={`/${post.slug?.current ?? ''}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        {post.featuredImage?.url && (
                          <div style={{ position: 'relative', width: '80px', minWidth: '80px', height: '56px', borderRadius: '6px', overflow: 'hidden' }}>
                            <Image
                              src={post.featuredImage.url}
                              alt={post.featuredImage.alt ?? post.title ?? ''}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="80px"
                            />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {post.category?.name && (
                            <span style={{
                              display: 'inline-block',
                              background: 'var(--green)',
                              color: '#fff',
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '1px 6px',
                              borderRadius: '3px',
                              marginBottom: '5px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}>
                              {post.category.name}
                            </span>
                          )}
                          <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text)',
                            lineHeight: 1.35,
                            marginBottom: '4px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          } as React.CSSProperties}>{post.title}</p>
                          {post.publishedAt && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted, #888)' }}>
                              {new Date(post.publishedAt).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* View all button */}
              <div style={{ textAlign: 'center', marginTop: '28px' }}>
                <a href="/" style={{
                  display: 'inline-block',
                  padding: '10px 28px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  textDecoration: 'none',
                  background: 'transparent',
                }}>Visa alla artiklar</a>
              </div>
            </div>
          </section>
        )}

        {/* ── 3. FEATURED BY CATEGORY ─────────────────────────────────────── */}
        {featuredCategories.length > 0 && (
          <section style={{ marginTop: '48px' }}>
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: '12px',
              background: 'var(--bg-card)',
              padding: '28px',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '28px',
              }}>{featuredSectionTitle}</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                {featuredCategories.map(cat => (
                  <div key={cat.slug}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--text)',
                        margin: 0,
                      }}>{cat.name}</h3>
                      <a href={`/news/${cat.slug}/`} style={{
                        fontSize: '13px',
                        color: 'var(--green)',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}>Visa alla →</a>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '16px',
                    }}
                      className="featured-cat-grid"
                    >
                      {cat.posts.map((post: any) => (
                        <a key={post._id} href={`/${post.slug?.current ?? ''}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div>
                            {post.featuredImage?.url && (
                              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                                <Image
                                  src={post.featuredImage.url}
                                  alt={post.featuredImage.alt ?? post.title ?? ''}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  sizes="(max-width: 768px) 50vw, 220px"
                                />
                              </div>
                            )}
                            <p style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: 'var(--text)',
                              lineHeight: 1.35,
                              margin: 0,
                            }}>{post.title}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}


      </div>

      <Footer />

      <style>{`
        @media (max-width: 700px) {
          .latest-grid { grid-template-columns: 1fr !important; }
          .rankings-grid { grid-template-columns: 1fr !important; }
          .featured-cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
          .trust-grid > div { border-left: none !important; border-right: none !important; border-top: 1px solid var(--border); padding-top: 24px; }
          .trust-grid > div:first-child { border-top: none; padding-top: 0; }
        }
      `}</style>
    </>
  )
}
