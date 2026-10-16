import { permanentRedirect } from 'next/navigation'

// Moved to /online-casinos/betalningsmetoder/[slug]/ — 301 the old path.
interface Props { params: Promise<{ slug: string }> }

export default async function LegacyPaymentSlugRedirect({ params }: Props) {
  const { slug } = await params
  permanentRedirect(`/online-casinos/betalningsmetoder/${slug}/`)
}
