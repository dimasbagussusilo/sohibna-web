# Ported sources

Every file copied from the RN app (`sohibna` repo). Re-diff against the source
before each phase so upstream fixes aren't missed. Source commit at port time:
**a87abd8**.

## Verbatim (RN-free, no edits)

| Web file | RN source |
|---|---|
| `src/api.ts` | `sohibna/src/api.ts` |
| `src/lib/authSession.ts` | `sohibna/src/lib/authSession.ts` |
| `src/lib/imlai.ts` | `sohibna/src/lib/imlai.ts` |
| `src/lib/waqf.ts` | `sohibna/src/lib/waqf.ts` |
| `src/lib/hijri.ts` | `sohibna/src/lib/hijri.ts` |
| `src/lib/prayer.ts` | `sohibna/src/lib/prayer.ts` |
| `src/lib/geocode.ts` | `sohibna/src/lib/geocode.ts` |
| `src/lib/quranAyahOfDay.ts` | `sohibna/src/lib/quranAyahOfDay.ts` |
| `src/lib/eventI18n.ts` | `sohibna/src/lib/eventI18n.ts` |
| `src/lib/rulingsI18n.ts` | `sohibna/src/lib/rulingsI18n.ts` |
| `src/lib/uuid.ts` | `sohibna/src/lib/uuid.ts` |
| `src/lib/quran.ts` | `sohibna/src/lib/quran.ts` |
| `src/i18n/types.ts` | `sohibna/src/i18n/types.ts` |
| `src/i18n/contentLang.ts` | `sohibna/src/i18n/contentLang.ts` |
| `src/i18n/langName.ts` | `sohibna/src/i18n/langName.ts` |
| `src/i18n/translations/{id,en,ar}.ts` | `sohibna/src/i18n/translations/` |
| `src/hafalan/spacedRepetition.ts` | `sohibna/src/hafalan/spacedRepetition.ts` |
| `src/hafalan/hafalanScope.ts` | `sohibna/src/hafalan/hafalanScope.ts` |
| `src/reflection/moods.ts` | `sohibna/src/reflection/moods.ts` |
| `src/lib/__tests__/imlai.test.ts` | `sohibna/src/lib/__tests__/imlai.test.ts` (node:test → vitest import) |

## Adapted (same logic, platform swap)

| Web file | RN source | Change |
|---|---|---|
| `src/lib/quranSync.ts` | `sohibna/src/lib/quranSync.ts` | AsyncStorage → `@/lib/storage` |
| `src/lib/islamicEvents.ts` | `sohibna/src/lib/islamicEvents.ts` | AsyncStorage → `@/lib/storage` |
| `src/lib/quranStorage.ts` | `sohibna/src/lib/quranStorage.ts` | AsyncStorage → `@/lib/storage` |
| `src/lib/quranCache.ts` | `sohibna/src/lib/quranCache.ts` | expo-file-system → Cache Storage; `contentExists`→`contentExistsAsync`; audio keyed `/__qa/*` |
| `src/lib/qcfFonts.ts` | `sohibna/src/lib/qcfFonts.ts` | expo-font → `FontFace`/`document.fonts`; base64/V4 machinery deleted |

## Rewritten for web (no RN counterpart)

`src/config.ts` (VITE_ env), `src/lib/storage.ts` (localStorage shim),
`src/lib/deviceId.ts` (crypto.randomUUID), contexts, hooks, routes, components.
