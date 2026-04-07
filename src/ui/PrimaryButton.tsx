import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, theme } from './theme';

const PRESS_SCALE = 0.97;
const PRESS_MS = 120;

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Larger touch target + type for signature CTAs (e.g. Home). */
  size?: 'default' | 'large';
  /**
   * Home primary CTA: 52px height, 16px radius, press scale 0.97
   */
  variant?: 'default' | 'home';
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  size = 'default',
  variant = 'default',
}: PrimaryButtonProps) {
  const large = size === 'large';
  const home = variant === 'home';
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (disabled) return;
    Animated.timing(scale, {
      toValue: PRESS_SCALE,
      duration: PRESS_MS,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: PRESS_MS,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.pressableWrap}
    >
      <Animated.View
        style={[
          styles.outer,
          large && styles.outerLarge,
          home && styles.outerHome,
          disabled && styles.disabledOuter,
          { transform: [{ scale }] },
        ]}
      >
        <LinearGradient
          colors={
            disabled
              ? [theme.backgroundSecondary, theme.backgroundSecondary]
              : home
                ? ['rgba(124, 154, 255, 0.88)', 'rgba(34, 211, 238, 0.72)']
                : ['rgba(124, 154, 255, 0.82)', 'rgba(34, 211, 238, 0.65)']
          }
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.gradient,
            large && styles.gradientLarge,
            home && styles.gradientHome,
          ]}
        >
          <Text style={[styles.label, large && styles.labelLarge]}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableWrap: {
    alignSelf: 'stretch',
  },
  outer: {
    borderRadius: theme.radiusMd,
    overflow: 'hidden',
    minHeight: 52,
    alignSelf: 'stretch',
  },
  outerLarge: {
    borderRadius: theme.radiusLg,
    minHeight: 56,
  },
  outerHome: {
    borderRadius: 16,
    minHeight: 52,
  },
  disabledOuter: {
    opacity: 0.45,
  },
  gradient: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.radiusMd,
  },
  gradientLarge: {
    minHeight: 56,
    paddingHorizontal: theme.radiusLg,
  },
  gradientHome: {
    minHeight: 52,
    borderRadius: 16,
  },
  label: {
    color: theme.text,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.medium,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  labelLarge: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.medium,
  },
});
