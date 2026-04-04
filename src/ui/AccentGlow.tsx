import { StyleSheet, View } from 'react-native';
import { theme } from './theme';

type Props = {
  /** 0–1 intensity */
  intensity?: number;
};

/**
 * Soft ambient orb (decorative only). Pointer events none.
 */
export function AccentGlow({ intensity = 1 }: Props) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.orb,
        {
          opacity: 0.06 * intensity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    top: '8%',
    alignSelf: 'center',
    width: '120%',
    aspectRatio: 1,
    maxHeight: 420,
    borderRadius: 999,
    backgroundColor: theme.accent,
  },
});
