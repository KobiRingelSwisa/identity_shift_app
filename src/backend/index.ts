import { getAppRepository, resetAppRepositoryForTests } from '../repositories';
import type { Backend } from './Backend';

/** @deprecated Prefer `getAppRepository()` from `src/repositories`. */
export function getBackend(): Backend {
  const r = getAppRepository();
  return {
    getUserProfile: () => r.getProfile(),
    upsertUserProfile: (p) => r.upsertProfile(p),
    getProgramProgress: (d) => r.getProgress(d),
    upsertProgramProgress: (d, p) => r.upsertProgress(d, p),
    createSessionRun: (run) => r.createSessionRun(run),
    listSessionRuns: (l) => r.listSessionRuns(l),
    saveAnchor: (p) => r.saveAnchor(p),
    listSavedAnchors: (id) => r.listSavedAnchors(id),
  };
}

export function resetBackendForTests(): void {
  resetAppRepositoryForTests();
}

export type { Backend } from './Backend';
export type {
  ProgramProgressSnapshot,
  SaveAnchorPayload,
  SessionRun,
  SessionStepRun,
  UserProfile,
} from './types';

export { RemoteBackendAdapter } from './remoteBackend';
