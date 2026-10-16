import { useI18n } from '@/context/I18nContext'
import type { Lang } from '@/i18n/types'
import { useDocumentMeta, type MetaAlternate } from '@/hooks/useDocumentMeta'
import { LANDING_ORIGIN } from '@/origins'
import { LandingI18n } from './LandingI18n'
import { Nav } from './Nav'
import { Hero } from './Hero'
import { Features } from './Features'
import { Download } from './Download'
import { Support } from './Support'
import { FAQ } from './FAQ'
import { Footer } from './Footer'
import './landing.css'

// The marketing landing — served on the apex origin (sohibna.com) at /, /en,
// /ar by the same SPA build (nginx landing mode 301s every other path to the
// app origin). Language is fixed per route, never persisted. The "Buka
// Aplikasi" CTA points cross-origin at the app.

const LANG_PATH: Record<Lang, string> = { id: '/', en: '/en', ar: '/ar' }
const OG_LOCALE: Record<Lang, string> = { id: 'id_ID', en: 'en_US', ar: 'ar_AR' }

export function Landing({ lang }: { lang: Lang }) {
  return (
    <LandingI18n lang={lang}>
      <LandingMeta lang={lang} />
      <div className="min-h-dvh bg-cream text-ink">
        <Nav />
        <main>
          <Hero />
          <Features />
          <Download />
          <Support />
          <FAQ />
        </main>
        <Footer />
      </div>
    </LandingI18n>
  )
}

function LandingMeta({ lang }: { lang: Lang }) {
  const { dict } = useI18n()
  const m = dict.landing.meta
  const alternates: MetaAlternate[] = (['id', 'en', 'ar'] as const).map((l) => ({
    hreflang: l,
    href: `${LANDING_ORIGIN}${LANG_PATH[l]}`,
  }))
  alternates.push({ hreflang: 'x-default', href: `${LANDING_ORIGIN}/` })

  useDocumentMeta({
    title: m.title,
    description: m.description,
    canonical: `${LANDING_ORIGIN}${LANG_PATH[lang]}`,
    alternates,
    ogImage: `${LANDING_ORIGIN}/og-image.png`,
    ogLocale: OG_LOCALE[lang],
  })
  return null
}
