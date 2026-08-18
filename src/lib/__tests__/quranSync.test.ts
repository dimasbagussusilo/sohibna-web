// mergeRemote purity/idempotency tests (web port). The reducer is copied
// verbatim from the RN app, so these guard the same contract: re-applying a
// feed page is a no-op, and soft-deletes remove their targets.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { mergeRemote, type Op } from '../quranSync'
import { DEFAULT_USER_DATA, type UserData } from '../quran'
import type { Change } from '@/api'

const fresh = (): UserData => JSON.parse(JSON.stringify(DEFAULT_USER_DATA))

test('applying a favorite change adds the verse', () => {
  const out = mergeRemote(fresh(), [{ type: 'favorite', verse_key: '2:255' }] as Change[])
  assert.deepEqual(out.favorites, ['2:255'])
})

test('mergeRemote is idempotent (same page twice = same result)', () => {
  const page: Change[] = [
    { type: 'favorite', verse_key: '2:255' },
    { type: 'bookmark', verse_key: '3:16' },
    { type: 'label', verse_key: '2:255', label: 'core' },
  ]
  const once = mergeRemote(fresh(), page)
  const twice = mergeRemote(once, page)
  assert.deepEqual(twice, once)
})

test('mergeRemote never mutates the prev snapshot', () => {
  const prev = fresh()
  mergeRemote(prev, [{ type: 'favorite', verse_key: '1:1' }] as Change[])
  assert.deepEqual(prev.favorites, [])
})

test('soft-deleted favorite removes it', () => {
  const withFav = mergeRemote(fresh(), [{ type: 'favorite', verse_key: '2:255' }] as Change[])
  const removed = mergeRemote(withFav, [
    { type: 'favorite', verse_key: '2:255', deleted: true },
  ] as Change[])
  assert.deepEqual(removed.favorites, [])
})

test('empty verse_key bookmark means cleared (null)', () => {
  const set = mergeRemote(fresh(), [{ type: 'bookmark', verse_key: '3:16' }] as Change[])
  assert.equal(set.bookmark, '3:16')
  const cleared = mergeRemote(set, [{ type: 'bookmark', verse_key: '' }] as Change[])
  assert.equal(cleared.bookmark, null)
})

test('deleted setting resets to the default', () => {
  const changed = mergeRemote(fresh(), [
    { type: 'setting', key: 'fontSize', value: 4 },
  ] as Change[])
  assert.notEqual(changed.fontSize, DEFAULT_USER_DATA.fontSize)
  const reset = mergeRemote(changed, [
    { type: 'setting', key: 'fontSize', deleted: true },
  ] as Change[])
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
  } as Change
  const withRow = mergeRemote(fresh(), [row])
  assert.ok(withRow.memorized['2:255'])
  const updated = mergeRemote(withRow, [
    { ...row, payload: { ...row.payload!, status: 'memorized', reviewCount: 1 } },
  ] as Change[])
  assert.equal(updated.memorized['2:255'].status, 'memorized')
  const gone = mergeRemote(updated, [
    { type: 'memorized_verse', verse_key: '2:255', deleted: true },
  ] as Change[])
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
