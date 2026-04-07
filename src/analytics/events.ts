/** Strongly typed analytics payloads (Firebase / future providers). Correlation fields per launch spec. */
export type AnalyticsEventMap = {
  onboarding_started: Record<string, never>;
  onboarding_completed: { commitment_days: number; programId: string };
  reminder_prompt_viewed: Record<string, never>;
  reminder_enabled: Record<string, never>;
  reminder_denied: Record<string, never>;
  session_started: {
    day: number;
    programId: string;
    sessionRunId?: string;
  };
  step_viewed: {
    step_id: string;
    step_type: string;
    day: number;
    index: number;
    programId: string;
    sessionRunId: string;
  };
  choice_selected: {
    step_id: string;
    day: number;
    value: string;
    programId: string;
    sessionRunId: string;
  };
  session_completed: {
    day: number;
    programId: string;
    sessionRunId: string;
  };
  session_abandoned: {
    day: number;
    last_step_index: number;
    programId: string;
    sessionRunId: string;
  };
  day_completed: { day: number; programId: string };
  streak_updated: { streak: number; programId: string };
  paywall_viewed: { reason: string; programId: string };
  paywall_cta_clicked: {
    plan: 'monthly' | 'yearly';
    programId: string;
  };
  purchase_started: { plan: 'monthly' | 'yearly'; programId: string };
  purchase_success: { plan: 'monthly' | 'yearly'; programId: string };
  purchase_failed: { reason: string; programId: string };
  restore_started: { programId: string };
  restore_success: { programId: string };
  restore_failed: { reason: string; programId: string };
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
