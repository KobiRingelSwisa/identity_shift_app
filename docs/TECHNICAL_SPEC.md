# אפיון טכני — Identity Shift / Daily Consciousness Training

**מקור:** `ai-app-spec.md` (תמליל שיחה ומפרט מוצר)  
**גרסת מסמך:** 1.0  
**תאריך ייחוס:** 2026-04-02

---

## 1. מטרה ותיאור מוצר (קצר להנדסה)

**שם עבודה:** מערכת אימון תודעה יומית מבוססת הרגלים — לא ספריית מדיטציות גנרית.

**הליבה:** Session יומי קצר (יעד ~5–15 דק׳ לפי מסלול) שמבוסס על **סיטואציה אמיתית → זיהוי דפוס → בחירת זהות חלופית → הטמעה (אודיו/דמיון) → עוגן (משפט/התנהגות)**.

**בידול מוצרי (אינווריאנטים ל-UX):** אינטראקציה אקטיבית (בחירות), שפה יומיומית ללא ז׳רגון “קוונטי” באונבורדינג, ערך מהיר (תוך דקה ראשונה).

---

## 2. החלטות מוצר שחייבות להיות קבועות לפני פיתוח (יישור קו)

| נושא | המלצה מהמסמך | הערת אפיון |
|------|----------------|------------|
| אורך מסלול MVP | 7 ימים לתחום | ימים 8+ = phase 2 |
| תחומים ב-MVP | המסמך מתנגש: “רק תחום אחד” מול אונבורדינג רב-תחומי | **להגדיר דגל מוצר:** `SINGLE_TRACK_MVP=true` ⇒ רק מסלול אחד בחבילה; או `multi_track` עם כל התחומים אך סיכון ל-scope |
| AI | לא ב-MVP | personalization / voice — אחרי |
| ניווט בסשן | קדימה בלבד | אין “חזור” ב-MVP |
| זמן סשן ראשון | 5–7 דק׳ | להבדיל מסשנים “מלאים” 10–15 דק׳ אם תרצו בהמשך |

**פער במסמך המקורי:** פס ה-progress מופיע כ־"Step X/8", "X/9" וגם flow של 10 מסכים — **באפיון הטכני:** `totalSteps` יגיע ממניפסט היום, לא קשיח בקוד.

---

## 3. תחומי תוכן (Topics) ומסלולים

### 3.1 מזהי תחומים (מומלץ ל-enums בקוד)

| `topicId` | שם תצוגה | הערות |
|-----------|-----------|--------|
| `money` | כסף ושפע | יש Day 1 מפורט ב-JSON במסמך |
| `confidence` | ביטחון עצמי | מתואר תמציתית ל-7 ימים |
| `emotional_control` | שליטה רגשית | תמציתי |
| `career_self_actualization` | מימוש עצמי / קריירה | תמציתי |

### 3.2 שלד יום במסלול (קבוע לכל תחום)

| day | phase | מטרה |
|-----|--------|------|
| 1 | Awareness | זיהוי דפוס |
| 2 | Interrupt | עצירת אוטומט |
| 3 | Reframe | שינוי פרשנות |
| 4 | Identity | זהות “הגרסה החדשה” |
| 5 | Behavior | פעולה אחרת |
| 6 | Embodiment | גוף + רגש |
| 7 | Integration | יישום בחיים |

כל יום ממומש כ־**רשימת צעדים (steps)** במנוע ה-Session (ראו סעיף 6).

---

## 4. זרימות משתמש (User Flows)

### 4.1 אונבורדינג (2–3 שלבים + כניסה לסשן)

1. **Hook רגשי:** שאלה “איפה אתה מרגיש תקוע?” — 3–4 אופציות (ניסוח רגשי, לא dropdown טכני).
2. **מיקוד (אופציונלי אך מומלץ במסמך):** “מתי זה הכי קורה לך?” — בוקר / עבודה / מול אנשים / לבד.
3. **Micro-commitment:** “כמה ימים אתה מתחייב?” — 3 / 7 / 14 (מתאים להגדרת תזכורות + streak).
4. **מעבר מיידי** ל־Session ראשון מקוצר (ללא הרשמה ארוכה לפני ערך).

**כללים:** ללא שפה “רוחנית כבדה”; הרשמה (אימייל וכו’) **אחרי** ערך ראשון (מפורש במסמך).

### 4.2 שינוי תחום

לא במסך הראשון; **מהגדרות / אחרי מספר ימים** — מפורש במסמך.

### 4.3 מסלול יומי

1. מסך בית: היום בתוכנית / CTA “התחל את היום”.
2. הרצת Session לפי `programId` + `dayIndex`.
3. סיום → עדכון התקדמות, streak, תזכורת למחר.
4. סיום מסלול (יום 7) → מסך השלמה + אופציה להמשך מסלול חדש / תחום (תלוי אסטרטגיה).

---

## 5. דרישות פונקציונליות

### 5.1 מנוע Session (Session Engine)

- טעינת הגדרת יום מ־**מקור דקלרטיבי** (JSON בדיסק / CDN / אובייקט בשרת).
- רינדור צעד לפי `step.type`.
- מעבר קדימה בלבד; שמירת אינדקס צעד נוכחי.
- שמירת תשובות לבחירות (`choice`) לאנליטיקה ולעתיד התאמה.
- תמיכה בטיימרים: `breathing`, `meditation` — CTA מופיע אחרי משך או מוקדם לפי מדיניות UX.

### 5.2 גיימיפיקציה

- **Streak:** מומלץ במסמך לקשר ל-“פעלת מתוך הגרסה החדשה” — בהנדסה: לפחות **streak של השלמת session יומי** + זיהוי `topicId`.
- **התחייבות ימים** מאונבורדינג: קובע תזכורות ו/או יעד streak.
- Progress bar למסלול: יום 1..7.

### 5.3 התראות (Push / Local)

- תזכורת יומית להשלמת session (ניסוח ותזמון לפי שעה מועדפת — להגדיר בשלב MVP מינימלי: “אותה שעה כל יום” או ברירת מחדל).
- קישור התראה → מסך היום הבא (deep link).

### 5.4 אודיו

- מזהה עקיף במסמך: `calm_loop_01` — אחסון קבצים מקומיים או הורדה; נגן עם fade; כיבוי אופציונלי.

### 5.5 “שמור לי” (Anchor)

- שמירת משפט עוגן למועדפים / יומן אישי — דורש מודל דאטה מינימלי (ראו סעיף 7).

---

## 6. מודל נתונים של תוכן (Content Schema)

### 6.1 היררכיה לוגית

```
Program
  ├── id, topicId, title, locale, version
  └── days: DayManifest[]
        ├── day (1-7), phase (enum), title, subtitle, estimatedMinutes
        └── steps: SessionStep[]
```

### 6.2 טיפוסי צעדים (`SessionStep.type`)

התאמה למה שמופיע במסמך + הרחבות מומלצות להנדסה:

| type | תיאור | שדות עיקריים |
|------|--------|----------------|
| `intro` | כניסה ליום | `title`, `subtitle`, `cta` |
| `breathing` | Reset נשימה | `text`, `duration` (שניות), `autoProgress` optional |
| `trigger` | הזמנה לסיטואציה | `text`, `subtext`, `cta` |
| `choice` | שאלה רב-ברירה | `id`, `question`, `options[]`, `selectionMode: single` (ברירת מחדל), optional `emojiPerOption[]` |
| `text` | מסך טקסט / השתקפות | `content`, `cta`, optional `contentByChoiceId` לעתיד |
| `meditation` | Embedding | `text`, `subtext`, `duration`, `audio` (asset id) |
| `anchor` | משפט מרכזי | `text`, `primaryCta`, `secondaryCta` (שמור), `actions[]` |
| `feedback` | דיוק חוויה | `question`, `options[]` |
| `completion` | סיום | `title`, `subtitle`, `cta` |

**הערה:** במסמך יש `SessionStep` כ-union של שמות בלבד; **חובה** בשכבת JSON אחידה: `type` + אובייקט שדות (או שדות שטוחים כפי שבדוגמה).

### 6.3 דוגמת JSON (Money Day 1)

מומלץ להוסיף בשכבה הטכנית:

- `schemaVersion`
- `step.id` ייחודי לכל צעד (לניטור נטישה)
- `programId`, `day`, `topic` כבר קיימים בדוגמה

```json
{
  "schemaVersion": 1,
  "programId": "money_mindset_v1",
  "day": 1,
  "topic": "money",
  "phase": "awareness",
  "estimatedMinutes": 5,
  "steps": [
    { "type": "intro", "title": "Day 1 — לזהות את הדפוס", "subtitle": "היום נתחיל להבין איך אתה מגיב סביב כסף", "cta": "התחל" },
    { "type": "breathing", "text": "קח נשימה עמוקה…", "duration": 6 },
    { "type": "trigger", "text": "תחשוב על רגע שבו הרגשת לחץ סביב כסף", "subtext": "אולי הוצאה גדולה או חוסר ודאות", "cta": "יש לי רגע כזה" },
    { "type": "choice", "id": "awareness", "question": "מה קורה לך ברגע הזה?", "options": ["אני נכנס ללחץ", "אני מתכווץ", "אני נמנע", "אני לא בטוח"] },
    { "type": "text", "content": "זה דפוס טבעי — אבל אפשר לשנות אותו", "cta": "המשך" },
    { "type": "choice", "id": "identity", "question": "איך אדם עם שפע היה מגיב?", "options": ["נשאר רגוע", "פועל בביטחון", "רואה הזדמנות"] },
    { "type": "meditation", "text": "דמיין את עצמך מגיב ככה עכשיו", "subtext": "שים לב איך זה מרגיש בגוף", "duration": 8, "audio": "calm_loop_01" },
    { "type": "anchor", "text": "כסף לא מנהל אותי — אני מנהל אותו" },
    { "type": "feedback", "question": "כמה זה הרגיש לך מדויק?", "options": ["מאוד", "סבבה", "פחות"] },
    { "type": "completion", "title": "מעולה. התחלת לשנות דפוס.", "subtitle": "נתראה מחר ל־Day 2", "cta": "המשך" }
  ]
}
```

---

## 7. מודל דאטה של משתמש (Client / Server — להחלטה)

**מינימום ל-MVP:**

| ישות | שדות |
|------|------|
| `UserProfile` | `id`, `locale`, `createdAt`, onboarding flags |
| `OnboardingState` | `selectedPainOptionId`, `contextOptionId`, `commitmentDays` (3/7/14) |
| `ProgramProgress` | `programId`, `topicId`, `currentDay` (1–7), `completedDays[]`, `lastCompletedAt` |
| `SessionRun` | `runId`, `programId`, `day`, `startedAt`, `completedAt`, `steps[]` עם `{ stepId, type, response? }` |
| `SavedAnchor` | `text`, `day`, `topicId`, `savedAt` |

סנכרון ענן = אופציונלי ל-MVP אם מתחילים עם מכשיר בודד + אחסון מקומי.

---

## 8. ארכיטקטורה לקוח (המלצה)

- **שכבת UI:** קומפוננטה אחת לכל `type` (כפי גיבוש במסמך): `SessionIntroScreen`, `BreathingScreen`, `TriggerScreen`, `ChoiceScreen`, `TextScreen`, `MeditationScreen`, `AnchorScreen`, `FeedbackScreen`, `CompletionScreen`.
- **Coordinator:** `SessionController` — מחזיק `currentStepIndex`, מטפל ב-`onNext`, דוחף אירועים לאנליטיקה.
- **ContentLoader:** טוען JSON לפי `(programId, day)` עם cache.
- **Validation:** בזמן build או CI — JSON מול JSON Schema (מומלץ).

הערה מהמסמך: Renderer מוצע כ־`switch(step.type)` — מתאים ל-React / React Native / Flutter באותו עיקרון.

---

## 9. אנליטיקה (אירועים)

מינימום לפי מטרות המסמך (Retention, השלמת session):

| אירוע | פרמטרים |
|-------|---------|
| `onboarding_started` / `onboarding_completed` | שלבים |
| `session_started` | `programId`, `day`, `topicId` |
| `step_viewed` | `stepId`, `type`, index |
| `choice_selected` | `choiceId`, `value` |
| `session_completed` | משך, `day` |
| `session_abandoned` | אחרון `stepId` |
| `notification_scheduled` / `notification_opened` | |

---

## 10. UX / UI עקרונות (חובה)

- מסך אחד = רעיון/פעולה אחת.
- טקסט מינימלי; בלי “שיעור”.
- ב־`choice` — מעבר אוטומטי אחרי בחירה (ב-MVP).
- הצגת משך משוער ל-session (~5 דק׳ / ~15 דק׳ לפי הגדרת יום).
- ויזואל: מינימליסטי, רגוע, gradient/אנימציית נשימה כפי שתואר.

---

## 11. אי־פונקציונלי ותאימות

- **ביצועים:** טעינת אודיו ללא חסימת UI; גודל חבילת נכסים סביר.
- **נגישות (Phase 1.1):** Touch targets, תמיכה ב-Dynamic Type / font scaling.
- **פרטיות:** מדיניות למסכי רגש/בריאות; **לא** לטעון טענות רפואיות; Disclaimer כללי (ייעוץ עם מקצוען כשצריך — למשפטן).
- **שפות:** המסמך בעברית; הארכיטקטורה תומכת ב־`locale` על תוכן.

---

## 12. Phase 2 (מחוץ ל-MVP)

- Voice guided, AI personalization, A/B בצעדים, multi-select ב-choice, חזרה אחורה ב-session, מסלולים 14/21 יום, “קפיצה קוונטית” כחוויה אינטראקטיבית נפרדת.

---

## 13. קריטריוני קבלה (Acceptance)

- משתמש חדש משלים אונבורדינג + session ראשון בלי הרשמה חובה לפני כן (אלא אם נבחר אחרת במוצר).
- יום 1 של `money` רץ מקצה לקצה לפי JSON.
- התקדמות נשמרת: אחרי סגירה ופתיחה חוזרת — המשתמש מגיע ליום הנכון.
- התראה יומית ניתנת לתזמון בסיסי.
- אנליטיקה שולחת `session_completed` ו-`session_abandoned`.

---

## 14. שאלות פתוחות לפני סטאק סופי

1. **פלטפורמה:** iOS+Android (RN/Flutter) מול Web PWA בלבד?
2. **מסחור MVP:** בלי תשלום / מנוי / freemium?
3. **משתמש מחובר:** אנונימי מקומי מול Firebase/Supabase מיום 1?
4. **תחום יחיד בחבילה הראשונה:** כסף בלבד או כל ארבעת התחומים עם בחירה באונבורדינג?
5. **שפות בשחרור:** עברית בלבד?
