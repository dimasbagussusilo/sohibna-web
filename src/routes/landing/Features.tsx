import {
  AlarmClock,
  BookOpen,
  Brain,
  Sparkles,
  Compass,
  CalendarDays,
  Heart,
  type LucideIcon,
} from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

// Feature grid — seven cards, one per app pillar. Copy stays descriptive
// (no fiqh claims), mirroring the app's standing-disclaimer posture.

const FEATURES: { icon: LucideIcon; title: 'f1t' | 'f2t' | 'f3t' | 'f4t' | 'f5t' | 'f6t' | 'f7t'; body: 'f1p' | 'f2p' | 'f3p' | 'f4p' | 'f5p' | 'f6p' | 'f7p' }[] = [
  { icon: AlarmClock, title: 'f1t', body: 'f1p' },
  { icon: BookOpen, title: 'f2t', body: 'f2p' },
  { icon: Brain, title: 'f3t', body: 'f3p' },
  { icon: Sparkles, title: 'f4t', body: 'f4p' },
  { icon: Compass, title: 'f5t', body: 'f5p' },
  { icon: CalendarDays, title: 'f6t', body: 'f6p' },
  { icon: Heart, title: 'f7t', body: 'f7p' },
]

export function Features() {
  const { t } = useI18n()

  return (
    <section id="fitur" className="scroll-mt-20 py-14 md:py-18">
      <div className="mx-auto max-w-5xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4d6b4d]">
          {t('landing.features.eyebrow')}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          {t('landing.features.title')}
        </h2>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-ink/8 bg-white p-6 transition-shadow hover:shadow-md hover:shadow-ink/5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage/15 text-[#4d6b4d]">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-base font-semibold">{t(`landing.features.${title}`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {t(`landing.features.${body}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
