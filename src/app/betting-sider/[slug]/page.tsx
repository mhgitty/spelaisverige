import { permanentRedirect } from 'next/navigation'

interface Props { params: Promise<{ slug: string }> }

// Duplicate of /online-casinos/recensioner/[slug]/ — consolidate to the canonical review path.
export default async function BettingSiderSlugRedirect({ params }: Props) {
  const { slug } = await params
  permanentRedirect(`/online-casinos/recensioner/${slug}/`)
}
