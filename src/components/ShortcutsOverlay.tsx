import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { useHotkeys } from '@/hooks/useHotkeys'
import type { Lang } from '@/i18n/types'

// Global desktop shortcuts (see useHotkeys for the dispatcher mechanics):
//   /        → Quran search
//   g h/c/q/r/m → jump to Home/Calendar/Quran/Rulings/Me
//   ?        → this cheat sheet
//   d        → toggle dark mode
//   l        → cycle UI language
// Reader-local shortcuts (j/k/p/[/]/f/s/Esc) live in the reader.
export function GlobalHotkeys() {
  const navigate = useNavigate()
  const { setDarkMode, darkMode } = useApp()
  const { lang, setLang } = useI18n()
  const [showSheet, setShowSheet] = useState(false)

  const cycleLang = () => {
    const order: Lang[] = ['id', 'en', 'ar']
    setLang(order[(order.indexOf(lang) + 1) % order.length])
  }

  useHotkeys([
    { keys: '/', handler: () => navigate('/quran-search') },
    { keys: 'g h', handler: () => navigate('/home') },
    { keys: 'g c', handler: () => navigate('/calendar') },
    { keys: 'g q', handler: () => navigate('/quran') },
    { keys: 'g r', handler: () => navigate('/rulings') },
    { keys: 'g m', handler: () => navigate('/me') },
    { keys: '?', handler: () => setShowSheet(true) },
    { keys: 'd', handler: () => setDarkMode(!darkMode) },
    { keys: 'l', handler: cycleLang },
    { keys: 'Escape', handler: () => setShowSheet(false) },
  ])

  // Close the sheet on route change.
  useEffect(() => setShowSheet(false), [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return showSheet ? <ShortcutsSheet onClose={() => setShowSheet(false)} /> : null
}

// Row labels are i18n keys (shortcuts.*); the kbd combinations are literal.
const GROUP_KEYS: [kbd: string, labelKey: string][][] = [
  [
    ['/', 'shortcuts.searchQuran'],
    ['g h / c / q / r / m', 'shortcuts.goNav'],
    ['d', 'shortcuts.darkMode'],
    ['l', 'shortcuts.language'],
    ['?', 'shortcuts.sheet'],
    ['Esc', 'shortcuts.close'],
  ],
  [
    ['j / k', 'shortcuts.nextPrevVerse'],
    ['p', 'shortcuts.playPause'],
    ['[ / ]', 'shortcuts.nextPrevAudio'],
    ['f', 'shortcuts.favoriteVerse'],
    ['s', 'shortcuts.readerSettings'],
    ['a', 'shortcuts.audioSettings'],
  ],
]

export function ShortcutsSheet({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-[#122A1F]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-bold text-ink dark:text-cream">
            ⌨️ {t('shortcuts.title')}
          </span>
          <button onClick={onClose} className="text-ink/40 dark:text-cream/40">✕</button>
        </div>
        {[
          { title: t('shortcuts.global'), rows: GROUP_KEYS[0] },
          { title: t('shortcuts.reader'), rows: GROUP_KEYS[1] },
        ].map((g) => (
          <div key={g.title} className="mb-4">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-cream/40">
              {g.title}
            </div>
            <div className="space-y-1.5">
              {g.rows.map(([k, labelKey]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <kbd className="rounded-md border border-gray-200 bg-black/5 px-2 py-0.5 font-mono text-[11px] text-ink dark:border-white/10 dark:bg-white/10 dark:text-cream">
                    {k}
                  </kbd>
                  <span className="text-xs text-ink/70 dark:text-cream/70">{t(labelKey)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
