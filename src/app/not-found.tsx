import Link from 'next/link'
import { draftMode } from 'next/headers'

export default async function NotFound() {
  let isPreview = false
  try {
    isPreview = (await draftMode()).isEnabled
  } catch {
    isPreview = false
  }

  return (
    <div
      style={{
        minHeight: '70vh',
        background: 'var(--bg-hero)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: '560px', textAlign: 'center' }}>
        {isPreview ? (
          <>
            <div style={{
              display: 'inline-block',
              background: 'rgba(28,127,192,0.1)', color: 'var(--green)',
              fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
              padding: '4px 12px', borderRadius: '20px', marginBottom: '18px',
            }}>
              Förhandsvisning av utkast
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 34px)',
              fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em',
              lineHeight: 1.15, margin: '0 0 14px',
            }}>
              Det här utkastet kunde inte laddas för förhandsvisning
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 24px' }}>
              Sidan är inte publicerad än, och det opublicerade utkastet kunde inte läsas.
              Det beror oftast på att sajten saknar en giltig <strong>SANITY_API_READ_TOKEN</strong>{' '}
              (en Viewer-token för Sanity-projektet). När den miljövariabeln är satt och sajten
              är omdeployad fungerar förhandsvisning av opublicerade utkast.
            </p>
          </>
        ) : (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 34px)',
              fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em',
              lineHeight: 1.15, margin: '0 0 14px',
            }}>
              Sidan hittades inte
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 24px' }}>
              Sidan du letar efter finns inte eller kan ha flyttats.
            </p>
          </>
        )}
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: 'var(--green)', color: '#fff',
            fontSize: '15px', fontWeight: 700,
            padding: '12px 22px', borderRadius: '10px', textDecoration: 'none',
          }}
        >
          Till startsidan
        </Link>
      </div>
    </div>
  )
}
