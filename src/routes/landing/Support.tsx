import { useState } from 'react'
import { Coffee, Copy, Check } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

// "Support our mission" — the landing mirror of the in-app donation page,
// on the deepest night surface with the khatam pattern. Keep these
// constants in sync with sohibna/src/app/donation.tsx.
const BANK_ACCOUNT = '7538169750'
const WA_NUMBER = '6281809713971'
const WA_TEXT = encodeURIComponent(
  'Assalamualaikum, saya baru saja berdonasi untuk aplikasi Sohibna.',
)
const BMAC_LINK = 'https://buymeacoffee.com/sohibna'

export function Support() {
  const { t, lang } = useI18n()
  const [copied, setCopied] = useState(false)

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_ACCOUNT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked (http/older browsers) — the number stays selectable
    }
  }

  return (
    <section
      id="dukung"
      className="relative scroll-mt-24 overflow-hidden bg-[#0A1812] py-16 text-cream md:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 start-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-sage/10 blur-[110px]"
      />
      <div aria-hidden className="pattern-islamic absolute inset-0 opacity-[0.06]" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="glass inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#8FBC8F]">
            {t('landing.support.eyebrow')}
          </p>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl tracking-tight md:text-4xl">
            {t('landing.support.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/60 md:text-base">
            {t('landing.support.mission')}
          </p>
        </div>

        {/* The hadith the in-app donation page opens with. */}
        <figure className="mx-auto mt-10 max-w-3xl text-center">
          <div aria-hidden className="text-xl text-[#8FBC8F]">✦</div>
          <blockquote className="mt-4 text-base leading-relaxed text-cream/85 md:text-lg">
            {t('landing.support.hadith')}
          </blockquote>
          <figcaption
            className={`mt-3 text-xs text-[#8FBC8F] ${lang === 'ar' ? 'quran-rtl' : ''}`}
          >
            {t('landing.support.hadithSource')}
          </figcaption>
        </figure>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          {/* Buy Me a Coffee */}
          <div className="glass flex flex-col rounded-3xl p-7">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#163024] text-[#8FBC8F]">
                <Coffee size={19} />
              </span>
              <h3 className="text-base font-bold">{t('landing.support.bmcT')}</h3>
            </div>
            <a
              href={BMAC_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7a9d7a] to-[#8FBC8F] px-6 py-3 text-sm font-bold text-night transition-transform hover:scale-[1.02]"
            >
              <Coffee size={15} />
              {t('landing.support.bmcCta')}
            </a>
          </div>

          {/* Bank transfer */}
          <div className="glass rounded-3xl p-7">
            <div className="flex items-center gap-2.5">
              <img src="/icons/bsi-logo.png" alt="BSI" className="h-6 w-auto" />
              <h3 className="text-base font-bold">{t('landing.support.bankT')}</h3>
            </div>
            <p className="mt-5 text-[11px] uppercase tracking-wide text-cream/45">
              {t('landing.support.accountLabel')}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
              <span className="font-display text-2xl tracking-wider tabular-nums">
                {BANK_ACCOUNT}
              </span>
              <button
                onClick={copyAccount}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  copied
                    ? 'bg-[#8FBC8F]/20 text-[#8FBC8F]'
                    : 'bg-white/8 text-cream hover:bg-white/15'
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {t(copied ? 'landing.support.copied' : 'landing.support.copy')}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-cream/50">{t('landing.support.accountName')}</p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-xs font-semibold text-[#8FBC8F] underline-offset-4 hover:underline"
            >
              {t('landing.support.waConfirm')} →
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-cream/45">
          {t('landing.support.inAppNote')}
        </p>
      </div>
    </section>
  )
}
