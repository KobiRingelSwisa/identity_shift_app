import { getBillingProvider } from './getBillingProvider';
import { ENTITLEMENT_PREMIUM } from './types';

export async function hasPremiumAccess(): Promise<boolean> {
  const s = await getBillingProvider().getCustomerState();
  return s.entitlements.includes(ENTITLEMENT_PREMIUM) || s.isPremium;
}

/** Reserved for future tracks (e.g. money) — premium unlocks extras, base track stays usable. */
export async function canAccessPremiumTracks(): Promise<boolean> {
  return hasPremiumAccess();
}
