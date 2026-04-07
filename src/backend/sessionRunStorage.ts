import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SessionRun } from './types';

const SESSION_RUNS_KEY = '@identity-shift/session-runs-v1';

export async function appendSessionRun(run: SessionRun): Promise<void> {
  const raw = await AsyncStorage.getItem(SESSION_RUNS_KEY);
  const list: SessionRun[] = raw ? JSON.parse(raw) : [];
  list.push(run);
  await AsyncStorage.setItem(SESSION_RUNS_KEY, JSON.stringify(list));
}

export async function readSessionRuns(limit = 500): Promise<SessionRun[]> {
  const raw = await AsyncStorage.getItem(SESSION_RUNS_KEY);
  const list: SessionRun[] = raw ? JSON.parse(raw) : [];
  return list.slice(-limit);
}
