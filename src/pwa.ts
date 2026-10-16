// Manual service-worker registration, gated to the app origin. Importing
// `virtual:pwa-register` here is what switches vite-plugin-pwa's default
// 'auto' injectRegister off — no <script src="/registerSW.js"> tag is injected
// into index.html, so the LANDING origin (same image, nginx serves it the SPA
// shell at /, /en, /ar) never registers a worker or becomes installable.
import { registerSW } from 'virtual:pwa-register'
import { isLandingOrigin } from './origins'

export function registerServiceWorker(): void {
  if (isLandingOrigin()) return
  // registerType: 'autoUpdate' in vite.config.ts keeps current behavior
  // (register on load, auto-update). No-op in dev (no devOptions configured).
  registerSW({ immediate: true })
}
