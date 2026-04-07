import type { PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';
import { typography } from './theme';

type TitleProps = PropsWithChildren<{
  variant?: 'hero' | 'screen';
}>;

export function Title({ children, variant = 'screen' }: TitleProps) {
  return (
    <Text
      style={variant === 'hero' ? styles.hero : styles.screen}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  hero: {
    ...typography.heroTitle,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  screen: {
    ...typography.screenTitle,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
