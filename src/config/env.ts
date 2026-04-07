/**
 * Expo public env (no secrets in bundle). Use EAS Secrets for production keys.
 */
export function getUseRemoteBackend(): boolean {
  return process.env.EXPO_PUBLIC_USE_REMOTE_BACKEND === 'true';
}

export function getUseRevenueCat(): boolean {
  return process.env.EXPO_PUBLIC_USE_REVENUECAT === 'true';
}

export function getRevenueCatApiKey(): string {
  return process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? '';
}
