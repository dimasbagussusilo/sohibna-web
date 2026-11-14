// Streak celebration + achievement popup helpers (pure — no RN imports so the
// logic stays unit-testable under node --test). "Shown once" bookkeeping
// follows the announcements convention: per-user AsyncStorage keys, marked AT
// DISPLAY TIME (a crash before display re-celebrates next open — desired).
// Milestones celebrated: popup fires for the HIGHEST unreached-shown one and
// marks everything at or below it (an offline multi-day jump celebrates once,
// not once per skipped milestone).

// Big popup at these streak counts only; everyday continuation = small toast.
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365] as const;

// A celebration the CelebrationDialog can render. Achievement names resolve
// from i18n at render time (the server only ever sends ids).
export type CelebrationItem =
  | { kind: 'streak'; n: number }
  | { kind: 'achievement'; id: string }
  | { kind: 'level'; n: number };

// Streak badges are excluded from the POPUP queue — the streak-milestone
// popup already celebrates that moment; the badge still shows in
// /achievements.
const POPUP_EXCLUDED_PREFIX = 'streak_';

// Per-user AsyncStorage keys (backfill-flag convention: sohibna.quran.* +
// <uid> suffix).
export const milestoneKey = (uid: string, n: number): string =>
  `sohibna.quran.celebrated.${uid}.streak.${n}`;
export const seenAchievementsKey = (uid: string): string =>
  `sohibna.quran.achievements.seen.${uid}`;

export const popupEligible = (achievementId: string): boolean =>
  !achievementId.startsWith(POPUP_EXCLUDED_PREFIX);

// The highest milestone ≤ current (null below the first) — the dialog pairs
// this with the per-milestone shown flags. Transition-agnostic: a milestone
// reached on another device still celebrates here.
export const highestMilestone = (current: number): number | null => {
  let pending: number | null = null;
  for (const m of STREAK_MILESTONES) {
    if (current >= m) pending = m;
  }
  return pending;
};
