import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AccentGlow } from "../ui/AccentGlow";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SecondaryButton } from "../ui/SecondaryButton";
import { fonts, theme } from "../ui/theme";

const POST_SESSION_BG = require("../../assets/images/backgrounds/post-session-bg.png");
const NOISE_OVERLAY = require("../../assets/images/textures/noise-overlay.png");

type Props = {
  dayCompleted: number;
  anchorText: string;
  streak: number;
  completedDaysCount: number;
  trackDays: number;
  totalSessionsCompleted: number;
  onReplay: () => void;
  onHome: () => void;
  /** Soft growth CTA — opens paywall when set (gated by parent) */
  showUpgradeCTA?: boolean;
  onOpenUpgrade?: () => void;
};

const SECONDARY = "#9CA3AF";

const FADE_MS = 250;
const STAGGER_MS = 120;
/** Breath after progress fade starts, before CTA reveal (+180ms after stagger pattern) */
const CTA_EXTRA_PAUSE_MS = 180;
const CTA_DELAY_MS = STAGGER_MS * 5 + CTA_EXTRA_PAUSE_MS;

const MEANING_COPY = "היום תרגלת להישאר גם כשלא בטוח";
const TOMORROW_COPY = "מחר נמשיך בדיוק מהמקום הזה";

export function PostSessionScreen({
  anchorText,
  streak,
  onReplay,
  onHome,
  showUpgradeCTA,
  onOpenUpgrade,
}: Props) {
  const insets = useSafeAreaInsets();

  const oTitle = useRef(new Animated.Value(0)).current;
  const oMeaning = useRef(new Animated.Value(0)).current;
  const oAnchor = useRef(new Animated.Value(0)).current;
  const oTomorrow = useRef(new Animated.Value(0)).current;
  const oProgress = useRef(new Animated.Value(0)).current;
  const oCta = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    oTitle.setValue(0);
    oMeaning.setValue(0);
    oAnchor.setValue(0);
    oTomorrow.setValue(0);
    oProgress.setValue(0);
    oCta.setValue(0);
    const ease = Easing.out(Easing.cubic);
    Animated.parallel([
      Animated.timing(oTitle, {
        toValue: 1,
        duration: FADE_MS,
        delay: STAGGER_MS * 0,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(oMeaning, {
        toValue: 1,
        duration: FADE_MS,
        delay: STAGGER_MS * 1,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(oAnchor, {
        toValue: 1,
        duration: FADE_MS,
        delay: STAGGER_MS * 2,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(oTomorrow, {
        toValue: 1,
        duration: FADE_MS,
        delay: STAGGER_MS * 3,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(oProgress, {
        toValue: 1,
        duration: FADE_MS,
        delay: STAGGER_MS * 4,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(oCta, {
        toValue: 1,
        duration: FADE_MS,
        delay: CTA_DELAY_MS,
        easing: ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, [oTitle, oMeaning, oAnchor, oTomorrow, oProgress, oCta, anchorText]);

  return (
    <ImageBackground
      source={POST_SESSION_BG}
      style={styles.root}
      resizeMode="cover"
      imageStyle={styles.postBgImage}
    >
      <View
        style={[StyleSheet.absoluteFillObject, styles.postDim]}
        pointerEvents="none"
      />
      <View
        style={[StyleSheet.absoluteFillObject, styles.postNoiseWrap]}
        pointerEvents="none"
      >
        <Image
          source={NOISE_OVERLAY}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      </View>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollFill}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 32) + 12,
            paddingBottom: Math.max(insets.bottom, 32),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. TITLE */}
        <Animated.View style={[styles.section, { opacity: oTitle }]}>
          <Text style={styles.title} numberOfLines={1}>
            סיימת את האימון להיום
          </Text>
        </Animated.View>

        {/* 2. MEANING */}
        <Animated.View style={[styles.section, { opacity: oMeaning }]}>
          <Text style={styles.meaning} numberOfLines={2}>
            {MEANING_COPY}
          </Text>
        </Animated.View>

        {/* 3. ANCHOR */}
        <View style={styles.anchorGlowShell}>
          <AccentGlow intensity={0.48} />
          <Animated.View
            style={[styles.anchorInner, { opacity: oAnchor }]}
          >
            <Text style={styles.anchorLabel}>המשפט של היום</Text>
            <Text style={styles.anchorQuote}>{anchorText}</Text>
          </Animated.View>
        </View>

        {/* 4. TOMORROW */}
        <Animated.View style={[styles.section, { opacity: oTomorrow }]}>
          <Text style={styles.tomorrow} numberOfLines={2}>
            {TOMORROW_COPY}
          </Text>
        </Animated.View>

        {/* 5. PROGRESS */}
        <Animated.View style={[styles.progressBlock, { opacity: oProgress }]}>
          <Text style={styles.progressLine}>{`${streak} ימים ברצף`}</Text>
        </Animated.View>

        {/* 6. ACTIONS */}
        <Animated.View style={[styles.actions, { opacity: oCta }]}>
          <PrimaryButton variant="home" label="חזור" onPress={onHome} />
          <SecondaryButton label="חזור על האימון" onPress={onReplay} />
          {showUpgradeCTA && onOpenUpgrade ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="תמיכה בפיתוח Identity Shift Plus"
              onPress={onOpenUpgrade}
              style={styles.upgradePress}
            >
              <Text style={styles.upgradeLink}>
                תמיכה בפיתוח — Identity Shift+
              </Text>
            </Pressable>
          ) : null}
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
  postBgImage: {
    opacity: 0.88,
  },
  postDim: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  postNoiseWrap: {
    opacity: 0.025,
  },
  scrollFill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  section: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  title: {
    fontSize: 23,
    fontFamily: fonts.semiBold,
    color: theme.text,
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 16,
    lineHeight: 29,
  },
  meaning: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  anchorGlowShell: {
    position: "relative",
    alignSelf: "stretch",
    marginTop: 8,
    marginBottom: 32,
    minHeight: 148,
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 8,
  },
  anchorInner: {
    alignSelf: "stretch",
    alignItems: "center",
    zIndex: 1,
  },
  anchorLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: SECONDARY,
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 8,
  },
  anchorQuote: {
    maxWidth: "70%",
    fontSize: 30,
    fontFamily: fonts.medium,
    color: theme.text,
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 36,
  },
  tomorrow: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: SECONDARY,
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  progressBlock: {
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 32,
  },
  progressLine: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 18,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    writingDirection: "rtl",
  },
  actions: {
    alignSelf: "stretch",
    gap: 16,
    marginTop: 16,
    paddingBottom: 8,
  },
  upgradePress: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  upgradeLink: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: "rgba(124, 154, 255, 0.92)",
    textAlign: "center",
    writingDirection: "rtl",
    textDecorationLine: "underline",
  },
});
