import type {
  ProgramProgressSnapshot,
  SaveAnchorPayload,
  SessionRun,
  UserProfile,
} from './types';

export type Backend = {
  getUserProfile(): Promise<UserProfile | null>;
  upsertUserProfile(partial: Partial<UserProfile>): Promise<UserProfile>;
  getProgramProgress(trackDurationDays: number): Promise<ProgramProgressSnapshot>;
  upsertProgramProgress(
    trackDurationDays: number,
    partial: Partial<ProgramProgressSnapshot>
  ): Promise<void>;
  createSessionRun(run: SessionRun): Promise<void>;
  listSessionRuns(limit?: number): Promise<SessionRun[]>;
  saveAnchor(payload: SaveAnchorPayload): Promise<void>;
};
