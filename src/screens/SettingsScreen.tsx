import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
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

const PRESETS: { label: string; hour: number; minute: number }[] = [
  { label: '08:00', hour: 8, minute: 0 },
  { label: '12:30', hour: 12, minute: 30 },
  { label: '18:00', hour: 18, minute: 0 },
  { label: '21:00', hour: 21, minute: 0 },
];

type Props = {
  onBack: () => void;
  onProgressReset: () => Promise<void>;
};

export function SettingsScreen({ onBack, onProgressReset }: Props) {
  const [settings, setSettings] = useState<ReminderSettings | null>(null);

  useEffect(() => {
    void loadReminderSettings().then(setSettings);
  }, []);

  const apply = useCallback(async (partial: Partial<ReminderSettings>) => {
    await persistAndScheduleReminders(partial);
    setSettings(await loadReminderSettings());
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
});
