import { useEffect, useMemo, type ReactNode } from 'react'
import { I18nContext, DICTS, useI18n } from '@/context/I18nContext'
import { interpolate, resolvePath } from '@/i18n/translate'
import type { Lang, TranslationKey } from '@/i18n/types'

// Route-scoped language override for the landing. The landing renders a fixed
// language per URL path (/, /en, /ar) — it does NOT call setLang, so the
// persisted `sohibna:lang` preference is never touched (they can even share a
// localhost origin with the app tree in dev). <html lang/dir> is applied
// while mounted and restored on unmount.

export function LandingI18n({ lang, children }: { lang: Lang; children: ReactNode }) {
  const parent = useI18n()

  const value = useMemo(() => {
    const dict = DICTS[lang]
    const isRTL = lang === 'ar'
    return {
      ...parent,
      lang,
      dict,
      isRTL,
      dir: (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
      t: (key: TranslationKey, vars?: Record<string, string | number>) =>
        interpolate(resolvePath(dict, key), vars),
    }
  }, [parent, lang])

  useEffect(() => {
    const prev = {
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
    }
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    return () => {
      document.documentElement.lang = prev.lang
      document.documentElement.dir = prev.dir
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
