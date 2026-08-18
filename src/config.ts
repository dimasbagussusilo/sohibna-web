// Base URL of the sohibna-api backend (default :8080).
//
// Set via the `VITE_API_BASE_URL` env var so the production build points at
// the deployed backend (https://sohibna-api.cendekita.id) while local dev
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
