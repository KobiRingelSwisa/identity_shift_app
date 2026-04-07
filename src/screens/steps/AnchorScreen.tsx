import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { SecondaryButton } from "../../ui/SecondaryButton";
import type { AnchorStep } from "../../session/types";
import { fonts, theme } from "../../ui/theme";

type Props = {
  step: AnchorStep;
  onNext: () => void;
};

const ANCHOR_BG = require("../../../assets/images/backgrounds/anchor-bg.png");
const NOISE_OVERLAY = require("../../../assets/images/textures/noise-overlay.png");

/** Phase 1: empty */
const EMPTY_MS = 280;
/** Phase 2: anchor text fade */
const TEXT_FADE_MS = 500;
/** Phase 3: pulse starts after text fade begins */
const PULSE_START_MS = EMPTY_MS + TEXT_FADE_MS;
/** ~4.4s full loop (opacity only), slow */
const PULSE_HALF_MS = 2200;
/** Phase 4: CTA — +100–150ms vs prior for longer pause */
const CTA_AT_MS = 2270;
const CTA_FADE_MS = 420;

/** Glow pulse stays within ~5–8% apparent opacity */
const GLOW_OPACITY_MIN = 0.05;
const GLOW_OPACITY_MAX = 0.08;

/** CTA fade-in caps below full opacity (secondary to anchor) */
const CTA_MAX_OPACITY = 0.9;

export function AnchorScreen({ step, onNext }: Props) {
  const insets = useSafeAreaInsets();

  const textOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const [ctaReady, setCtaReady] = useState(false);

  useEffect(() => {
    let textTimer: ReturnType<typeof setTimeout> | undefined;
    let ctaTimer: ReturnType<typeof setTimeout> | undefined;

    textOpacity.setValue(0);
    ctaOpacity.setValue(0);
    setCtaReady(false);

    textTimer = setTimeout(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: TEXT_FADE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      });
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
      if (textTimer != null) clearTimeout(textTimer);
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
    outputRange: [GLOW_OPACITY_MIN, GLOW_OPACITY_MAX],
  });

  const ctaRevealOpacity = ctaOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CTA_MAX_OPACITY],
  });

  return (
    <ImageBackground
      source={ANCHOR_BG}
      style={styles.root}
      resizeMode="cover"
      imageStyle={styles.bgImage}
    >
      <View
        style={[StyleSheet.absoluteFill, styles.anchorDim]}
        pointerEvents="none"
      />
      <View style={[StyleSheet.absoluteFill, styles.noiseAnchorWrap]} pointerEvents="none">
        <Image
          source={NOISE_OVERLAY}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      </View>

      <StatusBar style="light" />

      <Animated.View
        pointerEvents="none"
        style={[styles.radialGlow, { opacity: pulseOpacity }]}
      />

      <View
        style={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 36) },
        ]}
      >
        <View style={styles.center}>
          <Animated.Text
            style={[styles.anchorText, { opacity: textOpacity }]}
            numberOfLines={6}
          >
            {step.text}
          </Animated.Text>
        </View>

        <Animated.View style={[styles.footer, { opacity: ctaRevealOpacity }]}>
          <SecondaryButton label="המשך" onPress={onNext} disabled={!ctaReady} />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bgImage: {
    opacity: 0.78,
  },
  anchorDim: {
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  noiseAnchorWrap: {
    opacity: 0.03,
  },
  radialGlow: {
    position: "absolute",
    alignSelf: "center",
    top: "42%",
    marginTop: -200,
    width: 440,
    height: 440,
    borderRadius: 999,
    backgroundColor: theme.accent,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 56,
    minHeight: 0,
  },
  anchorText: {
    maxWidth: "70%",
    fontSize: 31,
    fontFamily: fonts.medium,
    lineHeight: 37,
    color: theme.text,
    textAlign: "center",
    writingDirection: "rtl",
  },
  footer: {
    alignSelf: "stretch",
    marginBottom: 47,
  },
});
