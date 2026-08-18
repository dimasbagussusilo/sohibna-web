// Google Sign-In on web: Firebase JS SDK popup → ID token → POST /auth/google.
// The firebase package is imported lazily INSIDE these functions so the ~150KB
// SDK stays out of the initial bundle (only users who tap Google pay for it).
import { loginWithGoogle, type AuthResponse } from '@/api'
import { FIREBASE_CONFIG } from '@/config'

let authPromise: Promise<import('firebase/auth').Auth> | null = null

// Whether Google login is configured for this build.
export function googleConfigured(): boolean {
  return Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.appId && FIREBASE_CONFIG.authDomain)
}

async function getAuth(): Promise<import('firebase/auth').Auth> {
  if (!authPromise) {
    authPromise = (async () => {
      const { initializeApp, getApps, getApp } = await import('firebase/app')
      const { getAuth } = await import('firebase/auth')
      const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG)
      return getAuth(app)
    })()
  }
  return authPromise
}

// Run the popup sign-in flow and exchange the ID token for a Sohibna session.
// A user-initiated cancel (popup closed) resolves to null — callers treat that
// as a silent no-op. Other errors propagate for display.
export async function signInWithGoogleWeb(): Promise<AuthResponse> {
  if (!googleConfigured()) throw new Error('google-not-configured')
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
  const auth = await getAuth()
  const credential = await signInWithPopup(auth, new GoogleAuthProvider()).catch(
    (e: { code?: string }) => {
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
        return null
      }
      throw e
    },
  )
  if (!credential) throw new Error('cancelled')
  const idToken = await credential.user.getIdToken()
  return loginWithGoogle(idToken)
}

// Best-effort sign-out of the Firebase session (local state only).
export async function signOutGoogleWeb(): Promise<void> {
  if (!googleConfigured()) return
  try {
    const { signOut } = await import('firebase/auth')
    const auth = await getAuth()
    await signOut(auth)
  } catch {
    /* ignore */
  }
}
