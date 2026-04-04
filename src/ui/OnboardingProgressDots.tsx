import { StyleSheet, Text, View } from 'react-native';
import { theme, typography } from './theme';

type Props = {
  current: number;
  total: number;
};

export function OnboardingProgressDots({ current, total }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{`${current + 1} · ${total}`}</Text>
      <View style={styles.row}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[styles.dot, i <= current && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 8,
  },
  label: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
    writingDirection: 'rtl',
  },
  row: {
    flexDirection: 'row-reverse',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dotActive: {
    backgroundColor: theme.accent,
    width: 22,
    borderRadius: 4,
  },
});
