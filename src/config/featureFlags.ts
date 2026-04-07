/**
 * Central feature flags for launch experiments (remote config can override later).
 */
export const featureFlags = {
  /** Second track id when premium content ships */
  moneyTrackPreview: false,
  /** Soft paywall experiments */
  paywallExperiments: false,
} as const;
