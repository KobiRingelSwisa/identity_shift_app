import type { Step } from './types';
import { IntroScreen } from '../screens/steps/IntroScreen';
import { BreathingScreen } from '../screens/steps/BreathingScreen';
import { TriggerScreen } from '../screens/steps/TriggerScreen';
import { ChoiceScreen } from '../screens/steps/ChoiceScreen';
import { TextScreen } from '../screens/steps/TextScreen';
import { MeditationScreen } from '../screens/steps/MeditationScreen';
import { AnchorScreen } from '../screens/steps/AnchorScreen';
import { FeedbackScreen } from '../screens/steps/FeedbackScreen';
import { CompletionScreen } from '../screens/steps/CompletionScreen';
import { UnsupportedStepScreen } from '../screens/steps/UnsupportedStepScreen';

export type StepRendererProps = {
  step: Step;
  stepIndex: number;
  onNext: () => void;
  onRecordAnswer: (key: string, value: string) => void;
};

export function StepRenderer({
  step,
  stepIndex,
  onNext,
  onRecordAnswer,
}: StepRendererProps) {
  switch (step.type) {
    case 'intro':
      return <IntroScreen step={step} onNext={onNext} />;
    case 'breathing':
      return <BreathingScreen step={step} onNext={onNext} />;
    case 'trigger':
      return <TriggerScreen step={step} onNext={onNext} />;
    case 'choice':
      return (
        <ChoiceScreen
          step={step}
          onNext={onNext}
          onSelect={(value) => onRecordAnswer(step.id, value)}
        />
      );
    case 'text':
      return <TextScreen step={step} onNext={onNext} />;
    case 'meditation':
      return <MeditationScreen step={step} onNext={onNext} />;
    case 'anchor':
      return <AnchorScreen step={step} onNext={onNext} />;
    case 'feedback':
      return (
        <FeedbackScreen
          step={step}
          onNext={onNext}
          onSelect={(value) => onRecordAnswer(`feedback-${stepIndex}`, value)}
        />
      );
    case 'completion':
      return <CompletionScreen step={step} onNext={onNext} />;
    default: {
      const unknown = step as { type?: string };
      return (
        <UnsupportedStepScreen
          stepType={unknown.type ?? 'לא ידוע'}
          onNext={onNext}
        />
      );
    }
  }
}
