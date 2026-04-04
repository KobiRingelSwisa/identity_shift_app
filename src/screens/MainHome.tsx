import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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
import { theme } from "../ui/theme";

type Props = {
  progress: AppProgress;
  program: ConfidenceProgram;
  onStartSession: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
};

const WINDOW_H = Dimensions.get("window").height;
const HERO_MIN_H = Math.round(WINDOW_H * 0.3);

/** Single intentional copy path — no dynamic theme lines */
const HERO_CAPTION = "הרגע שלך מתחיל כאן";
const FOCUS_LINE = "היום מחזקים נוכחות גם כשאין ודאות";

const ENTRY_MS = 400;
const STAGGER_MS = 70;
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
}: Props) {
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
            <AccentGlow intensity={0.75} />
            <Animated.View
              style={[styles.heroBlock, { minHeight: HERO_MIN_H, opacity: heroOpacity }]}
            >
              {topLinks}
              <Text style={styles.caption}>המסלול</Text>
              <Text style={styles.heroTitle}>הושלם</Text>
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
          <AccentGlow intensity={0.75} />
          <Animated.View
            style={[styles.heroBlock, { minHeight: HERO_MIN_H, opacity: heroOpacity }]}
          >
            {topLinks}
            <Text style={styles.caption}>{HERO_CAPTION}</Text>
            <Text style={styles.heroTitle}>{`יום ${dayToShow}`}</Text>
            <Text style={styles.focusLine}>{FOCUS_LINE}</Text>
          </Animated.View>
        </View>

        {/* 2. Support / progress */}
        <Animated.View style={{ opacity: cardOpacity, alignSelf: "stretch" }}>
          <View style={styles.focusCard}>
            <Text style={styles.cardLine1}>
              {`כבר ${progress.streak} ימים ברצף`}
            </Text>
            <Text style={styles.cardLine2}>התקדמות נבנית יום אחרי יום</Text>
            <Text style={styles.cardLine3}>
              {`יום ${dayToShow} מתוך ${duration_days}`}
            </Text>
          </View>
        </Animated.View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: {
    alignSelf: "stretch",
    gap: 24,
    paddingTop: 8,
  },
  heroShell: {
    alignSelf: "stretch",
    position: "relative",
  },
  heroBlock: {
    paddingTop: 0,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: 8,
  },
  topLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 12,
  },
  topLink: {
    fontSize: 15,
    fontWeight: "500",
    color: CAPTION_COLOR,
    writingDirection: "rtl",
  },
  caption: {
    fontSize: 13,
    color: CAPTION_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "600",
    color: theme.text,
    textAlign: "right",
    writingDirection: "rtl",
  },
  focusLine: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 24,
  },
  focusCard: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.06)",
    alignSelf: "stretch",
    alignItems: "flex-end",
    gap: 8,
  },
  cardLine1: {
    fontSize: 14,
    color: CAPTION_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  cardLine2: {
    fontSize: 15,
    color: "rgba(255,255,255,0.92)",
    textAlign: "right",
    writingDirection: "rtl",
  },
  cardLine3: {
    fontSize: 12,
    color: "rgba(156, 163, 175, 0.85)",
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 2,
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
    fontWeight: "500",
    color: theme.text,
    textAlign: "right",
    writingDirection: "rtl",
  },
  lockedSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: CAPTION_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  lockedSpacer: {
    height: 20,
  },
});
