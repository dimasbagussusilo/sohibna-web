// mergeRemote purity/idempotency tests (web port). The reducer is copied
// verbatim from the RN app, so these guard the same contract: re-applying a
// feed page is a no-op, and soft-deletes remove their targets.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { mergeRemote, reapplyAppSettings, applyAppSettingOp, coalesceOp, sanitizeQueue, lwwStamp, flushQueue, MAX_OP_ATTEMPTS, type Op } from '../quranSync'
import { DEFAULT_USER_DATA, type UserData } from '../quran'
import type { Change } from '@/api'

// mergeRemote ignores sync_seq (ordering is the feed's job) — stamp a dummy so
// the literal satisfies the Change union without spelling every variant.
const c = (change: Record<string, unknown>): Change =>
  ({ sync_seq: 0, ...change }) as unknown as Change

const fresh = (): UserData => JSON.parse(JSON.stringify(DEFAULT_USER_DATA))

test('applying a favorite change adds the verse', () => {
  const out = mergeRemote(fresh(), [c({ type: 'favorite', verse_key: '2:255' })])
  assert.deepEqual(out.favorites, ['2:255'])
})

test('mergeRemote is idempotent (same page twice = same result)', () => {
  const page: Change[] = [
    c({ type: 'favorite', verse_key: '2:255' }),
    c({ type: 'bookmark', verse_key: '3:16' }),
    c({ type: 'label', verse_key: '2:255', label: 'core' }),
  ]
  const once = mergeRemote(fresh(), page)
  const twice = mergeRemote(once, page)
  assert.deepEqual(twice, once)
})

test('mergeRemote never mutates the prev snapshot', () => {
  const prev = fresh()
  mergeRemote(prev, [c({ type: 'favorite', verse_key: '1:1' })])
  assert.deepEqual(prev.favorites, [])
})

test('soft-deleted favorite removes it', () => {
  const withFav = mergeRemote(fresh(), [c({ type: 'favorite', verse_key: '2:255' })])
  const removed = mergeRemote(withFav, [
    c({ type: 'favorite', verse_key: '2:255', deleted: true }),
  ])
  assert.deepEqual(removed.favorites, [])
})

test('empty verse_key bookmark means cleared (null)', () => {
  const set = mergeRemote(fresh(), [c({ type: 'bookmark', verse_key: '3:16' })])
  assert.equal(set.bookmark, '3:16')
  const cleared = mergeRemote(set, [c({ type: 'bookmark', verse_key: '' })])
  assert.equal(cleared.bookmark, null)
})

test('deleted setting resets to the default', () => {
  const changed = mergeRemote(fresh(), [c({ type: 'setting', key: 'fontSize', value: 4 })])
  assert.notEqual(changed.fontSize, DEFAULT_USER_DATA.fontSize)
  const reset = mergeRemote(changed, [
    c({ type: 'setting', key: 'fontSize', deleted: true }),
  ])
  assert.equal(reset.fontSize, DEFAULT_USER_DATA.fontSize)
})

test('memorized verse whole-row overwrite + delete', () => {
  const row = {
    type: 'memorized_verse',
    verse_key: '2:255',
    payload: {
      verseKey: '2:255',
      surah: 2,
      ayah: 255,
      status: 'learning',
      memorizedAt: null,
      ease: 2.5,
      intervalDays: 0,
      dueAt: '2026-08-18T00:00:00Z',
      reviewCount: 0,
      lastReviewedAt: null,
      lapses: 0,
      verifiedBy: null,
    },
  }
  const withRow = mergeRemote(fresh(), [c(row)])
  assert.ok(withRow.memorized['2:255'])
  const updated = mergeRemote(withRow, [
    c({ ...row, payload: { ...row.payload!, status: 'memorized', reviewCount: 1 } }),
  ])
  assert.equal(updated.memorized['2:255'].status, 'memorized')
  const gone = mergeRemote(updated, [
    c({ type: 'memorized_verse', verse_key: '2:255', deleted: true }),
  ])
  assert.equal(gone.memorized['2:255'], undefined)
})

// Op type sanity — the queue round-trips through JSON persistence.
test('op queue shape is JSON-stable', () => {
  const ops: Op[] = [
    { kind: 'favorite', verseKey: '1:1', deleted: false },
    { kind: 'setting', key: 'fontSize', value: 3 },
  ]
  const revived = JSON.parse(JSON.stringify(ops)) as Op[]
  assert.equal(revived[0].kind, 'favorite')
  assert.equal(revived[1].kind, 'setting')
})

// ── Account-attached progress + app prefs (0008) ────────────────────────────

test('prayer_day change stores the whole day map; tombstone removes it', () => {
  const day = { fajr: true, dhuhr: false, asr: true, maghrib: false, isha: false }
  const withDay = mergeRemote(fresh(), [c({ type: 'prayer_day', key: '2026-08-18', payload: day })])
  assert.deepEqual(withDay.prayerDays['2026-08-18'], day)
  // Idempotent re-apply.
  assert.deepEqual(mergeRemote(withDay, [c({ type: 'prayer_day', key: '2026-08-18', payload: day })]).prayerDays, withDay.prayerDays)
  // LWW: a second day-write replaces the map whole.
  const day2 = { ...day, dhuhr: true }
  assert.equal(mergeRemote(withDay, [c({ type: 'prayer_day', key: '2026-08-18', payload: day2 })]).prayerDays['2026-08-18'].dhuhr, true)
  // Tombstone deletes the key.
  const gone = mergeRemote(withDay, [c({ type: 'prayer_day', key: '2026-08-18', deleted: true })])
  assert.equal(gone.prayerDays['2026-08-18'], undefined)
})

test('prayer_day merge never mutates the prev snapshot', () => {
  const prev = fresh()
  mergeRemote(prev, [c({ type: 'prayer_day', key: '2026-08-18', payload: { fajr: true, dhuhr: false, asr: false, maghrib: false, isha: false } })])
  assert.deepEqual(prev.prayerDays, {})
})

test('reflection change stores the entry whole; tombstone removes it', () => {
  const entry = {
    date: '2026-08-18',
    mood: 'calm',
    verseKey: '94:5',
    messages: [{ role: 'assistant' as const, content: 'hi' }],
    updatedAt: 1755432000000,
  }
  const withEntry = mergeRemote(fresh(), [c({ type: 'reflection', key: '2026-08-18:calm', payload: entry })])
  assert.deepEqual(withEntry.reflections['2026-08-18:calm'], entry)
  const gone = mergeRemote(withEntry, [c({ type: 'reflection', key: '2026-08-18:calm', deleted: true })])
  assert.equal(gone.reflections['2026-08-18:calm'], undefined)
})

test('app.* settings route to appSettings, not UserData scalars', () => {
  const out = mergeRemote(fresh(), [
    c({ type: 'setting', key: 'app.darkMode', value: 'auto' }),
    c({ type: 'setting', key: 'app.lang', value: 'ar' }),
    c({ type: 'setting', key: 'app.alarms', value: { leadMinutes: 10 } }),
  ])
  assert.equal(out.appSettings.appearance, 'auto')
  assert.equal(out.appSettings.lang, 'ar')
  assert.deepEqual(out.appSettings.alarms, { leadMinutes: 10 })
})

test('legacy boolean app.darkMode values map to fixed appearance modes', () => {
  const dark = mergeRemote(fresh(), [c({ type: 'setting', key: 'app.darkMode', value: true })])
  assert.equal(dark.appSettings.appearance, 'dark')
  const light = mergeRemote(fresh(), [c({ type: 'setting', key: 'app.darkMode', value: false })])
  assert.equal(light.appSettings.appearance, 'light')
})

test('deleted/null app.* setting resets to null (account has no value)', () => {
  const withVals = mergeRemote(fresh(), [
    c({ type: 'setting', key: 'app.darkMode', value: 'dark' }),
    c({ type: 'setting', key: 'app.lang', value: 'en' }),
  ])
  const reset = mergeRemote(withVals, [
    c({ type: 'setting', key: 'app.darkMode', deleted: true }),
    c({ type: 'setting', key: 'app.lang', value: null }),
  ])
  assert.equal(reset.appSettings.appearance, null)
  assert.equal(reset.appSettings.lang, null)
})

test('unknown change type is ignored (forward-compat for old clients)', () => {
  const prev = fresh()
  const out = mergeRemote(prev, [c({ type: 'future_thing', key: 'x', payload: { a: 1 } })])
  assert.deepEqual(out, prev)
})

test('app.* merge never mutates the prev snapshot', () => {
  const prev = mergeRemote(fresh(), [c({ type: 'setting', key: 'app.darkMode', value: 'auto' })])
  const before = JSON.stringify(prev.appSettings)
  mergeRemote(prev, [c({ type: 'setting', key: 'app.lang', value: 'id' })])
  assert.equal(JSON.stringify(prev.appSettings), before)
})

test('op queue round-trips the new batch kinds', () => {
  const ops: Op[] = [
    { kind: 'prayerDays', items: [{ day: '2026-08-18', data: { fajr: true, dhuhr: false, asr: false, maghrib: false, isha: false } }] },
    { kind: 'reflections', items: [{ date: '2026-08-18', mood: 'calm', verseKey: '94:5', messages: [], updatedAt: 1 }] },
  ]
  const revived = JSON.parse(JSON.stringify(ops)) as Op[]
  assert.equal(revived[0].kind, 'prayerDays')
  assert.equal(revived[1].kind, 'reflections')
})

// ── Latest-activity-wins reading progress (0011) ────────────────────────────
//
// last_read / last_read_slot rows carry the CLIENT edit time (updated_at). A
// change older than what we already hold must be SKIPPED — that's what stops a
// device flushing a stale queued op (or re-asserting a stale position) from
// regressing newer progress made elsewhere.

test('last_read: newer updated_at applies and stamps the remote ts', () => {
  const withOld = mergeRemote(fresh(), [c({ type: 'last_read', surah: 16, verse_key: '16:9', updated_at: 1000 })])
  assert.equal(withOld.lastRead[16].verseKey, '16:9')
  assert.equal(withOld.lastRead[16].timestamp, 1000)
  const withNew = mergeRemote(withOld, [c({ type: 'last_read', surah: 16, verse_key: '16:50', updated_at: 2000 })])
  assert.equal(withNew.lastRead[16].verseKey, '16:50')
  assert.equal(withNew.lastRead[16].timestamp, 2000)
})

test('last_read: OLDER updated_at is skipped (stale flush loses)', () => {
  const withNew = mergeRemote(fresh(), [c({ type: 'last_read', surah: 16, verse_key: '16:50', updated_at: 2000 })])
  const regressed = mergeRemote(withNew, [c({ type: 'last_read', surah: 16, verse_key: '16:9', updated_at: 1000 })])
  assert.equal(regressed.lastRead[16].verseKey, '16:50')
})

test('last_read: equal updated_at applies (feed order breaks ties)', () => {
  const first = mergeRemote(fresh(), [c({ type: 'last_read', surah: 16, verse_key: '16:50', updated_at: 2000 })])
  const second = mergeRemote(first, [c({ type: 'last_read', surah: 16, verse_key: '16:51', updated_at: 2000 })])
  assert.equal(second.lastRead[16].verseKey, '16:51')
})

test('last_read: no updated_at (legacy row, ts 0) loses to any local ts', () => {
  const local = fresh()
  local.lastRead[16] = { verseKey: '16:50', timestamp: 1 }
  const out = mergeRemote(local, [c({ type: 'last_read', surah: 16, verse_key: '16:9' })])
  assert.equal(out.lastRead[16].verseKey, '16:50')
})

test('last_read: tombstone with newer ts deletes; older ts keeps the entry', () => {
  const withEntry = mergeRemote(fresh(), [c({ type: 'last_read', surah: 16, verse_key: '16:50', updated_at: 2000 })])
  const kept = mergeRemote(withEntry, [c({ type: 'last_read', surah: 16, verse_key: '', deleted: true, updated_at: 1000 })])
  assert.ok(kept.lastRead[16])
  const gone = mergeRemote(kept, [c({ type: 'last_read', surah: 16, verse_key: '', deleted: true, updated_at: 3000 })])
  assert.equal(gone.lastRead[16], undefined)
})

test('last_read_slot: per-slot set, stale loses, tombstone rules', () => {
  const withSlot = mergeRemote(fresh(), [c({ type: 'last_read_slot', key: 'an-nahl', verse_key: '16:50', updated_at: 2000 })])
  assert.deepEqual(withSlot.lastReadSlots['an-nahl'], { verseKey: '16:50', ts: 2000 })
  // Stale row-derived write on the same slot is skipped.
  const kept = mergeRemote(withSlot, [c({ type: 'last_read_slot', key: 'an-nahl', verse_key: '16:9', updated_at: 1000 })])
  assert.equal(kept.lastReadSlots['an-nahl'].verseKey, '16:50')
  // A DIFFERENT slot is untouched by the ts comparison of another slot.
  const two = mergeRemote(kept, [c({ type: 'last_read_slot', key: 'al-kahf', verse_key: '18:1', updated_at: 1500 })])
  assert.equal(two.lastReadSlots['al-kahf'].verseKey, '18:1')
  assert.equal(two.lastReadSlots['an-nahl'].verseKey, '16:50')
  // Newer tombstone deletes; older tombstone is ignored.
  const stillThere = mergeRemote(two, [c({ type: 'last_read_slot', key: 'an-nahl', verse_key: '', deleted: true, updated_at: 1999 })])
  assert.ok(stillThere.lastReadSlots['an-nahl'])
  const removed = mergeRemote(stillThere, [c({ type: 'last_read_slot', key: 'an-nahl', verse_key: '', deleted: true, updated_at: 2500 })])
  assert.equal(removed.lastReadSlots['an-nahl'], undefined)
})

test('last_read_slot: legacy bare-string slot value (ts 0) is overwritten by any remote', () => {
  const local = fresh()
  ;(local.lastReadSlots as Record<string, unknown>)['old-mark'] = '16:9'
  const out = mergeRemote(local, [c({ type: 'last_read_slot', key: 'old-mark', verse_key: '16:50', updated_at: 1 })])
  assert.deepEqual(out.lastReadSlots['old-mark'], { verseKey: '16:50', ts: 1 })
})

test('last_read_slot: merge never mutates the prev snapshot (aliasing guard)', () => {
  const prev = mergeRemote(fresh(), [c({ type: 'last_read_slot', key: 'an-nahl', verse_key: '16:50', updated_at: 2000 })])
  const before = JSON.stringify(prev.lastReadSlots)
  mergeRemote(prev, [
    c({ type: 'last_read_slot', key: 'an-nahl', verse_key: '16:9', deleted: true, updated_at: 3000 }),
    c({ type: 'last_read_slot', key: 'al-kahf', verse_key: '18:1', updated_at: 1500 }),
  ])
  assert.equal(JSON.stringify(prev.lastReadSlots), before)
})

test('setting:lastReadSlots (legacy whole-map push) is skipped entirely', () => {
  const withSlot = mergeRemote(fresh(), [c({ type: 'last_read_slot', key: 'an-nahl', verse_key: '16:50', updated_at: 2000 })])
  const out = mergeRemote(withSlot, [
    c({ type: 'setting', key: 'lastReadSlots', value: { 'an-nahl': { verseKey: '16:9', ts: 9999 } } }),
  ])
  assert.deepEqual(out.lastReadSlots['an-nahl'], { verseKey: '16:50', ts: 2000 })
})

test('op queue round-trips the 0011 kinds; legacy lastRead op keeps ts optional', () => {
  const ops: Op[] = [
    { kind: 'lastRead', surah: 16, verseKey: '16:50', ts: 2000 },
    { kind: 'lastReadSlot', slot: 'an-nahl', verseKey: '16:50', ts: 2000 },
    { kind: 'lastReadSlotDelete', slot: 'an-nahl', ts: 3000 },
    // Pre-0011 persisted queue entry (no ts) must still deserialize...
  ]
  const revived = JSON.parse(JSON.stringify(ops)) as Op[]
  assert.equal(revived[0].kind, 'lastRead')
  assert.equal((revived[0] as { ts?: number }).ts, 2000)
  assert.equal(revived[1].kind, 'lastReadSlot')
})

// A pre-0011 queued op carries no edit timestamp — flushing it would stamp
// Date.now() server-side and let a stale offline edit beat a newer row (the
// exact regression this feature fixes). loadQueue prunes those via sanitizeQueue.
test('sanitizeQueue drops ts-less lastRead ops + legacy lastReadSlots setting ops', () => {
  const ops: Op[] = [
    { kind: 'lastRead', surah: 16, verseKey: '16:9' }, // legacy, no ts → DROP
    { kind: 'lastRead', surah: 16, verseKey: '16:9', ts: 0 }, // ts 0 → DROP
    { kind: 'setting', key: 'lastReadSlots', value: {} }, // legacy whole-map → DROP
    { kind: 'lastRead', surah: 16, verseKey: '16:50', ts: 2000 }, // keep
    { kind: 'lastReadSlot', slot: 'an-nahl', verseKey: '16:50', ts: 2000 }, // keep
    { kind: 'setting', key: 'fontSize', value: 3 }, // keep (unrelated setting)
    { kind: 'favorite', verseKey: '1:1', deleted: false }, // keep
  ]
  const kept = sanitizeQueue(ops)
  assert.equal(kept.length, 4)
  assert.ok(kept.every((op) => !(op.kind === 'lastRead' && (op.ts == null || op.ts <= 0))))
  assert.ok(kept.every((op) => !(op.kind === 'setting' && op.key === 'lastReadSlots')))
})

// ── Op-queue reconciliation for app prefs (RTL language relaunch) ───────────
//
// The RTL language switch relaunches the app right after queueing its app.lang
// op, so the snapshot (or offline cache) ud is rebuilt from can predate the
// user's choice. reapplyAppSettings folds the queued/sent ops back over the
// rebuilt snapshot; applyAppSettingOp must map keys exactly like mergeRemote.

test('applyAppSettingOp maps the three app.* keys like mergeRemote does', () => {
  const base = { appearance: null, lang: null, alarms: null, reminders: null } as const
  assert.equal(applyAppSettingOp(base, 'app.darkMode', 'auto').appearance, 'auto')
  assert.equal(applyAppSettingOp(base, 'app.darkMode', true).appearance, 'dark')
  assert.equal(applyAppSettingOp(base, 'app.lang', 'ar').lang, 'ar')
  assert.deepEqual(applyAppSettingOp(base, 'app.alarms', { leadMinutes: 10 }).alarms, { leadMinutes: 10 })
  // null = "no account value"
  assert.equal(applyAppSettingOp({ ...base, lang: 'en' }, 'app.lang', null).lang, null)
  // Unknown keys leave the snapshot untouched (value-wise).
  assert.deepEqual(applyAppSettingOp(base, 'app.future', 'x'), base)
})

test('reapplyAppSettings folds queued app prefs over a stale snapshot (offline cache path)', () => {
  const stale = fresh() // cache written before the switch: lang id
  const out = reapplyAppSettings(stale, [
    { kind: 'setting', key: 'app.lang', value: 'ar' },
    { kind: 'setting', key: 'fontSize', value: 4 }, // reader setting: not folded
  ])
  assert.equal(out.appSettings.lang, 'ar')
  assert.equal(out.fontSize, stale.fontSize)
})

test('reapplyAppSettings applies the LAST op per key (queue order wins)', () => {
  const out = reapplyAppSettings(fresh(), [
    { kind: 'setting', key: 'app.lang', value: 'en' },
    { kind: 'setting', key: 'app.lang', value: 'ar' },
  ])
  assert.equal(out.appSettings.lang, 'ar')
})

test('reapplyAppSettings returns the same object when no app ops fold', () => {
  const ud = fresh()
  const out = reapplyAppSettings(ud, [
    { kind: 'setting', key: 'fontSize', value: 4 },
    { kind: 'favorite', verseKey: '1:1', deleted: false },
  ])
  assert.equal(out, ud)
})

test('reapplyAppSettings never mutates the snapshot it folds over', () => {
  const ud = fresh()
  const before = JSON.stringify(ud.appSettings)
  reapplyAppSettings(ud, [{ kind: 'setting', key: 'app.lang', value: 'ar' }])
  assert.equal(JSON.stringify(ud.appSettings), before)
})

// ── Queue coalescing (write amplification fix) ──────────────────────────────
//
// Rapid UI edits (font slider drags, toggle bursts) used to enqueue one
// setting op PER TICK — a single drag stuffed the FIFO queue with dozens of
// PATCHes, stalling the mark/progress ops queued behind them. coalesceOp keeps
// ONE pending op per setting key (server rows are per-key last-write-wins, so
// only the newest value needs to arrive).

test('coalesceOp replaces a pending same-key setting op (slider drag = 1 op)', () => {
  let q: Op[] = []
  for (const size of [3, 3.2, 3.5, 3.8, 4]) q = coalesceOp(q, { kind: 'setting', key: 'fontSize', value: size })
  assert.equal(q.length, 1)
  assert.deepEqual(q[0], { kind: 'setting', key: 'fontSize', value: 4 })
})

test('coalesceOp keeps ops for different setting keys', () => {
  let q: Op[] = coalesceOp([], { kind: 'setting', key: 'fontSize', value: 4 })
  q = coalesceOp(q, { kind: 'setting', key: 'app.lang', value: 'ar' })
  q = coalesceOp(q, { kind: 'setting', key: 'app.darkMode', value: 'dark' })
  assert.equal(q.length, 3)
  // A later fontSize edit only replaces the fontSize op.
  q = coalesceOp(q, { kind: 'setting', key: 'fontSize', value: 5 })
  assert.equal(q.length, 3)
  assert.deepEqual(q.find((o) => o.kind === 'setting' && o.key === 'fontSize'), { kind: 'setting', key: 'fontSize', value: 5 })
})

test('coalesceOp never touches non-setting ops', () => {
  let q: Op[] = [{ kind: 'lastReadSlot', slot: 'an-nahl', verseKey: '16:50', ts: 1 }]
  q = coalesceOp(q, { kind: 'setting', key: 'fontSize', value: 4 })
  q = coalesceOp(q, { kind: 'favorite', verseKey: '1:1', deleted: false })
  assert.equal(q.length, 3)
})

test('coalesceOp replaces a pending tz op (one tz per queue)', () => {
  let q: Op[] = coalesceOp([], { kind: 'tz', tz: 'Asia/Jakarta' })
  q = coalesceOp(q, { kind: 'tz', tz: 'Asia/Makassar' })
  assert.deepEqual(q, [{ kind: 'tz', tz: 'Asia/Makassar' }])
})

// ── Queue resilience: deadletter + LWW stamping ─────────────────────────────

test('lwwStamp beats a future server ts (clock-skew hardening)', () => {
  const ud = fresh()
  // A row pulled from the server carries a later ts than our clock (another
  // device's correct clock / a server-stamped legacy write; our clock is behind).
  const future = Date.now() + 86_400_000
  ud.lastRead[16] = { verseKey: '16:50', timestamp: future }
  ud.lastReadSlots['an-nahl'] = { verseKey: '16:50', ts: future + 5 }
  const stamp = lwwStamp(ud)
  assert.ok(stamp > future + 5, `stamp ${stamp} must beat the newest known ts ${future + 5}`)
  // With no skew it is just ~now.
  assert.ok(lwwStamp(fresh()) >= Date.now())
})

// flushQueue deadletters an op the server keeps rejecting (ApiError) after
// MAX_OP_ATTEMPTS attempts, instead of wedging every later op behind it; a
// network failure (fetch rejects) never counts toward deadlettering.
test('flushQueue deadletters permanently-rejected ops, keeps queue flowing', async () => {
  const { setSession } = await import('@/lib/authSession')
  setSession({ accessToken: 't', refreshToken: 'r', expiresAt: Date.now() + 3_600_000 })
  const realFetch = globalThis.fetch
  let rejections = 0
  globalThis.fetch = (async () => {
    rejections++
    return new Response(JSON.stringify({ error: 'boom' }), { status: 500 })
  }) as typeof fetch
  try {
    const queue: Op[] = [
      { kind: 'setting', key: 'fontSize', value: 3 }, // the poison op
      { kind: 'lastReadSlot', slot: 's', verseKey: '17:1', ts: 1 },
    ]
    // Without deadlettering these rejections wedge the queue forever (every
    // flush stops at the poison head). With it, each op gets at most
    // MAX_OP_ATTEMPTS tries and the queue drains. Feed `remaining` back each
    // round exactly like useQuranData's flush() persists it — a deadlettered op
    // must never resurrect.
    let q = queue
    let r = await flushQueue('dev', q)
    let flushes = 1
    while (r.remaining.length && flushes < 50) {
      assert.ok(r.error, 'a non-draining flush must report its failure')
      q = r.remaining
      r = await flushQueue('dev', q)
      flushes++
    }
    assert.deepEqual(r.remaining, [], 'queue never drained — deadlettering not working')
    assert.equal(r.error, null)
    assert.equal(r.staleWrites, false)
    // Both ops got exactly MAX_OP_ATTEMPTS server rejections (5 each) — no
    // resurrection thrash (which would show up as 3× the fetches).
    assert.equal(rejections, MAX_OP_ATTEMPTS * 2)
  } finally {
    globalThis.fetch = realFetch
    setSession(null)
  }
})

// A rejected latest-activity-wins write (applied:false) surfaces as
// staleWrites so the caller can pull to converge.
test('flushQueue reports staleWrites when the ts-guard rejects a mark', async () => {
  const { setSession } = await import('@/lib/authSession')
  setSession({ accessToken: 't', refreshToken: 'r', expiresAt: Date.now() + 3_600_000 })
  const realFetch = globalThis.fetch
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ ok: true, applied: false }), { status: 200 })) as typeof fetch
  try {
    const r = await flushQueue('dev', [
      { kind: 'lastReadSlot', slot: 's', verseKey: '17:1', ts: 1 },
    ])
    assert.deepEqual(r.remaining, [])
    assert.equal(r.staleWrites, true)
  } finally {
    globalThis.fetch = realFetch
    setSession(null)
  }
})
