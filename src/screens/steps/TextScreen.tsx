import { ScreenLayout } from '../../ui/ScreenLayout';
import { BodyText } from '../../ui/BodyText';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { FadeInOnMount } from '../../ui/FadeInOnMount';
import type { TextStep } from '../../session/types';

type Props = {
  step: TextStep;
  onNext: () => void;
};

export function TextScreen({ step, onNext }: Props) {
  return (
    <ScreenLayout
      background="gradient"
      footer={
        <FadeInOnMount
          key={`text-footer-${step.cta}`}
          delayMs={200}
          durationMs={300}
        >
          <PrimaryButton label={step.cta} onPress={onNext} />
        </FadeInOnMount>
      }
    >
      <FadeInOnMount key={`text-${step.content}`} durationMs={340}>
        <BodyText>{step.content}</BodyText>
      </FadeInOnMount>
    </ScreenLayout>
  );
}
