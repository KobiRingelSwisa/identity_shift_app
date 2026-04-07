import { CRITICAL_ANALYTICS_EVENTS } from '../src/analytics/events';

describe('CRITICAL_ANALYTICS_EVENTS', () => {
  it('includes session lifecycle', () => {
    expect(CRITICAL_ANALYTICS_EVENTS.has('session_started')).toBe(true);
    expect(CRITICAL_ANALYTICS_EVENTS.has('session_completed')).toBe(true);
  });
});
