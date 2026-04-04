import programJson from '../data/confidence-program.json';
import type { ConfidenceProgram, Step } from './types';

const program = programJson as ConfidenceProgram;

export function loadProgram(): ConfidenceProgram {
  return program;
}

export function getDaySteps(
  data: ConfidenceProgram,
  dayNumber: number
): Step[] {
  const day = data.days.find((d) => d.day === dayNumber);
  return day?.steps ?? [];
}

/** First anchor step copy for a track day (for post-session / daily phrase UI). JSON schema unchanged. */
export function getAnchorTextForDay(
  data: ConfidenceProgram,
  dayNumber: number
): string | null {
  for (const step of getDaySteps(data, dayNumber)) {
    if (step.type === 'anchor') {
      return step.text;
    }
  }
  return null;
}

/** Hebrew display labels for day themes (JSON `theme` stays English). */
const THEME_LABEL_HE: Record<string, string> = {
  Awareness: 'מודעות ונוכחות',
  Interrupt: 'עצירה בזמן אמת',
  Reframe: 'מסגור מחדש',
  Identity: 'זהות ועמידה',
  Behavior: 'דפוס ופעולה',
  Embodiment: 'נוכחות בגוף',
  Integration: 'שילוב וסגירה',
};

export function getDayThemeLabelHe(
  data: ConfidenceProgram,
  dayNumber: number
): string {
  const day = data.days.find((d) => d.day === dayNumber);
  if (!day) return 'ביטחון ונוכחות';
  return THEME_LABEL_HE[day.theme] ?? day.theme;
}
