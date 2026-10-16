import { useI18n } from '@/context/I18nContext'
import type { Lang } from '@/i18n/types'
import { appUrl } from '@/origins'

// Floating glass pill nav — dark glass works over both the dark hero and the
// cream sections below. Brand, in-page anchors, language switcher (real URL
// paths for SEO), and the primary cross-origin CTA.

const LANGS: { code: Lang; label: string }[] = [
  { code: 'id', label: 'ID' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
]

const LANG_PATH: Record<Lang, string> = { id: '/', en: '/en', ar: '/ar' }

export function Nav() {
  const { t, lang } = useI18n()

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-4 md:px-4">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-2 rounded-full border border-white/10 bg-night/70 px-3 text-cream shadow-lg shadow-black/25 backdrop-blur-xl ps-4">
        <a href={LANG_PATH[lang]} className="flex shrink-0 items-center gap-2.5">
          <img src="/icons/pwa-192.png" alt="Sohibna" className="h-8 w-8 rounded-lg" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm tracking-tight">Sohibna</span>
            <span className="quran-rtl text-[10px] text-[#8FBC8F]">صحبنا</span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 text-sm text-cream/70 lg:flex">
          <a href="#fitur" className="transition-colors hover:text-cream">
            {t('landing.nav.features')}
          </a>
          <a href="#unduh" className="transition-colors hover:text-cream">
            {t('landing.nav.download')}
          </a>
          <a href="#dukung" className="transition-colors hover:text-cream">
            {t('landing.nav.support')}
          </a>
          <a href="#faq" className="transition-colors hover:text-cream">
            {t('landing.nav.faq')}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-white/10 p-0.5 text-[11px] font-semibold">
            {LANGS.map(({ code, label }) => (
              <a
                key={code}
                href={LANG_PATH[code]}
                hrefLang={code}
                aria-current={lang === code ? 'true' : undefined}
                className={
                  lang === code
                    ? 'rounded-full bg-cream px-2.5 py-1 text-night'
                    : 'rounded-full px-2.5 py-1 text-cream/55 transition-colors hover:text-cream'
                }
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href={appUrl('/home')}
            className="hidden rounded-full bg-cream px-4 py-2 text-sm font-bold text-night transition-colors hover:bg-[#8FBC8F] sm:block"
          >
            {t('landing.nav.tryNow')}
          </a>
        </div>
      </div>
    </header>
  )
}
