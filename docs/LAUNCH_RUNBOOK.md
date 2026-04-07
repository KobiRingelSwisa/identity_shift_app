# Launch runbook — Identity Shift

## Pre-release checklist

- [ ] `npm run typecheck` — clean
- [ ] `npm test` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run validate:content` — clean
- [ ] EAS / store: version + build numbers bumped in `app.json`
- [ ] Env on EAS: `EXPO_PUBLIC_BILLING_PROVIDER`, RevenueCat keys (if used), no secrets in repo
- [ ] Legal copy reviewed (Privacy / Terms / Subscription)
- [ ] Support email updated (replace `support@example.com` in Settings)

## Rollback

- Revert the offending commit on `main` and submit a new build to stores.
- AsyncStorage data is local; users keep progress unless they uninstall.

## Env checklist (Expo public)

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_BILLING_PROVIDER` | `mock` or `revenuecat` |
| `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS` | RevenueCat SDK (iOS) |
| `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID` | RevenueCat SDK (Android) |
| `EXPO_PUBLIC_USE_REMOTE_BACKEND` | Reserved — remote API not wired yet |

Do not commit real API keys; use EAS Secrets for production builds.
