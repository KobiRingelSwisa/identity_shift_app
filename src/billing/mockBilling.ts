import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BillingProvider } from './BillingProvider';
import type { BillingOfferings, BillingPeriod, CustomerState } from './types';
import { ENTITLEMENT_PREMIUM } from './types';

const PREMIUM_KEY = '@identity-shift/entitlement-premium-v1';

export class MockBillingProvider implements BillingProvider {
  async getOfferings(): Promise<BillingOfferings> {
    return {
      monthly: {
        id: 'mock_monthly',
        title: 'חודשי',
        price: '₪18.90',
        period: 'monthly',
      },
      yearly: {
        id: 'mock_yearly',
        title: 'שנתי',
        price: '₪149',
        period: 'yearly',
      },
    };
  }

  async purchasePackage(_plan: BillingPeriod): Promise<void> {
    await AsyncStorage.setItem(PREMIUM_KEY, 'true');
  }

  async restorePurchases(): Promise<void> {
    const v = await AsyncStorage.getItem(PREMIUM_KEY);
    if (v !== 'true') {
      throw new Error('אין רכישה לשחזור (מצב פיתוח)');
    }
  }

  async getCustomerState(): Promise<CustomerState> {
    const v = await AsyncStorage.getItem(PREMIUM_KEY);
    const isPremium = v === 'true';
    return {
      isPremium,
      entitlements: isPremium ? [ENTITLEMENT_PREMIUM] : [],
    };
  }
}
