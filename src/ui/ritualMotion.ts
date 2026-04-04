import { Easing } from 'react-native';

/** Shared easing — quiet, no bounce (Home, Anchor, Completion). */
export const ritualEasingOut = Easing.out(Easing.cubic);

/** Durations aligned across the three signature moments. */
export const RITUAL_MS = {
  fadeHero: 280,
  fadeCard: 260,
  stagger: 100,
  fadeAnchorText: 300,
  fadeCta: 280,
  ctaDelayAnchor: 1800,
  pulseLoop: 12000,
} as const;
