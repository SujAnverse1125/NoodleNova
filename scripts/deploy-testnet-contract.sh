#!/usr/bin/env bash
set -euo pipefail

: "${STELLAR_DEPLOYER_SECRET:?Set STELLAR_DEPLOYER_SECRET to a Testnet-only deployer secret.}"

cd "$(dirname "$0")/../contracts/delivery_escrow"
stellar contract build

stellar contract deploy \
  --wasm target/wasm32v1-none/release/delivery_escrow.wasm \
  --source-account "$STELLAR_DEPLOYER_SECRET" \
  --network testnet
