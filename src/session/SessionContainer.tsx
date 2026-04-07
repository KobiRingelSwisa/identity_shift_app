import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SessionEngine } from './SessionEngine';
import { getDaySteps, loadProgram } from './loadProgram';
import type { ConfidenceProgram } from './types';
import type { SessionRun } from '../backend/types';
import { theme } from '../ui/theme';

export type SessionContainerProps = {
  program?: ConfidenceProgram;
  currentDay: number;
  onSessionComplete?: (run: SessionRun) => void | Promise<void>;
};

export function SessionContainer({
  program: programProp,
  currentDay,
  onSessionComplete,
}: SessionContainerProps) {
  const program = programProp ?? loadProgram();
  const steps = useMemo(
    () => getDaySteps(program, currentDay),
    [program, currentDay]
  );

  if (steps.length === 0) {
    return (
      <View style={styles.centered}>
        <Text
          style={styles.message}
        >{`לא נמצא תוכן ליום ${currentDay}`}</Text>
      </View>
    );
  }

  return (
    <SessionEngine
      steps={steps}
      programId={program.track.id}
      day={currentDay}
      onSessionComplete={onSessionComplete}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
    padding: 24,
  },
  message: {
    color: theme.textSecondary,
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
