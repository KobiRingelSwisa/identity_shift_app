import { useCallback, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  completeDay,
  loadProgress,
  saveOnboardingDone,
  type AppProgress,
  type CommitmentLength,
} from '../storage/progress';
import type { ConfidenceProgram } from '../session/types';
import { getAnchorTextForDay } from '../session/loadProgram';
import { trackEvent } from '../analytics/track';
import { getBackend } from '../backend';
import type { SessionRun } from '../backend/types';

type UseAppFlowArgs = {
  program: ConfidenceProgram;
  progress: AppProgress | null;
  refreshProgress: () => Promise<void>;
};

export type PostSessionPayload = {
  day: number;
  anchorText: string;
  streak: number;
  completedDaysCount: number;
  trackDays: number;
  totalSessionsCompleted: number;
};

export type PaywallTriggerReason = 'day_2' | 'day_7';

export function useAppFlow({ program, progress, refreshProgress }: UseAppFlowArgs) {
  const [inSession, setInSession] = useState(false);
  const [showTrackComplete, setShowTrackComplete] = useState(false);
  const [postSession, setPostSession] = useState<PostSessionPayload | null>(null);
  const [paywallTrigger, setPaywallTrigger] = useState<PaywallTriggerReason | null>(
    null
  );

  const pendingPaywallAfterPostRef = useRef(false);
  const pendingPaywallAfterTrackRef = useRef(false);

  const handleOnboardingDone = useCallback(
    async (commitment: CommitmentLength) => {
      await saveOnboardingDone(commitment);
      await trackEvent('onboarding_completed', {
        commitment_days: commitment,
      });
      await refreshProgress();
    },
    [refreshProgress]
  );

  const startSession = useCallback(() => {
    void trackEvent('session_started', {
      day: Math.min(progress?.currentDay ?? 1, program.track.duration_days),
    });
    setInSession(true);
  }, [progress?.currentDay, program.track.duration_days]);

  const handleSessionComplete = useCallback(
    async (run: SessionRun) => {
      if (!progress) return;

      const dayToComplete = Math.min(
        progress.currentDay,
        program.track.duration_days
      );

      await getBackend().createSessionRun(run);

      const anchorText =
        getAnchorTextForDay(program, dayToComplete) ?? 'נשימה. נוכחות.';
      await getBackend().saveAnchor({
        programId: program.track.id,
        day: dayToComplete,
        text: anchorText,
      });

      await trackEvent('session_completed', { day: dayToComplete });

      const outcome = await completeDay(dayToComplete, program.track.duration_days);

      await trackEvent('day_completed', { day: outcome.completedDay });

      if (outcome.streakAfter !== outcome.streakBefore) {
        await trackEvent('streak_updated', {
          streak: outcome.streakAfter,
        });
      }

      setInSession(false);
      await refreshProgress();

      if (dayToComplete === program.track.duration_days) {
        pendingPaywallAfterTrackRef.current = true;
        setShowTrackComplete(true);
        return;
      }

      if (dayToComplete === 2) {
        pendingPaywallAfterPostRef.current = true;
      }

      const fresh = await loadProgress(program.track.duration_days);

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPostSession({
        day: dayToComplete,
        anchorText,
        streak: outcome.streakAfter,
        completedDaysCount: fresh.completedDays.length,
        trackDays: program.track.duration_days,
        totalSessionsCompleted: fresh.totalSessionsCompleted,
      });
    },
    [progress, program, refreshProgress]
  );

  const dismissTrackComplete = useCallback(() => {
    setShowTrackComplete(false);
    if (pendingPaywallAfterTrackRef.current) {
      pendingPaywallAfterTrackRef.current = false;
      setPaywallTrigger('day_7');
    }
  }, []);

  const homeFromPostSession = useCallback(() => {
    setPostSession(null);
    if (pendingPaywallAfterPostRef.current) {
      pendingPaywallAfterPostRef.current = false;
      setPaywallTrigger('day_2');
    }
  }, []);

  const dismissPaywall = useCallback(() => {
    setPaywallTrigger(null);
  }, []);

  const replayFromPostSession = useCallback(() => {
    const d = postSession?.day ?? progress?.currentDay ?? 1;
    void trackEvent('session_started', { day: d });
    setPostSession(null);
    setInSession(true);
  }, [postSession?.day, progress?.currentDay]);

  return {
    inSession,
    showTrackComplete,
    postSession,
    paywallTrigger,
    handleOnboardingDone,
    startSession,
    handleSessionComplete,
    dismissTrackComplete,
    homeFromPostSession,
    replayFromPostSession,
    dismissPaywall,
  };
}
