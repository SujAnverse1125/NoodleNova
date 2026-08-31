# Changelog

This file records the user-facing and submission-critical code changes made to Noodle Nova. It intentionally excludes credentials, wallet secrets, and local-only diagnostics.

## Unreleased

### Green Belt remediation

- Added `components/EscrowPanel.tsx`, a wallet-driven UI for creating, reading, and completing delivery escrows.
- Added `lib/stellar/escrow.ts`, which constructs Soroban calls, prepares them through Stellar RPC, signs with Freighter, and submits them to Stellar Testnet.
- Replaced the placeholder escrow presentation in the Sponsor Routes page with the real `C...` contract configuration and contract-function controls.
- Added `app/api/escrow/route.ts` for server-side escrow status and managed contract actions.
- Expanded GitHub Actions to validate Rust formatting, Clippy, contract tests, and a deployable Soroban WASM.
- Added deterministic Testnet contract and Vercel deployment jobs. Both now fail fast when their required GitHub Actions secrets are unavailable or a deployment fails.
- Added `scripts/deploy-testnet-contract.sh` and `vercel.json` for reproducible manual deployment configuration.

### Verification

- Frontend unit tests: 3 passing.
- Contract tests: 3 passing.
- TypeScript and Next.js production build: passing.
- Soroban contract WASM build: passing.
