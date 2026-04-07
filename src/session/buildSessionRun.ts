import type { SessionStepRun } from '../backend/types';
import type { Step } from './types';
import type { SessionAnswers } from './sessionAnswers';
import { getStepId } from './stepIds';

export function buildSessionStepRuns(
  steps: Step[],
  answers: SessionAnswers
): SessionStepRun[] {
  return steps.map((step, index) => {
    const stepId = getStepId(step, index);
    let response: string | null = null;
    if (step.type === 'choice') {
      response = answers[step.id] ?? null;
    } else if (step.type === 'feedback') {
      response = answers[`feedback-${index}`] ?? null;
    }
    return { stepId, type: step.type, response };
  });
}
