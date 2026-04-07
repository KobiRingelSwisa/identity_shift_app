import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadProgress } from '../storage/progress';
import type { ProgramProgressSnapshot, SaveAnchorPayload, SessionRun, UserProfile } from './types';
import { appendSessionRun, readSessionRuns } from './sessionRunStorage';

const USER_KEY = '@identity-shift/backend-user-v1';
const ANCHOR_PREFIX = '@identity-shift/saved-anchor/';

function randomId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export class LocalBackendAdapter {
  async getUserProfile(): Promise<UserProfile | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  async upsertUserProfile(partial: Partial<UserProfile>): Promise<UserProfile> {
    const cur = (await this.getUserProfile()) ?? {
      id: randomId(),
      createdAtIso: new Date().toISOString(),
    };
    const next: UserProfile = { ...cur, ...partial };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(next));
    return next;
  }

  async getProgramProgress(
    trackDurationDays: number
  ): Promise<ProgramProgressSnapshot> {
    const p = await loadProgress(trackDurationDays);
    return {
      onboardingDone: p.onboardingDone,
      commitmentDays: p.commitmentDays,
      currentDay: p.currentDay,
      completedDays: p.completedDays,
      streak: p.streak,
      lastCompletedDate: p.lastCompletedDate,
      lastSessionCalendarDate: p.lastSessionCalendarDate,
      lastCompletedTrackDay: p.lastCompletedTrackDay,
      totalSessionsCompleted: p.totalSessionsCompleted,
    };
  }

  async upsertProgramProgress(
    _trackDurationDays: number,
    _partial: Partial<ProgramProgressSnapshot>
  ): Promise<void> {
    /** Reserved for future sync; progress still flows through `src/storage/progress.ts`. */
  }

  async createSessionRun(run: SessionRun): Promise<void> {
    await appendSessionRun(run);
  }

  async listSessionRuns(limit?: number): Promise<SessionRun[]> {
    return readSessionRuns(limit);
  }

  async saveAnchor(payload: SaveAnchorPayload): Promise<void> {
    const key = `${ANCHOR_PREFIX}${payload.programId}-${payload.day}`;
    await AsyncStorage.setItem(
      key,
      JSON.stringify({
        ...payload,
        savedAtIso: new Date().toISOString(),
      })
    );
  }

  async listSavedAnchors(programId?: string): Promise<SaveAnchorPayload[]> {
    const keys = await AsyncStorage.getAllKeys();
    const prefix = ANCHOR_PREFIX;
    const anchorKeys = keys.filter(
      (k) =>
        k.startsWith(prefix) &&
        (programId == null || k.startsWith(`${prefix}${programId}-`))
    );
    if (anchorKeys.length === 0) return [];
    const pairs = await AsyncStorage.multiGet(anchorKeys);
    const out: SaveAnchorPayload[] = [];
    for (const [, val] of pairs) {
      if (!val) continue;
      try {
        const parsed = JSON.parse(val) as SaveAnchorPayload & {
          savedAtIso?: string;
        };
        out.push({
          programId: parsed.programId,
          day: parsed.day,
          text: parsed.text,
        });
      } catch {
        /* skip */
      }
    }
    return out.sort((a, b) => a.day - b.day);
  }
}
