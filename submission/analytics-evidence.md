# Noodle Nova — Analytics and Monitoring Evidence

## Current implementation

The application includes the Vercel Analytics React component in `app/layout.tsx` and the `@vercel/analytics` package in `package.json`. Level 5 events are centralized in `lib/analytics.ts` and are emitted from the landing page, wallet lifecycle, onboarding registration, sponsor-route transaction lifecycle, and feedback modal.

| Event | Trigger | Properties sent |
|---|---|---|
| `landing_view` | Landing page mounts | None |
| `wallet_connect_started` | User begins wallet connection | None |
| `wallet_connected` | Public wallet address is returned | None |
| `wallet_connect_failed` | Wallet/extension/address/registration error | Generic reason only |
| `onboarding_completed` | Courier profile is saved successfully | None |
| `transaction_submitted` | Sponsor-route request begins | Generic flow and route number |
| `transaction_succeeded` | Sponsor-route API returns a hash | Generic flow and route number |
| `transaction_failed` | Sponsor-route request fails | Generic flow, route number, generic reason |
| `feedback_submitted` | Feedback API succeeds | Rating only |
| `feedback_failed` | Feedback API fails | Generic reason only |

No email address, full wallet address, transaction hash, admin token, database credential, or private feedback text is sent as an analytics property.

## Verification status

| Evidence item | Status |
|---|---|
| Analytics component present in source | **Verified** |
| Privacy-safe event helper present in source | **Verified** |
| Custom events compiled successfully | **Verified locally** |
| Provider dashboard or event counts | **Not independently verified** |
| Error-tracking provider such as Sentry | **Not verified** |
| Public analytics screenshot | **Not available yet** |
| Transaction-activity screenshot | **Available** — see the admin-panel evidence images and [`level5-user-activity.md`](level5-user-activity.md) |

The current Level 5 submission should therefore describe analytics as **implemented in code but dashboard evidence pending**, and use the independently verified transaction/admin evidence for the required activity screenshot. A final reviewer package should include a dated dashboard screenshot if the owner provides access to the Vercel Analytics view.
