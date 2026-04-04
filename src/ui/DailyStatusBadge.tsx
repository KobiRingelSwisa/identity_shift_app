import { StyleSheet, Text, View } from 'react-native';
import { theme, typography } from './theme';

export type DailyStatusVariant = 'active' | 'done_today' | 'locked' | 'track_done';

type Props = {
  variant: DailyStatusVariant;
};

const COPY: Record<DailyStatusVariant, string> = {
  active: 'מוכן לאימון היום',
  done_today: 'האימון להיום הושלם',
  locked: 'היום הבא נפתח מחר',
  track_done: 'המסלול הושלם',
};

export function DailyStatusBadge({ variant }: Props) {
  return (
    <View style={[styles.pill, styles[`tone_${variant}`]]}>
      <Text style={styles.text}>{COPY[variant]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  tone_active: {
    borderColor: 'rgba(124, 154, 255, 0.35)',
    backgroundColor: 'rgba(124, 154, 255, 0.08)',
  },
  tone_done_today: {
    borderColor: 'rgba(52, 211, 153, 0.35)',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  tone_locked: {
    borderColor: theme.surfaceBorder,
    backgroundColor: theme.surfaceElevated,
  },
  tone_track_done: {
    borderColor: 'rgba(52, 211, 153, 0.25)',
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
  },
});
