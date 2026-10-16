import { useI18n } from '@/context/I18nContext'

// Footer: brand, language links (real URLs, matching the nav switcher),
// a soft non-fiqh disclaimer, and the interpolated copyright.

export function Footer() {
  const { t, dict } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink/8 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center">
        <div className="flex items-center gap-2.5">
          <img src="/icons/pwa-192.png" alt="Sohibna" className="h-7 w-7 rounded-lg" />
          <span className="text-sm font-bold">Sohibna</span>
          <span className="text-xs text-ink/40">{dict.landing.footer.tagline}</span>
        </div>

        <nav className="flex items-center gap-4 text-xs text-ink/55">
          <a href="/" hrefLang="id" className="hover:text-ink">
            Bahasa Indonesia
          </a>
          <a href="/en" hrefLang="en" className="hover:text-ink">
            English
          </a>
          <a href="/ar" hrefLang="ar" className="hover:text-ink">
            العربية
          </a>
        </nav>

        <p className="max-w-lg text-xs leading-relaxed text-ink/45">
          {dict.landing.footer.disclaimer}
        </p>

        <p className="text-xs text-ink/40">{t('landing.footer.rights', { year })}</p>
      </div>
    </footer>
  )
}
