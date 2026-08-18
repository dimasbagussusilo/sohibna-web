// Quran font loader (web). The reader renders Arabic with:
//   - Uthmani: the QCF V2 per-page glyph font (`QCF_V2_P{page}`), fed each
//     word's `code_v2` (private-use codepoints the page font maps to the exact
//     shaped mushaf glyph).
//   - IndoPak: `IndoPak Nastaleeq`, fed each word's `text_indopak`.
//   - Tajweed / Indonesian: rendered as HTML fragments (TajweedVerse /
//     IndonesianVerse) which load their own fonts via @font-face.
// Fallback while a font is still loading: Unicode `text_uthmani`.
//
// Loading on web is a plain FontFace from the CDN URL (CORS is open on
// verses.quran.foundation); the service worker's 'qcf-fonts' runtime cache
// then serves the TTF offline. No disk copy or base64 embedding needed.

import { useEffect, useState } from 'react'
import type { Script, Verse } from './quran'

const QCF_CDN = 'https://verses.quran.foundation/fonts/quran/hafs'

export const INDO_PAK_FAMILY = 'IndoPakNastaleeq'
const INDO_PAK_URL = `${QCF_CDN}/nastaleeq/indopak/indopak-nastaleeq-waqf-lazim-v4.2.1.ttf`

export const pageFontFamily = (page: number) => `QCF_V2_P${page}`
const pageFontUrl = (page: number) => `${QCF_CDN}/v2/ttf/p${page}.ttf`

// In-flight loads (dedupe concurrent requests for the same family).
const inflight = new Map<string, Promise<void>>()
const loaded = new Set<string>()

// loadFont downloads (once) and registers a remote font under `family`.
// Resolves even on failure — a missing font just stays unloaded, and
// isFontLoaded then returns false so the reader falls back to Unicode
// text_uthmani rather than showing blank code_v2 glyphs.
export async function loadFont(family: string, url: string): Promise<void> {
  if (loaded.has(family)) return
  const existing = inflight.get(family)
  if (existing) return existing

  const p = (async () => {
    const face = new FontFace(family, `url(${url})`)
    await face.load()
    document.fonts.add(face)
    loaded.add(family)
  })().catch((e: unknown) => {
    // eslint-disable-next-line no-console
    console.warn('qcfFonts: could not load', family, e)
  })

  inflight.set(family, p)
  try {
    await p
  } finally {
    inflight.delete(family)
  }
}

// Whether a family has finished registering.
export const isFontLoaded = (family: string): boolean => loaded.has(family)

// useQuranFonts loads every font the current verses need for the chosen script,
// then bumps a revision counter to force a re-render — so ArabicText swaps from
// the Unicode fallback to the proper glyph font once it's ready (progressive).
// Tajweed/Indonesian are no-ops here (their HTML loads its own font).
export function useQuranFonts(verses: Verse[], script: Script): number {
  const [rev, setRev] = useState(0)

  useEffect(() => {
    if (script === 'tajweed' || script === 'indonesian') return
    let alive = true
    ;(async () => {
      const tasks: Promise<void>[] = []
      // QCF V2 page fonts we need. Uthmani renders EVERY word through its page
      // font; IndoPak renders word text in Nastaleeq, but its ayah-end marker
      // (the `end` word's code_v2 medallion) still needs the QCF V2 page font
      // so the verse number shows inside the ornament — collect end-word pages.
      const pages = new Set<number>()
      verses.forEach((v) =>
        v.words.forEach((w) => {
          if (!w.page_number) return
          if (script === 'indopak' && w.char_type_name !== 'end') return
          pages.add(w.page_number)
        }),
      )
      if (script === 'indopak') tasks.push(loadFont(INDO_PAK_FAMILY, INDO_PAK_URL))
      pages.forEach((pg) => tasks.push(loadFont(pageFontFamily(pg), pageFontUrl(pg))))
      await Promise.all(tasks)
      if (alive) setRev((r) => r + 1)
    })()
    return () => {
      alive = false
    }
  }, [verses, script])

  return rev
}
