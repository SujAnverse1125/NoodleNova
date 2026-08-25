# Noodle Nova — Level 5 Release Notes

## Release scope

This release prepares Noodle Nova for Level 5 review with focused changes driven by the owner-confirmed feedback sheet. The work improves first-run clarity, wallet/profile registration reliability, sponsor-route transaction visibility, feedback validation, privacy-safe usage events, and hosted test determinism. The existing Soroban contract and database model were not changed.

## Shipped changes

| Area | Result |
|---|---|
| Landing onboarding | Added a visible three-step `How it works` explanation covering wallet connection, route selection, and receipt verification. |
| Authenticated onboarding | Added a four-step first-flight checklist that tracks wallet/profile/first-route progress. |
| Wallet registration | Registration failure now remains visible and does not falsely mark a profile connected when the API cannot save it. |
| Transaction UX | Sponsor-route requests now show pending, confirmed, and error states, block duplicate sponsorship clicks, expose retry, and link successful receipts to Stellar Expert Testnet. |
| Feedback | Blank comments are rejected locally, API responses are parsed safely, and retry-oriented errors are shown. |
| Analytics | Added a centralized privacy-safe event vocabulary for landing, wallet, onboarding, transaction, and feedback lifecycle events. |
| CI stability | Changed `npm test` to run the intended unit tests only and moved the database smoke test to explicit `npm run test:db`, avoiding recursive traversal of broken absolute skill links. |
| Evidence | Prepared a public email-free Excel export, a public-safe user activity register, feedback traceability, analytics evidence note, and Level 5 checklist. |

## Validation completed

- `npm test`: passed, 3 repository unit tests.
- `npm run build`: passed with existing Stellar/Sodium critical-dependency warnings and an existing dynamic-server-usage diagnostic for `/api/user/stats`.
- Local visual verification: landing and sponsor-route pages render; prologue can be dismissed; no wallet signing was attempted because Freighter is not installed in the browser session.
- Hosted verification: [GitHub Actions run 32850838890](https://github.com/SujAnverse1125/NoodleNova/actions/runs/32850838890) completed successfully for [`f4cd575`](https://github.com/SujAnverse1125/NoodleNova/commit/f4cd575); the runner reported only a Node.js action deprecation annotation.
- Sheet analysis: 80 response rows, 76 unique wallets, four duplicate wallet rows, 42 unique valid hash values, average rating 4.34/5.
- Testnet verification: all 42 candidate hashes returned successful Horizon records; same-row wallet/source attribution remains unresolved.
- Admin read-only evidence: 69 registered couriers, 40 transaction-log records, and 69 feedback records.

## Remaining gates

The release is not yet a final Level 5 submission. It still requires private user/activity reconciliation, final privacy decision, a new accessible external demo destination if required by reviewers, a reviewer-accessible PPTX/Slides upload, and final README-link verification. The repository walkthrough artifact is already present, and the hosted CI run is green. Analytics is implemented in source but a provider dashboard screenshot is not independently verified. Do not claim complete Level 5 compliance until these gates pass.

## Commit

The product iteration is in [`cdc89e0`](https://github.com/SujAnverse1125/NoodleNova/commit/cdc89e0).
