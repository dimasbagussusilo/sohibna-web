import AsyncStorage from '@/lib/storage';
import type { RulingsChatEntryData } from '@/lib/quran';

const PREFIX = 'rulings_chat:';

export type RulingsChatEntry = RulingsChatEntryData;

export function mergeRulingsChatLists(local: RulingsChatEntry[], remote: RulingsChatEntry[]): RulingsChatEntry[] {
  const byKey = new Map<string, RulingsChatEntry>();
  for (const e of local) byKey.set(e.id, e);
  for (const e of remote) {
    byKey.set(e.id, e);
  }
  // Deterministic order: most recent activity first. Entries saved before
  // timestamps existed (no updatedAt) sink below timestamped ones, keeping their
  // insertion order (Array#sort is stable).
  return [...byKey.values()]
    .filter(e => !e.deleted)
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
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

// ── Temporary (unsaved) threads ─────────────────────────────────────────────
//
// Conversations that were never explicitly saved still persist DEVICE-LOCALLY
// under a separate prefix, so they can be reopened from the Kitab AI message
// history. They are never synced; saving a chat (login-gated) moves it into
// the saved store above and deletes its draft. Capped to the newest
// MAX_DRAFTS threads so ephemeral chats cannot grow unbounded.

const DRAFT_PREFIX = 'rulings_draft:';
const MAX_DRAFTS = 20;

export async function loadRulingsDraft(id: string): Promise<RulingsChatEntry | null> {
  const raw = await AsyncStorage.getItem(`${DRAFT_PREFIX}${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RulingsChatEntry;
  } catch {
    return null;
  }
}

export async function saveRulingsDraft(entry: RulingsChatEntry): Promise<void> {
  await AsyncStorage.setItem(`${DRAFT_PREFIX}${entry.id}`, JSON.stringify(entry));
  // Prune oldest drafts beyond the cap.
  const drafts = await listRulingsDrafts();
  if (drafts.length > MAX_DRAFTS) {
    const stale = drafts
      .sort((a, b) => (a.updatedAt ?? 0) - (b.updatedAt ?? 0))
      .slice(0, drafts.length - MAX_DRAFTS);
    await Promise.all(stale.map((d) => AsyncStorage.removeItem(`${DRAFT_PREFIX}${d.id}`)));
  }
}

export async function deleteRulingsDraft(id: string): Promise<void> {
  await AsyncStorage.removeItem(`${DRAFT_PREFIX}${id}`);
}

export async function listRulingsDrafts(): Promise<RulingsChatEntry[]> {
  const keys = (await AsyncStorage.getAllKeys()).filter((k) =>
    typeof k === 'string' ? k.startsWith(DRAFT_PREFIX) : false,
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

// One row of the Kitab AI message history: a saved session (local cache or
// synced, account-attached) or a temporary device-local draft.
export type RulingsThread = RulingsChatEntry & { temporary: boolean };

// Union of drafts and saved chats, deduped by id (saved wins — an explicitly
// saved chat supersedes its draft), most recent activity first.
export function mergeRulingsThreads(
  drafts: RulingsChatEntry[],
  chats: RulingsChatEntry[],
): RulingsThread[] {
  const byKey = new Map<string, RulingsThread>();
  for (const d of drafts) byKey.set(d.id, { ...d, temporary: true });
  for (const c of chats) byKey.set(c.id, { ...c, temporary: false });
  return [...byKey.values()]
    .filter((e) => !e.deleted)
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}
