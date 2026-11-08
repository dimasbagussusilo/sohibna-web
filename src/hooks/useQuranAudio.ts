import { useCallback, useEffect, useRef, useState } from 'react'
import { ensureAudio, type RepeatMode, type Verse } from '@/lib/quran'

export interface RepeatConfig {
  mode: RepeatMode
  count: number // 0 = ∞
  rangeFrom: string | null // verse key
  rangeTo: string | null // verse key
}

// useQuranAudio (web) — one verse-recitation player for the reader, ported
// from the RN expo-audio version to a per-instance HTMLAudioElement.
// Same behavior: per-verse playback from the cached surah audio map,
// play/seek/prev/next, speed control (preservesPitch), and the
// quran.com-style repeat scheduler (none / single / range / surah, ∞ count).
//
// Web-specific: playback position is NOT React state — timeupdate fires ~4×/s
// and a setState there would re-render the whole reader (verse list included).
// Consumers subscribe via subscribePos (the progress bar + the word-highlight
// sync), so ticks re-render nothing by default. Duration stays state (it
// changes once per track). The SW's quran-audio runtime cache stores the CDN
// responses, so streaming a verse already makes it offline-capable — no extra
// cache warm needed here.
export function useQuranAudio(
  verses: Verse[],
  reciterId: number,
  rate: number = 1,
  repeat: RepeatConfig = { mode: 'none', count: 0, rangeFrom: null, rangeTo: null },
) {
  // One element per hook instance; torn down on unmount (below) so leaving
  // the reader can never leave an orphaned <audio> playing.
  const playerRef = useRef<HTMLAudioElement | null>(null)
  if (!playerRef.current && typeof Audio !== 'undefined') {
    playerRef.current = new Audio()
    playerRef.current.preload = 'auto'
  }
  const player = playerRef.current!

  const [currentVk, setCurrentVk] = useState<string | null>(null)
  const currentVkRef = useRef<string | null>(null)
  currentVkRef.current = currentVk

  const [playing, setPlaying] = useState(false)
  const [dur, setDur] = useState(0)

  // Live-position fan-out (the player bar + word sync subscribe; no state).
  const posListenersRef = useRef(new Set<(pos: number) => void>())

  const versesRef = useRef(verses)
  versesRef.current = verses
  const reciterRef = useRef(reciterId)
  reciterRef.current = reciterId
  const rateRef = useRef(rate)
  rateRef.current = rate
  const repeatRef = useRef(repeat)
  repeatRef.current = repeat
  const advancingRef = useRef(false)

  // Repeat accounting (refs — the scheduler runs off the 'ended' event):
  const verseRepsRef = useRef(0)
  const lastFinishedVkRef = useRef<string | null>(null)
  const loopRepsRef = useRef(0)

  // Attach element listeners once; tear the element down on unmount.
  useEffect(() => {
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onTime = () => {
      const pos = player.currentTime
      for (const cb of posListenersRef.current) cb(pos)
    }
    const onMeta = () => setDur(player.duration || 0)
    player.addEventListener('play', onPlay)
    player.addEventListener('pause', onPause)
    player.addEventListener('timeupdate', onTime)
    player.addEventListener('loadedmetadata', onMeta)
    return () => {
      player.removeEventListener('play', onPlay)
      player.removeEventListener('pause', onPause)
      player.removeEventListener('timeupdate', onTime)
      player.removeEventListener('loadedmetadata', onMeta)
      // Orphaned-audio teardown: there is no global mini-player, so leaving
      // the reader must stop playback AND drop the source (aborts any
      // in-flight media download).
      player.pause()
      player.removeAttribute('src')
      player.load()
    }
  }, [player])

  // Subscribe to playback-position ticks (~4×/s while playing). Returns an
  // unsubscribe. Keep the work per tick tiny — this runs outside React.
  const subscribePos = useCallback((cb: (pos: number) => void) => {
    posListenersRef.current.add(cb)
    return () => {
      posListenersRef.current.delete(cb)
    }
  }, [])

  const applyRate = useCallback(() => {
    const r = rateRef.current || 1
    try {
      player.playbackRate = r
      // Keep the reciter's voice natural at non-1× speeds (all modern browsers).
      player.preservesPitch = true
    } catch {
      /* not ready — applied again on next play */
    }
  }, [player])

  const playVerse = useCallback(
    async (vk: string) => {
      const sid = parseInt(vk.split(':')[0], 10)
      const reciter = reciterRef.current
      const map = await ensureAudio(sid, reciter)
      const remote = map.get(vk)
      if (!remote) return
      setCurrentVk(vk)
      currentVkRef.current = vk
      player.src = remote // the SW caches this CDN response for offline
      applyRate()
      try {
        await player.play()
      } catch {
        /* autoplay policy or network — bar shows the state it has */
      }
    },
    [player, applyRate],
  )

  // Speed changed mid-playback: apply it live.
  useEffect(() => {
    applyRate()
  }, [rate, applyRate])

  // Repeat config changed → restart loop counting fresh.
  useEffect(() => {
    loopRepsRef.current = 0
    verseRepsRef.current = 0
    lastFinishedVkRef.current = null
  }, [repeat.mode, repeat.count, repeat.rangeFrom, repeat.rangeTo])

  // Repeat scheduler — same model as the RN version:
  //   none    → advance through, stop at the end of the surah.
  //   single  → replay each verse `count` times (∞ if 0) before advancing.
  //   range   → play [rangeFrom..rangeTo]; loop the range `count` times (∞ if 0).
  //   surah   → loop the whole loaded surah `count` times (∞ if 0).
  const advance = useCallback(() => {
    const vk = currentVkRef.current
    if (!vk || advancingRef.current) return
    const vs = versesRef.current
    const idx = vs.findIndex((v) => v.verse_key === vk)
    if (idx < 0) {
      setCurrentVk(null)
      return
    }
    const { mode, count, rangeFrom, rangeTo } = repeatRef.current

    if (lastFinishedVkRef.current !== vk) {
      verseRepsRef.current = 1
      lastFinishedVkRef.current = vk
    } else {
      verseRepsRef.current += 1
    }

    const infinite = count === 0
    const fromFound = rangeFrom ? vs.findIndex((v) => v.verse_key === rangeFrom) : -1
    const fromIdx = fromFound >= 0 ? fromFound : 0
    const toFound = rangeTo ? vs.findIndex((v) => v.verse_key === rangeTo) : -1
    const toIdx = toFound >= 0 ? Math.min(vs.length - 1, toFound) : vs.length - 1

    const go = (targetVk: string) => {
      advancingRef.current = true
      void playVerse(targetVk).finally(() => {
        advancingRef.current = false
      })
    }

    if (mode === 'single' && (infinite || verseRepsRef.current < count)) {
      lastFinishedVkRef.current = null
      go(vk)
      return
    }

    const nextIdx = idx + 1
    if (nextIdx <= toIdx) {
      go(vs[nextIdx].verse_key)
      return
    }

    if (mode === 'range' || mode === 'surah') {
      loopRepsRef.current += 1
      if (!infinite && loopRepsRef.current >= count) {
        setCurrentVk(null)
        return
      }
      go(vs[fromIdx].verse_key)
      return
    }
    setCurrentVk(null)
  }, [playVerse])

  // Finish signal (the 'ended' event is reliable for media elements on web).
  useEffect(() => {
    const onEnded = () => advance()
    player.addEventListener('ended', onEnded)
    return () => player.removeEventListener('ended', onEnded)
  }, [player, advance])

  const togglePlay = useCallback(() => {
    if (!currentVk) {
      const first = versesRef.current[0]
      if (first) void playVerse(first.verse_key)
      return
    }
    if (playing) player.pause()
    else void player.play().catch(() => {})
  }, [currentVk, playing, player, playVerse])

  const prev = useCallback(() => {
    if (!currentVk) return
    loopRepsRef.current = 0
    const i = versesRef.current.findIndex((v) => v.verse_key === currentVk)
    if (i > 0) void playVerse(versesRef.current[i - 1].verse_key)
  }, [currentVk, playVerse])

  const next = useCallback(() => {
    if (!currentVk) return
    loopRepsRef.current = 0
    const i = versesRef.current.findIndex((v) => v.verse_key === currentVk)
    if (i >= 0 && i < versesRef.current.length - 1)
      void playVerse(versesRef.current[i + 1].verse_key)
  }, [currentVk, playVerse])

  const seekTo = useCallback(
    (seconds: number) => {
      try {
        player.currentTime = seconds
      } catch {
        /* not seekable yet */
      }
    },
    [player],
  )

  // Stable pause so memoized verse cards can hold a stable onPause.
  const pause = useCallback(() => {
    player.pause()
  }, [player])

  // Stop + hide the bar (the AudioBar "X").
  const stop = useCallback(() => {
    player.pause()
    setCurrentVk(null)
    currentVkRef.current = null
  }, [player])

  // Reciter changed mid-playback: refetch and restart the current verse.
  useEffect(() => {
    if (!currentVk) return
    void playVerse(currentVk)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciterId])

  return {
    currentVk,
    isPlaying: playing,
    dur,
    subscribePos,
    playVerse,
    togglePlay,
    pause,
    stop,
    prev,
    next,
    seekTo,
    rate,
  }
}
