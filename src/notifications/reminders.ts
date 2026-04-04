import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  loadReminderSettings,
  saveReminderSettings,
  type ReminderSettings,
} from '../storage/reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function ensureAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily', {
      name: 'תזכורות יומיות',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function applyReminderSchedule(
  settings: ReminderSettings
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.enabled) return;
  await ensureAndroidChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'אימון ביטחון',
      body: 'כמה דקות של נוכחות — מתאים גם להיום.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.hour,
      minute: settings.minute,
    },
  });
}

export async function persistAndScheduleReminders(
  partial: Partial<ReminderSettings>
): Promise<void> {
  const cur = await loadReminderSettings();
  const next = { ...cur, ...partial };
  await saveReminderSettings(next);
  await applyReminderSchedule(next);
}

export async function syncScheduledRemindersFromStorage(): Promise<void> {
  const s = await loadReminderSettings();
  await applyReminderSchedule(s);
}
