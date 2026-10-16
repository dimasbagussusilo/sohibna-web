import { useEffect } from 'react'

// Per-route document metadata for the landing (title, description, OG/Twitter
// tags, canonical + hreflang alternates). The app shell has no meta manager —
// this is a minimal effect-driven upsert/remove scoped to landing routes.
// index.html carries static defaults so link previews work pre-JS; this hook
// refines them per language route. Elements it creates are removed on
// unmount; elements it finds (the static defaults) are updated in place.

export type MetaAlternate = { hreflang: string; href: string }

export type DocumentMeta = {
  title: string
  description: string
  /** Absolute canonical URL for this page. */
  canonical: string
  /** hreflang alternates (include x-default). */
  alternates: MetaAlternate[]
  ogImage?: string
  ogLocale?: string
}

export function useDocumentMeta(meta: DocumentMeta): void {
  const { title, description, canonical, alternates, ogImage, ogLocale } = meta
  // Stable dep: callers pass literal arrays, which would otherwise re-run the
  // effect every render (idempotent, but needlessly churning the <head>).
  const alternatesKey = alternates.map((a) => `${a.hreflang}=${a.href}`).join('|')

  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    const created: Element[] = []
    // find-or-create a head element; created ones are tracked for cleanup.
    const upsert = (
      selector: string,
      build: () => HTMLElement,
      apply: (el: HTMLElement) => void,
    ): void => {
      let el = document.head.querySelector<HTMLElement>(selector)
      if (!el) {
        el = build()
        document.head.appendChild(el)
        created.push(el)
      }
      apply(el)
    }

    const metaContent = (name: string, content: string) => {
      const el = document.createElement('meta')
      el.setAttribute('name', name)
      el.setAttribute('content', content)
      return el
    }
    const metaProperty = (prop: string, content: string) => {
      const el = document.createElement('meta')
      el.setAttribute('property', prop)
      el.setAttribute('content', content)
      return el
    }

    upsert('meta[name="description"]', () => metaContent('description', description), (el) => {
      el.setAttribute('content', description)
    })

    const ogTags: [prop: string, value: string][] = [
      ['og:title', title],
      ['og:description', description],
      ['og:type', 'website'],
      ['og:site_name', 'Sohibna'],
      ['og:url', canonical],
      ...(ogImage ? ([['og:image', ogImage]] as [string, string][]) : []),
      ...(ogLocale ? ([['og:locale', ogLocale]] as [string, string][]) : []),
    ]
    for (const [prop, value] of ogTags) {
      upsert(`meta[property="${prop}"]`, () => metaProperty(prop, value), (el) => {
        el.setAttribute('content', value)
      })
    }

    const twitterTags: [name: string, value: string][] = [
      ['twitter:card', 'summary_large_image'],
      ['twitter:title', title],
      ['twitter:description', description],
      ...(ogImage ? ([['twitter:image', ogImage]] as [string, string][]) : []),
    ]
    for (const [name, value] of twitterTags) {
      upsert(`meta[name="${name}"]`, () => metaContent(name, value), (el) => {
        el.setAttribute('content', value)
      })
    }

    upsert(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        return el
      },
      (el) => {
        el.setAttribute('href', canonical)
      },
    )

    for (const alt of alternates) {
      upsert(
        `link[rel="alternate"][data-hreflang="${alt.hreflang}"]`,
        () => {
          const el = document.createElement('link')
          el.setAttribute('rel', 'alternate')
          el.setAttribute('data-hreflang', alt.hreflang)
          return el
        },
        (el) => {
          el.setAttribute('hreflang', alt.hreflang)
          el.setAttribute('href', alt.href)
        },
      )
    }

    return () => {
      created.forEach((el) => el.remove())
      document.title = prevTitle
    }
    // alternates used via closure; alternatesKey is its stable serialization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, canonical, ogImage, ogLocale, alternatesKey])
}
