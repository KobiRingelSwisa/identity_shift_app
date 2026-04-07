import type { Backend } from './Backend';
import { LocalBackendAdapter } from './localBackend';

let singleton: Backend | null = null;

/** Local-first persistence. `RemoteBackendAdapter` is a future swap — keep Local until API exists. */
export function getBackend(): Backend {
  if (singleton) return singleton;
  singleton = new LocalBackendAdapter();
  return singleton;
}

export function resetBackendForTests(): void {
  singleton = null;
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
