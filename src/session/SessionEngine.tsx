import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StepRenderer } from './StepRenderer';
import { SessionStepFade } from './SessionStepFade';
import type { Step } from './types';
import type { SessionAnswers } from './sessionAnswers';
import type { SessionRun } from '../backend/types';
import { buildSessionStepRuns } from './buildSessionRun';
import { getStepId } from './stepIds';
import { trackEvent } from '../analytics/track';
import { theme } from '../ui/theme';

export type SessionEngineProps = {
  steps: Step[];
  programId: string;
  day: number;
  onSessionComplete?: (run: SessionRun) => void | Promise<void>;
};

export function SessionEngine({
  steps,
  programId,
  day,
  onSessionComplete,
}: SessionEngineProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const answersRef = useRef<SessionAnswers>({});
  const startedAtRef = useRef<string>(new Date().toISOString());
  const completedRef = useRef(false);
  const lastIndexRef = useRef(0);
  const dayRef = useRef(day);
  dayRef.current = day;

  const total = steps.length;
  const step = steps[currentStepIndex];

  useEffect(() => {
    lastIndexRef.current = currentStepIndex;
  }, [currentStepIndex]);

  useEffect(() => {
    const s = steps[currentStepIndex];
    if (!s) return;
    void trackEvent('step_viewed', {
      step_id: getStepId(s, currentStepIndex),
      step_type: s.type,
      day,
      index: currentStepIndex,
    });
  }, [currentStepIndex, day, steps]);

  useEffect(() => {
    return () => {
      if (!completedRef.current) {
        void trackEvent('session_abandoned', {
          day: dayRef.current,
          last_step_index: lastIndexRef.current,
        });
      }
    };
  }, []);

  const recordAnswer = useCallback(
    (key: string, value: string) => {
      answersRef.current = { ...answersRef.current, [key]: value };
      if (!key.startsWith('feedback-')) {
        void trackEvent('choice_selected', {
          step_id: key,
          day,
          value,
        });
      }
    },
    [day]
  );

  const goNext = useCallback(() => {
    if (currentStepIndex >= total - 1) {
      completedRef.current = true;
      const run: SessionRun = {
        runId: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        startedAt: startedAtRef.current,
        completedAt: new Date().toISOString(),
        programId,
        day,
        steps: buildSessionStepRuns(steps, answersRef.current),
      };
      void Promise.resolve(onSessionComplete?.(run));
      return;
    }
    setCurrentStepIndex((i) => i + 1);
  }, [
    currentStepIndex,
    day,
    onSessionComplete,
    programId,
    steps,
    total,
  ]);

  if (!step) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>אין שלבים להצגה</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.progress}>{`שלב ${currentStepIndex + 1} מתוך ${total}`}</Text>
      </View>
      <View style={styles.body}>
        <SessionStepFade stepKey={currentStepIndex}>
          <StepRenderer
            step={step}
            stepIndex={currentStepIndex}
            onNext={goNext}
            onRecordAnswer={recordAnswer}
          />
        </SessionStepFade>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    direction: 'rtl',
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 8,
  },
  progress: {
    color: theme.textSecondary,
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  body: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
  },
  muted: {
    color: theme.textSecondary,
    fontSize: 16,
    writingDirection: 'rtl',
  },
});
