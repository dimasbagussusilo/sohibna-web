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
