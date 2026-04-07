import { useCallback, useEffect, useState } from 'react';
import { getBillingProvider } from './getBillingProvider';
import type { BillingOfferings } from './types';

export type UseBillingState = {
  offerings: BillingOfferings | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useBilling(): UseBillingState {
  const [offerings, setOfferings] = useState<BillingOfferings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const o = await getBillingProvider().getOfferings();
      setOfferings(o);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown');
      setOfferings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { offerings, loading, error, refresh };
}
