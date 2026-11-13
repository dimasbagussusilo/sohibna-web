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
export const MUSHAF_MEASURE_EM_8LINE = 12.4; // pages 1–2 large-type openings (fontTools-measured on QCF V2 p1: widest line 12.02em + medallion padding)
// Width-fit safety: the measured measure can run a few % small (probe timing,
// medallion padding), which clips the widest lines at the screen edges. Fit at
// 95% so every line lands inside the padded width with slack; the tajweed
// WebView additionally self-corrects from its measured scrollWidth.
export const MUSHAF_FIT_SAFETY = 0.95;

export function fallbackMeasureEm(lineCount: number): number {
  return lineCount <= 8 ? MUSHAF_MEASURE_EM_8LINE : MUSHAF_MEASURE_EM;
}

// Which side of the open spread a page sits on in the physical mushaf. A mushaf
// is bound on the RIGHT (RTL): sheet k shows its front (page 2k−1) on the LEFT
// of the spread and its back (page 2k) on the RIGHT — so ODD pages are left
// pages and EVEN pages are right pages, the mirror of Western books. Reading
// order within a spread is right page (even) first, then left (odd), and each
// lembar (sheet) is exactly one left page + one right page.
export type MushafPageSide = 'left' | 'right';
export const pageSide = (page: number): MushafPageSide => (page % 2 === 1 ? 'left' : 'right');

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

// ── Page frame (the traditional printed-mushaf border) ──────────────────────
// Concentric structure outside-in: paper margin (edge) → gold hairline (rule)
// → ornamental repeating-motif band → gold hairline → paper gap → text block,
// plus a corner medallion at each corner of the band centerline. All three
// renderers (native MushafPage, MushafTajweedPage WebView, web MushafPage)
// derive their geometry from this ONE spec so text insets and font shrink
// stay identical.

export interface MushafFrameSpec {
  edge: number; // paper margin: page-card edge → outer rule
  rule: number; // hairline weight (outer and inner rules)
  band: number; // ornamental band thickness (all four sides)
  gap: number; // paper gap: inner rule → text block
  insetX: number; // page-card edge → text block = edge + 2*rule + band + gap
  corner: number; // corner medallion side length
  tile: number; // band motif repeat pitch
  stroke: number; // motif stroke weight (≥0.6 for crispness)
  simple: boolean; // bands < 10 render the simplified diamond chain
}

export interface MushafFrameColors {
  gold: string;
  maroon: string;
  soft: string;
  paper: string;
  ink: string;
}

// Two-tone accent for the band motif (gold + maroon arabesque, like print).
export const MUSHAF_MAROON = { light: '#7E3B37', dark: '#9C6055' };

export function mushafFrameColors(dark: boolean): MushafFrameColors {
  return {
    gold: dark ? '#D9BC72' : '#B8933E',
    maroon: dark ? MUSHAF_MAROON.dark : MUSHAF_MAROON.light,
    soft: dark ? '#3A3323' : '#F3E9D2',
    paper: dark ? '#122A1F' : '#FBF8F1',
    ink: dark ? '#E8E2D6' : '#2C3E50',
  };
}

export function mushafFrameSpec(width: number): MushafFrameSpec {
  const band = Math.min(22, Math.max(7, Math.round(width * 0.04)));
  const gap = Math.round(4 + band * 0.45);
  const edge = 2;
  const rule = 1;
  return {
    edge,
    rule,
    band,
    gap,
    insetX: edge + 2 * rule + band + gap,
    // Corner medallion BOUNDING-box side. The medallion is a 45° knot centered
    // on the band centerline, so it overshoots the band by (corner−band)/2 =
    // 2dp inward (into the gap — always < gap) and outward (to 1dp inside the
    // page-card edge). Never larger: a bigger knot pokes past the card.
    corner: band + 4,
    tile: Math.max(10, Math.round(band * 1.6)),
    stroke: Math.max(0.6, band * 0.07),
    simple: band < 10,
  };
}

// Page box: composes the frame spec with the page cell dims. ONE derivation of
// contentW/contentH for all three renderers (replaces the per-renderer
// hPad/padV/folio arithmetic that had drifted: 12 vs 14 hPad, 26 vs 6 folio).
export interface MushafPageBox {
  spec: MushafFrameSpec;
  contentW: number;
  contentH: number;
  padX: number; // container horizontal padding (text inset)
  padTop: number; // container top padding (frame top structure + gap)
  bandBottom: number; // page bottom edge → inner face of the bottom band
  folioH: number; // folio strip height
  folioGap: number; // slack between text block and folio strip
}

export function mushafPageBox(
  width: number,
  height: number,
  lineCount: number,
  folioH = 26,
): MushafPageBox {
  const spec = mushafFrameSpec(width);
  // 8-line openings keep their extra side inset (edge clipping, 2026-11-04).
  const padX = spec.insetX + (lineCount <= 8 ? 6 : 0);
  const padTop = spec.insetX;
  const bandBottom = spec.edge + 2 * spec.rule + spec.band;
  const folioGap = 4;
  return {
    spec,
    contentW: width - padX * 2,
    contentH: height - padTop - bandBottom - folioH - folioGap,
    padX,
    padTop,
    bandBottom,
    folioH,
    folioGap,
  };
}

// ── Frame geometry (pure; shared by all three renderers) ────────────────────
// The frame decomposes into primitive shapes that react-native-svg, DOM SVG
// and the WebView HTML string all render identically: hairline rects (rules),
// one soft-filled band rect, and fill-bucketed PATHS (one path per palette
// color holds every star/diamond/dot subpath — a whole page frame is ~9 SVG
// elements). Rotations are baked into the vertices; no <Pattern>/<use>
// (react-native-svg Pattern is unreliable).

export type MushafFrameFill = 'gold' | 'maroon' | 'paper' | 'soft';

export type MushafFrameShape =
  | { k: 'rule'; x: number; y: number; w: number; h: number } // gold hairline rect
  | { k: 'ground'; x: number; y: number; w: number; h: number } // soft band rect
  | { k: 'path'; d: string; f: MushafFrameFill; sw?: number }; // filled path (+ gold stroke when sw)

export function mushafFrameShapes(W: number, H: number): MushafFrameShape[] {
  const out: MushafFrameShape[] = [];
  const s = mushafFrameSpec(W);
  const bx = s.edge + s.rule; // band outer offset
  const bi = bx + s.band; // band inner offset (inner rule)
  // Too small to frame (never in practice — page cards are ≥ ~250dp): the
  // renderers leave the page unframed rather than emitting negative rects.
  if (W < 4 * bi || H < 4 * bi) return out;

  const r2 = (n: number) => Math.round(n * 100) / 100;
  // 45°-rotated square ("diamond"), bounding box b centered at (cx, cy).
  const dia = (cx: number, cy: number, b: number) =>
    `M${r2(cx + b / 2)} ${r2(cy)}L${r2(cx)} ${r2(cy + b / 2)}L${r2(cx - b / 2)} ${r2(cy)}L${r2(cx)} ${r2(cy - b / 2)}Z`;
  // Axis-aligned square, side a.
  const sq = (cx: number, cy: number, a: number) =>
    `M${r2(cx - a / 2)} ${r2(cy - a / 2)}H${r2(cx + a / 2)}V${r2(cy + a / 2)}H${r2(cx - a / 2)}Z`;
  // Circle as two arcs (paths only — keeps the element count at ~9/page).
  const dot = (cx: number, cy: number, r: number) =>
    `M${r2(cx - r)} ${r2(cy)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0Z`;

  // Concentric rules + band ground.
  out.push({ k: 'rule', x: s.edge, y: s.edge, w: W - 2 * s.edge, h: H - 2 * s.edge });
  out.push({ k: 'ground', x: bx, y: bx, w: W - 2 * bx, h: H - 2 * bx });
  out.push({ k: 'rule', x: bi, y: bi, w: W - 2 * bi, h: H - 2 * bi });

  // Band motif, one run per side. Corner medallions cover the corners, so
  // tiles run BETWEEN them; the pitch stretches (p = Lu/n) so the run ends
  // exactly at the medallions — never a ragged partial tile.
  const cs = s.corner;
  const gold: string[] = [];
  const maroon: string[] = [];
  const paper: string[] = [];
  const side = (horizontal: boolean, far: boolean) => {
    const span = (horizontal ? W : H) - 2 * bx;
    const Lu = span - cs;
    if (Lu < s.tile) return; // too short to tile: rules + corners only
    const n = Math.max(1, Math.floor(Lu / s.tile));
    const p = Lu / n;
    const start = bx + cs / 2;
    const near = bx + s.band / 2;
    const cc = far ? (horizontal ? H : W) - bx - s.band / 2 : near; // centerline
    for (let i = 0; i < n; i++) {
      const m = start + i * p + p / 2; // tile center along the run
      const cx = horizontal ? m : cc;
      const cy = horizontal ? cc : m;
      if (s.simple) gold.push(dia(cx, cy, s.band * 0.5)); // woven diamond chain
      else {
        // 8-pointed star = axis-aligned ∪ 45° squares (both gold), paper pupil.
        const st = s.band * 0.62;
        gold.push(sq(cx, cy, st), dia(cx, cy, st));
        paper.push(dot(cx, cy, s.band * 0.16));
      }
    }
    // Seam accents at every tile boundary (the chain's interlocks).
    for (let i = 0; i <= n; i++) {
      const m = start + i * p;
      const cx = horizontal ? m : cc;
      const cy = horizontal ? cc : m;
      if (s.simple) maroon.push(dot(cx, cy, s.band * 0.12));
      else maroon.push(dia(cx, cy, s.band * 0.5));
    }
  };
  side(true, false); // top
  side(true, true); // bottom
  side(false, false); // left
  side(false, true); // right

  // Corner medallions: concentric square knots on the band centerline corners.
  const k = bx + s.band / 2;
  const plates: string[] = [];
  const cornM: string[] = [];
  const cornG: string[] = [];
  const cornP: string[] = [];
  for (const [cx, cy] of [
    [k, k],
    [W - k, k],
    [k, H - k],
    [W - k, H - k],
  ] as Array<[number, number]>) {
    plates.push(dia(cx, cy, cs)); // paper plate interrupts band + rules
    cornM.push(sq(cx, cy, cs * 0.62));
    cornG.push(dia(cx, cy, cs * 0.38));
    cornP.push(dot(cx, cy, cs * 0.09));
  }

  if (gold.length) out.push({ k: 'path', d: gold.join(''), f: 'gold' });
  if (maroon.length) out.push({ k: 'path', d: maroon.join(''), f: 'maroon' });
  if (paper.length) out.push({ k: 'path', d: paper.join(''), f: 'paper' });
  // One plate path for all four corners (paper fill + gold stroke = the knot).
  out.push({ k: 'path', d: plates.join(''), f: 'paper', sw: s.stroke * 1.4 });
  out.push({ k: 'path', d: cornM.join(''), f: 'maroon' });
  out.push({ k: 'path', d: cornG.join(''), f: 'gold' });
  out.push({ k: 'path', d: cornP.join(''), f: 'paper' });
  return out;
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

// Derive a page's furniture directly from its word placement — the same rules
// as scripts/gen-mushaf-layout.mjs (band directly above the basmala above a
// surah's first word; At-Tawbah and Al-Fatihah have no basmala). Used as the
// SELF-HEALING fallback when the bundled index and the placement disagree (a
// word lands on a furniture row): re-deriving from the live data keeps the
// page coherent instead of cramming the stray words into another row — the
// 2026-11 "mushaf nightmare" was exactly that cram amplifying a mixed state.
function deriveRowsFromWords(
  lineCount: number,
  firstWordRows: Map<number, number>, // surah → row of its first word on THIS page
): MushafRow[] {
  const rows: MushafRow[] = [];
  for (let l = 1; l <= lineCount; l++) rows.push({ line: l, type: 'text', surah: null, words: [] });
  const bands: { line: number; surah: number }[] = [];
  for (const [surah, r] of [...firstWordRows.entries()].sort((a, b) => a[1] - b[1])) {
    const noBasmala = surah === 1 || surah === 9;
    const bandLine = noBasmala ? r - 1 : r - 2;
    if (bandLine >= 1 && bandLine <= lineCount && rows[bandLine - 1].type === 'text') {
      rows[bandLine - 1].type = 'surah';
      bands.push({ line: bandLine, surah });
    }
    const basmalaLine = r - 1;
    if (!noBasmala && basmalaLine >= 1 && basmalaLine <= lineCount && rows[basmalaLine - 1].type === 'text')
      rows[basmalaLine - 1].type = 'basmala';
  }
  for (const b of bands.sort((a, b) => a.line - b.line)) rows[b.line - 1].surah = b.surah;
  return rows;
}

/**
 * Build the page model. `verses` may include straddling verses (whole-verse
 * objects from by_page); only their words with page_number === page are used.
 */
export function buildMushafPage(verses: Verse[], page: number): MushafPageModel {
  let lineCount = pageLineCount(page) || 15;
  let headers = [...pageSurahHeaders(page)];
  let rows: MushafRow[] = [];
  for (let l = 1; l <= lineCount; l++) {
    const type = lineType(page, l);
    rows.push({ line: l, type, surah: type === 'surah' ? (headers.shift() ?? null) : null, words: [] });
  }

  const sorted = [...verses].sort((a, b) => compareVk(a.verse_key, b.verse_key));

  // Pre-scan: which row carries each surah's first word, and does ANY word land
  // on a furniture row (index/data disagreement)? If so, rebuild the page's
  // furniture from the placement itself (deriveRowsFromWords) — the page stays
  // visually correct whatever the bundled index says.
  const firstWordRows = new Map<number, number>();
  let collision = false;
  const seenSurahs = new Set<number>();
  for (const v of sorted) {
    const onPage = v.words.filter((w) => w.page_number === page);
    if (onPage.length === 0) continue;
    const surah = Number(v.verse_key.split(':')[0]);
    for (const w of onPage) {
      if (w.line_number == null) continue;
      if (!seenSurahs.has(surah)) {
        seenSurahs.add(surah);
        firstWordRows.set(surah, w.line_number);
      }
      const row = rows[w.line_number - 1];
      if (row && row.type !== 'text') collision = true;
      if (w.line_number > lineCount) collision = true;
    }
  }
  if (collision) {
    rows = deriveRowsFromWords(lineCount, firstWordRows);
    headers = [];
    for (const r of rows) if (r.type === 'surah' && r.surah != null) headers.push(r.surah);
  }

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
