import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StepRenderer } from './StepRenderer';
import { SessionStepFade } from './SessionStepFade';
import type { Step } from './types';
import type { SessionAnswers } from './sessionAnswers';
import { theme } from '../ui/theme';

export type SessionEngineProps = {
  steps: Step[];
  onSessionComplete?: () => void;
};

export function SessionEngine({ steps, onSessionComplete }: SessionEngineProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  /** In-memory only; not read in MVP — see sessionAnswers.ts */
  const answersRef = useRef<SessionAnswers>({});

  const total = steps.length;
  const step = steps[currentStepIndex];

  const recordAnswer = useCallback((key: string, value: string) => {
    answersRef.current = { ...answersRef.current, [key]: value };
  }, []);

  const goNext = useCallback(() => {
    if (currentStepIndex >= total - 1) {
      onSessionComplete?.();
      return;
    }
    setCurrentStepIndex((i) => i + 1);
  }, [currentStepIndex, onSessionComplete, total]);

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
