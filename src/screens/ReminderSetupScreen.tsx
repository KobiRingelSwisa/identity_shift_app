import { useCallback, useEffect, useState } from 'react';
import { trackEvent } from '../analytics/track';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenLayout } from '../ui/ScreenLayout';
import { PrimaryButton } from '../ui/PrimaryButton';
import { theme, typography } from '../ui/theme';
import {
  persistAndScheduleReminders,
  requestNotificationPermission,
} from '../notifications/reminders';

const PRESETS: { label: string; hour: number; minute: number }[] = [
  { label: '09:00', hour: 9, minute: 0 },
  { label: '12:30', hour: 12, minute: 30 },
  { label: '20:00', hour: 20, minute: 0 },
];

type Props = {
  onComplete: () => void;
};

export function ReminderSetupScreen({ onComplete }: Props) {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    void trackEvent('reminder_prompt_viewed');
  }, []);

  const skip = useCallback(async () => {
    await persistAndScheduleReminders({ promptSeen: true });
    void trackEvent('reminder_denied');
    onComplete();
  }, [onComplete]);

  const enable = useCallback(async () => {
    const granted = await requestNotificationPermission();
    await persistAndScheduleReminders({
      enabled: granted,
      hour,
      minute,
      promptSeen: true,
    });
    void trackEvent('reminder_enabled');
    onComplete();
  }, [hour, minute, onComplete]);

  return (
    <ScreenLayout
      background="gradient"
      footer={
        <View style={styles.actions}>
          <PrimaryButton label="הפעלת תזכורת" onPress={() => void enable()} />
          <Pressable
            accessibilityRole="button"
            onPress={() => void skip()}
            style={styles.skipWrap}
          >
            <Text style={styles.skip}>לא עכשיו</Text>
          </Pressable>
        </View>
      }
    >
      <Text style={styles.title}>תזכורת יומית?</Text>
      <Text style={styles.sub}>
        אפשר לקבל תזכורת קצרה לשמור על הרצף. הכול נשמר במכשיר בלבד.
      </Text>

      <Text style={styles.pick}>בחרו שעה</Text>
      <View style={styles.presets}>
        {PRESETS.map((p) => {
          const active = hour === p.hour && minute === p.minute;
          return (
            <Pressable
              key={p.label}
              accessibilityRole="button"
              onPress={() => {
                setHour(p.hour);
                setMinute(p.minute);
              }}
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
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heroTitle,
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 10,
  },
  sub: {
    ...typography.body,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 28,
  },
  pick: {
    ...typography.screenTitle,
    fontSize: 15,
    textAlign: 'right',
    marginBottom: 10,
    writingDirection: 'rtl',
  },
  presets: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  preset: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radiusMd,
    backgroundColor: theme.cardSurface,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
  },
  presetActive: {
    borderColor: theme.accent,
    backgroundColor: 'rgba(124, 154, 255, 0.08)',
  },
  presetText: {
    color: theme.textSecondary,
    fontSize: 15,
    writingDirection: 'rtl',
  },
  presetTextActive: {
    color: theme.text,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  skipWrap: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  skip: {
    color: theme.textSecondary,
    fontSize: 16,
    writingDirection: 'rtl',
  },
});
