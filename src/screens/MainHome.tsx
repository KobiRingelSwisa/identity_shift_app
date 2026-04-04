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
import { ScreenLayout } from "../ui/ScreenLayout";
import { PrimaryButton } from "../ui/PrimaryButton";
import type { AppProgress } from "../storage/progress";
import { isDailyNextLocked } from "../storage/progress";
import type { ConfidenceProgram } from "../session/types";
import { getDayThemeLabelHe } from "../session/loadProgram";
import { theme } from "../ui/theme";

type Props = {
  progress: AppProgress;
  program: ConfidenceProgram;
  onStartSession: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
};

const WINDOW_H = Dimensions.get("window").height;
const HERO_HEIGHT = Math.round(WINDOW_H * 0.35);

const HERO_FADE_MS = 300;
const STAGGER_MS = 100;
const FOOTER_FADE_MS = 280;
const LOCK_CROSS_MS = 240;
const PULSE_UP_MS = 520;
const PULSE_PAUSE_MS = 2500;

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

  const themeLabel = getDayThemeLabelHe(program, dayToShow);

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const focusLineOpacity = useRef(new Animated.Value(0)).current;
  const focusCardOpacity = useRef(new Animated.Value(0)).current;
  const footerEnterOpacity = useRef(new Animated.Value(0)).current;
  const ctaLayerOpacity = useRef(new Animated.Value(0)).current;
  const lockedLayerOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const prevLocked = useRef(locked);
  const skipLockedCrossfadeOnce = useRef(true);

  /** Entry: hero → focus line → card → footer (stagger 100ms). */
  useEffect(() => {
    heroOpacity.setValue(0);
    focusLineOpacity.setValue(0);
    focusCardOpacity.setValue(0);
    footerEnterOpacity.setValue(0);

    Animated.timing(heroOpacity, {
      toValue: 1,
      duration: HERO_FADE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const t1 = setTimeout(() => {
      Animated.timing(focusLineOpacity, {
        toValue: 1,
        duration: FOOTER_FADE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, STAGGER_MS);

    const t2 = setTimeout(() => {
      Animated.timing(focusCardOpacity, {
        toValue: 1,
        duration: FOOTER_FADE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, STAGGER_MS * 2);

    const t3 = setTimeout(() => {
      Animated.timing(footerEnterOpacity, {
        toValue: 1,
        duration: FOOTER_FADE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, STAGGER_MS * 3);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [heroOpacity, focusLineOpacity, focusCardOpacity, footerEnterOpacity]);

  /** First paint: fade in CTA or locked footer after stagger (no crossfade). */
  useEffect(() => {
    if (done) return;
    ctaLayerOpacity.setValue(0);
    lockedLayerOpacity.setValue(0);
    const t = setTimeout(() => {
      if (locked) {
        Animated.timing(lockedLayerOpacity, {
          toValue: 1,
          duration: FOOTER_FADE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(ctaLayerOpacity, {
          toValue: 1,
          duration: FOOTER_FADE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    }, STAGGER_MS * 3);
    return () => clearTimeout(t);
    // Intentionally once on mount — `locked`/`done` read from initial render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Soft pulse on primary day CTA (unlocked only). */
  useEffect(() => {
    if (done || locked) {
      pulseScale.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.02,
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

  /** Crossfade when `locked` changes after initial footer fade-in. */
  useEffect(() => {
    if (done) return;
    if (skipLockedCrossfadeOnce.current) {
      skipLockedCrossfadeOnce.current = false;
      prevLocked.current = locked;
      return;
    }
    if (prevLocked.current === locked) return;
    prevLocked.current = locked;

    if (locked) {
      Animated.sequence([
        Animated.timing(ctaLayerOpacity, {
          toValue: 0,
          duration: LOCK_CROSS_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(lockedLayerOpacity, {
          toValue: 1,
          duration: LOCK_CROSS_MS + 40,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(lockedLayerOpacity, {
          toValue: 0,
          duration: LOCK_CROSS_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(ctaLayerOpacity, {
          toValue: 1,
          duration: LOCK_CROSS_MS + 40,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [locked, done, ctaLayerOpacity, lockedLayerOpacity]);

  const footerInner = (
    <View style={styles.footerStack}>
      <Animated.View
        style={[styles.footerLayer, { opacity: ctaLayerOpacity }]}
        pointerEvents={locked ? "none" : "auto"}
      >
        <Animated.View
          style={[
            styles.ctaWrap,
            { transform: [{ scale: pulseScale }] },
          ]}
        >
          <PrimaryButton
            variant="home"
            label={`המשך ליום ${dayToShow}`}
            onPress={onStartSession}
          />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[styles.footerLayer, styles.footerLayerAbs, { opacity: lockedLayerOpacity }]}
        pointerEvents={locked ? "auto" : "none"}
      >
        <View style={styles.lockedFooter}>
          <Text style={styles.lockedTitle}>סיימת את האימון להיום</Text>
          <Text style={styles.lockedSubtitle}>היום הבא ייפתח מחר</Text>
          <View style={styles.lockedSpacer} />
          <PrimaryButton
            variant="home"
            label="חזור על האימון"
            onPress={onStartSession}
          />
        </View>
      </Animated.View>
    </View>
  );

  const footer = (
    <Animated.View style={[styles.footerWrap, { opacity: footerEnterOpacity }]}>
      {footerInner}
    </Animated.View>
  );

  const topBar = (
    <Animated.View style={[styles.topBar, { opacity: heroOpacity }]}>
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
    </Animated.View>
  );

  if (done) {
    return (
      <ScreenLayout background="solid" footer={null}>
        <View style={styles.stack}>
          {topBar}
          <Animated.View style={[styles.hero, { minHeight: HERO_HEIGHT, opacity: heroOpacity }]}>
            <Text style={styles.caption}>המסלול</Text>
            <Text style={styles.heroTitle}>הושלם</Text>
          </Animated.View>
          <Animated.View style={[styles.focusCard, { opacity: focusCardOpacity }]}>
            <Text style={styles.cardLine2}>התקדמות נבנית יום אחרי יום</Text>
          </Animated.View>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout background="solid" footer={footer}>
      <View style={styles.stack}>
        {topBar}
        <View style={[styles.hero, { minHeight: HERO_HEIGHT }]}>
          <Animated.View style={{ opacity: heroOpacity, alignSelf: "stretch", gap: 8 }}>
            <Text style={styles.caption}>הרגע שלך מתחיל כאן</Text>
            <Text style={styles.heroTitle}>{`יום ${dayToShow}`}</Text>
          </Animated.View>
          <Animated.Text
            style={[styles.focusLine, { opacity: focusLineOpacity }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {themeLabel}
          </Animated.Text>
        </View>

        <Animated.View style={[styles.focusCard, { opacity: focusCardOpacity }]}>
          <Text style={styles.cardLine1}>
            {`אתה כבר ${progress.streak} ימים ברצף`}
          </Text>
          <Text style={styles.cardLine2}>התקדמות נבנית יום אחרי יום</Text>
        </Animated.View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: {
    alignSelf: "stretch",
    gap: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 4,
    paddingTop: 4,
  },
  topLink: {
    fontSize: 15,
    fontWeight: "500",
    color: CAPTION_COLOR,
    writingDirection: "rtl",
  },
  hero: {
    paddingTop: 8,
    paddingHorizontal: 0,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: 8,
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
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
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
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
  },
  footerWrap: {
    marginTop: 32,
    alignSelf: "stretch",
  },
  footerStack: {
    alignSelf: "stretch",
    minHeight: 56,
  },
  footerLayer: {
    alignSelf: "stretch",
  },
  footerLayerAbs: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  ctaWrap: {
    alignSelf: "stretch",
  },
  lockedFooter: {
    alignSelf: "stretch",
    alignItems: "flex-end",
  },
  lockedTitle: {
    fontSize: 20,
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
    height: 16,
  },
});
