/**
 * In-session responses from choice/feedback steps.
 * In-memory only in MVP — not persisted; kept for future insights or exports.
 */
export type SessionAnswers = Record<string, string>;
