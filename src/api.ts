// Typed client for the sohibna-api public content endpoints.
import { API_BASE_URL } from '@/config';
import {
  AuthError,
  getAccessToken,
  refreshNow,
  type Session,
} from '@/lib/authSession';

export type Perspective = { label: string; view: string };

export type RulingEntry = {
  id: string;
  slug: string;
  category: string;
  question: string;
  intro: string;
  keywords: string[];
  perspectives: Perspective[];
  created_at: string;
  updated_at: string;
};

// Islamic event categories (shared with src/lib/islamicEvents.ts CATEGORY_META).
export type EventCategory = 'wajib-fast' | 'sunnah-fast' | 'event' | 'night' | 'forbidden-fast';

// Discriminated scheduling rule, stored as jsonb on the backend and resolved client-side
// against the Umm al-Qura Hijri date (see src/lib/hijri.ts + src/lib/islamicEvents.ts).
export type EventTrigger = {
  type: 'hijri' | 'hijri_range' | 'ramadhan' | 'beedh' | 'weekly';
  day?: number;
  month?: number;
  from?: number;
  to?: number;
  weekdays?: number[]; // JS getDay: Mon=1, Thu=4
};

export type IslamicEventDTO = {
  id: string;
  key: string;
  title: string;
  category: EventCategory;
  short: string;
  detail: string;
  rhythm?: string;
  trigger: EventTrigger;
  recurring: boolean;
  created_at: string;
  updated_at: string;
};

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(API_BASE_URL + path);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export const fetchRulings = () => getJSON<RulingEntry[]>('/rulings');
export const fetchRuling = (slug: string) => getJSON<RulingEntry>(`/rulings/${encodeURIComponent(slug)}`);

// "Tanya AI" ruling assistant: POST /rulings/ask. The model answers from its
// own Islamic knowledge (multi-perspective, no fatwa) — not the catalog. The
// response language follows the app's active language.
export type AskResult = {
  summary?: string;
  intro?: string;
  perspectives?: Perspective[];
};

export const askRuling = (question: string, lang: string) =>
  postJSON<AskResult>('/rulings/ask', { question, lang });

// Daily Reflection companion: POST /reflection/chat. One multi-turn reply from a
// warm, verse-grounded Islamic companion (the contract lives server-side). The
// verse's Arabic + translation are sent so the reply stays grounded in the actual
// ayah (no fabricated citations). Response language follows the app's active
// language. Public (like /rulings/ask); 503 when AI isn't configured.
export type ReflectionMessage = { role: 'user' | 'assistant'; content: string };
export type ReflectionVersePayload = { key: string; text: string; translation: string };
export type ReflectionChatResult = { reply: string };
export const askReflection = (
  mood: string,
  verse: ReflectionVersePayload,
  messages: ReflectionMessage[],
  lang: string,
) => postJSON<ReflectionChatResult>('/reflection/chat', { mood, verse, messages, lang });

// Verse-range meaning summary: POST /quran/summarize. The backend fetches the
// translation text for every verse in [fromKey, toKey] and asks the model to
// summarize ONLY that text (no fabrication). Output language follows `lang`.
// Used by the reading-mark "you read X → Y · Summarize" banner.
export type RangeTheme = { label: string; view: string };
export type RangeSummaryResult = {
  summary?: string;
  themes?: RangeTheme[];
};
export const summarizeRange = (fromKey: string, toKey: string, lang: string) =>
  postJSON<RangeSummaryResult>('/quran/summarize', {
    from_verse: fromKey,
    to_verse: toKey,
    lang,
  });

// AI "find related verses": POST /quran/related. Given a topic/theme, the model
// returns thematically related verses — the backend validates every verse key
// against quran.com first, so each result is a REAL verse (Arabic + translation)
// with a short neutral reason. Never fabricated. Drives the Quran Search AI tab.
// Public (like /quran/summarize); 503 when AI isn't configured, 502 on failure.
export type RelatedVerse = {
  key: string; // "2:153"
  surah: number;
  ayah: number;
  arabic: string; // text_uthmani
  translation: string; // picked by lang
  reason: string; // one-line neutral reason
};
export type RelatedResult = { related: RelatedVerse[] };
export const findRelatedVerses = (topic: string, lang: string) =>
  postJSON<RelatedResult>('/quran/related', { topic, lang });
export const fetchEvents = () => getJSON<IslamicEventDTO[]>('/events');

// ── AUTH ────────────────────────────────────────────────────────────────────

// Re-export so existing `import { AuthError } from '@/api'` keeps working.
export { AuthError };
export type { Session };

export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  user: User;
};

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(API_BASE_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error || `Request failed: ${res.status}`);
  }
  return data as T;
}

export const register = (name: string, email: string, password: string) =>
  postJSON<AuthResponse>('/auth/register', { name, email, password });

export const login = (email: string, password: string) =>
  postJSON<AuthResponse>('/auth/login', { email, password });

// loginWithGoogle exchanges a verified Google ID token for a Sohibna session
// (backend find-or-creates the user).
export const loginWithGoogle = (idToken: string) =>
  postJSON<AuthResponse>('/auth/google', { id_token: idToken });

// revokeSession invalidates the refresh token server-side (POST /auth/logout).
// Best-effort: callers ignore network errors so local logout always proceeds.
export const revokeSession = (refreshToken: string) =>
  postJSON<{ ok: boolean }>('/auth/logout', { refresh_token: refreshToken }).catch(() => undefined);

// authedRequest is the single authenticated transport: it pulls a valid access
// token from the session singleton (refreshing proactively if near expiry) and,
// on a 401, refreshes once and retries. A 401 after refresh throws AuthError so
// the caller logs out. deviceId is optional (sync calls stamp X-Device-ID).
async function authedRequest<T>(
  path: string,
  init?: RequestInit,
  deviceId?: string,
): Promise<T> {
  const buildHeaders = (tok: string): HeadersInit => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tok}`,
    ...(deviceId ? { 'X-Device-ID': deviceId } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  });

  const tok = await getAccessToken();
  let res = await fetch(API_BASE_URL + path, { ...init, headers: buildHeaders(tok) });
  if (res.status === 401) {
    // Access token expired/invalid mid-flight — refresh and retry exactly once.
    const next = await refreshNow();
    res = await fetch(API_BASE_URL + path, { ...init, headers: buildHeaders(next.accessToken) });
  }

  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new AuthError();
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error || `Request failed: ${res.status}`);
  }
  return data as T;
}

// authedFetch is the no-device authed transport (e.g. GET /auth/me).
export async function authedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return authedRequest<T>(path, init);
}

export const getMe = () => authedFetch<User>('/auth/me', { method: 'GET' });

// ── QURAN USER DATA (multi-device sync) ─────────────────────────────────────
//
// The reader's state is synced per-resource: each mutation is one scoped PATCH,
// and devices stay in sync via GET /changes (a merged feed ordered by sync_seq)
// + GET /state (full snapshot for fresh login). syncFetch attaches the
// X-Device-ID provenance header; auth + refresh-on-401 are handled centrally by
// authedRequest. A 401 that survives a refresh throws AuthError → caller logs out.

export async function syncFetch<T>(
  deviceId: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  return authedRequest<T>(path, init, deviceId);
}

// ── Feed response types (mirror internal/sync.Change) ───────────────────────

export interface BaseChange {
  sync_seq: number;
  deleted?: boolean;
}
export interface FavoriteChange extends BaseChange {
  type: 'favorite';
  verse_key: string;
}
export interface BookmarkChange extends BaseChange {
  type: 'bookmark';
  verse_key: string; // '' (empty) = cleared
}
export interface LabelChange extends BaseChange {
  type: 'label';
  verse_key: string;
  label: string;
}
export interface LabelLibChange extends BaseChange {
  type: 'label_lib';
  label: string;
}
export interface LastReadChange extends BaseChange {
  type: 'last_read';
  surah: number;
  verse_key: string;
}
export interface SettingChange extends BaseChange {
  type: 'setting';
  key: string;
  value: unknown;
}
export type Change =
  | FavoriteChange
  | BookmarkChange
  | LabelChange
  | LabelLibChange
  | LastReadChange
  | SettingChange
  | ReadingLogChange
  | KhatmChange
  | StreakChange
  | HafalanTargetChange
  | MemorizedVerseChange;

// Richer-reading rows are carried whole in `payload`.
export interface ReadingLogChange extends BaseChange {
  type: 'reading_log';
  payload: {
    id: string;
    surah: number;
    fromVerse: string;
    toVerse: string;
    seconds: number;
    pages: number;
    at: string;
  };
}
export interface KhatmChange extends BaseChange {
  type: 'khatm';
  payload: {
    id: string;
    type: 'daily' | 'duration';
    unit: 'time' | 'page' | 'range';
    target: number;
    rangeFrom?: string | null; // "surah:ayah", only for unit=range
    rangeTo?: string | null;
    startAt: string;
    endAt: string; // '' = open-ended
  };
}
export interface StreakChange extends BaseChange {
  type: 'streak';
  payload: {
    currentStreak: number;
    longestStreak: number;
    lastReadDate: string; // YYYY-MM-DD or ''
    totalPages: number;
  };
}

// Hafalan (memorization) rows are carried whole in `payload`, mirroring khatm.
export interface HafalanTargetChange extends BaseChange {
  type: 'hafalan_target';
  payload: {
    id: string;
    scope: 'surah' | 'juz' | 'range' | 'daily_rate';
    surahId?: number | null;
    juzId?: number | null;
    rangeFrom?: string | null;
    rangeTo?: string | null;
    dailyAyahs?: number | null;
    deadline?: string | null; // RFC3339 or null
    createdAt: string;
    archived?: boolean;
  };
}
export interface MemorizedVerseChange extends BaseChange {
  type: 'memorized_verse';
  verse_key: string; // surfaced top-level (like favorites) for fast indexing
  payload: {
    verseKey: string;
    surah: number;
    ayah: number;
    status: 'learning' | 'memorized';
    memorizedAt?: string | null;
    ease: number;
    intervalDays: number;
    dueAt: string;
    reviewCount: number;
    lastReviewedAt?: string | null;
    lapses: number;
    verifiedBy?: 'manual' | 'ai' | null;
  };
}

export interface FeedResponse {
  cursor: number;
  has_more: boolean;
  server_max_seq: number;
  changes: Change[];
}
export interface StateResponse {
  cursor: number;
  changes: Change[];
}

export const getChanges = (deviceId: string, since: number, limit = 200) =>
  syncFetch<FeedResponse>(deviceId, `/quran/me/changes?since=${since}&limit=${limit}`);

export const getState = (deviceId: string) => syncFetch<StateResponse>(deviceId, '/quran/me/state');

export const patchFavorite = (deviceId: string, verseKey: string, deleted: boolean) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/favorites', {
    method: 'PATCH',
    body: JSON.stringify({ verseKey, deleted }),
  });

export const patchBookmark = (deviceId: string, verseKey: string | null) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/bookmark', {
    method: 'PATCH',
    body: JSON.stringify({ verseKey }),
  });

export const patchLastRead = (deviceId: string, surah: number, verseKey: string) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/last-read', {
    method: 'PATCH',
    body: JSON.stringify({ surah, verseKey }),
  });

export const patchLabels = (deviceId: string, verseKey: string, add: string[], remove: string[]) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/labels', {
    method: 'PATCH',
    body: JSON.stringify({ verseKey, add, remove }),
  });

export const patchLabelLib = (deviceId: string, add: string[], remove: string[]) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/label-library', {
    method: 'PATCH',
    body: JSON.stringify({ add, remove }),
  });

export const patchSetting = (deviceId: string, key: string, value: unknown) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/settings', {
    method: 'PATCH',
    body: JSON.stringify({ key, value }),
  });

export type GoalType = 'daily' | 'duration';
export type GoalUnit = 'time' | 'page' | 'range';

export const postReadingLog = (
  deviceId: string,
  entry: {
    id: string;
    surah: number;
    fromVerse: string;
    toVerse: string;
    seconds: number;
    pages: number;
  },
) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/reading-log', {
    method: 'POST',
    body: JSON.stringify(entry),
  });

export const upsertKhatm = (
  deviceId: string,
  goal: {
    id: string;
    type: GoalType;
    unit: GoalUnit;
    target: number;
    rangeFrom?: string | null;
    rangeTo?: string | null;
    startAt?: string;
    endAt?: string | null;
  },
) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/khatm', {
    method: 'PATCH',
    body: JSON.stringify(goal),
  });

export const deleteKhatm = (deviceId: string, id: string) =>
  syncFetch<{ ok: boolean }>(deviceId, `/quran/me/khatm/${id}`, { method: 'DELETE' });

// fetchGoalsProgress returns live, derived progress for every active goal
// (computed server-side from the reading log). Always fresh — never synced.
export const fetchGoalsProgress = (deviceId: string) =>
  syncFetch<
    {
      id: string;
      type: GoalType;
      unit: GoalUnit;
      periodProgress: number;
      periodTarget: number;
      todayProgress: number;
      todayTarget: number;
      done: boolean;
    }[]
  >(deviceId, '/quran/me/goals/progress');

export const patchTZ = (deviceId: string, tz: string) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/tz', {
    method: 'PATCH',
    body: JSON.stringify({ tz }),
  });

// ── Hafalan (memorization) — targets + per-verse memorized records ──────────

export const upsertHafalanTarget = (
  deviceId: string,
  target: {
    id: string;
    scope: 'surah' | 'juz' | 'range' | 'daily_rate';
    surahId?: number | null;
    juzId?: number | null;
    rangeFrom?: string | null;
    rangeTo?: string | null;
    dailyAyahs?: number | null;
    deadline?: string | null;
    archived?: boolean;
  },
) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/hafalan/targets', {
    method: 'PATCH',
    body: JSON.stringify(target),
  });

export const deleteHafalanTarget = (deviceId: string, id: string) =>
  syncFetch<{ ok: boolean }>(deviceId, `/quran/me/hafalan/targets/${id}`, { method: 'DELETE' });

// The client sends the whole memorized row (status + full SM-2 review state);
// surah/ayah are derived server-side from verseKey, so they're not in the body.
export const upsertMemorizedVerse = (
  deviceId: string,
  verse: {
    verseKey: string;
    status: 'learning' | 'memorized';
    memorizedAt?: string | null;
    ease: number;
    intervalDays: number;
    dueAt: string;
    reviewCount: number;
    lastReviewedAt?: string | null;
    lapses: number;
    verifiedBy?: 'manual' | 'ai' | null;
  },
) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/hafalan/memorized', {
    method: 'PATCH',
    body: JSON.stringify(verse),
  });

export const deleteMemorizedVerse = (deviceId: string, verseKey: string) =>
  syncFetch<{ ok: boolean }>(deviceId, `/quran/me/hafalan/memorized/${encodeURIComponent(verseKey)}`, {
    method: 'DELETE',
  });
