/**
 * Dashboard-oriented helpers (client-side markers; server aggregates separately).
 */
export type RetentionMarker = 'D1' | 'D3' | 'D7';

export function retentionMarkerForCompletedDays(count: number): RetentionMarker | null {
  if (count >= 7) return 'D7';
  if (count >= 3) return 'D3';
  if (count >= 1) return 'D1';
  return null;
}

export function completionRate(completed: number, started: number): number {
  if (started <= 0) return 0;
  return Math.min(1, completed / started);
}

export function paywallConversion(
  purchases: number,
  paywallViews: number
): number {
  if (paywallViews <= 0) return 0;
  return Math.min(1, purchases / paywallViews);
}
