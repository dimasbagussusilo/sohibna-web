import { useI18n } from '@/context/I18nContext'

// "Start in 3 steps" — dark band right under the hero (midwifery pattern).

export function Steps() {
  const { dict } = useI18n()
  const s = dict.landing.steps
  const steps = [
    { n: '1', title: s.s1t, body: s.s1p },
    { n: '2', title: s.s2t, body: s.s2p },
    { n: '3', title: s.s3t, body: s.s3p },
  ]

  return (
    <section className="bg-night py-14 text-cream md:py-18">
      <div className="mx-auto max-w-5xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#8FBC8F]">
          {s.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">{s.title}</h2>

        <ol className="mt-9 grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step) => (
            <li key={step.n} className="rounded-2xl bg-[#122A1F] p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#163024] text-sm font-bold text-[#8FBC8F]">
                {step.n}
              </span>
              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9DB8AA]">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
