import { permanentRedirect } from 'next/navigation'

// Moved to /online-casinos/betalningsmetoder/ — 301 the old path.
export default function LegacyPaymentRedirect() {
  permanentRedirect('/online-casinos/betalningsmetoder/')
}
