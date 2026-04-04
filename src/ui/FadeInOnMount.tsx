import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

type Props = PropsWithChildren<{
  delayMs?: number;
  durationMs?: number;
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Entry opacity for text blocks — small motion, no navigation change.
 */
export function FadeInOnMount({
  children,
  delayMs = 0,
  durationMs = 320,
  style,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: durationMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, delayMs);
    return () => clearTimeout(t);
  }, [delayMs, durationMs, opacity]);

  return (
    <Animated.View style={[style, { opacity }]}>{children}</Animated.View>
  );
}
