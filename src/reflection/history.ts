// Local persistence for Daily Reflection — one entry per calendar day per mood.
//
// Keyed `reflection:<YYYY-MM-DD>:<mood>` so a user can reflect under different
// moods on the same day without one overwriting the other (the on-screen mood
// selector switches the active feeling). This local store is the guest/offline
// home of reflections AND the source the one-time account backfill reads; for
// authed users the entry ALSO syncs to the account (useQuranData.saveReflection
// → quran_reflections), and history views merge the two via
// mergeReflectionLists (newer updatedAt wins — a local in-progress entry can
// legitimately be newer than the server's copy mid-session).

import AsyncStorage from '@/lib/storage';
import type { ReflectionEntryData } from '@/lib/quran';
import type { MoodId } from './moods';

const PREFIX = 'reflection:';

// The synced shape is declared in lib/quran (shared RN/web + imported by the
// API layer); it's structurally identical to the historical local shape.
export type ReflectionEntry = ReflectionEntryData;

/** Union of local + synced entries by 'date:mood', newer updatedAt wins. */
export function mergeReflectionLists(local: ReflectionEntry[], remote: ReflectionEntry[]): ReflectionEntry[] {
  const byKey = new Map<string, ReflectionEntry>();
  for (const e of local) byKey.set(`${e.date}:${e.mood}`, e);
  for (const e of remote) {
    const k = `${e.date}:${e.mood}`;
    const prev = byKey.get(k);
    if (!prev || (e.updatedAt ?? 0) >= (prev.updatedAt ?? 0)) byKey.set(k, e);
  }
  return [...byKey.values()];
}

/** Today's date as YYYY-MM-DD (the key namespace for a reflection entry). */
export function reflectionDateKey(d: Date = new Date()): string {
  return d.toLocaleDateString('en-CA');
}

export async function loadReflection(date: string, mood: MoodId): Promise<ReflectionEntry | null> {
  const raw = await AsyncStorage.getItem(`${PREFIX}${date}:${mood}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ReflectionEntry;
  } catch {
    return null;
  }
}

export async function saveReflection(entry: ReflectionEntry): Promise<void> {
  await AsyncStorage.setItem(`${PREFIX}${entry.date}:${entry.mood}`, JSON.stringify(entry));
}

/** All saved reflections, newest day first. Corrupt entries are skipped. */
export async function listReflections(): Promise<ReflectionEntry[]> {
  const keys = (await AsyncStorage.getAllKeys()).filter((k) =>
    typeof k === 'string' ? k.startsWith(PREFIX) : false,
  );
  if (keys.length === 0) return [];
  const pairs = await AsyncStorage.multiGet(keys);
  const out: ReflectionEntry[] = [];
  for (const [, raw] of pairs) {
    if (!raw) continue;
    try {
      out.push(JSON.parse(raw) as ReflectionEntry);
    } catch {
      /* skip corrupt entry */
    }
  }
  return out.sort((a, b) => {
    // Newest day first; within a day (multiple moods), most-recently-touched.
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
  });
}
