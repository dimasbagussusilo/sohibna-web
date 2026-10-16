import { useI18n } from '@/context/I18nContext'
import { appUrl } from '@/origins'

// Closing CTA band — the dark night/sage mirror of the hero.

export function FinalCTA() {
  const { t } = useI18n()

  return (
    <section className="bg-night py-16 text-center text-cream md:py-20">
      <div className="quran-rtl text-3xl text-[#8FBC8F]">صحبنا</div>
      <h2 className="mx-auto mt-4 max-w-xl px-4 text-2xl font-bold md:text-3xl">
        {t('landing.finalCta.title')}
      </h2>
      <p className="mx-auto mt-3 max-w-md px-4 text-sm text-[#9DB8AA]">
        {t('landing.finalCta.sub')}
      </p>
      <a
        href={appUrl('/home')}
        className="mt-8 inline-block rounded-full bg-[#8FBC8F] px-8 py-3.5 text-sm font-bold text-night transition-colors hover:bg-[#7aad7a]"
      >
        {t('landing.finalCta.cta')}
      </a>
    </section>
  )
}
