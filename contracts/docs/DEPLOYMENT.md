# Deployment

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values before running any script. Never commit `.env`.

| Variable | Description |
|----------|-------------|
| `PRIVATE_KEY` | Private key of the deployer wallet (must match `ASTERA_ADMIN` for `DeployPlatform`) |
| `ASTERA_ADMIN` | Admin address for all platform contracts |
| `FEE_RECIPIENT` | Address that receives secondary market fees |
| `USDC_ADDRESS` | USDC contract address (`0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E` on Avalanche C-Chain) |
| `AVALANCHE_RPC_URL` | Avalanche C-Chain RPC endpoint |
| `ETHERSCAN_API_KEY` | Routescan/Snowscan API key for contract verification |
| `IDENTITY_REGISTRY` | Deployed `AsteraIdentityRegistry` address (after `DeployPlatform`) |
| `EXCHANGE` | Deployed `AsteraPrimaryExchange` address (after `DeployPlatform`) |
| `EXCHANGE_SECONDARY` | Deployed `AsteraSecondaryExchange` address (after `DeployPlatform`) |
| `CO_ADMIN_1` | First co-admin address (for `GrantPlatformRoles`) |
| `CO_ADMIN_2` | Second co-admin address (for `GrantPlatformRoles`) |
| `TOKEN_NAME` | Full name of the project token (e.g., `"Fideicomiso Token"`) |
| `TOKEN_SYMBOL` | Symbol of the project token (e.g., `"FID"`) |
| `TOKEN_MAX_SUPPLY` | Hard cap in 6-decimal units (e.g., `1000000000` for 1000 tokens) |
| `TOKEN_SOFT_CAP` | Soft cap in 6-decimal units (e.g., `100000000` for 100 tokens) |
| `TOKEN_FUNDING_DEADLINE` | Unix timestamp for the funding deadline |
| `FIDEICOMISO_WALLET` | Treasury address receiving all primary-sale USDC |
| `GENERIC_DOCUMENT_HASH` | `keccak256` of the canonical legal document PDF (as `bytes32`) |
| `GENERIC_DOCUMENT_URI` | IPFS or HTTP URI of the canonical legal document PDF |

---

## Demo / Hackathon vs. Production

| Aspect | Demo / Hackathon | Production |
|--------|-----------------|------------|
| Admin key | Single EOA acceptable | Multisig required |
| Fee recipient | Can be same as admin | Should be a separate, dedicated address |
| Treasury | Can be any address | Must be a verified, controlled fiduciary wallet |
| `GENERIC_DOCUMENT_HASH` | Can be a test hash | Must be the real keccak256 of the final legal document |
| USDC | Can use `MockUSDC` in local tests | Must use real Avalanche C-Chain USDC |
| Contract verification | Optional | Required for regulatory and audit traceability |
| Timelock / multisig on admin | Not implemented | Strongly recommended before going live |

---

## Step 1: Deploy Platform

Deploys `AsteraIdentityRegistry`, `AsteraPrimaryExchange`, and `AsteraSecondaryExchange`. Automatically grants `EXCHANGE_ROLE` to both exchanges in the registry and sets `exchangeSecondary` on the primary exchange.

**Prerequisite**: `PRIVATE_KEY`, `ASTERA_ADMIN`, `FEE_RECIPIENT`, and `USDC_ADDRESS` must be set. `PRIVATE_KEY` wallet address must equal `ASTERA_ADMIN` and `FEE_RECIPIENT` (enforced by the script).

```bash
forge script script/deploy/DeployPlatform.s.sol --rpc-url $AVALANCHE_RPC_URL --broadcast
```

Record the three addresses printed to console and set them as `IDENTITY_REGISTRY`, `EXCHANGE`, and `EXCHANGE_SECONDARY` in `.env`.

---

## Step 2: Grant Platform Roles to Co-Admins (Optional)

Grants `DEFAULT_ADMIN_ROLE` and relevant operational roles on all three platform contracts to `CO_ADMIN_1` and `CO_ADMIN_2`.

**Prerequisite**: `IDENTITY_REGISTRY`, `EXCHANGE`, `EXCHANGE_SECONDARY`, `CO_ADMIN_1`, `CO_ADMIN_2` must be set.

```bash
forge script script/deploy/GrantPlatformRoles.s.sol --rpc-url $AVALANCHE_RPC_URL --broadcast
```

---

## Step 3: Create a Project Token

Deploys an `AsteraToken` + `AsteraComplianceManager` pair and registers them in the primary exchange. The secondary exchange is automatically authorized on the new token.

**Prerequisite**: All `TOKEN_*`, `FIDEICOMISO_WALLET`, `GENERIC_DOCUMENT_HASH`, `GENERIC_DOCUMENT_URI`, and `EXCHANGE` must be set.

```bash
forge script script/deploy/DeployToken.s.sol --rpc-url $AVALANCHE_RPC_URL --broadcast
```

Record the token and compliance addresses printed to console.

---

## Contract Verification (Routescan / Snowscan)

```bash
forge verify-contract <TOKEN_ADDRESS> src/token/AsteraToken.sol:AsteraToken \
  --chain-id 43114 \
  --verifier-url https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(string,string,uint256,address,address,address,uint256,uint256,address,bytes32,string)" ...)
```

Repeat for `AsteraIdentityRegistry`, `AsteraPrimaryExchange`, `AsteraSecondaryExchange`, and `AsteraComplianceManager`.

---

## Post-Deploy Checklist

After each deployment step, verify:

- [ ] `AsteraIdentityRegistry` address recorded
- [ ] `AsteraPrimaryExchange` address recorded
- [ ] `AsteraSecondaryExchange` address recorded
- [ ] Both exchanges hold `EXCHANGE_ROLE` on identity registry
- [ ] `exchangeSecondary` on primary exchange points to secondary exchange
- [ ] If co-admins were added: roles confirmed on each contract
- [ ] `AsteraToken` address recorded
- [ ] `AsteraComplianceManager` address recorded and bound to token
- [ ] `compliance` field on token matches deployed compliance manager address
- [ ] Treasury address on compliance manager is correct
- [ ] `genericDocumentHash` and `genericDocumentURI` on compliance manager match expected values
- [ ] Secondary exchange is in `authorizedExchanges` on the token
- [ ] `softCap` and `fundingDeadline` on compliance manager are correct
- [ ] `feeRecipient` and `feeBps` on primary exchange are correct
- [ ] All deployed contracts are verified on Routescan/Snowscan (for production)
