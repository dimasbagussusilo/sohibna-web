import { Link } from 'react-router'
import { useI18n } from '@/context/I18nContext'
import type { Lang } from '@/i18n/types'
import { useDocumentMeta, type MetaAlternate } from '@/hooks/useDocumentMeta'
import { LANDING_ORIGIN } from '@/origins'
import { LandingI18n } from '../landing/LandingI18n'
import { Footer } from '../landing/Footer'
import { LEGAL, type LegalDocKey } from './content'
import '../landing/landing.css'

// /privacy and /(/en|ar|tr|ur)/privacy — same for /terms. Canonical home is
// the apex (landing) origin; the app origin serves the same pages with the
// account's persisted language (no lang prop → ambient I18nProvider lang).
// Long-form copy lives in ./content (per-language modules, lazy-loaded with
// this route). The #delete anchor on the rights section is the web resource
// Google Play's account-declaration form links to.

const LANG_PATH: Record<Lang, string> = { id: '/', en: '/en', ar: '/ar', tr: '/tr', ur: '/ur' }
const legalUrl = (lang: Lang, slug: string) =>
  `${LANDING_ORIGIN}${LANG_PATH[lang] === '/' ? '' : LANG_PATH[lang]}/${slug}`

export function LegalPage({ doc, lang: forced }: { doc: LegalDocKey; lang?: Lang }) {
  if (forced) {
    return (
      <LandingI18n lang={forced}>
        <LegalBody doc={doc} routeLang={forced} />
      </LandingI18n>
    )
  }
  return <LegalBody doc={doc} />
}

function LegalBody({ doc, routeLang }: { doc: LegalDocKey; routeLang?: Lang }) {
  const { lang: ambient } = useI18n()
  const lang = routeLang ?? ambient
  const c = LEGAL[lang][doc]
  const slug = doc === 'privacy' ? 'privacy' : 'terms'

  const alternates: MetaAlternate[] = (['id', 'en', 'ar', 'tr', 'ur'] as const).map((l) => ({
    hreflang: l,
    href: legalUrl(l, slug),
  }))
  alternates.push({ hreflang: 'x-default', href: legalUrl('id', slug) })

  useDocumentMeta({
    title: `${c.title} · Sohibna`,
    description: c.metaDescription,
    canonical: legalUrl(lang, slug),
    alternates,
    ogImage: `${LANDING_ORIGIN}/og-image.png`,
  })

  const homeHref = routeLang ? LANG_PATH[routeLang] : '/home'

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <header className="mx-auto max-w-3xl px-4 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to={homeHref} className="flex items-center gap-2.5 hover:opacity-80">
            <img src="/icons/pwa-192.png" alt="Sohibna" className="h-7 w-7 rounded-lg" />
            <span className="font-display text-sm">Sohibna</span>
          </Link>
          {routeLang && (
            <nav className="flex items-center gap-2.5 text-xs text-ink/50">
              {(['id', 'en', 'ar', 'tr', 'ur'] as const).map((l) => (
                <a
                  key={l}
                  href={`${LANG_PATH[l] === '/' ? '' : LANG_PATH[l]}/${slug}`}
                  className={`uppercase tracking-wide hover:text-ink ${
                    l === lang ? 'font-semibold text-ink' : ''
                  }`}
                >
                  {l}
                </a>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-10">
        <Link to={homeHref} className="text-xs text-ink/50 hover:text-ink">
          ← {c.backHome}
        </Link>
        <h1 className="font-display mt-4 text-3xl tracking-tight md:text-4xl">{c.title}</h1>
        <p className="mt-2 text-xs text-ink/50">
          {c.updatedLabel}: {c.updated}
        </p>

        <div className="mt-10 space-y-8">
          {c.sections.map((s, i) => (
            <section key={i}>
              <h2 id={s.anchor} className="scroll-mt-24 text-lg font-bold">
                {s.h}
              </h2>
              <div className="mt-2.5 space-y-3 leading-relaxed text-ink/80">
                {s.p.map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
