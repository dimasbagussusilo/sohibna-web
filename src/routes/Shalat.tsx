import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, Volume2 } from 'lucide-react'
import {
  FARD_PRAYERS,
  MAZHAB_INFO,
  MAZHAB_TOPICS,
  RUKUN_STEPS,
  WUDHU,
  WUDHU_NIAT,
} from '@/shalat/data'
import { MAZHABS, type ArabicItem, type Bi, type Body, type Lang, type Mazhab } from '@/shalat/types'
import { useI18n } from '@/context/I18nContext'

// Shalat (web port): the rukun/movement flow (mazhab-aware variants), the
// five fard prayers with their niyyah, the wudhu guide, and the mazhab
// comparison. Recitations carry references; school differences are shown
// honestly as differences (religion-content standards).

// Bi resolver (same deep-resolve as the RN app's shalat/content.ts, applied
// per-object since our render walks typed nodes).
const bi = (v: Bi | undefined, lang: Lang): string =>
  v ? (lang === 'en' ? v.en : v.id) : ''
const ar = (v: ArabicItem | undefined, lang: Lang) => {
  if (!v) return null
  return {
    arabic: v.arabic as string,
    latin: v.latin as string | undefined,
    meaning: v.meaning ? bi(v.meaning, lang) : undefined,
    reference: v.reference ? bi(v.reference, lang) : undefined,
  }
}

type Section = 'pillars' | 'wudhu' | 'mazhab'

export function Shalat() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [section, setSection] = useState<Section>('pillars')
  const [mazhab, setMazhab] = useState<Mazhab>('shafii')
  const [prayerIdx, setPrayerIdx] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [speaking, setSpeaking] = useState<string | null>(null)

  // The Body for a step under the active mazhab (variant → shared fallback).
  const stepBody = (s: (typeof RUKUN_STEPS)[number]): Body | undefined =>
    s.variants?.[mazhab] ?? s.shared

  const prayer = FARD_PRAYERS[prayerIdx]
  const step = RUKUN_STEPS[Math.min(stepIdx, RUKUN_STEPS.length - 1)]
  const body = step ? stepBody(step) : undefined
  const recitation = body ? ar(body as ArabicItem, lang) : null

  const speak = (id: string, arabic: string | undefined) => {
    if (!arabic || !('speechSynthesis' in window)) return
    if (speaking === id) {
      window.speechSynthesis.cancel()
      setSpeaking(null)
      return
    }
    const u = new SpeechSynthesisUtterance(arabic)
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

  const mazhabInfo = MAZHAB_INFO[mazhab]

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
          {t('home.learnPrayer')}
        </div>
        <span className="w-9" />
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-4 lg:max-w-4xl">
        {/* Section tabs */}
        <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/10">
          {(
            [
              ['pillars', lang === 'id' ? 'Rukun & Bacaan' : 'Pillars'],
              ['wudhu', lang === 'id' ? 'Wudhu' : 'Ablution'],
              ['mazhab', lang === 'id' ? 'Perbandingan' : 'Schools'],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setSection(k)}
              className={`rounded-lg py-2 text-xs font-semibold ${
                section === k
                  ? 'bg-white text-ink shadow-sm dark:bg-[#0D1F17] dark:text-cream'
                  : 'text-ink/50 dark:text-cream/50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Mazhab picker */}
        {section !== 'wudhu' ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {MAZHABS.map((m) => (
              <button
                key={m}
                onClick={() => setMazhab(m)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${
                  mazhab === m
                    ? 'bg-[#8FBC8F] text-white'
                    : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
                }`}
              >
                {m}
              </button>
            ))}
            <span className="self-center text-[10px] text-ink/40 dark:text-cream/40">
              {bi(mazhabInfo?.regions, lang)}
            </span>
          </div>
        ) : null}

        {/* Pillars */}
        {section === 'pillars' && body ? (
          <div>
            {/* Prayer selector */}
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-[#122A1F]">
              <button
                onClick={() => {
                  setPrayerIdx((i) => Math.max(0, i - 1))
                }}
                disabled={prayerIdx === 0}
                className="rtl-flip text-ink/40 disabled:opacity-30 dark:text-cream/40"
                aria-label="prev prayer"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-center">
                <div className="text-sm font-bold text-ink dark:text-cream">
                  {bi(prayer.title, lang)}
                </div>
                <div className="text-[11px] text-ink/50 dark:text-cream/50">
                  {prayer.rakaat} {lang === 'id' ? 'rakaat' : 'rakah'}
                </div>
              </div>
              <button
                onClick={() => setPrayerIdx((i) => Math.min(FARD_PRAYERS.length - 1, i + 1))}
                disabled={prayerIdx === FARD_PRAYERS.length - 1}
                className="rtl-flip rotate-180 text-ink/40 disabled:opacity-30 dark:text-cream/40"
                aria-label="next prayer"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            {/* Niat */}
            {prayer.niat ? <RecitationCard item={ar(prayer.niat, lang)!} idPrefix="niat" speak={speak} speaking={speaking} t={t} /> : null}

            {/* Step card */}
            <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]">
              <div className="mb-1 font-mono text-[10px] text-[#8FBC8F]">
                {stepIdx + 1} / {RUKUN_STEPS.length}
                {step.variants ? ` · ${mazhab}` : ''}
              </div>
              <div className="mb-2 text-sm font-bold text-ink dark:text-cream">
                {bi(body.title, lang)}
              </div>
              {body.desc ? (
                <p className="mb-3 text-xs leading-relaxed text-ink/60 dark:text-cream/60">
                  {bi(body.desc, lang)}
                </p>
              ) : null}
              {body.arabic ? (
                <RecitationCard
                  item={recitation!}
                  idPrefix={`step-${step.id}`}
                  speak={speak}
                  speaking={speaking}
                  t={t}
                  embedded
                />
              ) : null}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                  disabled={stepIdx === 0}
                  className="flex-1 rounded-xl bg-black/5 py-2.5 text-xs font-semibold text-ink disabled:opacity-30 dark:bg-white/10 dark:text-cream"
                >
                  ‹ {t('reader.prev')}
                </button>
                <button
                  onClick={() => setStepIdx((i) => Math.min(RUKUN_STEPS.length - 1, i + 1))}
                  disabled={stepIdx >= RUKUN_STEPS.length - 1}
                  className="flex-1 rounded-xl bg-[#8FBC8F] py-2.5 text-xs font-bold text-white disabled:opacity-30"
                >
                  {t('reader.next')} ›
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Wudhu */}
        {section === 'wudhu' ? (
          <div className="space-y-3 pb-10">
            <RecitationCard
              item={ar(WUDHU_NIAT, lang)!}
              idPrefix="wudhu-niat"
              speak={speak}
              speaking={speaking}
              t={t}
            />
            {WUDHU.map((s, i) => (
              <div
                key={s.id}
                className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-[#122A1F]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8FBC8F]/15 text-xs font-bold text-[#8FBC8F]">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink dark:text-cream">
                    {bi(s.title, lang)}
                  </div>
                  {s.desc ? (
                    <div className="text-xs text-ink/60 dark:text-cream/60">{bi(s.desc, lang)}</div>
                  ) : null}
                  {s.arabic ? (
                    <div className="quran-rtl mt-1 text-right text-xl text-ink dark:text-cream">
                      {s.arabic}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Mazhab comparison */}
        {section === 'mazhab' ? (
          <div className="space-y-3 pb-10">
            {MAZHAB_TOPICS.map((topic) => (
              <div key={topic.id} className="rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]">
                <div className="text-sm font-bold text-ink dark:text-cream">
                  {bi(topic.title, lang)}
                </div>
                {topic.summary ? (
                  <p className="mt-0.5 text-xs italic text-ink/50 dark:text-cream/50">
                    {bi(topic.summary, lang)}
                  </p>
                ) : null}
                <div className="mt-3 space-y-1.5">
                  {(MAZHABS as Mazhab[]).filter((m: Mazhab) => topic.views[m]).map((m: Mazhab) => (
                    <button
                      key={m}
                      onClick={() => setMazhab(m)}
                      className="flex w-full items-start gap-2 rounded-xl px-2 py-1.5 text-start hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <span
                        className={`mt-0.5 w-14 shrink-0 text-[10px] font-bold capitalize ${
                          mazhab === m ? 'text-[#8FBC8F]' : 'text-ink/40 dark:text-cream/40'
                        }`}
                      >
                        {m}
                      </span>
                      <span className="flex-1 text-xs leading-relaxed text-ink/75 dark:text-cream/75">
                        {bi(topic.views[m], lang)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function RecitationCard({
  item,
  idPrefix,
  speak,
  speaking,
  t,
  embedded,
}: {
  item: { arabic: string; latin?: string; meaning?: string; reference?: string; title?: string }
  idPrefix: string
  speak: (id: string, arabic: string | undefined) => void
  speaking: string | null
  t: ReturnType<typeof useI18n>['t']
  embedded?: boolean
}) {
  return (
    <div
      className={
        embedded
          ? 'rounded-2xl bg-black/[0.03] p-4 dark:bg-white/5'
          : 'mb-3 rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]'
      }
    >
      {item.title ? (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8FBC8F]">
            {item.title}
          </span>
          <button
            onClick={() => speak(idPrefix, item.arabic)}
            className="flex items-center gap-1 text-[10px] font-semibold text-[#8FBC8F]"
          >
            <Volume2 size={11} />
            {speaking === idPrefix ? t('dzikir.listening') : t('dzikir.listen')}
          </button>
        </div>
      ) : null}
      <div className="quran-rtl mb-2 text-right text-[28px] text-ink dark:text-cream">
        {item.arabic}
      </div>
      {item.latin ? (
        <div className="mb-2 text-xs italic text-ink/50 dark:text-cream/50">{item.latin}</div>
      ) : null}
      {item.meaning ? (
        <div className="text-xs leading-relaxed text-ink/70 dark:text-cream/70">{item.meaning}</div>
      ) : null}
      {item.reference ? (
        <div className="mt-2 text-[10px] font-semibold text-[#8FBC8F]">{item.reference}</div>
      ) : null}
    </div>
  )
}
