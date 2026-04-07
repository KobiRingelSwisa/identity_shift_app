/**
 * Placeholder registry for future premium-only tracks (e.g. money / advanced).
 * Gating uses `hasPremiumAccess()` / `canAccessPremiumTracks()` — UI reads from here.
 */
export const PREMIUM_TRACK_PLACEHOLDER = {
  id: 'premium_track_placeholder',
  titleHe: 'מסלול נוסף',
  subtitleHe: 'תוכן מורחב — בקרוב',
} as const;
