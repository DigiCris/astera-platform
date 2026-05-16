<p align="center">
  <img src="assets/banner.png" alt="Astera Banner" width="100%" />
</p>

# Astera Finance

### Regulated Tokenization Infrastructure

White-label infrastructure for regulated real-world asset tokenization platforms.

> Launch compliant tokenized asset marketplaces for PSAVs, regulated issuers, and enterprise platforms.

**Astera is not another token marketplace. It is infrastructure for launching regulated tokenized financial platforms.**

---

## Architecture

![Astera Architecture](assets/architecture.png)

Astera separates the regulatory infrastructure layer from the frontend experience, allowing third parties to build compliant financial applications on Astera's rails while the operator retains full control of KYC, compliance, market rules, and audit trails.

---

## Why Astera

- **Compliance-native infrastructure** — compliance rules enforced at the protocol level, not the application layer
- **Permissioned secondary markets** — controlled order book with identity checks, freeze enforcement, and annual investment accounting
- **Identity-aware tokenization** — every operation gated by verified wallet identity and per-project eligibility
- **Non-custodial settlement** — USDC settles directly into the trust/treasury wallet; Astera never custodies user funds
- **Reusable B2B architecture** — deployable for multiple issuers and projects from a single platform instance
- **EIP-712 document evidence** — cryptographic, on-chain audit trail of legal document acceptance
- **On-chain auditability** — immutable event log for every operation: KYC, purchases, transfers, freezes, compliance changes

---

## Enterprise Features

| Feature | Description |
|---------|-------------|
| KYC-aware infrastructure | Global identity registry with per-wallet verification status and annual investment limits |
| Compliance enforcement | Per-project eligibility rules, freeze controls, and transfer validation enforced on-chain |
| Permissioned transfers | Direct ERC20 transfers permanently disabled; all movements require authorized exchange settlement |
| On-chain audit trails | Immutable events for every sensitive operation across identity, compliance, and market layers |
| Role-based access control | Granular roles per contract: identity admin, compliance admin, minter, forced-transfer operator |
| EIP-712 document acceptance | Cryptographic proof of legal document acceptance with document hash and holographic signature hash |
| Secondary market restrictions | Order book restricted to KYC-verified, compliant, non-frozen wallets with partial fill support |
| Non-custodial settlement | Primary and secondary USDC flows go directly to destination wallets; no exchange custody |

---

## Platform Overview

Astera provides reusable infrastructure for regulated tokenized markets under compliant operational frameworks such as PSAVs, trust structures, regulated issuers, and permissioned financial platforms.

The platform separates:
- regulatory enforcement and identity verification,
- compliance and market operations,
- and backend services and document management,

from the frontend experience layer, enabling third parties to build branded compliant financial applications on Astera's infrastructure.

---

## Core Components

### Identity Registry
Maintains verified wallet-to-identity mappings, KYC approval status, and rolling annual investment accounting per wallet.

### Compliance Engine
Enforces per-project transfer restrictions, market eligibility rules, annual limits, full and partial freezes, and permissioned operations.

### Security Tokens
Restricted ERC20 tokens (6 decimals) representing participation rights in tokenized financial instruments. Direct transfers permanently disabled.

### Primary Exchange
Handles compliant issuance and regulated primary purchase flows. USDC goes directly to the project treasury at 1:1 ratio.

### Secondary Exchange
Order-book secondary market operating only after funding completion. Enforces compliance, applies fees, and updates investment accounting atomically.

### Audit & Event Layer
Immutable on-chain event emissions across all contracts for KYC, purchases, orders, compliance changes, and administrative operations.

---

## Backend & Services Layer

Astera is not only smart contracts. The platform includes a backend services layer responsible for:

- **KYC orchestration** — off-chain identity verification integrated with on-chain wallet registration
- **Document management** — PDF generation, IPFS upload, holographic signature capture, and hash calculation
- **Event indexing** — on-chain event ingestion for admin panels, compliance reporting, and audit exports
- **Admin APIs** — KYC registration, project creation, compliance management, and funding lifecycle operations
- **Compliance workflows** — freeze/unfreeze management, forced transfer monitoring, and alert generation
- **Notifications** — webhook delivery for key events: KYC, purchases, funding close, compliance changes
- **Audit logs** — off-chain record of sensitive admin actions paired with on-chain event evidence

Backend API surface (reference):

```
POST   /api/kyc/start
GET    /api/kyc/status/:wallet
POST   /api/admin/users/register
GET    /api/projects
POST   /api/projects
POST   /api/documents/signed
GET    /api/events
GET    /api/admin/audit
```

---

## Non-Custodial Settlement

USDC settles directly into the trust or treasury wallet defined at project creation.

The primary exchange never holds user funds. The secondary exchange holds USDC transiently during a single transaction execution. No exchange custody at rest.

---

## Reference Implementation

The included marketplace application (`frontend/app/`) is a **reference implementation** showing how a regulated tokenized asset market can be built on Astera.

The reference implementation demonstrates:
- user onboarding and KYC status display,
- EIP-712 document acceptance flow,
- primary purchase with USDC approval,
- secondary order creation, execution, and cancellation,
- portfolio and compliance visibility.

**The product is the infrastructure. The demo is a proof of how it works in practice.**

---

## Landing & App

| Surface | Purpose |
|---------|---------|
| `frontend/landing/` | Institutional and commercial presentation for PSAVs, fintechs, and enterprise operators |
| `frontend/app/` | Functional reference implementation showing a regulated tokenized marketplace built on Astera |

---

## Why Avalanche

Astera is designed for high-performance regulated financial infrastructure. Avalanche is selected for institutional-specific reasons:

- **Fast finality** — settlement completes in seconds, enabling responsive onboarding and purchase UX
- **Low operational cost** — predictable transaction fees at scale for KYC, purchase, and compliance operations
- **EVM compatibility** — full compatibility with existing Solidity tooling, auditing standards, and integrations
- **Institutional ecosystem** — hackathon and partner ecosystem oriented toward institutional financial infrastructure
- **Avalanche L1 readiness** — architecture path toward dedicated, permissioned network environments for regulated operators

Avalanche is not chosen for speed and cost alone. It connects directly to Astera's requirements for settlement finality, compliance UX, secondary market throughput, and the institutional ecosystem in LATAM.

---

## Avalanche L1 Ready

Astera is designed to support future deployment on Avalanche L1 environments for regulated institutions, PSAVs, and enterprise tokenization platforms.

Potential L1 use cases:

- **Permissioned validators** — institution-controlled validator sets for regulated transaction processing
- **Compliance-first settlement** — custom network rules enforcing KYC and compliance at the infrastructure layer
- **Institution-specific environments** — dedicated chains for regulated issuers or multi-issuer platforms
- **Regulated secondary markets** — permissioned trading environments with operator-defined eligibility rules

---

## Powered By

| | |
|--|--|
| **Avalanche C-Chain** | Primary deployment network for regulated tokenized markets in LATAM |
| **USDC (Circle)** | Settlement currency (`0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E`) |
| **Wavy Node** | Risk intelligence partner for on-chain traceability and compliance signals |

---

## Future Extensions

- Avalanche L1 deployments for dedicated regulated environments
- Institutional settlement environments with permissioned validator sets
- External AML/risk provider integrations (Wavy Node, Chainalysis)
- Advanced KYC provider integrations (on-chain claim topics, trusted issuers)
- Cross-border regulated market deployments
- Timelock and multisig enforcement for production admin operations
- Automated refund flows for failed funding rounds

---

## Repository Structure

```txt
frontend/     Landing (institutional) + App (reference implementation)
backend/      KYC, document management, event indexing, admin APIs, compliance workflows
contracts/    Smart contracts and protocol logic
docs/         Technical documentation, audit materials, architecture
assets/       Architecture diagrams, branding, visual assets
```

---

## Core Principles

- Compliance-native architecture
- Non-custodial operational model
- Permissioned market infrastructure
- Modular smart contract system
- On-chain auditability
- Institutional-first design
- Reusable infrastructure layer

---

## Current Status

Smart contracts: production-ready architecture deployed on Avalanche C-Chain. 73 tests passing across unit, integration, and fork test suites.

Platform: reference implementation and infrastructure prototype for regulated tokenized market operations.

---

## Disclaimer

This repository is provided for research, experimentation, and demonstration purposes only.

Nothing contained in this repository constitutes legal, financial, or investment advice.

Regulatory compliance requirements may vary depending on jurisdiction and implementation context.

---

## License

All rights reserved.
