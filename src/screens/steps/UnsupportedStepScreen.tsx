import { ScreenLayout } from '../../ui/ScreenLayout';
import { Title } from '../../ui/Title';
import { BodyText } from '../../ui/BodyText';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { FadeInOnMount } from '../../ui/FadeInOnMount';

type Props = {
  stepType: string;
  onNext: () => void;
};

export function UnsupportedStepScreen({ stepType, onNext }: Props) {
  return (
    <ScreenLayout
      background="gradient"
      footer={
        <FadeInOnMount delayMs={200} durationMs={300}>
          <PrimaryButton label="המשך" onPress={onNext} />
        </FadeInOnMount>
      }
    >
      <FadeInOnMount durationMs={300}>
        <Title>שלב לא נתמך</Title>
      </FadeInOnMount>
      <FadeInOnMount delayMs={90} durationMs={320}>
        <BodyText>{`סוג: ${stepType}`}</BodyText>
      </FadeInOnMount>
    </ScreenLayout>
  );
}
