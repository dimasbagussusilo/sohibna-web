import { BookOpen, CalendarDays, Home, User } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

// Pure JSX/Tailwind phone frame showing the app's core surfaces: prayer
// schedule (with the next prayer highlighted) and the ayah-of-the-day card.
// Sample times are static marketing content; prayer names are localized via
// the shared alarms.prayerName.* keys.

const ROWS: { key: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'; time: string }[] = [
  { key: 'Fajr', time: '04:38' },
  { key: 'Dhuhr', time: '12:04' },
  { key: 'Asr', time: '15:20' },
  { key: 'Maghrib', time: '18:02' },
  { key: 'Isha', time: '19:12' },
]

export function PhoneMockup() {
  const { t, dict } = useI18n()
  const hero = dict.landing.hero

  return (
    <div
      aria-hidden
      className="w-[280px] rounded-[2.2rem] border-[10px] border-night bg-night shadow-2xl shadow-night/40"
    >
      <div className="overflow-hidden rounded-[1.6rem] bg-[#FDFBF7]">
        {/* status bar */}
        <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[10px] font-semibold text-ink/50">
          <span>04:26</span>
          <span className="h-4 w-16 rounded-full bg-night" />
          <span>▮▮▮</span>
        </div>

        {/* greeting */}
        <div className="px-5 pt-3">
          <p className="text-xs text-ink/50">{dict.onboarding.greeting} 👋</p>
        </div>

        {/* prayer schedule card */}
        <div className="mx-4 mt-3 rounded-2xl bg-night p-4 text-cream">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wide text-[#9DB8AA]">
              {hero.nextPrayerLabel}
            </span>
            <span className="rounded-full bg-[#163024] px-2 py-0.5 text-[10px] font-semibold text-[#8FBC8F]">
              −12 mnt
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold">{t('alarms.prayerName.Fajr')}</span>
            <span className="text-sm text-[#9DB8AA]">04:38</span>
          </div>
          <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
            {ROWS.slice(1).map((r) => (
              <div key={r.key} className="flex items-center justify-between text-xs">
                <span className="text-[#9DB8AA]">{t(`alarms.prayerName.${r.key}`)}</span>
                <span className="font-medium tabular-nums">{r.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ayah card */}
        <div className="mx-4 mt-3 rounded-2xl border border-sage/30 bg-white p-4">
          <p className="quran-rtl text-center text-xl leading-loose text-night">
            {hero.ayahText}
          </p>
          <p className="mt-2 text-center text-[10px] font-semibold text-sage">
            {hero.ayahSource}
          </p>
          <p className="mt-1.5 text-center text-[11px] leading-relaxed text-ink/60">
            {hero.ayahTranslation}
          </p>
        </div>

        {/* tab bar */}
        <div className="mx-4 mb-4 mt-4 flex items-center justify-around rounded-full border border-ink/10 bg-white py-2 text-ink/40">
          <Home size={16} className="text-[#4d6b4d]" />
          <BookOpen size={16} />
          <CalendarDays size={16} />
          <User size={16} />
        </div>
      </div>
    </div>
  )
}
