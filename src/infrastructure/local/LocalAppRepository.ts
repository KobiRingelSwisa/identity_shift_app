import type {
  ProgramProgressSnapshot,
  SaveAnchorPayload,
  SessionRun,
  UserProfile,
} from '../../domain';
import type { AppRepository } from '../../repositories/AppRepository';
import { LocalBackendAdapter } from '../../backend/localBackend';

/**
 * Local-first persistence via AsyncStorage. Delegates to existing `LocalBackendAdapter`.
 */
export class LocalAppRepository implements AppRepository {
  private readonly inner = new LocalBackendAdapter();

  getProfile(): Promise<UserProfile | null> {
    return this.inner.getUserProfile();
  }

  upsertProfile(partial: Partial<UserProfile>): Promise<UserProfile> {
    return this.inner.upsertUserProfile(partial);
  }

  getProgress(trackDurationDays: number): Promise<ProgramProgressSnapshot> {
    return this.inner.getProgramProgress(trackDurationDays);
  }

  upsertProgress(
    trackDurationDays: number,
    partial: Partial<ProgramProgressSnapshot>
  ): Promise<void> {
    return this.inner.upsertProgramProgress(trackDurationDays, partial);
  }

  createSessionRun(run: SessionRun): Promise<void> {
    return this.inner.createSessionRun(run);
  }

  listSessionRuns(limit?: number): Promise<SessionRun[]> {
    return this.inner.listSessionRuns(limit);
  }

  saveAnchor(payload: SaveAnchorPayload): Promise<void> {
    return this.inner.saveAnchor(payload);
  }

  listSavedAnchors(programId?: string): Promise<SaveAnchorPayload[]> {
    return this.inner.listSavedAnchors(programId);
  }
}
