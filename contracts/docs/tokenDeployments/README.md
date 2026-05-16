# Token Deployment Records

Each JSON file in this directory represents a token/project/fideicomiso deployed via `AsteraPrimaryExchange.createProjectToken`. Records are written automatically by the [admin CLI](../admin/CREATE_PROJECT_TOKEN_CLI.md) after a successful broadcast.

---

## Naming convention

```
DD_MM_YY_SYMBOL.json
```

Example: `16_05_26_AREI.json` — token `AREI`, deployed on 16 May 2026.

---

## Fields

| Field | Description |
|-------|-------------|
| `tokenName` | Full token name |
| `tokenSymbol` | Ticker |
| `tokenAddress` | Deployed `AsteraToken` address |
| `complianceManagerAddress` | Paired `AsteraComplianceManager` address |
| `exchange` | `AsteraPrimaryExchange` that created the token |
| `maxSupply` | Cap (uint256, 6 decimals) |
| `softCap` | Soft cap (uint256, 6 decimals) |
| `fundingDeadline` | Unix timestamp |
| `fideicomisoWallet` | Treasury address |
| `genericDocumentHash` | `bytes32` hash of the offering document |
| `genericDocumentURI` | IPFS URI of the document |
| `deployedAt` | ISO 8601 timestamp of the CLI run |
| `txHash` | Transaction hash (from Foundry broadcast, if available) |
| `chainId` | Chain ID — `43114` for Avalanche C-Chain |
| `deployer` | Address that sent the transaction |
| `broadcastPath` | Relative path to the Foundry broadcast file |

---

## Purpose

This folder is the versioned, GitHub-backed registry of all token emissions. It provides:

- **Audit trail** — every deployment is permanently recorded with on-chain addresses and document hashes.
- **Traceability** — correlates each token to its fideicomiso, compliance manager, and treasury.
- **Verifiable history** — git history shows when each token was created and by whom.
