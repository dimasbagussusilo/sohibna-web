import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ChevronLeft, History, Send } from 'lucide-react'
import { fetchVerseByKey, type Verse } from '@/lib/quran'
import { pickMoodVerse, pickTranslation, type MoodId } from '@/reflection/moods'
import { useReflectionChat } from '@/reflection/useReflectionChat'
import { useI18n } from '@/context/I18nContext'
import { useAuth } from '@/context/AuthContext'
import { useQuranData } from '@/hooks/useQuranData'
import { reflectionDateKey, type ReflectionEntry } from '@/reflection/history'

// Daily Reflection (web port): pick a mood → a mood-specific ayah of the day →
// chat with the AI companion grounded in that verse. Per-day local history.
export function DailyReflection() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pastDate = searchParams.get('date')
  const day = pastDate ?? reflectionDateKey()

  const [mood, setMood] = useState<MoodId>('calm')
  const [verse, setVerse] = useState<Verse | null>(null)
  const [verseLoading, setVerseLoading] = useState(true)
  const [draft, setDraft] = useState('')

  const verseKey = pickMoodVerse(mood, day)

  useEffect(() => {
    let alive = true
    setVerseLoading(true)
    fetchVerseByKey(verseKey)
      .then((v) => alive && setVerse(v))
      .catch(() => {})
      .finally(() => alive && setVerseLoading(false))
    return () => {
      alive = false
    }
  }, [verseKey])

  const versePayload = useMemo(
    () =>
      verse
        ? { key: verseKey, text: verse.text_uthmani ?? '', translation: pickTranslation(verse, lang) }
        : null,
    [verse, verseKey, lang],
  )

  const { messages, send, loading, error } = useReflectionChat({
    mood,
    verse: versePayload,
    date: day,
  })

  const moods: MoodId[] = ['calm', 'sad', 'anxious', 'tired']

  return (
    <div className="flex min-h-dvh flex-col bg-cream dark:bg-night lg:ps-20">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <button
          onClick={() => (history.length > 1 ? navigate(-1) : navigate('/home'))}
          className="rtl-flip flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label="back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 text-center text-sm font-bold text-ink dark:text-cream">
          {t('reflection.title')}
        </div>
        <Link
          to="/reflection-history"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label="history"
        >
          <History size={19} />
        </Link>
      </header>

      {/* Mood selector */}
      <div className="mx-auto w-full max-w-3xl px-4 pt-4">
        {pastDate ? (
          <p className="mb-3 rounded-xl bg-black/5 px-3 py-2 text-center text-[11px] text-ink/50 dark:bg-white/10 dark:text-cream/50">
            {t('reflection.viewingPast')} · {pastDate}
          </p>
        ) : null}
        <div className="mb-4 grid grid-cols-4 gap-2">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`rounded-2xl py-3 text-center text-xs font-semibold ${
                mood === m
                  ? 'bg-[#8FBC8F] text-white'
                  : 'bg-white text-ink shadow-sm dark:bg-[#122A1F] dark:text-cream'
              }`}
            >
              {m === 'calm' ? '🌿' : m === 'sad' ? '💙' : m === 'anxious' ? '🤲' : '🌙'}
              <span className="mt-1 block">{t(`home.mood.${m}`)}</span>
            </button>
          ))}
        </div>

        {/* Verse of the day */}
        <div className="mb-4 rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-[#8FBC8F]">{verseKey}</span>
            <Link
              to={`/surah/${verseKey.split(':')[0]}?v=${encodeURIComponent(verseKey)}`}
              className="text-[10px] text-[#8FBC8F] underline"
            >
              {t('quranHome.continueReading')}
            </Link>
          </div>
          {verseLoading ? (
            <div className="h-16 animate-pulse rounded-xl bg-black/5 dark:bg-white/10" />
          ) : (
            <>
              <div className="quran-rtl mb-2 text-right text-[30px] text-ink dark:text-cream">
                {verse?.text_uthmani ?? '—'}
              </div>
              <div className="text-xs leading-relaxed text-ink/60 dark:text-cream/60">
                {verse ? pickTranslation(verse, lang) : ''}
              </div>
            </>
          )}
        </div>

        <p className="mb-3 text-center text-[10px] text-ink/40 dark:text-cream/40">
          {t('reflection.dailyNote')}
        </p>
      </div>

      {/* Chat */}
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-3 overflow-y-auto px-4 pb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'ms-auto bg-[#8FBC8F] text-white'
                : 'me-auto bg-white text-ink shadow-sm dark:bg-[#122A1F] dark:text-cream'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading ? (
          <div className="me-auto max-w-[85%] rounded-2xl bg-white px-4 py-2.5 shadow-sm dark:bg-[#122A1F]">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-ink/20 dark:bg-cream/20" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-ink/20 [animation-delay:150ms] dark:bg-cream/20" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-ink/20 [animation-delay:300ms] dark:bg-cream/20" />
            </div>
          </div>
        ) : null}
        {error ? (
          <p className="py-2 text-center text-xs text-red-400">
            {error.includes('not configured') || error.includes('503')
              ? t('reflection.companionUnavailable')
              : error}
          </p>
        ) : null}

        {/* Suggestion chips (first turn only) */}
        {messages.length <= 1 && !pastDate ? (
          <div className="flex flex-wrap justify-end gap-2">
            {(dictChips(mood) as string[]).slice(0, 2).map((chip) => (
              <button
                key={chip}
                onClick={() => void send(chip)}
                className="rounded-full border border-[#8FBC8F]/40 px-3 py-1.5 text-[11px] text-[#8FBC8F]"
              >
                {chip}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Composer */}
      {!pastDate ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void send(draft)
            setDraft('')
          }}
          className="sticky bottom-0 border-t border-black/5 bg-cream px-4 py-3 dark:border-white/10 dark:bg-night"
        >
          <div className="mx-auto flex max-w-3xl gap-2 lg:max-w-4xl">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('reflection.inputPlaceholder')}
              className="flex-1 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#122A1F] dark:text-cream"
            />
            <button
              type="submit"
              disabled={loading || !draft.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8FBC8F] text-white disabled:opacity-40"
              aria-label="send"
            >
              <Send size={17} className="rtl-flip" />
            </button>
          </div>
        </form>
      ) : null}
    </div>
  )
}

// The suggestion chips are ARRAYS in the dictionary — t() only resolves string
// leaves, so read them from the raw dict for the active language.
function dictChips(mood: MoodId): unknown {
  const { dict } = useI18n()
  const chips = (dict as unknown as { reflection: { chips: Record<string, unknown> } }).reflection
    .chips[mood]
  return Array.isArray(chips) ? chips : []
}

// Reflection history: local entries ∪ synced entries (authed), newer
// updatedAt wins per 'date:mood'; tap to reopen read-only.
export function ReflectionHistory() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { ud } = useQuranData()
  const [entries, setEntries] = useState<ReflectionEntry[] | null>(null)

  const remote = user ? ud.reflections : null
  useEffect(() => {
    import('@/reflection/history').then(async ({ listReflections, mergeReflectionLists }) => {
      const local = await listReflections()
      const merged = mergeReflectionLists(local, remote ? Object.values(remote) : []).sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1
        return (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
      })
      setEntries(merged)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote])

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
          {t('home.reflectionHistory')}
        </div>
        <span className="w-9" />
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-4 lg:max-w-4xl">
        {entries === null ? (
          <p className="py-10 text-center text-xs text-ink/40 dark:text-cream/40">…</p>
        ) : entries.length ? (
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-[#122A1F]">
            {entries.map((e, i) => (
              <button
                key={`${e.date}-${e.mood}`}
                onClick={() => navigate(`/daily-reflection?date=${e.date}`)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-start ${
                  i > 0 ? 'border-t border-gray-100 dark:border-white/10' : ''
                }`}
              >
                <span className="text-xl">
                  {e.mood === 'calm' ? '🌿' : e.mood === 'sad' ? '💙' : e.mood === 'anxious' ? '🤲' : '🌙'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink dark:text-cream">
                    {new Date(e.updatedAt).toLocaleDateString(lang === 'ar' ? 'ar' : lang, {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span className="block text-[11px] text-ink/50 dark:text-cream/50">
                    {/* Synced entries carry mood: string — narrow for the typed key. */}
                    {t(`home.mood.${(['calm', 'sad', 'anxious', 'tired'] as const).includes(e.mood as MoodId) ? e.mood : 'calm'}` as never)}{' '}
                    · {e.verseKey}
                  </span>
                </span>
                <ChevronLeft size={14} className="rtl-flip rotate-180 text-ink/30 dark:text-cream/30" />
              </button>
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-xs text-ink/40 dark:text-cream/40">—</p>
        )}
      </div>
    </div>
  )
}
