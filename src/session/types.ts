export type StepType =
  | 'intro'
  | 'breathing'
  | 'trigger'
  | 'choice'
  | 'text'
  | 'meditation'
  | 'anchor'
  | 'feedback'
  | 'completion';

export type IntroStep = {
  type: 'intro';
  title: string;
  subtitle: string;
  cta: string;
};

export type BreathingStep = {
  type: 'breathing';
  text: string;
  duration: number;
};

export type TriggerStep = {
  type: 'trigger';
  text: string;
  subtext: string;
  cta: string;
};

export type ChoiceStep = {
  type: 'choice';
  id: string;
  question: string;
  options: string[];
};

export type TextStep = {
  type: 'text';
  content: string;
  cta: string;
};

export type MeditationStep = {
  type: 'meditation';
  text: string;
  subtext: string;
  duration: number;
  audio: string;
};

export type AnchorStep = {
  type: 'anchor';
  text: string;
};

export type FeedbackStep = {
  type: 'feedback';
  question: string;
  options: string[];
};

export type CompletionStep = {
  type: 'completion';
  title: string;
  subtitle: string;
  cta: string;
};

export type Step =
  | IntroStep
  | BreathingStep
  | TriggerStep
  | ChoiceStep
  | TextStep
  | MeditationStep
  | AnchorStep
  | FeedbackStep
  | CompletionStep;

export type Track = {
  id: string;
  title: string;
  duration_days: number;
  estimated_session_minutes: number;
};

export type DaySession = {
  day: number;
  theme: string;
  steps: Step[];
};

export type ConfidenceProgram = {
  track: Track;
  days: DaySession[];
};
