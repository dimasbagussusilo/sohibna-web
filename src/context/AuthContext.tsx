import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { login as apiLogin, register as apiRegister, revokeSession, type AuthResponse, type User } from '@/api'
import { consumeMitraRef } from '@/lib/mitraRef'
import { signInWithGoogleWeb, signOutGoogleWeb } from '@/lib/googleAuthWeb'
import { clearReflectionLocalData } from '@/reflection/history'
import { clearRulingsLocalData } from '@/rulings/history'
import {
  clearSession,
  getAccessToken,
  getSession,
  setSession as setSingletonSession,
  subscribe,
  type Session,
} from '@/lib/authSession'

// localStorage keys (same strings as the RN app's SecureStore keys).
const ACCESS_TOKEN_KEY = 'sohibna.auth_token'
const REFRESH_TOKEN_KEY = 'sohibna.auth_refresh'
const TOKEN_EXP_KEY = 'sohibna.auth_exp' // access-token expiry, epoch ms
const USER_KEY = 'sohibna.auth_user'

// Account-attached conversations must not outlive the session on this device.
// The chat caches (AI chats + daily reflections) are keyed by entry id, not by
// account: without this the next account — or a guest — could read the previous
// account's threads, continuing one would re-save it into THEIR account, and
// local reflections are backfilled into whichever account logs in next. Only
// these two stores are purged; device settings, the per-uid sync caches/queues
// and guest reading progress are untouched.
const purgeLocalChats = () => {
  clearRulingsLocalData().catch(() => {})
  clearReflectionLocalData().catch(() => {})
}

type AuthState = {
  user: User | null
  // Non-null when authed. Kept (not just a boolean) so useQuranData can keep its
  // existing tokenRef-based authed/guest gating unchanged.
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  // 0041 verify-then-create: register only STAGES the signup (no session —
  // the account is created by the code page via applyAuthResponse).
  register: (name: string, email: string, password: string, referralCode?: string) => Promise<void>
  // applyAuthResponse adopts a tokenResponse (verify-email's 200) as the live
  // session — the user leaves the code page signed in.
  applyAuthResponse: (r: AuthResponse) => Promise<void>
  loginGoogle: (referralCode?: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (u: User) => void
}

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  applyAuthResponse: async () => {},
  loginGoogle: async () => {},
  logout: async () => {},
  updateUser: () => {},
})

// AuthProvider holds the PASETO session (access + refresh token, user) in
// localStorage (web has no keychain exposed to JS — see lib/storage.ts for the
// documented tradeoff).
//
// "Login once, never auto-logout": the access token is short-lived, but a
// long-lived refresh token lets the app silently renew. The session singleton
// (src/lib/authSession) owns proactive + reactive refresh; this provider seeds
// it from storage on load (refreshing if the access token is already stale)
// and mirrors its changes back to storage. The session only dies when the user
// explicitly logs out OR the refresh token itself expires (~180d inactivity).
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // applySession pushes a session into both React state and storage.
  const applySession = useCallback(async (s: Session | null, u: User | null) => {
    if (s) {
      setToken(s.accessToken)
      setUser(u)
      localStorage.setItem(ACCESS_TOKEN_KEY, s.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, s.refreshToken)
      localStorage.setItem(TOKEN_EXP_KEY, String(s.expiresAt))
      localStorage.setItem(USER_KEY, JSON.stringify(u))
    } else {
      setToken(null)
      setUser(null)
      // Session over (logout, dead refresh token, AuthError) — the account's
      // cached conversations go with it.
      purgeLocalChats()
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(TOKEN_EXP_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }, [])

  // Keep React state + storage in sync with the singleton. Transparent
  // refreshes update the singleton; we persist the new tokens here. The user
  // object isn't part of the session, so on refresh-only updates we preserve
  // the current user.
  const userRef = useRef<User | null>(null)
  useEffect(() => {
    userRef.current = user
  }, [user])
  useEffect(() => {
    return subscribe((s) => {
      void applySession(s, s ? userRef.current : null)
    })
  }, [applySession])

  const onAuthed = useCallback(
    async (accessToken: string, refreshToken: string, exp: string, u: User) => {
      const session: Session = {
        accessToken,
        refreshToken,
        expiresAt: new Date(exp).getTime(),
        userId: u.id,
      }
      // A direct account switch (A → B with no logout in between) never passes
      // through a null session — purge here too.
      if (userRef.current && userRef.current.id !== u.id) purgeLocalChats()
      userRef.current = u
      setSingletonSession(session) // → subscription persists it + sets state
    },
    [],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const r = await apiLogin(email, password)
      await onAuthed(r.access_token, r.refresh_token, r.expires_at, r.user)
    },
    [onAuthed],
  )

  const register = useCallback(
    async (name: string, email: string, password: string, referralCode?: string) => {
      // Program Mitra first-touch (0033): an explicit code wins, else a code
      // captured from a ?ref= landing survives until the signup that consumes
      // it. Server-side the field is optional and silently ignored when stale.
      // 0041 verify-then-create: 202 {ok} — no session comes back; the code
      // page creates the account (and mints the session) via verify-email.
      const code = referralCode ?? consumeMitraRef() ?? undefined
      await apiRegister(name, email, password, code)
    },
    [],
  )

  // applyAuthResponse adopts a tokenResponse (verify-email's 200) as the live
  // session — the user leaves the code page signed in (0041).
  const applyAuthResponse = useCallback(
    async (r: AuthResponse) => {
      await onAuthed(r.access_token, r.refresh_token, r.expires_at, r.user)
    },
    [onAuthed],
  )

  // loginGoogle runs the Firebase Web popup flow and exchanges the resulting
  // ID token for a Sohibna session (same session/refresh machinery as login).
  // A user-initiated cancel is swallowed (resolves without authing); other
  // errors propagate to the caller (the button handler) for display.
  // The mitra referral code only ever applies to a brand-new account
  // (enforced server-side on the create branch).
  const loginGoogle = useCallback(async (referralCode?: string) => {
    const r = await signInWithGoogleWeb(referralCode ?? consumeMitraRef() ?? undefined)
    await onAuthed(r.access_token, r.refresh_token, r.expires_at, r.user)
  }, [onAuthed])

  const logout = useCallback(async () => {
    const s = getSession()
    if (s) await revokeSession(s.refreshToken) // best-effort server-side revoke
    // The revoke is a network round trip: if ANOTHER account signed in while it
    // was in flight, that session is not ours to clear (a same-account token
    // refresh replaces the object, hence the userId compare).
    if ((getSession()?.userId ?? null) === (s?.userId ?? null)) {
      clearSession() // → subscription clears state + storage
    }
    void signOutGoogleWeb() // best-effort: clear Google sign-in state
  }, [])

  // updateUser swaps the cached profile in-place (e.g. after email
  // verification from a /verify-email tab while the Me page is mounted).
  const updateUser = useCallback((u: User) => {
    userRef.current = u
    setUser(u)
    localStorage.setItem(USER_KEY, JSON.stringify(u))
  }, [])

  // Hydrate once on mount. Seed the singleton from storage, then ask it for a
  // valid access token — if the stored one is already stale, it transparently
  // refreshes. If the refresh token is dead (long inactivity), the session is
  // cleared and the user sees the logged-out state. This is the ONLY path that
  // auto-logs-out, by design.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const access = localStorage.getItem(ACCESS_TOKEN_KEY)
        const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
        const expStr = localStorage.getItem(TOKEN_EXP_KEY)
        const userStr = localStorage.getItem(USER_KEY)
        if (access && refresh && expStr && userStr) {
          const u = JSON.parse(userStr) as User
          userRef.current = u
          setSingletonSession({
            accessToken: access,
            refreshToken: refresh,
            expiresAt: Number(expStr),
            userId: u.id,
          })
          try {
            // Force-evaluate: refreshes now if the access token is near/past expiry.
            const fresh = await getAccessToken()
            if (!cancelled) {
              setToken(fresh)
              setUser(u)
            }
          } catch {
            // Refresh token dead/revoked → session over.
            if (!cancelled) {
              clearSession()
            }
          }
        }
      } catch {
        /* ignore — start logged out */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Memoized value — all functions are stable useCallbacks, so consumers only
  // re-render when the session state (user/token/loading) actually changes.
  const value = useMemo(
    () => ({ user, token, loading, login, register, applyAuthResponse, loginGoogle, logout, updateUser }),
    [user, token, loading, login, register, applyAuthResponse, loginGoogle, logout, updateUser],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
