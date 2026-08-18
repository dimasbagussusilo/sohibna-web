import { memo, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Play, Pause } from 'lucide-react'
import {
  ensureEnTafsir,
  ensureIndoTafsir,
  getEnTafsir,
  getIndoTafsir,
  stripHtml,
  type FootnotePressInfo,
  type Script,
  type Verse,
  type WordPressInfo,
} from '@/lib/quran'
import { ArabicText } from './ArabicText'
import { TransText } from './TransText'
import { MarkMenuTrigger, MarkMenuList } from './MarkMenu'
import { useI18n } from '@/context/I18nContext'

// One verse in "verse" display mode (web port). Memoized with the same
// scalar-props discipline as the RN version — only the card whose own state
// changed re-renders.
function VerseCardImpl({
  verse,
  script,
  fontSize,
  darkMode,
  showEnglish,
  showIndonesian,
  showEnglishTafsir,
  showIndoTafsir,
  isFav,
  labels,
  hasMark,
  isPlaying,
  onToggleFav,
  onPlayVerse,
  onPause,
  tafsirOpen,
  onToggleTafsir,
  onWordPress,
  onFootnotePress,
  activeWordKey,
  onOpenLabelSheet,
  onOpenMarkSheet,
}: {
  verse: Verse
  script: Script
  fontSize: number
  darkMode: boolean
  showEnglish: boolean
  showIndonesian: boolean
  showEnglishTafsir: boolean
  showIndoTafsir: boolean
  isFav: boolean
  labels: string[]
  hasMark: boolean
  isPlaying: boolean
  onToggleFav: (vk: string) => void
  onPlayVerse: (vk: string) => void
  onPause: () => void
  tafsirOpen: boolean
  onToggleTafsir: (vk: string) => void
  onWordPress?: (info: WordPressInfo) => void
  onFootnotePress?: (info: FootnotePressInfo) => void
  activeWordKey?: string | null
  onOpenLabelSheet: (vk: string) => void
  onOpenMarkSheet: (vk: string) => void
}) {
  const [enTafsir, setEnTafsir] = useState<string | undefined>()
  const [indoTafsir, setIndoTafsir] = useState<string | undefined>()
  const [loadingTafsir, setLoadingTafsir] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useI18n()

  const vk = verse.verse_key
  const surah = parseInt(vk.split(':')[0], 10)
  const verseN = parseInt(vk.split(':')[1], 10)
  const enTrans = verse.translations?.find((tr) => tr.resource_id === 20)
  const idTrans = verse.translations?.find((tr) => tr.resource_id === 33)

  useEffect(() => {
    if (!tafsirOpen) return
    let alive = true
    setLoadingTafsir(true)
    ;(async () => {
      const tasks: Array<Promise<void>> = []
      if (showEnglishTafsir) {
        tasks.push(
          ensureEnTafsir(surah).then(() => {
            if (alive) setEnTafsir(getEnTafsir(vk))
          }),
        )
      }
      if (showIndoTafsir) {
        tasks.push(
          ensureIndoTafsir(surah).then(() => {
            if (alive) setIndoTafsir(getIndoTafsir(surah, verseN))
          }),
        )
      }
      await Promise.all(tasks)
      if (alive) setLoadingTafsir(false)
    })()
    return () => {
      alive = false
    }
  }, [tafsirOpen, showEnglishTafsir, showIndoTafsir, surah, vk, verseN])

  const showTafsirSection = showEnglishTafsir || showIndoTafsir

  return (
    <div className="mx-3 mb-3 rounded-2xl border border-gray-100 bg-[#FBF8F1] dark:border-white/10 dark:bg-[#122A1F]">
      {/* Header row */}
      <div className="flex-row flex items-center border-b border-gray-100 px-3 py-2 dark:border-white/10">
        <div className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#8FBC8F]">
          <span className="text-xs font-bold text-white">{verse.verse_number}</span>
        </div>
        <span className="mr-2 font-mono text-xs text-gray-400">{vk}</span>
        <div className="flex-1" />

        <div className="flex flex-row items-center">
          <MarkMenuTrigger
            open={menuOpen}
            hasAnyMark={isFav || labels.length > 0 || hasMark}
            onToggle={() => setMenuOpen((v) => !v)}
          />
          <div className="mx-1.5 h-5 w-px bg-gray-200 dark:bg-white/10" />
          <button
            onClick={() => (isPlaying ? onPause() : onPlayVerse(vk))}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: isPlaying ? '#8FBC8F' : 'rgba(143,188,143,0.15)' }}
            aria-label={isPlaying ? 'pause' : 'play'}
          >
            {isPlaying ? (
              <Pause color="#ffffff" size={14} fill="#ffffff" />
            ) : (
              <Play color="#8FBC8F" size={14} fill="#8FBC8F" />
            )}
          </button>
        </div>
      </div>

      {/* Assigned labels */}
      {labels.length > 0 && !menuOpen ? (
        <div className="flex flex-row flex-wrap gap-1.5 border-b border-gray-100 px-3 py-2 dark:border-white/10">
          {labels.map((l) => (
            <span
              key={l}
              className="rounded-full bg-[#8FBC8F]/15 px-2 py-0.5 text-xs font-semibold text-[#8FBC8F]"
            >
              {l}
            </span>
          ))}
        </div>
      ) : null}

      {/* Mark menu dropdown */}
      {menuOpen ? (
        <MarkMenuList
          isFav={isFav}
          hasLabel={labels.length > 0}
          hasMark={hasMark}
          onToggleFav={() => onToggleFav(vk)}
          onOpenLabel={() => {
            setMenuOpen(false)
            onOpenLabelSheet(vk)
          }}
          onOpenMark={() => {
            setMenuOpen(false)
            onOpenMarkSheet(vk)
          }}
          padClass="px-3"
        />
      ) : null}

      {/* Arabic */}
      <div className="px-4 py-5">
        <ArabicText
          verse={verse}
          script={script}
          fontSize={fontSize}
          dark={darkMode}
          onWordPress={onWordPress}
          activeWordKey={activeWordKey}
        />
      </div>

      {/* Translations */}
      {(showEnglish || showIndonesian) && (enTrans || idTrans) ? (
        <div className="gap-3 border-t border-gray-100 px-4 pb-3 pt-3 dark:border-white/10">
          {showEnglish && enTrans ? (
            <div>
              <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {t('verseCard.enSaheeh')}
              </div>
              <div className="text-sm leading-relaxed text-[#2C3E50] dark:text-[#E8E2D6]">
                <TransText html={enTrans.text} onFootnotePress={onFootnotePress} />
              </div>
            </div>
          ) : null}
          {showIndonesian && idTrans ? (
            <div>
              <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {t('verseCard.idKemenag')}
              </div>
              <div className="text-sm leading-relaxed text-[#2C3E50] dark:text-[#E8E2D6]">
                <TransText html={idTrans.text} onFootnotePress={onFootnotePress} />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Tafsir */}
      {showTafsirSection ? (
        <div className="border-t border-gray-100 dark:border-white/10">
          <button
            onClick={() => onToggleTafsir(vk)}
            className="flex w-full flex-row items-center justify-between px-4 py-2.5"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {t('verseCard.tafsir')}
            </span>
            {tafsirOpen ? (
              <ChevronUp color="#9ca3af" size={14} />
            ) : (
              <ChevronDown color="#9ca3af" size={14} />
            )}
          </button>
          {tafsirOpen ? (
            <div className="gap-3 px-4 pb-4">
              {loadingTafsir ? (
                <div className="h-4 w-4 animate-pulse rounded-full bg-[#8FBC8F]/50" />
              ) : null}
              {showEnglishTafsir ? (
                <div>
                  <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {t('verseCard.ibnKathir')}
                  </div>
                  <div className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {enTafsir ? stripHtml(enTafsir) : t('verseCard.noTafsir')}
                  </div>
                </div>
              ) : null}
              {showIndoTafsir ? (
                <div>
                  <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {t('verseCard.tafsirKemenag')}
                  </div>
                  <div className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {indoTafsir ? indoTafsir : t('verseCard.noTafsir')}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export const VerseCard = memo(VerseCardImpl)
