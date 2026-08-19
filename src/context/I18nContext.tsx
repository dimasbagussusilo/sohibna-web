import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import storage from '@/lib/storage'
import type { Lang, Translation, TranslationKey } from '@/i18n/types'
import { translations as idTranslations } from '@/i18n/translations/id'
import { translations as enTranslations } from '@/i18n/translations/en'
import { translations as arTranslations } from '@/i18n/translations/ar'

// App-wide UI language. Bahasa Indonesia (`id`) is the default. Arabic (`ar`)
// is the only RTL language. On web, RTL is just the <html dir> attribute —
// unlike the RN app (which restarts the process), switching direction updates
// the live layout instantly, no relaunch. `t(key, vars)` resolves a dotted
// path in the active dictionary and interpolates `{{token}}` placeholders.

const LANG_KEY = 'sohibna:lang'
const DEFAULT_LANG: Lang = 'id'
const DICTS: Record<Lang, Translation> = {
  id: idTranslations,
  en: enTranslations,
  ar: arTranslations,
}

const isRTLFor = (lang: Lang) => lang === 'ar'

// Push direction + language onto <html>. Called at hydration (before first
// paint via the loading gate) and on every language switch.
function applyDocumentLang(lang: Lang): void {
  document.documentElement.dir = isRTLFor(lang) ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
}

type I18nState = {
  lang: Lang
  setLang: (lang: Lang, opts?: { fromSync?: boolean }) => void
  /** Whether the active language lays out right-to-left (Arabic). */
  isRTL: boolean
  /** The active layout direction, for the few inline styles that need it. */
  dir: 'rtl' | 'ltr'
  /** False until the saved language has been read from storage on mount. */
  hydrated: boolean
  /** Resolve a dotted-path string key, interpolating `{{token}}` from `vars`. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
  /** The full active dictionary — for arrays / structured content / label lists. */
  dict: Translation
}

const I18nContext = createContext<I18nState>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  isRTL: false,
  dir: 'ltr',
  hydrated: false,
  t: () => '',
  dict: idTranslations,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG)
  const [hydrated, setHydrated] = useState(false)

  // Read the saved language once on mount; apply dir BEFORE marking hydration,
  // so the first render already has the correct (possibly RTL) layout.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const saved = await storage.getItem(LANG_KEY)
        if (cancelled) return
        const next: Lang =
          saved === 'id' || saved === 'en' || saved === 'ar' ? saved : DEFAULT_LANG
        applyDocumentLang(next)
        setLangState(next)
      } catch {
        applyDocumentLang(DEFAULT_LANG)
      } finally {
        if (!cancelled) setHydrated(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Switch language. The DOM reflows under the new dir immediately — no
  // restart needed (web advantage over the RN app's RNRestart approach).
  // `opts.fromSync` marks an account-driven apply: the value came FROM the
  // server, so the caller skips pushing it back (the Me page's user-initiated
  // path still pushes via setAppSetting).
  const setLang = useCallback((next: Lang, opts?: { fromSync?: boolean }) => {
    setLangState(next)
    applyDocumentLang(next)
    storage.setItem(LANG_KEY, next).catch(() => {})
    void opts
  }, [])

  const isRTL = isRTLFor(lang)
  const dir = isRTL ? 'rtl' : 'ltr'

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const raw = resolvePath(DICTS[lang], key)
      if (!vars || !raw) return raw
      return raw.replace(/\{\{(\w+)\}\}/g, (_, k) =>
        vars[k] !== undefined ? String(vars[k]) : `{{${k}}}`,
      )
    },
    [lang],
  )

  const dict = DICTS[lang]
  const value = useMemo<I18nState>(
    () => ({ lang, setLang, isRTL, dir, hydrated, t, dict }),
    [lang, setLang, isRTL, dir, hydrated, t, dict],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// Walk a dotted path to a string leaf. Returns '' if the path doesn't resolve
// to a string (shouldn't happen for typed keys, but keeps runtime safe).
function resolvePath(dict: Translation, key: string): string {
  const parts = key.split('.')
  let cur: unknown = dict
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = (cur as Record<string, unknown>)[p]
    } else {
      return ''
    }
  }
  return typeof cur === 'string' ? cur : ''
}

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => useContext(I18nContext)
