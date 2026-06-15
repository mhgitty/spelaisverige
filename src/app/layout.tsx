import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import { AdminBar } from '@/components/AdminBar'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-figtree',
  display: 'swap',
})

const BASE = 'https://spelasisverige.com'

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
    icon: [{ url: '/favicon.webp', type: 'image/webp' }],
    apple: '/favicon.webp',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={figtree.variable}>
      <body>
        <AdminBar />
        {children}
      </body>
    </html>
  )
}
