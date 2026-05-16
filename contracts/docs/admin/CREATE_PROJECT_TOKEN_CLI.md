# Create Project Token — CLI

## Usage

From the `contracts/` directory:

```bash
node scripts/admin/createProjectToken.js
```

Requires Node.js 18+ and `forge` in PATH. `.env` must be populated — at minimum `PRIVATE_KEY` and `AVALANCHE_RPC_URL`.

---

## What it does

1. Prompts for token/project parameters with hardcoded defaults for the first project (`AREI`).
2. Validates all inputs before touching anything on-chain.
3. Runs `forge script script/deploy/DeployToken.s.sol:DeployToken --broadcast` against Avalanche mainnet.
4. Saves a deployment record to `docs/tokenDeployments/DD_MM_YY_SYMBOL.json`.
5. Runs `git add / commit / push` automatically if the deploy succeeded.

The temporary env file (`.env.deploy-token.tmp`) is always deleted on exit — both on success and on failure. `PRIVATE_KEY` is never written to it.

---

## Parameters

| Variable | Description |
|----------|-------------|
| `EXCHANGE` | Address of the deployed `AsteraPrimaryExchange` |
| `TOKEN_NAME` | Full name of the token (e.g., `Astera Real Estate I`) |
| `TOKEN_SYMBOL` | Ticker symbol (e.g., `AREI`) |
| `TOKEN_MAX_SUPPLY` | Maximum supply as uint256 with 6 decimals |
| `TOKEN_SOFT_CAP` | Minimum raise to close funding, same units |
| `TOKEN_FUNDING_DEADLINE` | Unix timestamp — must be in the future |
| `FIDEICOMISO_WALLET` | Treasury / fideicomiso receiving address |
| `GENERIC_DOCUMENT_HASH` | `bytes32` hash of the offering document |
| `GENERIC_DOCUMENT_URI` | URI to the IPFS-hosted document |

---

## Behavior on failure

| Scenario | Outcome |
|----------|---------|
| Validation fails | No deploy, no file, no commit |
| Forge deploy fails | No JSON saved, no commit, no push |
| Deploy succeeds, git fails | JSON saved; error printed with the exact manual `git` command |
| Any outcome | `.env.deploy-token.tmp` is always deleted |

---

## Output and traceability

Deployment records land in [`docs/tokenDeployments/`](../tokenDeployments/README.md). Each JSON is committed and pushed to GitHub as the authoritative record for that token emission — providing audit trail, traceability, and a verifiable history of all projects issued on the platform.
