# Audit Scope

Hackathon submission tag: `hackathon-submission-v1`

> This document represents the audit-friendly scope for the hackathon submission. It is not a formal security audit.

---

## In-Scope Contracts

| File | Contract | Notes |
|------|----------|-------|
| `src/identity/AsteraIdentityRegistry.sol` | `AsteraIdentityRegistry` | Global KYC and yearly accounting |
| `src/compliance/AsteraComplianceManager.sol` | `AsteraComplianceManager` | Per-project compliance, EIP-712, funding lifecycle |
| `src/token/AsteraToken.sol` | `AsteraToken` | Restricted ERC20, deploys compliance manager |
| `src/exchange/AsteraPrimaryExchange.sol` | `AsteraPrimaryExchange` | Project creation, primary issuance |
| `src/exchange/AsteraSecondaryExchange.sol` | `AsteraSecondaryExchange` | Secondary order book |
| `src/interfaces/IAsteraIdentityRegistry.sol` | Interface | Consumed by compliance and exchanges |
| `src/interfaces/IAsteraComplianceManager.sol` | Interface | Consumed by token and exchanges |
| `src/interfaces/IAsteraToken.sol` | Interface | Consumed by exchanges and compliance |

### In-Scope Deploy Scripts

Scripts in `script/deploy/` are part of the operational deployment surface and should be reviewed for correctness:

| Script | Purpose |
|--------|---------|
| `script/deploy/DeployPlatform.s.sol` | Deploys and wires the three platform contracts |
| `script/deploy/DeployToken.s.sol` | Creates a new project token + compliance manager |
| `script/deploy/GrantPlatformRoles.s.sol` | Grants platform roles to co-admins |

### In-Scope Tests (for coverage assessment)

| File | Suite |
|------|-------|
| `test/unit/AsteraIdentityRegistry.t.sol` | Unit: identity registry |
| `test/unit/TermsAcceptance.t.sol` | Unit: EIP-712 terms acceptance and admin paths |
| `test/integration/ExchangeFlow.t.sol` | Integration: full primary → secondary flow |
| `test/fork/AvalancheUSDCFork.t.sol` | Fork: sanity check of Avalanche C-Chain USDC |

Tests are in scope only as supporting evidence for coverage gaps; the test contracts themselves are not part of the production surface.

---

## Out of Scope

| Item | Reason |
|------|--------|
| Frontend | Off-chain; only affects UX, not on-chain state |
| Backend / indexer | Off-chain; indexes events, does not control contracts |
| KYC provider real implementation | Off-chain; contract only consumes the registration result |
| IPFS / document storage | Off-chain; contract stores hashes and URIs, not documents |
| Real signed legal documents | Off-chain; only hashes and EIP-712 signatures are on-chain |
| Legal custody / fiduciary | Legal layer outside protocol scope |
| Multisig / timelock | Not implemented in this version; see KNOWN_LIMITATIONS.md |
| Refund / redeem flows | Not implemented in this version; see KNOWN_LIMITATIONS.md |
| Cross-chain bridges | Not implemented |
| OpenZeppelin library internals | Trusted dependency; audited separately |
| `src/mocks/MockUSDC.sol` | Test support only; not deployed in production |

---

## Audit Assumptions

| Assumption | Detail |
|------------|--------|
| USDC is the payment token | All purchase and fee flows use Avalanche C-Chain USDC (`0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E`). No other ERC20 is expected. |
| Admin/PSAV is a regulated operator | Contracts grant significant unilateral power to admin roles. The security model assumes the admin key is held by an accountable, regulated entity. |
| Backend preserves signed PDFs | On-chain, only hashes and EIP-712 signatures are stored. The off-chain backend must retain the actual documents for regulatory compliance. |
| Events are indexed by backend | `TermsAccepted`, `AdminForceCompliant`, `ForcedTransfer`, `FundingCompleted`, `BuyExecuted`, `SellOrderFilled`, and accounting events must be monitored. |
| `MockUSDC` is only used in tests | The mock is not deployed on mainnet. All mainnet flows use the real USDC contract. |
