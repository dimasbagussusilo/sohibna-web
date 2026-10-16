import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

// FAQ — native <details>/<summary> accordions, zero JS (midwifery pattern).

const QA: [q: 'q1' | 'q2' | 'q3' | 'q4' | 'q5', a: 'a1' | 'a2' | 'a3' | 'a4' | 'a5'][] = [
  ['q1', 'a1'],
  ['q2', 'a2'],
  ['q3', 'a3'],
  ['q4', 'a4'],
  ['q5', 'a5'],
]

export function FAQ() {
  const { t } = useI18n()

  return (
    <section id="faq" className="scroll-mt-20 py-14 md:py-18">
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4d6b4d]">
          {t('landing.faq.eyebrow')}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          {t('landing.faq.title')}
        </h2>

        <div className="mt-8 divide-y divide-ink/8 rounded-2xl border border-ink/8 bg-white">
          {QA.map(([q, a]) => (
            <details key={q} className="group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                {t(`landing.faq.${q}`)}
                <ChevronDown
                  size={16}
                  className="shrink-0 text-ink/40 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                {t(`landing.faq.${a}`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
