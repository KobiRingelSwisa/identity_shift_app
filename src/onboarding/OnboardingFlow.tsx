import { useEffect, useState } from 'react';
import { trackEvent } from '../analytics/track';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenLayout } from '../ui/ScreenLayout';
import { Title } from '../ui/Title';
import { BodyText } from '../ui/BodyText';
import { PrimaryButton } from '../ui/PrimaryButton';
import { OnboardingProgressDots } from '../ui/OnboardingProgressDots';
import { theme, typography } from '../ui/theme';
import type { CommitmentLength } from '../storage/progress';

const TOTAL_STEPS = 5;

type Props = {
  onDone: (commitment: CommitmentLength) => void;
};

export function OnboardingFlow({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<CommitmentLength | null>(null);

  useEffect(() => {
    void trackEvent('onboarding_started');
  }, []);

  const goNext = () => {
    if (step === 2 && selected == null) return;
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    }
  };

  const canContinue =
    step !== 2 || selected != null;

  const footer =
    step < TOTAL_STEPS - 1 ? (
      <PrimaryButton
        label="המשך"
        disabled={!canContinue}
        onPress={goNext}
      />
    ) : (
      <PrimaryButton
        label="נכנסים למסלול"
        onPress={() => {
          if (selected != null) onDone(selected);
        }}
        disabled={selected == null}
      />
    );

  return (
    <ScreenLayout background="gradient" footer={footer}>
      <OnboardingProgressDots current={step} total={TOTAL_STEPS} />

      {step === 0 ? (
        <View style={styles.block}>
          <Text style={styles.brand}>Identity Shift</Text>
          <Title variant="hero">שינוי נבנה מנוכחות חוזרת</Title>
          <BodyText>
            לא ממקום דחיפה — אלא מחזרה שקטה על אותו יום, עד שהקול הפנימי
            משתנה טקטית.
          </BodyText>
        </View>
      ) : null}

      {step === 1 ? (
        <View style={styles.block}>
          <Text style={styles.kicker}>עקביות</Text>
          <Title variant="hero">הקצב מנצח את הרעש</Title>
          <BodyText>
            כמה דקות בכל יום מספיקות כדי ליישר דפוס — בלי להוכיח כלום לאף אחד
            מלבד עצמך.
          </BodyText>
        </View>
      ) : null}

      {step === 2 ? (
        <>
          <View style={styles.block}>
            <Text style={styles.kicker}>מחויבות</Text>
            <Title variant="hero">בחר מסגרת זמן</Title>
            <BodyText>
              האימונים נשארים קצרים. המטרה היא רצף — לא עומס.
            </BodyText>
          </View>
          <View style={styles.row}>
            {([3, 7, 14] as const).map((n) => {
              const on = selected === n;
              return (
                <Pressable
                  key={n}
                  accessibilityRole="button"
                  onPress={() => setSelected(n)}
                  style={[styles.chip, on && styles.chipSelected]}
                >
                  <Text style={styles.chipLabel}>{`${n} ימים`}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      {step === 3 ? (
        <View style={styles.block}>
          <Text style={styles.kicker}>מה יקרה כאן</Text>
          <Title variant="hero">מסלול יומי אחד, ברור</Title>
          <BodyText>
            בכל יום: נשימה, חקירה קצרה, ועוגן — כדי לחזק נוכחות וביטחון בלי
            להתפזר.
          </BodyText>
        </View>
      ) : null}

      {step === 4 ? (
        <View style={styles.block}>
          <Text style={styles.kicker}>מוכנים</Text>
          <Title variant="hero">מתחילים מהיום הראשון</Title>
          <BodyText>
            כשהקצב משתבש — חוזרים בלי ביקורת. זה חלק מהאימון.
          </BodyText>
          {selected != null ? (
            <Text style={styles.reminder}>{`מסגרת: ${selected} ימים`}</Text>
          ) : null}
        </View>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 20,
    marginBottom: 12,
  },
  brand: {
    ...typography.caption,
    letterSpacing: 1.2,
    color: theme.accent,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  kicker: {
    ...typography.caption,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  reminder: {
    marginTop: 8,
    color: theme.accent,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  row: {
    gap: 12,
    marginTop: 8,
  },
  chip: {
    borderRadius: theme.radiusMd,
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: theme.cardSurface,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
  },
  chipSelected: {
    borderColor: theme.accent,
    backgroundColor: theme.surfaceFocus,
  },
  chipLabel: {
    color: theme.text,
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
