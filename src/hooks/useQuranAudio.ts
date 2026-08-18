import { useCallback, useEffect, useRef, useState } from 'react'
import { ensureAudio, type RepeatMode, type Verse } from '@/lib/quran'
import { downloadAudioFile } from '@/lib/quranCache'

export interface RepeatConfig {
  mode: RepeatMode
  count: number // 0 = ∞
  rangeFrom: string | null // verse key
  rangeTo: string | null // verse key
}

// useQuranAudio (web) — one verse-recitation player for the reader, ported
// from the RN expo-audio version to a module-level HTMLAudioElement.
// Same behavior: per-verse playback from the cached surah audio map,
// play/seek/prev/next, speed control (preservesPitch), and the
// quran.com-style repeat scheduler (none / single / range / surah, ∞ count).
//
// Web-specific: downloaded verse audio lives in Cache Storage under
// /__qa/* URLs — the SW's quran-audio runtime cache also caches the CDN, so
// streaming a verse caches it for offline automatically.
export function useQuranAudio(
  verses: Verse[],
  reciterId: number,
  rate: number = 1,
  repeat: RepeatConfig = { mode: 'none', count: 0, rangeFrom: null, rangeTo: null },
) {
  // One shared element (module scope — navigating away unmounts the hook but
  // the element survives so playback state is consistent).
  const playerRef = useRef<HTMLAudioElement | null>(null)
  if (!playerRef.current && typeof Audio !== 'undefined') {
    playerRef.current = new Audio()
    playerRef.current.preload = 'auto'
  }
  const player = playerRef.current!

  const [currentVk, setCurrentVk] = useState<string | null>(null)
  const currentVkRef = useRef<string | null>(currentVk)
  currentVkRef.current = currentVk

  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [dur, setDur] = useState(0)

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

  // Attach element listeners once.
  useEffect(() => {
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onTime = () => setPos(player.currentTime)
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
    }
  }, [player])

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
      // Warm the cache so the next play of this verse is offline-capable.
      void downloadAudioFile(remote, reciter, vk).catch(() => {})
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
    pos,
    dur,
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
