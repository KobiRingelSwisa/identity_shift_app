import { StyleSheet, Text, View } from 'react-native';
import { theme, typography } from './theme';

type Props = {
  children: string;
};

export function MotivationalQuoteBlock({ children }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRightWidth: 2,
    borderRightColor: theme.accent,
    paddingRight: 14,
    paddingVertical: 4,
    alignSelf: 'stretch',
  },
  text: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 24,
    color: theme.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontStyle: 'italic',
  },
});
