import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { ScreenLayout } from '../../ui/ScreenLayout';
import { Title } from '../../ui/Title';
import { BodyText } from '../../ui/BodyText';
import { PrimaryButton } from '../../ui/PrimaryButton';
import type { CompletionStep } from '../../session/types';
import { theme } from '../../ui/theme';

type Props = {
  step: CompletionStep;
  onNext: () => void;
};

const STAGE_MS = 280;
const STAGGER_MS = 150;

function splitCompletionTitle(title: string): { lead: string; rest: string | null } {
  const match = title.match(/^(.+?\.\s*)(.+)$/);
  if (match && match[2].trim().length > 0) {
    return { lead: match[1].trimEnd(), rest: match[2].trim() };
  }
  return { lead: title, rest: null };
}

export function CompletionScreen({ step, onNext }: Props) {
  const { lead, rest } = useMemo(
    () => splitCompletionTitle(step.title),
    [step.title]
  );

  const accentOpacity = useRef(new Animated.Value(0)).current;
  const title1Opacity = useRef(new Animated.Value(0)).current;
  const title2Opacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    accentOpacity.setValue(0);
    title1Opacity.setValue(0);
    title2Opacity.setValue(0);
    subtitleOpacity.setValue(0);
    footerOpacity.setValue(0);

    const hasRest = rest != null;
    const ease = Easing.out(Easing.cubic);
    const timings: Animated.CompositeAnimation[] = [
      Animated.timing(accentOpacity, {
        toValue: 1,
        duration: STAGE_MS,
        delay: 0,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(title1Opacity, {
        toValue: 1,
        duration: STAGE_MS,
        delay: 0,
        easing: ease,
        useNativeDriver: true,
      }),
    ];
    if (hasRest) {
      timings.push(
        Animated.timing(title2Opacity, {
          toValue: 1,
          duration: STAGE_MS,
          delay: STAGGER_MS,
          easing: ease,
          useNativeDriver: true,
        })
      );
    }
    timings.push(
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: STAGE_MS,
        delay: hasRest ? STAGGER_MS * 2 : STAGGER_MS,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: STAGE_MS,
        delay: hasRest ? STAGGER_MS * 3 : STAGGER_MS * 2,
        easing: ease,
        useNativeDriver: true,
      })
    );
    Animated.parallel(timings).start();
  }, [
    step,
    accentOpacity,
    title1Opacity,
    title2Opacity,
    subtitleOpacity,
    footerOpacity,
    rest,
  ]);

  return (
    <ScreenLayout
      background="gradient"
      footer={
        <Animated.View style={{ opacity: footerOpacity, alignSelf: 'stretch' }}>
          <PrimaryButton label={step.cta} onPress={onNext} />
        </Animated.View>
      }
    >
      <View style={styles.block}>
        <Animated.View style={[styles.accentLine, { opacity: accentOpacity }]} />
        <Animated.View style={{ opacity: title1Opacity }}>
          <Title variant="hero">{lead}</Title>
        </Animated.View>
        {rest != null ? (
          <Animated.View style={{ opacity: title2Opacity }}>
            <Title variant="hero">{rest}</Title>
          </Animated.View>
        ) : null}
        <Animated.View style={{ opacity: subtitleOpacity }}>
          <BodyText>{step.subtitle}</BodyText>
        </Animated.View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  accentLine: {
    alignSelf: 'flex-end',
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.accent,
    opacity: 0.65,
    marginBottom: 4,
  },
});
