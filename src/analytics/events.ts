/** Strongly typed analytics payloads (Firebase / future providers). */
export type AnalyticsEventMap = {
  onboarding_started: Record<string, never>;
  onboarding_completed: { commitment_days: number };
  reminder_prompt_viewed: Record<string, never>;
  reminder_enabled: Record<string, never>;
  reminder_denied: Record<string, never>;
  session_started: { day: number };
  step_viewed: { step_id: string; step_type: string; day: number; index: number };
  choice_selected: { step_id: string; day: number; value: string };
  session_completed: { day: number };
  session_abandoned: { day: number; last_step_index: number };
  day_completed: { day: number };
  streak_updated: { streak: number };
  paywall_viewed: { reason: string };
  paywall_cta_clicked: { plan: 'monthly' | 'yearly' };
  purchase_started: { plan: 'monthly' | 'yearly' };
  purchase_success: { plan: 'monthly' | 'yearly' };
  purchase_failed: { reason: string };
  restore_started: Record<string, never>;
  restore_success: Record<string, never>;
  restore_failed: { reason: string };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

/** Always sent even when analytics consent is off (minimal operational set). */
export const CRITICAL_ANALYTICS_EVENTS = new Set<AnalyticsEventName>([
  'session_started',
  'session_completed',
  'purchase_success',
  'purchase_failed',
  'restore_success',
  'restore_failed',
]);
