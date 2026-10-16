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
import { isLandingOrigin } from '@/origins'
import type { Lang, Translation, TranslationKey } from '@/i18n/types'
import { resolvePath, interpolate } from '@/i18n/translate'
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
// Exported for the landing's route-scoped language override (LandingI18n),
// which translates with a per-route dictionary without persisting a choice.
// eslint-disable-next-line react-refresh/only-export-components
export const DICTS: Record<Lang, Translation> = {
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

// Exported raw for the landing's route-scoped override (LandingI18n mounts
// its own provider value over this context).
// eslint-disable-next-line react-refresh/only-export-components
export const I18nContext = createContext<I18nState>({
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
  const [hydrated, setHydrate] = useState(false)
  // On the landing origin this provider is just a shell: the landing's
  // language comes from the URL path via LandingI18n, and reading the saved
  // preference here would race LandingI18n's <html> apply and flip it back.
  const landing = isLandingOrigin()

  // Read the saved language once on mount; apply dir BEFORE marking hydration,
  // so the first render already has the correct (possibly RTL) layout.
  useEffect(() => {
    if (landing) {
      setHydrate(true)
      return
    }
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
        if (!cancelled) setHydrate(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [landing])

  // Switch language. The DOM reflows under the new dir immediately — no
  // restart needed (web advantage over the RN app's RNRestart approach).
  // `opts.fromSync` marks an account-driven apply: the value came FROM the
  // server, so the caller skips pushing it back (the Me page's user-initiated
  // path still pushes via setAppSetting).
  const setLang = useCallback(
    (next: Lang, opts?: { fromSync?: boolean }) => {
      setLangState(next)
      if (!landing) {
        applyDocumentLang(next)
        storage.setItem(LANG_KEY, next).catch(() => {})
      }
      void opts
    },
    [landing],
  )

  const isRTL = isRTLFor(lang)
  const dir = isRTL ? 'rtl' : 'ltr'

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      interpolate(resolvePath(DICTS[lang], key), vars),
    [lang],
  )

  const dict = DICTS[lang]
  const value = useMemo<I18nState>(
    () => ({ lang, setLang, isRTL, dir, hydrated, t, dict }),
    [lang, setLang, isRTL, dir, hydrated, t, dict],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// Walk a dotted path + interpolate — now shared in src/i18n/translate.ts
// (also used by the landing's route-scoped override).

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => useContext(I18nContext)
