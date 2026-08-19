// Multi-device sync glue for the Quran reader.
//
// The backend is the source of truth; each device keeps (a) the full denormalized
// UserData for offline rendering, (b) one integer `cursor` = the highest sync_seq
// it has applied, and (c) a FIFO `pending` op queue for mutations made while
// offline. This module holds the pure merge (apply a feed page to UserData), the
// op queue + cursor persistence, and the op→PATCH dispatcher used by useQuranData.
//
// Conflict model: last-write-wins per ROW on the server (each row is one
// resource/field, versioned by a server-assigned sync_seq). Two devices editing
// different favorites/settings touch different rows and never collide; the only
// LWW is on the same scalar, which is the only sane rule. The client never sends
// a timestamp or seq — it only pushes the new value and pulls deltas.
import AsyncStorage from '@/lib/storage';
import {
  patchFavorite,
  patchBookmark,
  patchLastRead,
  patchLabels,
  patchLabelLib,
  patchSetting,
  postReadingLog,
  upsertKhatm,
  deleteKhatm,
  upsertHafalanTarget,
  deleteHafalanTarget,
  upsertMemorizedVerse,
  deleteMemorizedVerse,
  patchTZ,
  patchPrayerDays,
  patchReflections,
  type Change,
  type GoalType,
  type GoalUnit,
} from '@/api';
import {
  DEFAULT_USER_DATA,
  type UserData,
  type KhatmGoal,
  type HafalanTarget,
  type MemorizedVerse,
  type PrayerDay,
  type ReflectionEntryData,
  type AppLang,
} from '@/lib/quran';

// Persistence keys are PER-USER: two accounts sharing a device must not reuse
// each other's cursor (a stale cursor silently skips the newer account's rows)
// or each other's queue. `userId` is the auth user id, or 'guest' logged out.
// Legacy un-suffixed keys are migrated once (see migrateLegacySyncKeys).
const cursorKey = (userId: string) => `sohibna.quran.cursor.${userId}`;
const queueKey = (userId: string) => `sohibna.quran.pending.${userId}`;
// Offline snapshot cache: the last successfully-merged UserData, rendered when
// a full pull fails offline so progress is never "missing" on a cold start
// without network (paired with the cursor-0 reset for online recovery).
const cacheKey = (userId: string) => `sohibna.quran.cache.${userId}`;
const LEGACY_CURSOR_KEY = 'sohibna.quran.cursor';
const LEGACY_QUEUE_KEY = 'sohibna.quran.pending';

// ── Merge: apply a feed page (or state snapshot) to a UserData draft ─────────

// mergeRemote returns a new UserData with `changes` applied over `prev`. It is
// pure and idempotent: re-applying the same page is a no-op, so delta pulls and
// full snapshots share one code path. Soft-deleted rows (deleted=true) remove
// their target; the bookmark's cleared state is encoded as an empty verse_key.
export function mergeRemote(prev: UserData, changes: Change[]): UserData {
  const next: UserData = {
    ...prev,
    favorites: [...prev.favorites],
    bookmark: prev.bookmark,
    labels: { ...prev.labels },
    labelLibrary: [...prev.labelLibrary],
    lastRead: { ...prev.lastRead },
    // memorized is a map mutated per-verse in the 'memorized_verse' case; copy it
    // so the delta pull never mutates the prev snapshot in place.
    memorized: { ...prev.memorized },
    prayerDays: { ...prev.prayerDays },
    reflections: { ...prev.reflections },
    appSettings: { ...prev.appSettings },
  };

  for (const c of changes) {
    switch (c.type) {
      case 'favorite': {
        const i = next.favorites.indexOf(c.verse_key);
        if (c.deleted) {
          if (i >= 0) next.favorites.splice(i, 1);
        } else if (i < 0) {
          next.favorites.push(c.verse_key);
        }
        break;
      }
      case 'bookmark':
        // Empty verse_key = bookmark cleared (NULL on the server).
        next.bookmark = c.verse_key ? c.verse_key : null;
        break;
      case 'label': {
        const arr = next.labels[c.verse_key] ? [...next.labels[c.verse_key]] : [];
        const i = arr.indexOf(c.label);
        if (c.deleted) {
          if (i >= 0) arr.splice(i, 1);
        } else if (i < 0) {
          arr.push(c.label);
        }
        if (arr.length) next.labels[c.verse_key] = arr;
        else delete next.labels[c.verse_key];
        break;
      }
      case 'label_lib': {
        const i = next.labelLibrary.indexOf(c.label);
        if (c.deleted) {
          if (i >= 0) next.labelLibrary.splice(i, 1);
        } else if (i < 0) {
          next.labelLibrary.push(c.label);
        }
        break;
      }
      case 'last_read':
        if (c.deleted) {
          delete next.lastRead[c.surah];
        } else {
          // The server stores only verse_key (no timestamp); approximate with
          // apply time — good enough for "Continue Reading" recency ordering.
          next.lastRead[c.surah] = { verseKey: c.verse_key, timestamp: Date.now() };
        }
        break;
      case 'setting':
        // App-level prefs ('app.*') live in next.appSettings, not the UserData
        // scalars — intercept before setSetting (which drops unknown keys).
        // deleted/null → null = "no account value" (device-local stands).
        if (c.key === 'app.darkMode' || c.key === 'app.lang' || c.key === 'app.alarms') {
          const app = { ...next.appSettings };
          const reset = c.deleted || c.value == null;
          if (c.key === 'app.darkMode') app.darkMode = reset ? null : c.value === true;
          else if (c.key === 'app.lang') app.lang = reset ? null : (c.value as AppLang);
          else app.alarms = reset ? null : c.value;
          next.appSettings = app;
          break;
        }
        // Each known setting key maps 1:1 to a UserData scalar. A deleted key
        // resets to its default.
        if (c.deleted) {
          setSetting(next, c.key, (DEFAULT_USER_DATA as unknown as Record<string, unknown>)[c.key]);
        } else {
          setSetting(next, c.key, c.value);
        }
        break;
      case 'reading_log':
        // Append-only sessions aren't held in UserData (the derived streak
        // summarizes them); just advance past the change.
        break;
      case 'khatm': {
        const goal: KhatmGoal = {
          id: c.payload.id,
          type: c.payload.type,
          unit: c.payload.unit,
          target: c.payload.target,
          rangeFrom: c.payload.rangeFrom ?? null,
          rangeTo: c.payload.rangeTo ?? null,
          startAt: c.payload.startAt,
          endAt: c.payload.endAt,
        };
        if (c.deleted) {
          next.khatmGoals = next.khatmGoals.filter((g) => g.id !== goal.id);
        } else {
          const i = next.khatmGoals.findIndex((g) => g.id === goal.id);
          if (i >= 0) {
            const copy = [...next.khatmGoals];
            copy[i] = goal;
            next.khatmGoals = copy;
          } else {
            next.khatmGoals = [...next.khatmGoals, goal];
          }
        }
        break;
      }
      case 'streak':
        next.streak = {
          current: c.payload.currentStreak,
          longest: c.payload.longestStreak,
          lastReadDate: c.payload.lastReadDate,
          totalPages: c.payload.totalPages,
        };
        break;
      case 'hafalan_target': {
        const target: HafalanTarget = {
          id: c.payload.id,
          scope: c.payload.scope,
          surahId: c.payload.surahId ?? null,
          juzId: c.payload.juzId ?? null,
          rangeFrom: c.payload.rangeFrom ?? null,
          rangeTo: c.payload.rangeTo ?? null,
          dailyAyahs: c.payload.dailyAyahs ?? null,
          deadline: c.payload.deadline ?? null,
          createdAt: c.payload.createdAt,
          archived: c.payload.archived ?? false,
        };
        if (c.deleted) {
          next.hafalanTargets = next.hafalanTargets.filter((t) => t.id !== target.id);
        } else {
          const i = next.hafalanTargets.findIndex((t) => t.id === target.id);
          if (i >= 0) {
            const copy = [...next.hafalanTargets];
            copy[i] = target;
            next.hafalanTargets = copy;
          } else {
            next.hafalanTargets = [...next.hafalanTargets, target];
          }
        }
        break;
      }
      case 'memorized_verse':
        // One row = one sync unit (whole-row last-write-wins). Deleted → drop the
        // verse from the map; otherwise overwrite it whole.
        if (c.deleted) {
          delete next.memorized[c.verse_key];
        } else {
          next.memorized[c.verse_key] = {
            verseKey: c.payload.verseKey,
            surah: c.payload.surah,
            ayah: c.payload.ayah,
            status: c.payload.status,
            memorizedAt: c.payload.memorizedAt ?? null,
            ease: c.payload.ease,
            intervalDays: c.payload.intervalDays,
            dueAt: c.payload.dueAt,
            reviewCount: c.payload.reviewCount,
            lastReviewedAt: c.payload.lastReviewedAt ?? null,
            lapses: c.payload.lapses,
            verifiedBy: c.payload.verifiedBy ?? null,
          };
        }
        break;
      case 'prayer_day': {
        // Whole-day boolean map, last-write-wins per day (never merged per-prayer
        // across devices). Deleted → the day is removed entirely.
        const days = { ...next.prayerDays };
        if (c.deleted) delete days[c.key];
        else days[c.key] = { ...c.payload };
        next.prayerDays = days;
        break;
      }
      case 'reflection': {
        // One entry (verse + transcript) whole, last-write-wins per 'date:mood'.
        const refl = { ...next.reflections };
        if (c.deleted) delete refl[c.key];
        else refl[c.key] = { ...c.payload };
        next.reflections = refl;
        break;
      }
    }
  }
  return next;
}

// setSetting assigns a setting value, falling back to the default if the server
// sent an out-of-range/empty value for a nullable field (e.g. repeatRangeFrom).
function setSetting(ud: UserData, key: string, value: unknown) {
  if (!(key in DEFAULT_USER_DATA)) return; // ignore unknown keys defensively
  (ud as unknown as Record<string, unknown>)[key] = value;
}

// ── Op queue: one queued PATCH per local mutation ───────────────────────────

export type Op =
  | { kind: 'favorite'; verseKey: string; deleted: boolean }
  | { kind: 'bookmark'; verseKey: string | null }
  | { kind: 'lastRead'; surah: number; verseKey: string }
  | { kind: 'labels'; verseKey: string; add: string[]; remove: string[] }
  | { kind: 'labelLib'; add: string[]; remove: string[] }
  | { kind: 'setting'; key: string; value: unknown }
  | {
      kind: 'readingLog';
      entry: { id: string; surah: number; fromVerse: string; toVerse: string; seconds: number; pages: number };
    }
  | {
      kind: 'khatm';
      goal: {
        id: string;
        type: GoalType;
        unit: GoalUnit;
        target: number;
        rangeFrom?: string | null;
        rangeTo?: string | null;
        startAt?: string;
        endAt?: string | null;
      };
    }
  | { kind: 'khatmDelete'; id: string }
  | { kind: 'hafalanTarget'; target: HafalanTarget }
  | { kind: 'hafalanTargetDelete'; id: string }
  | { kind: 'memorizedVerse'; verse: MemorizedVerse }
  | { kind: 'memorizedVerseDelete'; verseKey: string }
  // Account-attached progress (0008): batched items (callers chunk ≤100 days /
  // ≤20 reflections) so one flaky request can't wedge the queue for long.
  | { kind: 'prayerDays'; items: { day: string; data: PrayerDay }[] }
  | { kind: 'reflections'; items: ReflectionEntryData[] }
  | { kind: 'tz'; tz: string };

// applyOp sends one op as its scoped PATCH. Throws on network/HTTP failure (the
// caller leaves the op queued for the next flush) or AuthError (caller logs out).
async function applyOp(deviceId: string, op: Op): Promise<void> {
  switch (op.kind) {
    case 'favorite':
      await patchFavorite(deviceId, op.verseKey, op.deleted);
      break;
    case 'bookmark':
      await patchBookmark(deviceId, op.verseKey);
      break;
    case 'lastRead':
      await patchLastRead(deviceId, op.surah, op.verseKey);
      break;
    case 'labels':
      await patchLabels(deviceId, op.verseKey, op.add, op.remove);
      break;
    case 'labelLib':
      await patchLabelLib(deviceId, op.add, op.remove);
      break;
    case 'setting':
      await patchSetting(deviceId, op.key, op.value);
      break;
    case 'readingLog':
      await postReadingLog(deviceId, op.entry);
      break;
    case 'khatm':
      await upsertKhatm(deviceId, op.goal);
      break;
    case 'khatmDelete':
      await deleteKhatm(deviceId, op.id);
      break;
    case 'hafalanTarget':
      await upsertHafalanTarget(deviceId, op.target);
      break;
    case 'hafalanTargetDelete':
      await deleteHafalanTarget(deviceId, op.id);
      break;
    case 'memorizedVerse':
      await upsertMemorizedVerse(deviceId, op.verse);
      break;
    case 'memorizedVerseDelete':
      await deleteMemorizedVerse(deviceId, op.verseKey);
      break;
    case 'prayerDays':
      await patchPrayerDays(deviceId, op.items);
      break;
    case 'reflections':
      await patchReflections(deviceId, op.items);
      break;
    case 'tz':
      await patchTZ(deviceId, op.tz);
      break;
  }
}

// flushQueue sends queued ops FIFO, stopping at the first failure. Returns the
// remaining (un-sent) ops — empty on full success. The caller persists whatever
// is returned so offline edits survive a reload.
export async function flushQueue(deviceId: string, queue: Op[]): Promise<Op[]> {
  const remaining = [...queue];
  while (remaining.length) {
    await applyOp(deviceId, remaining[0]); // throws to abort on failure
    remaining.shift();
  }
  return remaining;
}

// ── Cursor + queue + snapshot-cache persistence (per-user) ─────────────────

// migrateLegacySyncKeys moves the pre-0008 un-suffixed cursor/queue keys to the
// per-user namespace on the first authed load of the new build, so offline ops
// queued by the old version aren't stranded. The cursor needs no migration —
// fullPull reseeds it from /state.
export async function migrateLegacySyncKeys(userId: string): Promise<void> {
  if (userId === 'guest') return;
  const legacyQ = await AsyncStorage.getItem(LEGACY_QUEUE_KEY);
  if (legacyQ != null && (await AsyncStorage.getItem(queueKey(userId))) == null) {
    await AsyncStorage.setItem(queueKey(userId), legacyQ);
  }
  await AsyncStorage.removeItem(LEGACY_QUEUE_KEY);
  await AsyncStorage.removeItem(LEGACY_CURSOR_KEY);
}

export async function loadCursor(userId: string): Promise<number> {
  const raw = await AsyncStorage.getItem(cursorKey(userId));
  if (!raw) return 0;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

export async function saveCursor(userId: string, cursor: number): Promise<void> {
  await AsyncStorage.setItem(cursorKey(userId), String(cursor));
}

export async function clearCursor(userId: string): Promise<void> {
  await AsyncStorage.removeItem(cursorKey(userId));
}

export async function loadQueue(userId: string): Promise<Op[]> {
  const raw = await AsyncStorage.getItem(queueKey(userId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Op[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveQueue(userId: string, queue: Op[]): Promise<void> {
  await AsyncStorage.setItem(queueKey(userId), JSON.stringify(queue));
}

export async function clearQueue(userId: string): Promise<void> {
  await AsyncStorage.removeItem(queueKey(userId));
}

// Snapshot cache: the last merged UserData, written after every successful
// full/delta pull and read when a pull fails offline (render cache → next
// online foreground pull from cursor 0 converges via idempotent merges).
export async function loadCache(userId: string): Promise<UserData | null> {
  const raw = await AsyncStorage.getItem(cacheKey(userId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as UserData;
    // Spread defaults first so fields added after this cache was written are
    // backfilled instead of undefined (same pattern as the guest doc).
    return { ...DEFAULT_USER_DATA, ...parsed };
  } catch {
    return null;
  }
}

export async function saveCache(userId: string, ud: UserData): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey(userId), JSON.stringify(ud));
  } catch {
    /* cache write is best-effort — never block a pull on it */
  }
}

export async function clearCache(userId: string): Promise<void> {
  await AsyncStorage.removeItem(cacheKey(userId));
}
