import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SecondaryButton } from "../ui/SecondaryButton";
import { theme } from "../ui/theme";

type Props = {
  dayCompleted: number;
  anchorText: string;
  streak: number;
  completedDaysCount: number;
  trackDays: number;
  totalSessionsCompleted: number;
  onReplay: () => void;
  onHome: () => void;
};

/** Spec: #9CA3AF */
const MUTED = "#9CA3AF";

const STAGE_MS = 280;
const STAGGER_MS = 150;

export function PostSessionScreen({
  anchorText,
  streak,
  onReplay,
  onHome,
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
        duration: STAGE_MS,
        delay: 0,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(oMeaning, {
        toValue: 1,
        duration: STAGE_MS,
        delay: STAGGER_MS,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(oAnchor, {
        toValue: 1,
        duration: STAGE_MS,
        delay: STAGGER_MS * 2,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(oTomorrow, {
        toValue: 1,
        duration: STAGE_MS,
        delay: STAGGER_MS * 3,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(oProgress, {
        toValue: 1,
        duration: STAGE_MS,
        delay: STAGGER_MS * 4,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(oCta, {
        toValue: 1,
        duration: STAGE_MS,
        delay: STAGGER_MS * 5,
        easing: ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    oTitle,
    oMeaning,
    oAnchor,
    oTomorrow,
    oProgress,
    oCta,
    anchorText,
  ]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View
        style={[
          styles.inner,
          {
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
      >
        <View style={styles.body}>
          <Animated.View style={{ opacity: oTitle }}>
            <Text style={styles.title}>סיימת את האימון להיום</Text>
          </Animated.View>

          <Animated.View style={{ opacity: oMeaning }}>
            <Text style={styles.meaning}>
              היום עבדת על נוכחות גם כשלא בטוח
            </Text>
          </Animated.View>

          <Animated.View style={[styles.anchorSection, { opacity: oAnchor }]}>
            <Text style={styles.anchorLabel}>המשפט של היום</Text>
            <Text style={styles.anchorQuote}>{anchorText}</Text>
          </Animated.View>

          <Animated.View style={{ opacity: oTomorrow }}>
            <Text style={styles.tomorrow}>מחר נעמיק בזה</Text>
          </Animated.View>

          <Animated.View style={{ opacity: oProgress }}>
            <Text style={styles.progress}>{`${streak} ימים ברצף`}</Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.cta, { opacity: oCta }]}>
          <PrimaryButton
            variant="home"
            label="חזור למסך הבית"
            onPress={onHome}
          />
          <SecondaryButton label="חזור על האימון" onPress={onReplay} />
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
  inner: {
    flex: 1,
    direction: "rtl",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  body: {
    alignSelf: "stretch",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.text,
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 16,
  },
  meaning: {
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 24,
    marginBottom: 24,
  },
  anchorSection: {
    alignSelf: "stretch",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  anchorLabel: {
    fontSize: 13,
    color: MUTED,
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 8,
  },
  anchorQuote: {
    fontSize: 26,
    fontWeight: "500",
    color: theme.text,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 36,
  },
  tomorrow: {
    fontSize: 14,
    color: MUTED,
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 24,
  },
  progress: {
    fontSize: 14,
    color: theme.text,
    textAlign: "right",
    writingDirection: "rtl",
  },
  cta: {
    marginTop: 32,
    gap: 12,
    alignSelf: "stretch",
  },
});
