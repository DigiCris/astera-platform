# Astera Contracts

This is the primary entrypoint for auditing the Astera Finance smart contract system. It covers architecture, roles, flows, security model, known limitations, and testing. Deeper detail on each topic lives in [`docs/`](docs/).

---

## Table of Contents

1. [What Is Astera Contracts](#what-is-astera-contracts)
2. [Audit Scope](#audit-scope)
3. [Architecture](#architecture)
4. [Contracts and Responsibilities](#contracts-and-responsibilities)
5. [Units and Decimals](#units-and-decimals)
6. [Principal Flows](#principal-flows)
7. [Roles](#roles)
8. [Security Model](#security-model)
9. [Known Limitations](#known-limitations)
10. [Invariants](#invariants)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Commands](#commands)
14. [Documentation Index](#documentation-index)

---

## What Is Astera Contracts

Astera Finance is regulated tokenization infrastructure for LATAM, targeting PSAVs, fintechs, regulated issuers, and financial operators. It provides compliant on-chain issuance and secondary trading of tokenized assets (e.g., fideicomisos).

It is **not**:
- a generic crypto exchange or AMM
- a speculative marketplace
- a freely transferable token
- a full ERC-3643 implementation

It **is**:
- permissioned issuance and trading infrastructure with global KYC
- per-project compliance with documentary evidence (EIP-712)
- primary purchase against USDC at 1:1
- controlled secondary market with order book, partial fills, and fees
- on-chain traceability of all sensitive operations and events

Target network: **Avalanche C-Chain** (Chain ID 43114). Payment token: **USDC** (`0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E`).

---

## Audit Scope

Full scope detail: [`docs/AUDIT_SCOPE.md`](docs/AUDIT_SCOPE.md)

In-scope contracts:

| File | Contract |
|------|----------|
| `src/identity/AsteraIdentityRegistry.sol` | `AsteraIdentityRegistry` |
| `src/compliance/AsteraComplianceManager.sol` | `AsteraComplianceManager` |
| `src/token/AsteraToken.sol` | `AsteraToken` |
| `src/exchange/AsteraPrimaryExchange.sol` | `AsteraPrimaryExchange` |
| `src/exchange/AsteraSecondaryExchange.sol` | `AsteraSecondaryExchange` |
| `src/interfaces/IAsteraIdentityRegistry.sol` | Interface |
| `src/interfaces/IAsteraComplianceManager.sol` | Interface |
| `src/interfaces/IAsteraToken.sol` | Interface |

Out of scope: frontend, backend, KYC provider, off-chain document storage, legal custody, multisig/timelock (not implemented), refund/redeem flows (not implemented), bridges.

---

## Architecture

Full architecture detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

```
                        ┌─────────────────────────┐
                        │  AsteraIdentityRegistry  │
                        │  (global KYC + yearly    │
                        │   investment accounting) │
                        └────────────┬────────────┘
                                     │ isRegistered / increaseSpent / decreaseSpent
                   ┌─────────────────┴───────────────────┐
                   │                                     │
        ┌──────────▼──────────┐             ┌────────────▼──────────┐
        │ AsteraPrimaryExchange│             │AsteraSecondaryExchange│
        │ (project creation,  │             │ (order book, fills,   │
        │  primary buy, USDC  │◄────────────│  fees, accounting)    │
        │  → treasury direct) │  reads fee  └───────────┬───────────┘
        └──────────┬──────────┘  config                 │
                   │                                     │
        ┌──────────▼──────────────────────────────────┐ │
        │             AsteraToken                     │ │
        │  (ERC20, 6 dec, direct transfers disabled,  │◄┘
        │   exchangeTransfer for authorized exchanges) │
        └──────────┬──────────────────────────────────┘
                   │ deployed by token constructor
        ┌──────────▼──────────┐
        │AsteraComplianceManager│
        │(per-project: treasury,│
        │ softCap, deadline,   │
        │ EIP-712 terms, freeze,│
        │ funding lifecycle)   │
        └──────────────────────┘
```

**Key design decisions:**
- `AsteraIdentityRegistry` is global; a single KYC approval covers all projects.
- Each project has its own `AsteraComplianceManager`, deployed by the token constructor. Token and compliance are always paired and cannot be mixed post-deployment.
- Primary and secondary exchanges are separate contracts with clear operational boundaries.
- `AsteraToken` disables direct `transfer` and `transferFrom`; all secondary movements must go through an authorized exchange to preserve compliance checks and annual investment accounting.
- Primary USDC goes directly to the project treasury; no exchange custodies primary proceeds.

---

## Contracts and Responsibilities

| Contract | Responsibility |
|----------|---------------|
| `AsteraIdentityRegistry` | Global KYC registry. Registers/removes wallets after off-chain KYC. Manages rolling 365-day investment accounting (`yearlySpent`, `firstInvestmentAt`). Enforces default 1500 USDC annual limit with per-wallet overrides. |
| `AsteraPrimaryExchange` | Creates project tokens (deploys `AsteraToken` + `AsteraComplianceManager`). Executes primary purchases (1 USDC = 1 token unit). USDC goes directly to treasury. Reads identity registry for KYC and yearly limit checks. Stores fee config read by secondary. |
| `AsteraSecondaryExchange` | Order-book secondary market. Operates only after `fundingCompleted`. Manages sell orders, partial fills, `reservedForSale` anti-double-listing, fee distribution, and annual investment accounting updates. Token movements via `exchangeTransfer`. |
| `AsteraToken` | Restricted ERC20, 6 decimals. Direct transfers permanently disabled. Authorized exchanges call `exchangeTransfer`. Deploys its own `AsteraComplianceManager` at construction. Auto-closes funding when `totalSupply == cap`. |
| `AsteraComplianceManager` | Per-project compliance. Stores treasury, softCap, fundingDeadline, fundingCompleted, document hashes/URI. Validates EIP-712 terms acceptance. Manages compliance status, full freeze, partial freeze, and funding lifecycle. |

---

## Units and Decimals

All amounts use **6 decimals** throughout, matching USDC:

| | Value |
|--|-------|
| 1 USDC | `1_000_000` units |
| 1 token | `1_000_000` units |
| Primary ratio | 1 USDC unit = 1 token unit |
| Secondary price | `grossUSDC = tokenAmount * unitPriceUSDC / 1e6` |
| Default annual limit | `1_500_000_000` units (1500 USDC) |

`grossUSDC == 0` reverts in `executeSellOrder` to prevent free fills from integer truncation.

---

## Principal Flows

Full flow detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

### Platform Setup

1. Admin deploys `AsteraIdentityRegistry`, `AsteraPrimaryExchange`, `AsteraSecondaryExchange`.
2. Admin grants `EXCHANGE_ROLE` to both exchanges in identity registry (`setExchange`).
3. Admin sets secondary exchange address in primary exchange (`setExchangeSecondary`).

### Project Creation

4. Admin calls `AsteraPrimaryExchange.createProjectToken(...)`.
5. Deploys `AsteraToken`; token constructor deploys `AsteraComplianceManager`.
6. Primary registers token, compliance, and cap. Secondary exchange is auto-authorized on the new token if `exchangeSecondary` is already set.

### Investor Onboarding

7. User completes KYC off-chain.
8. Admin registers wallet in `AsteraIdentityRegistry` (`registerUser`).
9. User signs EIP-712 agreement and calls `acceptTermsAndJoin`, or admin relays with user's pre-collected signature via `adminAcceptTermsAndJoin`.
10. On-chain evidence: `signedDocumentHash + signature + timestamp` stored in `agreements[user]`. PDF kept off-chain.

### Primary Purchase

11. User approves USDC to `AsteraPrimaryExchange`.
12. User calls `buy(token, amount)`.
13. Checks: KYC registered, funding not yet completed, deadline not expired, cap not exceeded, yearly limit not exceeded, project-compliant.
14. USDC transfers directly to treasury. Tokens minted to buyer. `yearlySpent` increased.

### Funding Close

15. Manual close: admin calls `setFundingCompleted()` if `totalSupply >= softCap` and deadline not expired.
16. Auto close: triggered by `mint` when `totalSupply == cap`.
17. Secondary market opens only after `fundingCompleted == true`. Deadline expiry without close permanently blocks both markets.

### Secondary Market

18. Seller calls `createSellOrder`. Tokens remain in seller's wallet; `reservedForSale` increases to prevent double-listing.
19. Buyer approves USDC to `AsteraSecondaryExchange`.
20. Buyer calls `executeSellOrder(orderId, amountToBuy)`.
21. `grossUSDC` computed. Fee deducted. Seller receives net USDC. Fee goes to `feeRecipient` (read from primary exchange).
22. Token moved via `AsteraToken.exchangeTransfer` — no ERC20 allowance required from seller.
23. Buyer `yearlySpent` increases by `grossUSDC`. Seller `yearlySpent` decreases by `grossUSDC` (gross, not net).

---

## Roles

Full role and permission detail: [`docs/SECURITY_MODEL.md`](docs/SECURITY_MODEL.md)

### AsteraIdentityRegistry

| Role | Key Permissions |
|------|----------------|
| `DEFAULT_ADMIN_ROLE` | Grant/revoke roles, `setExchange` |
| `IDENTITY_ADMIN_ROLE` | `registerUser`, `removeUser`, `setYearlyLimit` |
| `EXCHANGE_ROLE` | `increaseSpent`, `decreaseSpent`, `resetYearIfNeeded` |

### AsteraPrimaryExchange

| Role | Key Permissions |
|------|----------------|
| `DEFAULT_ADMIN_ROLE` | Grant/revoke roles, `setExchangeSecondary` |
| `EXCHANGE_ADMIN_ROLE` | `createProjectToken`, `setFeeRecipient`, `setFeeBps` |

### AsteraSecondaryExchange

| Role | Key Permissions |
|------|----------------|
| `DEFAULT_ADMIN_ROLE` | Grant/revoke roles |
| `EXCHANGE_ADMIN_ROLE` | Reserved for future admin operations |

### AsteraToken

| Role | Key Permissions |
|------|----------------|
| `DEFAULT_ADMIN_ROLE` | Grant/revoke roles |
| `TOKEN_ADMIN_ROLE` | `setAuthorizedExchange` |
| `MINTER_ROLE` | `mint` |
| `BURNER_ROLE` | `burn` |
| `FORCED_TRANSFER_ROLE` | `forcedTransfer` |

### AsteraComplianceManager

| Role | Key Permissions |
|------|----------------|
| `DEFAULT_ADMIN_ROLE` | Grant/revoke roles |
| `COMPLIANCE_ADMIN_ROLE` | `adminAcceptTermsAndJoin`, `adminForceCompliant`, `removeCompliantUser`, `freeze`, `unfreeze`, `freezePartial`, `setFundingCompleted` |

---

## Security Model

Full security model: [`docs/SECURITY_MODEL.md`](docs/SECURITY_MODEL.md)

**Trust assumptions:**
- Admin/PSAV is a regulated operator. Admin key compromise is the primary centralization risk.
- Off-chain KYC provider correctly validates identity before admin registers wallets.
- Treasury address is correctly configured at project creation (immutable after deploy).
- Off-chain document storage (IPFS/backend) preserves signed PDFs and evidence.
- Frontend correctly displays the canonical document before requesting user signature.
- Backend/indexer monitors critical events for compliance and regulatory traceability.

**Admin escape hatches (must be auditable, not normal flow):**
- `adminForceCompliant`: marks a user compliant without EIP-712 agreement. Emits `AdminForceCompliant` with mandatory reason string.
- `forcedTransfer`: bypasses sender freeze for legal/operational corrections. Emits `ForcedTransfer`.

**Token movement authorization:**
- Only addresses in `AsteraToken.authorizedExchanges` can call `exchangeTransfer`.
- Primary exchange receives `EXCHANGE_ROLE` + `MINTER_ROLE` at token construction.
- Secondary exchange must be added via `setAuthorizedExchange` (done automatically by `createProjectToken` if `exchangeSecondary` is already set).

---

## Known Limitations

Full list: [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md)

- No automatic refund if soft cap is not reached before deadline.
- No redeem/sellback against treasury in this version.
- No ERC-3643 ONCHAINID, trusted issuers, or claim topics.
- No upgradeability or proxy pattern.
- No timelock or multisig enforced in contracts (recommended for production).
- Deadline expiry without `fundingCompleted` permanently blocks primary and secondary.
- No on-chain price ordering in the order book.
- No cross-chain bridging.
- `adminForceCompliant` and `forcedTransfer` are centralized escape hatches requiring operational monitoring.

---

## Invariants

Full invariant list: [`docs/INVARIANTS.md`](docs/INVARIANTS.md)

Key invariants:
- `totalSupply <= cap` at all times.
- Direct `transfer` and `transferFrom` always revert.
- Only `authorizedExchanges` addresses can call `exchangeTransfer`.
- Primary buy reverts if `fundingCompleted == true` or deadline expired.
- Secondary operations revert if `fundingCompleted == false`.
- `reservedForSale` never exceeds the seller's available (non-frozen, non-reserved) balance at order creation.
- `grossUSDC == 0` reverts in `executeSellOrder`.
- Buyer `yearlySpent` cannot exceed their annual limit.
- `signedDocumentHash` cannot be reused across wallets.
- `adminAcceptTermsAndJoin` cannot bypass the user's EIP-712 signature.
- Primary USDC goes directly to treasury (never held by exchange).

---

## Testing

Full testing detail: [`docs/TESTING.md`](docs/TESTING.md)

| Suite | File | Coverage area |
|-------|------|---------------|
| Unit: Identity | `test/unit/AsteraIdentityRegistry.t.sol` | Registration, limits, yearly cycle, access control |
| Unit: Terms | `test/unit/TermsAcceptance.t.sol` | EIP-712 signing, agreement storage, admin paths, `adminForceCompliant` |
| Integration | `test/integration/ExchangeFlow.t.sol` | Full primary → funding close → secondary flow, cap enforcement, deadline, freezes |
| Fork | `test/fork/AvalancheUSDCFork.t.sol` | Sanity check of real Avalanche C-Chain USDC contract |

Commands:

```bash
forge test
forge test -vvv
forge test --match-path test/fork/AvalancheUSDCFork.t.sol --fork-url $AVALANCHE_RPC_URL
forge coverage
```

---

## Deployment

Full deployment detail: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

Scripts in `script/deploy/`:

| Script | Purpose |
|--------|---------|
| `DeployPlatform.s.sol` | Deploys `AsteraIdentityRegistry`, `AsteraPrimaryExchange`, `AsteraSecondaryExchange` and wires them |
| `DeployToken.s.sol` | Creates a new project token + compliance manager via `createProjectToken` |
| `GrantPlatformRoles.s.sol` | Grants platform roles to co-admins |

```bash
forge script script/deploy/DeployPlatform.s.sol --rpc-url $AVALANCHE_RPC_URL --broadcast
forge script script/deploy/DeployToken.s.sol --rpc-url $AVALANCHE_RPC_URL --broadcast
forge script script/deploy/GrantPlatformRoles.s.sol --rpc-url $AVALANCHE_RPC_URL --broadcast
```

See `.env.example` for required environment variables. Never commit `.env`.

---

## Commands

```bash
forge fmt
forge build
forge test
forge test -vvv
```

---

## Documentation Index

| Document | Content |
|----------|---------|
| [`docs/AUDIT_SCOPE.md`](docs/AUDIT_SCOPE.md) | In-scope / out-of-scope contracts, scripts, tests, and assumptions |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Module design, flow diagrams, design decisions |
| [`docs/SECURITY_MODEL.md`](docs/SECURITY_MODEL.md) | Roles, permissions, trust assumptions, admin risks, production recommendations |
| [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md) | Intentional design constraints, operational risks, future improvements |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Deploy steps, env vars, post-deploy checklist |
| [`docs/ADDRESS_BOOK.md`](docs/ADDRESS_BOOK.md) | Network addresses, deployed contract addresses |
| [`docs/TESTING.md`](docs/TESTING.md) | Test suite structure, coverage, gaps, future recommendations |
| [`docs/INVARIANTS.md`](docs/INVARIANTS.md) | Protocol invariants, test status, off-chain dependencies |
| [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md) | Threat scenarios, impact, mitigations |
