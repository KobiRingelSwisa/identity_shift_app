import { StyleSheet, Text, View } from 'react-native';
import { theme, typography } from './theme';

type Props = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 12,
  },
  title: {
    ...typography.caption,
    fontSize: 12,
    letterSpacing: 0.8,
    color: theme.textMuted,
    textTransform: 'none',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sub: {
    ...typography.body,
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
