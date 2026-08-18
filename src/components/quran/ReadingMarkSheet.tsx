import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useI18n } from '@/context/I18nContext'
import { useQuranData } from '@/context/QuranDataContext'
import { useApp } from '@/context/AppContext'
import { markVerseKey, markTs } from '@/lib/quran'
import { Sheet } from './AudioSettingsSheet'

// ReadingMarkSheet (web port): name a verse pin. Each mark name holds ONE
// verse (re-marking overwrites); marks surface in "Continue Reading" and the
// My Data dashboard, and jump straight back to the verse.
export function ReadingMarkSheet({ vk, onClose }: { vk: string | null; onClose: () => void }) {
  const { t } = useI18n()
  const { toast } = useApp()
  const { ud, setLastReadSlot } = useQuranData()
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')

  if (!vk) return null

  const marks = Object.entries(ud.lastReadSlots)
    .map(([name, v]) => ({ name, verseKey: markVerseKey(v), ts: markTs(v) }))
    .sort((a, b) => b.ts - a.ts)

  const pin = (name: string) => {
    const range = setLastReadSlot(name, vk)
    toast(t('reader.tapToClose').split(' ')[0]) // lightweight confirmation
    onClose()
    void range // P2: the "summarize what you read" banner lands with RangeSummary
  }

  return (
    <Sheet title={t('verseCard.readingMark')} onClose={onClose}>
      <p className="mb-3 text-xs text-ink/50 dark:text-cream/50">{t('verseCard.markHint')}</p>

      {marks.length ? (
        <div className="mb-4 max-h-52 space-y-1 overflow-y-auto">
          {marks.map((m) => (
            <button
              key={m.name}
              onClick={() => pin(m.name)}
              className="flex w-full items-center justify-between rounded-xl bg-black/5 px-3 py-2.5 text-start dark:bg-white/10"
            >
              <span className="text-sm font-semibold text-[#3b82f6]">{m.name}</span>
              <span className="font-mono text-xs text-ink/50 dark:text-cream/50">
                {m.verseKey === vk ? `← ${m.verseKey}` : m.verseKey}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!draft.trim()) return
          pin(draft.trim())
        }}
        className="flex gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('verseCard.addMark')}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
        />
        <button
          type="submit"
          className="rounded-xl bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white"
        >
          {t('verseCard.readingMark')}
        </button>
      </form>

      {/* Jump to an existing mark (navigate, no re-pin) */}
      {marks.length ? (
        <div className="mt-4 border-t border-gray-100 pt-3 dark:border-white/10">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {t('quranHome.myCollection')}
          </div>
          {marks.map((m) => (
            <button
              key={`go-${m.name}`}
              onClick={() => {
                const [sid] = m.verseKey.split(':')
                navigate(`/surah/${sid}?v=${encodeURIComponent(m.verseKey)}`)
                onClose()
              }}
              className="block w-full py-1.5 text-start text-xs text-[#3b82f6] underline"
            >
              {m.name} → {m.verseKey}
            </button>
          ))}
        </div>
      ) : null}
    </Sheet>
  )
}
