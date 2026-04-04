import { ScreenLayout } from '../../ui/ScreenLayout';
import { Title } from '../../ui/Title';
import { BodyText } from '../../ui/BodyText';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { FadeInOnMount } from '../../ui/FadeInOnMount';
import type { IntroStep } from '../../session/types';

type Props = {
  step: IntroStep;
  onNext: () => void;
};

export function IntroScreen({ step, onNext }: Props) {
  return (
    <ScreenLayout
      background="gradient"
      footer={
        <FadeInOnMount
          key={`intro-footer-${step.cta}`}
          delayMs={220}
          durationMs={300}
        >
          <PrimaryButton label={step.cta} onPress={onNext} />
        </FadeInOnMount>
      }
    >
      <FadeInOnMount key={`intro-title-${step.title}`} durationMs={320}>
        <Title variant="hero">{step.title}</Title>
      </FadeInOnMount>
      <FadeInOnMount
        key={`intro-sub-${step.subtitle}`}
        delayMs={100}
        durationMs={320}
      >
        <BodyText>{step.subtitle}</BodyText>
      </FadeInOnMount>
    </ScreenLayout>
  );
}
