import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SessionRun, SessionStepRun } from './types';

const SESSION_RUNS_KEY = '@identity-shift/session-runs-v1';

/** Migrate legacy `steps` field to `stepResponses`. */
function normalizeSessionRun(raw: unknown): SessionRun {
  const r = raw as SessionRun & { steps?: SessionStepRun[] };
  const stepResponses = r.stepResponses ?? r.steps ?? [];
  return {
    runId: r.runId,
    startedAt: r.startedAt,
    completedAt: r.completedAt,
    programId: r.programId,
    day: r.day,
    stepResponses,
  };
}

export async function appendSessionRun(run: SessionRun): Promise<void> {
  const raw = await AsyncStorage.getItem(SESSION_RUNS_KEY);
  const list: unknown[] = raw ? JSON.parse(raw) : [];
  list.push(run);
  await AsyncStorage.setItem(SESSION_RUNS_KEY, JSON.stringify(list));
}

export async function readSessionRuns(limit = 500): Promise<SessionRun[]> {
  const raw = await AsyncStorage.getItem(SESSION_RUNS_KEY);
  const list: unknown[] = raw ? JSON.parse(raw) : [];
  return list.slice(-limit).map(normalizeSessionRun);
}
