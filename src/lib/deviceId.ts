// Stable per-install device id used as the X-Device-ID sync-provenance header.
//
// Minted once (crypto.randomUUID) and kept in localStorage. It is attribution
// only — which device made a write — never authentication. A lost id just
// regenerates; sync correctness doesn't depend on it.
const KEY = 'sohibna.device_id'

let cached: string | null = null

export function getDeviceId(): string {
  if (cached) return cached
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  cached = id
  return id
}
