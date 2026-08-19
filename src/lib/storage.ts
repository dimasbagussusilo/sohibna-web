// localStorage-backed storage with the AsyncStorage API shape, so ported
// call-sites keep their async signatures verbatim. All the app's persisted
// keys live here (same key strings as the RN app):
//   sohibna.quran.cursor.<uid> / sohibna.quran.pending.<uid> (per-user, 0008;
//     legacy un-suffixed keys are migrated once) / sohibna.quran.cache.<uid>
//     (offline snapshot) / sohibna.quran.guestUD / sohibna.quran.backfill.<uid>
//   sohibna.auth_* / sohibna.device_id / sohibna:lang / sohibna:dark_mode
//   reflection:* / prayed:* / location / place-name / islamic-events caches
//
// SECURITY NOTE: the RN app kept tokens in the OS keychain (SecureStore). Web
// has no equivalent available to JS, so refresh/access tokens live in
// localStorage. The blast radius is bounded by the CSP (no third-party
// scripts) and server-side refresh-token rotation (a stolen refresh token
// dies on its next legitimate use). Do NOT introduce third-party scripts.

export default {
  getItem(key: string): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(key))
  },
  setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
    return Promise.resolve()
  },
  removeItem(key: string): Promise<void> {
    localStorage.removeItem(key)
    return Promise.resolve()
  },
  getAllKeys(): Promise<readonly string[]> {
    return Promise.resolve(Object.keys(localStorage))
  },
  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    return keys.map((k) => [k, localStorage.getItem(k)])
  },
}
