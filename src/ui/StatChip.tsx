import { StyleSheet, Text, View } from 'react-native';
import { theme, typography } from './theme';

type Props = {
  label: string;
  value: string;
};

export function StatChip({ label, value }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radiusSm,
    backgroundColor: theme.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    alignItems: 'flex-end',
    minWidth: 100,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    writingDirection: 'rtl',
  },
  value: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    writingDirection: 'rtl',
  },
});
