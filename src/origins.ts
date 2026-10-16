// Landing (apex) vs app origin — split-origin deployment like the catatanbidan
// site: the marketing landing lives on the apex domain (sohibna.com), the PWA
// app on its own origin (app.sohibna.com). Default assumption is the APP
// origin, so localhost dev (and any unforeseen host) behaves exactly like the
// pre-landing app.
export const APP_ORIGIN: string =
  import.meta.env.VITE_APP_ORIGIN ?? 'https://app.sohibna.com'
export const LANDING_ORIGIN: string =
  import.meta.env.VITE_LANDING_ORIGIN ?? 'https://sohibna.com'

// Hostnames that serve the landing tree. Overridable for dev, where a second
// Vite server inlines its own env (see DEPLOY.md): with
// VITE_LANDING_HOSTS=localhost, `npm run dev -- --port 5174` renders the
// landing while the default :5173 server stays the app.
const LANDING_HOSTS: readonly string[] = (
  import.meta.env.VITE_LANDING_HOSTS ?? 'sohibna.com,www.sohibna.com'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// Origin is fixed for the lifetime of the page (the SPA never migrates
// origins mid-session), so a one-time check at render is correct.
export function isLandingOrigin(hostname: string = window.location.hostname): boolean {
  return LANDING_HOSTS.includes(hostname)
}

// Hostname-only form of the app origin, for user-facing copy (the
// landing.install.* strings interpolate it as {{appOrigin}}).
export function appOriginHost(): string {
  try {
    return new URL(APP_ORIGIN).hostname
  } catch {
    return APP_ORIGIN
  }
}

// Cross-origin "Buka Aplikasi" target on the app origin.
export function appUrl(path: string): string {
  return `${APP_ORIGIN}${path}`
}
