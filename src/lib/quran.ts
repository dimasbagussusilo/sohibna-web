// Quran data layer — types + API client for the reader.
//
// Ported from ../quran/src/app/App.tsx. The web app called /api/quran and
// /api/gading (Next.js proxies); here we point at the sohibna backend's own
// proxies (/quran/api -> api.quran.com, /quran/gading -> api.quran.gading.dev).
// Response shapes are identical, so the parsing logic is a near-verbatim port.
//
// Module-level mutable caches survive re-renders and are shared across screens
// (mirrors the web app's footnoteCache / indoTafsirMap / audioFileCache).

import { API_BASE_URL } from '@/config';
import { cachedContent } from './quranCache';

// ── ENDPOINTS ───────────────────────────────────────────────────────────────

// Backend proxies (see sohibna-api internal/quran/proxy.go).
export const API = `${API_BASE_URL}/quran/api`; // -> https://api.quran.com/api/v4
export const GADING = `${API_BASE_URL}/quran/gading`; // -> https://api.quran.gading.dev

// Verse recitation audio is served from this CDN; the API returns relative URLs.
export const AUDIO_BASE = 'https://audio.qurancdn.com/';

// ── TYPES ───────────────────────────────────────────────────────────────────

export type Script = 'tajweed' | 'uthmani' | 'indopak' | 'indonesian';
export type DisplayMode = 'reading' | 'verse';
// A navigation source. 'surah'/'juz'/'page' map 1:1 to Quran.com endpoints.
// 'lembar' is the Indonesian Mushaf-Pojok reading unit — ONE lembar = TWO
// consecutive mushaf pages (a physical sheet, front + back). 604 pages → 302
// lembar (see LEMBAR_COUNT). Boundaries are the physical page breaks, exactly
// matching the Pojok layout the existing `page_number`/code_v2 already encodes.
export type SourceKind = 'surah' | 'juz' | 'page' | 'lembar';
export type NavTab = 'surah' | 'verse' | 'juz' | 'page' | 'lembar';

// Tap payload for word-by-word / footnote tooltips. `x`/`y` are SCREEN (dp)
// coordinates from the press event (native) or WebView-origin-mapped (tajweed) —
// the reader positions the bubble above that point.
export interface WordPressInfo {
  x: number;
  y: number;
  // `${verseKey}-${wordIndex}` — identifies the tapped word so the reader can
  // highlight it and toggle the popup on a second tap of the same word.
  wordKey: string;
  translit?: string;
  translation?: string;
  audioUrl?: string | null;
}
export interface FootnotePressInfo {
  x: number;
  y: number;
  id: string;
  marker: string;
}

export interface Chapter {
  id: number;
  name_arabic: string;
  name_simple: string;
  translated_name: { name: string };
  verses_count: number;
  revelation_place: string;
}

export interface Word {
  id: number;
  position: number;
  audio_url: string | null;
  char_type_name: string;
  code_v1: string;
  code_v2: string;
  text_uthmani: string;
  text_indopak?: string;
  page_number: number;
  line_number?: number;
  transliteration?: { text: string };
  translation?: { text: string };
}

export interface Verse {
  id: number;
  verse_key: string;
  verse_number: number;
  words: Word[];
  translations: Array<{ resource_id: number; text: string }>;
  text_uthmani?: string;
  text_uthmani_tajweed?: string;
  text_indopak?: string;
  // Global rukūʿ number (1..558) — the thematic section the verse belongs to.
  // Requested via `fields=ruku_number`; drives the ع markers between ruku
  // sections. A ruku never crosses a surah boundary.
  ruku_number?: number;
}

export interface Reciter {
  id: number;
  reciter_name: string;
  style?: { name: string };
}

export interface Source {
  kind: SourceKind;
  id: number;
}

export interface Juz {
  juz_number: number;
  verse_mapping: Record<string, string>;
  verses_count: number;
}

export interface LastReadEntry {
  verseKey: string;
  timestamp: number;
}

// A named reading mark's value: the verse it points at + when it was last set.
// `ts` lets "Continue Reading" pick the most-recently-created mark. Values may
// arrive as a bare string ("2:5") from older data — the helpers below tolerate
// both shapes so a pre-migration library still renders.
export interface ReadingMark {
  verseKey: string;
  ts: number;
}
export type ReadingMarkValue = ReadingMark | string;
export const markVerseKey = (v: ReadingMarkValue): string =>
  typeof v === 'string' ? v : v?.verseKey ?? '';
export const markTs = (v: ReadingMarkValue): number =>
  typeof v === 'string' ? 0 : v?.ts ?? 0;

// Snapshot of the translation/tafsir flags captured when entering reading mode.
// NOTE: displayModeTransition no longer hides/restores these (translations/tafsir
// now persist across the mode switch); kept on UserData + synced only so older
// clients' stashed data merges cleanly. Inert otherwise.
export type ReadingSnapshot = {
  showEnglish: boolean;
  showIndonesian: boolean;
  showEnglishTafsir: boolean;
  showIndoTafsir: boolean;
};

// ── Account-attached progress + prefs (0008) ────────────────────────────────
// Declared HERE (not imported from reflection/) because reflection/history.ts
// already type-imports from this module; a value import would close the cycle.
// The server mirrors these shapes in quran_prayer_days.data / quran_reflections
// .payload (migration 0008) — keep the field names in lock-step.

// One Home prayer-tracker day. Booleans per prayer; the whole object is one
// sync unit (last-write-wins per day, never merged per-prayer across devices).
export type PrayerDay = {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
};

// One Daily Reflection chat message (user question / assistant reply).
export type ReflectionChatMessage = { role: 'user' | 'assistant'; content: string };

// One Daily Reflection entry: the mood-specific ayah shown that day plus the
// AI companion transcript. `updatedAt` orders the merged local-vs-remote list
// (a local in-progress entry can be newer than the server's copy); it never
// resolves sync conflicts — those are server sync_seq, last-write-wins.
export type ReflectionEntryData = {
  date: string; // YYYY-MM-DD
  mood: string; // MoodId ('calm'|'sad'|'anxious'|'tired')
  verseKey: string;
  messages: ReflectionChatMessage[];
  updatedAt: number; // epoch ms
};

export type AppLang = 'id' | 'en' | 'ar';

// App-level prefs riding the reader-settings KV under 'app.*' keys. Fields are
// null until the account has a value, so a fresh login never overwrites the
// device-local setting with a default. `alarms` is opaque (AlarmSettings-shaped
// on RN, never applied on web) so this shared module stays platform-neutral.
export type AppSettings = {
  darkMode: boolean | null;
  lang: AppLang | null;
  alarms: unknown | null;
};

export interface UserData {
  favorites: string[];
  bookmark: string | null;
  labels: Record<string, string[]>;
  // Every label the user has ever typed — drives the suggestion list in the label
  // picker so previously-used labels are offered again. (Labels are user-defined,
  // not a fixed set.)
  labelLibrary: string[];
  lastRead: Record<number, LastReadEntry>;
  // Account-attached progress (0008): Home prayer tracker, keyed by device-local
  // 'YYYY-MM-DD'. One day = one sync unit (whole boolean map, last-write-wins).
  prayerDays: Record<string, PrayerDay>;
  // Daily Reflection entries keyed 'YYYY-MM-DD:<mood>'. One entry = one sync unit
  // (verse + AI chat transcript whole). Guests keep these in local storage only.
  reflections: Record<string, ReflectionEntryData>;
  // App-level prefs synced under 'app.*' reader-setting keys. null = no account
  // value → the device-local setting stands.
  appSettings: AppSettings;
  // Named "last read" slots — user-named reading marks, each holding exactly ONE
  // verse (overwritten on re-mark) PLUS the timestamp it was last set, so we can
  // tell which mark was created/touched most recently ("Continue Reading"). Synced
  // whole-map as one reader setting (see useQuranData).
  lastReadSlots: Record<string, ReadingMark>;
  script: Script;
  fontSize: number;
  reciterId: number;
  showEnglish: boolean;
  showIndonesian: boolean;
  showEnglishTafsir: boolean;
  showIndoTafsir: boolean;
  // True once the user manually picks translations/tafsir in Reader Settings —
  // pauses the "content follows app language" behaviour so their choice sticks
  // until the next language change (which clears it). See useQuranContentLang.
  contentLangOverride: boolean;
  // Playback speed multiplier (1 = normal). Persisted to backend readerSettings.
  audioRate: number;
  // Repeat + experience. repeatMode drives the scheduler in useQuranAudio;
  // repeatCount = 0 means ∞. Range bounds are verse keys ("surah:verse"), null =
  // unbounded (defaults to the whole loaded surah).
  repeatMode: RepeatMode;
  repeatCount: number;
  repeatRangeFrom: string | null;
  repeatRangeTo: string | null;
  autoScroll: boolean;
  // Word-by-word sync experience: highlight the spoken word, and pop up its
  // translit/translation during playback.
  wordHighlight: boolean;
  wordPopup: boolean;
  // Reading (continuous) vs verse-by-verse. Persisted + synced. Switching modes no
  // longer touches the translation/tafsir flags (they persist); `readingSnapshot`
  // is retained only for back-compat with previously-synced data.
  displayMode: DisplayMode;
  readingSnapshot: ReadingSnapshot | null;
  // Richer reading (server-derived, synced). streak is null until the first
  // /state or /changes payload carries it; khatmGoals is the live goal set.
  streak: StreakInfo | null;
  khatmGoals: KhatmGoal[];
  // Hafalan (memorization). hafalanTargets is the live goal set; memorized is the
  // per-verse map keyed by verse_key. Both synced whole-row (last-write-wins).
  hafalanTargets: HafalanTarget[];
  memorized: Record<string, MemorizedVerse>;
}

// StreakInfo is the cached daily-streak rollup, recomputed server-side from the
// reading log (in the user's TZ) whenever a session is logged.
export type StreakInfo = {
  current: number;
  longest: number;
  lastReadDate: string; // YYYY-MM-DD or ''
  totalPages: number;
};

// KhatmGoal is a reading goal in the quran.com "Reading Goal" model. Progress is
// NOT stored here — it's derived server-side from the reading log and fetched via
// /quran/me/goals/progress (see GoalProgress). type=daily resets each day; type=
// duration splits the target across [startAt,endAt] with auto-adjusting portions.
// unit: time=minutes, page=mushaf pages, range=verses in [rangeFrom,rangeTo].
export type GoalType = 'daily' | 'duration';
export type GoalUnit = 'time' | 'page' | 'range';
export type KhatmGoal = {
  id: string;
  type: GoalType;
  unit: GoalUnit;
  target: number;
  rangeFrom?: string | null; // "surah:ayah", only for unit=range
  rangeTo?: string | null;
  startAt: string; // RFC3339
  endAt: string; // RFC3339, '' = open-ended
};

// GoalProgress is the live, derived progress for one goal (fetched fresh, never
// synced). todayProgress/todayTarget drive the ring; periodProgress/periodTarget
// the duration summary.
export type GoalProgress = {
  id: string;
  type: GoalType;
  unit: GoalUnit;
  periodProgress: number;
  periodTarget: number;
  todayProgress: number;
  todayTarget: number;
  done: boolean;
};

// ── Hafalan (memorization) ──────────────────────────────────────────────────
// Distinct from reading goals: a hafalan target tracks which specific ayat the
// user has *memorized* (not read), plus a spaced-repetition review (murajaah)
// schedule so memorized portions resurface. Progress is client-derived —
// count(memorized ∩ scope) / scope size — from the per-verse map, so no server
// progress endpoint is needed (unlike reading goals, which derive from the log).

// What a memorization target is scoped to.
export type HafalanScope = 'surah' | 'juz' | 'range' | 'daily_rate';

// A memorization target. Only the field matching `scope` is set; the rest are
// null. `daily_rate` is ongoing (memorize N new ayat/day) with no end target.
export type HafalanTarget = {
  id: string;
  scope: HafalanScope;
  surahId?: number | null; // scope='surah' (1..114)
  juzId?: number | null; // scope='juz' (1..30)
  rangeFrom?: string | null; // scope='range' — verse keys "surah:ayah"
  rangeTo?: string | null;
  dailyAyahs?: number | null; // scope='daily_rate'
  deadline?: string | null; // RFC3339, optional
  createdAt: string; // RFC3339
  archived?: boolean;
};

// Manual-recall grade the user gives themselves in the murajaah flow (SM-2-lite).
export type ReviewOutcome = 'again' | 'hard' | 'good' | 'easy';
export type MemorizedStatus = 'learning' | 'memorized';

// Per-verse memorized record, keyed by verse_key in UserData.memorized. Carries
// BOTH the manual status flag AND the SM-2-lite review state, so one row = one
// sync unit (clean last-write-wins per verse). `dueAt` drives the review queue.
// `verifiedBy` is inert in v1 (manual/null); reserved for the phase-2 AI
// recite-and-check flow.
export type MemorizedVerse = {
  verseKey: string; // "2:255" — also the map key
  surah: number;
  ayah: number;
  status: MemorizedStatus;
  memorizedAt: string | null; // RFC3339 when first marked memorized
  // SM-2-lite review state (meaningful when status === 'memorized'):
  ease: number; // start 2.5, floor 1.3, cap 3.0
  intervalDays: number; // 0 = due today
  dueAt: string; // RFC3339 — the field the review queue sorts on
  reviewCount: number;
  lastReviewedAt: string | null;
  lapses: number;
  verifiedBy?: 'manual' | 'ai' | null;
};

export type RepeatMode = 'none' | 'single' | 'range' | 'surah';

export const REPEAT_CONFIG_KEYS = [
  'repeatMode',
  'repeatCount',
  'repeatRangeFrom',
  'repeatRangeTo',
  'autoScroll',
] as const;

export const DEFAULT_USER_DATA: UserData = {
  favorites: [],
  bookmark: null,
  labels: {},
  labelLibrary: [],
  lastRead: {},
  lastReadSlots: {},
  script: 'tajweed',
  fontSize: 5,
  reciterId: 7,
  showEnglish: true,
  showIndonesian: false,
  showEnglishTafsir: false,
  showIndoTafsir: false,
  contentLangOverride: false,
  audioRate: 1,
  repeatMode: 'none',
  repeatCount: 0,
  repeatRangeFrom: null,
  repeatRangeTo: null,
  autoScroll: false,
  wordHighlight: false,
  wordPopup: false,
  displayMode: 'verse',
  readingSnapshot: null,
  streak: null,
  khatmGoals: [],
  hafalanTargets: [],
  memorized: {},
  prayerDays: {},
  reflections: {},
  appSettings: { darkMode: null, lang: null, alarms: null },
};

// displayModeTransition — switching verse ↔ reading mode. Shared by the reader's
// live header toggle and the ReaderSettingsSheet draft (both operate on a
// UserData-shaped object), so the two entry points can never diverge.
//
// Translations/tafsir are NO LONGER force-hidden in reading mode — the user's show*
// settings persist across the switch (they render in the verse action bar / verse
// cards, never in the flowing reading text itself). `readingSnapshot` is therefore
// left inert; kept on UserData only for back-compat with older synced data.
export function displayModeTransition(
  ud: UserData,
  next: DisplayMode,
): Partial<UserData> {
  if (next === ud.displayMode) return {};
  return { displayMode: next };
}

// ── MODULE-LEVEL CACHES ─────────────────────────────────────────────────────

const footnoteCache = new Map<string, string>(); // id → text
const indoTafsirMap = new Map<number, Record<number, string>>(); // surah → {verse → text}
const audioFileCache = new Map<string, Map<string, string>>(); // "s-r" → {vk → url}
const versesCache = new Map<string, Verse[]>(); // "kind:id" → verses
const surahInfoCache = new Map<string, { source: string; text: string }>();

// English tafsir (Ibn Kathir, resource 169) is fetched per-chapter once.
const enTafsirLoaded = new Set<string>(); // `ch${surah}`
const enTafsirMap = new Map<string, string>(); // `169-${verseKey}` → text

// ── HELPERS ─────────────────────────────────────────────────────────────────

// Strip HTML tags + decode the common entities the Quran APIs emit. The web
// app used DOMParser; RN has no DOM, so a regex stripper stands in for plain-text
// extraction (translation/tafsir snippets). Rich HTML rendering (tajweed, surah
// info) is handled separately via WebView.
const ENTITY: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
export const stripHtml = (html: string): string =>
  (html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-z#0-9]+;/gi, (m) => ENTITY[m] ?? m)
    .trim();

// Normalize a string for search matching: lowercase, strip Arabic diacritics
// (harakat/tatweel) so "الرَّحْمَة" matches "الرحمة", and collapse whitespace.
// Used by the Quran Search screen's surah filter so Arabic-script names and
// transliterations match regardless of diacritics.
const ARABIC_DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۨ-ۭـ]/g;
export const normalizeForSearch = (s: string): string =>
  (s || '')
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, '')
    .replace(/\s+/g, ' ')
    .trim();

export const toArabic = (n: number) =>
  n.toString().replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);

// Distinct mushaf pages (1..604) touched by a slice of verses. A verse's page is
// its words' `page_number`; a single verse can straddle a page boundary, so union
// every word's page rather than sampling one. Used to count real "pages read" for
// the streak/goals (replaces the old ayahs/15 guess) and the current-page readout.
export const versesToPages = (verses: { words: { page_number?: number }[] }[]): number[] => {
  const s = new Set<number>();
  for (const v of verses) for (const w of v.words) if (w.page_number) s.add(w.page_number);
  return [...s].sort((a, b) => a - b);
};
export const pageCount = (verses: { words: { page_number?: number }[] }[]): number =>
  versesToPages(verses).length;

// ── LEMBAR (Mushaf-Pojok reading unit) ──────────────────────────────────────
// 1 lembar = 2 consecutive mushaf pages (a sheet, front + back). The standard
// mushaf is 604 pages → 302 lembar. Lembar N spans pages (2N-1, 2N). These are
// pure functions over the page numbers the API already returns.
export const LEMBAR_COUNT = 302;
export const PAGE_COUNT = 604;
export const lembarToPages = (n: number): [number, number] => [2 * n - 1, 2 * n];
export const pageToLembar = (page: number): number => Math.max(1, Math.ceil(page / 2));

// Indices in a sorted verse list where the rukūʿ section changes — i.e. the
// FIRST verse of each new ruku (after the opening one). The reader renders an ع
// marker BEFORE each of these verses. A ruku change also always coincides with
// the start of a new thematic section; the final verse of a surah is not a
// boundary (no trailing marker). Returns [] when ruku_number is absent.
export const rukuBoundaries = (verses: { ruku_number?: number }[]): number[] => {
  const out: number[] = [];
  let prev: number | undefined;
  for (let i = 0; i < verses.length; i++) {
    const r = verses[i].ruku_number;
    if (r != null && prev != null && r !== prev) out.push(i);
    if (r != null) prev = r;
  }
  return out;
};

// ── HTML PARSERS (RN has no DOM) ────────────────────────────────────────────

// Split a translation's HTML into text + footnote segments. The web app walked the
// DOM looking for any element carrying a `foot_note="ID"` attribute and used its
// textContent as the marker; RN has no DOMParser, so a regex scan stands in. It finds
// `<… foot_note="123">marker</…>` runs and treats everything between as plain text
// (tags/entities stripped). Anything without foot_note markers collapses to a single
// text part — so translations without footnotes render unchanged.
export type TransPart = { type: 'text'; text: string } | { type: 'fn'; id: string; marker: string };

export const parseTransHtml = (html: string): TransPart[] => {
  const parts: TransPart[] = [];
  // The Quran API emits footnote refs as e.g. `<sup foot_note=195936>1</sup>` —
  // note the attribute value is UNQUOTED. Accept quoted or unquoted digits.
  const fnRe = /<(\w+)([^>]*?)\bfoot_note=["']?(\d+)["']?([^>]*?)>([\s\S]*?)<\/\1\s*>/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = fnRe.exec(html))) {
    if (m.index > last) {
      const t = stripHtml(html.slice(last, m.index));
      if (t) parts.push({ type: 'text', text: t });
    }
    const marker = stripHtml(m[5]);
    parts.push({ type: 'fn', id: m[3], marker: marker || '•' });
    last = m.index + m[0].length;
  }
  if (last < html.length) {
    const t = stripHtml(html.slice(last));
    if (t) parts.push({ type: 'text', text: t });
  }
  return parts;
};

// Split a chapter-info HTML blob into paragraphs (the web app rendered it as HTML with
// `.info-html p { margin-bottom }`; RN strips tags, so we split on `</p>` and render
// each as its own <Text> block to preserve the paragraph breaks instead of a wall of
// text). Non-`<p>` wrappers (h1/ul/etc.) are rare in Maududi/King-Fahad intros and just
// get stripped along with the rest.
export const parseParagraphs = (html: string): string[] =>
  (html || '')
    .split(/<\/p>/i)
    .map((p) => stripHtml(p.replace(/<p[^>]*>/i, '')))
    .filter((t) => t.length > 0);

// Clear cached verses for a source (e.g. after a reciter/script change that
// doesn't actually change text, callers can ignore; kept for parity).
export const invalidateVerses = (src: Source) => versesCache.delete(`${src.kind}:${src.id}`);

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Quran API ${res.status}: ${url}`);
  return (await res.json()) as T;
}

// ── CONTENT FETCHERS ────────────────────────────────────────────────────────
// Each fetcher reads in-memory (L1) → persistent disk (L2 via cachedContent) →
// network, writing back to disk. So already-seen content is instant AND offline.

export const fetchChapters = (): Promise<Chapter[]> =>
  cachedContent('chapters', async () =>
    (await getJSON<{ chapters?: Chapter[] }>(`${API}/chapters?language=en`)).chapters || [],
  );

// One verse by key (e.g. "2:152"), with EN (Saheeh, 20) + ID (Kemenag, 33)
// translations + full word/glyph/tajweed fields — enough for `ArabicText` to
// render it in any reader script. Disk-cached per key so a seen verse renders
// offline. Drives the Daily Recitation banner.
export async function fetchVerseByKey(key: string): Promise<Verse> {
  return cachedContent<Verse>(`ayah2_${key}`, async () => {
    const params = new URLSearchParams({
      language: 'en',
      words: 'true',
      translations: '20,33',
      word_fields:
        'code_v1,code_v2,text_uthmani,text_indopak,transliteration,translation,audio_url,page_number',
      fields: 'text_uthmani,text_uthmani_tajweed,text_indopak,page_number,ruku_number',
      per_page: '1',
    });
    const d = await getJSON<{ verse?: Verse }>(`${API}/verses/by_key/${key}?${params}`);
    if (!d.verse) throw new Error(`No verse for ${key}`);
    return d.verse;
  });
}

export const fetchReciters = (): Promise<Reciter[]> =>
  cachedContent('recitations', async () =>
    (await getJSON<{ recitations?: Reciter[] }>(`${API}/resources/recitations?language=en`)).recitations || [],
  );

// Juz index (30 juzs). The endpoint returns each juz twice (hizb/ruku variants
// share juz_number), so dedupe by juz_number and sort 1→30.
export const fetchJuzs = (): Promise<Juz[]> =>
  cachedContent('juzs', async () => {
    const d = await getJSON<{ juzs?: Juz[] }>(`${API}/juzs`);
    const seen = new Set<number>();
    return (d.juzs || [])
      .filter((j) => (seen.has(j.juz_number) ? false : seen.add(j.juz_number)))
      .sort((a, b) => a.juz_number - b.juz_number);
  });

// ── VERSE SEARCH ────────────────────────────────────────────────────────────
// Keyword/meaning search across the whole Quran via quran.com's /search
// (proxied at ${API}/search — see internal/quran/proxy.go). No AI: it is literal
// full-text search over translations. lang selects the translation language
// searched and the translation shown in each hit (en→Saheeh 20, id→Kemenag 33,
// falling back to any translation of that language). Results are memoized in
// memory for the session (NOT on disk — search queries are unbounded, so caching
// each one to disk would grow storage without bound).
export interface VerseSearchHit {
  verseKey: string; // "7:151"
  surah: number;
  ayah: number;
  arabic: string; // result.text (Uthmani)
  translation: string; // HTML-stripped, picked by language
}

const searchCache = new Map<string, { total: number; hits: VerseSearchHit[] }>();

export async function searchVerses(
  query: string,
  lang: 'en' | 'id',
): Promise<{ total: number; hits: VerseSearchHit[] }> {
  const q = query.trim();
  if (q.length < 2) return { total: 0, hits: [] };
  const cacheKey = `${lang}:${q.toLowerCase()}`;
  const cached = searchCache.get(cacheKey);
  if (cached) return cached;

  const url = `${API}/search?q=${encodeURIComponent(q)}&size=30&language=${lang}`;
  const d = await getJSON<{
    search?: {
      total_results?: number;
      results?: Array<{
        verse_key?: string;
        text?: string;
        translations?: Array<{ resource_id?: number; language_name?: string; text?: string }>;
      }>;
    };
  }>(url);

  const preferId = lang === 'id' ? 33 : 20;
  const langName = lang === 'id' ? 'indonesian' : 'english';
  const hits: VerseSearchHit[] = [];
  for (const r of d.search?.results || []) {
    const [s, a] = (r.verse_key || '').split(':');
    const surah = Number(s);
    const ayah = Number(a);
    if (!surah || !ayah) continue;
    const tr =
      r.translations?.find((t) => t.resource_id === preferId) ||
      r.translations?.find((t) => (t.language_name || '').toLowerCase().startsWith(langName)) ||
      r.translations?.[0];
    hits.push({
      verseKey: r.verse_key || '',
      surah,
      ayah,
      arabic: r.text || '',
      translation: stripHtml(tr?.text || ''),
    });
  }
  const result = { total: d.search?.total_results ?? hits.length, hits };
  searchCache.set(cacheKey, result);
  return result;
}

export const fetchFootNote = async (id: string): Promise<string> => {
  const l1 = footnoteCache.get(id);
  if (l1) return l1;
  const text = await cachedContent(`fn_${id}`, async () => {
    const d = await getJSON<{ foot_note?: { text?: string } }>(`${API}/foot_notes/${id}`);
    return stripHtml(d.foot_note?.text || 'No footnote found.');
  });
  footnoteCache.set(id, text);
  return text;
};

// Load all verses for a navigation source, following pagination (per_page caps
// at 50). Cached per "kind:id" (L1 in-memory + L2 disk). Same query params as
// the web app: EN+ID translations (20=Saheeh, 33=Kemenag), full word fields for
// word-by-word rendering + audio, and the tajweed/indopak verse fields.
// Standard word/translation/tafsir-glyph fields requested for every reader load.
const VERSE_FIELDS = 'text_uthmani,text_uthmani_tajweed,text_indopak,page_number,ruku_number';
const WORD_FIELDS =
  'code_v1,code_v2,text_uthmani,text_indopak,transliteration,translation,audio_url,page_number';

// Order verses by their `verse_key` ("surah:ayah") — needed when a source spans
// more than one surah (juz, page, lembar) so the reader renders them in mushaf
// order rather than fetch order.
const byVerseKey = (a: Verse, b: Verse) => {
  const [sa, aa] = a.verse_key.split(':').map(Number);
  const [sb, ab] = b.verse_key.split(':').map(Number);
  return sa === sb ? aa - ab : sa - sb;
};

// Compare two "surah:ayah" verse keys numerically (surah-first, then ayah).
// Returns negative/zero/positive like a normal comparator. Exported for the
// reading-mark range logic below and any caller that needs mushaf ordering.
export function compareVerseKey(a: string, b: string): number {
  const [sa, aa] = a.split(':').map(Number);
  const [sb, ab] = b.split(':').map(Number);
  return sa === sb ? aa - ab : sa - sb;
}

// Returns the forward range {from, to} when re-marking slot `name` to `newVk`
// moves it FORWARD in mushaf order — i.e. there is a real "before" mark and the
// new one comes after it. Returns null otherwise (new slot, unchanged, or a
// backward move), so the caller can decide whether to surface the "you read X →
// Y · Summarize" banner. Slots may hold a legacy bare-string mark; markVerseKey
// normalizes both shapes. Pure & testable.
export function forwardRangeForSlot(
  slots: Record<string, ReadingMarkValue>,
  name: string,
  newVk: string,
): { from: string; to: string } | null {
  const existing = slots[name];
  if (!existing) return null;
  const oldVk = markVerseKey(existing);
  if (!oldVk || oldVk === newVk) return null;
  return compareVerseKey(oldVk, newVk) < 0 ? { from: oldVk, to: newVk } : null;
}

export async function loadVerses(src: Source): Promise<Verse[]> {
  const key = `${src.kind}:${src.id}`;
  const l1 = versesCache.get(key);
  if (l1) return l1;

  const verses = await cachedContent<Verse[]>(`verses_${key}`, async () => {
    // Lembar = two consecutive mushaf pages. `by_page` returns every verse that
    // has ANY word on that page, so a verse straddling the page boundary appears
    // in BOTH responses → dedupe by id, then sort into mushaf order.
    if (src.kind === 'lembar') {
      const [p1, p2] = lembarToPages(src.id);
      const merged = new Map<number, Verse>();
      for (const p of [p1, p2]) {
        for (const v of await loadByEndpoint(`by_page/${p}`)) merged.set(v.id, v);
      }
      return [...merged.values()].sort(byVerseKey);
    }

    const endpoint =
      src.kind === 'surah' ? `by_chapter/${src.id}` : src.kind === 'juz' ? `by_juz/${src.id}` : `by_page/${src.id}`;
    return loadByEndpoint(endpoint);
  });

  versesCache.set(key, verses);
  return verses;
}

// Paginate a single `/verses/{endpoint}` (per_page caps at 50). Shared by every
// source kind; lembar calls it twice (once per page) and merges upstream.
async function loadByEndpoint(endpoint: string): Promise<Verse[]> {
  const params = new URLSearchParams({
    language: 'en',
    words: 'true',
    translations: '20,33',
    word_fields: WORD_FIELDS,
    fields: VERSE_FIELDS,
    per_page: '50',
  });

  const all: Verse[] = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    params.set('page', String(page));
    const data = await getJSON<{
      verses?: Verse[];
      pagination?: { total_pages?: number };
    }>(`${API}/verses/${endpoint}?${params}`);
    if (!data.verses) break;
    all.push(...data.verses);
    totalPages = data.pagination?.total_pages || 1;
    page++;
  }
  return all;
}

// English tafsir (Ibn Kathir, resource 169) — fetched once per chapter.
export async function ensureEnTafsir(surah: number): Promise<void> {
  const tag = `ch${surah}`;
  if (enTafsirLoaded.has(tag)) return;
  try {
    const arr = await cachedContent<Array<{ verse_key: string; text: string }>>(
      `entafsir_${surah}`,
      async () => {
        const d = await getJSON<{ tafsirs?: Array<{ verse_key: string; text: string }> }>(
          `${API}/tafsirs/169/by_chapter/${surah}`,
        );
        return d.tafsirs || [];
      },
    );
    arr.forEach((t) => enTafsirMap.set(`169-${t.verse_key}`, t.text));
    enTafsirLoaded.add(tag);
  } catch {
    /* leave unloaded; UI shows "no tafsir" */
  }
}

export const getEnTafsir = (verseKey: string): string | undefined => enTafsirMap.get(`169-${verseKey}`);

// Indonesian tafsir (Kemenag via Gading Dev → tafsir.id.long per verse).
export async function ensureIndoTafsir(surah: number): Promise<void> {
  if (indoTafsirMap.has(surah)) return;
  try {
    const map = await cachedContent<Record<number, string>>(`indotafsir_${surah}`, async () => {
      const d = await getJSON<{
        data?: {
          verses?: Array<{
            number?: { inSurah?: number } | number;
            tafsir?: { id?: { long?: string } };
          }>;
        };
      }>(`${GADING}/surah/${surah}`);
      const m: Record<number, string> = {};
      (d.data?.verses || []).forEach((v) => {
        const num = v.number;
        const inSurah = typeof num === 'object' ? num?.inSurah : num;
        const long = v.tafsir?.id?.long;
        if (inSurah && long) m[Number(inSurah)] = stripHtml(long);
      });
      return m;
    });
    indoTafsirMap.set(surah, map);
  } catch {
    /* leave absent; UI shows "no tafsir" */
  }
}

export const getIndoTafsir = (surah: number, verseNumber: number): string | undefined =>
  indoTafsirMap.get(surah)?.[verseNumber];

// Surah intro (chapter info). quran.com returns exactly one source per language:
// English = Maududi, Indonesian = King Fahad Complex.
export async function fetchSurahInfo(
  surah: number,
  lang: 'en' | 'id',
): Promise<{ source: string; text: string }> {
  const key = `${surah}-${lang}`;
  const l1 = surahInfoCache.get(key);
  if (l1) return l1;
  const entry = await cachedContent(`info_${key}`, async () => {
    const d = await getJSON<{ chapter_info?: { source?: string; text?: string } }>(
      `${API}/chapters/${surah}/info?language=${lang}`,
    );
    return { source: d.chapter_info?.source || '', text: d.chapter_info?.text || '' };
  });
  surahInfoCache.set(key, entry);
  return entry;
}

// Per-verse recitation audio files for surah+reciter. The API urls are relative
// → prefix the CDN. The verseKey→remoteUrl mapping is disk-cached so it's
// available offline; downloaded audio files themselves are resolved separately
// (localAudioUri) by the player.
export async function ensureAudio(surah: number, reciter: number): Promise<Map<string, string>> {
  const k = `${surah}-${reciter}`;
  const cached = audioFileCache.get(k);
  if (cached) return cached;
  const entries = await cachedContent<Array<[string, string]>>(`audio_${k}`, async () => {
    const m = new Map<string, string>();
    try {
      let page = 1;
      let totalPages = 1;
      while (page <= totalPages) {
        const d = await getJSON<{
          audio_files?: Array<{ verse_key: string; url: string }>;
          pagination?: { total_pages?: number };
        }>(`${API}/recitations/${reciter}/by_chapter/${surah}?per_page=50&page=${page}`);
        (d.audio_files || []).forEach((af) =>
          m.set(af.verse_key, af.url.startsWith('http') ? af.url : AUDIO_BASE + af.url),
        );
        totalPages = d.pagination?.total_pages || 1;
        page++;
      }
    } catch {
      /* empty map — UI will skip playback */
    }
    return [...m.entries()];
  });
  const m = new Map(entries);
  audioFileCache.set(k, m);
  return m;
}

// ── WORD-LEVEL TIMING (for word-by-word sync) ──────────────────────────────
// The same ayah-by-ayah `/recitations/{id}/by_chapter/{n}` endpoint the player
// uses returns per-WORD segments when asked via `fields=segments` — same reciter
// pool as playback, no name matching. Each verse's segments are relative to that
// verse's OWN mp3 (the per-verse file starts at 0), so no offset math is needed.
// Segment shape: [index, word_position(1-based), start_ms(rel), end_ms(rel)].

export interface VerseSegments {
  segs: number[][]; // [index, word_position, start_ms, end_ms] relative to the verse mp3
}

// Fetch per-word segments for a surah+reciter. Returns verseKey → segments.
// Disk-cached per surah+reciter so it works offline once seen.
export async function ensureSegments(
  surah: number,
  reciterId: number,
): Promise<Map<string, VerseSegments>> {
  const entries = await cachedContent<Array<[string, VerseSegments]>>(
    `segs_${surah}_${reciterId}`,
    async () => {
      const params = new URLSearchParams({ fields: 'segments', per_page: '50' });
      const m = new Map<string, number[][]>();
      try {
        let page = 1;
        let totalPages = 1;
        while (page <= totalPages) {
          params.set('page', String(page));
          const d = await getJSON<{
            audio_files?: Array<{ verse_key: string; segments?: number[][] }>;
            pagination?: { total_pages?: number };
          }>(`${API}/recitations/${reciterId}/by_chapter/${surah}?${params}`);
          for (const af of d.audio_files || []) {
            if (Array.isArray(af.segments) && af.segments.length) m.set(af.verse_key, af.segments);
          }
          totalPages = d.pagination?.total_pages || 1;
          page++;
        }
      } catch {
        /* empty map → UI skips word sync */
      }
      return [...m.entries()].map(([k, segs]) => [k, { segs }] as [string, VerseSegments]);
    },
  );
  return new Map(entries);
}
