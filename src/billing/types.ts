export type BillingPeriod = 'monthly' | 'yearly';

export type BillingPackage = {
  id: string;
  title: string;
  price: string;
  period: BillingPeriod;
};

export type CustomerState = {
  isPremium: boolean;
  entitlements: string[];
};

export const ENTITLEMENT_PREMIUM = 'premium_access';

export type BillingOfferings = {
  monthly: BillingPackage;
  yearly: BillingPackage;
};
