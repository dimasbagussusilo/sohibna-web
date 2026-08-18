import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import storage from '@/lib/storage'

// App-wide dark mode — toggles the `dark` class on <html> (Tailwind's custom
// dark variant, see index.css) and keeps the OS theme-color in sync.
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

  const setDarkMode = useCallback((on: boolean) => {
    setDarkModeState(on)
    applyDarkMode(on)
    storage.setItem(DARK_KEY, on ? 'true' : 'false').catch(() => {})
  }, [])

  return (
    <AppContext.Provider value={{ loading, toastMsg, toast, darkMode, setDarkMode }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext)
