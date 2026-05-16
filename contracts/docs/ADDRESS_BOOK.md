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

> **Status: deployed and verified on mainnet.** Deploy block: 2026-05-16.

| Contract | Address | Status |
|----------|---------|--------|
| `AsteraIdentityRegistry` | `0x0B66baEF242C8aB2bFe387DC9a5412c7f903Eca1` | **Production** — verified |
| `AsteraPrimaryExchange` | `0x89B2b2FE6fC68a865A258c2C99adaCF5aF4c5A35` | **Production** — verified |
| `AsteraSecondaryExchange` | `0x2F5A5198635DfE5a06Cc09597f66ec7522Be29fc` | **Production** — verified |

---

## Operational Addresses

| Role | Address | Notes |
|------|---------|-------|
| Admin / deployer | `0xd22077414e8859BA08723fEC0ac54D0365346D1e` | Holds `DEFAULT_ADMIN_ROLE` + all admin roles on platform contracts |
| Co-admin 1 | `0x38fF5bBb1F41f1fA4EC59C07DdFe5FA6452d9814` | `DEFAULT_ADMIN_ROLE` + `IDENTITY_ADMIN_ROLE` + `EXCHANGE_ADMIN_ROLE` on all platform contracts |
| Co-admin 2 | `0xe27cF5376ab219CA50C0C4D90506A8C5DfABCA77` | `DEFAULT_ADMIN_ROLE` + `IDENTITY_ADMIN_ROLE` + `EXCHANGE_ADMIN_ROLE` on all platform contracts |
| Fee recipient | `0xd22077414e8859BA08723fEC0ac54D0365346D1e` | Receives secondary market fees |

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
