import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

// FAQ — native <details>/<summary> accordions, zero JS.

const QA: [q: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6', a: 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6'][] = [
  ['q1', 'a1'],
  ['q2', 'a2'],
  ['q3', 'a3'],
  ['q4', 'a4'],
  ['q5', 'a5'],
  ['q6', 'a6'],
]

export function FAQ() {
  const { t } = useI18n()

  return (
    <section id="faq" className="scroll-mt-24 bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <p className="inline-block rounded-full border border-sage/30 bg-sage/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#4d6b4d]">
          {t('landing.faq.eyebrow')}
        </p>
        <h2 className="font-display mt-4 text-3xl tracking-tight md:text-4xl">
          {t('landing.faq.title')}
        </h2>

        <div className="mt-9 space-y-3">
          {QA.map(([q, a]) => (
            <details
              key={q}
              className="group rounded-2xl border border-ink/8 bg-white px-6 py-4 transition-colors open:border-sage/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                {t(`landing.faq.${q}`)}
                <ChevronDown
                  size={16}
                  className="shrink-0 text-ink/35 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">
                {t(`landing.faq.${a}`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
