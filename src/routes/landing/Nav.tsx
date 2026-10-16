import { useI18n } from '@/context/I18nContext'
import type { Lang } from '@/i18n/types'
import { appUrl } from '@/origins'

// Sticky top nav: brand, in-page anchors, language switcher (real URL paths
// for SEO), and the primary cross-origin CTA.

const LANGS: { code: Lang; label: string }[] = [
  { code: 'id', label: 'ID' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
]

const LANG_PATH: Record<Lang, string> = { id: '/', en: '/en', ar: '/ar' }

export function Nav() {
  const { t, lang } = useI18n()

  return (
    <header className="sticky top-0 z-30 border-b border-ink/5 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <a href={LANG_PATH[lang]} className="flex items-center gap-2.5">
          <img src="/icons/pwa-192.png" alt="Sohibna" className="h-9 w-9 rounded-xl" />
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">Sohibna</span>
            <span className="quran-rtl text-[11px] text-sage">صحبنا</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-ink/70 md:flex">
          <a href="#fitur" className="transition-colors hover:text-ink">
            {t('landing.nav.features')}
          </a>
          <a href="#cara-pasang" className="transition-colors hover:text-ink">
            {t('landing.nav.install')}
          </a>
          <a href="#faq" className="transition-colors hover:text-ink">
            {t('landing.nav.faq')}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-ink/10 p-0.5 text-xs font-semibold">
            {LANGS.map(({ code, label }) => (
              <a
                key={code}
                href={LANG_PATH[code]}
                hrefLang={code}
                aria-current={lang === code ? 'true' : undefined}
                className={
                  lang === code
                    ? 'rounded-full bg-night px-2.5 py-1 text-cream'
                    : 'rounded-full px-2.5 py-1 text-ink/60 transition-colors hover:text-ink'
                }
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href={appUrl('/home')}
            className="hidden rounded-full bg-night px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-[#163024] sm:block"
          >
            {t('landing.nav.openApp')}
          </a>
        </div>
      </div>
    </header>
  )
}
