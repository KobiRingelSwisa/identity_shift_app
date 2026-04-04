import { ScreenLayout } from '../../ui/ScreenLayout';
import { Title } from '../../ui/Title';
import { BodyText } from '../../ui/BodyText';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { FadeInOnMount } from '../../ui/FadeInOnMount';
import type { TriggerStep } from '../../session/types';

type Props = {
  step: TriggerStep;
  onNext: () => void;
};

export function TriggerScreen({ step, onNext }: Props) {
  return (
    <ScreenLayout
      background="gradient"
      footer={
        <FadeInOnMount
          key={`tr-footer-${step.cta}`}
          delayMs={220}
          durationMs={300}
        >
          <PrimaryButton label={step.cta} onPress={onNext} />
        </FadeInOnMount>
      }
    >
      <FadeInOnMount key={`tr-t-${step.text}`} durationMs={320}>
        <Title variant="hero">{step.text}</Title>
      </FadeInOnMount>
      <FadeInOnMount key={`tr-s-${step.subtext}`} delayMs={100} durationMs={320}>
        <BodyText>{step.subtext}</BodyText>
      </FadeInOnMount>
    </ScreenLayout>
  );
}
