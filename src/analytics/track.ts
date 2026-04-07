import * as Analytics from 'expo-firebase-analytics';
import { getAnalyticsConsent } from '../storage/analyticsConsent';
import type { AnalyticsEventMap, AnalyticsEventName } from './events';
import { CRITICAL_ANALYTICS_EVENTS } from './events';

function toFirebaseParams(
  params: Record<string, string | number | boolean>
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'boolean') out[k] = v ? 1 : 0;
    else out[k] = v;
  }
  return out;
}

export async function trackEvent<E extends AnalyticsEventName>(
  name: E,
  payload?: AnalyticsEventMap[E]
): Promise<void> {
  const p = (payload ?? {}) as Record<string, string | number | boolean>;

  const allowed =
    CRITICAL_ANALYTICS_EVENTS.has(name) || (await getAnalyticsConsent());
  if (!allowed) return;

  try {
    await Analytics.logEvent(name as string, toFirebaseParams(p));
  } catch {
    if (__DEV__) {
      console.log('[analytics]', name, p);
    }
  }
}
