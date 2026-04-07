import type { AppRepository } from './AppRepository';
import { LocalAppRepository } from '../infrastructure/local/LocalAppRepository';
import { RemoteAppRepository } from '../infrastructure/remote/RemoteAppRepository';
import { featureFlags } from '../config/featureFlags';

let singleton: AppRepository | null = null;

export function getAppRepository(): AppRepository {
  if (singleton) return singleton;
  singleton = featureFlags.USE_REMOTE_REPOSITORY
    ? new RemoteAppRepository()
    : new LocalAppRepository();
  return singleton;
}

export function resetAppRepositoryForTests(): void {
  singleton = null;
}

export type { AppRepository } from './AppRepository';
