// Legacy guest-storage wipe.
//
// Quran user data is now ACCOUNT-ONLY: logged-in users sync with the server
// (source of truth); guests (no account) keep their state purely in memory and
// store NOTHING on device. This module exists only to clear the old
// `sohibna:quran_data` AsyncStorage doc that the previous (guest-persisting)
// behavior wrote, so leftover guest data doesn't resurface.
import AsyncStorage from '@/lib/storage';

const LEGACY_KEY = 'sohibna:quran_data';

// clearLegacyGuestData removes the old on-device guest document. Safe to call
// repeatedly (no-op if absent). Called when entering guest mode.
export async function clearLegacyGuestData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LEGACY_KEY);
  } catch {
    /* ignore */
  }
}
