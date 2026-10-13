import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import storage from '@/lib/storage'
import { useAuth } from '@/context/AuthContext'
import { useQuranData } from '@/context/QuranDataContext'
import type { Appearance } from '@/lib/quran'

// App-wide appearance — fixed light/dark or 'auto' (dark from 18:00 to 06:00,
// device-local, crossed by a minute tick). Resolved darkMode toggles the `dark`
// class on <html> (Tailwind's custom dark variant, see index.css) and keeps the
// OS theme-color in sync.
//
// Sync (0008): the preference also rides the account as the 'app.darkMode'
// reader-setting key (legacy key name; the value is now the 'light'|'dark'|
// 'auto' string — pre-appearance boolean values are mapped on receive, see
// quranSync). Hydration order is device-local first (splash gate unchanged),
// then the account's value — when set — is applied and mirrored back to the
// local key. null = the account has no value → local wins.
const APPEARANCE_KEY = 'sohibna:appearance'
// Pre-appearance boolean key ('true'/'false') — read once for migration, then
// removed. Absence (fresh install / never toggled) means the 'auto' default.
const LEGACY_DARK_KEY = 'sohibna:dark_mode'

const isAppearance = (v: string | null): v is Appearance =>
  v === 'light' || v === 'dark' || v === 'auto'

// 'auto' resolves dark between 18:00 and 06:00, device-local time.
function isNighttime(): boolean {
  const h = new Date().getHours()
  return h >= 18 || h < 6
}

// One themed confirmation dialog for the whole app (replaces the system
// window.confirm default). askConfirm resolves true on confirm, false on
// cancel / backdrop-dismiss / Escape.
export type ConfirmRequest = {
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean // confirm button renders red
  hideCancel?: boolean // informational variant: single dismiss button
}
type PendingConfirm = ConfirmRequest & { resolve: (ok: boolean) => void }

type AppState = {
  loading: boolean
  toastMsg: string
  toast: (msg: string) => void
  // Tri-state preference ('auto' default) + the resolved boolean the dark
  // variant / darkMode consumers key off.
  appearance: Appearance
  setAppearance: (a: Appearance) => void
  darkMode: boolean
  // Flip to the opposite FIXED mode (Home quick-toggle + 'd' shortcut) —
  // toggling 'auto' is meaningless, so it resolves to light/dark.
  toggleDarkMode: () => void
  confirmReq: PendingConfirm | null
  askConfirm: (req: ConfirmRequest) => Promise<boolean>
  settleConfirm: (ok: boolean) => void
}

const AppContext = createContext<AppState>({
  loading: true,
  toastMsg: '',
  toast: () => {},
  appearance: 'auto',
  setAppearance: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
  confirmReq: null,
  askConfirm: () => Promise.resolve(false),
  settleConfirm: () => {},
})

// Push the dark class + theme-color onto the document.
function applyDarkMode(on: boolean): void {
  document.documentElement.classList.toggle('dark', on)
  const meta = document.querySelector('meta[name="theme-color"]:not([media])')
  if (meta) meta.setAttribute('content', on ? '#0D1F17' : '#FDFBF7')
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { ud, loaded: udLoaded, setAppSetting } = useQuranData()
  const [loading, setLoading] = useState(true)
  const [toastMsg, setToastMsg] = useState('')
  const [appearance, setAppearanceState] = useState<Appearance>('auto')
  // Time-of-day dark for 'auto'. Initialized lazily so the first paint is right
  // even before any effect runs.
  const [autoDark, setAutoDark] = useState(isNighttime)
  // Every darkMode consumer (dark variant, TabBar, sheets) keys off this
  // resolved boolean — the tri-state never leaks past this context.
  const darkMode = appearance === 'auto' ? autoDark : appearance === 'dark'

  // Push the resolved scheme onto the document. Skipped while loading so the
  // class lands once with the hydrated value (no auto-at-night → saved-light
  // flash on cold start).
  useEffect(() => {
    if (!loading) applyDarkMode(darkMode)
  }, [darkMode, loading])

  // Keep 'auto' honest across the 18:00/06:00 boundary: a minute tick
  // re-resolves while the tab is open (React bails out on unchanged values,
  // so idle minutes are free). Only active in 'auto'.
  useEffect(() => {
    if (appearance !== 'auto') return
    let cancelled = false
    ;(async () => {
      await Promise.resolve() // let the commit land before mutating state
      if (!cancelled) setAutoDark(isNighttime())
    })()
    const id = setInterval(() => setAutoDark(isNighttime()), 60_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [appearance])

  // Hydrate from storage once on mount. The `loading` flag keeps the splash up
  // until the preference has been read, so the first paint uses the right
  // scheme. Falls back to a one-time migration from the pre-appearance boolean
  // key (explicit old choice → same fixed mode).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        let saved = await storage.getItem(APPEARANCE_KEY)
        if (!isAppearance(saved)) {
          const legacy = await storage.getItem(LEGACY_DARK_KEY)
          if (legacy === 'true') saved = 'dark'
          else if (legacy === 'false') saved = 'light'
          if (isAppearance(saved)) {
            await storage.setItem(APPEARANCE_KEY, saved)
            await storage.removeItem(LEGACY_DARK_KEY)
          }
        }
        if (cancelled) return
        if (isAppearance(saved)) setAppearanceState(saved)
      } catch {
        /* Ignore read errors — fall back to defaults. */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }, [])

  // Global confirm dialog. The pending request lives in a ref so a second
  // askConfirm can dismiss (resolve false) a still-open one without side
  // effects inside a state updater.
  const confirmRef = useRef<PendingConfirm | null>(null)
  const [confirmReq, setConfirmReq] = useState<PendingConfirm | null>(null)
  const askConfirm = useCallback((req: ConfirmRequest) => {
    return new Promise<boolean>((resolve) => {
      confirmRef.current?.resolve(false)
      const pending: PendingConfirm = { ...req, resolve }
      confirmRef.current = pending
      setConfirmReq(pending)
    })
  }, [])
  const settleConfirm = useCallback((ok: boolean) => {
    confirmRef.current?.resolve(ok)
    confirmRef.current = null
    setConfirmReq(null)
  }, [])

  // Apply the account's appearance pref once the synced state lands. Async
  // IIFE so no setState runs synchronously inside the effect; the
  // remote !== local guard makes it idempotent (no loop with the write-back).
  const remoteAppearance = user && udLoaded ? ud.appSettings.appearance : null
  useEffect(() => {
    if (remoteAppearance == null || remoteAppearance === appearance) return
    let cancelled = false
    ;(async () => {
      await Promise.resolve()
      if (cancelled) return
      setAppearanceState(remoteAppearance)
      storage.setItem(APPEARANCE_KEY, remoteAppearance).catch(() => {})
    })()
    return () => {
      cancelled = true
    }
  }, [remoteAppearance, appearance])

  // User edit: local write always (instant, offline-safe) + account push when
  // authed (guests stay local). The document class is applied by the
  // darkMode effect above.
  const setAppearance = useCallback(
    (a: Appearance) => {
      setAppearanceState(a)
      storage.setItem(APPEARANCE_KEY, a).catch(() => {})
      if (user) setAppSetting('appearance', a)
    },
    [user, setAppSetting],
  )

  const toggleDarkMode = useCallback(() => {
    setAppearance(darkMode ? 'light' : 'dark')
  }, [darkMode, setAppearance])

  return (
    <AppContext.Provider
      value={{ loading, toastMsg, toast, appearance, setAppearance, darkMode, toggleDarkMode, confirmReq, askConfirm, settleConfirm }}
    >
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext)
