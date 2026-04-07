import { getRevenueCatApiKey, getUseRevenueCat } from '../config/env';
import { logger } from '../utils/logger';
import type { BillingProvider } from './BillingProvider';
import type { BillingOfferings, BillingPeriod, CustomerState } from './types';
import { ENTITLEMENT_PREMIUM } from './types';
import { MockBillingProvider } from './mockBilling';

/**
 * Structure for RevenueCat (react-native-purchases) when you add the native module.
 * Guarded by EXPO_PUBLIC_USE_REVENUECAT + API key; falls back to mock behavior logging.
 */
export class RevenueCatBillingProvider implements BillingProvider {
  private readonly mock = new MockBillingProvider();

  async getOfferings(): Promise<BillingOfferings> {
    if (!getUseRevenueCat() || !getRevenueCatApiKey()) {
      logger.warn('RevenueCat: missing flag or key, using mock offerings');
      return this.mock.getOfferings();
    }
    logger.warn('RevenueCat: install react-native-purchases and map offerings here');
    return this.mock.getOfferings();
  }

  async purchasePackage(plan: BillingPeriod): Promise<void> {
    if (!getUseRevenueCat() || !getRevenueCatApiKey()) {
      return this.mock.purchasePackage(plan);
    }
    throw new Error('RevenueCat native module not linked');
  }

  async restorePurchases(): Promise<void> {
    if (!getUseRevenueCat() || !getRevenueCatApiKey()) {
      return this.mock.restorePurchases();
    }
    throw new Error('RevenueCat native module not linked');
  }

  async getCustomerState(): Promise<CustomerState> {
    if (!getUseRevenueCat() || !getRevenueCatApiKey()) {
      return this.mock.getCustomerState();
    }
    return { isPremium: false, entitlements: [] };
  }
}
