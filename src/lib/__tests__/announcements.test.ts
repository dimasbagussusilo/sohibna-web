// Announcement selection/period tests (web port; the RN lib is mirrored
// verbatim, so these guard the same contract). Storage is mocked in-memory —
// vitest runs in node where localStorage doesn't exist.
import { test, vi, beforeEach } from 'vitest'
import assert from 'node:assert/strict'
import { computePrayerTimes } from '@/lib/prayer'

const mem = new Map<string, string>()
vi.mock('@/lib/storage', () => ({
  default: {
    getItem: (k: string) => Promise.resolve(mem.get(k) ?? null),
    setItem: (k: string, v: string) => {
      mem.set(k, v)
      return Promise.resolve()
    },
    removeItem: (k: string) => {
      mem.delete(k)
      return Promise.resolve()
    },
  },
}))

const { resolveContent, dailyAnchor, pickAnnouncement, markDailyClosed } = await import(
  '../announcements'
)
type A = Parameters<typeof pickAnnouncement>[0][number]

// Jakarta-ish coords (matches the app's primary audience; any location works).
const JKT = { latitude: -6.2, longitude: 106.816666 }
// Nov 6 2026 — Dhuhr in Jakarta ≈ 11:41 WIB, so Dhuhr − 30 ≈ 11:11 local.
const AFTERNOON = new Date(2026, 10, 6, 13, 0)
const MORNING = new Date(2026, 10, 6, 8, 0)

const daily = (over: Partial<A> = {}): A =>
  ({
    id: 'd1',
    content: { id: { title: 'Dukung', body: 'x' } },
    image_url: '',
    action: 'donate',
    action_url: '',
    frequency: 'daily',
    updated_at: '2026-11-01T00:00:00+07:00',
    ...over,
  }) as A

beforeEach(() => mem.clear())

test('daily anchor after Dhuhr-30 is today Dhuhr-30', () => {
  const dhuhr = computePrayerTimes(JKT.latitude, JKT.longitude, AFTERNOON).dhuhr
  assert.equal(dailyAnchor(JKT, AFTERNOON), String(dhuhr.getTime() - 30 * 60_000))
})

test('daily anchor before Dhuhr-30 is still yesterday Dhuhr-30', () => {
  const ydhuhr = computePrayerTimes(
    JKT.latitude,
    JKT.longitude,
    new Date(AFTERNOON.getTime() - 86_400_000),
  ).dhuhr
  assert.equal(dailyAnchor(JKT, MORNING), String(ydhuhr.getTime() - 30 * 60_000))
})

test('no coords falls back to the calendar day', () => {
  assert.equal(dailyAnchor(null, AFTERNOON), '2026-11-06')
})

test('resolveContent: requested lang, then id, then first titled entry, else null', () => {
  const a = daily({
    content: { en: { title: 'Support', body: 'y' }, id: { title: 'Dukung', body: 'x' } },
  })
  assert.equal(resolveContent(a, 'en')?.title, 'Support')
  assert.equal(resolveContent(a, 'tr')?.title, 'Dukung') // → id
  const onlyAr = daily({ content: { ar: { title: 'ادعم', body: 'z' } } })
  assert.equal(resolveContent(onlyAr, 'en')?.title, 'ادعم') // → first titled
  assert.equal(resolveContent(daily({ content: {} }), 'en'), null)
})

test('daily announcement re-shows until explicitly closed for the period', async () => {
  const a = daily()
  const coords = JSON.stringify(JKT)
  mem.set('sohibna:last_location', coords)

  assert.equal(await pickAnnouncement([a], 'id'), a) // shown…
  assert.equal(await pickAnnouncement([a], 'id'), a) // …and shown again next open

  await markDailyClosed(a) // "Close for today"
  assert.equal(await pickAnnouncement([a], 'id'), null)

  // Next period (next day's afternoon) → visible again.
  const nextDay = new Date(AFTERNOON.getTime() + 86_400_000)
  const dhuhr = computePrayerTimes(JKT.latitude, JKT.longitude, nextDay).dhuhr
  mem.set('sohibna:ann:daily:d1', String(dhuhr.getTime() - 30 * 60_000 - 1)) // stale anchor
  assert.equal(await pickAnnouncement([a], 'id'), a)
})

test('once announcement is marked at display and keyed on updated_at', async () => {
  const a = daily({ id: 'n1', frequency: 'once' })
  assert.equal(await pickAnnouncement([a], 'id'), a)
  assert.equal(await pickAnnouncement([a], 'id'), null) // shown once, done

  const edited = daily({ id: 'n1', frequency: 'once', updated_at: '2026-11-06T09:00:00+07:00' })
  assert.equal(await pickAnnouncement([edited], 'id'), edited) // content bump re-shows
})

test('pickAnnouncement skips entries with no displayable content', async () => {
  assert.equal(await pickAnnouncement([daily({ content: {} })], 'id'), null)
})
