import { useI18n } from '@/context/I18nContext'
import { appUrl } from '@/origins'
import { StoreBadge } from './StoreBadge'

// Dark hero: layered sage glows + the khatam pattern, oversized display
// type, gradient CTA, the promo video in a phone frame — fading into the
// cream sections below. Kept deliberately lean: the badge carries the
// gratis/offline message, the store badges carry the "coming soon" story.

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden bg-night text-cream">
      {/* ambient glows + geometric pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 start-1/4 h-[28rem] w-[28rem] rounded-full bg-sage/20 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 end-0 h-96 w-96 rounded-full bg-[#8FBC8F]/15 blur-[100px]"
      />
      <div aria-hidden className="pattern-islamic absolute inset-0 opacity-[0.07]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-24 md:pb-24 md:pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div>
          <span className="glass fade-up inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-cream/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8FBC8F]" />
            {t('landing.hero.badge')}
          </span>

          <h1 className="font-display fade-up fade-up-1 mt-6 text-4xl leading-[1.15] tracking-tight sm:text-5xl xl:text-6xl">
            {t('landing.hero.titleA')}{' '}
            <em className="bg-gradient-to-r from-[#8FBC8F] to-sage bg-clip-text not-italic text-transparent">
              {t('landing.hero.titleEm')}
            </em>
          </h1>

          <p className="fade-up fade-up-2 mt-5 max-w-lg text-base leading-relaxed text-cream/70 md:text-lg">
            {t('landing.hero.sub')}
          </p>

          <div className="fade-up fade-up-3 mt-8 flex flex-wrap items-center gap-3">
            <a
              href={appUrl('/home')}
              className="rounded-full bg-gradient-to-r from-[#7a9d7a] to-[#8FBC8F] px-7 py-3.5 text-sm font-bold text-night shadow-lg shadow-[#8FBC8F]/25 transition-transform hover:scale-[1.03]"
            >
              {t('landing.hero.cta')}
            </a>
            <a
              href="#fitur"
              className="glass rounded-full px-6 py-3 text-sm font-semibold text-cream/85 transition-colors hover:text-cream"
            >
              {t('landing.hero.ctaSecondary')}
            </a>
          </div>

          {/* Store badges — both "coming soon" until their listings are live;
              the CTA above is the install path today. */}
          <div className="fade-up fade-up-4 mt-5 flex flex-wrap items-center gap-3">
            <StoreBadge kind="play" />
            <StoreBadge kind="ios" />
          </div>
        </div>

        {/* Phone with the promo video */}
        <div className="relative mx-auto w-fit">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 scale-110 rounded-full bg-sage/15 blur-3xl"
          />
          <div className="w-[300px] rounded-[2.4rem] border-[10px] border-[#122A1F] bg-[#122A1F] shadow-2xl shadow-black/35 ring-1 ring-white/10 lg:w-[330px]">
            <video
              className="aspect-[9/16] w-full rounded-[1.8rem] object-cover"
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

      {/* fade into the cream sections */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-cream"
      />
    </section>
  )
}
