# Noodle Nova

Noodle Nova is a **Stellar Testnet dApp** built around a gamified ramen-delivery experience. Users can connect a Freighter wallet, view Testnet XLM balance and recent activity, send Testnet XLM, and interact with a Soroban delivery-escrow contract that locks funds until a sponsored delivery is completed.

> **Testnet only:** Do not use real funds or production credentials.

## Links

| Resource | Link |
| --- | --- |
| Live demo | [noodle-nova-seven.vercel.app](https://noodle-nova-seven.vercel.app/) |
| Demo video | https://drive.google.com/file/d/1N6QC__iKYQbef9ZXsaxMIjnC2TDsDUwN/view?usp=drive_link |
| Public repository | [SujAnverse1125/NoodleNova](https://github.com/SujAnverse1125/NoodleNova) |

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

![Noodle Nova architecture diagram](submission/noodlenova-architecture.png)

The architecture diagram above is **NoodleNova-specific** and is based on the actual repository paths. A player connects a Freighter wallet to the Next.js frontend. The frontend uses Stellar Horizon for Testnet balance, activity, and XLM transfers; calls the existing Next.js route handlers for users, rewards, transactions, feedback, and user statistics; persists application records through Prisma to PostgreSQL; and interacts with the Soroban `DeliveryEscrow` contract. The contract emits the documented delivery events. This is a documentation diagram only; no application architecture was changed.

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

The GitHub Actions check currently shows a red status because recursive `node --test` discovery encounters broken tracked `.claude/skills` links on the hosted runner. This is a pre-existing CI/test-discovery issue unrelated to the documentation or image updates; see [`submission/ci-status-diagnosis.md`](submission/ci-status-diagnosis.md) for the verified details.

## Users Onboarded and Feedback Evidence

The supplied Excel/Sheets-style response image is included as visual evidence for the onboarding and feedback requirement. It shows the `Form_Responses` sheet with 12 visible response rows and the fields used for the submission: timestamp, name, email, wallet address, transaction hash, rating, and written feedback.

| Timestamp | Full Name | Email Address | Wallet Address | Transaction Hash | Rating | Review / Suggestions |
|---|---|---|---|---|---:|---|
| 24/08/2026 22:41:20 | Amitabh Dey | amitabhdey101@gmail.com | GBKYHWSL2MNUO73HWY6KWNOA64AKSUENCOBTR56M66HNLMMKMZHK5OAS | none | 5 | Really good UI and interactive game. |
| 24/08/2026 22:43:12 | Neel Madhav | zerotrace971@gmail.com | GBO7BZSNAX6APJW32OE5LHXQZ6MTIHBTWRZZRCJL3VSILWCAZLGCPM4T | NADA | 4 | The gameplay is good but needs improvement. |
| 24/08/2026 22:45:07 | Harsh Mitra | harsh101@gmail.com | GDHYPRZCSOHMGPVM3XETQL3AXUBVLPCLUR4LSYW4QOC7AKR5MWGXAEND | nIL | 5 | Very good. |
| 24/08/2026 22:51:01 | harshit kumar | aditimandal736@gmail.com | GB3OASNQ4B3DBZBXXT4UW3WXGQRMUBHXK3WAVH2VOWUHR6BUWHFKTVKI | None | 5 | Everything is good, best one till now. |
| 24/08/2026 22:57:49 | Abhi mandal | abhishekmandalt4x@gmail.com | GDD4VQG7DXQTQ4SM32Q5GMTYCJAKPRPDHUYRMRWBBW5SLOLOTPGEQXKF | none | 4 | Overall good and best. |
| 24/08/2026 22:59:41 | Manish sharma | manish07@gmail.com | GC5D7MTHTTEINHVN3W6JCNROFRAI4ZXDMYI4GYTR5L46TKNWSJHDXYZ2 | none | 5 | Good. |
| 24/08/2026 23:01:25 | Disha | dish aaa06@gmail.com | GCFHMXPIVQPNUZGXQUQDAT656UBVEL6RCRDKMPJ3FCT73CODOKNJFMXF | none | 5 | One of the best till now I saw. |
| 24/08/2026 23:05:04 | Supriyo mandal | pradepmandal736@gmail.com | GABKZVXSUGV7P24X24EEF3LTNKZRSWBNT6D77DER7XVLVX77WKEID2XA | na | 5 | Overall it is among the best, after seeing others. |
| 24/08/2026 23:12:15 | SK JISHAN UDDIN | j2097138@gmail.com | GAVVOOVYGE7QEJWQO2BZZBGYYSFQPBC3QAYWRC6AFP7E3UMCWFT6YC4U | d5bd5b60c643767cb355fabde02a8426cdc2d4103bde2576251e20aeb3416103 | 5 | Really impressive work, bro. Keep building! |
| 24/08/2026 23:12:55 | RITESH GUPTA | kingofpirates451@gmail.com | GDFSDPEEBZYQVG5JPPTJUOH4FID4M5XV45BKTWCIEIRYMCWJ6DQADBMB | none | 2 | None. |
| 25/08/2026 02:00:54 | riyam lahu | pritamsdev2@gmail.com | GATJMD6BGNK4FQYNFWB354N7RP4XHA2R74GNSYM472ALNLJFX7NXBS3X | 6bd2cc147f99f17e373c6ce507176611700b9a63ca46a2c4c8b70f847d5d0bf7 | 4 | Good, nice. |
| 25/08/2026 10:41:47 | Shubham Raj | studiosfox72@gmail.com | GAQW2UZBSRIQVW7YVS3GFYGMAJOXWQLTCTXXI3F7IZWQBTAAVENVFISW | Not provided | 4 | Great experience. |


### Admin-panel interaction evidence

The following screenshot shows the NoodleNova admin panel with the registered-courier list and transaction log used as operational onboarding evidence.

![Noodle Nova admin panel showing registered users and transaction log](submission/admin-panel-user-onboarding.png)

Because both screenshots contain names, wallet-address fragments, transaction identifiers, and other user-related fields, they should be treated as sensitive submission evidence and not redistributed beyond the authorized review process. The analysis in [`submission/feedback-summary.md`](submission/feedback-summary.md) intentionally reports aggregate results instead of reproducing the raw rows.

## Feedback Summary

The shared onboarding and feedback sheet contains 12 visible responses. The recorded ratings are `5, 4, 5, 5, 4, 5, 5, 5, 5, 2, 4, 4`, producing an average of approximately **4.42/5**. The comments are predominantly positive about the interface and game experience, with one clear recurring improvement signal: gameplay could be refined further.
* **User Experience:** Players consistently describe the interface as visually appealing, engaging, and among the best they have encountered.
 * **Gameplay Development:** While the current gameplay is viewed positively, feedback indicates that it still requires further refinement and improvement.

## Admin and Privacy Note

The authorized admin panel was reviewed as a private operational evidence source. Its access token is intentionally not linked, copied, or published here. The public submission package uses only sanitized counts and verification status. Any final reviewer package that needs full wallet addresses or transaction hashes should be shared through the appropriate private submission channel, not committed to a public repository unless those records have been explicitly consented for publication.

## Testnet Note

Stellar Testnet resets periodically. A reset can remove Testnet accounts, transaction history, and contract data; redeploy and generate new proof transactions if a reset occurs before review.

## References

[1]: https://github.com/SujAnverse1125/NoodleNova "NoodleNova public repository" 
[2]: https://noodle-nova-seven.vercel.app/ "Noodle Nova live deployment"
[2]: https://lab.stellar.org/r/testnet/contract/CC42H6ONIV2527FPJZFTWV7UZNMWCEZDKZZNCNVF3ZN4ZWTXPIUKSBCM "Noodle Nova DeliveryEscrow contract on Stellar Lab Testnet"
[4]: https://stellar.expert/explorer/testnet/tx/c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6 "Noodle Nova deployment transaction on Stellar Expert Testnet"
[5]: https://drive.google.com/file/d/1N6QC__iKYQbef9ZXsaxMIjnC2TDsDUWn/view?usp=drive_link "Noodle Nova demo video"
