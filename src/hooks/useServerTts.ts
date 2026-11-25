import { useCallback, useEffect, useRef, useState } from 'react'
import { applyWaqf } from '@/lib/waqf'
import { createTtsController } from '@/lib/serverTts'

// useServerTts — speaks Arabic through the API's GET /tts (Gemini TTS: the
// same natural voice the RN app streams), falling back to the browser's own
// Arabic voice whenever the server can't deliver. The state machine lives in
// lib/serverTts (node-tested); this is the React binding.
//
// `waqf` MUST mirror the app's two-hook split:
//   true  — litany prose (Shalat/Dzikir): speak the pausal forms, exactly
//           like the app's useTtsPlayer (applyWaqf before synthesis).
//   false — Iqro lesson syllables (useArabicSpeech): stripping the final
//           harakat there erases the very vowel the lesson teaches.
//
// Contract kept identical to the inline speechSynthesis code this replaces:
// `speaking` is the id of the current utterance (null when silent) and
// re-tapping the same id stops it.
export function useServerTts(waqf: boolean) {
  const [speaking, setSpeaking] = useState<string | null>(null)
  const waqfRef = useRef(waqf)
  waqfRef.current = waqf

  // One controller per hook instance, created once; it reads `waqf` through
  // the ref and `setSpeaking` is stable, so the deps never go stale.
  const ctrlRef = useRef<ReturnType<typeof createTtsController> | null>(null)
  if (ctrlRef.current === null) {
    ctrlRef.current = createTtsController({
      createAudio: (url) => new Audio(url),
      releaseAudio: (a) => {
        // Dropping the element is not enough to free the connection — the
        // browser keeps buffering unless the source is cleared.
        const el = a as HTMLAudioElement
        el.removeAttribute('src')
        el.load()
      },
      speakFallback: (_id, text, onEnd) => {
        if (!('speechSynthesis' in window)) {
          onEnd()
          return
        }
        const u = new SpeechSynthesisUtterance(text)
        const v = window.speechSynthesis.getVoices().find((x) => x.lang.startsWith('ar'))
        if (v) u.voice = v
        u.lang = v?.lang ?? 'ar-SA'
        u.onend = onEnd
        u.onerror = onEnd
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(u)
      },
      cancelFallback: () => {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      },
      setSpeaking,
      transform: (text) => (waqfRef.current ? applyWaqf(text) : text),
    })
  }
  const ctrl = ctrlRef.current

  // Leaving the route must never leave a clip talking behind it.
  useEffect(() => () => ctrl.halt(), [ctrl])

  const speak = useCallback(
    (id: string, arabic: string | null | undefined) => ctrl.speak(id, arabic),
    [ctrl],
  )
  const stop = useCallback(() => ctrl.stop(), [ctrl])

  return { speaking, speak, stop }
}
