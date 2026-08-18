// SM-2-lite spaced repetition for the murajaah (review) queue.
//
// A memorized verse carries its own review state (ease / intervalDays / dueAt /
// lapses). After each manual recall the user picks one of four grades and the
// schedule advances deterministically — producing the one field the UI needs:
// `dueAt`, which the review queue sorts on (`dueAt <= now` ⇒ due today).
//
// This is deliberately simple (no floats beyond ease, no persistence beyond the
// verse row) and is the same family Anki uses, so the four buttons are familiar.
// The traditional hifz grouping (sabaq/sabqi/amuk) can be layered on later as a
// display view over `intervalDays` (≤2d ≈ sabaq, ≤7d ≈ sabqi, >7d ≈ amuk) with no
// schema change.
import type { MemorizedVerse, ReviewOutcome } from '@/lib/quran';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MIN_EASE = 1.3;
const MAX_EASE = 3.0;
const MAX_INTERVAL_DAYS = 365;
const FRESH_EASE = 2.5;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// seedMemorized builds a fresh verse marked memorized: SM-2 reset, due
// immediately (the first review schedules the next interval).
export function seedMemorized(
  verseKey: string,
  surah: number,
  ayah: number,
  now: Date = new Date(),
): MemorizedVerse {
  const iso = now.toISOString();
  return {
    verseKey,
    surah,
    ayah,
    status: 'memorized',
    memorizedAt: iso,
    ease: FRESH_EASE,
    intervalDays: 0,
    dueAt: iso,
    reviewCount: 0,
    lastReviewedAt: null,
    lapses: 0,
    verifiedBy: 'manual',
  };
}

// seedLearning builds a verse marked "learning" (in progress, not yet memorized).
// Review fields are cleared — it's excluded from the review queue until promoted.
export function seedLearning(
  verseKey: string,
  surah: number,
  ayah: number,
  now: Date = new Date(),
): MemorizedVerse {
  return {
    verseKey,
    surah,
    ayah,
    status: 'learning',
    memorizedAt: null,
    ease: FRESH_EASE,
    intervalDays: 0,
    dueAt: now.toISOString(),
    reviewCount: 0,
    lastReviewedAt: null,
    lapses: 0,
    verifiedBy: null,
  };
}

// applyReviewOutcome advances the SM-2-lite schedule by one review. The caller
// guarantees the verse is status='memorized'. Returns a new verse (immutable).
export function applyReviewOutcome(
  verse: MemorizedVerse,
  outcome: ReviewOutcome,
  now: Date = new Date(),
): MemorizedVerse {
  let ease = verse.ease;
  let intervalDays = verse.intervalDays;
  let lapses = verse.lapses;

  switch (outcome) {
    case 'again':
      ease = clamp(ease - 0.2, MIN_EASE, MAX_EASE);
      intervalDays = 0;
      lapses += 1;
      break;
    case 'hard':
      ease = clamp(ease - 0.15, MIN_EASE, MAX_EASE);
      intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
      break;
    case 'good':
      intervalDays = intervalDays === 0 ? 1 : Math.round(intervalDays * ease);
      break;
    case 'easy':
      ease = clamp(ease + 0.15, MIN_EASE, MAX_EASE);
      intervalDays = intervalDays === 0 ? 2 : Math.round(intervalDays * ease * 1.3);
      break;
  }
  intervalDays = clamp(intervalDays, 0, MAX_INTERVAL_DAYS);

  // 'again' resurfaces within the hour (intervalDays stays 0 = due today); the
  // other grades are due `intervalDays` from now.
  const dueMs =
    outcome === 'again' ? now.getTime() + 60 * 60 * 1000 : now.getTime() + intervalDays * MS_PER_DAY;

  return {
    ...verse,
    ease,
    intervalDays,
    lapses,
    reviewCount: verse.reviewCount + 1,
    lastReviewedAt: now.toISOString(),
    dueAt: new Date(dueMs).toISOString(),
  };
}
