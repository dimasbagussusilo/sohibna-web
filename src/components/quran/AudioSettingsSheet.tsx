import { useState } from 'react'
import { useI18n } from '@/context/I18nContext'
import { useQuranData } from '@/context/QuranDataContext'
import type { Reciter, Verse } from '@/lib/quran'

// AudioSettingsSheet (web port): reciter picker, playback speed, and the
// repeat scheduler config (none/single/range/surah + count + range bounds).
// Reads/writes the synced reader settings via setUD.
const RATES = [0.75, 1, 1.25, 1.5, 2]

export function AudioSettingsSheet({
  verses,
  reciters,
  currentVk,
  onClose,
}: {
  verses: Verse[]
  reciters: Reciter[]
  currentVk: string | null
  onClose: () => void
}) {
  const { t } = useI18n()
  const { ud, setUD } = useQuranData()
  const [tab, setTab] = useState<'speed' | 'reciter' | 'repeat'>('speed')

  const setRepeat = (patch: {
    repeatMode?: string
    repeatCount?: number
    repeatRangeFrom?: string | null
    repeatRangeTo?: string | null
  }) => setUD(patch as never)

  const verseIdx = currentVk ? verses.findIndex((v) => v.verse_key === currentVk) : -1
  const useCurrent = () => {
    if (verseIdx < 0) return
    setRepeat({ repeatRangeFrom: verses[verseIdx].verse_key })
  }

  return (
    <Sheet onClose={onClose} title={t('audioSettings.title')}>
      {/* Tabs */}
      <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/10">
        {(['speed', 'reciter', 'repeat'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-lg py-2 text-xs font-semibold ${
              tab === k ? 'bg-white text-ink shadow-sm dark:bg-[#0D1F17] dark:text-cream' : 'text-ink/50 dark:text-cream/50'
            }`}
          >
            {k === 'speed' ? t('audioSettings.playbackSpeed') : k === 'reciter' ? t('audioSettings.reciter') : t('audioSettings.repeat')}
          </button>
        ))}
      </div>

      {tab === 'speed' ? (
        <div className="flex flex-wrap gap-2">
          {RATES.map((r) => (
            <button
              key={r}
              onClick={() => setUD({ audioRate: r })}
              className={`rounded-full px-4 py-2 text-sm ${
                ud.audioRate === r
                  ? 'bg-[#8FBC8F] font-semibold text-white'
                  : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
              }`}
            >
              {r === 1 ? t('audioSettings.normal') : `${r}×`}
            </button>
          ))}
        </div>
      ) : null}

      {tab === 'reciter' ? (
        <div className="max-h-72 overflow-y-auto">
          {reciters.map((r) => (
            <button
              key={r.id}
              onClick={() => setUD({ reciterId: r.id })}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                ud.reciterId === r.id
                  ? 'bg-[#8FBC8F]/15 font-semibold text-[#8FBC8F]'
                  : 'text-ink dark:text-cream'
              }`}
            >
              <span>{r.reciter_name}</span>
              {ud.reciterId === r.id ? <span>✓</span> : null}
            </button>
          ))}
        </div>
      ) : null}

      {tab === 'repeat' ? (
        <div className="space-y-4">
          {/* Mode */}
          <div className="grid grid-cols-4 gap-2">
            {(['none', 'single', 'range', 'surah'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setRepeat({ repeatMode: m })}
                className={`rounded-xl px-2 py-2.5 text-xs ${
                  ud.repeatMode === m
                    ? 'bg-[#8FBC8F] font-semibold text-white'
                    : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
                }`}
              >
                {t(`audioSettings.repeatMode.${m}`)}
              </button>
            ))}
          </div>

          {/* Count (not for none) */}
          {ud.repeatMode !== 'none' ? (
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {t('audioSettings.times')}
              </div>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 5, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRepeat({ repeatCount: n })}
                    className={`rounded-full px-3.5 py-1.5 text-sm ${
                      ud.repeatCount === n
                        ? 'bg-[#8FBC8F] font-semibold text-white'
                        : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
                    }`}
                  >
                    {n === 0 ? '∞' : n}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Range bounds */}
          {ud.repeatMode === 'range' ? (
            <div className="space-y-2">
              <RangeRow
                label={t('audioSettings.from')}
                value={ud.repeatRangeFrom}
                verses={verses}
                onChange={(v) => setRepeat({ repeatRangeFrom: v })}
              />
              <RangeRow
                label={t('audioSettings.to')}
                value={ud.repeatRangeTo}
                verses={verses}
                onChange={(v) => setRepeat({ repeatRangeTo: v })}
              />
              {verseIdx >= 0 ? (
                <button
                  onClick={useCurrent}
                  className="w-full rounded-xl bg-black/5 py-2 text-xs text-ink dark:bg-white/10 dark:text-cream"
                >
                  {t('audioSettings.useCurrentVerse')}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </Sheet>
  )
}

function RangeRow({
  label,
  value,
  verses,
  onChange,
}: {
  label: string
  value: string | null
  verses: Verse[]
  onChange: (v: string | null) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl bg-black/5 px-3 py-2 dark:bg-white/10">
      <span className="text-xs text-ink/60 dark:text-cream/60">{label}</span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="rounded-lg border-none bg-white px-2 py-1 text-sm text-ink dark:bg-[#0D1F17] dark:text-cream"
      >
        <option value="">—</option>
        {verses.map((v) => (
          <option key={v.verse_key} value={v.verse_key}>
            {v.verse_key}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 dark:bg-[#122A1F] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-bold text-ink dark:text-cream">{title}</span>
          <button onClick={onClose} className="text-xs text-ink/50 dark:text-cream/50">
            {t0()}
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// small helper to avoid circular import of i18n in the generic Sheet
function t0() {
  return '✕'
}
