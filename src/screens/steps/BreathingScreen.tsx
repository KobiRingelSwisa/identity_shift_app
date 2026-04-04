import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../ui/PrimaryButton';
import type { BreathingStep } from '../../session/types';
import { theme, typography } from '../../ui/theme';

type Props = {
  step: BreathingStep;
  onNext: () => void;
};

export function BreathingScreen({ step, onNext }: Props) {
  const insets = useSafeAreaInsets();
  const scale = useRef(new Animated.Value(0.88)).current;
  const textOpacity = useRef(new Animated.Value(0.4)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);
  const [canContinue, setCanContinue] = useState(false);

  const cycleMs = Math.max(4, step.duration) * 1000;
  const half = cycleMs / 2;

  useEffect(() => {
    setCanContinue(false);
    footerOpacity.setValue(0);
    const t = setTimeout(() => {
      setCanContinue(true);
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, cycleMs);
    return () => clearTimeout(t);
  }, [cycleMs, step.text, footerOpacity]);

  useEffect(() => {
    scale.setValue(0.88);
    textOpacity.setValue(0.4);
    loopRef.current?.stop();
    const breath = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.15,
            duration: half,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.88,
            duration: half,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: half,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 0.35,
            duration: half,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loopRef.current = breath;
    breath.start();
    return () => {
      breath.stop();
      loopRef.current = null;
    };
  }, [half, scale, textOpacity, step.text, step.duration]);

  return (
    <LinearGradient
      colors={[...theme.gradientBase]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.gradient}
    >
      <View
        style={[
          styles.root,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <Text style={styles.whisper}>רגע לעצמך</Text>
        <View style={styles.stage}>
          <Animated.View
            style={[
              styles.ringOuter,
              {
                transform: [{ scale }],
              },
            ]}
          />
          <View style={styles.ringInner} />
          <Animated.Text style={[styles.instruction, { opacity: textOpacity }]}>
            {step.text}
          </Animated.Text>
        </View>
        <View style={styles.footer}>
          {!canContinue ? (
            <Text style={styles.waitHint}>נשימה מלאה אחת — בלי למהר</Text>
          ) : null}
          <Animated.View
            pointerEvents={canContinue ? 'auto' : 'none'}
            style={{ opacity: footerOpacity, alignSelf: 'stretch' }}
          >
            <PrimaryButton
              label="המשך"
              onPress={onNext}
              disabled={!canContinue}
            />
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  );
}

const RING = 216;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  root: {
    flex: 1,
    direction: 'rtl',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  whisper: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 1.5,
    borderColor: theme.breathRing,
    backgroundColor: theme.breathGlow,
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  ringInner: {
    position: 'absolute',
    width: RING * 0.58,
    height: RING * 0.58,
    borderRadius: (RING * 0.58) / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  instruction: {
    marginTop: RING * 0.42,
    color: theme.text,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    writingDirection: 'rtl',
    paddingHorizontal: 12,
    maxWidth: 320,
  },
  footer: {
    paddingTop: 8,
    gap: 10,
    alignItems: 'stretch',
  },
  waitHint: {
    ...typography.caption,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
