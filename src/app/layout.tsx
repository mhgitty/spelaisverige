import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { draftMode } from 'next/headers'
import { AdminBar } from '@/components/AdminBar'
import { PreviewBanner } from '@/components/PreviewBanner'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import './globals.css'

// Self-hosted Figtree (variable weight 300–900, Latin incl. å ä ö). Avoids
// fetching from Google Fonts at build time, which fails intermittently.
const figtree = localFont({
  src: [
    { path: './fonts/figtree-latin-wght-normal.woff2', weight: '300 900', style: 'normal' },
  ],
  variable: '--font-figtree',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
})

const BASE = 'https://spelaisverige.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Spelaisverige — Din svenska casinoguide',
    template: '%s',
  },
  description: 'Hitta de bästa onlinecasinona och casinobonusarna. Vi testar, recenserar och jämför alla de bästa casinona.',
  keywords: ['casinobonus', 'onlinecasino', 'free spins', 'välkomstbonus', 'casinorecension', 'bästa casino'],
  alternates: { canonical: BASE + '/' },
  openGraph: {
    siteName: 'Spelaisverige.com',
    locale: 'sv_SE',
    type: 'website',
    url: BASE + '/',
    title: 'Spelaisverige — Din svenska casinoguide',
    description: 'Hitta de bästa onlinecasinona och casinobonusarna.',
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: 'Spelaisverige.com' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.webp', type: 'image/webp', sizes: '500x500' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isPreview } = await draftMode()
  return (
    <html lang="sv" className={figtree.variable}>
      <body>
        {isPreview && <PreviewBanner />}
        <AdminBar />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  )
}
