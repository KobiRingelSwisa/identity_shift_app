import { StyleSheet, View } from 'react-native';
import { theme } from './theme';

/**
 * Static dual glow — same proportions as MainHome hero (completion / closure screens).
 */
export function RitualAmbientOrbs() {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.glowAccent} />
      <View style={styles.glowCool} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
  },
  glowAccent: {
    position: 'absolute',
    alignSelf: 'center',
    top: '10%',
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: theme.accent,
    opacity: 0.055,
  },
  glowCool: {
    position: 'absolute',
    alignSelf: 'center',
    top: '22%',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: theme.accentGlow,
    opacity: 0.04,
  },
});
