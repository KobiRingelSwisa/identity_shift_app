import {
  isDailyNextLocked,
  normalizeProgressForDailyUnlock,
  type AppProgress,
} from '../src/storage/progress';

describe('progress helpers', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-07T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('normalizeProgressForDailyUnlock', () => {
    it('advances currentDay when a new calendar day starts after a non-final completion', () => {
      const p: AppProgress = {
        onboardingDone: true,
        commitmentDays: 7,
        currentDay: 1,
        completedDays: [1],
        streak: 1,
        lastCompletedDate: '2026-04-06',
        lastSessionCalendarDate: '2026-04-06',
        lastCompletedTrackDay: 1,
        totalSessionsCompleted: 1,
      };
      const next = normalizeProgressForDailyUnlock(p, 7);
      expect(next.currentDay).toBe(2);
    });
  });

  describe('isDailyNextLocked', () => {
    it('returns false when no session completed today', () => {
      const p: AppProgress = {
        onboardingDone: true,
        commitmentDays: 7,
        currentDay: 2,
        completedDays: [1],
        streak: 1,
        lastCompletedDate: '2026-04-06',
        lastSessionCalendarDate: '2026-04-06',
        lastCompletedTrackDay: 1,
        totalSessionsCompleted: 1,
      };
      expect(isDailyNextLocked(p, 7)).toBe(false);
    });

    it('returns true when same calendar day completed a non-final track day', () => {
      const p: AppProgress = {
        onboardingDone: true,
        commitmentDays: 7,
        currentDay: 2,
        completedDays: [1],
        streak: 1,
        lastCompletedDate: '2026-04-07',
        lastSessionCalendarDate: '2026-04-07',
        lastCompletedTrackDay: 1,
        totalSessionsCompleted: 1,
      };
      expect(isDailyNextLocked(p, 7)).toBe(true);
    });
  });
});
