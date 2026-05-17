# Astera Finance — Reference Implementation

This application is a **reference implementation** showing how a regulated tokenized asset marketplace can be built on the Astera infrastructure.

It is not the product. The product is the infrastructure. This demo is proof of how it works in practice.

---

## What This App Demonstrates

| Flow | Description |
|------|-------------|
| Onboarding / KYC status | User wallet identity check and KYC approval display |
| Legal document acceptance | EIP-712 document acceptance flow with on-chain cryptographic proof |
| Primary purchase | USDC approval and compliant primary purchase from the project treasury |
| Portfolio | Holdings display with compliance and freeze status |
| Secondary market | Sell order creation, execution, and cancellation on the permissioned order book |
| Admin / demo flows | KYC registration, project management, and compliance operations (admin panel) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| UI components | Shadcn UI + Tailwind CSS |
| Web3 / wallet tooling | Scaffold-ETH 2 (wallet connection, hooks, chain config) |
| Off-chain data | Supabase (KYC records, document metadata, auth) |
| Network | Avalanche C-Chain mainnet |
| Smart contracts | Astera contracts in `/contracts` (Foundry — source of truth) |

---

## Smart Contract Source of Truth

The deployed smart contracts are in [`/contracts`](../../contracts/) and use Foundry.

The `packages/hardhat/` directory is retained for Scaffold-ETH dev tooling (wallet hooks, ABI generation helpers, dev UX). It is **not** the source of the production contracts deployed on mainnet.

---

## Environment Variables

Copy `packages/nextjs/.env.example` to `packages/nextjs/.env.local` and fill in:

```
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

---

## Running Locally

```bash
cd packages/nextjs
yarn install
yarn dev
```

The app connects to Avalanche C-Chain mainnet by default. Wallet connection requires MetaMask or WalletConnect-compatible wallet.
