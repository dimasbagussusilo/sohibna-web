import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useI18n } from '@/context/I18nContext'
import { useQuranData } from '@/context/QuranDataContext'
import { useApp } from '@/context/AppContext'
import { markVerseKey, markTs } from '@/lib/quran'
import { markPresetNames } from '@/lib/quranPresets'
import { Sheet } from './AudioSettingsSheet'

// ReadingMarkSheet (web port): name a verse pin. Each mark name holds ONE
// verse (re-marking overwrites); marks surface in "Continue Reading" and the
// My Data dashboard, and jump straight back to the verse.
export function ReadingMarkSheet({ vk, onClose }: { vk: string | null; onClose: () => void }) {
  const { t } = useI18n()
  const { toast, askConfirm } = useApp()
  const { ud, setLastReadSlot } = useQuranData()
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')

  if (!vk) return null

  const marks = Object.entries(ud.lastReadSlots)
    .map(([name, v]) => ({ name, verseKey: markVerseKey(v), ts: markTs(v) }))
    .sort((a, b) => b.ts - a.ts)

  // Built-in one-tap names — hidden once used (the name already exists as a
  // normal mark); tapping pins this verse exactly like typing the name would.
  const suggestions = markPresetNames(t).filter(
    (n) => !marks.some((m) => m.name.toLowerCase() === n.toLowerCase()),
  )

  // Pinning a name that already points elsewhere OVERWRITES it — the same
  // silent-overwrite trap the app sheet guards with a confirm (users tapping
  // the row to "see" their mark re-pinned it to whatever surah was open).
  const pin = async (name: string) => {
    const existing = marks.find((m) => m.name.toLowerCase() === name.toLowerCase())
    if (existing && existing.verseKey !== vk) {
      const ok = await askConfirm({
        title: t('verseCard.moveMarkTitle'),
        message: t('verseCard.moveMarkMsg', { name, from: existing.verseKey, to: vk }),
      })
      if (!ok) return
    }
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
              onClick={() => void pin(m.name)}
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

      {/* Built-in one-tap names — the input below stays for custom ones. */}
      {suggestions.length ? (
        <div className="mb-4">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {t('verseCard.suggestions')}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => void pin(name)}
                className="rounded-full bg-[#3b82f6]/10 px-2.5 py-1 text-xs font-semibold text-[#3b82f6]"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!draft.trim()) return
          void pin(draft.trim())
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
