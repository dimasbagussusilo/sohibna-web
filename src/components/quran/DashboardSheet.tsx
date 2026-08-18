import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useI18n } from '@/context/I18nContext'
import { useQuranData } from '@/context/QuranDataContext'
import { useApp } from '@/context/AppContext'
import { fetchChapters, markTs, markVerseKey, type Chapter } from '@/lib/quran'
import { Sheet } from './AudioSettingsSheet'

// DashboardSheet — "My Data" (web port): last-read / favorites / labels tabs,
// with delete-a-label-everywhere and reading-mark management. Everything here
// is the synced UserData view; tapping a row jumps to the verse.
export function DashboardSheet({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const { toast } = useApp()
  const navigate = useNavigate()
  const { ud, removeLabelEverywhere, clearLastReadSlot } = useQuranData()
  const [tab, setTab] = useState<'lastread' | 'favorites' | 'labels'>('lastread')
  const [chapters, setChapters] = useState<Chapter[]>([])

  useMemo(() => {
    fetchChapters()
      .then(setChapters)
      .catch(() => {})
  }, [])

  const chapterName = (sid: number) => chapters.find((c) => c.id === sid)?.name_simple ?? `Surah ${sid}`

  const go = (vk: string) => {
    const [sid] = vk.split(':')
    navigate(`/surah/${sid}?v=${encodeURIComponent(vk)}`)
    onClose()
  }

  const lastReadRows = Object.entries(ud.lastRead)
    .map(([sid, info]) => ({ sid: Number(sid), vk: info.verseKey, ts: info.timestamp }))
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 30)

  const marks = Object.entries(ud.lastReadSlots)
    .map(([name, v]) => ({ name, vk: markVerseKey(v), ts: markTs(v) }))
    .sort((a, b) => b.ts - a.ts)

  const labelEntries = Object.entries(ud.labels)

  const delLabel = (label: string) => {
    const n = labelEntries.filter(([, ls]) => ls.includes(label)).length
    if (confirm(t('dashboard.deleteLabelMsg', { label, n }))) {
      removeLabelEverywhere(label)
      toast(t('dashboard.delete'))
    }
  }

  return (
    <Sheet title={t('dashboard.myData')} onClose={onClose}>
      <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/10">
        {(['lastread', 'favorites', 'labels'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-lg py-2 text-xs font-semibold ${
              tab === k
                ? 'bg-white text-ink shadow-sm dark:bg-[#0D1F17] dark:text-cream'
                : 'text-ink/50 dark:text-cream/50'
            }`}
          >
            {t(`dashboard.tab.${k}`)}
          </button>
        ))}
      </div>

      {tab === 'lastread' ? (
        <div className="max-h-80 space-y-1 overflow-y-auto">
          {marks.length ? (
            <>
              <div className="px-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {t('dashboard.marks')}
              </div>
              {marks.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2 dark:bg-white/10"
                >
                  <button onClick={() => go(m.vk)} className="flex-1 text-start">
                    <span className="text-sm font-semibold text-[#3b82f6]">{m.name}</span>
                    <span className="ms-2 font-mono text-xs text-ink/50 dark:text-cream/50">
                      {m.vk}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t('dashboard.deleteMarkMsg', { name: m.name }))) {
                        clearLastReadSlot(m.name)
                      }
                    }}
                    className="ms-2 text-xs text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="px-1 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {t('dashboard.lastReadSection')}
              </div>
            </>
          ) : null}
          {lastReadRows.length ? (
            lastReadRows.map((r) => (
              <button
                key={`${r.sid}-${r.vk}`}
                onClick={() => go(r.vk)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-start hover:bg-black/5 dark:hover:bg-white/10"
              >
                <span className="text-sm text-ink dark:text-cream">{chapterName(r.sid)}</span>
                <span className="font-mono text-xs text-ink/50 dark:text-cream/50">{r.vk}</span>
              </button>
            ))
          ) : (
            <p className="px-1 py-6 text-center text-xs text-ink/40 dark:text-cream/40">
              {t('dashboard.noHistory')}
            </p>
          )}
        </div>
      ) : null}

      {tab === 'favorites' ? (
        <div className="max-h-80 space-y-1 overflow-y-auto">
          {ud.favorites.length ? (
            ud.favorites
              .slice()
              .reverse()
              .map((vk) => (
                <button
                  key={vk}
                  onClick={() => go(vk)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-start hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <span className="text-sm text-ink dark:text-cream">
                    {chapterName(Number(vk.split(':')[0]))}
                  </span>
                  <span className="font-mono text-xs text-amber-500">★ {vk}</span>
                </button>
              ))
          ) : (
            <p className="px-1 py-6 text-center text-xs text-ink/40 dark:text-cream/40">
              {t('dashboard.noFavorites')}
            </p>
          )}
        </div>
      ) : null}

      {tab === 'labels' ? (
        <div className="max-h-80 overflow-y-auto">
          {labelEntries.length ? (
            <>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {t('dashboard.yourLabels')}
              </div>
              {Array.from(new Set(labelEntries.flatMap(([, ls]) => ls))).map((label) => {
                const count = labelEntries.filter(([, ls]) => ls.includes(label)).length
                return (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2 dark:bg-white/10"
                  >
                    <button
                      onClick={() => go(labelEntries.find(([, ls]) => ls.includes(label))![0])}
                      className="flex-1 text-start"
                    >
                      <span className="text-sm font-semibold text-[#8B5CF6]">{label}</span>
                      <span className="ms-2 text-xs text-ink/50 dark:text-cream/50">
                        {t('verseCard.labelCountN', { n: count })}
                      </span>
                    </button>
                    <button onClick={() => delLabel(label)} className="ms-2 text-xs text-red-400">
                      ✕
                    </button>
                  </div>
                )
              })}
            </>
          ) : (
            <p className="px-1 py-6 text-center text-xs text-ink/40 dark:text-cream/40">
              {t('dashboard.noLabels')}
            </p>
          )}
        </div>
      ) : null}
    </Sheet>
  )
}
