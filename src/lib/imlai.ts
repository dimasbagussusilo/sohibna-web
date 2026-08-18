/**
 * Uthmani (Madinah rasm) → Rasm Imla'i (Indonesian educational mushaf, LPMQ
 * style) converter for quran.com's `text_uthmani_tajweed` HTML.
 *
 * Philosophy: "if a letter is not pronounced, it must be removed from the text
 * so a beginner cannot misread it as a long vowel". Concretely:
 *
 *   1. Waw Zā'idah (the silent waw of أُولَـٰٓئِكَ / أُولِي / أُولُو / أُولَات) is deleted.
 *   2. All hamzah seats are simplified: أ/إ → ا, hamzat al-wasl ٱ → ا, and the
 *      floating hamzah that merely carries the ā of ٱلْقُرْءَانِ merges into
 *      ا + dagger alef (ٱلْقُرْاٰنِ).
 *   3. Madd letters (و after ḍamma, ي after kasra, written bare in Uthmani)
 *      get an explicit round sukun: رَدُّوهُ → رَدُّوْهُ, حُيِّيتُم → حُيِّيْتُمْ.
 *   4. Uthmani marks are standardised: jazm U+06E1 (and the rounded-zero
 *      variant) → sukun U+0652; open tanween U+08F0–U+08F2 → standard tanween
 *      U+064B/U+064C/U+064D. Every other dead consonant (the sukun-less ن of
 *      عِندِ, the idgham-shamsi lam of ٱلنَّار, …) also gains a sukun.
 *
 * Rules 3 and 4's "every dead consonant" clause collapse into one mechanic:
 * any pronounced letter with no vowel mark on it gets U+0652 — the madd و/ي of
 * rule 3 is just the common case.
 *
 * TAG SAFETY: quran.com's tajweed markup is flat `<tajweed class=rule>text
 * </tajweed>` (plus `<span class=end>…</span>`), and diacritics routinely sit
 * in a DIFFERENT tag than their base letter (e.g. 2:2
 * `ذ<tajweed class=madda_normal>َٲ</tajweed>لِكَ` — the fatha belongs to ذ).
 * So no regex ever runs on the raw HTML. Instead the text is tokenised into
 * tags + text nodes, the characters are linearised into a "cell" list (each
 * cell remembers which text token it came from), the rules run over the
 * cells, and the HTML is re-serialised: mutated chars stay in their original
 * token (hence their original span), inserted chars are anchored to the token
 * of the letter they decorate, and a tag whose content was fully deleted
 * (the `slnt` span around a removed waw) is dropped as an empty pair.
 */

const SUKUN = 'ْ';
const FATHA = 'َ';
const DAMMA = 'ُ';
const KASRA = 'ِ';
const SHADDA = 'ّ';
const FATHATAN = 'ً';
const DAMMATAN = 'ٌ';
const KASRATAN = 'ٍ';
const DAGGER_ALEF = 'ٰ';
const ALEF = 'ا';
const HAMZA = 'ء';
const ALEF_MADDA_GLYPH = 'ٲ'; // quran.com's precomposed alef+maddah (U+0672)
const TATWEEL = 'ـ';
const ZWNJ = '‌';

// Uthmani-only marks → standard Imla'i equivalents (rule 4a).
const MARK_NORMALIZATION: Record<string, string> = {
  'ۡ': SUKUN, // Uthmani jazm (small high dotless head of khah)
  '۟': SUKUN, // small high rounded zero — quran.com's other jazm glyph
  '۠': SUKUN, // small high upright rectangular zero (x1386 in the corpus)
  'ࣰ': FATHATAN, // open fathatan
  'ࣱ': DAMMATAN, // open dammatan
  'ࣲ': KASRATAN, // open kasratan
  'ࣳ': FATHATAN, // open fathatan (two-dot variant)
};

// Marks that put a letter into an explicit vowel state (harakah, tanween,
// sukun/jazm, shadda, dagger alef, maddah, or a quranic small letter like ۥ/ۦ
// that marks the silent pronoun vowels). A letter NOT followed by one of these
// is "dead" and per rules 3/4b must carry a sukun — unless the letter itself
// is quiescent by nature (see NO_SUKUN). Waqf signs (ۖ ۗ ۚ …) deliberately do
// NOT count: they carry no vowel information.
const VOWEL_MARKS = new Set<string>([
  FATHA,
  DAMMA,
  KASRA,
  SHADDA,
  SUKUN,
  FATHATAN,
  DAMMATAN,
  KASRATAN,
  'ٓ', // maddah above
  'ٔ', // hamza above
  'ٕ', // hamza below
  'ٖ', // subscript alef (rare; treated as a vowel state)
  'ٗ', // alef above
  '٘', // noon above (defensive; not expected in this corpus)
  DAGGER_ALEF,
  'ۡ',
  '۟',
  'ۥ', // small waw (لَهُۥ "lahū")
  'ۦ', // small yeh (عَلَيْهِۦ "ʿalayhi")
  'ۧ', // small high yeh (ٱلنَّبِيِّـۧنَ)
  'ࣰ',
  'ࣱ',
  'ࣲ',
  'ࣳ',
]);

// Pronounced letters of the Uthmani corpus. Alef-family seats (ا أ إ ٱ ٲ آ),
// alef maksura (ى = final ā), tatweel (stretch / hamza seat) and the floating
// hamza are excluded — they never take a sukun.
const LETTER_RE = /[ء-غف-يٱٲ]/;
const NO_SUKUN = new Set<string>([
  HAMZA,
  'آ', // آ alef madda
  'أ', // أ
  'إ', // إ
  ALEF,
  TATWEEL,
  'ى', // ى alef maksura
  'ٱ', // ٱ alef wasla
  'ٲ', // ٲ (quran.com's madda-alef)
]);

// Any combining mark of the quranic ranges (harakat, waqf signs, small
// letters, quranic annotation marks, open tanween).
const COMBINING_RE = /[ؐ-ًؚ-ٰٟۖ-ۭ࣓-ࣿ]/;

/**
 * Waw Zā'idah lexicon (rule 1). Letter-skeleton prefixes matched at a word
 * boundary; `*` marks the silent waw to delete. Standard regexes miss these
 * because the waw carries its own sukun and (in the tajweed markup) its own
 * `slnt` span. Two mark-level guards (both verified against the full Quran
 * corpus) disambiguate look-alikes and are enforced in removeWawZaidah:
 *
 *   - the أ must carry a DAMMA. أُو۟لَـٰٓئِكَ (ulāʾika, silent waw) vs
 *     أَوْثَٰنا / أَوْزَعَنِى / أَوْلِيَاء (fatha, pronounced w).
 *   - the waw itself must carry a SUKUN/jazm. أُو۟لِى (ulī, silent) vs
 *     أُولَىٰ "al-ūlā" (92:13 — bare waw: the madd ū, which instead GAINS a
 *     sukun via rule 3).
 */
export const WAW_ZAIDAH_LEXICON: ReadonlyArray<{ skeleton: string; word: string }> = [
  { skeleton: 'أ*ولئ', word: 'أُولَـٰٓئِكَ / أُولَـٰٓئِكُمْ (ulāʾika…)' },
  { skeleton: 'أ*ولاء', word: 'أُو۟لَآءِ (ulāʾi)' },
  // prefix entry: covers أُولُو and أُولُوا۟ + suffixes (أُولُوهُمْ …)
  { skeleton: 'أ*ولو', word: 'أُولُو / أُولُوا۟ (ulū)' },
  // ulī is written أُو۟لِى with alef maksura — same skeleton as the
  // PRONOUNCED أُولَىٰ (ūlā, e.g. أُولَىٰهُمْ); the sukun-on-waw guard
  // separates them: only أُو۟لِى loses its waw, أُولَىٰهُمْ keeps it.
  { skeleton: 'أ*ولى', word: 'أُو۟لِى (ulī — ulī l-albāb, ulī n-nuhā)' },
  // 65:4 أُو۟لَـٰتُ — the ـٰ is a mark on ل, so the skeleton has no alef.
  { skeleton: 'أ*ولت', word: 'أُو۟لَـٰتُ (ulāt — 65:4)' },
];

type Token = { raw: string; tag: boolean };

/** One text character, remembering which text token (hence which tajweed
 * span) it belongs to. Inserted characters take the token of the letter they
 * decorate, so spans keep wrapping the transformed characters. */
type Cell = { ch: string; ti: number };

export class ImlaiConverter {
  /** Convert one verse's `text_uthmani_tajweed` (or plain Uthmani text). */
  static convertToImlai(text: string): string {
    const tokens = this.tokenize(text);
    let cells: Cell[] = [];
    tokens.forEach((tok, ti) => {
      if (!tok.tag) for (const ch of tok.raw) cells.push({ ch, ti });
    });
    cells = this.normalizeMarks(cells); // rule 4a first: one canonical mark set
    cells = this.removeWawZaidah(cells); // rule 1
    cells = this.simplifyHamzah(cells); // rule 2
    cells = this.annotateMuqattaat(cells); // muqattaʿāt read as letter names
    cells = this.injectSukun(cells); // rules 3 + 4b
    return this.serialize(tokens, cells);
  }

  private static tokenize(text: string): Token[] {
    return text
      .split(/(<[^>]+>)/g)
      .filter(Boolean)
      .map((raw) => ({ raw, tag: raw.startsWith('<') }));
  }

  // Rule 4a — canonical marks so later passes only ever look for U+0652 etc.
  private static normalizeMarks(cells: Cell[]): Cell[] {
    return cells.map((c) =>
      MARK_NORMALIZATION[c.ch] ? { ...c, ch: MARK_NORMALIZATION[c.ch] } : c,
    );
  }

  // Rule 1 — delete the silent waw (+ its sukun) of the Waw Zā'idah words.
  // The family is written with attached prefixes too (وَأُو۟لَـٰتُ, فَأُو۟لَـٰٓئِكَ,
  // لِأُو۟لِى, يَـٰٓأُو۟لِى), so the skeleton matches anywhere in the verse —
  // the two mark guards (damma on أ, jazm on و) plus the required ل are what
  // keep it safe: the full-Quran corpus scan shows the only أُ+jazm-waw
  // outside this family is سَأُو۟رِيكُمْ (pronounced ū, no ل after the waw).
  private static removeWawZaidah(cells: Cell[]): Cell[] {
    const letterIdx: number[] = [];
    cells.forEach((c, i) => {
      if (LETTER_RE.test(c.ch)) letterIdx.push(i);
    });
    const skeleton = letterIdx.map((i) => cells[i].ch).join('');

    const drop = new Set<number>();
    for (const { skeleton: pattern } of WAW_ZAIDAH_LEXICON) {
      const chars = [...pattern];
      const delPos = chars.indexOf('*');
      const needle = chars.filter((c) => c !== '*').join('');
      // Prefix semantics: أُولُو must also match أُولُوهُمْ, أُولَـٰٓئِكَ also
      // أُولَـٰٓئِكُمْ, so only the needle needs to fit.
      for (let s = 0; s + needle.length <= skeleton.length; s++) {
        if (skeleton.slice(s, s + needle.length) !== needle) continue;
        // Guard 1: the أ must carry a damma (ulāʾika family). أَوْثَٰنا /
        // أَوْزَعَنِى / أَوْلِيَاء (fatha on أ) have a pronounced waw.
        if (!this.carriesMark(cells, letterIdx[s], [DAMMA])) continue;
        // Guard 2: the waw itself must be sukun-marked. ٱلْأُولَىٰ (92:13
        // "al-ūlā") has a BARE waw — the madd ū — which instead gains a
        // sukun via rule 3 and must survive.
        const wawCell = letterIdx[s + delPos];
        if (!this.carriesMark(cells, wawCell, [SUKUN])) continue;
        // Drop the waw cell and every mark attached to it (its sukun).
        drop.add(wawCell);
        for (let j = wawCell + 1; j < cells.length && COMBINING_RE.test(cells[j].ch); j++) {
          drop.add(j);
        }
      }
    }
    return drop.size ? cells.filter((_, i) => !drop.has(i)) : cells;
  }

  // True when one of `marks` appears directly attached to the letter at
  // `letterIdx` (the combining run between it and the next letter).
  private static carriesMark(cells: Cell[], letterIdx: number, marks: string[]): boolean {
    for (let j = letterIdx + 1; j < cells.length; j++) {
      const ch = cells[j].ch;
      if (COMBINING_RE.test(ch)) {
        if (marks.includes(ch)) return true;
      } else if (ch !== TATWEEL && ch !== ZWNJ) {
        return false;
      }
    }
    return false;
  }

  // Rule 2 — simplify every hamzah seat.
  private static simplifyHamzah(cells: Cell[]): Cell[] {
    // 2a/2b: أ إ ٱ → ا (LPMQ orthography writes word-initial hamzah seats as a
    // bare alef: إِذَا → اِذَا, أَفَلَا → اَفَلَا). ٲ (quran.com's madda-alef,
    // always the ā seat: ذَٲلِكَ/صِرَٲطَ/سَمَٲوَٲتِ) → ا + dagger alef, keeping
    // the length visible the LPMQ way: ذَٰلِكَ/صِرَٰطَ.
    const out: Cell[] = [];
    for (const c of cells) {
      if (c.ch === 'أ' || c.ch === 'إ' || c.ch === 'ٱ') out.push({ ...c, ch: ALEF });
      else if (c.ch === ALEF_MADDA_GLYPH) {
        out.push({ ...c, ch: ALEF }, { ch: DAGGER_ALEF, ti: c.ti });
      } else out.push(c);
    }

    // 2c: floating hamzah of the ٱلْقُرْءَانِ family merges into ا + dagger
    // alef: ٱلْقُرْءَانَ → الْقُرْاٰنَ. This is lexicon-driven, not a general
    // "hamza before alef" rule: the corpus shows THREE hamza+alef shapes and
    // only this one merges —
    //   - ءَامَنَ / ءَايَـٰت (word-initial hamza onset): untouched;
    //   - سَوْءَٲتِهِمَا / سُوٓءًا / جُزْءًا (hamza after a sukun-closed
    //     letter): the hamza IS the onset of the next syllable (saw-ʾa-…),
    //     kept;
    //   - قُرْءَان (hamza after sukun-closed ر, preceded by ق): LPMQ drops
    //     the hamza and writes the ā as ا+ٰ.
    const drop = new Set<number>();
    const insertions: Array<{ after: number; ch: string }> = [];
    for (let i = 0; i < out.length; i++) {
      if (out[i].ch !== HAMZA) continue;
      // The alef must be the next letter (only marks/tatweel in between).
      let j = i + 1;
      while (j < out.length && (COMBINING_RE.test(out[j].ch) || out[j].ch === TATWEEL || out[j].ch === ZWNJ)) j++;
      if (!out[j] || out[j].ch !== ALEF) continue;
      // The two letters before the hamza must be a sukun-closed ر preceded
      // by ق (قُرْ) — the full corpus has no other ق…رءا word.
      let p = i - 1;
      while (p >= 0 && (COMBINING_RE.test(out[p].ch) || out[p].ch === TATWEEL || out[p].ch === ZWNJ)) p--;
      if (p < 0 || out[p].ch !== 'ر' || !this.carriesMark(out, p, [SUKUN])) continue;
      let q = p - 1;
      while (q >= 0 && (COMBINING_RE.test(out[q].ch) || out[q].ch === TATWEEL || out[q].ch === ZWNJ)) q--;
      if (q < 0 || out[q].ch !== 'ق') continue;
      // Delete the hamza and any harakah sitting on it (the fatha of ءَا);
      // hang a dagger alef on the alef so the ā stays long — unless the ٲ
      // expansion above already put one there (قُرْءَٲنًا).
      drop.add(i);
      for (let k = i + 1; k < j; k++) drop.add(k);
      if (out[j + 1]?.ch !== DAGGER_ALEF) insertions.push({ after: j, ch: DAGGER_ALEF });
    }
    if (!drop.size) return out;
    const result: Cell[] = [];
    out.forEach((c, idx) => {
      if (!drop.has(idx)) result.push(c);
      const ins = insertions.filter((x) => x.after === idx);
      for (const x of ins) result.push({ ch: x.ch, ti: c.ti }); // same span as the alef
    });
    return result;
  }

  // Rule 4b note (iqlab): a bare ن carrying ONLY the iqlab small-meem ۢ
  // (سُنۢبُلَٰت) is a dead consonant — ۢ is a rule marker, not a vowel, so it
  // is excluded from VOWEL_MARKS and injectSukun adds the round sukun
  // (نْۢ). Tanween-carrying iqlab (أَلِيمٌۢ) is untouched: the tanween IS
  // the vowel state.

  // Opening letters (muqattaʿāt): a BARE verse-initial letter is recited as
  // its NAME (طه = ṭā-hā, حم = ḥā-mīm, كهيعص's bare ه/ع/ص), so it takes a
  // dagger alef (طٰهٰ), never a sukun. Letters already carrying a maddah or
  // dagger (يسٓ, كهيعص's كٓ) keep their own mark. Muqattaʿāt are always the
  // first word of a verse and consist solely of letters from the discrete
  // muqattaʿāt alphabet (no ٱ/ا digraph words like الٓمٓ reach the bare
  // branch — their alef is NO_SUKUN anyway).
  private static annotateMuqattaat(cells: Cell[]): Cell[] {
    const MUQ_ALPHABET = new Set('قمصكيطهعسحين'.split(''));
    // First word = cells up to the first space (tag boundaries are not word
    // boundaries; only a literal space is).
    const end = cells.findIndex((c) => c.ch === ' ');
    const wordEnd = end === -1 ? cells.length : end;
    const letters = cells.slice(0, wordEnd).filter((c) => LETTER_RE.test(c.ch));
    if (
      letters.length < 1 ||
      letters.length > 5 ||
      !letters.every((c) => MUQ_ALPHABET.has(c.ch))
    ) {
      return cells;
    }
    // Give every BARE letter of the word a dagger alef (in its own span).
    const out: Cell[] = [];
    for (let i = 0; i < cells.length; i++) {
      out.push(cells[i]);
      if (i >= wordEnd || !LETTER_RE.test(cells[i].ch) || NO_SUKUN.has(cells[i].ch)) continue;
      let hasVowel = false;
      for (let j = i + 1; j < wordEnd; j++) {
        const m = cells[j].ch;
        if (COMBINING_RE.test(m)) {
          if (VOWEL_MARKS.has(m)) hasVowel = true;
        } else if (m !== TATWEEL && m !== ZWNJ) break;
      }
      if (!hasVowel) out.push({ ch: DAGGER_ALEF, ti: cells[i].ti });
    }
    return out;
  }

  // Rules 3 + 4b — a sukun on every dead consonant. Madd و/ي are the bare
  // letters after ḍamma/kasra; every other bare pronounced letter is dead too
  // (the ن of عِندِ, the shamsi lam of ٱلنَّار). Letters with any vowel mark,
  // alef-family seats, ى, tatweel and bare hamza are skipped. The mark run
  // after a letter may live in other spans — hence the cell scan, not regex
  // on the HTML.
  private static injectSukun(cells: Cell[]): Cell[] {
    const out: Cell[] = [];
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      out.push(c);
      if (!LETTER_RE.test(c.ch) || NO_SUKUN.has(c.ch)) continue;
      let hasVowel = false;
      for (let j = i + 1; j < cells.length; j++) {
        const m = cells[j].ch;
        if (COMBINING_RE.test(m)) {
          if (VOWEL_MARKS.has(m)) hasVowel = true;
        } else if (m !== TATWEEL && m !== ZWNJ) {
          break; // next letter / space / ayah digit — the mark scan stops
        }
      }
      if (!hasVowel) out.push({ ch: SUKUN, ti: c.ti }); // inside the letter's span
    }
    return out;
  }

  private static serialize(tokens: Token[], cells: Cell[]): string {
    const byToken = new Map<number, string[]>();
    for (const c of cells) {
      const bucket = byToken.get(c.ti);
      if (bucket) bucket.push(c.ch);
      else byToken.set(c.ti, [c.ch]);
    }
    let html = tokens
      .map((tok, ti) => (tok.tag ? tok.raw : (byToken.get(ti) || []).join('')))
      .join('');
    // A span whose whole content was deleted (the `slnt` pair around a
    // removed waw) is dropped, innermost first, so the markup stays clean.
    for (;;) {
      const next = html.replace(/<([a-zA-Z][^\s>]*)(?:"[^"]*"|'[^']*'|[^>"'])*><\/\1>/g, '');
      if (next === html) return html;
      html = next;
    }
  }
}

/** Convenience: convert plain (markup-free) Uthmani text through the same
 * pipeline — the tokenizer simply sees one text token. */
export function convertToImlai(text: string): string {
  return ImlaiConverter.convertToImlai(text);
}
