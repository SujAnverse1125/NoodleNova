# Noodle Nova — Level 5 Pitch Deck

## Slide 1 — Noodle Nova
**Fund noodles. Collect stardust.**

An anime-styled Stellar Testnet courier dApp that turns wallet interactions into a playful, verifiable delivery loop.

**Live product:** https://noodle-nova-seven.vercel.app/

**Built on:** Stellar Testnet · Freighter · Soroban DeliveryEscrow · Next.js · Prisma/PostgreSQL

Visual direction: use `public/hero-art.png` and the Noodle Nova logo. Keep the slide dark, neon, and concise.

## Slide 2 — The problem

Blockchain onboarding still asks first-time users to understand wallets, networks, signing, fees, and transaction receipts before they experience value.

Builders also need a lightweight way to demonstrate real on-chain participation without turning a technical demo into a wallet tutorial.

**The gap:** Web3 infrastructure is powerful, but the first-run experience is often opaque, disconnected from a human story, and difficult to verify.

## Slide 3 — The solution

Noodle Nova wraps a real Stellar Testnet flow in a simple courier story:

1. Connect a Freighter wallet and create a courier profile.
2. Choose a ramen delivery route.
3. Trigger an application-backed Testnet reward/transaction flow.
4. See pending, confirmed, or retry states.
5. Open the public Stellar Expert receipt and leave feedback.

**Positioning:** a playful, non-custodial learning and validation layer for Stellar builders, communities, and onboarding campaigns.

## Slide 4 — Product experience

**From first visit to receipt:**

- Landing page: explicit Testnet, non-custodial, and no-real-XLM messaging.
- How it works: connect wallet → choose route → verify receipt.
- Dashboard: first-flight checklist and courier progress.
- Routes: four themed missions with Testnet costs/rewards.
- Feedback: rating and comment capture after the experience.

Visuals: use a landing-page screenshot and a local/deployed route-page screenshot. Do not show an admin token or private data.

## Slide 5 — Architecture

**Client:** Next.js 14, React, TypeScript, Tailwind CSS, Freighter wallet context.

**Application:** Next.js route handlers for users, rewards, transactions, feedback, and stats.

**Data:** Prisma client backed by PostgreSQL for courier profiles, transaction records, and feedback.

**Blockchain:** Stellar Horizon for Testnet payments/activity and Soroban `DeliveryEscrow` contract for delivery escrow demonstrations.

**Operations:** Vercel deployment, GitHub Actions tests/build, Vercel Analytics event instrumentation.

Visual: use `submission/noodlenova-architecture.png`.

## Slide 6 — Real Stellar proof

**Contract:** `CC42H6ONIV2527FPJZFTWV7UZNMWCEZDKZZNCNVF3ZN4ZWTXPIUKSBCM`

**Proof principle:** every public receipt must be opened on Stellar Testnet immediately before submission because Testnet can reset.

The app exposes direct Stellar Expert links for successful route receipts. The public evidence register lists 42 unique candidate hashes that currently resolve successfully through Horizon.

Caveat: transaction-hash existence proves an on-chain record; it does not by itself prove that a specific form respondent created that transaction.

Visual: use one redacted transaction/admin screenshot and one public explorer link, never the admin access token.

## Slide 7 — Early traction and evidence discipline

**Owner-confirmed response sheet:** 80 rows and 76 unique wallet values after four repeated-wallet rows are deduplicated.

**Admin application records:** 69 registered couriers, 40 transaction-log entries, and 69 feedback records at audit time.

**Testnet verification:** 42 unique non-placeholder hashes returned successful Horizon records.

**Evidence boundary:** same-row wallet-to-transaction-source matching was 0/42; 40/76 sheet wallets appeared as a source account somewhere in the candidate set. Therefore, the public claim remains “candidate onboarding and verified Testnet receipts,” not “50 users each completed a verified transaction,” until private reconciliation is complete.

Visual: use the public-safe activity register and admin evidence images. Keep this slide honest and reviewer-friendly.

## Slide 8 — Feedback became product work

**80 responses · 4.34/5 average rating**

The strongest signals were positive UI/gameplay feedback, requests for gameplay refinement, beginner/onboarding friction, performance/synchronization concerns, and wallet/provider clarity.

**Iteration shipped in `cdc89e0`:**

- four-step first-flight checklist;
- landing-page How it works guide;
- pending/confirmed/error/retry transaction UX with receipt links;
- registration failure handling and blank-comment validation;
- privacy-safe lifecycle events through existing Vercel Analytics;
- deterministic unit-test scope for hosted CI.

Visual: use `submission/feedback-to-improvements.md` as the evidence link.

## Slide 9 — Market opportunity

Stellar’s official Q1 2026 update reports **22.5B total operations, 10.6M unique addresses, $5.5B in Q1 stablecoin payment volume, and 86% year-over-year developer growth**. Source: https://stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale

The adjacent market is not only “games.” It includes:

- Stellar ecosystem onboarding and builder education;
- community quests and hackathon activations;
- wallet and payment UX experimentation;
- playful demonstrations of verifiable participation;
- consumer-facing loyalty and rewards loops.

A third-party IMARC estimate places the global blockchain-gaming market at **USD 24.0B in 2025**, but this is a commercial forecast and should be treated as directional context, not Noodle Nova traction. Source: https://www.imarcgroup.com/blockchain-gaming-market

## Slide 10 — Growth strategy

**Acquire:** Stellar hackathons, developer communities, campus blockchain clubs, and gaming/Web3 communities.

**Activate:** a two-minute guided first route with Testnet wallet instructions and a receipt link.

**Retain:** weekly route rotations, stamps, quests, feedback prompts, and visible progress.

**Measure:** landing views, wallet-connect starts/completions, onboarding completions, route submissions/successes/failures, feedback submissions, repeat users, and cohort activity. Analytics properties remain non-identifying.

**Trust:** public Explorer receipts, clear Testnet-only warnings, no custodial private-key handling, and privacy-safe public evidence.

## Slide 11 — Roadmap

**Now:** stabilize the first-run flow, prove the evidence chain, and publish the Level 5 deck/demo/docs.

**Next 30 days:** reconcile user-to-transaction attribution, add a reviewer-safe activity dashboard, improve mobile route status, and run a fresh feedback cycle.

**Next 60–90 days:** expand route/gameplay progression, add sustainable reward/quest design, improve wallet compatibility guidance, and evaluate a privacy-safe monitoring provider.

**Longer term:** move from Testnet validation to a controlled production pilot only after security review, economics review, consent review, and operational monitoring are complete.

## Slide 12 — Demo and next step

**The ask:** support the next iteration of a friendly, evidence-first Stellar onboarding experience.

**Demo path:** landing page → Freighter/Testnet connection → courier profile → route selection → pending/confirmed receipt → feedback → public evidence review.

**Live app:** https://noodle-nova-seven.vercel.app/

**Repository:** https://github.com/SujAnverse1125/NoodleNova

**Evidence package:** `submission/level5-checklist.md` · `submission/level5-user-activity.md` · `submission/feedback-to-improvements.md`

**Next gate:** publish a new accessible walkthrough video and complete the private user/activity reconciliation before claiming full Level 5 compliance.
