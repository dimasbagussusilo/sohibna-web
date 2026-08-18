// useQuranData — the Quran reader's user-data store (settings + favorites +
// bookmark + labels + last-read), now multi-device sync-backed.
//
// Server is the source of truth. Authed devices: full pull on login (GET /state),
// delta pull on app foreground (GET /changes?since=cursor), and per-resource
// PATCH on each mutation (optimistic local apply + an offline op queue flushed
// on reconnect). Guests (no token) keep state purely in memory — they store
// NOTHING on device, so a guest's favorites/bookmark/settings are ephemeral and
// reset to defaults on restart/logout.
//
// The exported mutation names are unchanged from the pre-sync version, so the
// reader screens don't change. Internals switch from a debounced whole-document
// PUT to scoped per-resource PATCHes.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@/lib/storage';
import { DEFAULT_USER_DATA, displayModeTransition, forwardRangeForSlot, markVerseKey, type DisplayMode, type UserData, type KhatmGoal, type HafalanTarget, type HafalanScope, type MemorizedStatus, type ReviewOutcome } from '@/lib/quran';
import { clearLegacyGuestData } from '@/lib/quranStorage';
import {
  mergeRemote,
  loadCursor,
  saveCursor,
  clearCursor,
  loadQueue,
  saveQueue,
  clearQueue,
  flushQueue,
  type Op,
} from '@/lib/quranSync';
import { AuthError, getChanges, getState } from '@/api';
import { getDeviceId } from '@/lib/deviceId';
import { useAuth } from '@/context/AuthContext';
import type { GoalType, GoalUnit } from '@/api';
import { seedMemorized, seedLearning, applyReviewOutcome } from '@/hafalan/spacedRepetition';

import { uuidv4 } from '@/lib/uuid';

// UserData keys that are reader SETTINGS (synced as per-key PATCH /settings).
// Collection keys (favorites/bookmark/labels/lastRead/labelLibrary) have their
// own dedicated resources and never come through setUD.
const SETTING_KEYS = new Set<string>([
  'script',
  'fontSize',
  'reciterId',
  'showEnglish',
  'showIndonesian',
  'showEnglishTafsir',
  'showIndoTafsir',
  'darkMode',
  'audioRate',
  'repeatMode',
  'repeatCount',
  'repeatRangeFrom',
  'repeatRangeTo',
  'autoScroll',
  'wordHighlight',
  'wordPopup',
  // Reading (continuous) vs verse-by-verse, plus the snapshot that lets us restore
  // translations/tafsir when switching back (see displayModeTransition).
  'displayMode',
  'readingSnapshot',
  // lastReadSlots is a whole-map setting (named marks → {verseKey, ts}). Synced
  // as one JSON value via /settings (setSetting assigns it directly). The per-mark
  // `ts` is what lets "Continue Reading" pick the most-recently-created mark.
  'lastReadSlots',
]);

// Guests have no server account, so their UserData is persisted LOCALLY here
// (the full denormalized document) — otherwise every guest setting/favorite would
// reset to defaults on restart. Authed users never read or write this key: the
// server is their source of truth, so we don't cache stale local state over it.
const LOCAL_UD_KEY = 'sohibna.quran.guestUD';

export function useQuranData() {
  const { token, loading: authLoading, logout } = useAuth();
  const [ud, setUdState] = useState<UserData>(DEFAULT_USER_DATA);
  // Exposed so the reader can avoid rendering Arabic with DEFAULT settings before
  // the real saved document has loaded (otherwise the first surah open flashes
  // through the default script/size before the user's settings apply).
  const [loaded, setLoaded] = useState(false);

  // Refs hold the latest values for use inside async callbacks (flush/pull) and
  // let mutations read current state without side-effects-in-a-reducer (which
  // double-fire under React StrictMode and would double-enqueue ops).
  const tokenRef = useRef<string | null>(null);
  const udRef = useRef<UserData>(ud);
  const cursorRef = useRef<number>(0);
  const queueRef = useRef<Op[]>([]);
  const flushingRef = useRef(false);

  // Keep the latest token + UserData in refs for use inside async callbacks
  // (flush/pull). Updated in effects (not during render) per the react-hooks
  // rules; interactions always fire after these have committed.
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);
  useEffect(() => {
    udRef.current = ud;
  }, [ud]);
  const deviceId = useMemo(() => getDeviceId(), []);

  // flush sends queued ops FIFO, stopping at the first failure (leaving the rest
  // queued). AuthError → logout.
  const flush = useCallback(async () => {
    if (!tokenRef.current || flushingRef.current || queueRef.current.length === 0) return;
    flushingRef.current = true;
    try {
      const remaining = await flushQueue(deviceId, queueRef.current);
      queueRef.current = remaining;
      await saveQueue(remaining);
    } catch (e) {
      if (e instanceof AuthError) void logout();
      // network/5xx: leave the queue intact for the next foreground/mutation
    } finally {
      flushingRef.current = false;
    }
  }, [deviceId, logout]);

  // enqueueOp appends a server op and tries to flush. No-op for guests — they
  // don't persist (their state is in-memory only).
  const enqueueOp = useCallback(
    (op: Op) => {
      if (!tokenRef.current) return;
      queueRef.current = [...queueRef.current, op];
      void saveQueue(queueRef.current);
      void flush();
    },
    [flush],
  );

  // deltaPull fetches changes since the cursor and merges them, looping while the
  // feed signals more pages. This is what keeps a second device in sync.
  const deltaPull = useCallback(async () => {
    if (!tokenRef.current) return;
    try {
      let since = cursorRef.current;
      let hasMore = true;
      while (hasMore) {
        const feed = await getChanges(deviceId, since, 200);
        if (feed.changes.length) {
          setUdState((prev) => mergeRemote(prev, feed.changes));
        }
        since = feed.cursor;
        if (since > cursorRef.current) {
          cursorRef.current = since;
          await saveCursor(since);
        }
        hasMore = feed.has_more;
      }
    } catch (e) {
      if (e instanceof AuthError) void logout();
      // else: silent — the next foreground/mutation retries
    }
  }, [deviceId, logout]);

  // fullPull loads the complete live snapshot (fresh login / cursor reset),
  // seeds the cursor, and flushes any queued ops. On network failure it falls
  // back to a guest-style local load so the UI still renders.
  const fullPull = useCallback(async () => {
    if (!tokenRef.current) return;
    try {
      const st = await getState(deviceId);
      cursorRef.current = st.cursor;
      await saveCursor(st.cursor);
      setUdState(mergeRemote(DEFAULT_USER_DATA, st.changes));
      setLoaded(true);
      // Best-effort: tell the server our timezone so streak day boundaries are
      // computed in the reader's local day, not UTC.
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) enqueueOp({ kind: 'tz', tz });
      void flush();
    } catch (e) {
      if (e instanceof AuthError) {
        void logout();
        return;
      }
      // offline at login: render defaults so the reader is usable, and reset the
      // cursor so the next foreground delta pull (once online) reconstructs the
      // full account state from seq 0.
      cursorRef.current = 0;
      await saveCursor(0);
      setUdState({ ...DEFAULT_USER_DATA });
      setLoaded(true);
    }
  }, [deviceId, enqueueOp, flush, logout]);

  // (Re)load when the auth token settles or changes. Authed → full pull; guest →
  // local load. Gated on authLoading so the initial load uses the resolved token.
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (token) {
        cursorRef.current = await loadCursor();
        queueRef.current = await loadQueue();
        if (!cancelled) void fullPull();
      } else {
        // Guest: no account to sync to, but persist UserData LOCALLY so a
        // returning guest's script/font/reciter/favorites/labels survive a
        // restart instead of resetting to defaults. Legacy on-device guest
        // data (pre-sync format) is wiped first.
        cursorRef.current = 0;
        queueRef.current = [];
        await clearCursor();
        await clearQueue();
        await clearLegacyGuestData();
        let guestUD: UserData | null = null;
        try {
          const raw = await AsyncStorage.getItem(LOCAL_UD_KEY);
          if (raw) guestUD = JSON.parse(raw) as UserData;
        } catch {
          /* ignore bad cache → fall back to defaults */
        }
        if (!cancelled) {
          // Spread defaults FIRST so newly-added UserData fields (e.g. memorized,
          // hafalanTargets) are backfilled for guest documents persisted before
          // they existed — without clobbering any field the guest already has.
          setUdState({ ...DEFAULT_USER_DATA, ...(guestUD ?? {}) });
          setLoaded(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, authLoading, fullPull]);

  // On foreground: pull deltas + flush queued ops (catches changes made on
  // another device while this one was backgrounded). Web equivalents of RN's
  // AppState: visibilitychange (tab/PWA foregrounded), the online event
  // (reconnect), and a 5-minute interval — a desktop PWA can stay visible for
  // hours without ever firing visibilitychange, so the interval is what keeps
  // long sessions converging with other devices.
  useEffect(() => {
    const syncNow = () => {
      if (!tokenRef.current) return;
      void deltaPull();
      void flush();
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') syncNow();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', syncNow);
    const id = setInterval(syncNow, 5 * 60_000);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', syncNow);
      clearInterval(id);
    };
  }, [deltaPull, flush]);

  // Guests persist their full UserData locally (their only store — no server).
  // Authed users skip this so the server stays the source of truth. Gated on
  // `loaded` so the pre-load DEFAULT never clobbers a saved guest document.
  useEffect(() => {
    if (!loaded || tokenRef.current) return;
    AsyncStorage.setItem(LOCAL_UD_KEY, JSON.stringify(ud)).catch(() => {});
  }, [ud, loaded]);

  // reload: pull fresh deltas WITHOUT touching the loaded flag. Used by screens
  // that only DISPLAY user data (the Quran tab dashboard) to refresh on focus.
  const reload = useCallback(() => {
    void deltaPull();
  }, [deltaPull]);

  // persist enqueues a scoped op when authed. Guests don't persist (their state
  // is in-memory only), so a guest mutation just updates the UI for the session.
  const persist = useCallback(
    (_next: UserData, op: Op | null) => {
      if (tokenRef.current && op) enqueueOp(op);
    },
    [enqueueOp],
  );

  const setUD = useCallback(
    (updates: Partial<UserData>) => {
      const prev = udRef.current;
      const next = { ...prev, ...updates };
      setUdState(next);
      if (tokenRef.current) {
        // Split into per-key setting PATCHes (each setting is its own sync unit).
        const patch = updates as Record<string, unknown>;
        for (const key of Object.keys(patch)) {
          if (SETTING_KEYS.has(key)) {
            enqueueOp({ kind: 'setting', key, value: patch[key] });
          }
        }
      }
    },
    [enqueueOp],
  );

  // Switch verse ↔ reading mode, applying the auto-adjust (hide translations/tafsir
  // on entry; restore on exit). Delegates to the pure displayModeTransition so the
  // reader's live toggle and the ReaderSettingsSheet draft stay in lock-step.
  const setDisplayMode = useCallback(
    (mode: DisplayMode) => {
      setUD(displayModeTransition(udRef.current, mode));
    },
    [setUD],
  );

  const toggleFav = useCallback(
    (vk: string) => {
      const prev = udRef.current;
      const isFav = prev.favorites.includes(vk);
      const favorites = isFav ? prev.favorites.filter((x) => x !== vk) : [...prev.favorites, vk];
      const next = { ...prev, favorites };
      setUdState(next);
      persist(next, { kind: 'favorite', verseKey: vk, deleted: isFav });
    },
    [persist],
  );

  // setBk (the single MANUAL 🔖 bookmark) was removed from the UI — named Reading
  // Marks (lastReadSlots) now cover pinning. The `bookmark` field + sync Op/case
  // remain so legacy rows don't break, but nothing writes to it anymore.

  const addLabel = useCallback(
    (vk: string, label: string) => {
      const prev = udRef.current;
      const labels = { ...prev.labels };
      const cur = labels[vk] ? [...labels[vk]] : [];
      if (!cur.includes(label)) cur.push(label);
      labels[vk] = cur;
      const next = { ...prev, labels };
      setUdState(next);
      persist(next, { kind: 'labels', verseKey: vk, add: [label], remove: [] });
    },
    [persist],
  );

  // Add a user-typed label: tags the verse AND records the label in the library
  // so it's suggested next time. (Labels are free-form — there's no fixed set.)
  const addCustomLabel = useCallback(
    (vk: string, label: string) => {
      const clean = label.trim();
      if (!clean) return;
      const prev = udRef.current;
      const labels = { ...prev.labels };
      const cur = labels[vk] ? [...labels[vk]] : [];
      if (!cur.includes(clean)) cur.push(clean);
      labels[vk] = cur;
      const labelLibrary = prev.labelLibrary.includes(clean)
        ? prev.labelLibrary
        : [...prev.labelLibrary, clean];
      const next = { ...prev, labels, labelLibrary };
      setUdState(next);
      if (tokenRef.current) {
        enqueueOp({ kind: 'labels', verseKey: vk, add: [clean], remove: [] });
        enqueueOp({ kind: 'labelLib', add: [clean], remove: [] });
      }
    },
    [enqueueOp],
  );

  const rmLabel = useCallback(
    (vk: string, label: string) => {
      const prev = udRef.current;
      const labels = { ...prev.labels };
      if (labels[vk]) {
        const filtered = labels[vk].filter((l) => l !== label);
        if (filtered.length) labels[vk] = filtered;
        else delete labels[vk];
      }
      const next = { ...prev, labels };
      setUdState(next);
      persist(next, { kind: 'labels', verseKey: vk, add: [], remove: [label] });
    },
    [persist],
  );

  // removeLabelEverywhere deletes a label from the suggestion library AND from
  // every verse it's tagged on (rmLabel only strips one verse). This is the
  // "delete this label" action surfaced from the My Data dashboard. The labelLib
  // remove + per-verse removes are independent rows on the server, so we enqueue
  // one op per affected verse plus one library op (the whole pipeline already
  // exists; nothing here called it before).
  const removeLabelEverywhere = useCallback(
    (label: string) => {
      const prev = udRef.current;
      const labels = { ...prev.labels };
      const affected: string[] = [];
      for (const vk of Object.keys(labels)) {
        if (!labels[vk].includes(label)) continue;
        const filtered = labels[vk].filter((l) => l !== label);
        if (filtered.length) labels[vk] = filtered;
        else delete labels[vk];
        affected.push(vk);
      }
      const labelLibrary = prev.labelLibrary.filter((l) => l !== label);
      const next = { ...prev, labels, labelLibrary };
      setUdState(next);
      if (tokenRef.current) {
        for (const vk of affected) enqueueOp({ kind: 'labels', verseKey: vk, add: [], remove: [label] });
        enqueueOp({ kind: 'labelLib', add: [], remove: [label] });
      }
    },
    [enqueueOp],
  );

  // Record that the user read up to `vk` in `surah` (drives "Continue Reading").
  const recordLastRead = useCallback(
    (surah: number, vk: string) => {
      const prev = udRef.current;
      // Throttle: only record when this verse differs from the last stored one.
      const existing = prev.lastRead[surah];
      if (existing && existing.verseKey === vk) return;
      const next = {
        ...prev,
        lastRead: { ...prev.lastRead, [surah]: { verseKey: vk, timestamp: Date.now() } },
      };
      setUdState(next);
      persist(next, { kind: 'lastRead', surah, verseKey: vk });
    },
    [persist],
  );

  // Named "last read" slots: each name → ONE verse (overwritten on re-mark). The
  // whole map is synced as a single reader setting (last-write-wins per the sync
  // model). setUD enqueues the {setting} op because 'lastReadSlots' is a SETTING_KEY.
  // Returns {from, to} when this call moved the slot FORWARD in mushaf order (a
  // real reading segment) so callers can surface the "summarize what you just
  // read" banner; null otherwise (new slot, unchanged, or backward move).
  const setLastReadSlot = useCallback(
    (name: string, vk: string): { from: string; to: string } | null => {
      const clean = name.trim();
      if (!clean) return null;
      const prev = udRef.current;
      // Stale value may be a bare string (pre-migration); normalize + stamp `ts`
      // so this mark becomes the most-recently-created ("Continue Reading").
      if (markVerseKey(prev.lastReadSlots[clean]) === vk) return null; // unchanged
      const range = forwardRangeForSlot(prev.lastReadSlots, clean, vk);
      setUD({ lastReadSlots: { ...prev.lastReadSlots, [clean]: { verseKey: vk, ts: Date.now() } } });
      return range;
    },
    [setUD],
  );
  const clearLastReadSlot = useCallback(
    (name: string) => {
      const prev = udRef.current;
      if (!(name in prev.lastReadSlots)) return;
      const next = { ...prev.lastReadSlots };
      delete next[name];
      setUD({ lastReadSlots: next });
    },
    [setUD],
  );

  // logReadingSession records a reading session server-side (which recomputes the
  // streak). No local UserData change — the derived streak comes back via the
  // next /changes pull. No-op for guests (streaks are server-derived). The caller
  // supplies a stable id (uuid) so a re-POST after a flaky network is idempotent.
  const logReadingSession = useCallback(
    (entry: {
      id?: string;
      surah: number;
      fromVerse: string;
      toVerse: string;
      seconds: number;
      pages: number;
    }) => {
      if (!tokenRef.current) return;
      enqueueOp({
        kind: 'readingLog',
        entry: { id: entry.id ?? uuidv4(), surah: entry.surah, fromVerse: entry.fromVerse, toVerse: entry.toVerse, seconds: entry.seconds, pages: entry.pages },
      });
    },
    [enqueueOp],
  );

  // upsertKhatmGoal creates/updates a goal optimistically + syncs it. Progress is
  // derived server-side, so it isn't part of the goal definition.
  const upsertKhatmGoal = useCallback(
    (goal: {
      id: string;
      type: GoalType;
      unit: GoalUnit;
      target: number;
      rangeFrom?: string | null;
      rangeTo?: string | null;
      startAt?: string;
      endAt?: string | null;
    }) => {
      const prev = udRef.current;
      const existing = prev.khatmGoals.find((g) => g.id === goal.id);
      const startAt = goal.startAt ?? existing?.startAt ?? new Date().toISOString();
      const live: KhatmGoal = {
        id: goal.id,
        type: goal.type,
        unit: goal.unit,
        target: goal.target,
        rangeFrom: goal.rangeFrom ?? null,
        rangeTo: goal.rangeTo ?? null,
        startAt,
        endAt: goal.endAt ?? '',
      };
      const khatmGoals = existing
        ? prev.khatmGoals.map((g) => (g.id === goal.id ? live : g))
        : [...prev.khatmGoals, live];
      const next = { ...prev, khatmGoals };
      setUdState(next);
      persist(next, { kind: 'khatm', goal: live });
    },
    [persist],
  );

  // removeKhatmGoal soft-deletes a goal (tombstone propagates to other devices).
  const removeKhatmGoal = useCallback(
    (id: string) => {
      const prev = udRef.current;
      const next = { ...prev, khatmGoals: prev.khatmGoals.filter((g) => g.id !== id) };
      setUdState(next);
      persist(next, { kind: 'khatmDelete', id });
    },
    [persist],
  );

  // ── Hafalan (memorization) ───────────────────────────────────────────────
  // upsertHafalanTarget creates/updates a memorization target optimistically +
  // syncs it. createdAt is preserved across edits (the server stamps it on first
  // insert; the client keeps the known value so the UI is consistent pre-sync).
  const upsertHafalanTarget = useCallback(
    (target: {
      id: string;
      scope: HafalanScope;
      surahId?: number | null;
      juzId?: number | null;
      rangeFrom?: string | null;
      rangeTo?: string | null;
      dailyAyahs?: number | null;
      deadline?: string | null;
      archived?: boolean;
    }) => {
      const prev = udRef.current;
      const existing = prev.hafalanTargets.find((t) => t.id === target.id);
      const createdAt = existing?.createdAt ?? new Date().toISOString();
      const live: HafalanTarget = {
        id: target.id,
        scope: target.scope,
        surahId: target.surahId ?? null,
        juzId: target.juzId ?? null,
        rangeFrom: target.rangeFrom ?? null,
        rangeTo: target.rangeTo ?? null,
        dailyAyahs: target.dailyAyahs ?? null,
        deadline: target.deadline ?? null,
        createdAt,
        archived: target.archived ?? false,
      };
      const hafalanTargets = existing
        ? prev.hafalanTargets.map((t) => (t.id === target.id ? live : t))
        : [...prev.hafalanTargets, live];
      const next = { ...prev, hafalanTargets };
      setUdState(next);
      persist(next, { kind: 'hafalanTarget', target: live });
    },
    [persist],
  );

  // removeHafalanTarget soft-deletes a target (tombstone propagates).
  const removeHafalanTarget = useCallback(
    (id: string) => {
      const prev = udRef.current;
      const next = { ...prev, hafalanTargets: prev.hafalanTargets.filter((t) => t.id !== id) };
      setUdState(next);
      persist(next, { kind: 'hafalanTargetDelete', id });
    },
    [persist],
  );

  // markMemorized sets a verse's status. Promoting to 'memorized' seeds the SM-2
  // review state (due immediately); demoting to 'learning' clears it. One row =
  // one sync unit, so the whole verse is persisted on each change.
  const markMemorized = useCallback(
    (verseKey: string, status: MemorizedStatus) => {
      const prev = udRef.current;
      const [surah, ayah] = verseKey.split(':').map(Number);
      const existing = prev.memorized[verseKey];
      const live =
        status === 'memorized'
          ? existing && existing.status === 'memorized'
            ? existing
            : seedMemorized(verseKey, surah, ayah)
          : seedLearning(verseKey, surah, ayah);
      const memorized = { ...prev.memorized, [verseKey]: live };
      const next = { ...prev, memorized };
      setUdState(next);
      persist(next, { kind: 'memorizedVerse', verse: live });
    },
    [persist],
  );

  // recordReview advances one memorized verse's SM-2 schedule by the given
  // recall grade. No-op if the verse isn't tracked or isn't memorized.
  const recordReview = useCallback(
    (verseKey: string, outcome: ReviewOutcome) => {
      const prev = udRef.current;
      const existing = prev.memorized[verseKey];
      if (!existing || existing.status !== 'memorized') return;
      const live = applyReviewOutcome(existing, outcome);
      const memorized = { ...prev.memorized, [verseKey]: live };
      const next = { ...prev, memorized };
      setUdState(next);
      persist(next, { kind: 'memorizedVerse', verse: live });
    },
    [persist],
  );

  // removeMemorizedVerse "forgets" a verse (drops it from the memorized map);
  // the tombstone propagates to other devices.
  const removeMemorizedVerse = useCallback(
    (verseKey: string) => {
      const prev = udRef.current;
      if (!prev.memorized[verseKey]) return;
      const memorized = { ...prev.memorized };
      delete memorized[verseKey];
      const next = { ...prev, memorized };
      setUdState(next);
      persist(next, { kind: 'memorizedVerseDelete', verseKey });
    },
    [persist],
  );

  return {
    ud,
    loaded,
    reload,
    setUD,
    setDisplayMode,
    toggleFav,
    addLabel,
    addCustomLabel,
    rmLabel,
    removeLabelEverywhere,
    recordLastRead,
    setLastReadSlot,
    clearLastReadSlot,
    logReadingSession,
    upsertKhatmGoal,
    removeKhatmGoal,
    upsertHafalanTarget,
    removeHafalanTarget,
    markMemorized,
    recordReview,
    removeMemorizedVerse,
  };
}
