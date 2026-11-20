import { useI18n } from '@/context/I18nContext'
import type { Lang } from '@/i18n/types'
import { useDocumentMeta, type MetaAlternate } from '@/hooks/useDocumentMeta'
import { LANDING_ORIGIN } from '@/origins'
import { Building2, QrCode, User, UserCheck } from 'lucide-react'
import { LandingI18n } from './LandingI18n'
import { Footer } from './Footer'
import './landing.css'

// Program Mitra recruitment page (0033) — the public "partner with us" pitch
// on the landing origin. Static i18n content only (the landing CSP allows no
// API calls); joining is handled by the team over WhatsApp in Phase 1 (no
// forms). The mitra DASHBOARD lives on the app origin at /mitra; only the
// exact /mitra path (and lang prefixes) is carved out of nginx's 301
// catch-all — deeper paths still forward there.
// Keep the WA number in sync with Support.tsx / the in-app donation page.

const LANG_PATH: Record<Lang, string> = { id: '/', en: '/en', ar: '/ar', tr: '/tr', ur: '/ur' }
const mitraUrl = (lang: Lang) =>
  `${LANDING_ORIGIN}${LANG_PATH[lang] === '/' ? '' : LANG_PATH[lang]}/mitra`
const WA_NUMBER = '6281809713971'

export function MitraPitch({ lang: forced }: { lang?: Lang }) {
  if (forced) {
    return (
      <LandingI18n lang={forced}>
        <MitraBody routeLang={forced} />
      </LandingI18n>
    )
  }
  return <MitraBody />
}

function MitraBody({ routeLang }: { routeLang?: Lang }) {
  const { t, lang: ambient } = useI18n()
  const lang = routeLang ?? ambient

  const alternates: MetaAlternate[] = (['id', 'en', 'ar', 'tr', 'ur'] as const).map((l) => ({
    hreflang: l,
    href: mitraUrl(l),
  }))
  alternates.push({ hreflang: 'x-default', href: mitraUrl('id') })

  useDocumentMeta({
    title: `${t('mitra.landing.title')} · Sohibna`,
    description: t('mitra.landing.subtitle'),
    canonical: mitraUrl(lang),
    alternates,
    ogImage: `${LANDING_ORIGIN}/og-image.png`,
  })

  const waText = encodeURIComponent(t('mitra.landing.waPrefill'))
  const types = [
    { icon: Building2, key: 'lembaga' },
    { icon: User, key: 'individual' },
    { icon: UserCheck, key: 'agent' },
  ] as const
  const stepKeys = [
    'mitra.landing.step1',
    'mitra.landing.step2',
    'mitra.landing.step3',
  ] as const

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <section className="relative overflow-hidden bg-[#0A1812] py-16 text-cream md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 start-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-sage/10 blur-[110px]"
        />
        <div aria-hidden className="pattern-islamic absolute inset-0 opacity-[0.06]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <p className="glass inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#8FBC8F]">
            Sohibna
          </p>
          <h1 className="font-display mt-4 text-3xl tracking-tight md:text-4xl">
            {t('mitra.landing.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/60 md:text-base">
            {t('mitra.landing.subtitle')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {types.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="rounded-3xl bg-white p-5 text-center shadow-sm dark:bg-[#122A1F]"
            >
              <Icon size={26} className="mx-auto mb-3 text-[#5F8F6B]" />
              <h2 className="text-sm font-bold">{t(`mitra.type.${key}`)}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-ink/55 dark:text-cream/55">
                {t(`mitra.landing.typeDesc.${key}`)}
              </p>
            </div>
          ))}
        </div>

        <h2 className="font-display mt-14 text-center text-2xl tracking-tight">
          {t('mitra.landing.how')}
        </h2>
        <ol className="mx-auto mt-6 max-w-xl space-y-3">
          {stepKeys.map((key, i) => (
            <li
              key={key}
              className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-[#122A1F]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8FBC8F] text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-ink/75 dark:text-cream/75">
                {t(key)}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-3xl bg-[#0A1812] p-8 text-center text-cream">
          <QrCode size={28} className="mx-auto mb-3 text-[#8FBC8F]" />
          <h2 className="font-display text-2xl tracking-tight">{t('mitra.landing.applyTitle')}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/60">
            {t('mitra.landing.applyBody')}
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-xl bg-[#8FBC8F] px-6 py-3 text-sm font-bold text-white"
          >
            {t('mitra.landing.cta')}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
