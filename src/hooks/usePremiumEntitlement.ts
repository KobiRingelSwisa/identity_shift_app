import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { hasPremiumAccess } from '../billing/entitlements';
import { subscribeBillingRefresh } from '../billing/billingRefresh';

export function usePremiumEntitlement() {
  const [premium, setPremium] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const p = await hasPremiumAccess();
      setPremium(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => subscribeBillingRefresh(refresh), [refresh]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') void refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  return { premium, loading, refresh };
}
