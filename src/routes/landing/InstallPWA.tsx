import { Smartphone, Share, MonitorSmartphone } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { appOriginHost } from '@/origins'

// Per-platform add-to-home-screen instructions. The {{appOrigin}} token in
// the copy is interpolated with the app origin's hostname so translations
// stay in sync with the deployed domain.

export function InstallPWA() {
  const { t } = useI18n()
  const host = appOriginHost()
  const vars = { appOrigin: host }

  return (
    <section id="cara-pasang" className="scroll-mt-20 bg-white py-14 md:py-18">
      <div className="mx-auto max-w-5xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4d6b4d]">
          {t('landing.install.eyebrow')}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          {t('landing.install.title')}
        </h2>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-ink/8 bg-cream p-6">
            <div className="flex items-center gap-2.5">
              <Smartphone size={18} className="text-[#4d6b4d]" />
              <h3 className="text-base font-semibold">{t('landing.install.androidT')}</h3>
            </div>
            <ol className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink/70">
              <li className="flex gap-2.5">
                <span className="font-semibold text-ink/40">1.</span>
                {t('landing.install.androidS1', vars)}
              </li>
              <li className="flex gap-2.5">
                <span className="font-semibold text-ink/40">2.</span>
                {t('landing.install.androidS2', vars)}
              </li>
              <li className="flex gap-2.5">
                <span className="font-semibold text-ink/40">3.</span>
                {t('landing.install.androidS3', vars)}
              </li>
            </ol>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-cream p-6">
            <div className="flex items-center gap-2.5">
              <Share size={18} className="text-[#4d6b4d]" />
              <h3 className="text-base font-semibold">{t('landing.install.iosT')}</h3>
            </div>
            <ol className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink/70">
              <li className="flex gap-2.5">
                <span className="font-semibold text-ink/40">1.</span>
                {t('landing.install.iosS1', vars)}
              </li>
              <li className="flex gap-2.5">
                <span className="font-semibold text-ink/40">2.</span>
                {t('landing.install.iosS2', vars)}
              </li>
              <li className="flex gap-2.5">
                <span className="font-semibold text-ink/40">3.</span>
                {t('landing.install.iosS3', vars)}
              </li>
            </ol>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-cream p-6">
            <div className="flex items-center gap-2.5">
              <MonitorSmartphone size={18} className="text-[#4d6b4d]" />
              <h3 className="text-base font-semibold">{t('landing.install.desktopT')}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              {t('landing.install.desktopP', vars)}
            </p>
            {/* Play Store badge placeholder — uncomment when the listing is live:
            <a href="PLAY_STORE_URL" className="mt-4 inline-block">
              <img src="/icons/play-badge.png" alt="Get it on Google Play" className="h-10" />
            </a> */}
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink/55">
          {t('landing.install.note')}
        </p>
      </div>
    </section>
  )
}
