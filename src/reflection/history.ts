// Local persistence for Daily Reflection — one entry per calendar day per mood.
//
// Keyed `reflection:<YYYY-MM-DD>:<mood>` so a user can reflect under different
// moods on the same day without one overwriting the other (the on-screen mood
// selector switches the active feeling). Mirrors the prayer tracker's device-
// local AsyncStorage pattern: no account coupling, works for guests. This is
// intentionally NOT backend-synced; the server is used only for the AI chat.
// Browsing history enumerates all `reflection:*` keys.

import AsyncStorage from '@/lib/storage';
import type { ReflectionMessage } from '@/api';
import type { MoodId } from './moods';

const PREFIX = 'reflection:';

export type ReflectionEntry = {
  /** Calendar day, YYYY-MM-DD. Used as the storage key (one entry per day). */
  date: string;
  mood: MoodId;
  verseKey: string;
  messages: ReflectionMessage[];
  updatedAt: number;
};

/** Today's date as YYYY-MM-DD (the key namespace for a reflection entry). */
export function reflectionDateKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
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
