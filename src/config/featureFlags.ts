/**
 * Feature flags for gradual rollout (remote config can override later).
 * When `USE_REMOTE_REPOSITORY` is true, `getAppRepository()` uses the remote adapter (must be configured).
 */
export const featureFlags = {
  /** Teaser row on home for a future premium track (gated by entitlement) */
  moneyTrackPreview: true,
  /** Soft paywall experiments */
  paywallExperiments: false,
  /** Swap to remote API when backend exists */
  USE_REMOTE_REPOSITORY: false,
  ENABLE_BILLING: true,
  ENABLE_PAYWALL: true,
  ENABLE_ADVANCED_ANALYTICS: true,
  /** Soft upgrade link on post-session (non-blocking; conversion baseline) */
  GROWTH_POST_SESSION_UPGRADE_CTA: true,
  /** Soft upgrade link on track-complete summary */
  GROWTH_TRACK_COMPLETE_UPGRADE_CTA: true,
} as const;
