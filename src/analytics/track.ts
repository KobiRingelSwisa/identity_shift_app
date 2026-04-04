import * as Analytics from 'expo-firebase-analytics';

export type AnalyticsEventName =
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'session_started'
  | 'session_completed'
  | 'day_completed'
  | 'streak_updated';

/**
 * Minimal Firebase Analytics bridge. Safe in Expo Go (logs / no-op if unavailable).
 */
export async function trackEvent(
  name: AnalyticsEventName,
  params?: Record<string, string | number>
): Promise<void> {
  try {
    await Analytics.logEvent(name, params ?? {});
  } catch {
    if (__DEV__) {
      console.log('[analytics]', name, params);
    }
  }
}
