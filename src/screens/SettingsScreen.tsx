import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import { ScreenLayout } from '../ui/ScreenLayout';
import { PrimaryButton } from '../ui/PrimaryButton';
import { PremiumCard } from '../ui/PremiumCard';
import { SectionHeader } from '../ui/SectionHeader';
import { theme, typography } from '../ui/theme';
import {
  loadReminderSettings,
  type ReminderSettings,
} from '../storage/reminders';
import { persistAndScheduleReminders } from '../notifications/reminders';
import { resetTrackProgress } from '../storage/progress';
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
} from '../storage/analyticsConsent';
import { featureFlags } from '../config/featureFlags';
import { usePremiumEntitlement } from '../hooks/usePremiumEntitlement';

const PRESETS: { label: string; hour: number; minute: number }[] = [
  { label: '08:00', hour: 8, minute: 0 },
  { label: '12:30', hour: 12, minute: 30 },
  { label: '18:00', hour: 18, minute: 0 },
  { label: '21:00', hour: 21, minute: 0 },
];

type Props = {
  onBack: () => void;
  onProgressReset: () => Promise<void>;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenSubscriptionTerms: () => void;
  onOpenUpgrade: () => void;
};

export function SettingsScreen({
  onBack,
  onProgressReset,
  onOpenPrivacy,
  onOpenTerms,
  onOpenSubscriptionTerms,
  onOpenUpgrade,
}: Props) {
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [analyticsOn, setAnalyticsOn] = useState(true);
  const { premium, loading: premiumLoading } = usePremiumEntitlement();

  useEffect(() => {
    void loadReminderSettings().then(setSettings);
  }, []);

  useEffect(() => {
    void getAnalyticsConsent().then(setAnalyticsOn);
  }, []);

  const apply = useCallback(async (partial: Partial<ReminderSettings>) => {
    await persistAndScheduleReminders(partial);
    setSettings(await loadReminderSettings());
  }, []);

  const openSupportMail = useCallback((subject: string) => {
    const body = [
      `גרסה: ${Constants.expoConfig?.version ?? 'unknown'}`,
      `פלטפורמה: ${Platform.OS}`,
    ].join('\n');
    const url = `mailto:support@example.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    void Linking.openURL(url);
  }, []);

  const onResetTrack = useCallback(() => {
    Alert.alert(
      'איפוס מסלול',
      'פעולה זו תאפס את ימי המסלול, הסטריק ומונה האימונים. ההתחייבות והאונבורדינג נשמרים.',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'איפוס',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              await resetTrackProgress();
              await onProgressReset();
              onBack();
            })();
          },
        },
      ]
    );
  }, [onBack, onProgressReset]);

  if (!settings) {
    return (
      <ScreenLayout background="gradient">
        <Text style={styles.muted}>טוען…</Text>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout background="gradient">
      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>סגור</Text>
        </Pressable>
        <Text style={styles.screenTitle}>הגדרות</Text>
        <View style={styles.headerSpacer} />
      </View>

      <SectionHeader
        title="שקט מקומי"
        subtitle="התראות ומסלול — הכל נשמר במכשיר"
      />

      {featureFlags.ENABLE_PAYWALL ? (
        <PremiumCard style={styles.card}>
          <Text style={styles.sectionTitle}>מנוי</Text>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.label}>סטטוס</Text>
            <Text style={styles.statusValue}>
              {premiumLoading
                ? 'טוען…'
                : premium
                  ? 'Identity Shift+ פעיל'
                  : 'חינם'}
            </Text>
          </View>
          <Text style={styles.trackHint}>
            תמיכה בפיתוח ומסלולים נוספים בעתיד — בלי לנעול את האימון הבסיסי.
          </Text>
          {!premium ? (
            <PrimaryButton label="שדרוג" onPress={onOpenUpgrade} />
          ) : null}
        </PremiumCard>
      ) : null}

      <PremiumCard style={styles.card}>
        <Text style={styles.sectionTitle}>תזכורת יומית</Text>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.label}>התראות</Text>
          <Switch
            value={settings.enabled}
            onValueChange={(v) => void apply({ enabled: v })}
            trackColor={{
              false: theme.backgroundSecondary,
              true: 'rgba(124, 154, 255, 0.45)',
            }}
            thumbColor="#f8fafc"
          />
        </View>
        <Text style={styles.hint}>
          תזכורת קצרה לשמירה על קצב — בלי רעש, בלי מעקב.
        </Text>
        <View style={styles.presets}>
          {PRESETS.map((p) => {
            const active =
              settings.hour === p.hour && settings.minute === p.minute;
            return (
              <Pressable
                key={p.label}
                accessibilityRole="button"
                onPress={() => void apply({ hour: p.hour, minute: p.minute })}
                style={[styles.preset, active && styles.presetActive]}
              >
                <Text
                  style={[styles.presetText, active && styles.presetTextActive]}
                >
                  {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </PremiumCard>

      <PremiumCard style={styles.card}>
        <Text style={styles.sectionTitle}>מסלול</Text>
        <View style={styles.separator} />
        <Text style={styles.trackHint}>
          איפוס מחזיר ליום 1 ומנקה את ההתקדמות במסלול הנוכחי.
        </Text>
        <PrimaryButton label="איפוס מסלול" onPress={onResetTrack} />
      </PremiumCard>

      <PremiumCard style={styles.card}>
        <Text style={styles.sectionTitle}>פרטיות ואנליטיקה</Text>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.label}>שיתוף אנליטיקה (אנונימי)</Text>
          <Switch
            value={analyticsOn}
            onValueChange={(v) => {
              setAnalyticsOn(v);
              void setAnalyticsConsent(v);
            }}
            trackColor={{
              false: theme.backgroundSecondary,
              true: 'rgba(124, 154, 255, 0.45)',
            }}
            thumbColor="#f8fafc"
          />
        </View>
        <Text style={styles.hint}>
          כבוי: לא נשלחים אירועי מוצר (נשמרים אירועים קריטיים מינימליים כמו
          השלמת סשן לפי מדיניות החנות).
        </Text>
      </PremiumCard>

      <PremiumCard style={styles.card}>
        <Text style={styles.sectionTitle}>משפטי</Text>
        <View style={styles.separator} />
        <Pressable
          accessibilityRole="button"
          onPress={onOpenPrivacy}
          style={styles.linkRow}
        >
          <Text style={styles.link}>מדיניות פרטיות</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenTerms}
          style={styles.linkRow}
        >
          <Text style={styles.link}>תנאי שימוש</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenSubscriptionTerms}
          style={styles.linkRow}
        >
          <Text style={styles.link}>תנאי מנוי</Text>
        </Pressable>
      </PremiumCard>

      <PremiumCard style={styles.card}>
        <Text style={styles.sectionTitle}>תמיכה</Text>
        <View style={styles.separator} />
        <PrimaryButton
          label="צור קשר"
          onPress={() => openSupportMail('Identity Shift — תמיכה')}
        />
        <View style={styles.supportSpacer} />
        <PrimaryButton
          label="דווח על תקלה"
          onPress={() => openSupportMail('Identity Shift — דיווח תקלה')}
        />
      </PremiumCard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  back: {
    color: theme.accent,
    fontSize: 15,
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  screenTitle: {
    ...typography.screenTitle,
    writingDirection: 'rtl',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.divider,
    alignSelf: 'stretch',
  },
  headerSpacer: {
    width: 48,
  },
  card: {
    marginBottom: 16,
    padding: 20,
    gap: 14,
  },
  sectionTitle: {
    ...typography.screenTitle,
    fontSize: 17,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.body,
    writingDirection: 'rtl',
  },
  statusValue: {
    ...typography.body,
    fontWeight: '600',
    color: theme.text,
    writingDirection: 'rtl',
    textAlign: 'left',
    flex: 1,
    marginStart: 12,
  },
  hint: {
    ...typography.caption,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  trackHint: {
    ...typography.caption,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
  },
  presets: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  preset: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radiusSm,
    backgroundColor: theme.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
  },
  presetActive: {
    borderColor: theme.accent,
    backgroundColor: theme.surfaceFocus,
  },
  presetText: {
    color: theme.textSecondary,
    fontSize: 14,
    writingDirection: 'rtl',
  },
  presetTextActive: {
    color: theme.text,
    fontWeight: '600',
  },
  muted: {
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    writingDirection: 'rtl',
  },
  linkRow: {
    paddingVertical: 10,
    alignSelf: 'stretch',
  },
  link: {
    color: theme.accent,
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  supportSpacer: {
    height: 12,
  },
});
