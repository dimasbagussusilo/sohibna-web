import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, Volume2 } from 'lucide-react'
import { VOLUMES, V1_FAMILIES, V2_WORDS } from '@/iqro/data'
import { resolve } from '@/dzikir/content'
import type { Lang } from '@/i18n/types'
import { useI18n } from '@/context/I18nContext'

// Iqro (web port, P2 subset): the hijaiyah curriculum — Volume 1 (letters by
// makhraj family) and Volume 2 (letter joining). Each letter/word speaks via
// Web Speech. Volumes 3–5 (harakat/tajwid rules) render as text sections from
// the same datasets.
export function Iqro() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [vol, setVol] = useState(1)
  const [speaking, setSpeaking] = useState<string | null>(null)

  const speak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return
    if (speaking === id) {
      window.speechSynthesis.cancel()
      setSpeaking(null)
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices()
    const v = voices.find((x) => x.lang.startsWith('ar'))
    if (v) u.voice = v
    u.lang = v?.lang ?? 'ar-SA'
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
          {t('home.learnQuran')}
        </div>
        <span className="w-9" />
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-4 lg:max-w-4xl">
        {/* Volume selector */}
        <div className="mb-4 flex flex-wrap gap-2">
          {VOLUMES.filter((v) => !v.disabled).map((v) => (
            <button
              key={v.id}
              onClick={() => setVol(v.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                vol === v.id
                  ? 'bg-[#8FBC8F] text-white'
                  : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
              }`}
            >
              {volLabel(v.id, lang)}
            </button>
          ))}
        </div>

        {/* Volume 1: letters by family */}
        {vol === 1 ? (
          <div className="space-y-4 pb-10">
            {resolve(V1_FAMILIES, lang as Lang).map((fam) => (
              <div key={fam.groupName} className="rounded-3xl bg-white p-4 shadow-sm dark:bg-[#122A1F]">
                <div className="mb-3 text-sm font-bold text-ink dark:text-cream">
                  {fam.groupName}
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {fam.letters.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => speak(l.id, l.arab)}
                      className={`flex flex-col items-center rounded-2xl py-3 ${
                        speaking === l.id
                          ? 'bg-[#8FBC8F]/20'
                          : 'bg-black/[0.03] dark:bg-white/5'
                      }`}
                    >
                      <span className="quran-rtl text-[40px] leading-tight text-ink dark:text-cream">
                        {l.arab}
                      </span>
                      <span className="mt-1 text-[10px] text-ink/50 dark:text-cream/50">
                        {l.name}
                      </span>
                      <Volume2 size={10} className="mt-1 text-[#8FBC8F]" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Volume 2: joining */}
        {vol === 2 ? (
          <div className="grid grid-cols-2 gap-2 pb-10 sm:grid-cols-4">
            {resolve(V2_WORDS, lang as Lang).map((w) => (
              <button
                key={w.id}
                onClick={() => speak(w.id, w.connectedText)}
                className={`flex flex-col items-center rounded-2xl bg-white py-4 shadow-sm dark:bg-[#122A1F] ${
                  speaking === w.id ? 'ring-2 ring-[#8FBC8F]' : ''
                }`}
              >
                <span className="text-[10px] text-ink/50 dark:text-cream/50">{w.label}</span>
                <span className="mt-1.5 flex gap-1.5 text-base text-ink/60 dark:text-cream/60">
                  {w.letters.map((l: { isolated: string }, i: number) => (
                    <span key={i} className="quran-rtl">
                      {l.isolated}
                    </span>
                  ))}
                </span>
                <span className="quran-rtl mt-1 text-[28px] text-ink dark:text-cream">
                  {w.connectedText}
                </span>
                <Volume2 size={11} className="mt-1.5 text-[#8FBC8F]" />
              </button>
            ))}
          </div>
        ) : null}

        {/* Volumes 3-5: rule reference cards */}
        {vol >= 3 ? (
          <RulesVolume vol={vol} speak={speak} speaking={speaking} />
        ) : null}
      </div>
    </div>
  )
}

function RulesVolume({
  vol,
  speak,
  speaking,
}: {
  vol: number
  speak: (id: string, text: string) => void
  speaking: string | null
}) {
  // Lazy-import to keep the bundle lean
  const [rules, setRules] = useState<{ id: string; arab: string; name: string; desc: unknown; example?: unknown }[]>([])
  useState(() => {
    import('@/iqro/data').then((m) => {
      const set =
        vol === 3 ? m.V3_RULES : vol === 4 ? m.V4_RULES : m.HARAKAT_SIGNS
      setRules(set as never)
    })
  })

  if (!rules.length) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-6 w-6 animate-pulse rounded-full bg-sage/40" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 pb-10 sm:grid-cols-3">
      {rules.map((r) => (
        <button
          key={r.id}
          onClick={() => speak(r.id, r.arab)}
          className={`flex flex-col items-center rounded-2xl bg-white py-4 shadow-sm dark:bg-[#122A1F] ${
            speaking === r.id ? 'ring-2 ring-[#8FBC8F]' : ''
          }`}
        >
          <span className="quran-rtl text-[32px] leading-snug text-ink dark:text-cream">{r.arab}</span>
          <span className="mt-1 text-[11px] font-semibold text-ink/70 dark:text-cream/70">
            {r.name}
          </span>
          <Volume2 size={10} className="mt-1 text-[#8FBC8F]" />
        </button>
      ))}
    </div>
  )
}

// Volume tab labels (the data only carries ids).
function volLabel(id: number, lang: Lang): string {
  const names: Record<number, { id: string; en: string }> = {
    1: { id: '1 · Huruf', en: '1 · Letters' },
    2: { id: '2 · Sambung', en: '2 · Joining' },
    3: { id: '3 · Harakat', en: '3 · Vowels' },
    4: { id: '4 · Tajwid', en: '4 · Tajwid' },
    5: { id: '5 · Tanda', en: '5 · Signs' },
    6: { id: '6 · Panjang', en: '6 · Long' },
    7: { id: '7 · Hamzah', en: '7 · Hamzah' },
  }
  return lang === 'en' ? (names[id]?.en ?? String(id)) : (names[id]?.id ?? String(id))
}
