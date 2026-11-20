import { useState } from 'react'
import { Flag } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { postReportAI, type AIReportSurface, type AIReportReason } from '@/api'

// AI-answer flagging (0036, Play GenAI policy) — web mirror of the app's
// AIAnswerActions: a flag row that expands into the five-reason picker.
// Fire-and-forget — the endpoint always 201s (fail-soft server-side).
const REASONS: AIReportReason[] = ['wrong', 'harmful', 'offensive', 'fabricated', 'other']

export function AIAnswerActions({
  surface,
  question,
  answer,
}: {
  surface: AIReportSurface
  question: string
  answer: string
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (reason: AIReportReason) => {
    const excerpts = `Q: ${question}\nA: ${answer}`.slice(0, 1900)
    try {
      await postReportAI({ surface, reason, excerpts })
    } catch {
      /* fail-soft — the insert may still have landed */
    }
    setOpen(false)
    setDone(true)
  }

  if (done) {
    return <span className="text-[11px] text-ink/40 dark:text-cream/40">{t('aiReport.thanks')}</span>
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 px-1 py-0.5 text-[11px] text-ink/45 hover:text-ink/70 dark:text-cream/45 dark:hover:text-cream/70"
      >
        <Flag size={11} /> {t('aiReport.title')}
      </button>
      {open ? (
        <span className="flex flex-wrap justify-end gap-1.5">
          {REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => void submit(reason)}
              className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] text-ink/70 hover:bg-black/5 dark:border-white/10 dark:bg-[#122A1F] dark:text-cream/70 dark:hover:bg-white/10"
            >
              {t(`aiReport.reason.${reason}`)}
            </button>
          ))}
        </span>
      ) : null}
    </span>
  )
}
