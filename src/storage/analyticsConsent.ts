import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@identity-shift/analytics-consent-v1';

/**
 * Default ON: product analytics for funnels; user can disable in Settings.
 * Non-essential events are suppressed when disabled (see track.ts).
 */
export async function getAnalyticsConsent(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY);
  if (v === null) return true;
  return v === 'true';
}

export async function setAnalyticsConsent(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY, enabled ? 'true' : 'false');
}
