import { Check } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { appUrl } from '@/origins'

// Hero: badge, headline with the <em> accent, trust pills, dual CTA, and the
// portrait promo video framed as a phone. Muted+playsInline lets it autoplay
// everywhere; the poster (19KB frame) paints first so the hero never waits
// on the video. Browsers pick the AV1 source (2.1MB, 480px/30fps — plenty
// for a 280px frame); the H.264 source only downloads on devices without
// AV1 decode (older iPhones).

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden">
      {/* soft radial glow behind the mockup */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-0 hidden w-1/2 lg:block"
        style={{
          background:
            'radial-gradient(closest-side at 70% 40%, rgba(122,157,122,0.18), transparent)',
        }}
      />
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full border border-sage/40 bg-sage/10 px-3 py-1 text-xs font-medium text-[#4d6b4d]">
            {t('landing.hero.badge')}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {t('landing.hero.titleA')}{' '}
            <em className="text-[#4d6b4d]">{t('landing.hero.titleEm')}</em>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink/70">
            {t('landing.hero.sub')}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={appUrl('/home')}
              className="rounded-full bg-night px-6 py-3 text-sm font-semibold text-cream shadow-lg shadow-night/20 transition-colors hover:bg-[#163024]"
            >
              {t('landing.hero.cta')}
            </a>
            <a
              href="#fitur"
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30"
            >
              {t('landing.hero.ctaSecondary')}
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/70">
            {(['trust1', 'trust2', 'trust3'] as const).map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <Check size={15} className="text-[#4d6b4d]" />
                {t(`landing.hero.${k}`)}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink/45">{t('landing.hero.note')}</p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-[280px] rounded-[2.2rem] border-[10px] border-night bg-night shadow-2xl shadow-night/40">
            <video
              className="aspect-[9/16] w-full rounded-[1.6rem] object-cover"
              poster="/promo-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Sohibna app promo"
            >
              <source src="/promo.av1.mp4" type='video/mp4; codecs="av01.0.05M.08"' />
              <source src="/promo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
