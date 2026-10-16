import { permanentRedirect } from 'next/navigation'

// Moved to /online-casinos/speltillverkare/ — 301 the old path.
export default function LegacySoftwareRedirect() {
  permanentRedirect('/online-casinos/speltillverkare/')
}
