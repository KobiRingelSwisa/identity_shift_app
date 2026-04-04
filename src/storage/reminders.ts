import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  enabled: '@identity-shift/reminder-enabled',
  hour: '@identity-shift/reminder-hour',
  minute: '@identity-shift/reminder-minute',
  promptSeen: '@identity-shift/reminder-prompt-seen',
} as const;

export type ReminderSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  promptSeen: boolean;
};

const defaults: ReminderSettings = {
  enabled: false,
  hour: 9,
  minute: 0,
  promptSeen: false,
};

export async function loadReminderSettings(): Promise<ReminderSettings> {
  try {
    const [en, h, m, p] = await Promise.all([
      AsyncStorage.getItem(KEYS.enabled),
      AsyncStorage.getItem(KEYS.hour),
      AsyncStorage.getItem(KEYS.minute),
      AsyncStorage.getItem(KEYS.promptSeen),
    ]);
    return {
      enabled: en === 'true',
      hour: h ? parseInt(h, 10) : defaults.hour,
      minute: m ? parseInt(m, 10) : defaults.minute,
      promptSeen: p === 'true',
    };
  } catch {
    return { ...defaults };
  }
}

export async function saveReminderSettings(s: Partial<ReminderSettings>): Promise<void> {
  const cur = await loadReminderSettings();
  const next = { ...cur, ...s };
  await AsyncStorage.multiSet([
    [KEYS.enabled, String(next.enabled)],
    [KEYS.hour, String(next.hour)],
    [KEYS.minute, String(next.minute)],
    [KEYS.promptSeen, String(next.promptSeen)],
  ]);
}

export async function clearReminderStorage(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
