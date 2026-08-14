# Noodle Nova
 
**Live Demo:** [https://noodle-nova-seven.vercel.app/](https://noodle-nova-seven.vercel.app/)

Noodle Nova is a Stellar Testnet dApp that presents a gamified ramen-delivery experience. Users can connect a Freighter wallet, view their XLM balance and recent activity, and send Testnet XLM. The project also includes a Soroban delivery-escrow contract that locks XLM until a sponsored delivery is completed.

> Testnet only. Do not use real funds.

Mobile responsive UI 
<img width="1080" height="2408" alt="Screenshot_20260814_192952" src="https://github.com/user-attachments/assets/cf6d1288-5394-4c36-81ca-114c1205f94b" />

CI/CD pipeline running
![CI/CD Pipeline](/public/cicd-pipeline.png)

Test output with 3+ passing tests
![Test Output](/public/test-output.png)


## Features

- Freighter wallet connection
- Testnet XLM balance and recent transaction feed
- XLM payment form with validation, loading, and error states
- Responsive Next.js interface
- Soroban `DeliveryEscrow` contract with create, complete, and read operations
- Token-contract transfers and `DeliveryCreated` / `DeliveryCompleted` events
- Three Rust unit tests for the delivery flow and invalid repeat operations

## Deployed contract and proof

| Item | Value |
| --- | --- |
| Network | Stellar Testnet |
| DeliveryEscrow contract | [`CC42H6ONIV2527FPJZFTWV7UZNMWCEZDKZZNCNVF3ZN4ZWTXPIUKSBCM`](https://lab.stellar.org/r/testnet/contract/CC42H6ONIV2527FPJZFTWV7UZNMWCEZDKZZNCNVF3ZN4ZWTXPIUKSBCM) |
| Native XLM asset contract | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| Contract WASM hash | `ee3892dbe6df123ee75180a44674bf55040c422372f8684ea90f107d6548c1cb` |
| Deployment transaction | [`c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6`](https://stellar.expert/explorer/testnet/tx/c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6) |
| Create-delivery transaction | [`ed214acb9282d0ed596e5ed55f710170a68d83fcd657fd52e81f370e23083470`](https://stellar.expert/explorer/testnet/tx/ed214acb9282d0ed596e5ed55f710170a68d83fcd657fd52e81f370e23083470) |
| Complete-delivery transaction | [`93e6df19413a77b2fa0b1041bb7edbb194e3e22cb244911989a078a3236f9ee5`](https://stellar.expert/explorer/testnet/tx/93e6df19413a77b2fa0b1041bb7edbb194e3e22cb244911989a078a3236f9ee5) |

The verified Testnet flow created delivery `1`, locked 1 XLM in escrow, emitted `DeliveryCreated`, then completed the delivery, released the 1 XLM to the courier, and emitted `DeliveryCompleted`.

## Architecture

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Wallet and payments:** `@stellar/freighter-api` and `@stellar/stellar-sdk`
- **Smart contract:** Rust with Soroban SDK `27.0.6`
- **CI configuration:** GitHub Actions workflow for frontend build and contract tests

The contract uses Stellar's native asset contract through `token::Client` to transfer funds from the sponsor to escrow, then from escrow to the courier after completion.

## Run locally

Prerequisites: Node.js 20+, Rust, and the Stellar CLI.

```bash
git clone https://github.com/SujAnverse1125/NoodleNova.git
cd NoodleNova
npm install
npm run dev
```

Open `http://localhost:3000`.

Create `.env.local` if you need to override the default Horizon endpoint:

```env
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

## Test and build

```bash
# Frontend production build
npm run build

# Frontend tests
npm test
```

Current test result: **3 passed, 0 failed**.

## Contract interface

```text
create_delivery(delivery_id, sponsor, courier, token, amount)
complete_delivery(delivery_id)
get_delivery(delivery_id)
```

`create_delivery` requires sponsor authorization and transfers the requested token amount into the contract. `complete_delivery` requires the stored sponsor's authorization and releases the escrowed funds to the courier.

## Testnet note

Stellar Testnet resets periodically. A reset can remove Testnet accounts, transaction history, and contract data; redeploy and generate new proof transactions if a reset occurs before review.
