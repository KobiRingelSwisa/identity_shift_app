import type { BillingOfferings, BillingPeriod, CustomerState } from './types';

export type BillingProvider = {
  getOfferings(): Promise<BillingOfferings>;
  purchasePackage(plan: BillingPeriod): Promise<void>;
  restorePurchases(): Promise<void>;
  getCustomerState(): Promise<CustomerState>;
};
