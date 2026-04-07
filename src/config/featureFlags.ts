/**
 * Feature flags for gradual rollout (remote config can override later).
 * When `USE_REMOTE_REPOSITORY` is true, `getAppRepository()` uses the remote adapter (must be configured).
 */
export const featureFlags = {
  /** Second track id when premium content ships */
  moneyTrackPreview: false,
  /** Soft paywall experiments */
  paywallExperiments: false,
  /** Swap to remote API when backend exists */
  USE_REMOTE_REPOSITORY: false,
  ENABLE_BILLING: true,
  ENABLE_PAYWALL: true,
  ENABLE_ADVANCED_ANALYTICS: true,
} as const;
