// Typed client for the sohibna-api public content endpoints.
import { API_BASE_URL } from '@/config';
import { getDeviceId } from '@/lib/deviceId';
import {
  AuthError,
  getAccessToken,
  refreshNow,
  type Session,
} from '@/lib/authSession';
import type { PrayerDay, ReflectionEntryData, RulingsChatEntryData } from '@/lib/quran';


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

// Default request timeout: without one, a wedged connection hangs every
// caller forever (an authed fetch that never resolves also blocks behind the
// same inflight refresh). AI-generation endpoints get the longer budget.
// 30s so a big sync pull (/state) on a slow mobile connection still completes.
const REQUEST_TIMEOUT_MS = 30_000;
const AI_TIMEOUT_MS = 60_000;

async function getJSON<T>(path: string, timeoutMs: number = REQUEST_TIMEOUT_MS): Promise<T> {
  const res = await fetch(API_BASE_URL + path, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}


export type RulingsChatMessage = { role: 'user' | 'assistant'; content: string };
export type RulingsChatResult = { reply: string };

// Reference scope for the chat-with-reference mode: retrieval runs only over
// the chosen kitab volumes (source_names) and/or the whole Qur'an. Omitted on
// general chats. Mirrors the server's rulingsChatScope.
export type RulingsChatScope = { sources: string[]; quran: boolean; title?: string };

export const askRulingsChat = (messages: RulingsChatMessage[], lang: string, scope?: RulingsChatScope) =>
  postJSON<RulingsChatResult>('/rulings/chat', {
    messages,
    lang,
    ...(scope ? { scope } : {}),
  }, AI_TIMEOUT_MS);

// Chat-with-reference pick-list: GET /ai/sources. Kitab series grouped from
// the corpus's source_names ("Series" + its Jilid/Bagian parts) plus the
// Qur'an as one group. Static-ish content (changes only on reseed).
export type RulingsSourcePart = { name: string; label: string; chunks: number };
export type RulingsSourceGroup = {
  title: string;
  category?: string; // category slug (see groupByCategory); absent on old servers
  parts: RulingsSourcePart[];
  chunks: number;
  // Kitab catalogue metadata (kitab_metadata, migration 0015) — absent on old
  // servers / unbackfilled rows; verified = hand-curated (cmd/kitab_meta).
  author?: string;
  authorAr?: string;
  died?: string;
  synopsisId?: string;
  synopsisEn?: string;
  synopsisAr?: string;
  verified?: boolean;
};
export type RulingsSourceCatalog = {
  series: RulingsSourceGroup[];
  quran: RulingsSourceGroup;
  categories?: string[]; // canonical display order of the slugs present
};

export const fetchRulingsSources = () => getJSON<RulingsSourceCatalog>('/ai/sources');


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
) => postJSON<ReflectionChatResult>('/reflection/chat', { mood, verse, messages, lang }, AI_TIMEOUT_MS);

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
  }, AI_TIMEOUT_MS);

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
  postJSON<RelatedResult>('/quran/related', { topic, lang }, AI_TIMEOUT_MS);
export const fetchEvents = () => getJSON<IslamicEventDTO[]>('/events');

// Pop-up announcements (donation invitations, news) — GET /announcements.
// `content` is a per-language map; resolveContent picks the entry for the UI
// language with fallbacks (see src/lib/announcements.ts).
export type AnnouncementContent = { title: string; body: string; cta?: string };
export type AnnouncementDTO = {
  id: string;
  content: Record<string, AnnouncementContent>;
  image_url: string;
  // 'paywall' is app-only (opens the Play paywall there); the web pick skips it.
  action: '' | 'donate' | 'url' | 'paywall';
  action_url: string;
  frequency: 'daily' | 'once';
  updated_at: string;
};
export const fetchAnnouncements = () => getJSON<AnnouncementDTO[]>('/announcements');

// ── AUTH ────────────────────────────────────────────────────────────────────

// Re-export so existing `import { AuthError } from '@/api'` keeps working.
export { AuthError };
export type { Session };

export type User = {
  id: string;
  name: string;
  email: string;
  // Absent on pre-0012 API builds → treat undefined as "no banner".
  email_verified?: boolean;
  created_at: string;
  updated_at: string;
  // Monetization tier fields (0037) — enriched on /auth/me; absent on older
  // APIs (= logged-out defaults).
  supporter?: { active: boolean; productId?: string } | null;
  plus?: { active: boolean; productId?: string } | null;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  user: User;
};

// postJSON throws ApiError on non-2xx so quota-429 callers can branch on
// status/code (QuotaLimitSheet). AI paths also stamp X-Device-ID — the
// guest-quota subject for signed-out users.
function isAIPath(path: string): boolean {
  return (
    path.startsWith('/rulings/') ||
    path.startsWith('/reflection/') ||
    path.startsWith('/quran/summarize') ||
    path.startsWith('/quran/related') ||
    path.startsWith('/reports/ai')
  );
}

async function postJSON<T>(path: string, body: unknown, timeoutMs: number = REQUEST_TIMEOUT_MS): Promise<T> {
  // v2 quotas (0039): AI is login-gated server-side — signed-in sessions
  // stamp their Bearer so the quota counts against the account; guests stay
  // anonymous (the server 401s them with ai_login_required once enforcement
  // flips, and the web shows an inline sign-in prompt).
  const bearer = isAIPath(path) ? await getAccessToken().catch(() => '') : '';
  const res = await fetch(API_BASE_URL + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(isAIPath(path) ? { 'X-Device-ID': getDeviceId() } : {}),
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new ApiError(
      res.status,
      (data as { error?: string })?.error || `Request failed: ${res.status}`,
    ) as ApiError & { code?: string };
    err.code = (data as { code?: string })?.code;
    throw err;
  }
  return data as T;
}

// register (0041 verify-then-create) only STAGES the signup — no account,
// no session. 202 {ok}; the emailed code creates the account at verifyEmail.
// The OPTIONAL Program Mitra referral code (0033) is attributed when the
// account actually comes into existence.
export const register = (name: string, email: string, password: string, referralCode?: string) =>
  postJSON<{ ok: boolean }>('/auth/register', {
    name,
    email,
    password,
    ...(referralCode ? { referral_code: referralCode } : {}),
  });

export const login = (email: string, password: string) =>
  postJSON<AuthResponse>('/auth/login', { email, password });

// loginWithGoogle exchanges a verified Google ID token for a Sohibna session
// (backend find-or-creates the user). The referral code only applies when a
// brand-new account is created server-side.
export const loginWithGoogle = (idToken: string, referralCode?: string) =>
  postJSON<AuthResponse>('/auth/google', {
    id_token: idToken,
    ...(referralCode ? { referral_code: referralCode } : {}),
  });

// ── SIGNUP VERIFICATION + PASSWORD RESET (OTP) ──────────────────────────────
// verify-email is PUBLIC and email-keyed (0041): the code + email CREATE the
// account (already verified) and the response is a full session — the user is
// signed in the moment the account exists. forgot/reset are public too — the
// emailed 6-digit code is the credential.

// verifyEmail checks the code → the just-created account + a fresh session.
export const verifyEmail = (email: string, code: string) =>
  postJSON<AuthResponse>('/auth/verify-email', { email, code });

// forgotPassword always succeeds (204) — unknown/unverified emails are
// indistinguishable by design, so the page always shows "check your inbox".
export const forgotPassword = (email: string) =>
  postJSON<{ ok: boolean }>('/auth/forgot-password', { email });

// resetPassword checks the emailed code + sets the new password (min 8).
export const resetPassword = (email: string, code: string, password: string) =>
  postJSON<{ ok: boolean }>('/auth/reset-password', { email, code, password });

// revokeSession invalidates the refresh token server-side (POST /auth/logout).
// Best-effort: callers ignore network errors so local logout always proceeds.
export const revokeSession = (refreshToken: string) =>
  postJSON<{ ok: boolean }>('/auth/logout', { refresh_token: refreshToken }).catch(() => undefined);

// ApiError = the server RESPONDED with a non-ok HTTP status (as opposed to a
// network failure, which rejects fetch with a TypeError). The sync queue uses
// the distinction to deadletter ops the server keeps rejecting while still
// retrying offline/network failures forever.
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

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
  // Each attempt gets its own timeout signal (the retry must not inherit the
  // aborted signal of a wedged first attempt).
  let res = await fetch(API_BASE_URL + path, {
    ...init,
    headers: buildHeaders(tok),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (res.status === 401) {
    // Access token expired/invalid mid-flight — refresh and retry exactly once.
    const next = await refreshNow();
    res = await fetch(API_BASE_URL + path, {
      ...init,
      headers: buildHeaders(next.accessToken),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  }

  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new AuthError();
  if (!res.ok) {
    throw new ApiError(res.status, (data as { error?: string })?.error || `Request failed: ${res.status}`);
  }
  return data as T;
}

// authedFetch is the no-device authed transport (e.g. GET /auth/me).
export async function authedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return authedRequest<T>(path, init);
}

export const getMe = () => authedFetch<User>('/auth/me', { method: 'GET' });

// deleteAccount erases the signed-in user's OWN account server-side (0035):
// one transaction removes the users row and every per-user table FK-cascades
// with it. Typed {"confirm":"DELETE"} body defeats accidental clicks; 204.
export const deleteAccount = () =>
  authedFetch<void>('/auth/me', {
    method: 'DELETE',
    body: JSON.stringify({ confirm: 'DELETE' }),
  });

// ── Billing / entitlements (0037) ────────────────────────────────────────────
// Web never SELLS digital goods (Play policy): these reads exist so the web
// Me page can show status and link to the Play listing.

// isLoginGateError narrows the v2 AI 401 (0039): AI requires a signed-in
// account; the web answers with an inline sign-in prompt (never a sale —
// purchases live in the Play Store app).
export function isLoginGateError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { status?: number }).status === 401 &&
    (err as { code?: string }).code === 'ai_login_required'
  );
}

// isQuotaError narrows the postJSON ApiError (status + code) for AI callers.
export function isQuotaError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { status?: number }).status === 429 &&
    (err as { code?: string }).code === 'ai_quota_exceeded'
  );
}

export type BillingConfig = { plusEnabled: boolean; supporterCount: number };
export const fetchBillingConfig = () => getJSON<BillingConfig>('/billing/config');
export const fetchSupportersCount = () => getJSON<{ count: number }>('/supporters/count');

// resendVerification re-mails the signup code for a STAGED registration
// (0041: public, email-keyed — silent 204 for unknown/registered emails);
// 429 = cooldown.
export const resendVerification = (email: string) =>
  postJSON<{ ok: boolean }>('/auth/resend-verification', { email });

// ── PROGRAM MITRA (0033, Phase 1: attribution + tracking, no money) ─────────
// The click ping fires from the register page when ?ref= is present (public,
// always 204 — it can never enumerate valid codes); the dashboard lists the
// caller's OWN partner rows with aggregate-only stats.

// pingPartnerClick counts one referral-link landing (fire-and-forget; errors
// are swallowed — a failed count must never affect signup UX).
export const pingPartnerClick = (code: string) =>
  postJSON<void>('/partners/track/click', { code }).catch(() => undefined);

export type PartnerType = 'lembaga' | 'individual' | 'agent';
export type PartnerStatus = 'invited' | 'active' | 'suspended';

export type PartnerStats = {
  clicksTotal: number;
  clicks30d: number;
  signupsTotal: number;
  signups30d: number;
  active30d: number;
  circleMembers: number;
};

export type PartnerRow = {
  id: string;
  type: PartnerType;
  name: string;
  code: string;
  status: PartnerStatus;
  createdAt: string;
  stats: PartnerStats;
};

// getMyPartners returns the signed-in user's partner rows; a non-partner gets
// an empty list (the dashboard renders its empty state).
export const getMyPartners = () =>
  authedFetch<{ partners: PartnerRow[] }>('/partners/me', { method: 'GET' });

// ── AI-answer flagging (0036, Play GenAI policy) ─────────────────────────────
// Fire-and-forget: the endpoint always 201s (server-side insert is fail-soft),
// so callers show their "thank you" either way.

export type AIReportSurface =
  | 'rulings_chat'
  | 'kitab_chat'
  | 'reflection_chat'
  | 'quran_summarize'
  | 'quran_related';

export type AIReportReason = 'wrong' | 'harmful' | 'offensive' | 'fabricated' | 'other';

export const postReportAI = (body: {
  surface: AIReportSurface;
  reason: AIReportReason;
  excerpts: string;
}) => postJSON<{ ok: boolean }>('/reports/ai', body);

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
  updated_at?: number; // epoch ms, client edit time (latest-activity-wins)
}
// Named reading-mark slot (one row per slot, 0011).
export interface LastReadSlotChange extends BaseChange {
  type: 'last_read_slot';
  key: string; // slot name
  verse_key: string;
  updated_at?: number; // epoch ms, client edit time
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
  | LastReadSlotChange
  | SettingChange
  | ReadingLogChange
  | KhatmChange
  | StreakChange
  | HafalanTargetChange
  | MemorizedVerseChange
  | PrayerDayChange
  | ReflectionChange
  | RulingsChatChange;

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
    groupId?: string | null; // set → community group owns this goal
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

// Account-attached progress (0008). Keyed like the client maps: prayer_day by
// 'YYYY-MM-DD', reflection by 'YYYY-MM-DD:<mood>'.
export interface PrayerDayChange extends BaseChange {
  type: 'prayer_day';
  key: string;
  payload: PrayerDay;
}
export interface ReflectionChange extends BaseChange {
  type: 'reflection';
  key: string;
  payload: ReflectionEntryData;
}

export interface RulingsChatChange extends BaseChange {
  type: 'rulings_chat';
  key: string;
  payload: RulingsChatEntryData['payload'];
  updated_at?: number; // epoch ms, server-stamped (last write)
  // Reference scope (chat-with-reference); absent on general chats.
  sources?: string[];
  quran?: boolean;
  ref_title?: string;
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

// applied=false → the server's latest-activity-wins guard REJECTED the write
// (a newer row exists) — the caller should re-pull instead of trusting its
// optimistic local state. Older servers return {ok} without `applied`.
export const patchLastRead = (deviceId: string, surah: number, verseKey: string, ts: number) =>
  syncFetch<{ ok: boolean; applied?: boolean }>(deviceId, '/quran/me/last-read', {
    method: 'PATCH',
    body: JSON.stringify({ surah, verseKey, ts }),
  });

// Set (verseKey) or clear (null) one named reading-mark slot. ts = client edit
// time (epoch ms) — the server ignores the write when an older-than-stored ts.
export const patchLastReadSlot = (deviceId: string, slot: string, verseKey: string | null, ts: number) =>
  syncFetch<{ ok: boolean; applied?: boolean }>(deviceId, '/quran/me/last-read-slots', {
    method: 'PATCH',
    body: JSON.stringify({ slot, verseKey, ts }),
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
export type GoalUnit = 'time' | 'page' | 'range' | 'verse';

export const postReadingLog = (
  deviceId: string,
  entry: {
    id: string;
    surah: number;
    fromVerse: string;
    toVerse: string;
    seconds: number;
    pages: number;
    at?: number; // epoch ms, session-happened-at (guest backfill; server clamps to 7d)
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
      groupId?: string | null; // set → community group goal
    }[]
  >(deviceId, '/quran/me/goals/progress');

// ReadingToday is the goal-independent "reading today" rollup served by
// GET /quran/me/reading/today — distinct verses + summed pages/minutes plus
// live goal progress in one call (dashboard card parity with the app's Home).
export type ReadingToday = {
  day: string; // user-TZ YYYY-MM-DD
  verses: number; // distinct ayat read today
  pages: number; // summed mushaf pages (the streak metric)
  minutes: number;
  goals: {
    id: string;
    type: GoalType;
    unit: GoalUnit;
    periodProgress: number;
    periodTarget: number;
    todayProgress: number;
    todayTarget: number;
    done: boolean;
    groupId?: string | null; // set → community group goal
  }[];
};

export const fetchReadingToday = (deviceId: string) =>
  syncFetch<ReadingToday>(deviceId, '/quran/me/reading/today');

export const patchTZ = (deviceId: string, tz: string) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/tz', {
    method: 'PATCH',
    body: JSON.stringify({ tz }),
  });

// ── Fastabiqul Khairat leaderboard + achievements (0019) — app-mirrored ─────

// AchievementState is one DERIVED badge: the server computes only
// id/unlocked/current/threshold — names + descriptions live in the clients'
// i18n keyed off the stable ids (dict.achievements.items.<id>).
export type AchievementState = {
  id: string;
  unlocked: boolean;
  current: number;
  threshold: number;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  imageUrl: string | null;
  points: number;
  verses: number;
  days: number;
  isMe: boolean;
};

// LeaderboardResponse is the weekly opt-in board: top 50 entries plus the
// requester's own rank (over the FULL list, so it exists beyond the top 50)
// and the displayed week bounds (requester-TZ; points windows are per-user-TZ).
export type LeaderboardResponse = {
  weekStart: string; // requester-TZ Monday YYYY-MM-DD
  nextReset: string; // RFC3339 — the countdown target
  entries: LeaderboardEntry[];
  me: LeaderboardEntry | null; // null = not opted in
  joined: boolean;
  myName: string;
};

// The board is a CROSS-USER read mounted at the root (no device header).
export const fetchLeaderboard = () => authedFetch<LeaderboardResponse>('/leaderboard');

// Join/update (nickname, 1..30 chars) or leave (null) the board.
export const patchLeaderboard = (deviceId: string, name: string | null) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/leaderboard', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });

export const fetchAchievements = (deviceId: string) =>
  syncFetch<AchievementState[]>(deviceId, '/quran/me/achievements')

// XpSummary is the lifetime XP + level rollup (GET /quran/me/xp) — the
// permanent progression axis; WeekPoints is the requester's own weekly-board
// points (personal, no opt-in needed). All derived server-side.
export type XpBreakdown = {
  verses: number
  days: number
  hafalan: number
  goals: number
}

export type XpSummary = {
  total: number
  level: number
  levelFloor: number
  levelCeiling: number
  breakdown: XpBreakdown
  weekPoints: number
}

export const fetchXp = (deviceId: string) => syncFetch<XpSummary>(deviceId, '/quran/me/xp')

// ── Community: Grup Tilawah / Grup Keluarga (0020) — app-mirrored ────
export type CommunityGroupKind = 'circle' | 'family'
export type CommunityGoalUnit = 'verse' | 'page' | 'time' | 'range'
export type CommunityGoalType = 'daily' | 'duration'
export type CommunityPreset = 'barakallahu_fiik' | 'masyaallah' | 'semangat' | 'dua'

export type CommunityGroupSummary = {
  id: string
  name: string
  kind: CommunityGroupKind
  goalType: CommunityGoalType
  goalUnit: CommunityGoalUnit
  goalTarget: number
  goalRangeFrom: string | null
  goalRangeTo: string | null
  goalEndAt: string | null
  role: string
  memberCount: number
  todayOnTarget: number
  todayTotal: number
  streak: number
  myOnTargetToday: boolean
}

export type CommunityMember = {
  userId: string
  alias: string
  imageUrl: string | null
  role: string
  joinedAt: string
  onTargetToday: boolean
  todayAmount: number
  todayTarget: number // daily: target; duration: today's auto portion
  windowAmount: number // duration: cumulative progress in the goal window
  daysOnTargetWeek: number
  tier?: 'free' | 'supporter' | 'premium'
};

export type CommunityBoardEntry = { userId: string; alias: string; imageUrl: string | null; daysMet: number; weekAmount: number; isMe: boolean; tier?: 'free' | 'supporter' | 'premium' }

export type CommunityReaction = { fromUserId: string; toUserId: string; day: string; preset: CommunityPreset }

export type CommunityGroupDetail = {
  group: { id: string; name: string; kind: CommunityGroupKind; goalType: CommunityGoalType; goalUnit: CommunityGoalUnit; goalTarget: number; goalRangeFrom: string | null; goalRangeTo: string | null; goalEndAt: string | null; code: string; createdAt: string }
  me: { userId: string; role: string; alias: string }
  weekStart: string
  quorumNeeded: number
  streak: number
  members: CommunityMember[]
  board: CommunityBoardEntry[]
  topEncourager: { userId: string; alias: string; count: number } | null
  reactions: CommunityReaction[]
};

export const fetchCommunityGroups = () => authedFetch<{ groups: CommunityGroupSummary[] }>('/community/groups')

export const fetchCommunityGroup = (id: string) => authedFetch<CommunityGroupDetail>(`/community/groups/${id}`)

export const joinCommunityGroup = (code: string, alias: string | null) =>
  authedFetch<CommunityGroupSummary>('/community/join', {
    method: 'POST',
    body: JSON.stringify({ code, alias: alias ?? undefined }),
  })

export const leaveCommunityGroup = (id: string) =>
  authedFetch<{ ok: boolean }>(`/community/groups/${id}/leave`, { method: 'POST' })

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

// ── Account-attached progress (0008) — prayer days + reflections ────────────
// Batch bodies: callers chunk (≤100 prayer days / ≤20 reflections per call) so
// a guest-history backfill doesn't need one request per row and a single flaky
// request can't wedge the whole FIFO queue behind it.

export const patchPrayerDays = (
  deviceId: string,
  items: { day: string; data: PrayerDay }[],
) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/prayers', {
    method: 'PATCH',
    body: JSON.stringify({ items }),
  });

export const patchReflections = (
  deviceId: string,
  items: ReflectionEntryData[],
) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/reflections', {
    method: 'PATCH',
    body: JSON.stringify({ items }),
  });

export const patchRulingsChats = (
  deviceId: string,
  items: RulingsChatEntryData[],
) =>
  syncFetch<{ ok: boolean }>(deviceId, '/quran/me/rulings/chats', {
    method: 'PATCH',
    body: JSON.stringify({ items }),
  });
