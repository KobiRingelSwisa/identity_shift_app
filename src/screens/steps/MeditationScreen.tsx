import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../ui/PrimaryButton';
import type { MeditationStep } from '../../session/types';
import { theme, typography } from '../../ui/theme';
import { useMeditationSound } from '../../hooks/useMeditationSound';

type Props = {
  step: MeditationStep;
  onNext: () => void;
};

export function MeditationScreen({ step, onNext }: Props) {
  const insets = useSafeAreaInsets();
  const total = Math.max(1, step.duration);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, step.duration)
  );
  const canContinue = secondsLeft <= 0;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useMeditationSound(step.audio);

  const progress = useMemo(
    () => 1 - secondsLeft / total,
    [secondsLeft, total]
  );

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  useEffect(() => {
    setSecondsLeft(Math.max(0, step.duration));
  }, [step.duration, step.text, step.subtext, step.audio]);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const id = setTimeout(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient
      colors={[...theme.gradientBase]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <View
        style={[
          styles.inner,
          {
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.timerLabel} accessibilityLiveRegion="polite">
            {canContinue ? 'אפשר להמשיך בקצב שלך' : formatTime(secondsLeft)}
          </Text>
          <View style={styles.track}>
            <Animated.View style={[styles.trackFill, { width: barWidth }]} />
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.guide}>היה כאן — בלי לבצע</Text>
          <Text style={styles.title}>{step.text}</Text>
          <Text style={styles.sub}>{step.subtext}</Text>
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            label="המשך"
            onPress={onNext}
            disabled={!canContinue}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  inner: {
    flex: 1,
    direction: 'rtl',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'stretch',
    paddingBottom: 12,
    gap: 10,
  },
  timerLabel: {
    ...typography.caption,
    fontSize: 14,
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  track: {
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: 'rgba(124, 154, 255, 0.5)',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
  },
  guide: {
    ...typography.caption,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  title: {
    color: theme.text,
    fontSize: 23,
    fontWeight: '500',
    lineHeight: 32,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sub: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  footer: {
    paddingTop: 8,
  },
});
