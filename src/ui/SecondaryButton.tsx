import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { fonts, theme } from './theme';

const PRESS_SCALE = 0.97;
const PRESS_MS = 120;

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function SecondaryButton({ label, onPress, disabled }: Props) {
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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.pressableWrap}
    >
      <Animated.View
        style={[
          styles.base,
          disabled && styles.disabled,
          { transform: [{ scale }] },
        ]}
      >
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableWrap: {
    alignSelf: 'stretch',
  },
  base: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: theme.radiusMd,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.38,
  },
  label: {
    color: theme.textSecondary,
    fontSize: 16,
    fontFamily: fonts.medium,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  labelDisabled: {
    color: theme.textMuted,
  },
});
