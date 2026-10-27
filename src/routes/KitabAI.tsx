import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Sparkles, ChevronRight, MessageCircle, BookOpen, Info } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useAuth } from '@/context/AuthContext'
import { useQuranData } from '@/context/QuranDataContext'
import {
  mergeRulingsChatLists,
  mergeRulingsThreads,
  listRulingsChats,
  listRulingsDrafts,
  type RulingsChatEntry,
} from '@/rulings/history'
import { sameScope, scopeFromEntry, quranScope, type RulingsRefScope } from '@/rulings/scope'
import { useRulingsSources, groupByCategory } from '@/rulings/sources'
import { ChatScreen } from '@/routes/Rulings'
import type { RulingsSourceGroup } from '@/api'
import { accentColor } from '@/components/kitab/palette'
import { KitabDetailSheet } from '@/components/kitab/KitabDetailSheet'

// Kitab AI — chat with ONE chosen reference (NotebookLM-style). Holds the kitab
// catalog list (search + category shelves, "Referensi Terkenal" first) that
// previously lived on the Al-Islam page; tapping a reference opens the scoped
// chat. Reached from the Home quick links and the Al-Islam entry card; the
// message history (saved + temporary threads) lives on the Al-Islam page.
export function KitabAI() {
  const { t } = useI18n()
  const { user } = useAuth()
  const { ud } = useQuranData()
  const { catalog, loading: loadingRefs, error: refsError, retry: retryRefs } = useRulingsSources()

  // Current chat session + its reference scope (null = general chat)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [activeScope, setActiveScope] = useState<RulingsRefScope | null>(null)

  const [query, setQuery] = useState('')
  // Catalogue detail sheet: the tapped series (null = closed). Chat actions
  // inside the sheet route back through openReference.
  const [selected, setSelected] = useState<RulingsSourceGroup | null>(null)

  // Saved sessions power the continue-thread behavior: tapping a reference
  // reopens the most recent chat with the same scope.
  const [localChats, setLocalChats] = useState<RulingsChatEntry[]>([])
  const [drafts, setDrafts] = useState<RulingsChatEntry[]>([])
  useEffect(() => {
    listRulingsChats().then(setLocalChats).catch(() => {})
    listRulingsDrafts().then(setDrafts).catch(() => {})
  }, [])

  const chatSessions = useMemo(() => {
    return mergeRulingsChatLists(localChats, Object.values(ud.rulingsChats || {}))
  }, [localChats, ud.rulingsChats])

  // Re-tapping a reference continues the most recent SAME-SCOPE thread —
  // saved or temporary (the message history itself lives on the Al-Islam page).
  const threads = useMemo(
    () => mergeRulingsThreads(drafts, chatSessions),
    [drafts, chatSessions],
  )

  if (activeChatId) {
    return (
      <ChatScreen
        chatId={activeChatId}
        scope={activeScope}
        onClose={() => {
          setActiveChatId(null)
          setActiveScope(null)
        }}
      />
    )
  }

  const openReference = (scope: RulingsRefScope) => {
    const existing = threads.find((s) => sameScope(scopeFromEntry(s), scope))
    setActiveScope(scope)
    setActiveChatId(existing?.id ?? crypto.randomUUID())
  }

  const q = query.trim().toLowerCase()
  const searching = q.length > 0

  const sections = (catalog ? groupByCategory(catalog) : []).map(({ key, series }) => ({
    key,
    items: series
      .map((s) => {
        const hay = `${s.title} ${s.author ?? ''}`.toLowerCase()
        return {
          group: s,
          titleMatch: hay.includes(q),
          parts: s.parts.filter((p) => hay.includes(q) || p.label.toLowerCase().includes(q)),
        }
      })
      .filter((s) => s.titleMatch || s.parts.length > 0),
  })).filter((sec) => sec.items.length > 0)

  const quranVisible = !searching || t('rulings.quranEntry').toLowerCase().includes(q) || 'quran'.includes(q)
  const hasMatches = quranVisible || sections.length > 0

  const catLabels: Record<string, string> = {
    famous: t('rulings.refCat.famous'),
    tafsir: t('rulings.refCat.tafsir'),
    hadits_syarah: t('rulings.refCat.hadits_syarah'),
    fiqh: t('rulings.refCat.fiqh'),
    sirah_sejarah: t('rulings.refCat.sirah_sejarah'),
    fikrah_ruhiyah: t('rulings.refCat.fikrah_ruhiyah'),
    sistem_hukum: t('rulings.refCat.sistem_hukum'),
    khilafah_politik: t('rulings.refCat.khilafah_politik'),
    dakwah_gerakan: t('rulings.refCat.dakwah_gerakan'),
    pendidikan: t('rulings.refCat.pendidikan'),
    lainnya: t('rulings.refCat.lainnya'),
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-5 lg:max-w-4xl xl:max-w-5xl pb-24">
      <div className="mb-1 flex items-center gap-2 text-lg font-bold text-ink dark:text-cream">
        <BookOpen size={18} className="text-[#8FBC8F]" />
        {t('home.kitabAi')}
      </div>
      <p className="mb-4 text-xs text-ink/50 dark:text-cream/50">{t('home.kitabAiDesc')}</p>

      {/* Feature explainer — this catalog is a grounded-chat picker
          (NotebookLM-style); make the "answered from the kitab itself"
          context explicit before the first tap. */}
      <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/10 px-4 py-3">
        <Info size={15} className="mt-0.5 shrink-0 text-[#8FBC8F]" />
        <p className="flex-1 text-[11px] leading-relaxed text-ink/70 dark:text-cream/70">
          {t('rulings.kitabAiIntro')}
        </p>
      </div>

      {/* Guest notice — saving chats requires an account */}
      {!user ? (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/10 px-4 py-3">
          <span className="flex-1 text-xs text-ink/70 dark:text-cream/70">{t('rulings.guestSaveHint')}</span>
          <Link to="/login" className="shrink-0 text-xs font-bold text-[#8FBC8F]">
            {t('quranHome.guestLogin')}
          </Link>
        </div>
      ) : null}

      {/* Search */}
      <div className="mb-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm dark:bg-[#122A1F]">
        <Sparkles size={15} className="shrink-0 text-ink/30 dark:text-cream/30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('rulings.searchReferences')}
          className="w-full flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/30 dark:text-cream dark:placeholder:text-cream/30"
        />
      </div>

      {loadingRefs ? (
        <div className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink/40 shadow-sm dark:bg-[#122A1F] dark:text-cream/40">
          …
        </div>
      ) : refsError ? (
        <div className="rounded-xl bg-white px-4 py-6 text-center shadow-sm dark:bg-[#122A1F]">
          <p className="mb-3 text-xs text-ink/50 dark:text-cream/50">{t('rulings.loadRefsError')}</p>
          <button
            onClick={retryRefs}
            className="rounded-full bg-[#8FBC8F]/15 px-4 py-1.5 text-xs font-bold text-[#8FBC8F]"
          >
            {t('rulings.retryRefs')}
          </button>
        </div>
      ) : !hasMatches ? (
        <div className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink/40 shadow-sm dark:bg-[#122A1F] dark:text-cream/40">
          {t('rulings.noReferences')}
        </div>
      ) : (
        <div className="mb-6">
          {/* Al-Qur'an — pinned card, one entry scoping all surah rows */}
          {quranVisible && (
            <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-[#122A1F]">
              <button
                onClick={() => openReference(quranScope(catalog?.quran.title ?? "Al-Qur'an"))}
                className="flex w-full items-center gap-3 px-4 py-3 text-start"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8FBC8F]/15">
                  <BookOpen size={16} className="text-[#8FBC8F]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink dark:text-cream">
                    {t('rulings.quranEntry')}
                  </span>
                  <span className="block text-[11px] text-ink/50 dark:text-cream/50">
                    {t('rulings.partsCount', { count: catalog?.quran.parts.length ?? 0 })}
                  </span>
                </span>
                <MessageCircle size={16} className="shrink-0 text-[#8FBC8F]" />
              </button>
            </div>
          )}

          {sections.map((sec) => (
            <div key={sec.key || 'all'} className="mb-5">
              {sec.key !== '' && (
                <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-ink/40 dark:text-cream/40">
                  {catLabels[sec.key] ?? sec.key}
                </h4>
              )}
              {/* Compact text list: one grouped card per shelf, one row per
                  kitab (title + author · wafat), stable color spine; tap →
                  detail sheet */}
              <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-[#122A1F]">
                {sec.items.map(({ group }) => (
                  <button
                    key={group.title}
                    onClick={() => setSelected(group)}
                    className="flex w-full items-center gap-3 border-b border-black/5 px-4 py-3 text-start transition-colors last:border-b-0 hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/[0.03]"
                  >
                    <span
                      className="h-9 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: accentColor(group.title, group.category) }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink dark:text-cream">
                        {group.title}
                      </span>
                      <span className="block truncate text-[11px] text-ink/50 dark:text-cream/50">
                        {group.author ?? '—'}
                        {group.author && group.died ? ` · ${group.died}` : ''}
                      </span>
                    </span>
                    <ChevronRight size={16} className="shrink-0 text-ink/30 rtl-flip dark:text-cream/30" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        to="/rulings"
        className="flex items-center gap-2 text-xs font-bold text-[#8FBC8F] rtl-flip"
      >
        <ChevronRight size={14} className="rotate-180 rtl-flip" />
        {t('rulings.title')}
      </Link>

      {selected && (
        <KitabDetailSheet
          group={selected}
          categoryLabel={catLabels[selected.category ?? ''] ?? ''}
          onClose={() => setSelected(null)}
          onChat={(scope) => {
            setSelected(null)
            openReference(scope)
          }}
        />
      )}
    </div>
  )
}
