import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenLayout } from '../ui/ScreenLayout';
import { PremiumCard } from '../ui/PremiumCard';
import { SectionHeader } from '../ui/SectionHeader';
import { theme, typography } from '../ui/theme';

type Props = {
  onBack: () => void;
};

export function AboutScreen({ onBack }: Props) {
  return (
    <ScreenLayout background="gradient">
      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>סגור</Text>
        </Pressable>
        <Text style={styles.screenTitle}>אודות</Text>
        <View style={styles.headerSpacer} />
      </View>

      <SectionHeader
        title="Identity Shift"
        subtitle="אימון יומי קצר לזהות ולביטחון — בלי רעש"
      />

      <PremiumCard variant="elevated" style={styles.card}>
        <Text style={styles.lead}>
          האפליקציה בנויה סביב ריטואל יומי: נשימה, עוגן מילולי, ותרגולים
          קצרים. המטרה היא עקביות שקטה — לא הישג חד־פעמי.
        </Text>
        <Text style={styles.p}>
          מתחילים מהבית, נכנסים ליום הנוכחי במסלול, ומתקדמים בקצב שלך. אחרי
          סיום יום, המסלול נשאר פתוח לחזרה; היום הבא במסלול נפתח ביום הקלנדרי
          הבא — כדי לשמור על קצב בר־קיימא.
        </Text>
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
  headerSpacer: {
    width: 48,
  },
  card: {
    padding: 22,
    gap: 18,
  },
  lead: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
    color: theme.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  p: {
    ...typography.body,
    lineHeight: 26,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
