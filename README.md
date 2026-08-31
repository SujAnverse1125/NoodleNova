# Noodle Nova
 
**Live Demo:** [https://noodle-nova-seven.vercel.app/](https://noodle-nova-seven.vercel.app/)
**Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1N6QC__iKYQbef9ZXsaxMIjnC2TDsDUwN/view?usp=drive_link)

Noodle Nova is a Stellar Testnet dApp that presents a gamified ramen-delivery experience. Users can connect a Freighter wallet, view their XLM balance and recent activity, and send Testnet XLM. The project also includes a Soroban delivery-escrow contract that locks XLM until a sponsored delivery is completed.

> Testnet only. Do not use real funds.

Product UI
![Product UI](/public/product-ui.png)

User Feedback System
![Feedback UI](/public/feedback-ui.png)

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
- Soroban escrow panel wired to `create_delivery`, `get_delivery`, and `complete_delivery`
- Token-contract transfers and `DeliveryCreated` / `DeliveryCompleted` events
- Three Rust unit tests for the delivery flow and invalid repeat operations

## Deployed contract and proof

| Item | Value |
| --- | --- |
| Network | Stellar Testnet |
| DeliveryEscrow contract | [`CBEXVMRWS6DG7QRMRS5WBBHYME5UUY4L3ZZ6IUTTERQHBGHBY7B5MDXE`](https://lab.stellar.org/r/testnet/contract/CBEXVMRWS6DG7QRMRS5WBBHYME5UUY4L3ZZ6IUTTERQHBGHBY7B5MDXE) |
| Native XLM asset contract | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| Contract WASM hash | `ee3892dbe6df123ee75180a44674bf55040c422372f8684ea90f107d6548c1cb` |
| Deployment transaction | [`42679eee67139ebbbc386a2b2b5db4c88dec4019093a703bd7b55c849514b326`](https://stellar.expert/explorer/testnet/tx/42679eee67139ebbbc386a2b2b5db4c88dec4019093a703bd7b55c849514b326) |
| Create-delivery transaction | [`8ce1826b7c730870ca6423039f34c5b18d709e33caee18c1cb7bfccb31b0e87b`](https://stellar.expert/explorer/testnet/tx/8ce1826b7c730870ca6423039f34c5b18d709e33caee18c1cb7bfccb31b0e87b) |
| Complete-delivery transaction | [`4b8746ebc5eae823aa1e9ff679415f2a059dda7412f40f5a135a3b8aaab7cfd9`](https://stellar.expert/explorer/testnet/tx/4b8746ebc5eae823aa1e9ff679415f2a059dda7412f40f5a135a3b8aaab7cfd9) |

The verified current Testnet flow created delivery `2`, locked 1 XLM in escrow, emitted `DeliveryCreated`, then completed the delivery, released the 1 XLM to the courier, and emitted `DeliveryCompleted`.

## Architecture

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Wallet and payments:** `@stellar/freighter-api` and `@stellar/stellar-sdk`
- **Smart contract:** Rust with Soroban SDK `27.0.6`
- **CI configuration:** GitHub Actions validates frontend tests/build plus Rust formatting, linting, tests, and deployable Soroban WASM
- **Frontend deployment:** `vercel.json` provides the Vercel install and build configuration

The contract uses Stellar's native asset contract through `token::Client` to transfer funds from the sponsor to escrow, then from escrow to the courier after completion. The Sponsor Routes page prepares each contract call with Soroban RPC, requests a Freighter signature, and submits it to Testnet.

## Run locally

Prerequisites: Node.js 20+, Rust, and the Stellar CLI.

```bash
git clone https://github.com/SujAnverse1125/NoodleNova.git
cd NoodleNova
npm install
npm run dev
```

Open `http://localhost:3000`.

Copy `.env.local.example` to `.env.local`. The current Testnet contract ID is included as a safe public default, but it can be overridden after a future deployment:

```env
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_DELIVERY_ESCROW_CONTRACT_ID=CBEXVMRWS6DG7QRMRS5WBBHYME5UUY4L3ZZ6IUTTERQHBGHBY7B5MDXE
```

## Test and build

```bash
# Frontend production build
npm run build

# Frontend tests
npm test

# Contract checks
cd contracts/delivery_escrow
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings -A deprecated
cargo test
stellar contract build
```

Current contract test result: **3 passed, 0 failed**.

## Deploy the contract

The deployment script builds the WASM and deploys it to Testnet. Provide a Testnet-only deployer secret through the environment; never commit it.

```bash
STELLAR_DEPLOYER_SECRET=your_testnet_secret ./scripts/deploy-testnet-contract.sh
```

Update `NEXT_PUBLIC_DELIVERY_ESCROW_CONTRACT_ID` in your Vercel project and local environment with the returned `C...` address after deployment.

## Contract interface

```text
create_delivery(delivery_id, sponsor, courier, token, amount)
complete_delivery(delivery_id)
get_delivery(delivery_id)
```

`create_delivery` requires sponsor authorization and transfers the requested token amount into the contract. `complete_delivery` requires the stored sponsor's authorization and releases the escrowed funds to the courier.

## Testnet note

Stellar Testnet resets periodically. A reset can remove Testnet accounts, transaction history, and contract data; redeploy and generate new proof transactions if a reset occurs before review.
