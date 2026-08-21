import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, Volume2 } from 'lucide-react'
import { useDzikirContent } from '@/dzikir/content'
import type { DzikirCategory } from '@/dzikir/types'
import { useI18n } from '@/context/I18nContext'

// Dzikir & Doa (web port): category tabs + Arabic cards with transliteration,
// meaning, and reference (religion-content standard: references always shown).
// Web Speech TTS reads the Arabic (same ar-* voice preference as the RN app).
const CATS: DzikirCategory[] = ['afterPrayer', 'morning', 'evening', 'daily']

export function Dzikir() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const { items } = useDzikirContent()
  const [cat, setCat] = useState<DzikirCategory>('afterPrayer')
  const [speaking, setSpeaking] = useState<string | null>(null)

  const filtered = useMemo(() => items.filter((i) => i.category === cat), [items, cat])

  const speak = (id: string, arabic: string) => {
    if (!('speechSynthesis' in window)) return
    if (speaking === id) {
      window.speechSynthesis.cancel()
      setSpeaking(null)
      return
    }
    const u = new SpeechSynthesisUtterance(arabic)
    const voices = window.speechSynthesis.getVoices()
    const ar = voices.find((v) => v.lang.startsWith('ar'))
    if (ar) u.voice = ar
    u.lang = ar?.lang ?? 'ar-SA'
    u.onend = () => setSpeaking(null)
    u.onerror = () => setSpeaking(null)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
    setSpeaking(id)
  }

  return (
    <div className="min-h-dvh bg-cream dark:bg-night lg:ps-20">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <button
          onClick={() => (history.length > 1 ? navigate(-1) : navigate('/home'))}
          className="rtl-flip flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label="back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 text-center text-sm font-bold text-ink dark:text-cream">
          {t('dzikir.title')}
        </div>
        <span className="w-9" />
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-4 lg:max-w-4xl">
        <p className="mb-4 text-xs text-ink/50 dark:text-cream/50">{t('dzikir.intro')}</p>

        {/* Category tabs */}
        <div className="mb-4 grid grid-cols-4 gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/10">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-lg px-1 py-2 text-[11px] font-semibold ${
                cat === c
                  ? 'bg-white text-ink shadow-sm dark:bg-[#0D1F17] dark:text-cream'
                  : 'text-ink/50 dark:text-cream/50'
              }`}
            >
              {t(`dzikir.cat.${c}`)}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-3 pb-10">
          {filtered.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]"
            >
              {item.title ? (
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-bold text-ink dark:text-cream">{item.title}</div>
                  <button
                    onClick={() => speak(String(i), item.arabic ?? '')}
                    className="flex items-center gap-1 rounded-full bg-[#8FBC8F]/15 px-2.5 py-1 text-[10px] font-semibold text-[#8FBC8F]"
                  >
                    <Volume2 size={11} />
                    {speaking === String(i) ? t('dzikir.listening') : t('dzikir.listen')}
                  </button>
                </div>
              ) : null}
              <div className="quran-rtl mb-3 text-right text-[28px] text-ink dark:text-cream">
                {item.arabic}
              </div>
              {item.latin ? (
                <div className="mb-2 text-xs italic leading-relaxed text-ink/50 dark:text-cream/50">
                  {item.latin}
                </div>
              ) : null}
              <div className="text-xs leading-relaxed text-ink/70 dark:text-cream/70">
                {item.meaning}
              </div>
              {item.reference ? (
                <div className="mt-2 border-t border-gray-100 pt-2 text-[10px] font-semibold text-[#8FBC8F] dark:border-white/10">
                  {lang === 'en' ? 'Ref' : 'Ref'}: {item.reference}
                </div>
              ) : null}
              {typeof item.count === 'string' && item.count !== '1×' ? (
                <div className="mt-1 text-[10px] text-ink/40 dark:text-cream/40">×{item.count}</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
