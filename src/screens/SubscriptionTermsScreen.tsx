import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenLayout } from '../ui/ScreenLayout';
import { theme, typography } from '../ui/theme';

type Props = { onBack: () => void };

export function SubscriptionTermsScreen({ onBack }: Props) {
  return (
    <ScreenLayout background="gradient">
      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>סגור</Text>
        </Pressable>
        <Text style={styles.title}>תנאי מנוי</Text>
        <View style={styles.spacer} />
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.p}>
          טקסט placeholder לתנאי מנוי: חידוש אוטומטי, ביטול דרך חנות הפלטפורמה,
          מדיניות החזרים של Apple/Google, ושינוי מחירים בהודעה מראש.
        </Text>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  back: {
    color: theme.accent,
    fontSize: 15,
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  title: {
    ...typography.screenTitle,
    fontSize: 20,
    writingDirection: 'rtl',
  },
  spacer: { width: 48 },
  body: { paddingBottom: 32, gap: 16 },
  p: {
    ...typography.body,
    color: theme.textSecondary,
    textAlign: 'right',
    lineHeight: 22,
    writingDirection: 'rtl',
  },
});
