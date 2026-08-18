import type { CSSProperties } from 'react'
import { toArabic, type Script, type Verse, type WordPressInfo } from '@/lib/quran'
import { TajweedVerse } from './TajweedVerse'
import { IndonesianVerse } from './IndonesianVerse'
import { INDO_PAK_FAMILY, isFontLoaded, pageFontFamily } from '@/lib/qcfFonts'

// Font size (1–10) → px, matching the reader's px() scale.
const px = (lvl: number) => 18 + (lvl - 1) * 3.3

// Renders a verse's Arabic in the chosen script (web port of the RN
// ArabicText — same font system, plain DOM spans):
//   - tajweed: QF tajweed HTML fragment (TajweedVerse).
//   - uthmani: each word's `code_v2` glyphs in the QCF V2 font of the Mushaf
//     PAGE that word sits on. Until that page font has loaded, the word falls
//     back to its Unicode `text_uthmani`.
//   - indopak: each word's `text_indopak` in the IndoPak Nastaleeq font.
//   - indonesian: Rasm Imla'i (LPMQ) HTML fragment (IndonesianVerse).
// Words are nested <span>s (per-word font). QCF code_v2 glyphs are
// pre-shaped, so per-word nesting does not break Arabic joining.
//
// Ayah-end marker: the API's per-verse `end` word carries a `code_v2` glyph
// that is the full Mushaf medallion — ornament WITH the verse number inside.
// Rendered in the page's QCF V2 font (green-gold); while loading, falls back
// to ۝+number.
export function ArabicText({
  verse,
  script,
  fontSize,
  dark,
  onWordPress,
  activeWordKey,
}: {
  verse: Verse
  script: Script
  fontSize: number
  dark?: boolean
  onWordPress?: (info: WordPressInfo) => void
  activeWordKey?: string | null
}) {
  if (script === 'tajweed' || script === 'indonesian') {
    const Comp = script === 'tajweed' ? TajweedVerse : IndonesianVerse
    return (
      <Comp
        verses={[verse]}
        fontSize={fontSize}
        dark={!!dark}
        onWordPress={onWordPress}
        activeWordKey={activeWordKey}
      />
    )
  }

  const size = px(fontSize)
  const lineHeight = script === 'indopak' ? size * 2.5 : size * 2.0
  const color = dark ? '#E8E2D6' : '#2C3E50'

  const base: CSSProperties = {
    fontSize: size,
    lineHeight: `${lineHeight}px`,
    textAlign: 'center',
    direction: 'rtl',
    unicodeBidi: 'isolate',
    display: 'block',
    color,
  }

  return (
    <span style={base}>
      {verse.words.map((w, i) => {
        if (w.char_type_name === 'end') {
          // Ayah-end medallion: the `end` word's code_v2 in its QCF V2 page
          // font is the ornament WITH the verse number inside.
          const fam = w.page_number ? pageFontFamily(w.page_number) : undefined
          if (fam && isFontLoaded(fam) && w.code_v2) {
            return (
              <span key={w.id || i} style={{ fontFamily: fam, color: '#8FBC8F' }}>
                {w.code_v2}{' '}
              </span>
            )
          }
          return (
            <span key={w.id || i} style={{ color: '#8FBC8F' }}>{` ۝${toArabic(verse.verse_number)} `}</span>
          )
        }
        let fontFamily: string | undefined
        let text: string
        if (script === 'indopak') {
          fontFamily = isFontLoaded(INDO_PAK_FAMILY) ? INDO_PAK_FAMILY : undefined
          text = w.text_indopak || w.text_uthmani || ''
        } else {
          // uthmani — page glyph font + code_v2 once that page is loaded.
          const fam = w.page_number ? pageFontFamily(w.page_number) : undefined
          const glyph = fam ? isFontLoaded(fam) : false
          fontFamily = glyph ? fam : undefined
          text = glyph ? w.code_v2 || w.text_uthmani || '' : w.text_uthmani || ''
        }
        if (!text) return null
        const wordKey = `${verse.verse_key}-${i}`
        const isActive = activeWordKey === wordKey
        return (
          <span
            key={w.id || i}
            style={{
              fontFamily,
              backgroundColor: isActive ? 'rgba(143,188,143,0.3)' : undefined,
              borderRadius: isActive ? 4 : undefined,
              cursor: onWordPress ? 'pointer' : undefined,
            }}
            onClick={
              onWordPress
                ? (e) =>
                    onWordPress({
                      x: e.clientX,
                      y: e.clientY,
                      wordKey,
                      translit: w.transliteration?.text,
                      translation: w.translation?.text,
                      audioUrl: w.audio_url,
                    })
                : undefined
            }
          >
            {text}{' '}
          </span>
        )
      })}
    </span>
  )
}
