import { Globe, Apple, Play } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

// Download — dark band: three compact "coming soon" cards. The app origin
// (app.sohibna.com) is TEMPORARILY deactivated (nginx 302s it here), so the
// web app card carries the same "Segera" badge as the stores instead of
// being the install-it-today card. When the app origin returns: restore the
// tall PWA card + per-platform install steps from git history (keys
// androidS1..desktopP stay in the dictionaries) and re-point the Hero/Nav
// CTAs back at appUrl('/home').

export function Download() {
  const { t } = useI18n()

  return (
    <section
      id="unduh"
      className="relative scroll-mt-24 overflow-hidden bg-night py-16 text-cream md:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 start-1/3 h-80 w-80 rounded-full bg-sage/15 blur-[100px]"
      />
      <div aria-hidden className="pattern-islamic absolute inset-0 opacity-[0.05]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <p className="glass inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#8FBC8F]">
          {t('landing.download.eyebrow')}
        </p>
        <h2 className="font-display mt-4 text-3xl tracking-tight md:text-4xl">
          {t('landing.download.title')}
        </h2>

        {/* Three equal "coming soon" cards — the web app is in the same
            state as the stores while its origin is deactivated. */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Google Play — coming soon */}
          <div className="flex items-center gap-4 rounded-3xl border border-white/8 bg-white/[0.04] p-5">
            <Play size={28} className="shrink-0 text-cream/85" />
            <div className="min-w-0">
              <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream/55">
                {t('landing.download.soon')}
              </span>
              <h3 className="mt-1.5 text-base font-bold">{t('landing.download.playT')}</h3>
              <p className="mt-1 text-sm leading-relaxed text-cream/55">
                {t('landing.download.playD')}
              </p>
            </div>
          </div>

          {/* App Store — coming soon */}
          <div className="flex items-center gap-4 rounded-3xl border border-white/8 bg-white/[0.04] p-5">
            <Apple size={28} className="shrink-0 text-cream/85" />
            <div className="min-w-0">
              <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream/55">
                {t('landing.download.soon')}
              </span>
              <h3 className="mt-1.5 text-base font-bold">{t('landing.download.iosT')}</h3>
              <p className="mt-1 text-sm leading-relaxed text-cream/55">
                {t('landing.download.iosD')}
              </p>
            </div>
          </div>

          {/* Web app — coming soon while the app origin is deactivated */}
          <div className="flex items-center gap-4 rounded-3xl border border-white/8 bg-white/[0.04] p-5">
            <Globe size={28} className="shrink-0 text-cream/85" />
            <div className="min-w-0">
              <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream/55">
                {t('landing.download.soon')}
              </span>
              <h3 className="mt-1.5 text-base font-bold">{t('landing.download.pwaT')}</h3>
              <p className="mt-1 text-sm leading-relaxed text-cream/55">
                {t('landing.download.pwaD')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
