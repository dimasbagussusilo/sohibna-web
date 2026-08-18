// Persistent browser cache for Quran content + audio, so the app opens fast
// and works offline. Web port of the RN app's expo-file-system cache:
//   - Content JSON  → Cache Storage 'quran-content' (same cache name the
//     service worker's runtimeCaching uses, so app reads and SW-served
//     responses agree on where content lives).
//   - Audio         → Cache Storage 'quran-audio' (per-verse mp3s; the SW
//     also runtime-caches this origin, so a fetched file is offline-playable).
//   - Fonts         → no disk copy needed: FontFace registers straight from
//     the CDN URL and the SW 'qcf-fonts' cache keeps them offline.
//
// Content JSON is read-through: a fetch first checks the cache, then the
// network, then writes the result back. The in-memory module caches in
// lib/quran.ts sit on top (L1) for instant re-renders; this is L2 (survives
// reloads/offline).

const CONTENT_CACHE = 'quran-content'
const AUDIO_CACHE = 'quran-audio'

function contentKey(key: string): Request {
  return new Request(`/__qc/${encodeURIComponent(key)}`)
}

// Open the content cache best-effort (private-mode Safari can throw).
async function contentCache(): Promise<Cache | null> {
  try {
    return await caches.open(CONTENT_CACHE)
  } catch {
    return null
  }
}

// read-through cache for a content fetch. `fetcher` runs only on a cache miss.
export async function cachedContent<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cache = await contentCache()
  if (cache) {
    try {
      const hit = await cache.match(contentKey(key))
      if (hit) return (await hit.json()) as T
    } catch {
      /* corrupt entry — fall through to re-fetch */
    }
  }
  const data = await fetcher()
  if (cache) {
    try {
      await cache.put(contentKey(key), new Response(JSON.stringify(data)))
    } catch {
      /* ignore write errors */
    }
  }
  return data
}

// Does a content key currently exist in the cache? Async on web (Cache Storage
// has no sync API). Used by the download manager to decide what's downloaded.
export async function contentExistsAsync(key: string): Promise<boolean> {
  const cache = await contentCache()
  if (!cache) return false
  try {
    return (await cache.match(contentKey(key))) !== undefined
  } catch {
    return false
  }
}

// ── AUDIO ───────────────────────────────────────────────────────────────────

const sanitize = (vk: string) => vk.replace(':', '_')

// The cache key for a verse's audio — a Request whose URL derives from the
// real audio URL so the SW runtime cache and our manual puts agree.
function audioUrl(reciter: number, verseKey: string): string {
  return `/__qa/r${reciter}_${sanitize(verseKey)}`
}

// Sync existence check is impossible on web; downloads are driven by the async
// download manager, which tracks its own state. (Kept for API-surface parity —
// the RN signature is audioExists(reciter, verseKey): boolean.)
export function audioExists(
  _reciter: number,
  _verseKey: string,
): false {
  return false
}

// Is this verse's audio cached? (Async — web download manager calls this on mount.)
export async function audioExistsAsync(reciter: number, verseKey: string): Promise<boolean> {
  try {
    const cache = await caches.open(AUDIO_CACHE)
    const hit = await cache.match(audioUrl(reciter, verseKey))
    return hit !== undefined
  } catch {
    return false
  }
}

// The URL an <audio> element should use for a cached verse, or null. The SW
// serves /__qa/* from the 'quran-audio' cache; uncached verses fall back to the
// real CDN URL at the call-site.
export function localAudioUri(
  _reciter: number,
  _verseKey: string,
): string | null {
  // Cache Storage is async, so we can't check synchronously. The reader keeps
  // an in-memory set of downloaded verse keys (useQuranDownloads) and passes
  // the plain URL; the SW audio route handles cache hits transparently.
  return null
}

// Cancel the in-flight audio download, if any (download manager's backstop).
export function cancelActiveAudioDownload(): void {
  activeAbort.abort()
  activeAbort = new AbortController()
}

let activeAbort = new AbortController()

// Download one verse's audio (idempotent). Returns the URL the <audio> element
// should use. Progress via streamed body reader.
export async function downloadAudioFile(
  url: string,
  reciter: number,
  verseKey: string,
  onProgress?: (written: number, total: number) => void,
): Promise<string> {
  const key = audioUrl(reciter, verseKey)
  let cache: Cache
  try {
    cache = await caches.open(AUDIO_CACHE)
  } catch {
    return url // no Cache Storage → just stream from the CDN
  }
  const existing = await cache.match(key)
  if (existing) return key

  const res = await fetch(url, { signal: activeAbort.signal })
  if (!res.ok || !res.body) throw new Error(`audio fetch failed: ${res.status}`)

  const total = Number(res.headers.get('content-length') ?? 0)
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let written = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) {
      chunks.push(value)
      written += value.byteLength
      onProgress?.(written, total)
    }
  }
  const blob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' })
  await cache.put(key, new Response(blob))
  return key
}

// ── STORAGE MANAGEMENT ──────────────────────────────────────────────────────

// Delete every cached audio entry for a reciter. Returns the count removed.
export async function clearAudioForReciter(reciterId: number): Promise<number> {
  let removed = 0
  try {
    const cache = await caches.open(AUDIO_CACHE)
    const prefix = `/__qa/r${reciterId}_`
    for (const req of await cache.keys()) {
      if (req.url.endsWith(prefix.slice(1)) || req.url.includes(prefix)) {
        await cache.delete(req)
        removed++
      }
    }
  } catch {
    /* ignore */
  }
  return removed
}

// Wipe all Quran caches (content + audio).
export async function clearAllQuranCache(): Promise<void> {
  try {
    await caches.delete(CONTENT_CACHE)
    await caches.delete(AUDIO_CACHE)
  } catch {
    /* ignore */
  }
}

// Total bytes used by all Quran caches (content + audio + fonts + app shell).
// navigator.storage.estimate() covers every origin-scoped bucket.
export async function quranStorageBytes(): Promise<number> {
  try {
    const est = await navigator.storage.estimate()
    return est.usage ?? 0
  } catch {
    return 0
  }
}
