import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenLayout } from '../ui/ScreenLayout';
import { PremiumCard } from '../ui/PremiumCard';
import { SectionHeader } from '../ui/SectionHeader';
import { theme, typography } from '../ui/theme';

type Props = {
  onBack: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenSubscriptionTerms: () => void;
};

export function AboutScreen({
  onBack,
  onOpenPrivacy,
  onOpenTerms,
  onOpenSubscriptionTerms,
}: Props) {
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

      <PremiumCard style={styles.card}>
        <Text style={styles.legalTitle}>מסמכים</Text>
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
    gap: 12,
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
  legalTitle: {
    ...typography.screenTitle,
    fontSize: 17,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
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
});
