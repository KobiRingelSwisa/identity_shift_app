import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const FADE_MS = 280;

type Props = {
  stepKey: number;
  children: ReactNode;
};

/**
 * Soft fade-in when the active step changes. Presentation-only (no navigation).
 */
export function SessionStepFade({ stepKey, children }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [stepKey, opacity]);

  return (
    <Animated.View style={[styles.wrap, { opacity }]}>{children}</Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
});
