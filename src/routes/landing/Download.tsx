import { Smartphone, Share, MonitorSmartphone, Globe, Apple, Play } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { appOriginHost } from '@/origins'

// Download — dark band: the two native stores ("coming soon" until their
// listings are live) as compact cards beside the PWA card, which is the way
// to install TODAY. When a store ships: swap its icon block for the official
// badge and an <a>.

export function Download() {
  const { t } = useI18n()
  const vars = { appOrigin: appOriginHost() }

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

        {/* Two compact store cards (left) next to the tall PWA card (right);
            the pair centers vertically so no card stretches with dead space. */}
        <div className="mt-10 grid items-center gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="grid content-center gap-4 sm:grid-cols-2 lg:grid-cols-1">
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
          </div>

          {/* PWA — available now, the highlighted card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#8FBC8F]/40 bg-gradient-to-b from-[#163024] to-[#122A1F] p-7 shadow-lg shadow-[#8FBC8F]/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-lg font-bold">
                <Globe size={20} className="text-[#8FBC8F]" />
                {t('landing.download.pwaT')}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-[#8FBC8F]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#8FBC8F]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8FBC8F]" />
                {t('landing.download.availableNow')}
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-cream/60">
              {t('landing.download.pwaD')}
            </p>
            <ol className="mt-5 space-y-3 text-sm leading-relaxed text-cream/75">
              <li className="flex gap-3 rounded-2xl bg-white/[0.04] p-3">
                <Smartphone size={16} className="mt-0.5 shrink-0 text-[#8FBC8F]" />
                <span>
                  <b>{t('landing.download.androidT')}:</b> {t('landing.download.androidS1', vars)}{' '}
                  {t('landing.download.androidS2')} {t('landing.download.androidS3')}
                </span>
              </li>
              <li className="flex gap-3 rounded-2xl bg-white/[0.04] p-3">
                <Share size={16} className="mt-0.5 shrink-0 text-[#8FBC8F]" />
                <span>
                  <b>{t('landing.download.iosStepsT')}:</b> {t('landing.download.iosS1', vars)}{' '}
                  {t('landing.download.iosS2')} {t('landing.download.iosS3')}
                </span>
              </li>
              <li className="flex gap-3 rounded-2xl bg-white/[0.04] p-3">
                <MonitorSmartphone size={16} className="mt-0.5 shrink-0 text-[#8FBC8F]" />
                <span>
                  <b>{t('landing.download.desktopT')}:</b> {t('landing.download.desktopP')}
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
