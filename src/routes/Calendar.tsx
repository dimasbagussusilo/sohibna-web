import { useEffect, useMemo, useState } from 'react'
import { formatHijri, gregorianToHijri, HIJRI_MONTHS } from '@/lib/hijri'
import {
  categoriesForDate,
  eventsForDate,
  fastsForDate,
  upcomingEvents,
  loadEventCatalog,
  CATEGORY_META,
  type IslamicEvent,
} from '@/lib/islamicEvents'
import { eventShort, eventTitle } from '@/lib/eventI18n'
import { useI18n } from '@/context/I18nContext'

// Calendar tab (web port): Gregorian month grid with the current Hijri date
// headlined, event dots (colored by category), a day detail panel, and the
// upcoming occasions list.
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function Calendar() {
  const { t, lang, isRTL } = useI18n()
  const [catalog, setCatalog] = useState<IslamicEvent[] | null>(null)
  const [cursor, setCursor] = useState(() => new Date()) // any date in the shown month
  const [selected, setSelected] = useState(() => new Date())

  useEffect(() => {
    loadEventCatalog()
      .then(setCatalog)
      .catch(() => setCatalog([]))
  }, [])

  const days = useMemo(() => {
    const y = cursor.getFullYear()
    const m = cursor.getMonth()
    const first = new Date(y, m, 1)
    const startPad = first.getDay() // Sunday-start grid
    const monthLen = new Date(y, m + 1, 0).getDate()
    const cells: (Date | null)[] = Array.from({ length: startPad }, () => null)
    for (let d = 1; d <= monthLen; d++) cells.push(new Date(y, m, d))
    return cells
  }, [cursor])

  const hijriToday = gregorianToHijri(new Date())
  const selectedEvents = catalog ? eventsForDate(catalog, selected) : []
  const selectedFasts = catalog ? fastsForDate(catalog, selected) : []
  const upcoming = useMemo(() => {
    if (!catalog) return []
    return upcomingEvents(catalog, new Date(), 45, 8)
      .flatMap(({ date, events }) => events.map((event) => ({ date, event })))
      .slice(0, 8)
  }, [catalog])

  const monthLabel = cursor.toLocaleDateString(lang === 'ar' ? 'ar' : lang, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-3xl px-4 pt-5 lg:max-w-4xl xl:max-w-5xl">
      {/* Hijri headline */}
      <div className="mb-4 rounded-3xl bg-night px-5 py-5 text-cream dark:bg-[#163024]">
        <div className="text-[11px] uppercase tracking-widest text-cream/50">
          {hijriToday ? `${HIJRI_MONTHS[hijriToday.month - 1]} ${hijriToday.year} H` : ''}
        </div>
        <div className="mt-1 text-lg font-bold">{formatHijri(new Date())}</div>
        <div className="text-xs text-cream/60">
          {new Date().toLocaleDateString(lang === 'ar' ? 'ar' : lang, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Month grid + selected-day panel — side by side on desktop */}
      <div className="mb-4 lg:grid lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-4">
      <div className="mb-4 rounded-3xl bg-white p-4 shadow-sm dark:bg-[#122A1F] lg:mb-0">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="rtl-flip h-8 w-8 rounded-full bg-black/5 text-ink dark:bg-white/10 dark:text-cream"
            aria-label="previous month"
          >
            ‹
          </button>
          <span className="text-sm font-bold text-ink dark:text-cream">{monthLabel}</span>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="rtl-flip h-8 w-8 rounded-full bg-black/5 text-ink dark:bg-white/10 dark:text-cream"
            aria-label="next month"
          >
            ›
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-bold uppercase text-ink/40 dark:text-cream/40">
          {WEEKDAYS.map((w) => (
            <span key={w} className="py-1">
              {w.slice(0, isRTL ? 4 : 3)}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            if (!d) return <span key={`pad-${i}`} />
            const isToday = d.toDateString() === new Date().toDateString()
            const isSel = d.toDateString() === selected.toDateString()
            const cats = catalog ? categoriesForDate(catalog, d) : []
            const noFast = cats.includes('forbidden-fast')
            const hj = gregorianToHijri(d)
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelected(d)}
                className={`flex h-11 flex-col items-center justify-center rounded-xl text-sm ${
                  isSel
                    ? 'bg-[#8FBC8F] font-bold text-white'
                    : isToday
                      ? 'bg-black/5 font-bold text-ink dark:bg-white/10 dark:text-cream'
                      : 'text-ink dark:text-cream'
                }`}
              >
                <span>{d.getDate()}</span>
                <span className="mt-0.5 flex h-1.5 items-center gap-0.5">
                  {noFast ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  ) : cats.length ? (
                    cats.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: CATEGORY_META[c].color }}
                      />
                    ))
                  ) : null}
                </span>
                {hj && hj.day === 1 ? (
                  <span className="pointer-events-none absolute text-[8px] text-[#8FBC8F]" />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day */}
      <div className="mb-4 rounded-3xl bg-white p-4 shadow-sm dark:bg-[#122A1F] lg:mb-0">
        <div className="mb-2 text-sm font-bold text-ink dark:text-cream">
          {selected.toLocaleDateString(lang === 'ar' ? 'ar' : lang, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
          <span className="ms-2 font-mono text-xs font-normal text-ink/40 dark:text-cream/40">
            {formatHijri(selected)}
          </span>
        </div>
        {catalog === null ? (
          <p className="py-3 text-center text-xs text-ink/40 dark:text-cream/40">
            {t('calendar.loadingEvents')}
          </p>
        ) : selectedFasts.length || selectedEvents.length ? (
          <div className="space-y-2">
            {[...selectedFasts, ...selectedEvents.filter((e) => !selectedFasts.includes(e))].map(
              (e) => (
                <div key={e.id} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: CATEGORY_META[e.category].color }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-ink dark:text-cream">
                      {eventTitle(e, lang)}
                    </div>
                    <div className="text-[11px] text-ink/50 dark:text-cream/50">
                      {eventShort(e, lang)}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <p className="py-3 text-center text-xs text-ink/40 dark:text-cream/40">
            {t('calendar.noEventsDay')}
          </p>
        )}
      </div>
      </div>

      {/* Upcoming occasions */}
      <div className="mb-8">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-cream/40">
          {t('calendar.occasions')}
        </div>
        {upcoming.length ? (
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-[#122A1F]">
            {upcoming.map(({ event, date }, i) => {
              const daysAway = Math.round(
                (date.getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000,
              )
              return (
                <div
                  key={`${event.id}-${date.toISOString()}`}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i > 0 ? 'border-t border-gray-100 dark:border-white/10' : ''
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-black/5 dark:bg-white/10">
                    <span className="text-sm font-bold text-ink dark:text-cream">
                      {date.getDate()}
                    </span>
                    <span className="text-[8px] uppercase text-ink/50 dark:text-cream/50">
                      {date.toLocaleDateString('en', { month: 'short' })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink dark:text-cream">
                      {eventTitle(event, lang)}
                    </div>
                    <div className="truncate text-[11px] text-ink/50 dark:text-cream/50">
                      {daysAway === 0
                        ? t('calendar.today')
                        : daysAway === 1
                          ? t('calendar.tomorrow')
                          : t('calendar.inDays', { n: daysAway })}
                      {' · '}
                      {eventShort(event, lang)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="py-6 text-center text-xs text-ink/40 dark:text-cream/40">
            {t('calendar.noOccasions')}
          </p>
        )}
      </div>
    </div>
  )
}
