// serverTts controller tests (web): the two-tier speech state machine — the
// server clip first, the browser voice only on failure; late events of a
// superseded clip never clobber the current one; one fallback per failure.
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { createTtsController, ttsUrl, type TtsAudio, type TtsEvent } from '../serverTts'
import { applyWaqf } from '../waqf'
import { API_BASE_URL } from '@/config'

interface FakeAudio extends TtsAudio {
  url: string
  paused: number
  playCalls: number
  /** Fires a media event to the listeners still attached. */
  fire(type: TtsEvent): void
  /** The listeners currently attached (to simulate an already-queued event). */
  listener(type: TtsEvent): (() => void) | undefined
}

interface Harness {
  ctrl: ReturnType<typeof createTtsController>
  audios: FakeAudio[]
  state: (string | null)[]
  fallbacks: { id: string; text: string; end: () => void }[]
  counters: { released: number; cancelled: number }
  last: () => string | null
}

function harness(
  opts: { play?: (a: FakeAudio) => Promise<void>; transform?: (t: string) => string } = {},
): Harness {
  const audios: FakeAudio[] = []
  const state: (string | null)[] = []
  const fallbacks: Harness['fallbacks'] = []
  const counters = { released: 0, cancelled: 0 }
  const ctrl = createTtsController({
    createAudio: (url) => {
      const listeners: Record<TtsEvent, (() => void)[]> = { ended: [], error: [] }
      const a: FakeAudio = {
        url,
        paused: 0,
        playCalls: 0,
        fire(type) {
          for (const l of [...listeners[type]]) l()
        },
        listener(type) {
          return listeners[type][listeners[type].length - 1]
        },
        addEventListener(type, l) {
          listeners[type].push(l)
        },
        removeEventListener(type, l) {
          listeners[type] = listeners[type].filter((x) => x !== l)
        },
        play() {
          a.playCalls++
          return opts.play ? opts.play(a) : Promise.resolve()
        },
        pause() {
          a.paused++
        },
      }
      audios.push(a)
      return a
    },
    releaseAudio: () => {
      counters.released++
    },
    speakFallback: (id, text, end) => {
      fallbacks.push({ id, text, end })
    },
    cancelFallback: () => {
      counters.cancelled++
    },
    setSpeaking: (id) => {
      state.push(id)
    },
    transform: opts.transform ?? ((t) => t),
  })
  return { ctrl, audios, state, fallbacks, counters, last: () => state[state.length - 1] ?? null }
}

// sent is the text the controller sent to the server for a clip.
const sent = (a: FakeAudio): string => decodeURIComponent(a.url.slice(a.url.indexOf('text=') + 'text='.length))

const tick = () => new Promise<void>((r) => setTimeout(r, 0))

// A play() whose promise the test rejects by hand (media failure signal #2).
function rejectablePlay(): { play: (a: FakeAudio) => Promise<void>; rejects: ((e: unknown) => void)[] } {
  const rejects: ((e: unknown) => void)[] = []
  return {
    rejects,
    play: () => new Promise<void>((_, reject) => rejects.push(reject)),
  }
}

test('speaks the server clip and reports the utterance id', () => {
  const h = harness()
  h.ctrl.speak('a', 'بِسْمِ اللَّهِ')
  assert.equal(h.audios.length, 1)
  assert.equal(h.audios[0].url, `${API_BASE_URL}/tts?text=${encodeURIComponent('بِسْمِ اللَّهِ')}`)
  assert.equal(h.audios[0].playCalls, 1)
  assert.equal(h.last(), 'a')
  // Natural end → silent.
  h.audios[0].fire('ended')
  assert.equal(h.last(), null)
})

test('ttsUrl encodes the text as one query parameter', () => {
  assert.equal(ttsUrl('a&b'), `${API_BASE_URL}/tts?text=a%26b`)
  assert.equal(ttsUrl('رَبِّ'), `${API_BASE_URL}/tts?text=${encodeURIComponent('رَبِّ')}`)
})

test('re-tapping the same id stops it', () => {
  const h = harness()
  h.ctrl.speak('a', 'ا')
  h.ctrl.speak('a', 'ا')
  assert.equal(h.audios.length, 1, 'second tap must not start a new clip')
  assert.equal(h.audios[0].paused, 1)
  assert.equal(h.last(), null)
})

test('a new utterance supersedes the previous clip', () => {
  const h = harness()
  h.ctrl.speak('a', 'ا')
  h.ctrl.speak('b', 'ب')
  assert.equal(h.audios.length, 2)
  assert.equal(h.audios[0].paused, 1, 'the old clip must be paused')
  assert.equal(h.counters.released, 1, 'the old player must be released')
  assert.equal(h.last(), 'b')
})

test('server failure falls back to the browser voice exactly once', async () => {
  const p = rejectablePlay()
  const h = harness({ play: p.play })
  h.ctrl.speak('a', 'نَوَيْتُ الْوُضُوءَ')
  // A failed load fires BOTH signals.
  h.audios[0].fire('error')
  p.rejects[0](new Error('The element has no supported sources.'))
  await tick()
  assert.equal(h.fallbacks.length, 1, 'error event + rejected play() must yield ONE fallback')
  assert.deepEqual(
    { id: h.fallbacks[0].id, text: h.fallbacks[0].text },
    { id: 'a', text: 'نَوَيْتُ الْوُضُوءَ' },
  )
  assert.equal(h.last(), 'a', 'still speaking — via the second tier')
})

test('a rejected play() alone also falls back', async () => {
  const p = rejectablePlay()
  const h = harness({ play: p.play })
  h.ctrl.speak('a', 'ا')
  p.rejects[0](new Error('Failed to load because no supported source was found.'))
  await tick()
  assert.equal(h.fallbacks.length, 1)
})

test("NotAllowedError (no user gesture) stays silent — never a server problem", async () => {
  const p = rejectablePlay()
  const h = harness({ play: p.play })
  h.ctrl.speak('a', 'ا')
  p.rejects[0](Object.assign(new Error('The request is not allowed'), { name: 'NotAllowedError' }))
  await tick()
  assert.equal(h.fallbacks.length, 0)
  assert.equal(h.last(), null)
})

test('late events of a superseded clip are ignored', async () => {
  const p = rejectablePlay()
  const h = harness({ play: p.play })
  h.ctrl.speak('a', 'ا')
  const staleError = h.audios[0].listener('error')!
  const staleEnd = h.audios[0].listener('ended')!
  h.ctrl.speak('b', 'ب')
  // The old clip's listeners were detached, but one may already be queued.
  staleError()
  staleEnd()
  p.rejects[0](new Error('aborted by a new load request'))
  await tick()
  assert.equal(h.fallbacks.length, 0, 'a stale failure must not start the browser voice over clip b')
  assert.equal(h.last(), 'b', 'a stale end must not clear clip b')
})

test('a finished browser fallback clears the id, so the same item speaks again', () => {
  const h = harness()
  h.ctrl.speak('a', 'ا')
  h.audios[0].fire('error')
  assert.equal(h.fallbacks.length, 1)
  h.fallbacks[0].end()
  assert.equal(h.last(), null)
  h.ctrl.speak('a', 'ا')
  assert.equal(h.audios.length, 2, 'must try the server again, not toggle off a finished utterance')
})

test('stop silences the browser fallback too', () => {
  const h = harness()
  h.ctrl.speak('a', 'ا')
  h.audios[0].fire('error')
  const before = h.counters.cancelled
  h.ctrl.stop()
  assert.equal(h.counters.cancelled, before + 1)
  assert.equal(h.last(), null)
})

test('halt (unmount) releases the clip without writing state', () => {
  const h = harness()
  h.ctrl.speak('a', 'ا')
  const writes = h.state.length
  h.ctrl.halt()
  assert.equal(h.audios[0].paused, 1)
  assert.equal(h.counters.released, 1)
  assert.equal(h.state.length, writes)
})

test('empty text is a no-op', () => {
  const h = harness()
  h.ctrl.speak('a', '')
  h.ctrl.speak('b', '   ')
  h.ctrl.speak('c', undefined)
  h.ctrl.speak('d', null)
  assert.equal(h.audios.length, 0)
  assert.equal(h.last(), null)
})

test('waqf: litany prose is spoken in pausal form, Iqro syllables verbatim', () => {
  const niat = 'كِتَابٌ'
  assert.notEqual(applyWaqf(niat), niat, 'sanity: waqf changes a tanwīn ending')

  const prose = harness({ transform: applyWaqf })
  prose.ctrl.speak('a', niat)
  assert.equal(sent(prose.audios[0]), applyWaqf(niat))

  // The lesson's whole point is the final harakat — stripping it ("بَ" →
  // "بْ") would teach a sukun instead of a fatḥah.
  assert.notEqual(applyWaqf('بَ'), 'بَ')
  const lesson = harness()
  lesson.ctrl.speak('a', 'بَ')
  assert.equal(sent(lesson.audios[0]), 'بَ')
})
