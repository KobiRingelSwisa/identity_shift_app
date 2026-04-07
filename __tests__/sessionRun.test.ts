import { buildSessionStepRuns } from '../src/session/buildSessionRun';
import type { ChoiceStep, Step } from '../src/session/types';

describe('SessionRun stepResponses', () => {
  it('builds stepResponses for choice answers', () => {
    const steps: Step[] = [
      {
        type: 'choice',
        id: 'awareness',
        question: 'q',
        options: ['a', 'b'],
      } as ChoiceStep,
    ];
    const answers = { awareness: 'a' };
    const rows = buildSessionStepRuns(steps, answers);
    expect(rows).toHaveLength(1);
    expect(rows[0].stepId).toBe('awareness');
    expect(rows[0].response).toBe('a');
  });
});
