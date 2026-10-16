import { permanentRedirect } from 'next/navigation'

// Reviews moved to /online-casinos/recensioner/ — 301 the old path.
export default function ReviewListingRedirect() {
  permanentRedirect('/online-casinos/recensioner/')
}
