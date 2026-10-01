import AsyncStorage from '@/lib/storage';
import type { RulingsChatEntryData } from '@/lib/quran';

const PREFIX = 'rulings_chat:';

export type RulingsChatEntry = RulingsChatEntryData;

export function mergeRulingsChatLists(local: RulingsChatEntry[], remote: RulingsChatEntry[]): RulingsChatEntry[] {
  const byKey = new Map<string, RulingsChatEntry>();
  for (const e of local) byKey.set(e.id, e);
  for (const e of remote) {
    // If deleted, we can optionally skip or keep it, but sync marks it as deleted.
    byKey.set(e.id, e);
  }
  return [...byKey.values()].filter(e => !e.deleted);
}

export async function loadRulingsChat(id: string): Promise<RulingsChatEntry | null> {
  const raw = await AsyncStorage.getItem(`${PREFIX}${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RulingsChatEntry;
  } catch {
    return null;
  }
}

export async function saveRulingsChatLocal(entry: RulingsChatEntry): Promise<void> {
  await AsyncStorage.setItem(`${PREFIX}${entry.id}`, JSON.stringify(entry));
}

export async function deleteRulingsChatLocal(id: string): Promise<void> {
  await AsyncStorage.removeItem(`${PREFIX}${id}`);
}

export async function listRulingsChats(): Promise<RulingsChatEntry[]> {
  const keys = (await AsyncStorage.getAllKeys()).filter((k) =>
    typeof k === 'string' ? k.startsWith(PREFIX) : false,
  );
  if (keys.length === 0) return [];
  const pairs = await AsyncStorage.multiGet(keys);
  const out: RulingsChatEntry[] = [];
  for (const [, raw] of pairs) {
    if (!raw) continue;
    try {
      out.push(JSON.parse(raw) as RulingsChatEntry);
    } catch {}
  }
  return out;
}
