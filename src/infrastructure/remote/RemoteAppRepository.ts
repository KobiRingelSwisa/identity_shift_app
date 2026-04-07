import type {
  ProgramProgressSnapshot,
  SaveAnchorPayload,
  SessionRun,
  UserProfile,
} from '../../domain';
import type { AppRepository } from '../../repositories/AppRepository';

/** Placeholder until API exists. */
export class RemoteAppRepository implements AppRepository {
  async getProfile(): Promise<UserProfile | null> {
    return null;
  }

  async upsertProfile(_partial: Partial<UserProfile>): Promise<UserProfile> {
    throw new Error('RemoteAppRepository: not configured');
  }

  async getProgress(_trackDurationDays: number): Promise<ProgramProgressSnapshot> {
    throw new Error('RemoteAppRepository: not configured');
  }

  async upsertProgress(
    _trackDurationDays: number,
    _partial: Partial<ProgramProgressSnapshot>
  ): Promise<void> {
    throw new Error('RemoteAppRepository: not configured');
  }

  async createSessionRun(_run: SessionRun): Promise<void> {
    throw new Error('RemoteAppRepository: not configured');
  }

  async listSessionRuns(_limit?: number): Promise<SessionRun[]> {
    return [];
  }

  async saveAnchor(_payload: SaveAnchorPayload): Promise<void> {
    throw new Error('RemoteAppRepository: not configured');
  }

  async listSavedAnchors(_programId?: string): Promise<SaveAnchorPayload[]> {
    return [];
  }
}
