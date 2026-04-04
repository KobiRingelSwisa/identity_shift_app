import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Shared layered background — matches MainHome hero + Anchor (ambient, low contrast).
 */
export function RitualBackdrop() {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <LinearGradient
        colors={['#0B0F1A', '#111827', 'rgba(22, 24, 42, 0.97)']}
        locations={[0, 0.5, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[
          'transparent',
          'rgba(124, 154, 255, 0.05)',
          'rgba(34, 211, 238, 0.035)',
        ]}
        start={{ x: 0.5, y: 0.15 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
  },
});
