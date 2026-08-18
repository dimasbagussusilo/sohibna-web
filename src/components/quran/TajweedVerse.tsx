import { useEffect, useMemo, useRef } from 'react'
import { toArabic, type Verse, type WordPressInfo } from '@/lib/quran'

// TajweedVerse (web) renders tajweed colouring exactly like the RN app's
// WebView version — each word's `code_v2` glyphs in the QCF V4 COLR colour
// font for that word's page, with @font-palette-values picking the light
// (base-palette 0) or dark (1) palette. On web the HTML is injected directly
// into the DOM (dangerouslySetInnerHTML): no WebView, no postMessage bridge —
// word taps are plain event delegation reading data-* attrs, and offline
// works for free because the SW runtime-caches the font CDN.

const px = (lvl: number) => 18 + (lvl - 1) * 3.3
const QCF_CDN = 'https://verses.quran.foundation/fonts/quran/hafs'

function pagesIn(verses: Verse[]): number[] {
  return Array.from(
    new Set(
      verses
        .flatMap((v) => v.words)
        .filter((w) => w.char_type_name === 'word' && w.page_number)
        .map((w) => w.page_number),
    ),
  )
}

// Escape a string for safe use inside a double-quoted HTML attribute (word
// transliteration/translation can contain quotes).
const escAttr = (s?: string): string =>
  (s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// Mark colour for the ayah-end medallion in reading mode (mirrors ReadingFlow):
// the flowing text has no per-verse header, so the medallion colour surfaces
// favorite/bookmark/label state at a glance.
const MARK_COLOR: Record<string, string> = {
  fav: '#f59e0b',
  bk: '#3b82f6',
  label: '#8B5CF6',
}

// Build the verse body fragment (no <html> wrapper on web — this lands inside
// the app's own DOM). Includes the per-page font-faces + palettes + classes.
export function buildTajweedHtml(
  verses: Verse[],
  fontSize: number,
  dark: boolean,
  interactive: boolean,
  marks?: Record<string, 'fav' | 'bk' | 'label'>,
): string {
  const size = px(fontSize)
  const color = dark ? '#E8E2D6' : '#2C3E50'
  const theme = dark ? 'D' : 'L'
  const pages = pagesIn(verses)

  const fontFaces = pages
    .map(
      (p) =>
        `@font-face{font-family:'QCF_V4_P${p}';src:url('${QCF_CDN}/v4/colrv1/woff2/p${p}.woff2') format('woff2');font-display:swap;}`,
    )
    .join('')
  const palettes = pages
    .map(
      (p) =>
        `@font-palette-values --QCF_V4_P${p}-L{font-family:'QCF_V4_P${p}';base-palette:0;}` +
        `@font-palette-values --QCF_V4_P${p}-D{font-family:'QCF_V4_P${p}';base-palette:1;}`,
    )
    .join('')
  const classes = pages
    .map((p) => `.p${p}{font-family:'QCF_V4_P${p}';font-palette:--QCF_V4_P${p}-${theme};}`)
    .join('')

  const body = verses
    .map((v) => {
      const wordsHtml = v.words
      .map((w, i) => {
          if (w.char_type_name === 'end') return ''
          const text = w.code_v2 || w.text_uthmani || ''
          if (!text) return ''
          const pageCls = w.page_number && pages.includes(w.page_number) ? `p${w.page_number}` : ''
          // Word-by-word: bake translit/translation/audio + a unique word key
          // into data-* attrs — the container's onClick reads them from
          // e.target (event delegation; no per-word listeners).
          const attrs = interactive
            ? ` data-wk="${escAttr(`${v.verse_key}-${i}`)}" data-tr="${escAttr(w.transliteration?.text)}" data-tt="${escAttr(w.translation?.text)}" data-au="${escAttr(w.audio_url || '')}"`
            : ''
          return `<span class="qtword ${pageCls}"${attrs}>${text}</span> `
        })
        .join('')
      // Ayah-end medallion: clickable when interactive → opens the verse
      // action bar. For a marked verse the medallion is coloured and the mark
      // icon is a badge on it (see .markbadge).
      const endAttrs = interactive ? ` data-vk="${escAttr(v.verse_key)}"` : ''
      const mark = marks?.[v.verse_key]
      const endColor = mark ? MARK_COLOR[mark] : '#8FBC8F'
      const endStyle = mark ? ` style="color:${endColor};position:relative;"` : ''
      const markGlyph = mark === 'fav' ? '★' : mark === 'bk' ? '🔖' : mark === 'label' ? '🏷️' : ''
      const badge = mark ? `<span class="markbadge" style="color:${endColor}">${markGlyph}</span>` : ''
      return `${wordsHtml}<span class="end"${endAttrs}${endStyle}> ۝${toArabic(v.verse_number)}${badge}</span> `
    })
    .join('')

  return `<style>
.tv-body{direction:rtl;text-align:center;color:${color};font-size:${size}px;line-height:2.0;}
${fontFaces}${palettes}${classes}
.tv-body .end{color:#8FBC8F;}
.tv-body .qtword.active{background-color:rgba(143,188,143,0.3);border-radius:4px;cursor:pointer;}
.tv-body .end.active{background-color:rgba(143,188,143,0.35);border-radius:6px;cursor:pointer;}
.tv-body .markbadge{position:absolute;top:-0.35em;right:-0.2em;font-size:0.55em;line-height:1;white-space:nowrap;}
</style><div class="tv-body">${body}</div>`
}

export function TajweedVerse({
  verses,
  fontSize,
  dark,
  onWordPress,
  activeWordKey,
  onAyahPress,
  activeAyahKey,
  marks,
}: {
  verses: Verse[]
  fontSize: number
  dark: boolean
  onWordPress?: (info: WordPressInfo) => void
  activeWordKey?: string | null
  onAyahPress?: (verseKey: string) => void
  activeAyahKey?: string | null
  marks?: Record<string, 'fav' | 'bk' | 'label'>
}) {
  const interactive = !!(onWordPress || onAyahPress)
  // Content signature — rebuild only on a real content change (the array
  // identity changes spuriously in reading mode).
  const versesSig = useMemo(() => verses.map((v) => v.verse_key).join('|'), [verses])
  const html = useMemo(
    () => buildTajweedHtml(verses, fontSize, dark, interactive, marks),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [versesSig, fontSize, dark, interactive, marks],
  )
  const wrapRef = useRef<HTMLDivElement>(null)

  // Highlight the active word / medallion by toggling classes on the real DOM
  // nodes (no rebuild).
  useEffect(() => {
    const root = wrapRef.current
    if (!root || !interactive) return
    root.querySelectorAll('.qtword.active, .end.active').forEach((el) =>
      el.classList.remove('active'),
    )
    if (activeWordKey) {
      root.querySelector(`.qtword[data-wk="${CSS.escape(activeWordKey)}"]`)?.classList.add('active')
    }
    if (activeAyahKey) {
      root.querySelector(`.end[data-vk="${CSS.escape(activeAyahKey)}"]`)?.classList.add('active')
    }
  }, [activeWordKey, activeAyahKey, interactive, html])

  // Event delegation: one listener for all word/medallion taps.
  const onClick = (e: React.MouseEvent) => {
    if (!interactive) return
    const target = (e.target as HTMLElement).closest<HTMLElement>('.qtword, .end')
    if (!target) return
    if (target.classList.contains('qtword') && onWordPress) {
      onWordPress({
        x: e.clientX,
        y: e.clientY,
        wordKey: target.dataset.wk || '',
        translit: target.dataset.tr || undefined,
        translation: target.dataset.tt || undefined,
        audioUrl: target.dataset.au || null,
      })
    } else if (target.classList.contains('end') && onAyahPress) {
      onAyahPress(target.dataset.vk || '')
    }
  }

  return (
    <div
      ref={wrapRef}
      onClick={onClick}
      style={interactive ? { WebkitUserSelect: 'none', userSelect: 'none' } : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
