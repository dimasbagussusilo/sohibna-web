import { useEffect, useRef } from 'react';
import type { ContentLang } from '@/i18n/contentLang';
import type { DisplayMode, UserData } from '@/lib/quran';

// useQuranContentLang — "content follows the app language, with a session override".
// (Port of the RN app's hook, widened for the Turkish + Urdu content arms.)
//
// The Quran content (translation + tafsir) defaults to the app language:
//   English    → Saheeh International (trans) + Ibn Kathir (tafsir)
//   Indonesian → Kemenag (trans) + Kemenag (tafsir)
//   Turkish    → Diyanet İşleri (trans) + İbn Kesir Türkçe (tafsir — machine-
//                translated 9334; the EN tafsir is the per-verse fallback while
//                rows backfill)
//   Urdu       → Tafheem-ul-Quran (trans) + Ibn Kathir Urdu (tafsir, 160; the
//                EN tafsir is the per-verse fallback for missing rows)
// (Surah info follows appLang separately in SurahInfoSheet — Maududi / King Fahad.)
//
// Behaviour (kept deliberately simple so it's robust — no persisted "synced lang" or
// synced override that can drift stale):
//  • On reader open (mount) and on any app-language change → set the five show-flags
//    to that language's canonical single-language set, UNLESS a session override is
//    active (the user manually picked in Reader Settings this session).
//  • A manual pick in Reader Settings sets `contentLangOverride = true` (override) —
//    we then leave the flags alone so the choice sticks for the session.
//  • Changing the app language on the Me page clears the override and resets to
//    canonical. (The override is session-scoped, not synced, so a stale server value
//    can never pin the content off-language.)
//
// `alreadyCanonical` short-circuits a redundant write when the flags already match.
export function useQuranContentLang(
  lang: ContentLang,
  setUD: (u: Partial<UserData>) => void,
  loaded: boolean,
  overrideActive: boolean,
  alreadyCanonical: boolean,
  displayMode: DisplayMode,
) {
  // Last app language this hook instance saw. null on first run → treats mount as a
  // change (so the reader opens on the app language even after a fresh launch).
  const lastLang = useRef<ContentLang | null>(null);
  useEffect(() => {
    if (!loaded) return;
    // Reading mode intentionally hides translations — don't let the content-language
    // realigner re-apply the app-language set (it would un-hide them on mount / drift).
    // Keep lastLang in sync so exiting reading mode isn't misread as a language change.
    if (displayMode === 'reading') {
      lastLang.current = lang;
      return;
    }
    const changed = lastLang.current !== lang;
    lastLang.current = lang;
    // (re)align to canonical on a language change / mount, or when no override is
    // active but the flags have drifted (e.g. a stale server snapshot). Skip when the
    // flags are already canonical (avoids redundant setting ops every open).
    const wantAlign = (changed || !overrideActive) && !alreadyCanonical;
    if (!wantAlign) return;
    const wantEn = lang === 'en';
    const wantId = lang === 'id';
    const wantTr = lang === 'tr';
    const wantUr = lang === 'ur';
    setUD({
      showEnglish: wantEn,
      showIndonesian: wantId,
      showTurkish: wantTr,
      showUrdu: wantUr,
      // Turkish pairs the Diyanet translation with the TURKISH tafsir
      // (machine-translated İbn Kesir, 9334); Urdu pairs Tafheem with the
      // Ibn Kathir Urdu tafsir (160). In both the English tafsir is
      // fallback-only (rendered per-verse while a TR/UR row is still missing).
      showEnglishTafsir: wantEn,
      showTurkishTafsir: wantTr,
      showUrduTafsir: wantUr,
      showIndoTafsir: wantId,
      contentLangOverride: false,
    });
  }, [lang, loaded, setUD, overrideActive, alreadyCanonical, displayMode]);
}

// Whether a UserData's show-flags already equal the canonical single-language set
// for `lang`. Used to skip a redundant canonical reset.
export function flagsAreCanonical(ud: UserData, lang: ContentLang): boolean {
  if (lang === 'en') {
    return (
      ud.showEnglish && !ud.showIndonesian && !ud.showTurkish && !ud.showUrdu &&
      ud.showEnglishTafsir && !ud.showIndoTafsir && !ud.showTurkishTafsir && !ud.showUrduTafsir
    );
  }
  if (lang === 'tr') {
    return (
      !ud.showEnglish && !ud.showIndonesian && ud.showTurkish && !ud.showUrdu &&
      !ud.showEnglishTafsir && !ud.showIndoTafsir && ud.showTurkishTafsir && !ud.showUrduTafsir
    );
  }
  if (lang === 'ur') {
    return (
      !ud.showEnglish && !ud.showIndonesian && !ud.showTurkish && ud.showUrdu &&
      !ud.showEnglishTafsir && !ud.showIndoTafsir && !ud.showTurkishTafsir && ud.showUrduTafsir
    );
  }
  return (
    !ud.showEnglish && ud.showIndonesian && !ud.showTurkish && !ud.showUrdu &&
    !ud.showEnglishTafsir && ud.showIndoTafsir && !ud.showTurkishTafsir && !ud.showUrduTafsir
  );
}
