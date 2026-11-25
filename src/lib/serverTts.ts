// Server-first Arabic speech — the state machine, framework-agnostic so it is
// unit-testable in node (__tests__/serverTts.test.ts). React binding:
// hooks/useServerTts.ts.
//
// Tier 1: GET /tts — the API's Gemini TTS, the same natural voice the RN app
// streams. Tier 2: the browser's own Arabic voice, used ONLY when tier 1
// cannot deliver (not configured → 503, every key rate-limited, offline).
// This mirrors the app's two-tier strategy; where the apps probe /tts once on
// mount, here the player's own error event is the signal.
import { API_BASE_URL } from '@/config'

// TtsAudio is the slice of HTMLAudioElement the controller needs — injectable
// so the node tests can drive it without a DOM. Listeners go through the
// EventTarget API (not the on* properties) so a plain Audio element satisfies
// this type as-is.
export type TtsEvent = 'ended' | 'error'

export interface TtsAudio {
  play(): Promise<unknown>
  pause(): void
  addEventListener(type: TtsEvent, listener: () => void): void
  removeEventListener(type: TtsEvent, listener: () => void): void
}

export interface TtsControllerDeps {
  /** Builds a player for one clip (`new Audio(url)` on the web). */
  createAudio: (url: string) => TtsAudio
  /** Retires a player for good (the web element needs its src cleared). */
  releaseAudio: (a: TtsAudio) => void
  /** Tier 2: the browser's Arabic voice. Must call onEnd when the utterance
   *  finishes OR fails, so a re-tap of the same item speaks again. */
  speakFallback: (id: string, text: string, onEnd: () => void) => void
  cancelFallback: () => void
  setSpeaking: (id: string | null) => void
  /** Pre-synthesis transform: pausal forms for litany prose, identity for
   *  Iqro lesson syllables (their final harakat is the lesson). */
  transform: (text: string) => string
}

// ttsUrl is the synthesised-clip URL for a text.
export function ttsUrl(text: string): string {
  return `${API_BASE_URL}/tts?text=${encodeURIComponent(text)}`
}

export function createTtsController(deps: TtsControllerDeps) {
  let speaking: string | null = null // id of the utterance in flight
  let audio: TtsAudio | null = null
  let detach: (() => void) | null = null
  // Identifies the utterance in flight. Events of a clip that was stopped or
  // superseded arrive late and must be ignored — they would clobber the new
  // state or trigger a bogus tier-2 fallback.
  let token = 0

  // halt silences everything without touching state (the unmount path).
  function halt() {
    token++
    detach?.()
    detach = null
    if (audio) {
      const a = audio
      audio = null
      a.pause()
      deps.releaseAudio(a)
    }
    deps.cancelFallback()
  }

  function stop() {
    halt()
    speaking = null
    deps.setSpeaking(null)
  }

  function speak(id: string, arabic: string | null | undefined) {
    if (!arabic || !arabic.trim()) return
    if (speaking === id) {
      stop() // re-tap toggles off
      return
    }
    halt() // supersede whatever is playing
    const mine = token
    const text = deps.transform(arabic)
    speaking = id
    deps.setSpeaking(id)

    // A media failure fires BOTH the 'error' event and a rejected play() —
    // one fallback, not two (the second would restart the utterance).
    let settled = false
    const toFallback = () => {
      if (settled || token !== mine) return
      settled = true
      audio = null
      deps.speakFallback(id, text, () => {
        if (token !== mine) return
        speaking = null
        deps.setSpeaking(null)
      })
    }
    const toSilence = () => {
      if (settled || token !== mine) return
      settled = true
      audio = null
      speaking = null
      deps.setSpeaking(null)
    }

    const a = deps.createAudio(ttsUrl(text))
    audio = a
    a.addEventListener('ended', toSilence)
    a.addEventListener('error', toFallback)
    detach = () => {
      a.removeEventListener('ended', toSilence)
      a.removeEventListener('error', toFallback)
    }
    Promise.resolve(a.play()).catch((err: unknown) => {
      // NotAllowedError = no user gesture, never a server problem: stay
      // silent rather than hand the line to a second engine.
      if (err instanceof Error && err.name === 'NotAllowedError') toSilence()
      else toFallback()
    })
  }

  return { speak, stop, halt }
}
