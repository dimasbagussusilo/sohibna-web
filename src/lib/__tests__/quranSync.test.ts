// mergeRemote purity/idempotency tests (web port). The reducer is copied
// verbatim from the RN app, so these guard the same contract: re-applying a
// feed page is a no-op, and soft-deletes remove their targets.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { mergeRemote, type Op } from '../quranSync'
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
    c({ type: 'setting', key: 'app.darkMode', value: true }),
    c({ type: 'setting', key: 'app.lang', value: 'ar' }),
    c({ type: 'setting', key: 'app.alarms', value: { leadMinutes: 10 } }),
  ])
  assert.equal(out.appSettings.darkMode, true)
  assert.equal(out.appSettings.lang, 'ar')
  assert.deepEqual(out.appSettings.alarms, { leadMinutes: 10 })
})

test('deleted/null app.* setting resets to null (account has no value)', () => {
  const withVals = mergeRemote(fresh(), [
    c({ type: 'setting', key: 'app.darkMode', value: true }),
    c({ type: 'setting', key: 'app.lang', value: 'en' }),
  ])
  const reset = mergeRemote(withVals, [
    c({ type: 'setting', key: 'app.darkMode', deleted: true }),
    c({ type: 'setting', key: 'app.lang', value: null }),
  ])
  assert.equal(reset.appSettings.darkMode, null)
  assert.equal(reset.appSettings.lang, null)
})

test('unknown change type is ignored (forward-compat for old clients)', () => {
  const prev = fresh()
  const out = mergeRemote(prev, [c({ type: 'future_thing', key: 'x', payload: { a: 1 } })])
  assert.deepEqual(out, prev)
})

test('app.* merge never mutates the prev snapshot', () => {
  const prev = mergeRemote(fresh(), [c({ type: 'setting', key: 'app.darkMode', value: true })])
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
