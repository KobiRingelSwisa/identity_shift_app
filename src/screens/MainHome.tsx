import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AccentGlow } from "../ui/AccentGlow";
import { ScreenLayout } from "../ui/ScreenLayout";
import { PrimaryButton } from "../ui/PrimaryButton";
import type { AppProgress } from "../storage/progress";
import { isDailyNextLocked } from "../storage/progress";
import type { ConfidenceProgram } from "../session/types";
import { fonts, theme } from "../ui/theme";
import { featureFlags } from "../config/featureFlags";
import { usePremiumEntitlement } from "../hooks/usePremiumEntitlement";
import { PREMIUM_TRACK_PLACEHOLDER } from "../data/trackRegistry";

const HOME_HERO_BG = require("../../assets/images/backgrounds/home-hero-bg.png");
const NOISE_OVERLAY = require("../../assets/images/textures/noise-overlay.png");

type Props = {
  progress: AppProgress;
  program: ConfidenceProgram;
  onStartSession: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  /** Opens paywall when user taps upgrade on gated premium teaser */
  onOpenPremiumUpgrade?: () => void;
};

const WINDOW_H = Dimensions.get("window").height;
const HERO_MIN_H = Math.round(WINDOW_H * 0.34);

/** Single intentional copy path — no dynamic theme lines */
const HERO_CAPTION = "בוא נתחיל ברגע אחד לעצמך";
const FOCUS_LINE = "היום מחזקים נוכחות גם כשאין ודאות";

const ENTRY_MS = 300;
const STAGGER_MS = 90;
const ACTION_DELAY_MS = 140;
const PULSE_UP_MS = 520;
const PULSE_PAUSE_MS = 2800;

/** Spec: #9CA3AF */
const CAPTION_COLOR = "#9CA3AF";

export function MainHome({
  progress,
  program,
  onStartSession,
  onOpenSettings,
  onOpenAbout,
  onOpenPremiumUpgrade,
}: Props) {
  const { premium, loading: premiumLoading } = usePremiumEntitlement();
  const { duration_days } = program.track;
  const done = progress.currentDay > duration_days;
  const dayToShow = Math.min(progress.currentDay, duration_days);
  const locked = isDailyNextLocked(progress, duration_days);

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const actionOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    heroOpacity.setValue(0);
    cardOpacity.setValue(0);
    if (!done) actionOpacity.setValue(0);

    const parallel: Animated.CompositeAnimation[] = [
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: ENTRY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: ENTRY_MS,
        delay: STAGGER_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ];

    if (!done) {
      parallel.push(
        Animated.timing(actionOpacity, {
          toValue: 1,
          duration: ENTRY_MS,
          delay: ACTION_DELAY_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(parallel).start();
  }, [heroOpacity, cardOpacity, actionOpacity, done]);

  useEffect(() => {
    if (done || locked) {
      pulseScale.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.015,
          duration: PULSE_UP_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: PULSE_UP_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.delay(PULSE_PAUSE_MS),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
      pulseScale.setValue(1);
    };
  }, [done, locked, pulseScale]);

  const topLinks = (
    <View style={styles.topLinks}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="הגדרות"
        onPress={onOpenSettings}
        hitSlop={10}
      >
        <Text style={styles.topLink}>הגדרות</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="אודות"
        onPress={onOpenAbout}
        hitSlop={10}
      >
        <Text style={styles.topLink}>אודות</Text>
      </Pressable>
    </View>
  );

  if (done) {
    return (
      <ScreenLayout background="gradient" footer={null}>
        <View style={styles.stack}>
          <View style={styles.heroShell}>
            <ImageBackground
              source={HOME_HERO_BG}
              style={styles.heroImageBg}
              resizeMode="cover"
              imageStyle={styles.heroImageStyle}
            >
              <View
                style={[StyleSheet.absoluteFillObject, styles.heroDim]}
                pointerEvents="none"
              />
              <View
                style={[StyleSheet.absoluteFillObject, styles.heroNoiseWrap]}
                pointerEvents="none"
              >
                <Image
                  source={NOISE_OVERLAY}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
              </View>
            </ImageBackground>
            <AccentGlow intensity={0.66} />
            <Animated.View
              style={[styles.heroFade, { minHeight: HERO_MIN_H, opacity: heroOpacity }]}
            >
              {topLinks}
              <View style={styles.heroCopy}>
                <Text style={styles.caption}>המסלול</Text>
                <Text style={styles.heroTitle}>הושלם</Text>
              </View>
            </Animated.View>
          </View>
          <Animated.View style={{ opacity: cardOpacity, alignSelf: "stretch" }}>
            <View style={styles.focusCard}>
              <Text style={styles.cardLine2}>התקדמות נבנית יום אחרי יום</Text>
            </View>
          </Animated.View>
        </View>
      </ScreenLayout>
    );
  }

  const primaryAction =
    locked ? (
      <View style={styles.lockedBlock}>
        <Text style={styles.lockedTitle}>סיימת את האימון להיום</Text>
        <Text style={styles.lockedSubtitle}>היום הבא ייפתח מחר</Text>
        <View style={styles.lockedSpacer} />
        <PrimaryButton
          variant="home"
          label="חזור על האימון"
          onPress={onStartSession}
        />
      </View>
    ) : (
      <Animated.View
        style={[styles.ctaWrap, { transform: [{ scale: pulseScale }] }]}
      >
        <PrimaryButton
          variant="home"
          label={`המשך ליום ${dayToShow}`}
          onPress={onStartSession}
        />
      </Animated.View>
    );

  return (
    <ScreenLayout
      background="gradient"
      footer={
        <Animated.View style={[styles.footerAction, { opacity: actionOpacity }]}>
          {primaryAction}
        </Animated.View>
      }
    >
      <View style={styles.stack}>
        {/* 1. Hero */}
        <View style={styles.heroShell}>
          <ImageBackground
            source={HOME_HERO_BG}
            style={styles.heroImageBg}
            resizeMode="cover"
            imageStyle={styles.heroImageStyle}
          >
            <View
              style={[StyleSheet.absoluteFillObject, styles.heroDim]}
              pointerEvents="none"
            />
            <View
              style={[StyleSheet.absoluteFillObject, styles.heroNoiseWrap]}
              pointerEvents="none"
            >
              <Image
                source={NOISE_OVERLAY}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
              />
            </View>
          </ImageBackground>
          <AccentGlow intensity={0.66} />
          <Animated.View
            style={[styles.heroFade, { minHeight: HERO_MIN_H, opacity: heroOpacity }]}
          >
            {topLinks}
            <View style={styles.heroCopy}>
              <Text style={styles.caption}>{HERO_CAPTION}</Text>
              <Text style={styles.heroTitle}>{`יום ${dayToShow}`}</Text>
              <Text style={styles.focusLine} numberOfLines={2}>
                {FOCUS_LINE}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* 2. Support / progress */}
        <Animated.View style={{ opacity: cardOpacity, alignSelf: "stretch" }}>
          <View style={styles.focusCard}>
            <Text style={styles.cardLine1}>
              {`כבר ${progress.streak} ימים ברצף`}
            </Text>
            <Text style={styles.cardLine2}>התקדמות נבנית יום אחרי יום</Text>
          </View>
        </Animated.View>

        {featureFlags.moneyTrackPreview &&
        featureFlags.ENABLE_PAYWALL &&
        onOpenPremiumUpgrade ? (
          <Animated.View style={{ opacity: cardOpacity, alignSelf: "stretch" }}>
            <View style={styles.premiumTeaserCard}>
              <Text style={styles.premiumTeaserTitle}>
                {PREMIUM_TRACK_PLACEHOLDER.titleHe}
              </Text>
              <Text style={styles.premiumTeaserSub}>
                {PREMIUM_TRACK_PLACEHOLDER.subtitleHe}
              </Text>
              {premiumLoading ? (
                <Text style={styles.premiumTeaserMuted}>טוען…</Text>
              ) : premium ? (
                <Text style={styles.premiumTeaserMuted}>
                  בקרוב — תוכן יופיע כאן כשיהיה זמין.
                </Text>
              ) : (
                <>
                  <Text style={styles.premiumTeaserMuted}>
                    זמין במנוי Identity Shift+
                  </Text>
                  <View style={styles.premiumTeaserCta}>
                    <PrimaryButton
                      variant="home"
                      label="שדרוג"
                      onPress={onOpenPremiumUpgrade}
                    />
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        ) : null}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: {
    alignSelf: "stretch",
    gap: 24,
    paddingTop: 12,
  },
  heroShell: {
    alignSelf: "stretch",
    position: "relative",
    overflow: "hidden",
    borderRadius: 20,
  },
  heroImageBg: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImageStyle: {
    borderRadius: 20,
  },
  heroDim: {
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroNoiseWrap: {
    opacity: 0.02,
  },
  heroFade: {
    paddingTop: 0,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    alignSelf: "stretch",
  },
  heroCopy: {
    gap: 8,
    alignSelf: "stretch",
    alignItems: "flex-end",
  },
  topLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 16,
  },
  topLink: {
    fontSize: 15,
    fontFamily: fonts.medium,
    lineHeight: 20,
    color: CAPTION_COLOR,
    writingDirection: "rtl",
  },
  caption: {
    fontSize: 13,
    fontFamily: fonts.medium,
    lineHeight: 18,
    color: CAPTION_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: fonts.semiBold,
    lineHeight: 38,
    color: theme.text,
    textAlign: "right",
    writingDirection: "rtl",
  },
  focusLine: {
    fontSize: 16,
    fontFamily: fonts.regular,
    lineHeight: 22,
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
  },
  focusCard: {
    padding: 17,
    backgroundColor: "rgba(255,255,255,0.036)",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.05)",
    alignSelf: "stretch",
    alignItems: "flex-end",
    gap: 8,
  },
  cardLine1: {
    fontSize: 14,
    fontFamily: fonts.medium,
    lineHeight: 20,
    color: CAPTION_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  cardLine2: {
    fontSize: 15,
    fontFamily: fonts.regular,
    lineHeight: 21,
    color: "rgba(255,255,255,0.88)",
    textAlign: "right",
    writingDirection: "rtl",
  },
  premiumTeaserCard: {
    padding: 17,
    backgroundColor: "rgba(124, 154, 255, 0.06)",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(124, 154, 255, 0.22)",
    alignSelf: "stretch",
    alignItems: "flex-end",
    gap: 8,
  },
  premiumTeaserTitle: {
    fontSize: 16,
    fontFamily: fonts.medium,
    lineHeight: 22,
    color: theme.text,
    textAlign: "right",
    writingDirection: "rtl",
  },
  premiumTeaserSub: {
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 20,
    color: CAPTION_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  premiumTeaserMuted: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 18,
    color: CAPTION_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  premiumTeaserCta: {
    alignSelf: "stretch",
    marginTop: 8,
  },
  footerAction: {
    alignSelf: "stretch",
  },
  ctaWrap: {
    alignSelf: "stretch",
  },
  lockedBlock: {
    alignSelf: "stretch",
    alignItems: "flex-end",
  },
  lockedTitle: {
    fontSize: 20,
    fontFamily: fonts.medium,
    lineHeight: 26,
    color: theme.text,
    textAlign: "right",
    writingDirection: "rtl",
  },
  lockedSubtitle: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 20,
    color: CAPTION_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  lockedSpacer: {
    height: 20,
  },
});
