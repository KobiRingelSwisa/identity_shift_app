import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from './theme';
import { AnimatedGradientBackground } from './AnimatedGradientBackground';

type ScreenLayoutProps = PropsWithChildren<{
  footer?: ReactNode;
  /** When set, draws animated gradient behind content instead of flat background. */
  background?: 'solid' | 'gradient';
}>;

export function ScreenLayout({
  children,
  footer,
  background = 'solid',
}: ScreenLayoutProps) {
  return (
    <View style={styles.wrap}>
      {background === 'gradient' ? <AnimatedGradientBackground /> : null}
      <View
        style={[
          styles.root,
          background === 'gradient' && styles.rootTransparent,
        ]}
      >
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {footer != null ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    position: 'relative',
  },
  root: {
    flex: 1,
    direction: 'rtl',
    backgroundColor: theme.background,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  rootTransparent: {
    backgroundColor: 'transparent',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 16,
    gap: 16,
  },
  footer: {
    paddingTop: 8,
  },
});
