import { useEffect, useMemo, useRef } from 'react'
import { toArabic, type Verse, type WordPressInfo } from '@/lib/quran'
import { convertToImlai } from '@/lib/imlai'

// IndonesianVerse (web) renders the "Imla'i" (Indonesian educational mushaf,
// LPMQ style) script: quran.com's `text_uthmani_tajweed` field passed through
// convertToImlai (lib/imlai.ts), with the tajweed rules re-emitted as COLORED
// spans. On web this is a plain DOM fragment (no WebView) — Scheherazade New
// via Google Fonts, cached offline by the SW runtime cache.
//
// Structure contract (mirrors TajweedVerse exactly): per-word
// `<span class=qtword data-wk=…>` wrapping nested rule spans, the ayah-end
// medallion as `<span class=end data-vk=…>`, and .active classes for
// word/verse highlight — event delegation on the container reads the
// data-* attrs (no per-word listeners).

const px = (lvl: number) => 18 + (lvl - 1) * 3.3

// Tajweed rule → text colour. Hexes are the forensic fits from the reference
// MSI mushaf page (An-Nisa 4:80–91) — PENDING review against the printed
// mushaf before wide release.
const TAJWEED_COLORS: Record<string, string> = {
  ham_wasl: '#3ea570', // green — hamzat al-wasl, incl. its slnt variant
  slnt: '#3ea570', // silent letters (قَالُو۟ا۟'s alef…)
  laam_shamsiyah: '#25984d', // dark green — shamsi lam of ٱلشَّمس
  qalaqah: '#85a5b4', // grey-blue — qalqalah letters
  ghunnah: '#b3575c', // red-brown — نّ/مّ with ghunnah
  ikhafa: '#c13985', // pink — ikhfāʾ
  idgham_ghunnah: '#c13985', // pink — idghām with ghunnah
  ikhafa_shafawi: '#da95c1', // light pink — ikhfāʾ shafawī (م before ف/و)
  idgham_shafawi: '#da95c1', // light pink — idghām shafawī (م before م/ب)
  iqlab: '#8aaac3', // blue-grey — iqlāb
  idgham_wo_ghunnah: '#8d3742', // dark red — idghām without ghunnah
  idgham_mutajanisayn: '#4c4789', // purple — idghām mutajānisayn
  idgham_mutaqaribayn: '#4c4789', // purple — idghām mutaqāribayn
  madda_normal: '#d69a5b', // tan — 2-harakah madd
  madda_permissible: '#d69a5b', // tan — 2/4/6-harakah madd
  madda_obligatory: '#d69a5b', // tan — 4-5-harakah madd (quran.com's name)
  madda_necessary: '#d69a5b', // tan — 6-harakah madd (defensive alias)
}

// Google Fonts CSS for Scheherazade New (Naskh family designed for Quranic
// orthography). The SW 'gfonts' runtime cache keeps it offline.
const FONT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap');`

// A run of text under one tajweed rule (null = no rule / base text).
type Seg = { rule: string | null; text: string }

// Flatten the imlai-converted `<tajweed class=…>…</tajweed>` markup into
// flat segments (the markup is flat by construction).
function segments(html: string): Seg[] {
  const out: Seg[] = []
  let cur: string | null = null
  for (const tok of html.split(/(<[^>]+>)/g).filter(Boolean)) {
    if (!tok.startsWith('<')) {
      out.push({ rule: cur, text: tok })
      continue
    }
    if (tok.startsWith('</')) cur = null
    else {
      const m = tok.match(/class=([^\s>]+)/)
      cur = m ? m[1] : null
    }
  }
  return out
}

type WordParts = Array<{ rule: string | null; text: string }>

const ARABIC_LETTER = /[ء-يٱٲ]/

// Group segments into words on spaces; drop groups without Arabic letters so
// the word list lines up 1:1 with verse.words' `word`-type entries (the tap
// key contract `${verse_key}-${wordsIndex}` depends on it).
function wordsFrom(segs: Seg[]): WordParts[] {
  const words: WordParts[] = [[]]
  for (const s of segs) {
    const pieces = s.text.split(' ')
    pieces.forEach((p, i) => {
      if (i > 0) words.push([])
      if (p) words[words.length - 1].push({ rule: s.rule, text: p })
    })
  }
  return words.filter((w) => w.some((p) => ARABIC_LETTER.test(p.text)))
}

const escAttr = (s?: string): string =>
  (s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const MARK_COLOR: Record<string, string> = {
  fav: '#f59e0b',
  bk: '#3b82f6',
  label: '#8B5CF6',
}

export function buildIndonesianHtml(
  verses: Verse[],
  fontSize: number,
  dark: boolean,
  interactive: boolean,
  marks?: Record<string, 'fav' | 'bk' | 'label'>,
): string {
  const size = px(fontSize)
  const color = dark ? '#E8E2D6' : '#2C3E50'
  const ruleCss = Object.entries(TAJWEED_COLORS)
    .map(([rule, hex]) => `.tx-${rule}{color:${hex};}`)
    .join('')

  const body = verses
    .map((v) => {
      const tajweed = v.text_uthmani_tajweed
      const apiWords = v.words.filter((w) => w.char_type_name === 'word')
      const words = tajweed ? wordsFrom(segments(convertToImlai(tajweed))) : []
      const parity = words.length === apiWords.length

      let wordsHtml: string
      if (tajweed && parity) {
        wordsHtml = words
          .map((parts, i) => {
            const w = apiWords[i]
            const origIdx = v.words.indexOf(w)
            const inner = parts
              .map((p) =>
                p.rule && TAJWEED_COLORS[p.rule]
                  ? `<span class="tx-${p.rule}">${p.text}</span>`
                  : p.text,
              )
              .join('')
            const attrs = interactive
              ? ` data-wk="${escAttr(`${v.verse_key}-${origIdx}`)}" data-tr="${escAttr(w.transliteration?.text)}" data-tt="${escAttr(w.translation?.text)}" data-au="${escAttr(w.audio_url || '')}"`
              : ''
            return `<span class="qtword"${attrs}>${inner}</span> `
          })
          .join('')
      } else if (tajweed) {
        const inner = segments(convertToImlai(tajweed))
          .map((s) =>
            s.rule && s.rule !== 'end' && TAJWEED_COLORS[s.rule]
              ? `<span class="tx-${s.rule}">${s.text}</span>`
              : s.text,
          )
          .join('')
        wordsHtml = `<span class="qtword">${inner}</span> `
      } else {
        wordsHtml = `<span class="qtword">${convertToImlai(v.text_uthmani || '')}</span> `
      }

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
${FONT_CSS}
.iv-body{direction:rtl;text-align:center;color:${color};font-size:${size}px;line-height:2.2;font-family:'Scheherazade New',serif;}
${ruleCss}
.iv-body .end{color:#8FBC8F;font-size:0.85em;}
.iv-body .qtword.active{background-color:rgba(143,188,143,0.3);border-radius:4px;cursor:pointer;}
.iv-body .end.active{background-color:rgba(143,188,143,0.35);border-radius:6px;cursor:pointer;}
.iv-body .markbadge{position:absolute;top:-0.35em;right:-0.2em;font-size:0.55em;line-height:1;white-space:nowrap;}
</style><div class="iv-body">${body}</div>`
}

export function IndonesianVerse({
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
  // Value signature (not array identity) — see TajweedVerse's versesSig note.
  const versesSig = useMemo(() => verses.map((v) => v.verse_key).join('|'), [verses])
  const html = useMemo(
    () => buildIndonesianHtml(verses, fontSize, dark, interactive, marks),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [versesSig, fontSize, dark, interactive, marks],
  )
  const wrapRef = useRef<HTMLDivElement>(null)

  // Highlight the active word / medallion by toggling classes on real DOM nodes.
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
