import type { AppProgress } from '../storage/progress';

export type UserProfile = {
  id: string;
  createdAtIso: string;
};

/** Snapshot aligned with AppProgress for backend reads (local-first). */
export type ProgramProgressSnapshot = Pick<
  AppProgress,
  | 'onboardingDone'
  | 'commitmentDays'
  | 'currentDay'
  | 'completedDays'
  | 'streak'
  | 'lastCompletedDate'
  | 'lastSessionCalendarDate'
  | 'lastCompletedTrackDay'
  | 'totalSessionsCompleted'
>;

export type SessionStepRun = {
  stepId: string;
  type: string;
  response: string | null;
};

export type SessionRun = {
  runId: string;
  startedAt: string;
  completedAt: string;
  programId: string;
  day: number;
  steps: SessionStepRun[];
};

export type SaveAnchorPayload = {
  programId: string;
  day: number;
  text: string;
};
