import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenLayout } from '../../ui/ScreenLayout';
import { Title } from '../../ui/Title';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { FadeInOnMount } from '../../ui/FadeInOnMount';
import { theme } from '../../ui/theme';
import type { ChoiceStep } from '../../session/types';

type Props = {
  step: ChoiceStep;
  onNext: () => void;
  onSelect: (value: string) => void;
};

export function ChoiceScreen({ step, onNext, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ScreenLayout
      background="gradient"
      footer={
        <FadeInOnMount
          key={`ch-footer-${step.question}`}
          delayMs={240}
          durationMs={300}
        >
          <PrimaryButton
            label="המשך"
            disabled={selected == null}
            onPress={() => {
              if (selected != null) onSelect(selected);
              onNext();
            }}
          />
        </FadeInOnMount>
      }
    >
      <FadeInOnMount key={`ch-q-${step.question}`} durationMs={300}>
        <Title>{step.question}</Title>
      </FadeInOnMount>
      <FadeInOnMount
        key={`ch-opts-${step.options.join('|')}`}
        delayMs={90}
        durationMs={320}
      >
        <View style={styles.list}>
          {step.options.map((opt) => {
            const isOn = selected === opt;
            return (
              <Pressable
                key={opt}
                accessibilityRole="button"
                onPress={() => setSelected(opt)}
                style={[styles.option, isOn && styles.optionSelected]}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
      </FadeInOnMount>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  option: {
    borderRadius: theme.radiusMd,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.cardSurface,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
  },
  optionSelected: {
    borderColor: theme.accent,
    backgroundColor: 'rgba(124, 154, 255, 0.06)',
  },
  optionText: {
    color: theme.text,
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
