import { useCallback, useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import {
  fetchChapters,
  loadVerses,
  ensureAudio,
  type Chapter,
} from '@/lib/quran'
import {
  contentExistsAsync,
  downloadAudioFile,
  quranStorageBytes,
  clearAllQuranCache,
} from '@/lib/quranCache'
import { useQuranData } from '@/context/QuranDataContext'
import { useI18n } from '@/context/I18nContext'
import { Sheet } from './AudioSettingsSheet'
import { isStoragePersistent, requestPersistentStorage } from '@/hooks/useOnline'

// DownloadSheet (web port): per-surah offline downloads over Cache Storage.
// Text = verses + translations + tafsir via the read-through cache; audio =
// the active reciter's per-verse mp3s into the 'quran-audio' cache. Full-
// reciter audio download stays mobile-only (~600 MB into browser storage is
// abusive and Safari-evictable) — per-surah here.
export function DownloadSheet({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const { ud } = useQuranData()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [downloaded, setDownloaded] = useState<Set<number>>(new Set())
  const [bytes, setBytes] = useState(0)
  const [busy, setBusy] = useState<number | null>(null)
  const [progress, setProgress] = useState('')
  const [persistent, setPersistent] = useState(false)

  const refresh = useCallback(async () => {
    const cs = await fetchChapters().catch(() => [] as Chapter[])
    setChapters(cs)
    const have = new Set<number>()
    for (const c of cs) {
      if (await contentExistsAsync(`verses_surah:${c.id}`)) have.add(c.id)
    }
    setDownloaded(have)
    setBytes(await quranStorageBytes())
    setPersistent(await isStoragePersistent())
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const downloadSurah = async (id: number) => {
    setBusy(id)
    try {
      // 1) Text: loadVerses runs the read-through cache (verses + translations
      //    + tafsir fetchers all cache their content keys).
      await loadVerses({ kind: 'surah', id })
      setProgress(`${t('quranHome.downloadText', { done: '✓', total: '✓' })}`)
      // 2) Audio: fetch every verse's mp3 for the active reciter into the cache.
      const map = await ensureAudio(id, ud.reciterId)
      let i = 0
      for (const [vk, url] of map) {
        i++
        if (i % 10 === 0) setProgress(t('quranHome.downloadAudio', { done: i, total: map.size }))
        await downloadAudioFile(url, ud.reciterId, vk).catch(() => {})
      }
      // Mark downloaded (verses_surah key is written by loadVerses' cache layer).
      setDownloaded((prev) => new Set(prev).add(id))
      setBytes(await quranStorageBytes())
    } finally {
      setBusy(null)
      setProgress('')
    }
  }

  const clearAll = async () => {
    await clearAllQuranCache()
    await refresh()
  }

  return (
    <Sheet title={t('downloadSheet.title')} onClose={onClose}>
      <div className="mb-4 rounded-2xl bg-black/5 px-4 py-3 text-xs dark:bg-white/10">
        <div className="flex items-center justify-between">
          <span className="text-ink/60 dark:text-cream/60">
            {(bytes / 1024 / 1024).toFixed(1)} MB · {downloaded.size} surah
          </span>
          <div className="flex gap-2">
            {!persistent ? (
              <button
                onClick={async () => {
                  await requestPersistentStorage()
                  setPersistent(await isStoragePersistent())
                }}
                className="rounded-full bg-[#8FBC8F]/15 px-3 py-1 text-[10px] font-semibold text-[#8FBC8F]"
              >
                keep offline
              </button>
            ) : null}
            {downloaded.size ? (
              <button onClick={clearAll} className="text-[10px] text-red-400">
                clear
              </button>
            ) : null}
          </div>
        </div>
        {persistent ? (
          <div className="mt-1 text-[10px] text-[#8FBC8F]">✓ persistent storage</div>
        ) : null}
      </div>

      {progress ? (
        <div className="mb-3 rounded-xl bg-[#8FBC8F]/10 px-3 py-2 text-center text-[11px] font-semibold text-[#8FBC8F]">
          {progress}
        </div>
      ) : null}

      <div className="max-h-80 overflow-y-auto">
        {chapters.map((c) => {
          const have = downloaded.has(c.id)
          const isBusy = busy === c.id
          return (
            <div
              key={c.id}
              className="flex items-center gap-3 border-b border-gray-100 py-2 last:border-0 dark:border-white/10"
            >
              <span className="w-6 font-mono text-[10px] text-ink/40 dark:text-cream/40">
                {c.id}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-ink dark:text-cream">
                {c.name_simple}
              </span>
              <button
                onClick={() => (have ? undefined : void downloadSurah(c.id))}
                disabled={isBusy || have}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${
                  have
                    ? 'bg-[#8FBC8F]/15 text-[#8FBC8F]'
                    : 'bg-[#8FBC8F] text-white disabled:opacity-50'
                }`}
              >
                {have ? '✓' : isBusy ? '…' : <Download size={11} />}
                {have ? '' : isBusy ? '' : t('downloadSheet.text')}
              </button>
            </div>
          )
        })}
      </div>
    </Sheet>
  )
}
