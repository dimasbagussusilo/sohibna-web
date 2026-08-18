import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { MapPin, RefreshCw, Moon, Sun } from 'lucide-react'
import {
  computePrayerTimes,
  formatTime,
  formatRemaining,
  nextPrayer,
  type PrayerName,
  type PrayerTimes,
} from '@/lib/prayer'
import { useLocation } from '@/hooks/useLocation'
import { usePlaceName } from '@/hooks/usePlaceName'
import { useI18n } from '@/context/I18nContext'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'

// Home (web, P0): greeting + next-prayer banner + today's schedule. The RN
// home also links dzikir/reflection/iqro cards — those land with P2.

// The five obligatory prayers (matches the RN home; Sunrise is a marker, not a prayer).
const ROWS: { key: keyof PrayerTimes; name: PrayerName }[] = [
  { key: 'fajr', name: 'Fajr' },
  { key: 'dhuhr', name: 'Dhuhr' },
  { key: 'asr', name: 'Asr' },
  { key: 'maghrib', name: 'Maghrib' },
  { key: 'isha', name: 'Isha' },
]

function useTicker(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export function Home() {
  const { t, lang } = useI18n()
  const { user } = useAuth()
  const { darkMode, setDarkMode } = useApp()
  const { coords, loading: locLoading, requestAuto } = useLocation()
  const place = usePlaceName(coords)
  const now = useTicker()

  const times = useMemo(
    () => (coords ? computePrayerTimes(coords.latitude, coords.longitude) : null),
    [coords?.latitude, coords?.longitude, new Date(now).toDateString()], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const next = times ? nextPrayer(times, new Date(now)) : null

  const greetingName = user?.name?.split(' ')[0] ?? ''
  const dateLabel = new Date(now).toLocaleDateString(lang === 'ar' ? 'ar' : lang, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      {/* Greeting + dark toggle */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink dark:text-cream">
            {t('home.greeting', { name: greetingName || '' })}
          </h1>
          <p className="mt-0.5 text-xs text-ink/50 dark:text-cream/50">{dateLabel}</p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-ink dark:bg-white/10 dark:text-cream"
          aria-label="dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Location row */}
      <div className="mb-4 flex items-center gap-2 text-xs text-ink/50 dark:text-cream/50">
        <MapPin size={13} />
        {locLoading ? (
          <span>{t('common.locating')}</span>
        ) : coords ? (
          <span>{place?.label ?? `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`}</span>
        ) : (
          <button onClick={() => void requestAuto()} className="underline">
            {t('common.grantLocation')}
          </button>
        )}
      </div>

      {/* Next prayer banner */}
      {next && times ? (
        <div className="mb-5 rounded-3xl bg-night px-5 py-6 text-center text-cream dark:bg-[#163024]">
          <div className="text-[11px] uppercase tracking-widest text-cream/50">
            {t('home.nextPrayer')}
          </div>
          <div className="mt-1 text-3xl font-bold">{next.name}</div>
          <div className="mt-1 text-sm text-cream/70">
            {formatTime(next.time)} · {formatRemaining(next.time, new Date(now))}
          </div>
        </div>
      ) : coords ? (
        <div className="mb-5 rounded-3xl bg-night px-5 py-6 text-center text-cream dark:bg-[#163024]">
          <div className="text-sm text-cream/70">{t('home.prayersDone')}</div>
        </div>
      ) : null}

      {/* Today's schedule */}
      {times ? (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-[#122A1F]">
          {ROWS.map((r, i) => {
            const active = next?.name === r.name
            return (
              <div
                key={r.key}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i > 0 ? 'border-t border-gray-100 dark:border-white/10' : ''
                } ${active ? 'bg-[#8FBC8F]/10' : ''}`}
              >
                <span
                  className={`text-sm ${active ? 'font-bold text-[#8FBC8F]' : 'text-ink dark:text-cream'}`}
                >
                  {t(`alarms.prayerName.${r.name}` as never)}
                </span>
                <span className={`font-mono text-sm ${active ? 'font-bold text-[#8FBC8F]' : 'text-ink/70 dark:text-cream/70'}`}>
                  {formatTime(times[r.key])}
                </span>
              </div>
            )
          })}
        </div>
      ) : !locLoading ? (
        <div className="rounded-3xl bg-white px-5 py-8 text-center text-sm text-ink/50 shadow-sm dark:bg-[#122A1F] dark:text-cream/50">
          {t('alarms.locationNotSet')}
          <div className="mt-3">
            <button
              onClick={() => void requestAuto()}
              className="inline-flex items-center gap-2 rounded-full bg-[#8FBC8F] px-4 py-2 text-sm font-semibold text-white"
            >
              <RefreshCw size={14} /> {t('common.grantLocation')}
            </button>
          </div>
        </div>
      ) : null}

      {/* Quick links (P0 subset) */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          to="/quran"
          className="rounded-2xl bg-[#7A9D7A] px-4 py-5 text-center font-bold text-white"
        >
          {t('tabs.quran')}
        </Link>
        <Link
          to="/calendar"
          className="rounded-2xl bg-black/5 px-4 py-5 text-center font-bold text-ink dark:bg-white/10 dark:text-cream"
        >
          {t('tabs.calendar')}
        </Link>
      </div>
    </div>
  )
}
