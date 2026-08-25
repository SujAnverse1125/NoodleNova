# Noodle Nova

Noodle Nova is a **Stellar Testnet dApp** built around a gamified ramen-delivery experience. Users can connect a Freighter wallet, view Testnet XLM balance and recent activity, send Testnet XLM, and interact with a Soroban delivery-escrow contract that locks funds until a sponsored delivery is completed.

> **Testnet only:** Do not use real funds or production credentials.

## Links

| Resource | Link |
| --- | --- |
| Live demo | [noodle-nova-seven.vercel.app](https://noodle-nova-seven.vercel.app/) |
| Demo video | [Owner-provided Google Drive link](https://drive.google.com/file/d/1N6QC__iKYQbef9ZXsaxMIjnC2TDsDUWn/view?usp=drive_link) — currently unavailable in the read-only access check; replace before submission |
| Public repository | [SujAnverse1125/NoodleNova](https://github.com/SujAnverse1125/NoodleNova) |
| Reference presentation pattern | [AmitabhDey-byte/Cosmic-Capture](https://github.com/AmitabhDey-byte/Cosmic-Capture) |

## Product Evidence

The following assets are already present in this repository and document the existing product and development state. They are referenced here without changing the application or deployment.

### Product UI

![Noodle Nova product UI](public/product-ui.png)

### User feedback system

![Noodle Nova feedback UI](public/feedback-ui.png)

### Mobile responsive UI

<img width="1080" height="2408" alt="Noodle Nova mobile responsive UI" src="https://github.com/user-attachments/assets/cf6d1288-5394-4c36-81ca-114c1205f94b" />

### CI/CD pipeline

![CI/CD pipeline](public/cicd-pipeline.png)

### Test output

![Test output](public/test-output.png)

## Core Features

Noodle Nova currently documents the following product capabilities:

- Freighter wallet connection.
- Stellar Testnet XLM balance and recent transaction feed.
- XLM payment form with validation, loading states, and error states.
- Responsive Next.js interface.
- Soroban `DeliveryEscrow` contract with create, complete, and read operations.
- Token-contract transfers and `DeliveryCreated` / `DeliveryCompleted` events.
- Rust unit tests covering the delivery flow and invalid repeat operations.

## User Journey

A user opens the deployed application, connects a Freighter wallet, reviews the available Testnet XLM information, and uses the ramen-delivery flow to create or complete a sponsored delivery. The application displays transaction progress through its existing interface. Users can also access the feedback experience to submit a rating and written review.

This README describes the current deployed product as documented by the repository. It does not claim that new application features, new smart-contract deployments, analytics configuration, or monitoring configuration were added during the documentation update.

## Architecture

| Layer | Current implementation documented by the repository |
| --- | --- |
| Frontend | Next.js 14, React, TypeScript, and Tailwind CSS |
| Wallet and payments | `@stellar/freighter-api` and `@stellar/stellar-sdk` |
| Smart contract | Rust with Soroban SDK `27.0.6` |
| Contract domain | Delivery escrow with create, complete, and read operations |
| CI | Existing GitHub Actions workflow for frontend build and contract tests |
| Deployment | Existing Vercel deployment linked above |

The contract uses Stellar's native asset contract through `token::Client` to transfer funds from the sponsor to escrow and from escrow to the courier after completion.

## Stellar Testnet Contract and Proof

The following values are documented by the existing repository. Stellar Testnet state can reset, so reviewers should open the public links during review rather than relying only on static README text.

| Item | Value |
| --- | --- |
| Network | Stellar Testnet |
| DeliveryEscrow contract | [`CC42H6ONIV2527FPJZFTWV7UZNMWCEZDKZZNCNVF3ZN4ZWTXPIUKSBCM`](https://lab.stellar.org/r/testnet/contract/CC42H6ONIV2527FPJZFTWV7UZNMWCEZDKZZNCNVF3ZN4ZWTXPIUKSBCM) |
| Native XLM asset contract | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| Contract WASM hash | `ee3892dbe6df123ee75180a44674bf55040c422372f8684ea90f107d6548c1cb` |
| Deployment transaction | [`c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6`](https://stellar.expert/explorer/testnet/tx/c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6) |
| Create-delivery transaction | [`ed214acb9282d0ed596e5ed55f710170a68d83fcd657fd52e81f370e23083470`](https://stellar.expert/explorer/testnet/tx/ed214acb9282d0ed596e5ed55f710170a68d83fcd657fd52e81f370e23083470) |
| Complete-delivery transaction | [`93e6df19413a77b2fa0b1041bb7edbb194e3e22cb244911989a078a3236f9ee5`](https://stellar.expert/explorer/testnet/tx/93e6df19413a77b2fa0b1041bb7edbb194e3e22cb244911989a078a3236f9ee5) |

The repository describes the documented Testnet flow as creating delivery `1`, locking 1 XLM in escrow, emitting `DeliveryCreated`, completing the delivery, releasing 1 XLM to the courier, and emitting `DeliveryCompleted`.

### Contract interface

```text
create_delivery(delivery_id, sponsor, courier, token, amount)
complete_delivery(delivery_id)
get_delivery(delivery_id)
```

`create_delivery` requires sponsor authorization and transfers the requested token amount into the contract. `complete_delivery` requires the stored sponsor's authorization and releases the escrowed funds to the courier.

## Local Setup

### Prerequisites

Use Node.js 20 or newer, Rust, and the Stellar CLI.

```bash
git clone https://github.com/SujAnverse1125/NoodleNova.git
cd NoodleNova
npm install
npm run dev
```

Open `http://localhost:3000`.

To override the default Horizon endpoint, create `.env.local` with a non-secret public Testnet endpoint:

```env
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

Do not commit private keys, admin tokens, API keys, or other deployment secrets.

## Test and Build

```bash
# Frontend production build
npm run build

# Frontend tests
npm test
```

The existing README records **3 passed, 0 failed** for the documented frontend test run. This result is preserved as repository evidence and has not been regenerated or altered as part of the documentation-only update.

## Green Belt Submission Evidence

The table below is intentionally evidence-based. `Verified` means the item is directly supported by a public repository or public link. `Evidence available` means the repository or owner-provided material contains supporting evidence, but the claim may still require reviewer-side confirmation. `Pending verification` means the available material is not sufficient for a cryptographic or operational claim. Missing evidence is not represented as completed.

| Green Belt requirement | Status | Current evidence and submission note |
| --- | --- | --- |
| Public GitHub repository | **Verified** | This public repository is the submission source: [NoodleNova](https://github.com/SujAnverse1125/NoodleNova). |
| Production deployment | **Evidence available** | The live application is linked at [noodle-nova-seven.vercel.app](https://noodle-nova-seven.vercel.app/). |
| Stellar Testnet smart contract | **Evidence available** | Contract identifier and public Testnet proof links are listed above. |
| Production MVP functionality | **Evidence available** | Existing live demo, feature description, product screenshot, contract proof, and test output are linked in this README. |
| Mobile responsive UI | **Evidence available** | The existing mobile screenshot is linked above. |
| Loading and error handling | **Evidence available** | The existing feature list documents validation, loading, and error states; no new behavior is claimed here. |
| Minimum 10 real users onboarded | **Evidence available** | The shared feedback sheet shows 12 visible response rows dated 24–25 August 2026. The supporting sanitized summary is in [`submission/feedback-summary.md`](submission/feedback-summary.md). |
| Proof of 10+ wallet interactions | **Pending verification** | The authorized admin-panel review exposed nine shortened transaction-link entries in the inspected view, while the shared sheet contains several null-like transaction values and truncated fields. Full hashes and independent Stellar verification are required before claiming 10 completed wallet interactions. See [`submission/interaction-evidence.md`](submission/interaction-evidence.md). |
| Basic user feedback collection | **Evidence available** | The feedback UI and shared response summary document ratings and written comments. |
| Analytics integration | **Not verified** | No public analytics dashboard or configuration evidence was available in the read-only audit. |
| Monitoring/error tracking | **Not verified** | No public monitoring dashboard or configuration evidence was available in the read-only audit. |
| Minimum 15 meaningful commits | **Verified** | GitHub reports 62 public commits at the time of the audit. |
| Live demo video | **Pending replacement** | The existing owner-provided Google Drive URL currently returns a file-not-found page in the read-only access check. Replace it with an active public link before submission. |
| Complete documentation | **In progress / documented here** | This README and the `submission/` evidence notes organize the currently available proof without changing product code. |

## Feedback Summary

The shared onboarding and feedback sheet contains 12 visible responses. The recorded ratings are `5, 4, 5, 5, 4, 5, 5, 5, 5, 2, 4, 4`, producing an average of approximately **4.42/5**. The comments are predominantly positive about the interface and game experience, with one clear recurring improvement signal: gameplay could be refined further.

The feedback evidence is summarized in [`submission/feedback-summary.md`](submission/feedback-summary.md). Names, email addresses, full wallet addresses, and raw personal data are intentionally not reproduced in this public README.

## Admin and Privacy Note

The authorized admin panel was reviewed as a private operational evidence source. Its access token is intentionally not linked, copied, or published here. The public submission package uses only sanitized counts and verification status. Any final reviewer package that needs full wallet addresses or transaction hashes should be shared through the appropriate private submission channel, not committed to a public repository unless those records have been explicitly consented for publication.

## Testnet Note

Stellar Testnet resets periodically. A reset can remove Testnet accounts, transaction history, and contract data; redeploy and generate new proof transactions if a reset occurs before review.

## References

[1]: https://github.com/SujAnverse1125/NoodleNova "NoodleNova public repository"
[2]: https://github.com/AmitabhDey-byte/Cosmic-Capture "Cosmic-Capture reference repository"
[3]: https://noodle-nova-seven.vercel.app/ "Noodle Nova live deployment"
[4]: https://lab.stellar.org/r/testnet/contract/CC42H6ONIV2527FPJZFTWV7UZNMWCEZDKZZNCNVF3ZN4ZWTXPIUKSBCM "Noodle Nova DeliveryEscrow contract on Stellar Lab Testnet"
[5]: https://stellar.expert/explorer/testnet/tx/c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6 "Noodle Nova deployment transaction on Stellar Expert Testnet"
[6]: https://drive.google.com/file/d/1N6QC__iKYQbef9ZXsaxMIjnC2TDsDUWn/view?usp=drive_link "Noodle Nova demo video"
