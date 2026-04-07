import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasPremiumAccess } from '../src/billing/entitlements';
import { resetBillingProviderForTests } from '../src/billing/getBillingProvider';

describe('hasPremiumAccess', () => {
  beforeEach(async () => {
    resetBillingProviderForTests();
    await AsyncStorage.removeItem('@identity-shift/entitlement-premium-v1');
  });

  it('is false without purchase', async () => {
    await expect(hasPremiumAccess()).resolves.toBe(false);
  });

  it('is true after mock purchase flag', async () => {
    await AsyncStorage.setItem('@identity-shift/entitlement-premium-v1', 'true');
    resetBillingProviderForTests();
    await expect(hasPremiumAccess()).resolves.toBe(true);
  });
});
