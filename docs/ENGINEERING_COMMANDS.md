# פקודות פיתוח — Identity Shift

| פקודה | תיאור |
|--------|--------|
| `npm install` | התקנת תלויות |
| `npx expo start` | Metro + ממשק Expo |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Jest |
| `npm run lint` | ESLint (Expo config) |
| `npm run validate:content` | אימות Zod ל־`src/data/confidence-program.json` (זהה ל־`validate:program`) |
| — | סכמת JSON רופפת (תיעוד): `src/data/confidence-program.schema.json` — מקור האמת ל-CI הוא `validate:content` (Zod) |

בדיקה מלאה לפני PR:

```bash
npm run typecheck && npm test && npm run lint && npm run validate:content
```
