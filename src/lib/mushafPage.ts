// Mushaf page model — the pure layout engine for the traditional Madinah
// 15-line mushaf view (components/quran/mushaf/).
//
// Structure comes from the bundled index (lib/mushafLayout.ts): per-page line
// count (pages 1–2 are the mushaf's 8-line large-type openings) and which lines
// are furniture (surah header bands / basmala). Word placement comes from the
// quran.com API: every word already carries page_number + line_number, so a
// page is literally "the words whose page_number === page, bucketed by line".
//
// `verses` should be the page's verse slice from loadVerses({kind:'page', id}).
// NOTE: by_page returns whole verses that merely TOUCH the page (a verse can
// straddle a boundary) — this module filters per WORD, so a straddling verse
// renders its earlier words on the previous page and its later words (and its
// end medallion) here. Never render a straddling verse from both pages.
//
// Mirrored verbatim in sohibna-web/src/lib/mushafPage.ts — keep the twins in
// lock-step (platform twins convention; see lib/quran.ts).

import type { Verse, Word } from './quran';
// .ts extension: node --test resolves literal paths only (native TS stripping);
// Metro resolves it as a normal file path too. tsconfig sets
// rewriteRelativeImportExtensions so tsc accepts it.
import { lineType, pageLineCount, pageSurahHeaders, type MushafLineType } from './mushafLayout.ts';

// The exact Uthmani basmala (1:1 text_uthmani as served by the API). QCF page
// fonts carry no basmala glyphs (probed; quran.com itself ships an SVG), so
// basmala rows render this in Scheherazade New instead of the page font.
export const BASMALA_UTHMANI = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';

export interface MushafWord {
  // `${verseKey}-${wordIndex}` — the reader's existing wordKey contract.
  key: string;
  vk: string;
  idx: number;
  w: Word;
}

export type MarkKind = 'juz' | 'hizb' | 'rub' | 'sajda';

export interface MushafMark {
  line: number;
  kind: MarkKind;
  // juz/hizb/rub number, or 1/2 for sajda (recommended/obligatory).
  n: number;
}

export interface MushafRow {
  line: number;
  type: MushafLineType;
  // Surah id for 'surah' rows (k-th header row ↔ k-th entry of the page's
  // header list); null for text/basmala rows.
  surah: number | null;
  words: MushafWord[];
}

export interface MushafPageModel {
  page: number;
  lineCount: number;
  rows: MushafRow[];
  marks: MushafMark[];
  firstVk: string | null;
  lastVk: string | null;
}

// Font metrics. The QCF page fonts are PRE-JUSTIFIED: a line's glyph advances
// sum to a near-constant measure (~15.7em on 15-line pages; ~11.2em on the
// 8-line large-type openings of pages 1–2; the fonts map NO space glyph), with
// the print's kashida stretching baked into word advances. So the CORRECT font
// size is derived from WIDTH (contentWidth ÷ measureEm), not from row height —
// height-based sizing underfills lines and `space-between` then invents huge
// artificial gaps. measureEm comes from a runtime probe of the rendered page
// (see MushafPage/MushafTajweedPage/web twin); the fallbacks below cover the
// pre-probe paint.
export const MUSHAF_MEASURE_EM = 15.7; // 15-line pages (measured across pages)
export const MUSHAF_MEASURE_EM_8LINE = 11.3; // pages 1–2 large-type openings
// Width-fit safety: the measured measure can run a few % small (probe timing,
// medallion padding), which clips the widest lines at the screen edges. Fit at
// 95% so every line lands inside the padded width with slack; the tajweed
// WebView additionally self-corrects from its measured scrollWidth.
export const MUSHAF_FIT_SAFETY = 0.95;

export function fallbackMeasureEm(lineCount: number): number {
  return lineCount <= 8 ? MUSHAF_MEASURE_EM_8LINE : MUSHAF_MEASURE_EM;
}

// Line slack ratio above which a line is rendered CENTERED (ragged) instead of
// both-edge justified — the print mushaf centers genuinely short verse-end
// lines (e.g. the closing surahs on page 604) rather than stretching them.
export const MUSHAF_RAGGED_SLACK = 0.25;

/**
 * Page metrics from a measured line width.
 * fontSize fits the longest line to the content width, clamped by the row
 * budget (very wide screens must not overflow vertically). rowH follows the
 * print's leading (≈1.5em, capped by the even row split) and `top` centers the
 * line block in the content box (phone screens are taller than a mushaf page,
 * so the leading never fills the full height).
 */
export function mushafMetrics(
  contentW: number,
  contentH: number,
  lineCount: number,
  measureEm: number,
): { fontSize: number; rowH: number; top: number } {
  // Contain: the height clamp divides by the minimum leading (1.2em) so
  // glyphs can never be taller than their rows on short/landscape screens.
  const fontSize = Math.min((contentW * MUSHAF_FIT_SAFETY) / Math.max(measureEm, 1), (contentH / lineCount) / 1.2);
  const rowH = Math.min(contentH / lineCount, fontSize * 1.75);
  const top = Math.max(0, (contentH - rowH * lineCount) / 2);
  return { fontSize, rowH, top };
}

/**
 * Natural (width-fit, height-unbounded) metrics — when the viewport is too
 * SHORT for a width-fit page (landscape), size to the WIDTH for readable
 * glyphs and grow to natural height; the page cell scrolls vertically.
 * Returns the text block's height (page components add their paddings).
 */
export function mushafNaturalMetrics(
  contentW: number,
  lineCount: number,
  measureEm: number,
): { fontSize: number; rowH: number; blockH: number } {
  const fontSize = (contentW * MUSHAF_FIT_SAFETY) / Math.max(measureEm, 1);
  const rowH = fontSize * 1.75;
  return { fontSize, rowH, blockH: rowH * lineCount };
}

// Whether a line renders ragged (centered) instead of both-edge justified:
// the print mushaf centers genuinely short verse-end lines instead of
// stretching them across the measure. `lineWidth` is the line's intrinsic
// glyph width at the current fontSize; `fullWidth` the page's widest line.
export function isRaggedLine(lineWidth: number, fullWidth: number): boolean {
  if (fullWidth <= 0) return false;
  return fullWidth - lineWidth > fullWidth * MUSHAF_RAGGED_SLACK;
}

const compareVk = (a: string, b: string) => {
  const [sa, aa] = a.split(':').map(Number);
  const [sb, ab] = b.split(':').map(Number);
  return sa === sb ? aa - ab : sa - sb;
};

/**
 * Build the page model. `verses` may include straddling verses (whole-verse
 * objects from by_page); only their words with page_number === page are used.
 */
export function buildMushafPage(verses: Verse[], page: number): MushafPageModel {
  const lineCount = pageLineCount(page) || 15;
  const headers = [...pageSurahHeaders(page)];
  const rows: MushafRow[] = [];
  for (let l = 1; l <= lineCount; l++) {
    const type = lineType(page, l);
    rows.push({ line: l, type, surah: type === 'surah' ? (headers.shift() ?? null) : null, words: [] });
  }

  const sorted = [...verses].sort((a, b) => compareVk(a.verse_key, b.verse_key));
  const marks: MushafMark[] = [];
  let firstVk: string | null = null;
  let lastVk: string | null = null;

  // Words without line_number (defensive: pre-mushaf-field cached payloads)
  // are spread evenly across the page's TEXT rows so the page still renders.
  const orphanWords: MushafWord[] = [];
  let haveLineNumbers = false;

  let prevJuz: number | undefined;
  let prevHizb: number | undefined;
  let prevRub: number | undefined;

  for (const v of sorted) {
    const onPage = v.words.filter((w) => w.page_number === page);
    if (onPage.length === 0) continue;
    if (firstVk === null) firstVk = v.verse_key;
    lastVk = v.verse_key;

    for (let i = 0; i < v.words.length; i++) {
      const w = v.words[i];
      if (w.page_number !== page) continue;
      const mw: MushafWord = { key: `${v.verse_key}-${i}`, vk: v.verse_key, idx: i, w };
      if (w.line_number == null) orphanWords.push(mw);
      else {
        haveLineNumbers = true;
        const row = rows[w.line_number - 1];
        // Furniture rows are reserved — a word there would mean the layout
        // index and the API disagree; fall back to the first text row rather
        // than corrupting the page.
        (row && row.type === 'text' ? row : rows.find((r) => r.type === 'text'))?.words.push(mw);
      }
    }

    // Margin marks: only for CHANGES within this page's slice. A juz/hizb that
    // starts on an earlier page carries its mark there (its first verse here is
    // mid-unit, prev===undefined → baseline, no mark).
    const firstLine = onPage.find((w) => w.line_number != null)?.line_number ?? 1;
    if (v.juz_number != null) {
      if (prevJuz !== undefined && v.juz_number !== prevJuz)
        marks.push({ line: firstLine, kind: 'juz', n: v.juz_number });
      prevJuz = v.juz_number;
    }
    if (v.hizb_number != null) {
      if (prevHizb !== undefined && v.hizb_number !== prevHizb)
        marks.push({ line: firstLine, kind: 'hizb', n: v.hizb_number });
      prevHizb = v.hizb_number;
    }
    if (v.rub_el_hizb_number != null) {
      if (prevRub !== undefined && v.rub_el_hizb_number !== prevRub)
        marks.push({ line: firstLine, kind: 'rub', n: v.rub_el_hizb_number });
      prevRub = v.rub_el_hizb_number;
    }
    if (v.sajda_number != null && v.sajda_number > 0)
      marks.push({ line: firstLine, kind: 'sajda', n: v.sajda_number });
  }

  if (!haveLineNumbers && orphanWords.length) {
    const textRows = rows.filter((r) => r.type === 'text');
    const per = Math.ceil(orphanWords.length / Math.max(1, textRows.length));
    orphanWords.forEach((mw, i) => {
      const row = textRows[Math.min(textRows.length - 1, Math.floor(i / per))];
      row?.words.push(mw);
    });
  }

  return { page, lineCount, rows, marks, firstVk, lastVk };
}
