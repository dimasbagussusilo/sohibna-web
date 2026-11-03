// MushafPager (web) — the horizontal page-swipe container of mushaf mode: a
// CSS scroll-snap container (dir=rtl — Quran pages always read right-to-left)
// over the 604 pages. Only a ±2 window of real pages is mounted (spacers keep
// the scroll geometry stable, so the snap math never shifts as pages mount).
// PageUp/PageDown step pages; settle is debounced from the scroll position
// (abs(scrollLeft) — browsers disagree on RTL scrollLeft sign; the absolute
// value is the distance from the first page either way).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MushafPage } from './MushafPage'
import type { Chapter } from '@/lib/quran'
import type { MushafPageModel } from '@/lib/mushafPage'

const TOTAL = 604
const WINDOW = 2 // pages mounted on each side of the current one

export function MushafPager({
  initialPage,
  dark,
  script,
  chapters,
  marks,
  onSettle,
}: {
  initialPage: number
  dark: boolean
  script: string
  chapters: Record<number, Chapter>
  marks: Record<string, 'fav' | 'bk' | 'label'>
  // Reports the settled page + its model (first/last verse keys inside) so the
  // reader can record lastRead / sessions.
  onSettle?: (page: number, model: MushafPageModel | null) => void
}) {
  const [cur, setCur] = useState(() => Math.min(TOTAL, Math.max(1, initialPage)))
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const settleTimer = useRef<number | undefined>(undefined)
  const landedRef = useRef(false)

  // Measure once + on resize (ResizeObserver: no layout thrash).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const read = () => {
      const r = el.getBoundingClientRect()
      setDims((d) => (d && Math.abs(d.w - r.width) < 1 && Math.abs(d.h - r.height) < 1 ? d : { w: r.width, h: r.height }))
    }
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Debounced settle from the scroll position; also drives the lazy window.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      window.clearTimeout(settleTimer.current)
      settleTimer.current = window.setTimeout(() => {
        const w = el.clientWidth || 1
        const idx = Math.round(Math.abs(el.scrollLeft) / w)
        const page = Math.min(TOTAL, Math.max(1, idx + 1))
        setCur((c) => (c === page ? c : page))
      }, 120)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.clearTimeout(settleTimer.current)
    }
  }, [])

  // Land on the initial page once measured (scrollIntoView is RTL-sign-safe).
  useEffect(() => {
    if (!dims || landedRef.current) return
    landedRef.current = true
    ref.current
      ?.querySelector(`[data-page="${Math.min(TOTAL, Math.max(1, initialPage))}"]`)
      ?.scrollIntoView({ inline: 'start', block: 'nearest' })
  }, [dims, initialPage])

  const goTo = useCallback((page: number) => {
    const el = ref.current?.querySelector(`[data-page="${page}"]`) as HTMLElement | null
    el?.scrollIntoView({ inline: 'start', block: 'nearest', behavior: 'smooth' })
  }, [])

  // Keyboard: PageUp/PageDown step pages while the pager is in the viewport.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'PageDown' && e.key !== 'PageUp') return
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      e.preventDefault()
      goTo(Math.min(TOTAL, Math.max(1, cur + (e.key === 'PageDown' ? 1 : -1))))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cur, goTo])

  // Forward the current page's model up (MushafPage reports its own build).
  const handleLoaded = useCallback(
    (page: number, model: MushafPageModel | null) => {
      if (page === cur) onSettle?.(page, model)
    },
    [cur, onSettle],
  )

  const items = useMemo(() => {
    const from = Math.max(1, cur - WINDOW)
    const to = Math.min(TOTAL, cur + WINDOW)
    return Array.from({ length: to - from + 1 }, (_, i) => from + i)
  }, [cur])

  return (
    <div className="relative h-full">
      <div
        ref={ref}
        dir="rtl"
        tabIndex={0}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden outline-none"
      >
        {/* Leading spacer (pages before the window) keeps offsets stable. */}
        {cur - WINDOW > 1 ? <div style={{ flex: `0 0 ${(cur - WINDOW - 1) * 100}%` }} /> : null}
        {items.map((p) => (
          <div key={p} data-page={p} className="snap-start" style={{ flex: '0 0 100%' }}>
            {dims ? (
              <MushafPage
                page={p}
                width={dims.w}
                height={dims.h}
                dark={dark}
                script={script}
                chapters={chapters}
                marks={marks}
                onLoaded={handleLoaded}
              />
            ) : null}
          </div>
        ))}
        {cur + WINDOW < TOTAL ? <div style={{ flex: `0 0 ${(TOTAL - cur - WINDOW) * 100}%` }} /> : null}
      </div>
      {/* Slim progress rail, page x / 604 */}
      <div className="pointer-events-none absolute bottom-1 left-0 right-0 flex items-center justify-center gap-2 text-[10px] text-ink/50 dark:text-cream/50">
        <div className="h-[3px] w-24 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div className="h-full rounded-full bg-[#8FBC8F]" style={{ width: `${(cur / TOTAL) * 100}%` }} />
        </div>
        <span dir="ltr">
          {cur} / {TOTAL}
        </span>
      </div>
    </div>
  )
}
