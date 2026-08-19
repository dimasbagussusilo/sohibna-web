import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import storage from '@/lib/storage'
import { useAuth } from '@/context/AuthContext'
import { useQuranData } from '@/hooks/useQuranData'

// App-wide dark mode — toggles the `dark` class on <html> (Tailwind's custom
// dark variant, see index.css) and keeps the OS theme-color in sync.
//
// Sync (0008): the preference also rides the account as the 'app.darkMode'
// reader-setting key. Hydration order is device-local first (splash gate
// unchanged), then the account's value — when set — is applied and mirrored
// back to the local key. null = the account has no value → local wins.
const DARK_KEY = 'sohibna:dark_mode'

type AppState = {
  loading: boolean
  toastMsg: string
  toast: (msg: string) => void
  darkMode: boolean
  setDarkMode: (on: boolean) => void
}

const AppContext = createContext<AppState>({
  loading: true,
  toastMsg: '',
  toast: () => {},
  darkMode: false,
  setDarkMode: () => {},
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
  const [darkMode, setDarkModeState] = useState(false)

  // Hydrate from storage once on mount. The `loading` flag keeps the splash up
  // until dark mode has been read, so the first paint uses the right scheme.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const savedDark = await storage.getItem(DARK_KEY)
        if (cancelled) return
        const on = savedDark === 'true'
        setDarkModeState(on)
        applyDarkMode(on)
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

  // Apply the account's dark-mode pref once the synced state lands. Async
  // IIFE so no setState runs synchronously inside the effect; the
  // remote !== local guard makes it idempotent (no loop with the write-back).
  const remoteDark = user && udLoaded ? ud.appSettings.darkMode : null
  useEffect(() => {
    if (remoteDark == null || remoteDark === darkMode) return
    let cancelled = false
    ;(async () => {
      await Promise.resolve()
      if (cancelled) return
      setDarkModeState(remoteDark)
      applyDarkMode(remoteDark)
      storage.setItem(DARK_KEY, String(remoteDark)).catch(() => {})
    })()
    return () => {
      cancelled = true
    }
  }, [remoteDark, darkMode])

  const setDarkMode = useCallback(
    (on: boolean) => {
      setDarkModeState(on)
      applyDarkMode(on)
      storage.setItem(DARK_KEY, on ? 'true' : 'false').catch(() => {})
      // User edit on this device → attach to the account (guests stay local).
      if (user) setAppSetting('darkMode', on)
    },
    [user, setAppSetting],
  )

  return (
    <AppContext.Provider value={{ loading, toastMsg, toast, darkMode, setDarkMode }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext)
