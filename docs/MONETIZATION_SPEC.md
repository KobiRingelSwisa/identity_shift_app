# Monetization spec (placeholder)

## Pricing (placeholders)

| SKU | Display | Notes |
|-----|---------|--------|
| mock_monthly | ₪18.90 / month | Mock provider |
| mock_yearly | ₪149 / year | Mock provider |

Replace with real SKUs when connecting App Store / Play Billing + RevenueCat.

## Entitlements

| ID | Meaning |
|----|---------|
| `premium_access` | Unlocks future premium tracks / features; base `confidence` track remains usable without paywall lockout. |

## Free vs premium

- **Free:** full `confidence` 7-day track (current app core).
- **Premium:** additional tracks and advanced features (TBD); gating via `hasPremiumAccess()` / `canAccessPremiumTracks()`.
