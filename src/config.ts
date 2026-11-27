// Base URL of the sohibna-api backend (default :8080).
//
// Set via the `VITE_API_BASE_URL` env var so the production build points at
// the deployed backend (https://sohibna-api.catatanbidan.id) while local dev
// keeps the default. The value is inlined at build time by Vite, so it must
// be present when the bundle is created.
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

// Google OAuth Web SDK client ID (Firebase "Web client" id) — the same value
// the RN app uses for its native Google Sign-In. Empty → the Google button is
// hidden (Google login not configured).
export const GOOGLE_WEB_CLIENT_ID: string =
  import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID ?? ''

// Firebase Web app config (Firebase Console → Project settings → Your apps →
// Web app). Only needed for Google Sign-In on web; empty apiKey → hidden.
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
}

// Play listing URL — set VITE_PLAY_STORE_URL when the listing goes live;
// empty = the web quota card / store badges stay in their "Segera/soon"
// state (no dead links). The web NEVER sells digital goods (Play policy):
// this is a link-out only.
export const PLAY_STORE_URL: string = import.meta.env.VITE_PLAY_STORE_URL ?? ''

// Partner Program figures for the STATIC landing page (sohibna.com/mitra).
// The landing cannot call the API (its CSP is connect-src 'self'), so these
// mirror the server's partner_program row: change them here and redeploy
// when ops changes the program. The app and the dashboard always show the
// live values from /partners/me — only this page is baked at build time.
export const MITRA_DEFAULT_RATE: string = import.meta.env.VITE_MITRA_DEFAULT_RATE ?? '30%'
export const MITRA_HOLD_DAYS: number = Number(import.meta.env.VITE_MITRA_HOLD_DAYS ?? 30)
export const MITRA_PAYOUT_MIN: string = import.meta.env.VITE_MITRA_PAYOUT_MIN ?? 'Rp 50.000'
