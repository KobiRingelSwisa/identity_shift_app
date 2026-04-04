# Identity Shift — polish implementation plan (2026)

## Review summary

- **Flow state** lives in `App.tsx` + `useAppFlow` + `useAppBootstrap` (no React Navigation stack).
- **Progress / daily unlock** in `src/storage/progress.ts` — do not alter `normalizeProgressForDailyUnlock`, `isDailyNextLocked`, or `completeDay` semantics beyond additive fields.
- **Session engine** untouched.

## Phase deliverables

1. **Theme** — semantic tokens (surfaces, divider, radius scale), no palette drift.
2. **Primitives** — `PremiumCard`, `SectionHeader`, `AccentGlow`, `OnboardingProgressDots`, `StatChip`, `SecondaryButton`, `MotivationalQuoteBlock`, `DailyStatusBadge`.
3. **Onboarding** — 5 concise steps + dots indicator; same exit contract `onDone(commitment)`.
4. **MainHome** — sectioned layout using primitives; show `totalSessionsCompleted` from storage.
5. **PostSession / TrackComplete** — glow + copy + optional pulse; emphasize day complete.
6. **Storage** — `totalSessionsCompleted` counter (backward-compatible default 0); reset with track reset.
7. **Settings / About** — `SectionHeader`, spacing, copy.
8. **TS** — `tsc --noEmit`.

## Non-goals

- No navigation library; no JSON/schema changes; no SessionEngine edits; no change to unlock rules.
