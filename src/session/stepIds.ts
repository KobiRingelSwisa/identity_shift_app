import type { Step } from './types';

/** Stable id for analytics + session run persistence. */
export function getStepId(step: Step, index: number): string {
  if (step.type === 'choice') return step.id;
  if (step.type === 'feedback') return `feedback-${index}`;
  return `${step.type}-${index}`;
}
