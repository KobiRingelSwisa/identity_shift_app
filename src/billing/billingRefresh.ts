/** Lightweight pub/sub so entitlement UI updates after purchase/restore without remounting the tree. */
const listeners = new Set<() => void>();

export function subscribeBillingRefresh(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function notifyBillingRefresh(): void {
  listeners.forEach((cb) => {
    cb();
  });
}
