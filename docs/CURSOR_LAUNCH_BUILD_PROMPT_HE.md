# Prompt מוכן ל-Cursor — להפוך את Identity Shift לגרסת Launch מסחרית

הדבק את כל הטקסט הבא כמו שהוא ל-Cursor:

---

אתה Lead React Native/Expo Engineer ו-Product-minded Architect.

## 0) Mission

אני רוצה שתיקח את הפרויקט הקיים `identity_shift_app` ותשדרג אותו מ-MVP מקומי לגרסת Launch מוכנה למכירה (Subscription app), תוך שמירה על החוויה הרגשית הקיימת (calm/premium/rtl).

המטרה: לבנות בסיס פרודקשן אמיתי שאפשר להשיק, למדוד, ולמכור ממנו.

---

## 1) Context קיים (אל תשבור)

- האפליקציה בנויה ב-Expo + React Native + TypeScript.
- flow מסכים מנוהל ב-`App.tsx` ללא React Navigation.
- session engine דקלרטיבי לפי `step.type`.
- progress נשמר ב-AsyncStorage (local-first).
- יש daily lock ליום הבא.
- יש reminders דרך `expo-notifications`.

### קבצים חשובים לקריאה לפני שינוי

1. `App.tsx`
2. `src/app/useAppFlow.ts`
3. `src/app/useAppBootstrap.ts`
4. `src/storage/progress.ts`
5. `src/session/SessionEngine.tsx`
6. `src/session/StepRenderer.tsx`
7. `src/data/confidence-program.json`
8. `src/analytics/track.ts`
9. `docs/ARCHITECTURE.md`
10. `docs/design-rules-development.md`

---

## 2) Non-negotiable product requirements

1. **אין רגרסיה ב-flow הקיים** (onboarding -> reminder setup -> home -> session -> post-session/track complete).
2. **RTL מלא** במסכים החדשים.
3. **TypeScript strict ללא any לא הכרחי**.
4. **אין hardcoded סודות בקוד**; שימוש ב-env בטוח.
5. **כל feature חדש עם analytics events**.
6. **כל לוגיקה קריטית עם tests**.
7. **שינויים אינקרמנטליים**: כל שלב קומפילבילי.

---

## 3) מה לבנות בפועל (Launch foundation)

בצע לפי השלבים הבאים, עם PR/commit נפרד לכל שלב:

### Phase A — Data + Backend foundation

#### A1. הוסף שכבת Backend Abstraction

- צור תיקיה: `src/backend/`
- הגדר interface אחיד לשירות נתונים:
  - `getUserProfile`
  - `upsertUserProfile`
  - `getProgramProgress`
  - `upsertProgramProgress`
  - `createSessionRun`
  - `listSessionRuns`
  - `saveAnchor`
- הוסף `LocalBackendAdapter` שעובד על AsyncStorage (ללא breaking changes).
- הכן גם `RemoteBackendAdapter` placeholder (ללא תלות קשיחה בספק).

#### A2. Persist אמיתי ל-session answers

- כרגע תשובות נשמרות בזיכרון בלבד; תוסיף שמירת `SessionRun` בסיום סשן.
- שמור לפחות:
  - `runId`
  - `startedAt`
  - `completedAt`
  - `programId`
  - `day`
  - `steps[]` עם `stepId/type/response`

#### A3. Error boundary + logging בסיסי

- הוסף ErrorBoundary ברמת app root.
- הוסף logger utility:
  - dev: console
  - prod: hook ל-provider (placeholder)

---

### Phase B — Monetization (חובה להשקה)

#### B1. Subscription model

- הוסף `src/billing/` עם service abstraction:
  - `getOfferings`
  - `purchasePackage`
  - `restorePurchases`
  - `getCustomerState`
- צור `MockBillingProvider` לפיתוח מקומי.
- הכן `RevenueCatProvider` (production-ready structure, guarded by env flag).

#### B2. Entitlements

- הגדר entitlement יחיד כרגע: `premium_access`.
- Free tier:
  - Track בסיסי אחד (confidence)
  - פיצ'רים מינימליים בלבד.
- Premium tier:
  - unlock למסלולים נוספים (מבנה מוכן גם אם התוכן יגיע אחרי).

#### B3. Paywall UX

- הוסף `PaywallScreen` עם:
  - value props ברורים
  - monthly + yearly toggle
  - restore purchases
  - close button (כדי לא לפגוע trust)
- Trigger points:
  - אחרי Day 2 completion
  - ובסיום Day 7
- אל תעשה “hard aggressive lock” על הפיצ'ר הבסיסי.

---

### Phase C — Analytics & Growth instrumentation

#### C1. Event taxonomy מלא

שדרג את `src/analytics/track.ts` לאירועים הבאים לפחות:

- onboarding_started/completed
- reminder_prompt_viewed
- reminder_enabled/reminder_denied
- session_started
- step_viewed
- choice_selected
- session_completed
- session_abandoned
- paywall_viewed
- paywall_cta_clicked
- purchase_started
- purchase_success
- purchase_failed
- restore_started/restore_success/restore_failed

#### C2. Strong typing

- צור `AnalyticsEventMap` עם payload typed לכל אירוע.
- מנע שליחת event עם payload לא תואם טיפוסים.

#### C3. Funnel helpers

- הוסף utility dashboard-oriented:
  - completion rates
  - D1/D3/D7 retention markers
  - paywall conversion markers

---

### Phase D — Launch readiness (Trust + Compliance)

#### D1. Legal screens

- הוסף מסכי:
  - Privacy Policy
  - Terms of Use
  - Subscription Terms
- הוסף לינקים ממסך Settings/About.
- כל copy placeholder אבל מבנה production-ready.

#### D2. Consent & privacy

- הוסף consent toggle ל-analytics (ברירת מחדל ON או OFF לפי best practice שתנמק בקוד/comments).
- אם analytics כבוי — לא לשלוח אירועים לא קריטיים.

#### D3. Support channel

- הוסף בתוך Settings:
  - Contact support
  - Report issue
- לפחות mailto deep link עם device/app metadata מינימלי.

---

### Phase E — Engineering hardening

#### E1. Validation לתוכן JSON

- הוסף schema validation ל-`confidence-program.json` בזמן build/test.
- אם schema invalid -> fail CI.

#### E2. Testing

- הוסף Jest + unit tests לפחות ל:
  - `normalizeProgressForDailyUnlock`
  - `isDailyNextLocked`
  - billing entitlement gate
  - analytics typing guards
- הוסף test script ב-`package.json`.

#### E3. CI בסיסי

- צור GitHub Actions workflow:
  - install
  - typecheck
  - test
  - content schema validation

---

## 4) UX guidelines (חובה)

- שמור על שפה רגועה, מינימלית, לא אגרסיבית.
- אין dark patterns ב-paywall.
- כפתור ראשי ברור אחד לכל מסך.
- תמיכה ב-RTL + נגישות:
  - accessibility labels
  - touch targets נוחים
  - Dynamic Type היכן רלוונטי

---

## 5) Architecture rules

1. כל יכולת חדשה דרך שכבת abstraction, לא קריאה ישירה מפוזרת.
2. לא לשבור API קיים של `OnboardingFlow` ו-`SessionContainer` אלא אם חייבים — ואם כן, בצע migration נקי.
3. כל feature flag תחת `src/config/featureFlags.ts`.
4. אין copy-paste ענק; העדף utilities/shared components.

---

## 6) Output format שאני רוצה ממך בכל שלב

לכל Phase:

1. **Plan קצר** (מה אתה משנה ולמה)
2. **רשימת קבצים** שתשנה
3. **קוד מלא + patches**
4. **בדיקות שהרצת** + תוצאה
5. **סיכום סיכונים פתוחים**

בסיום כל ה-Phases תן:

- "Launch readiness checklist" עם סטטוס ✅/⚠️/❌ לכל סעיף.
- "Go live blockers" אם יש.

---

## 7) Definition of Done (קשיח)

הפרויקט נחשב מוכן רק אם כל התנאים מתקיימים:

1. `npx tsc --noEmit` עובר.
2. `npm test` עובר.
3. יש paywall + restore + entitlement gating.
4. יש analytics events מלאים למסע משתמש ומוניטיזציה.
5. יש legal pages + support entry points.
6. יש persistence מלא ל-session runs.
7. אין שבירה ב-flow היומי הקיים.
8. קיים README/Docs מעודכן שמסביר config ל-launch.

אם משהו לא ברור — תבצע הנחות סבירות, תתעד אותן, ותמשיך להתקדם במקום לעצור.

---

## 8) Bonus (אם יש זמן)

- Remote config מינימלי ל-paywall experiments.
- A/B basic hooks (ללא תשתית כבדה).
- הכנה למסלול תוכן שני (`money`) עם gating פרימיום.

---

## 9) סגנון עבודה

- תעבוד נקי, מודולרי, production-minded.
- תעדיף אמינות ותחזוקתיות על פני "קסמים".
- כשיש tradeoff — תסביר ותבחר באופציה הבטוחה לפרודקשן.

---
