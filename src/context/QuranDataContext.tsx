import { createContext, useContext, type ReactNode } from 'react';
import { useQuranData as useQuranDataImpl } from '@/hooks/useQuranData';

// A SINGLE shared Quran-data instance for the whole app.
//
// The hook used to be called per-screen (Quran dashboard, surah reader, goals),
// which gave each screen its own `ud` state. That broke in two ways: (1) a
// setting changed in one screen (e.g. the reader's font size) didn't survive
// navigating away and back — the remounted screen reloaded from storage and a
// slow/failed reload reset it to defaults; (2) favorites/labels toggled in the
// reader didn't reflect on the dashboard until a manual reload. Mounting ONE
// instance here (inside AuthProvider, so it has the token) and sharing it via
// context fixes both: `ud` lives in memory across navigation and every screen
// sees the same values.
type QuranDataValue = ReturnType<typeof useQuranDataImpl>;

const QuranDataContext = createContext<QuranDataValue | null>(null);

export function QuranDataProvider({ children }: { children: ReactNode }) {
  const value = useQuranDataImpl();
  return <QuranDataContext.Provider value={value}>{children}</QuranDataContext.Provider>;
}

export function useQuranData(): QuranDataValue {
  const ctx = useContext(QuranDataContext);
  if (!ctx) {
    throw new Error('useQuranData must be used within a <QuranDataProvider>');
  }
  return ctx;
}
