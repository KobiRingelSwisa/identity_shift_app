import type {
  ProgramProgressSnapshot,
  SaveAnchorPayload,
  SessionRun,
  UserProfile,
} from '../domain';

/**
 * Application data port (local or remote). Method names match launch architecture spec.
 */
export type AppRepository = {
  getProfile(): Promise<UserProfile | null>;
  upsertProfile(partial: Partial<UserProfile>): Promise<UserProfile>;
  getProgress(trackDurationDays: number): Promise<ProgramProgressSnapshot>;
  upsertProgress(
    trackDurationDays: number,
    partial: Partial<ProgramProgressSnapshot>
  ): Promise<void>;
  createSessionRun(run: SessionRun): Promise<void>;
  listSessionRuns(limit?: number): Promise<SessionRun[]>;
  saveAnchor(payload: SaveAnchorPayload): Promise<void>;
  listSavedAnchors(programId?: string): Promise<SaveAnchorPayload[]>;
};
