import { permanentRedirect } from 'next/navigation'

// Reviews moved to /online-casinos/recensioner/[slug]/ — 301 the old path.
interface Props { params: Promise<{ slug: string }> }

export default async function ReviewRedirect({ params }: Props) {
  const { slug } = await params
  permanentRedirect(`/online-casinos/recensioner/${slug}/`)
}
