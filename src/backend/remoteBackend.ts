import type { Backend } from './Backend';
import type {
  ProgramProgressSnapshot,
  SaveAnchorPayload,
  SessionRun,
  UserProfile,
} from './types';

/**
 * Placeholder for a future remote API. No hard dependency on a vendor.
 * Swap implementation when backend URL + auth exist.
 */
export class RemoteBackendAdapter implements Backend {
  async getUserProfile(): Promise<UserProfile | null> {
    return null;
  }

  async upsertUserProfile(_partial: Partial<UserProfile>): Promise<UserProfile> {
    throw new Error('RemoteBackendAdapter: not configured');
  }

  async getProgramProgress(_trackDurationDays: number): Promise<ProgramProgressSnapshot> {
    throw new Error('RemoteBackendAdapter: not configured');
  }

  async upsertProgramProgress(
    _trackDurationDays: number,
    _partial: Partial<ProgramProgressSnapshot>
  ): Promise<void> {
    throw new Error('RemoteBackendAdapter: not configured');
  }

  async createSessionRun(_run: SessionRun): Promise<void> {
    throw new Error('RemoteBackendAdapter: not configured');
  }

  async listSessionRuns(_limit?: number): Promise<SessionRun[]> {
    return [];
  }

  async saveAnchor(_payload: SaveAnchorPayload): Promise<void> {
    throw new Error('RemoteBackendAdapter: not configured');
  }
}
