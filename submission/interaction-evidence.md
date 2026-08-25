# Noodle Nova — Wallet Interaction Evidence Register

## Purpose

This register prevents the Green Belt submission from claiming more wallet activity than the available public evidence supports. It is based on the current owner-provided [Noodle Nova Feedback Form response sheet](https://docs.google.com/spreadsheets/d/1i4tkHd1MR0qPSeLngOxr9hNsqelM31TxBhXPZilFecI/edit?usp=sharing) and the read-only inspection of the authorized admin panel.

## Visual evidence

The supplied Excel/Sheets-style user-response image is included here: [`user-feedback-sheet-updated.png`](user-feedback-sheet-updated.png). It shows the `Form_Responses` header and the timestamp, name, email, wallet address, transaction-hash, rating, and feedback columns. The current sheet contains 80 response rows. The supplied admin-panel image is included here: [`admin-panel-user-onboarding.png`](admin-panel-user-onboarding.png). It shows the registered-courier list and transaction log used as operational onboarding evidence. Because both images contain personal fields or transaction identifiers, they should be treated as sensitive evidence and used only in the authorized submission context.

## Current evidence status

| Evidence source | What was observed | Submission status |
| --- | --- | --- |
| Shared feedback sheet | 80 response rows, 80 populated wallet-address fields, and 42 non-placeholder transaction-hash values | Supports onboarding/feedback count and identifies transaction candidates; does not independently verify 10 successful transactions |
| Authorized admin panel | The supplied screenshots show 69 registered couriers, 40 transaction-log entries, and 69 user-feedback records | Supports the existence of recorded transaction and feedback entries; full hashes and network confirmation remain required |
| Public Stellar explorer records in the repository README | Deployment, create-delivery, and complete-delivery proof transactions are documented | Supports the project’s contract demonstration; these are not automatically 10 distinct user interactions |

## Verification register

| Record | Wallet address | Transaction hash | Network | Explorer URL | Status |
| --- | --- | --- | --- | --- | --- |
| Admin-panel transaction records | Redacted | Full value not included in public docs | To be confirmed | To be added after private reconciliation | **Pending verification** |
| Feedback-sheet rows with placeholder or missing transaction values | Redacted | `none` / `NADA` / `nil` / `na` / `-` / blank | Not applicable | Not applicable | **Not a verified interaction** |
| Noodle Nova contract deployment proof | Not a user interaction | `c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6` | Stellar Testnet | [Stellar Expert](https://stellar.expert/explorer/testnet/tx/c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6) | **Project proof** |
| Noodle Nova create-delivery proof | Not a user interaction | `ed214acb9282d0ed596e5ed55f710170a68d83fcd657fd52e81f370e23083470` | Stellar Testnet | [Stellar Expert](https://stellar.expert/explorer/testnet/tx/ed214acb9282d0ed596e5ed55f710170a68d83fcd657fd52e81f370e23083470) | **Project proof** |
| Noodle Nova complete-delivery proof | Not a user interaction | `93e6df19413a77b2fa0b1041bb7edbb194e3e22cb244911989a078a3236f9ee5` | Stellar Testnet | [Stellar Expert](https://stellar.expert/explorer/testnet/tx/93e6df19413a77b2fa0b1041bb7edbb194e3e22cb244911989a078a3236f9ee5) | **Project proof** |

## Reviewer action required

Before submitting a claim of **10+ wallet interactions**, reconcile the full admin-panel records with the feedback-sheet responses privately. For each candidate record, confirm the full public wallet address, the full Stellar transaction hash, the network, the transaction outcome, and the relationship to the corresponding user/session. Add only shortened addresses and public explorer links to any public evidence. If fewer than ten distinct successful interactions can be verified, keep the Green Belt checklist status as pending rather than presenting the requirement as complete.

## Privacy and security

Do not commit the admin token, private keys, API credentials, full email addresses, or unredacted admin screenshots. The supplied admin URL must not appear in a public README or submission file with its token attached.

## References

[1]: https://github.com/SujAnverse1125/NoodleNova "NoodleNova public repository"
[2]: https://stellar.expert/explorer/testnet "Stellar Expert Testnet explorer"
