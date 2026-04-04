import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { theme } from './theme';

type Props = PropsWithChildren<{
  style?: ViewStyle;
  /** Stronger shadow for hero CTAs */
  variant?: 'default' | 'elevated';
}>;

export function PremiumCard({ children, style, variant = 'default' }: Props) {
  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        theme.cardShadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radiusLg,
    backgroundColor: theme.cardSurface,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    padding: theme.radiusMd,
  },
  elevated: {
    backgroundColor: theme.surfaceElevated,
  },
});
