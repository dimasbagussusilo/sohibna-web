import { useI18n } from '@/context/I18nContext'

// Footer — dark continuation of the last section: brand, soft disclaimer,
// copyright. (Language switching lives in the nav pill.)

export function Footer() {
  const { t, dict } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-night py-10 text-cream/55">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
        <div className="flex items-center gap-2.5">
          <img src="/icons/pwa-192.png" alt="Sohibna" className="h-7 w-7 rounded-lg" />
          <span className="font-display text-sm text-cream">Sohibna</span>
          <span className="text-xs text-cream/40">{dict.landing.footer.tagline}</span>
        </div>

        <p className="max-w-lg text-xs leading-relaxed text-cream/40">
          {dict.landing.footer.disclaimer}
        </p>

        <p className="text-xs text-cream/35">{t('landing.footer.rights', { year })}</p>
      </div>
    </footer>
  )
}
