# Hackathon Submission — Astera Finance

Regulated tokenization infrastructure for LATAM on Avalanche C-Chain.

---

## Links

| Resource | Link |
|----------|------|
| Landing | https://comunyt.co/ |
| Live Demo | https://astera-frontend.vercel.app/ |
| Interactive Pitch Deck | [./pitch_slides.html](./pitch_slides.html) |
| Pitch Deck PDF | [./Astera_Pitch_Deck.pdf](./Astera_Pitch_Deck.pdf) |
| Prototype / early contracts proof-of-concept video | https://youtu.be/AKxAs7N9Rr8 |
| Final pitch/demo video | https://youtu.be/BzrINv-UP9g |
| Smart contracts docs | [./contracts/docs/](./contracts/docs/) |
| Address book / deployments | [./contracts/docs/ADDRESS_BOOK.md](./contracts/docs/ADDRESS_BOOK.md) |
| Network | Avalanche C-Chain mainnet (`chainId: 43114`) |

> The prototype video is an **early proof of concept** of the contracts and platform flow. It is not the final demo video.

---

## What Astera Demonstrates

Astera is B2B regulated tokenization infrastructure. This submission demonstrates:

- **Identity-aware tokenization** — every on-chain operation gated by a verified wallet identity stored in `AsteraIdentityRegistry`
- **KYC-gated participation** — investors must pass KYC and be registered on-chain before participating in any project
- **Compliance-enforced transfers** — direct ERC20 transfers permanently disabled; all movements require authorized exchange settlement validated by `AsteraComplianceManager`
- **EIP-712 document acceptance** — cryptographic, on-chain proof of legal document acceptance with document hash and holographic signature hash stored immutably
- **Non-custodial USDC settlement** — USDC settles directly into the project treasury wallet; Astera never custodies user funds
- **Permissioned primary issuance** — compliant purchase flow with annual investment limit accounting enforced on-chain
- **Permissioned secondary market** — order book restricted to KYC-verified, compliant, non-frozen wallets with partial fill support
- **On-chain auditability** — immutable event log for every operation: KYC, purchases, transfers, freezes, compliance changes

---

## Business Model

Astera sells infrastructure to regulated operators, not financial products to end users.

| Revenue Stream | Description |
|----------------|-------------|
| **White-label setup** | Custom platform deployment adapted to the client's brand, frontend, and operational workflow |
| **Monthly SaaS** | KYC, document management, event indexing, admin dashboard, and compliance reporting by subscription |
| **Operational fees** | Percentage on primary issuance and secondary market operations processed on the platform |
| **Dedicated deployments** | Isolated environments for PSAVs, fintechs, and regulated issuers with specific compliance requirements |

Target customers: PSAVs (Proveedores de Servicios de Activos Virtuales), regulated issuers, fintechs, and enterprise platforms in LATAM.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart contracts | Solidity + Foundry (source of truth: `/contracts`) |
| Network | Avalanche C-Chain mainnet |
| Settlement currency | USDC (`0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E`) |
| Frontend | Next.js (Scaffold-ETH 2 tooling + Shadcn UI) |
| Off-chain data | Supabase |
| Risk intelligence | Wavy Node (prototype integration for on-chain traceability signals) |

---

## Deployed Contracts

See [`./contracts/docs/ADDRESS_BOOK.md`](./contracts/docs/ADDRESS_BOOK.md) for all deployed addresses.

Platform contracts deployed and verified on Avalanche C-Chain mainnet (deploy block: 2026-05-16):

| Contract | Address |
|----------|---------|
| `AsteraIdentityRegistry` | `0x0B66baEF242C8aB2bFe387DC9a5412c7f903Eca1` |
| `AsteraPrimaryExchange` | `0x89B2b2FE6fC68a865A258c2C99adaCF5aF4c5A35` |
| `AsteraSecondaryExchange` | `0x2F5A5198635DfE5a06Cc09597f66ec7522Be29fc` |

---

## Hackathon Submission Commit

`c2987d3332ec09c4747f33a0a45b99d3fd629ae3`
