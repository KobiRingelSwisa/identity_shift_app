# Architecture (MVP)

## Principles

- **Local-first:** Progress and preferences live in `AsyncStorage` (`src/storage/`). No backend in MVP.
- **Session content:** JSON program is loaded once (`loadProgram`); **schema and step types are fixed** — UI-only flows (post-session, settings) do not add new step types.
- **Session runtime:** `SessionEngine` advances steps from the loaded day’s step list; answers from choice/feedback steps are kept in memory via a ref (`sessionAnswers.ts`) and are not persisted.

## Daily lock

- `completeDay` records the calendar date of the last finished session and the last completed track day.
- `normalizeProgressForDailyUnlock` (on `loadProgress`) advances `currentDay` to the next track day when the **local calendar date** is after that last session date, so the next day unlocks at the next calendar day without manual toggles.
- `isDailyNextLocked` is true when the user finished a **non-final** track day **today** — they may replay that day; the next track day is not available until the next calendar day.

## App flow

- `useAppBootstrap` loads program-derived progress and reminder prefs; reschedules notifications from storage on cold start.
- `useAppFlow` owns session visibility, track-complete screen, and post-session payload (anchor quote + streak).
- `App.tsx` switches screens by state (onboarding → optional reminder setup → post-session → track summary → session → settings/about overlays → home). No React Navigation dependency.

## Notifications

- `expo-notifications` schedules a **daily** local trigger at the chosen hour/minute. Behavior may differ in Expo Go vs dev builds; settings are stored in `src/storage/reminders.ts`.
