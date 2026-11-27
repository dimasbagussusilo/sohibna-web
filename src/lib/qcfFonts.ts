// Quran font loader (web). The reader renders Arabic with:
//   - Uthmani: the QCF V2 per-page glyph font (`QCF_V2_P{page}`), fed each
//     word's `code_v2` (private-use codepoints the page font maps to the exact
//     shaped mushaf glyph).
//   - IndoPak: `IndoPak Nastaleeq`, fed each word's `text_indopak`.
//   - Tajweed / Indonesian: rendered as HTML fragments (TajweedVerse /
//     IndonesianVerse) which load their own fonts via @font-face.
// Fallback while a font is still loading: Unicode `text_uthmani`.
//
// Loading on web is a plain FontFace from the API URL (fonts self-hosted under
// ${API_BASE_URL}/quran/fonts, same-origin-with-API as the rest of the data);
// the service worker's 'quran-fonts' runtime cache then serves the TTF
// offline. No disk copy or base64 embedding needed.

import { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/config'
import type { Script, Verse } from './quran'

// Self-hosted QCF fonts, served by our API (same sub-paths as the old
// upstream font CDN: v2/ttf, v4/colrv1/woff2, nastaleeq/indopak).
const QCF_CDN = `${API_BASE_URL}/quran/fonts`

export const INDO_PAK_FAMILY = 'IndoPakNastaleeq'
const INDO_PAK_URL = `${QCF_CDN}/nastaleeq/indopak/indopak-nastaleeq-waqf-lazim-v4.2.1.ttf`

export const pageFontFamily = (page: number) => `QCF_V2_P${page}`
const pageFontUrl = (page: number) => `${QCF_CDN}/v2/ttf/p${page}.ttf`

// Ensure a specific mushaf page's QCF V2 font is registered — the mushaf view
// loads fonts page-by-page as pages mount (vs useQuranFonts, which derives the
// set from a verse list). App twin: sohibna/src/lib/qcfFonts.ts.
export function loadPageFont(page: number): Promise<void> {
  return loadFont(pageFontFamily(page), pageFontUrl(page))
}

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

// How long the reading UI may wait for the page fonts before showing the
// Unicode fallback. A stalled request (dead radio mid-stream) must never pin
// the skeleton forever; the fonts still upgrade the text when they do land.
export const FONT_GATE_DEADLINE_MS = 6000

// useQuranFonts loads every font the current verses need for the chosen script,
// then bumps a revision counter to force a re-render — so ArabicText swaps from
// the Unicode fallback to the proper glyph font once it's ready (progressive).
// Tajweed/Indonesian are no-ops here (their HTML loads its own font).
//
// It also exposes `ready`, which callers gate the reading UI on so the first
// open never shows a partially-rendered fallback while fonts are still
// downloading. Three rules keep that gate honest:
//   - no verses yet = NOT ready. (It used to flip to true on the empty verse
//     list, which mounted the whole chapter on fallback glyphs for one commit
//     and unmounted it again — losing a `?v=` deep-link jump made in it.)
//   - everything already registered (a revisited surah) = ready at once, no
//     skeleton flash in between;
//   - a stalled font stops mattering after FONT_GATE_DEADLINE_MS: the text
//     shows on the fallback and upgrades later through `rev`.
export function useQuranFonts(
  verses: Verse[],
  script: Script,
): { rev: number; ready: boolean } {
  const [rev, setRev] = useState(0)
  const [ready, setReady] = useState(script === 'tajweed' || script === 'indonesian')

  useEffect(() => {
    if (script === 'tajweed' || script === 'indonesian') {
      setReady(true)
      return
    }
    let alive = true
    let deadline: ReturnType<typeof setTimeout> | undefined
    if (verses.length === 0) {
      setReady(false)
      return () => {
        alive = false
      }
    }
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
    const needIndoPak = script === 'indopak'
    const families = [
      ...(needIndoPak ? [INDO_PAK_FAMILY] : []),
      ...[...pages].map((pg) => pageFontFamily(pg)),
    ]
    if (families.every((f) => loaded.has(f))) {
      setReady(true)
      return () => {
        alive = false
      }
    }
    setReady(false)
    deadline = setTimeout(() => {
      if (alive) setReady(true)
    }, FONT_GATE_DEADLINE_MS)
    ;(async () => {
      const tasks: Promise<void>[] = []
      if (needIndoPak) tasks.push(loadFont(INDO_PAK_FAMILY, INDO_PAK_URL))
      pages.forEach((pg) => tasks.push(loadFont(pageFontFamily(pg), pageFontUrl(pg))))
      await Promise.all(tasks)
      clearTimeout(deadline)
      if (alive) {
        setRev((r) => r + 1)
        setReady(true)
      }
    })()
    return () => {
      alive = false
      clearTimeout(deadline)
    }
  }, [verses, script])

  return { rev, ready }
}
