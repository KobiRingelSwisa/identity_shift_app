import type { BillingProvider } from './BillingProvider';
import { MockBillingProvider } from './mockBilling';
import { RevenueCatBillingProvider } from './revenueCatBilling';
import { getRevenueCatApiKey, getUseRevenueCat } from '../config/env';

let singleton: BillingProvider | null = null;

export function getBillingProvider(): BillingProvider {
  if (singleton) return singleton;
  const useRc = getUseRevenueCat() && getRevenueCatApiKey().length > 0;
  singleton = useRc ? new RevenueCatBillingProvider() : new MockBillingProvider();
  return singleton;
}

export function resetBillingProviderForTests(): void {
  singleton = null;
}
