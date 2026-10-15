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
import { DEFAULT_USER_DATA, displayModeTransition, forwardRangeForSlot, markVerseKey, type DisplayMode, type UserData, type KhatmGoal, type HafalanTarget, type HafalanScope, type MemorizedStatus, type ReviewOutcome, type PrayerDay, type ReflectionEntryData, type RulingsChatEntryData, type AppLang, type Appearance } from '@/lib/quran';
import { clearLegacyGuestData } from '@/lib/quranStorage';
import {
  mergeRemote,
  migrateLegacySyncKeys,
  loadCursor,
  saveCursor,
  clearCursor,
  loadQueue,
  saveQueue,
  clearQueue,
  loadCache,
  saveCache,
  flushQueue,
  reapplyAppSettings,
  coalesceOp,
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
//
// ⚠ Every entry here MUST also exist in the server's allowedSettingKeys
// (internal/quran/models.go) — a key the server rejects returns 400, which
// poisons the head of the FIFO op queue (flushQueue aborts at the first
// failure). App-level prefs go through 'app.*' keys, NOT this set.
const SETTING_KEYS = new Set<string>([
  'script',
  'fontSize',
  'reciterId',
  'showEnglish',
  'showIndonesian',
  'showEnglishTafsir',
  'showIndoTafsir',
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
  // True once the user manually picks translations/tafsir in Reader Settings —
  // pauses "content follows app language" (see useQuranContentLang).
  'contentLangOverride',
  // NOTE: lastReadSlots (named reading marks) is NOT here anymore — since 0011
  // it syncs per-slot via PATCH /last-read-slots ops (latest-activity-wins by
  // client ts). The server still ACCEPTS the legacy whole-map setting key so
  // un-upgraded builds don't wedge their queues; we never send it.
]);

// Guests have no server account, so their UserData is persisted LOCALLY here
// (the full denormalized document) — otherwise every guest setting/favorite would
// reset to defaults on restart. Authed users never read or write this key: the
// server is their source of truth, so we don't cache stale local state over it.
const LOCAL_UD_KEY = 'sohibna.quran.guestUD';

// Per-user backfill flag: once a user's local-only prayer/reflection history +
// app prefs have been offered to the server, never re-scan (the scan reads every
// AsyncStorage key, and re-uploading after logout/re-login would race edits made
// on other devices).
const backfillFlagKey = (userId: string) => `sohibna.quran.backfill.${userId}`;

// Chunk sizes for backfill batch ops — bounded so one flaky request can't wedge
// the FIFO queue for long (flushQueue aborts at the first failure).
const BACKFILL_PRAYER_CHUNK = 100;
const BACKFILL_REFLECTION_CHUNK = 20;

// Legacy local prayer-tracker keys ('prayed:<YYYY-MM-DD>') store CAPITALIZED
// prayer names; the synced PrayerDay shape is lowercase.
const PRAYER_NAME_MAP: Record<string, keyof PrayerDay> = {
  Fajr: 'fajr',
  Dhuhr: 'dhuhr',
  Asr: 'asr',
  Maghrib: 'maghrib',
  Isha: 'isha',
};

// collectBackfillOps scans the device's local-only progress (legacy
// 'prayed:<day>' keys, 'reflection:<date>:<mood>' entries, and app prefs the
// account doesn't have yet) and returns the ops that would upload them.
// ACCOUNT WINS: any key the server snapshot already has is skipped silently —
// this protects an existing account from being clobbered by another device's
// local data, and a re-login from re-uploading days the user changed elsewhere.
async function collectBackfillOps(snapshot: UserData): Promise<Op[]> {
  const ops: Op[] = [];
  const keys = await AsyncStorage.getAllKeys();

  // Prayer days the server doesn't have yet.
  const prayerItems: { day: string; data: PrayerDay }[] = [];
  for (const k of keys) {
    if (!k.startsWith('prayed:')) continue;
    const day = k.slice('prayed:'.length);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day in snapshot.prayerDays) continue;
    try {
      const raw = await AsyncStorage.getItem(k);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      const data = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
      for (const [name, on] of Object.entries(parsed)) {
        const prop = PRAYER_NAME_MAP[name];
        if (prop) data[prop] = !!on;
      }
      prayerItems.push({ day, data });
    } catch {
      /* skip malformed day keys */
    }
  }
  for (let i = 0; i < prayerItems.length; i += BACKFILL_PRAYER_CHUNK) {
    ops.push({ kind: 'prayerDays', items: prayerItems.slice(i, i + BACKFILL_PRAYER_CHUNK) });
  }

  // Reflections the server doesn't have yet.
  const reflectionItems: ReflectionEntryData[] = [];
  for (const k of keys) {
    if (!k.startsWith('reflection:')) continue;
    const rest = k.slice('reflection:'.length); // '<date>:<mood>'
    const key = rest.split(':').slice(0, 2).join(':');
    if (!/^\d{4}-\d{2}-\d{2}:[a-z]+$/.test(key) || key in snapshot.reflections) continue;
    try {
      const raw = await AsyncStorage.getItem(k);
      if (!raw) continue;
      const entry = JSON.parse(raw) as ReflectionEntryData;
      if (entry && typeof entry.date === 'string' && typeof entry.mood === 'string') {
        reflectionItems.push(entry);
      }
    } catch {
      /* skip malformed entries */
    }
  }
  for (let i = 0; i < reflectionItems.length; i += BACKFILL_REFLECTION_CHUNK) {
    ops.push({ kind: 'reflections', items: reflectionItems.slice(i, i + BACKFILL_REFLECTION_CHUNK) });
  }

  // App prefs the account has no value for yet (null = not set server-side).
  if (snapshot.appSettings.appearance === null) {
    const raw = await AsyncStorage.getItem('sohibna:appearance');
    if (raw === 'light' || raw === 'dark' || raw === 'auto') ops.push({ kind: 'setting', key: 'app.darkMode', value: raw });
  }
  if (snapshot.appSettings.lang === null) {
    const raw = await AsyncStorage.getItem('sohibna:lang');
    if (raw === 'id' || raw === 'en' || raw === 'ar') ops.push({ kind: 'setting', key: 'app.lang', value: raw });
  }
  if (snapshot.appSettings.alarms === null) {
    const raw = await AsyncStorage.getItem('sohibna:alarm_settings');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        ops.push({ kind: 'setting', key: 'app.alarms', value: parsed });
      } catch {
        /* skip malformed settings */
      }
    }
  }
  if (snapshot.appSettings.reminders === null) {
    // Web never writes this storage key, so this no-ops — kept verbatim to
    // mirror the RN hook (the sync files are copied between platforms).
    const raw = await AsyncStorage.getItem('sohibna:reminder_settings');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        ops.push({ kind: 'setting', key: 'app.reminders', value: parsed });
      } catch {
        /* skip malformed settings */
      }
    }
  }
  return ops;
}

// ⚠ SINGLE-INSTANCE RULE: this hook owns per-user sync state (queue, cursor,
// ud). Mount it EXACTLY ONCE — QuranDataContext does that — and consume it via
// `useQuranData()` from '@/context/QuranDataContext'. Calling useQuranDataSync
// directly from a component creates a SECOND sync engine with its own in-memory
// queue and cursor: the instances race on the same disk queue (last save wins,
// silently erasing the other's pending ops — "my mark didn't save") and each
// runs its own fullPull on mount (duplicate /state bursts).
export function useQuranDataSync() {
  const { token, user, loading: authLoading, logout } = useAuth();
  // Sync-scope id: per-user cursor/queue/cache keys ('guest' when logged out)
  // so two accounts on one device never reuse each other's sync state.
  const uid = user?.id ?? 'guest';
  const [ud, setUdState] = useState<UserData>(DEFAULT_USER_DATA);
  // Exposed so the reader can avoid rendering Arabic with DEFAULT settings before
  // the real saved document has loaded (otherwise the first surah open flashes
  // through the default script/size before the user's settings apply).
  const [loaded, setLoaded] = useState(false);
  // True while an app.lang op sits unflushed in the queue. The RTL language
  // switch relaunches the app right after queueing its op, so the snapshot (or
  // offline cache) the app rebuilds from can briefly carry the PREVIOUS
  // language — AccountLangApply must not revert the user's choice while their
  // op is still in flight (it holds off until a pull confirms the value).
  const [pendingLang, setPendingLang] = useState(false);

  // Refs hold the latest values for use inside async callbacks (flush/pull) and
  // let mutations read current state without side-effects-in-a-reducer (which
  // double-fire under React StrictMode and would double-enqueue ops).
  const tokenRef = useRef<string | null>(null);
  const udRef = useRef<UserData>(ud);
  const cursorRef = useRef<number>(0);
  const queueRef = useRef<Op[]>([]);
  const flushingRef = useRef(false);
  // Guards against concurrent fullPulls (see fullPull below).
  const pullingRef = useRef(false);

  // Keep the latest token + UserData in refs for use inside async callbacks
  // (flush/pull). Updated in effects (not during render) per the react-hooks
  // rules; interactions always fire after these have committed.
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);
  useEffect(() => {
    udRef.current = ud;
  }, [ud]);
  // uid in a ref for async callbacks (flush/backfill) — reads the CURRENT scope
  // even across awaits after a logout switched it.
  const uidRef = useRef<string>(uid);
  useEffect(() => {
    uidRef.current = uid;
  }, [uid]);
  const deviceId = useMemo(() => getDeviceId(), []);

  // Mirror "an app.lang op is queued" into state for AccountLangApply. Called
  // at every queue mutation (enqueue / flush / load).
  const syncPendingLang = useCallback((queue: Op[]) => {
    const pending = queue.some((op) => op.kind === 'setting' && op.key === 'app.lang');
    setPendingLang((prev) => (prev === pending ? prev : pending));
  }, []);

  // flush sends queued ops FIFO, stopping at the first failure (leaving the rest
  // queued). AuthError → logout.
  const flush = useCallback(async () => {
    if (!tokenRef.current || flushingRef.current || queueRef.current.length === 0) return;
    flushingRef.current = true;
    try {
      // The exact run flushQueue consumes. Ops enqueued DURING the await
      // (enqueueOp doesn't block on flushingRef) exist only in queueRef — and
      // coalescing may have REPLACED an inflight op at any position, not just
      // appended. So rebuild by identity: the un-sent remainder first (stuck
      // head stays head), then everything currently queued this flush never
      // saw. Reference equality is safe — Op objects are never cloned between
      // enqueue and flush.
      const inflight = queueRef.current;
      const remaining = await flushQueue(deviceId, inflight);
      const survivors = queueRef.current.filter(
        (q) => !inflight.includes(q) && !remaining.includes(q),
      );
      queueRef.current = [...remaining, ...survivors];
      await saveQueue(uidRef.current, queueRef.current);
      syncPendingLang(queueRef.current);
      // App prefs were applied optimistically at enqueue time, but a relaunch
      // (the RTL language switch) rebuilds ud from the server/cache BEFORE
      // this flush lands them — fold the pre-flush app ops back over the
      // rebuilt state so the stale snapshot value can't revert the user's
      // choice before a pull confirms it. (Last op wins, matching the queue's
      // own ordering; any pull-newer value re-lands on the next merge.)
      const reapplied = reapplyAppSettings(udRef.current, [...inflight, ...survivors]);
      if (reapplied !== udRef.current) setUdState(reapplied);
    } catch (e) {
      if (e instanceof AuthError) void logout();
      // network/5xx: leave the queue intact for the next foreground/mutation
    } finally {
      flushingRef.current = false;
    }
  }, [deviceId, logout, syncPendingLang]);

  // enqueueOp appends a server op (coalescing same-key setting/tz ops — see
  // coalesceOp), persists the queue, and tries to flush. Returns a promise
  // that resolves once the queue is DURABLY saved — callers that relaunch the
  // app (the RTL language switch in setAppSetting's callers) await it so the
  // restart can't outrun the disk write; the flush stays fire-and-forget.
  // No-op for guests — they don't persist (their state is in-memory only).
  const enqueueOp = useCallback(
    (op: Op) => {
      if (!tokenRef.current) return Promise.resolve();
      queueRef.current = coalesceOp(queueRef.current, op);
      syncPendingLang(queueRef.current);
      const saved = saveQueue(uidRef.current, queueRef.current);
      void flush();
      return saved;
    },
    [flush, syncPendingLang],
  );

  // backfillLocalProgress uploads local-only progress ONCE per user (gated by
  // the per-user flag, set only after the ops are queued). Runs at the tail of
  // a successful fullPull — the snapshot decides which keys the server lacks.
  const backfillLocalProgress = useCallback(
    async (snapshot: UserData) => {
      if (!tokenRef.current) return;
      const uid = uidRef.current;
      if (uid === 'guest') return;
      try {
        if (await AsyncStorage.getItem(backfillFlagKey(uid))) return;
        const ops = await collectBackfillOps(snapshot);
        for (const op of ops) enqueueOp(op);
        await AsyncStorage.setItem(backfillFlagKey(uid), '1');
      } catch {
        /* best-effort: if the flag write failed we retry on the next login */
      }
    },
    [enqueueOp],
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
          setUdState((prev) => {
            const merged = mergeRemote(prev, feed.changes);
            void saveCache(uidRef.current, merged);
            return merged;
          });
        }
        since = feed.cursor;
        if (since > cursorRef.current) {
          cursorRef.current = since;
          await saveCursor(uidRef.current, since);
        }
        hasMore = feed.has_more;
      }
    } catch (e) {
      if (e instanceof AuthError) void logout();
      // else: silent — the next foreground/mutation retries
    }
  }, [deviceId, logout]);

  // fullPull loads the complete live snapshot (fresh login / cursor reset),
  // seeds the cursor, backfills local-only progress once, and flushes queued
  // ops. On network failure it renders the cached snapshot (or defaults) so
  // progress is never "missing" on an offline cold start. Guarded against
  // concurrent invocations (StrictMode double-mount, rapid effect re-runs) —
  // a second pull while one is in flight is skipped, not queued.
  const fullPull = useCallback(async () => {
    if (!tokenRef.current || pullingRef.current) return;
    pullingRef.current = true;
    try {
      // The queue as it was BEFORE this pull's flush: if the pull below falls
      // back to the offline cache, that cache can predate these ops (they were
      // queued last session — or right before the RTL language relaunch), so
      // they're folded back over it below.
      const queuedAtStart = [...queueRef.current];
      try {
        // Push-then-pull: land the queued ops BEFORE reading the snapshot so
        // the snapshot already reflects them. The RTL language switch queues
        // its app.lang op and relaunches; pulling first would hand
        // AccountLangApply the stale server value, reverting the user's
        // just-made choice. flush never throws (it keeps the queue on
        // failure), so a failed flush just falls through to the possibly-stale
        // pull, where pendingLang holds the line until the op lands.
        await flush();
        const st = await getState(deviceId);
        cursorRef.current = st.cursor;
        await saveCursor(uidRef.current, st.cursor);
        const merged = mergeRemote(DEFAULT_USER_DATA, st.changes);
        setUdState(merged);
        void saveCache(uidRef.current, merged);
        setLoaded(true);
        // One-time: upload local-only prayer/reflection history + app prefs
        // the account doesn't have yet (server wins conflicts). Must run here —
        // the snapshot is the only way to know which keys the server already
        // has.
        await backfillLocalProgress(merged);
        // Best-effort: tell the server our timezone so streak day boundaries
        // are computed in the reader's local day, not UTC.
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) enqueueOp({ kind: 'tz', tz });
        void flush();
      } catch (e) {
        if (e instanceof AuthError) {
          void logout();
          return;
        }
        // offline at login: render the last cached snapshot (defaults when
        // none) so the reader is usable with the user's data, and reset the
        // cursor so the next foreground delta pull (once online) reconstructs
        // the full account state from seq 0 over the cached base (merges are
        // idempotent).
        cursorRef.current = 0;
        await saveCursor(uidRef.current, 0);
        const cached = await loadCache(uidRef.current);
        // Fold the queued app prefs over the cache — it can predate them
        // (e.g. it was last written before a language switch made offline),
        // and the stale value would otherwise revert the user's choice.
        const base = reapplyAppSettings(cached ?? { ...DEFAULT_USER_DATA }, queuedAtStart);
        setUdState(base);
        setLoaded(true);
      }
    } finally {
      pullingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, enqueueOp, flush, logout]);

  // (Re)load when the auth token settles or changes. Authed → full pull; guest →
  // local load. Gated on authLoading so the initial load uses the resolved token.
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (token) {
        // Move pre-0008 un-suffixed sync keys into this user's scope once, then
        // load THIS user's cursor/queue (per-user keys — account switches can't
        // reuse each other's state).
        await migrateLegacySyncKeys(uid);
        cursorRef.current = await loadCursor(uid);
        queueRef.current = await loadQueue(uid);
        syncPendingLang(queueRef.current);
        if (!cancelled) void fullPull();
      } else {
        // Guest: no account to sync to, but persist UserData LOCALLY so a
        // returning guest's script/font/reciter/favorites/labels survive a
        // restart instead of resetting to defaults. Legacy on-device guest
        // data (pre-sync format) is wiped first. Only the 'guest' scope is
        // cleared — other accounts' cursors/queues/caches stay untouched.
        cursorRef.current = 0;
        queueRef.current = [];
        syncPendingLang([]);
        await clearCursor('guest');
        await clearQueue('guest');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, uid, authLoading, fullPull]);

  // On foreground: pull deltas + flush queued ops (catches changes made on
  // another device while this one was backgrounded). Web equivalents of RN's
  // AppState: visibilitychange (tab/PWA foregrounded), the online event
  // (reconnect), and a 5-minute interval — a desktop PWA can stay visible for
  // hours without ever firing visibilitychange, so the interval is what keeps
  // long sessions converging with other devices.
  useEffect(() => {
    const syncNow = () => {
      if (!tokenRef.current) return;
      // Sequential on purpose — a concurrent flush can push a stale queued op
      // that races past the pull that would have obsoleted it.
      void deltaPull().then(() => flush());
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
  // (`next` is unused on web — the RN twin applies it — but kept for signature
  // parity across the mirror.)
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
  // One `now` stamps BOTH the local entry and the sync op so the server-side
  // latest-activity-wins comparison matches what the UI shows.
  const recordLastRead = useCallback(
    (surah: number, vk: string) => {
      const prev = udRef.current;
      // Throttle: only record when this verse differs from the last stored one.
      const existing = prev.lastRead[surah];
      if (existing && existing.verseKey === vk) return;
      const now = Date.now();
      const next = {
        ...prev,
        lastRead: { ...prev.lastRead, [surah]: { verseKey: vk, timestamp: now } },
      };
      setUdState(next);
      persist(next, { kind: 'lastRead', surah, verseKey: vk, ts: now });
    },
    [persist],
  );

  // Named "last read" slots: each name → ONE verse (overwritten on re-mark).
  // Since 0011 each slot syncs as its own row (PATCH /last-read-slots) guarded
  // by the client ts — a stale whole-map push from another device can no longer
  // clobber every mark at once. Returns {from, to} when this call moved the slot
  // FORWARD in mushaf order (a real reading segment) so callers can surface the
  // "summarize what you just read" banner; null otherwise (new slot, unchanged,
  // or backward move).
  const setLastReadSlot = useCallback(
    (name: string, vk: string): { from: string; to: string } | null => {
      const clean = name.trim();
      if (!clean) return null;
      const prev = udRef.current;
      // Stale value may be a bare string (pre-migration); normalize + stamp `ts`
      // so this mark becomes the most-recently-created ("Continue Reading").
      if (markVerseKey(prev.lastReadSlots[clean]) === vk) return null; // unchanged
      const range = forwardRangeForSlot(prev.lastReadSlots, clean, vk);
      const now = Date.now();
      const next = {
        ...prev,
        lastReadSlots: { ...prev.lastReadSlots, [clean]: { verseKey: vk, ts: now } },
      };
      setUdState(next);
      persist(next, { kind: 'lastReadSlot', slot: clean, verseKey: vk, ts: now });
      return range;
    },
    [persist],
  );
  const clearLastReadSlot = useCallback(
    (name: string) => {
      const prev = udRef.current;
      if (!(name in prev.lastReadSlots)) return;
      const next = { ...prev, lastReadSlots: { ...prev.lastReadSlots } };
      delete next.lastReadSlots[name];
      setUdState(next);
      persist(next, { kind: 'lastReadSlotDelete', slot: name, ts: Date.now() });
    },
    [persist],
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

  // ── Account-attached progress + app prefs (0008) ─────────────────────────
  // All computed from udRef.current OUTSIDE state updaters (StrictMode would
  // double-fire side effects inside one). Guests keep their AsyncStorage path;
  // these accessors only sync when authed (enqueueOp is a guest no-op, but the
  // state update still lands so the UI reflects the change).

  // togglePrayerDay flips one prayer of one day's map and pushes the WHOLE day
  // (one row = one sync unit, last-write-wins per day).
  const togglePrayerDay = useCallback(
    (day: string, prayer: keyof PrayerDay) => {
      const prev = udRef.current;
      const existing = prev.prayerDays[day] ?? { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
      const data: PrayerDay = { ...existing, [prayer]: !existing[prayer] };
      const next = { ...prev, prayerDays: { ...prev.prayerDays, [day]: data } };
      setUdState(next);
      if (tokenRef.current) enqueueOp({ kind: 'prayerDays', items: [{ day, data }] });
    },
    [enqueueOp],
  );

  // saveReflection pushes one whole entry (verse + transcript) keyed 'date:mood'.
  const saveReflection = useCallback(
    (entry: ReflectionEntryData) => {
      const prev = udRef.current;
      const key = `${entry.date}:${entry.mood}`;
      const next = { ...prev, reflections: { ...prev.reflections, [key]: entry } };
      setUdState(next);
      if (tokenRef.current) enqueueOp({ kind: 'reflections', items: [entry] });
    },
    [enqueueOp],
  );

  const saveRulingsChat = useCallback(
    (entry: RulingsChatEntryData) => {
      const prev = udRef.current;
      const key = entry.id;
      const next = { ...prev, rulingsChats: { ...prev.rulingsChats, [key]: entry } };
      setUdState(next);
      if (tokenRef.current) enqueueOp({ kind: 'rulingsChats', items: [entry] });
    },
    [enqueueOp],
  );

  // deleteRulingsChat removes a saved session locally and enqueues a deleted
  // tombstone so the row disappears on every device after the next flush.
  const deleteRulingsChat = useCallback(
    (id: string) => {
      const prev = udRef.current;
      if (!prev.rulingsChats[id]) return;
      const next = { ...prev, rulingsChats: { ...prev.rulingsChats } };
      delete next.rulingsChats[id];
      setUdState(next);
      if (tokenRef.current) enqueueOp({ kind: 'rulingsChats', items: [{ id, payload: [], deleted: true }] });
    },
    [enqueueOp],
  );

  // setAppSetting updates one app pref (appearance | lang | alarms |
  // reminders) on
  // UserData.appSettings and enqueues the setting op. Resolves once the op is
  // DURABLY queued (the flush stays fire-and-forget, and a failed queue write
  // still resolves — the op lives on in the session queue): the RTL language
  // switch awaits this so its app relaunch can't race the account push off
  // disk. The appearance pref keeps the legacy 'app.darkMode' server key
  // (already whitelisted — the value is now the 'light'|'dark'|'auto' string
  // where pre-appearance builds pushed a boolean). No-op for guests beyond
  // the local state change (their device-local stores own the value).
  const setAppSetting = useCallback(
    (key: 'appearance' | 'lang' | 'alarms' | 'reminders', value: Appearance | AppLang | unknown) => {
      const prev = udRef.current;
      const next = { ...prev, appSettings: { ...prev.appSettings, [key]: value } };
      setUdState(next);
      if (!tokenRef.current) return Promise.resolve();
      return enqueueOp({ kind: 'setting', key: key === 'appearance' ? 'app.darkMode' : `app.${key}`, value }).catch(() => {
        /* queue write failed — the op still lives in the session queue */
      });
    },
    [enqueueOp],
  );

  return {
    ud,
    loaded,
    pendingLang,
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
    togglePrayerDay,
    saveReflection,
    saveRulingsChat,
    deleteRulingsChat,
    setAppSetting,
  };
}
