// Kitab detail sheet — the "movie poster back cover": large cover, author,
// era, trilingual synopsis (locale-picked), volume list with per-volume chat,
// and the whole-series chat CTA. Chat actions call back into KitabAI's
// openReference so the same-scope thread reuse keeps working.
import { MessageCircle } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { Sheet } from '@/components/quran/AudioSettingsSheet'
import type { RulingsRefScope } from '@/rulings/scope'
import type { RulingsSourceGroup } from '@/api'
import { accentColor } from '@/components/kitab/palette'

// Locale pick with fallback: prefer the reader's language, fall back to the
// other two so an unbackfilled language never shows an empty block.
function synopsisFor(
  group: RulingsSourceGroup,
  lang: string,
): string {
  const { synopsisId = '', synopsisEn = '', synopsisAr = '' } = group
  if (lang === 'ar') return synopsisAr || synopsisEn || synopsisId
  if (lang === 'id') return synopsisId || synopsisEn || synopsisAr
  return synopsisEn || synopsisId || synopsisAr
}

export function KitabDetailSheet({
  group,
  categoryLabel,
  onClose,
  onChat,
}: {
  group: RulingsSourceGroup;
  categoryLabel: string;
  onClose: () => void;
  onChat: (scope: RulingsRefScope) => void;
}) {
  const { t, lang } = useI18n()
  const synopsis = synopsisFor(group, lang)

  return (
    <Sheet title="" onClose={onClose}>
      {/* Text hero — informative by design: title, author (Latin + Arabic),
          wafat, and the shelf chip with the series' stable accent dot. */}
      <div className="mb-5">
        <div className="text-xl font-bold leading-snug text-ink dark:text-cream">{group.title}</div>
        {group.author && (
          <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[13px] font-semibold text-ink dark:text-cream">{group.author}</span>
            {group.died && (
              <span className="text-[11px] text-ink/50 dark:text-cream/50">
                {t('rulings.died')} {group.died}
              </span>
            )}
          </div>
        )}
        {group.authorAr && (
          <div dir="rtl" className="mt-0.5 text-[13px] text-ink/60 dark:text-cream/60">
            {group.authorAr}
          </div>
        )}
        {categoryLabel && (
          <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#8FBC8F]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#8FBC8F]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accentColor(group.title, group.category) }}
            />
            {categoryLabel}
          </span>
        )}
      </div>

      {/* Synopsis */}
      <div className="mb-4">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-cream/40">
          {t('rulings.synopsis')}
        </div>
        <p className="text-[13px] leading-relaxed text-ink/80 dark:text-cream/80">
          {synopsis || t('rulings.noSynopsis')}
        </p>
      </div>
      {/* Volume list deliberately hidden: a kitab presents as ONE work —
          jilid/bagian bookkeeping stays server-side (the CTA still scopes the
          chat to every part of the series). */}

      {/* Whole-series CTA — the single chat entry point for this kitab */}
      <button
        onClick={() =>
          onChat({
            sources: group.parts.map((p) => p.name),
            quran: false,
            refTitle: group.title,
          })
        }
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8FBC8F] py-2.5 text-xs font-bold text-white"
      >
        <MessageCircle size={14} />
        {t('rulings.chatWithKitab')}
      </button>
    </Sheet>
  )
}
