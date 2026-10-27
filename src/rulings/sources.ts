// useRulingsSources: the chat-with-reference pick-list (GET /ai/sources).
// Memory-only module cache with in-flight dedupe — the catalog changes only
// on corpus reseeding, but NOT never-expiring disk storage (cachedContent):
// a reseed must become visible on app restart. Shared by both platforms —
// keep this file identical to its sohibna-web twin.
import { useEffect, useState } from 'react';
import { fetchRulingsSources, type RulingsSourceCatalog, type RulingsSourceGroup } from '@/api';

let cache: RulingsSourceCatalog | null = null;
let inflight: Promise<RulingsSourceCatalog> | null = null;

const load = (force: boolean): Promise<RulingsSourceCatalog> => {
  if (!force && cache) return Promise.resolve(cache);
  if (!force && inflight) return inflight;
  inflight = fetchRulingsSources()
    .then((cat) => {
      cache = cat;
      return cat;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
};

// Category sections for the reference list: groups the catalog's flat series
// under the server's canonical category order. An old server (no categories)
// yields one header-less section. Keep this file identical to its sohibna-web
// twin.
export type RulingsSourceSection = { key: string; series: RulingsSourceGroup[] };

export function groupByCategory(catalog: RulingsSourceCatalog): RulingsSourceSection[] {
  const byCat = new Map<string, RulingsSourceGroup[]>();
  for (const s of catalog.series ?? []) {
    const k = s.category || 'lainnya';
    if (!byCat.has(k)) byCat.set(k, []);
    byCat.get(k)!.push(s);
  }
  if (!catalog.categories) {
    // Old server: flat, header-less.
    return [{ key: '', series: catalog.series ?? [] }];
  }
  const keys = catalog.categories.filter((k) => byCat.has(k));
  for (const k of byCat.keys()) {
    if (!keys.includes(k)) keys.push(k); // unknown slug (newer server) appends last
  }
  return keys.map((key) => ({ key, series: byCat.get(key)! }));
}

export function useRulingsSources(): {
  catalog: RulingsSourceCatalog | null;
  loading: boolean;
  error: boolean;
  retry: () => void;
} {
  const [catalog, setCatalog] = useState<RulingsSourceCatalog | null>(cache);
  const [loading, setLoading] = useState(cache == null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    if (cache) return undefined;
    load(false)
      .then((cat) => {
        if (active) {
          setCatalog(cat);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const retry = () => {
    setError(false);
    setLoading(true);
    load(true)
      .then((cat) => {
        setCatalog(cat);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  return { catalog, loading, error, retry };
}
