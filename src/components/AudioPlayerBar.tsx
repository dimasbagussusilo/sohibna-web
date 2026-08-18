import { useState, type ReactNode } from 'react'
import { Play, Pause, SkipForward, SkipBack, X, Settings, Gauge } from 'lucide-react'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// The shared bottom playback bar (web port) used by the Quran reader (and the
// Shalat page in P2). Renders nothing until a track is loaded.
//   • onOpenSettings → ⚙ (reciter/speed/repeat sheet)
//   • onPrev / onNext → ⏮ / ⏭ (verse playlist)
//   • onCycleRate → 🔄 gauge + rate (inline speed cycle)
// `banner` is an optional node above the title (word popup).
export function AudioPlayerBar({
  title,
  isPlaying,
  pos,
  dur,
  rate,
  onToggle,
  onSeek,
  onClose,
  onPrev,
  onNext,
  onOpenSettings,
  onCycleRate,
  banner,
}: {
  title: string | null
  isPlaying: boolean
  pos: number
  dur: number
  rate?: number
  onToggle: () => void
  onSeek: (seconds: number) => void
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  onOpenSettings?: () => void
  onCycleRate?: () => void
  banner?: ReactNode
}) {
  const [barEl, setBarEl] = useState<HTMLDivElement | null>(null)
  if (!title) return null

  const showScrubber = dur > 0
  const pct = dur > 0 ? (pos / dur) * 100 : 0

  const seekFromEvent = (e: React.MouseEvent) => {
    if (!barEl || dur <= 0) return
    const rect = barEl.getBoundingClientRect()
    onSeek(((e.clientX - rect.left) / rect.width) * dur)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-cream px-4 pt-3 pb-3 dark:border-white/10 dark:bg-[#122A1F] lg:ps-20">
      {banner}

      <div className="mx-auto mb-2 max-w-3xl truncate text-center text-xs text-gray-500 dark:text-gray-400">
        {title}
        {rate && rate !== 1 ? ` · ${rate}×` : ''}
      </div>

      {showScrubber ? (
        <div
          ref={setBarEl}
          onClick={seekFromEvent}
          className="mx-auto mb-3 h-1.5 max-w-3xl cursor-pointer rounded-full bg-gray-200 dark:bg-white/10"
        >
          <div
            className="h-full rounded-full bg-[#8FBC8F]"
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : (
        <div className="mx-auto mb-3 h-1.5 max-w-3xl" />
      )}

      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <span className="w-12 font-mono text-xs text-gray-400">
          {showScrubber ? fmt(pos) : ''}
        </span>
        <div className="flex flex-row items-center gap-4">
          {onOpenSettings ? (
            <button onClick={onOpenSettings} aria-label="audio settings">
              <Settings color="#9ca3af" size={20} />
            </button>
          ) : null}
          {onPrev ? (
            <button onClick={onPrev} aria-label="previous">
              <SkipBack color="#9ca3af" size={22} className="rtl-flip" />
            </button>
          ) : null}
          {onCycleRate ? (
            <button onClick={onCycleRate} className="flex flex-row items-center" aria-label="speed">
              <Gauge color="#9ca3af" size={18} />
              <span className="ms-1 text-xs font-bold text-stone-500 dark:text-gray-400">
                {rate}×
              </span>
            </button>
          ) : null}
          <button
            onClick={onToggle}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8FBC8F]"
            aria-label={isPlaying ? 'pause' : 'play'}
          >
            {isPlaying ? (
              <Pause color="#ffffff" size={22} fill="#ffffff" />
            ) : (
              <Play color="#ffffff" size={22} fill="#ffffff" />
            )}
          </button>
          {onNext ? (
            <button onClick={onNext} aria-label="next">
              <SkipForward color="#9ca3af" size={22} className="rtl-flip" />
            </button>
          ) : null}
          <button onClick={onClose} aria-label="close player">
            <X color="#9ca3af" size={22} />
          </button>
        </div>
        <span className="w-12 text-right font-mono text-xs text-gray-400">
          {showScrubber ? fmt(dur) : ''}
        </span>
      </div>
    </div>
  )
}
