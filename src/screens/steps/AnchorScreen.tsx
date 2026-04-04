import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SecondaryButton } from "../../ui/SecondaryButton";
import type { AnchorStep } from "../../session/types";
import { theme, typography } from "../../ui/theme";

type Props = {
  step: AnchorStep;
  onNext: () => void;
};

const EMPTY_MS = 300;
const TEXT_FADE_MS = 500;
const CTA_AT_MS = 2000;
const CTA_FADE_MS = 340;
const PULSE_START_MS = 800;
const PULSE_HALF_MS = 4500;

/**
 * Phases: empty (300ms) → text fade (500ms) → subtle background pulse → CTA at 2s.
 */
export function AnchorScreen({ step, onNext }: Props) {
  const insets = useSafeAreaInsets();
  const w = Dimensions.get("window").width;
  const maxTextWidth = w * 0.8;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const [ctaReady, setCtaReady] = useState(false);

  useEffect(() => {
    let afterTextTimer: ReturnType<typeof setTimeout> | undefined;
    let ctaTimer: ReturnType<typeof setTimeout> | undefined;

    textOpacity.setValue(0);
    ctaOpacity.setValue(0);
    setCtaReady(false);

    afterTextTimer = setTimeout(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: TEXT_FADE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, EMPTY_MS);

    ctaTimer = setTimeout(() => {
      setCtaReady(true);
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: CTA_FADE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, CTA_AT_MS);

    return () => {
      if (afterTextTimer != null) clearTimeout(afterTextTimer);
      if (ctaTimer != null) clearTimeout(ctaTimer);
    };
  }, [textOpacity, ctaOpacity, step.text]);

  useEffect(() => {
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: PULSE_HALF_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: PULSE_HALF_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.setValue(0);
    startTimer = setTimeout(() => {
      loop.start();
    }, PULSE_START_MS);
    return () => {
      if (startTimer != null) clearTimeout(startTimer);
      loop.stop();
    };
  }, [pulse, step.text]);

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.04, 0.09],
  });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.radialGlow,
          {
            opacity: pulseOpacity,
          },
        ]}
      />

      <View
        style={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom, 32),
          },
        ]}
      >
        <View style={styles.center}>
          <Animated.Text
            style={[
              styles.anchorText,
              { opacity: textOpacity, maxWidth: maxTextWidth },
            ]}
          >
            {step.text}
          </Animated.Text>
        </View>

        <Animated.View style={[styles.footer, { opacity: ctaOpacity }]}>
          <SecondaryButton label="המשך" onPress={onNext} disabled={!ctaReady} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
  radialGlow: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    marginTop: -180,
    width: 360,
    height: 360,
    borderRadius: 999,
    backgroundColor: theme.accent,
  },
  content: {
    flex: 1,
    direction: "rtl",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  anchorText: {
    ...typography.anchor,
    fontSize: 30,
    fontWeight: "500",
    lineHeight: 42,
    color: theme.text,
    textAlign: "center",
    writingDirection: "rtl",
  },
  footer: {
    marginBottom: 32,
    alignSelf: "stretch",
  },
});
