import type { PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';
import { typography } from './theme';

export function BodyText({ children }: PropsWithChildren) {
  return <Text style={styles.text}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...typography.body,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
