/**
 * Expo public env (no secrets in bundle). Use EAS Secrets for production keys.
 */
export function getUseRemoteBackend(): boolean {
  return process.env.EXPO_PUBLIC_USE_REMOTE_BACKEND === 'true';
}

/** mock | revenuecat — aligns with launch spec */
export function getBillingProviderName(): string {
  return process.env.EXPO_PUBLIC_BILLING_PROVIDER ?? 'mock';
}

export function getUseRevenueCat(): boolean {
  return (
    getBillingProviderName() === 'revenuecat' ||
    process.env.EXPO_PUBLIC_USE_REVENUECAT === 'true'
  );
}

export function getRevenueCatApiKey(): string {
  return (
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ??
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ??
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ??
    ''
  );
}

export function getRevenueCatApiKeyIos(): string {
  return process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ?? '';
}

export function getRevenueCatApiKeyAndroid(): string {
  return process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? '';
}
