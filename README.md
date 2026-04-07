# Identity Shift

אפליקציית React Native (Expo) לתרגול נוכחות ודפוסים — local-first, RTL.

## פיתוח

```bash
npm install
npx expo start
```

## בדיקות ואיכות

```bash
npm run typecheck
npm test
npm run lint
npm run validate:content
```

פקודות מלאות: [`docs/ENGINEERING_COMMANDS.md`](docs/ENGINEERING_COMMANDS.md).

## הגדרת Launch (סביבה)

הגדר משתני `EXPO_PUBLIC_*` ב־EAS Secrets או בקובץ `.env` מקומי (לא לשמור סודות בקוד).

| משתנה | תיאור |
|--------|--------|
| `EXPO_PUBLIC_BILLING_PROVIDER` | `mock` (ברירת מחדל) או `revenuecat` |
| `EXPO_PUBLIC_USE_REVENUECAT` | `true` כשמחברים RevenueCat |
| `EXPO_PUBLIC_REVENUECAT_API_KEY` / `*_IOS` / `*_ANDROID` | מפתחות SDK (לא סוד שרת) |
| `EXPO_PUBLIC_USE_REMOTE_BACKEND` | שמור לעתיד — כרגע persistence מקומי בלבד |

כתובת תמיכה ב־Settings (mailto) היא placeholder — עדכן לדומיין אמיתי לפני השקה.

## ארכיטקטורה (תקציר)

- **נתונים:** `getAppRepository()` ב־`src/repositories/` → `LocalAppRepository` / `RemoteAppRepository`; מימוש מקומי ב־`src/backend/` (AsyncStorage). `SessionRun.stepResponses` נשמר בסיום אימון (כולל replay).
- **בילינג:** `src/billing/` — Mock לפיתוח; מבנה מוכן ל־RevenueCat כשהמודול הנטיבי מחובר.
- **אנליטיקה:** `src/analytics/track.ts` — מפת אירועים מטופסים; אפשר לכבות אנליטיקה לא קריטית בהגדרות (אירועים קריטיים מינימליים נשמרים).

מסמכים: `docs/ARCHITECTURE.md`, `docs/LAUNCH_RUNBOOK.md`, `docs/MONETIZATION_SPEC.md`, `docs/ANALYTICS_EVENT_CATALOG.md`, `docs/CURSOR_LAUNCH_BUILD_PROMPT_HE.md`.

## Launch readiness (סטטוס מהיר)

| סעיף | סטטוס |
|------|--------|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ |
| `npm test` | ✅ |
| `npm run validate:content` | ✅ |
| Paywall + restore + entitlements (Mock) | ✅ |
| אנליטיקה + הסכמה | ✅ |
| דפים משפטיים + תמיכה (Settings) | ✅ |
| שמירת SessionRun מקומית | ✅ |
| Flow יומי (אונבורדינג → תזכורת → בית → סשן → פוסט) | ✅ |
| RevenueCat אמיתי | ⚠️ מבנה מוכן; מפתח + מודול נטיבי |
| עורך דין לטקסטים משפטיים | ⚠️ placeholder לפני חנות |

**חסמים ל־go-live:** אימות מנויים בחנות, טקסטים משפטיים סופיים, כתובת תמיכה אמיתית, מפתחות EAS.
