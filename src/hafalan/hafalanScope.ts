// Pure helpers for the hafalan feature: turning a target + the user's memorized
// map into the numbers the UI shows (ring fraction, "X / Y", today's new count,
// the due-for-review queue) and the verse source the tracker loads.
//
// Progress is client-derived — count(memorized ∩ scope) / scope size — from data
// already on-device via sync, so no server progress endpoint is needed.
import type {
  Chapter,
  HafalanTarget,
  Juz,
  MemorizedVerse,
  Source,
} from '@/lib/quran';

// Is verse_key "S:A" within a juz's verse_mapping (mapping: surahId → "from-to")?
export function verseInJuz(verseKey: string, mapping: Record<string, string>): boolean {
  const [s, a] = verseKey.split(':').map(Number);
  const range = mapping[String(s)];
  if (!range) return false;
  const [from, to] = range.split('-').map(Number);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return false;
  return a >= from && a <= to;
}

// Parse a verse_key's surah/ayah as numbers (defensive — bad keys → 0).
function va(vk: string): [number, number] {
  const [s, a] = vk.split(':').map(Number);
  return [s || 0, a || 0];
}

// Human label for a target card: "Surah Al-Mulk", "Juz 30", "Al-Kahf 1–30",
// "10/day". Descriptive names only — no virtue claims (per app content standards).
export function scopeLabel(t: HafalanTarget, chapters: Chapter[]): string {
  switch (t.scope) {
    case 'surah': {
      const c = chapters.find((x) => x.id === t.surahId);
      return c ? c.name_simple : `Surah ${t.surahId ?? ''}`;
    }
    case 'juz':
      return `Juz ${t.juzId ?? ''}`;
    case 'range': {
      const [sf, af] = va(t.rangeFrom ?? '');
      const [, at] = va(t.rangeTo ?? '');
      const c = chapters.find((x) => x.id === sf);
      const name = c ? c.name_simple : 'Range';
      return `${name} ${af}${af === at ? '' : '–' + at}`;
    }
    case 'daily_rate':
      return `${t.dailyAyahs ?? 0}/day`;
  }
}

// The denominator — how many verses the target covers. null for daily_rate
// (ongoing, no end target).
export function scopeVerseCount(t: HafalanTarget, chapters: Chapter[], juzs: Juz[]): number | null {
  switch (t.scope) {
    case 'surah':
      return chapters.find((c) => c.id === t.surahId)?.verses_count ?? null;
    case 'range': {
      const [, af] = va(t.rangeFrom ?? '');
      const [, at] = va(t.rangeTo ?? '');
      if (!af || !at) return null;
      return Math.abs(at - af) + 1;
    }
    case 'juz':
      return juzs.find((j) => j.juz_number === t.juzId)?.verses_count ?? null;
    case 'daily_rate':
      return null;
  }
}

// How many memorized verses fall in the target's scope. For daily_rate, every
// memorized verse counts (the target is "memorize N new/day" — total is the
// running tally).
export function memorizedCountInScope(
  t: HafalanTarget,
  memorized: Record<string, MemorizedVerse>,
  juzs: Juz[],
): number {
  const juzMap = t.scope === 'juz' ? juzs.find((j) => j.juz_number === t.juzId)?.verse_mapping : undefined;
  let n = 0;
  for (const v of Object.values(memorized)) {
    if (v.status !== 'memorized') continue;
    switch (t.scope) {
      case 'surah':
        if (v.surah === t.surahId) n++;
        break;
      case 'range': {
        const [sf, af] = va(t.rangeFrom ?? '');
        const [, at] = va(t.rangeTo ?? '');
        if (v.surah === sf && v.ayah >= Math.min(af, at) && v.ayah <= Math.max(af, at)) n++;
        break;
      }
      case 'juz':
        if (juzMap && verseInJuz(v.verseKey, juzMap)) n++;
        break;
      case 'daily_rate':
        n++;
        break;
    }
  }
  return n;
}

// Verses first marked memorized today (the daily_rate target's numerator).
export function todayNewMemorized(memorized: Record<string, MemorizedVerse>): number {
  const today = new Date().toISOString().slice(0, 10);
  let n = 0;
  for (const v of Object.values(memorized)) {
    if (v.status === 'memorized' && v.memorizedAt && v.memorizedAt.slice(0, 10) === today) n++;
  }
  return n;
}

// The murajaah queue: memorized verses with dueAt <= now, soonest first.
export function dueVerses(memorized: Record<string, MemorizedVerse>, now: number = Date.now()): MemorizedVerse[] {
  const out: MemorizedVerse[] = [];
  for (const v of Object.values(memorized)) {
    if (v.status === 'memorized' && new Date(v.dueAt).getTime() <= now) out.push(v);
  }
  out.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  return out;
}

// The loadVerses source for a target's "Mark ayat" view. null for daily_rate
// (the user picks a surah inside the tracker first).
export function trackerSource(t: HafalanTarget): Source | null {
  switch (t.scope) {
    case 'surah':
      return { kind: 'surah', id: t.surahId ?? 1 };
    case 'juz':
      return { kind: 'juz', id: t.juzId ?? 1 };
    case 'range':
      return { kind: 'surah', id: va(t.rangeFrom ?? '1:1')[0] };
    case 'daily_rate':
      return null;
  }
}

// The progress shown in a target's ring. `daily` targets show today's-new vs the
// daily rate; others show memorized-in-scope vs scope size. `head`/`total` feed
// the "X / Y" label under the ring.
export function targetProgress(
  t: HafalanTarget,
  memorized: Record<string, MemorizedVerse>,
  chapters: Chapter[],
  juzs: Juz[],
): { frac: number; head: number; total: number; daily: boolean } {
  if (t.scope === 'daily_rate') {
    const today = todayNewMemorized(memorized);
    const target = t.dailyAyahs ?? 1;
    return { frac: Math.min(1, today / target), head: today, total: target, daily: true };
  }
  const m = memorizedCountInScope(t, memorized, juzs);
  const total = scopeVerseCount(t, chapters, juzs) ?? 0;
  return { frac: total > 0 ? Math.min(1, m / total) : 0, head: m, total, daily: false };
}

// For the range tracker: the [from, to] ayah bounds to filter the loaded surah.
export function rangeBounds(t: HafalanTarget): [number, number] | null {
  if (t.scope !== 'range' || !t.rangeFrom || !t.rangeTo) return null;
  const [, af] = va(t.rangeFrom);
  const [, at] = va(t.rangeTo);
  return [Math.min(af, at), Math.max(af, at)];
}
