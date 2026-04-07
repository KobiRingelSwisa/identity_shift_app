/**
 * In-session responses from choice/feedback steps.
 * Aggregated into `SessionRun` at session end via `buildSessionStepRuns` + backend.
 */
export type SessionAnswers = Record<string, string>;
