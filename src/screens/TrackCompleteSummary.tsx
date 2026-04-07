import { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../ui/PrimaryButton';
import { RitualAmbientOrbs } from '../ui/RitualAmbientOrbs';
import { RitualBackdrop } from '../ui/RitualBackdrop';
import { RITUAL_MS, ritualEasingOut } from '../ui/ritualMotion';
import { SecondaryButton } from '../ui/SecondaryButton';
import { PremiumCard } from '../ui/PremiumCard';
import type { AppProgress } from '../storage/progress';
import type { ConfidenceProgram } from '../session/types';
import { theme, spacing, typography } from '../ui/theme';

type Props = {
  program: ConfidenceProgram;
  progress: AppProgress;
  onContinue: () => void;
  onRestartTrack?: () => void;
  showUpgradeCTA?: boolean;
  onOpenUpgrade?: () => void;
};

export function TrackCompleteSummary({
  program,
  progress,
  onContinue,
  onRestartTrack,
  showUpgradeCTA,
  onOpenUpgrade,
}: Props) {
  const insets = useSafeAreaInsets();
  const days = program.track.duration_days;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    headerOpacity.setValue(0);
    cardOpacity.setValue(0);
    footerOpacity.setValue(0);
    Animated.stagger(RITUAL_MS.stagger, [
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: RITUAL_MS.fadeHero,
        easing: ritualEasingOut,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: RITUAL_MS.fadeCard,
        easing: ritualEasingOut,
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: RITUAL_MS.fadeCard,
        easing: ritualEasingOut,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerOpacity, cardOpacity, footerOpacity]);

  return (
    <View style={styles.root}>
      <RitualBackdrop />
      <RitualAmbientOrbs />
      <StatusBar style="light" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollInner,
          {
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: spacing.lg,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <Text style={styles.caption}>נוכחות שלמה</Text>
          <Text style={styles.title}>המסלול הושלם</Text>
          <Text style={styles.lead}>
            {days} ימים ברצף של נוכחות — בקצב שלך. סגירת מעגל רגועה; אפשר תמיד
            לפתוח שוב כשמתאים.
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: cardOpacity }}>
          <PremiumCard variant="elevated" style={styles.card}>
            <WhisperRow
              label="ימים במסלול"
              value={`${progress.completedDays.length} מתוך ${days}`}
            />
            <View style={styles.hairline} />
            <WhisperRow label="סטריק" value={`${progress.streak} ימים`} />
            <View style={styles.hairline} />
            <WhisperRow
              label="אימונים שבוצעו"
              value={`${progress.totalSessionsCompleted ?? 0}`}
            />
            {progress.commitmentDays != null ? (
              <>
                <View style={styles.hairline} />
                <WhisperRow
                  label="התחייבות"
                  value={`${progress.commitmentDays} ימים`}
                />
              </>
            ) : null}
          </PremiumCard>
        </Animated.View>

        {showUpgradeCTA && onOpenUpgrade ? (
          <Animated.View style={{ opacity: footerOpacity }}>
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
          </Animated.View>
        ) : null}
      </ScrollView>

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: footerOpacity,
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
      >
        <PrimaryButton size="large" label="חזרה לבית" onPress={onContinue} />
        {onRestartTrack ? (
          <SecondaryButton
            label="התחלת מסלול מחדש"
            onPress={() => {
              Alert.alert(
                'התחלת מסלול מחדש',
                'לאפס את כל ימי המסלול והסטריק ולחזור ליום 1?',
                [
                  { text: 'ביטול', style: 'cancel' },
                  {
                    text: 'איפוס',
                    style: 'destructive',
                    onPress: onRestartTrack,
                  },
                ]
              );
            }}
          />
        ) : null}
      </Animated.View>
    </View>
  );
}

function WhisperRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scroll: {
    flex: 1,
  },
  scrollInner: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: spacing.xl,
  },
  upgradePress: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: -spacing.md,
  },
  upgradeLink: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(124, 154, 255, 0.92)',
    textAlign: 'right',
    writingDirection: 'rtl',
    textDecorationLine: 'underline',
  },
  header: {
    gap: spacing.md,
    alignItems: 'flex-end',
  },
  caption: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.success,
    opacity: 0.88,
    textAlign: 'right',
    writingDirection: 'rtl',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 38,
    color: theme.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  lead: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 26,
    color: theme.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  card: {
    paddingVertical: spacing.lg + 4,
    paddingHorizontal: spacing.lg,
    gap: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.divider,
    alignSelf: 'stretch',
    marginVertical: spacing.md,
  },
  row: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rowLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.textMuted,
    writingDirection: 'rtl',
  },
  rowValue: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.text,
    fontVariant: ['tabular-nums'],
    writingDirection: 'rtl',
  },
  footer: {
    gap: spacing.md,
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.divider,
  },
});
