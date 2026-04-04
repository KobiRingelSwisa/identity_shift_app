import AsyncStorage from '@react-native-async-storage/async-storage';
import { toYMD } from '../utils/date';

const KEYS = {
  onboardingDone: '@identity-shift/onboarding-done',
  commitmentDays: '@identity-shift/commitment-days',
  currentDay: '@identity-shift/current-day',
  completedDays: '@identity-shift/completed-days',
  streak: '@identity-shift/streak',
  lastCompletedDate: '@identity-shift/last-completed-date',
  lastSessionCalendarDate: '@identity-shift/last-session-calendar-date',
  lastCompletedTrackDay: '@identity-shift/last-completed-track-day',
  /** Total count of completed sessions (each run-through of a day’s session). */
  totalSessionsCompleted: '@identity-shift/total-sessions-completed',
} as const;

export type CommitmentLength = 3 | 7 | 14;

export type AppProgress = {
  onboardingDone: boolean;
  commitmentDays: CommitmentLength | null;
  currentDay: number;
  completedDays: number[];
  streak: number;
  /** Calendar date (YYYY-MM-DD) of last streak-relevant completion (legacy + streak). */
  lastCompletedDate: string | null;
  /** Calendar date of last full session completion. */
  lastSessionCalendarDate: string | null;
  /** Track day number (1–7) completed in that last session. */
  lastCompletedTrackDay: number | null;
  /** Cumulative session completions (including replays); lightweight history metric. */
  totalSessionsCompleted: number;
};

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function bumpStreak(
  lastCompletedDate: string | null,
  prevStreak: number
): number {
  const today = toYMD(new Date());
  if (lastCompletedDate === today) {
    return prevStreak;
  }
  if (!lastCompletedDate) {
    return 1;
  }
  const yesterday = toYMD(addDays(new Date(), -1));
  if (lastCompletedDate === yesterday) {
    return prevStreak + 1;
  }
  return 1;
}

/**
 * After a new calendar day, advance `currentDay` to the next track day if the user had
 * finished the previous day on an earlier date (daily lock).
 */
export function normalizeProgressForDailyUnlock(
  p: AppProgress,
  trackDurationDays: number
): AppProgress {
  const today = toYMD(new Date());
  if (
    p.lastSessionCalendarDate != null &&
    p.lastCompletedTrackDay != null &&
    p.lastCompletedTrackDay < trackDurationDays &&
    today > p.lastSessionCalendarDate
  ) {
    const next = p.lastCompletedTrackDay + 1;
    return { ...p, currentDay: Math.min(next, trackDurationDays + 1) };
  }
  return p;
}

export async function loadProgress(
  trackDurationDays: number = 7
): Promise<AppProgress> {
  try {
    const [
      onboardingDone,
      commitmentRaw,
      currentDayRaw,
      completedDaysRaw,
      streakRaw,
      lastCompletedDate,
      lastSessionCalendarDateRaw,
      lastCompletedTrackDayRaw,
      totalSessionsRaw,
    ] = await Promise.all([
      AsyncStorage.getItem(KEYS.onboardingDone),
      AsyncStorage.getItem(KEYS.commitmentDays),
      AsyncStorage.getItem(KEYS.currentDay),
      AsyncStorage.getItem(KEYS.completedDays),
      AsyncStorage.getItem(KEYS.streak),
      AsyncStorage.getItem(KEYS.lastCompletedDate),
      AsyncStorage.getItem(KEYS.lastSessionCalendarDate),
      AsyncStorage.getItem(KEYS.lastCompletedTrackDay),
      AsyncStorage.getItem(KEYS.totalSessionsCompleted),
    ]);

    const c = commitmentRaw ? parseInt(commitmentRaw, 10) : NaN;
    const commitmentDays: CommitmentLength | null =
      c === 3 || c === 7 || c === 14 ? c : null;

    const completedDays: number[] = completedDaysRaw
      ? JSON.parse(completedDaysRaw)
      : [];

    let lastSessionCalendarDate = lastSessionCalendarDateRaw;
    let lastCompletedTrackDay = lastCompletedTrackDayRaw
      ? parseInt(lastCompletedTrackDayRaw, 10)
      : null;

    if (lastSessionCalendarDate == null && lastCompletedDate) {
      lastSessionCalendarDate = lastCompletedDate;
    }
    if (lastCompletedTrackDay == null && completedDays.length > 0) {
      lastCompletedTrackDay = Math.max(...completedDays);
    }

    let currentDay = currentDayRaw ? parseInt(currentDayRaw, 10) : 1;

    const totalSessionsCompleted = totalSessionsRaw
      ? parseInt(totalSessionsRaw, 10)
      : 0;

    const base: AppProgress = {
      onboardingDone: onboardingDone === 'true',
      commitmentDays,
      currentDay,
      completedDays,
      streak: streakRaw ? parseInt(streakRaw, 10) : 0,
      lastCompletedDate,
      lastSessionCalendarDate,
      lastCompletedTrackDay,
      totalSessionsCompleted: Number.isFinite(totalSessionsCompleted)
        ? totalSessionsCompleted
        : 0,
    };

    const merged = normalizeProgressForDailyUnlock(base, trackDurationDays);
    if (merged.currentDay !== currentDay) {
      await AsyncStorage.setItem(KEYS.currentDay, String(merged.currentDay));
    }
    return merged;
  } catch {
    return {
      onboardingDone: false,
      commitmentDays: null,
      currentDay: 1,
      completedDays: [],
      streak: 0,
      lastCompletedDate: null,
      lastSessionCalendarDate: null,
      lastCompletedTrackDay: null,
      totalSessionsCompleted: 0,
    };
  }
}

export async function saveOnboardingDone(
  commitmentDays: CommitmentLength
): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.onboardingDone, 'true'],
    [KEYS.commitmentDays, String(commitmentDays)],
  ]);
}

export type CompleteDayOutcome = {
  completedDay: number;
  streakBefore: number;
  streakAfter: number;
};

export async function completeDay(
  finishedDay: number,
  trackDurationDays: number
): Promise<CompleteDayOutcome> {
  const p = await loadProgress(trackDurationDays);
  const alreadyHad = p.completedDays.includes(finishedDay);
  const streakBefore = p.streak;
  const completedDays = alreadyHad
    ? p.completedDays
    : [...p.completedDays, finishedDay].sort((a, b) => a - b);

  const today = toYMD(new Date());
  const streakAfter = alreadyHad
    ? p.streak
    : bumpStreak(p.lastCompletedDate, p.streak);

  const lastCompletedDate = today;

  const totalSessionsCompleted = (p.totalSessionsCompleted ?? 0) + 1;

  let newCurrentDay: number;
  if (finishedDay >= trackDurationDays) {
    newCurrentDay = trackDurationDays + 1;
  } else {
    newCurrentDay = finishedDay;
  }

  await AsyncStorage.multiSet([
    [KEYS.completedDays, JSON.stringify(completedDays)],
    [KEYS.streak, String(streakAfter)],
    [KEYS.lastCompletedDate, lastCompletedDate],
    [KEYS.currentDay, String(newCurrentDay)],
    [KEYS.lastSessionCalendarDate, today],
    [KEYS.lastCompletedTrackDay, String(finishedDay)],
    [KEYS.totalSessionsCompleted, String(totalSessionsCompleted)],
  ]);

  return {
    completedDay: finishedDay,
    streakBefore,
    streakAfter,
  };
}

/** True after completing a non-final day today — replay allowed; next track day opens next calendar day. */
export function isDailyNextLocked(
  p: AppProgress,
  trackDurationDays: number
): boolean {
  const today = toYMD(new Date());
  if (p.lastSessionCalendarDate !== today || p.lastCompletedTrackDay == null) {
    return false;
  }
  if (p.lastCompletedTrackDay >= trackDurationDays) {
    return false;
  }
  return true;
}

/** Clears track progress only (keeps onboarding and commitment). */
export async function resetTrackProgress(): Promise<void> {
  await AsyncStorage.multiRemove([
    KEYS.lastCompletedDate,
    KEYS.lastSessionCalendarDate,
    KEYS.lastCompletedTrackDay,
  ]);
  await AsyncStorage.multiSet([
    [KEYS.currentDay, '1'],
    [KEYS.completedDays, '[]'],
    [KEYS.streak, '0'],
    [KEYS.totalSessionsCompleted, '0'],
  ]);
}
