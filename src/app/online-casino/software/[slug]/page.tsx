import { permanentRedirect } from 'next/navigation'

// Moved to /online-casinos/speltillverkare/[slug]/ — 301 the old path.
interface Props { params: Promise<{ slug: string }> }

export default async function LegacySoftwareSlugRedirect({ params }: Props) {
  const { slug } = await params
  permanentRedirect(`/online-casinos/speltillverkare/${slug}/`)
}
