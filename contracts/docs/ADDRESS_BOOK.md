# Address Book

---

## Target Network

| Parameter | Value |
|-----------|-------|
| Network | Avalanche C-Chain |
| Chain ID | `43114` |
| Native token | AVAX |
| Payment token | USDC |
| USDC address | `0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E` |

---

## Platform Contracts

> **Status: not yet deployed on mainnet.** Fill in after running `DeployPlatform.s.sol`.

| Contract | Address | Status |
|----------|---------|--------|
| `AsteraIdentityRegistry` | TBD | Not deployed |
| `AsteraPrimaryExchange` | TBD | Not deployed |
| `AsteraSecondaryExchange` | TBD | Not deployed |

---

## Operational Addresses

> Fill in after platform deploy.

| Role | Address | Notes |
|------|---------|-------|
| Admin / PSAV | TBD | Holds all admin roles on platform contracts |
| Fee recipient | TBD | Receives secondary market fees |

---

## Deployed Tokens

> One entry per project token created via `createProjectToken`. Fill in after `DeployToken.s.sol`.

| Project | `AsteraToken` | `AsteraComplianceManager` | Treasury | Status |
|---------|--------------|--------------------------|---------|--------|
| (none yet) | — | — | — | — |

---

## Address Classification

All addresses in this file must be classified as one of the following:

| Tag | Meaning |
|-----|---------|
| **Production** | Live mainnet address, in active use |
| **Demo / Hackathon** | Deployed for demonstration or testing purposes only |
| **Test** | Deployed on a testnet (Fuji, etc.) |
| **Historical** | No longer active; retained for reference only |

Do not mix production and non-production addresses in the same row without an explicit tag.

---

## Notes

- All addresses are Avalanche C-Chain (`chainId: 43114`) unless otherwise noted.
- Contract source code should be verified on [Snowscan](https://snowscan.xyz) / [Routescan](https://routescan.io) after deployment.
- This file is the canonical reference for deployed addresses. If an address here conflicts with what is configured in the backend or frontend, treat this file as the source of truth and investigate the discrepancy before proceeding.
