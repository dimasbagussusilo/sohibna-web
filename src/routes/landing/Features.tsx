import {
  AlarmClock,
  BookOpen,
  Brain,
  Sparkles,
  Compass,
  CalendarDays,
  Heart,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

// Feature bento — varied cell sizes with tiny live-looking UI fragments
// (schedule rows, an ayah, a chat bubble, a review bar) instead of seven
// identical cards. Copy stays descriptive (no fiqh claims).

type Feature = {
  icon: LucideIcon
  title: 'f1t' | 'f2t' | 'f3t' | 'f4t' | 'f5t' | 'f6t' | 'f7t'
  body: 'f1p' | 'f2p' | 'f3p' | 'f4p' | 'f5p' | 'f6p' | 'f7p'
  span: string
  visual?: 'schedule' | 'ayah' | 'review' | 'chat' | 'compass'
}

const FEATURES: Feature[] = [
  { icon: AlarmClock, title: 'f1t', body: 'f1p', span: 'lg:col-span-4', visual: 'schedule' },
  { icon: BookOpen, title: 'f2t', body: 'f2p', span: 'lg:col-span-2', visual: 'ayah' },
  { icon: Brain, title: 'f3t', body: 'f3p', span: 'lg:col-span-2', visual: 'review' },
  { icon: Sparkles, title: 'f4t', body: 'f4p', span: 'lg:col-span-2', visual: 'chat' },
  { icon: Compass, title: 'f5t', body: 'f5p', span: 'lg:col-span-2', visual: 'compass' },
  { icon: CalendarDays, title: 'f6t', body: 'f6p', span: 'lg:col-span-3' },
  { icon: Heart, title: 'f7t', body: 'f7p', span: 'lg:col-span-3' },
]

const CARD =
  'group relative rounded-3xl border border-ink/8 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sage/40 hover:shadow-md'

function IconChip({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sage/15 text-[#4d6b4d] transition-colors group-hover:bg-sage/25">
      <Icon size={20} />
    </span>
  )
}

export function Features() {
  const { t } = useI18n()
  const f = t

  return (
    <section id="fitur" className="scroll-mt-24 bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="inline-block rounded-full border border-sage/30 bg-sage/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#4d6b4d]">
          {f('landing.features.eyebrow')}
        </p>
        <h2 className="font-display mt-4 max-w-xl text-3xl tracking-tight md:text-4xl">
          {f('landing.features.title')}
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {FEATURES.map(({ icon, title, body, span, visual }) => (
            <div key={title} className={`${CARD} ${span}`}>
              <IconChip icon={icon} />
              <h3 className="mt-4 text-base font-semibold">{t(`landing.features.${title}`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {t(`landing.features.${body}`)}
              </p>

              {visual === 'schedule' && (
                <div className="mt-4 space-y-1.5 rounded-2xl bg-cream p-4">
                  {(['Fajr', 'Dhuhr', 'Asr'] as const).map((name, i) => (
                    <div
                      key={name}
                      className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-xs ${
                        i === 1 ? 'bg-night text-cream' : 'text-ink/60'
                      }`}
                    >
                      <span>{t(`alarms.prayerName.${name}`)}</span>
                      <span className="tabular-nums">{['04:38', '12:04', '15:20'][i]}</span>
                    </div>
                  ))}
                </div>
              )}

              {visual === 'ayah' && (
                <p className="quran-rtl mt-4 rounded-2xl bg-cream p-4 text-center text-lg leading-loose text-night">
                  فَاذْكُرُونِي أَذْكُرْكُمْ
                </p>
              )}

              {visual === 'review' && (
                <div className="mt-4 rounded-2xl bg-cream p-4">
                  <div className="h-2 overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-sage to-[#8FBC8F]" />
                  </div>
                  <p className="mt-2 text-[11px] font-medium text-ink/45">
                    {t('quranHome.streakTotalPages', { n: 128 })} ·{' '}
                    {t('quranHome.dayStreak', { n: 7 })}
                  </p>
                </div>
              )}

              {visual === 'chat' && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-start">
                    <span className="max-w-[85%] rounded-2xl rounded-ss-md bg-cream px-3 py-1.5 text-[11px] text-ink/70">
                      {t('landing.features.f4t')}?
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <span className="flex max-w-[85%] items-center gap-1.5 rounded-2xl rounded-se-md bg-night px-3 py-1.5 text-[11px] text-cream">
                      <MessageCircle size={11} className="text-[#8FBC8F]" />
                      ✦
                    </span>
                  </div>
                </div>
              )}

              {visual === 'compass' && (
                <div className="mt-4 flex justify-center">
                  <span className="relative grid h-16 w-16 place-items-center rounded-full border border-ink/10 bg-cream">
                    <Compass
                      size={26}
                      className="text-[#4d6b4d] transition-transform duration-700 group-hover:rotate-45"
                    />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
