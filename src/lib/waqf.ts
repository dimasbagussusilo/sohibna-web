// Waqf (الوقف) — pausal pronunciation for voweled Arabic, applied only to text
// sent to a TTS engine.
//
// WHY: the niat/dua strings in this app are fully voweled mushaf text. In
// continuous recitation (waṣl) every ḥarakah is sounded, including the
// case-ending vowels (iʿrāb — fatḥah/ḍammah/kasrah, and tanwīn). But when the
// reciter STOPS on a word (waqf), that word's final letter is treated as
// carrying sukun, so its trailing vowel is silenced: Allāhu akbaru → Allāhu
// akbar, ʿalīmun → ʿalīm, kathīran → kathīrā. A TTS engine reads the diacritics
// verbatim, so without waqf processing it pronounces every iʿrāb ending — which
// is the "akbaru / alhamdulillaahu" the user hears on Listen.
//
// Each phrase this app speaks is a standalone utterance the user recites and
// then pauses, so every pause boundary should be pronounced pausally. This
// strips the final-letter iʿrāb at each pause boundary (end of the text and
// after each ،  ؛  ۔  . separator) and otherwise leaves the text — including all
// mid-sentence waṣl vowels — untouched. It is applied ONLY to the text sent to
// speech; the on-screen Arabic keeps its full vowels.
//
// The rules implemented here are the standard waqf rules for the final letter:
//   - single short vowel (fatḥah/ḍammah/kasrah) → removed, replaced by sukun
//     (shaddah, if present, already closes the consonant, so no sukun is added)
//   - tanwīn (fatḥatain/ḍammatain/kasratain) → removed; if it was fatḥatain on
//     a consonant followed by an alif (or alif maqṣūrah), the alif stays and
//     yields the long "aa" (كَثِيرًا → كَثِيرَا)
//   - an already-sukun/madd/hamzah/long-vowel final letter → left alone

// Combining tashkīl marks.
const FATHATAAN = 'ً' // ً
const DAMMATAAN = 'ٌ' // ٌ
const KASRATAAN = 'ٍ' // ٍ
const FATHAH = 'َ' // َ
const DAMMAH = 'ُ' // ُ
const KASRAH = 'ِ' // ِ
const SHADDAH = 'ّ' // ّ
const SUKUN = 'ْ' // ْ

const TASHKIL = new Set<string>([FATHATAAN, DAMMATAAN, KASRATAAN, FATHAH, DAMMAH, KASRAH, SHADDAH, SUKUN])
const VOWEL = new Set<string>([FATHAH, DAMMAH, KASRAH]) // single short case-ending vowels
const TANWIN = new Set<string>([FATHATAAN, DAMMATAAN, KASRATAAN])
const ALEFS = new Set<string>(['ا', 'آ', 'أ', 'إ']) // ا آ أ إ
const ALEF_MAKSURA = 'ى' // ى

/** An Arabic base letter (ء .. ي). Combining marks and punctuation excluded. */
function isBaseLetter(ch: string): boolean {
  const c = ch.codePointAt(0)
  return c !== undefined && c >= 0x0621 && c <= 0x064a
}

/** Silence the final-letter iʿrāb of one segment (text between pause marks). */
function waqfSegment(segment: string): string {
  const chars = Array.from(segment)
  let end = chars.length
  while (end > 0 && chars[end - 1] === ' ') end--
  if (end === 0) return segment

  // Last base letter within [0, end).
  let lastBase = -1
  for (let i = end - 1; i >= 0; i--) {
    if (isBaseLetter(chars[i])) {
      lastBase = i
      break
    }
  }
  if (lastBase < 0) return segment

  const finalLetter = chars[lastBase]

  // Case A: final letter is an alif / alif maqṣūrah. The tanwīn may live on the
  // preceding consonant (كَثِيرًا, هُدًى) — drop that fatḥatain, keep the alif.
  if (ALEFS.has(finalLetter) || finalLetter === ALEF_MAKSURA) {
    let prev = lastBase - 1
    while (prev >= 0 && TASHKIL.has(chars[prev])) prev--
    if (prev >= 0 && isBaseLetter(chars[prev])) {
      const marks = chars.slice(prev + 1, lastBase)
      if (marks.includes(FATHATAAN)) {
        const kept = marks.filter((m) => m !== FATHATAAN)
        chars.splice(prev + 1, lastBase - (prev + 1), ...kept)
      }
    }
    return chars.join('')
  }

  // Case B: final letter is a normal consonant. Gather its diacritics.
  let j = lastBase + 1
  while (j < end && TASHKIL.has(chars[j])) j++
  const marks = chars.slice(lastBase + 1, j)

  const vowel = marks.find((m) => VOWEL.has(m) || TANWIN.has(m))
  if (!vowel) return chars.join('') // already sukun / no vowel — nothing to silence

  const hasShaddah = marks.includes(SHADDAH)
  const kept = marks.filter((m) => m !== vowel)
  // Shaddah already closes the consonant; otherwise make the silence explicit.
  if (!hasShaddah && !kept.includes(SUKUN)) kept.push(SUKUN)
  chars.splice(lastBase + 1, j - (lastBase + 1), ...kept)
  return chars.join('')
}

/**
 * Apply waqf to `text`, silencing the case-ending vowel at every pause boundary
 * (end of the text and after each ،  ؛  ۔  . separator). Mid-sentence waṣl vowels
 * are preserved. Safe to call on already-pausal or non-Arabic text — it only
 * ever strips a trailing vowel/tanwīn from the last letter of a pause segment.
 */
export function applyWaqf(text: string): string {
  if (!text) return text
  // Capture-group split keeps the separators so we can rejoin verbatim.
  const parts = text.split(/([،؛.۔]|\n)/)
  return parts.map((p, i) => (i % 2 === 1 ? p : waqfSegment(p))).join('')
}
