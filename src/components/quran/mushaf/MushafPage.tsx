// MushafPage (web) — one page of the traditional Madinah 15-line mushaf.
// Unlike the app (which needs a WebView for tajweed colours), web renders BOTH
// script variants as plain DOM: 15 (or 8, on the Fatiha/Baqarah openings)
// grid rows, each a flex line — the mushaf's both-edge justification.
//
// ── Sizing is WIDTH-derived (see the app twin) ──────────────────────────────
// QCF fonts are pre-justified (glyph advances ≈ a fixed ~15.7em measure,
// kashida baked in, no space glyph), so fontSize = contentWidth ÷ the page's
// measured measure. The measure is taken directly from the DOM once the page
// font is ready (document.fonts.ready): widest text row's children-width-sum
// ÷ current font-size. Near-full lines justify both edges (space-between over
// a few % slack); short verse-end lines (slack > 25%) render centered, like
// the print. Furniture is the shared overlay (MushafFurnitureLayer). Word/
// medallion taps are inert on web this pass (web has no word tooltip / verse
// action bar in the reader).

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildMushafPage,
  fallbackMeasureEm,
  isRaggedLine,
  mushafMetrics,
  type MushafPageModel,
} from '@/lib/mushafPage'
import { API_BASE_URL } from '@/config'
import { loadVerses, toArabic, type Chapter, type Verse } from '@/lib/quran'
import { isFontLoaded, loadPageFont, pageFontFamily } from '@/lib/qcfFonts'
import { MushafFurnitureLayer } from './MushafFurniture'

// Self-hosted QCF fonts, served by our API (same sub-paths as the old CDN).
const QCF_CDN = `${API_BASE_URL}/quran/fonts`

const MARK_COLOR: Record<string, string> = { fav: '#f59e0b', bk: '#3b82f6', label: '#8B5CF6' }

export function MushafPage({
  page,
  width,
  height,
  dark,
  script,
  chapters,
  marks,
  onLoaded,
}: {
  page: number
  width: number
  height: number
  dark: boolean
  script: string
  chapters: Record<number, Chapter>
  marks: Record<string, 'fav' | 'bk' | 'label'>
  // Reports the built model up (the pager forwards it for lastRead/sessions).
  onLoaded?: (page: number, model: MushafPageModel | null) => void
}) {
  const [verses, setVerses] = useState<Verse[] | null>(null)
  // Plain variant: the page's QCF V2 font (FontFace; falls back to Unicode text
  // while loading, upgraded on the revision bump).
  const [fontRev, setFontRev] = useState(0)

  useEffect(() => {
    let alive = true
    setVerses(null)
    loadVerses({ kind: 'page', id: page })
      .then((vs) => alive && setVerses(vs))
      .catch(() => alive && setVerses([]))
    return () => {
      alive = false
    }
  }, [page])

  useEffect(() => {
    let alive = true
    loadPageFont(page).then(() => {
      if (alive) setFontRev((r) => r + 1)
    })
    return () => {
      alive = false
    }
  }, [page])

  const model = useMemo(() => (verses ? buildMushafPage(verses, page) : null), [verses, page])
  useEffect(() => {
    onLoaded?.(page, model)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  const padV = 8
  // Wider side padding on the 8-line openings (edge clipping, 2026-11-04).
  const hPad = (model?.lineCount ?? 15) <= 8 ? 18 : 14
  const contentW = width - hPad * 2
  const contentH = height - padV * 2 - 6
  const lineCount = model?.lineCount ?? 15
  const fontReady = fontRev > 0 && isFontLoaded(pageFontFamily(page))
  const ink = dark ? '#E8E2D6' : '#2C3E50'
  const theme = dark ? 'D' : 'L'
  const tajweed = script === 'tajweed'

  // Probe: measure the page's true line measure from the rendered rows once
  // the page font is active (both variants — V2 via FontFace, V4 via the
  // injected @font-face — register in document.fonts).
  const gridRef = useRef<HTMLDivElement>(null)
  const [probe, setProbe] = useState<{ measureEm: number; ragged: Set<number> } | null>(null)
  useEffect(() => {
    setProbe(null)
  }, [page, model])
  useEffect(() => {
    if (!model) return
    let alive = true
    const measure = () => {
      const grid = gridRef.current
      if (!grid || !alive) return
      const rows = Array.from(grid.children) as HTMLElement[]
      const widths: number[] = []
      const lines: number[] = []
      rows.forEach((row) => {
        const line = Number(row.dataset.line)
        let w = 0
        for (let c = row.firstElementChild; c; c = c.nextElementSibling) {
          w += (c as HTMLElement).getBoundingClientRect().width
        }
        if (w > 0) {
          widths.push(w)
          lines.push(line)
        }
      })
      if (!widths.length) return
      const max = Math.max(...widths)
      const fs = parseFloat(getComputedStyle(rows[0]).fontSize) || 1
      // Sanity band: a measure far from the nominal one means the page font
      // hadn't applied yet (pre-swap fallback widths) — skip; a later pass
      // converges. Only a significant change from the accepted measure
      // triggers a re-fit (see the RN twins).
      const em = max / fs
      const fb = fallbackMeasureEm(model.lineCount)
      if (!(em > 0) || em < fb * 0.8 || em > fb * 1.25) return
      if (probe && Math.abs(em - probe.measureEm) < em * 0.04) return
      const ragged = new Set<number>()
      widths.forEach((w, i) => {
        if (isRaggedLine(w, max)) ragged.add(lines[i])
      })
      setProbe({ measureEm: em, ragged })
    }
    const ready = document.fonts?.ready
    if (ready) {
      ready.then(() => setTimeout(measure, 120))
    }
    const t = setTimeout(measure, 1200)
    return () => {
      alive = false
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, fontRev, tajweed])

  const { fontSize, rowH, top } = mushafMetrics(contentW, contentH, lineCount, probe?.measureEm ?? fallbackMeasureEm(lineCount))

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height,
        backgroundColor: dark ? '#122A1F' : '#FBF8F1',
        borderTop: `0.5px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E0D2'}`,
        borderBottom: `0.5px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E0D2'}`,
        paddingTop: padV,
        paddingBottom: padV + 6,
      }}
      dir="rtl"
    >
      {tajweed ? (
        <style>{`@font-face{font-family:'QCF_V4_P${page}';src:url('${QCF_CDN}/v4/colrv1/woff2/p${page}.woff2') format('woff2');font-display:swap;}
@font-palette-values --QCF_V4_P${page}-L{font-family:'QCF_V4_P${page}';base-palette:0;}
@font-palette-values --QCF_V4_P${page}-D{font-family:'QCF_V4_P${page}';base-palette:1;}
.mushafrow.tj{font-family:'QCF_V4_P${page}';font-palette:--QCF_V4_P${page}-${theme};}
${(Object.entries(MARK_COLOR) as Array<[string, string]>)
  .concat([['def', '#8FBC8F']])
  .map(
    ([k, c]) =>
      `@font-palette-values --QCF_V4_P${page}-E${k}{font-family:'QCF_V4_P${page}';base-palette:${dark ? 1 : 0};override-colors:10 ${c},11 ${c},12 ${c},13 #000000;}` +
      `.end.e-${k}{font-family:'QCF_V4_P${page}';font-palette:--QCF_V4_P${page}-E${k};}`,
  )
  .join('')}
.end.gl{font-size:1em;}`}</style>
      ) : null}

      {model ? (
        <div className="flex h-full flex-col justify-center" style={{ fontSize: `${fontSize}px` }}>
          <div ref={gridRef} style={{ height: rowH * model.lineCount }}>
            {model.rows.map((row) => {
              if (row.type !== 'text') return <div key={row.line} style={{ height: rowH }} /> // furniture overlay draws it
              const ragged = probe ? probe.ragged.has(row.line) : row.words.length <= 2
              return (
                <div
                  key={row.line}
                  data-line={row.line}
                  className={`mushafrow flex items-center overflow-hidden ${tajweed ? 'tj' : ''}`}
                  style={{
                    height: rowH,
                    justifyContent: ragged ? 'center' : row.words.length > 1 ? 'space-between' : 'flex-start',
                    lineHeight: `${rowH}px`,
                    color: ink,
                  }}
                >
                  {row.words.map((mw) => {
                    if (mw.w.char_type_name === 'end') {
                      const mark = marks[mw.vk]
                      const color = mark ? MARK_COLOR[mark] : '#8FBC8F'
                      // Medallion glyph: the `end` word's code_v2 IS the ornament
                      // with the verse number baked in. Tajweed → the page's QCF
                      // V4 font + e-* tint palette (override-colors recolours the
                      // ornament layers only, so the number keeps its ink); uthmani
                      // → the V2 page font (monochrome glyph, CSS colour tints the
                      // whole medallion — same as the app's native reader). The old
                      // hand-drawn ۝+digits broke wherever the device's Arabic
                      // fallback lacks U+06DD's digit-enclosing behaviour.
                      if (mw.w.code_v2 && (tajweed || fontReady)) {
                        return (
                          <span
                            key={mw.key}
                            className={tajweed ? `end gl e-${mark || 'def'}` : undefined}
                            style={{
                              color: tajweed ? undefined : color,
                              fontFamily: tajweed ? undefined : pageFontFamily(page),
                              fontSize: '1em',
                              paddingInline: '0.12em',
                            }}
                          >
                            {mw.w.code_v2}
                          </span>
                        )
                      }
                      const n = toArabic(Number(mw.vk.split(':')[1]))
                      return (
                        <span
                          key={mw.key}
                          style={{ color, fontSize: '1.15em', paddingInline: '0.12em' }}
                        >
                          {' '}
                          ۝{n}
                        </span>
                      )
                    }
                    const text = !tajweed && fontReady ? mw.w.code_v2 || mw.w.text_uthmani || '' : mw.w.text_uthmani || ''
                    if (!text) return null
                    return (
                      <span key={mw.key} style={!tajweed && fontReady ? { fontFamily: pageFontFamily(page) } : undefined}>
                        {text}
                      </span>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="h-7 w-7 animate-pulse rounded-full bg-sage/40" />
        </div>
      )}

      {model ? (
        <MushafFurnitureLayer model={model} rowH={rowH} padTop={padV + top} hPad={hPad} width={width} dark={dark} chapters={chapters} />
      ) : null}
    </div>
  )
}
