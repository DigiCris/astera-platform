# Security Model

---

## Roles by Contract

### AsteraIdentityRegistry

| Role | Holder at deploy | Key permissions |
|------|-----------------|----------------|
| `DEFAULT_ADMIN_ROLE` | `admin` constructor arg | Grant/revoke any role; `setExchange` |
| `IDENTITY_ADMIN_ROLE` | `admin` constructor arg | `registerUser`, `removeUser`, `setYearlyLimit` |
| `EXCHANGE_ROLE` | Granted via `setExchange` | `increaseSpent`, `decreaseSpent`, `resetYearIfNeeded` |

Both `AsteraPrimaryExchange` and `AsteraSecondaryExchange` must hold `EXCHANGE_ROLE` to write yearly spend state. Revoking this role from an exchange immediately stops its ability to update accounting.

### AsteraPrimaryExchange

| Role | Holder at deploy | Key permissions |
|------|-----------------|----------------|
| `DEFAULT_ADMIN_ROLE` | `admin` constructor arg | Grant/revoke any role; `setExchangeSecondary` |
| `EXCHANGE_ADMIN_ROLE` | `admin` constructor arg | `createProjectToken`, `setFeeRecipient`, `setFeeBps` |

### AsteraSecondaryExchange

| Role | Holder at deploy | Key permissions |
|------|-----------------|----------------|
| `DEFAULT_ADMIN_ROLE` | `admin` constructor arg | Grant/revoke any role |
| `EXCHANGE_ADMIN_ROLE` | `admin` constructor arg | Reserved for future admin operations |

### AsteraToken

| Role | Holder at deploy | Key permissions |
|------|-----------------|----------------|
| `DEFAULT_ADMIN_ROLE` | `admin_` constructor arg | Grant/revoke any role |
| `TOKEN_ADMIN_ROLE` | `admin_` and `exchange_` | `setAuthorizedExchange` |
| `MINTER_ROLE` | `exchange_` (primary exchange) | `mint` |
| `BURNER_ROLE` | `exchange_` (primary exchange) | `burn` |
| `FORCED_TRANSFER_ROLE` | `admin_` | `forcedTransfer` |
| `EXCHANGE_ROLE` | `exchange_` (primary exchange) | Stored on token (not used for internal logic) |

The primary exchange is granted `MINTER_ROLE` and `TOKEN_ADMIN_ROLE` at token construction. The secondary exchange is added to `authorizedExchanges` via `setAuthorizedExchange` (not via role).

### AsteraComplianceManager

| Role | Holder at deploy | Key permissions |
|------|-----------------|----------------|
| `DEFAULT_ADMIN_ROLE` | `admin_` constructor arg | Grant/revoke any role |
| `COMPLIANCE_ADMIN_ROLE` | `admin_` constructor arg | `adminAcceptTermsAndJoin`, `adminForceCompliant`, `removeCompliantUser`, `freeze`, `unfreeze`, `freezePartial`, `setFundingCompleted` |

---

## What Contracts Can Move Tokens

| Path | Mechanism | Authorization check |
|------|-----------|-------------------|
| `AsteraToken.mint` | `_mint` (ERC20 internal) | Caller must have `MINTER_ROLE`; `canTransfer(address(0), to, amount)` must pass |
| `AsteraToken.exchangeTransfer` | `_transfer` (ERC20 internal) | Caller must be in `authorizedExchanges`; `canTransfer(from, to, amount)` must pass |
| `AsteraToken.forcedTransfer` | `_transfer` (ERC20 internal) | Caller must have `FORCED_TRANSFER_ROLE`; `canForcedTransfer(from, to, amount)` must pass |
| `AsteraToken.burn` | `_burn` (ERC20 internal) | Caller must have `BURNER_ROLE` |
| `AsteraToken.transfer` | Disabled | Always reverts with `DirectTransfersDisabled` |
| `AsteraToken.transferFrom` | Disabled | Always reverts with `DirectTransfersDisabled` |

---

## What Contracts Can Modify `yearlySpent`

| Function | Caller constraint | Effect |
|----------|------------------|--------|
| `increaseSpent` | `EXCHANGE_ROLE` only | Increases spent; reverts if limit exceeded |
| `decreaseSpent` | `EXCHANGE_ROLE` only | Decreases spent; clamps to 0 if underflow |
| `resetYearIfNeeded` | `EXCHANGE_ROLE` only | Resets spent to 0 and advances cycle start if 365 days elapsed |

Only authorized exchanges can write accounting state. The primary exchange increases spent on primary buy. The secondary exchange increases for buyers and decreases for sellers on secondary fills.

---

## Trust Assumptions

| Assumption | Implication if violated |
|-----------|------------------------|
| Admin/PSAV holds a secure, non-compromised key | Admin key compromise allows arbitrary registration, minting direction changes (via `setFeeRecipient`), forced transfers, and compliance bypasses |
| Off-chain KYC is performed correctly before `registerUser` | Registering an unverified wallet allows them to participate across all projects |
| Treasury address is correct at project creation | Wrong treasury address sends primary USDC to the wrong wallet; immutable after deploy |
| Off-chain document storage preserves signed PDFs | Loss of off-chain evidence makes on-chain hashes unverifiable; reduces regulatory traceability |
| Frontend displays the correct canonical document | User could sign a hash for a document they never saw; on-chain signature would still be valid |
| Backend/indexer monitors events in real time | Missed `AdminForceCompliant` or `ForcedTransfer` events may go undetected; reduces auditability |

---

## Admin Risk Surface

These functions are callable only by admin-level roles. They represent centralization risk and must be monitored:

| Function | Contract | Risk |
|----------|----------|------|
| `adminForceCompliant(user, reason)` | `AsteraComplianceManager` | Marks user compliant without EIP-712 agreement. If used as normal flow, undermines documentary evidence model. |
| `forcedTransfer(from, to, amount)` | `AsteraToken` | Moves tokens bypassing sender freeze and ERC20 standard. If misused, transfers investor assets without consent. |
| `freeze(user)` / `unfreeze(user)` | `AsteraComplianceManager` | Full freeze blocks all token movements for the user. Improper use could lock legitimate holdings. |
| `freezePartial(user, amount)` | `AsteraComplianceManager` | Locks a subset of tokens. Does not prevent movements of the remaining available balance. |
| `setYearlyLimit(user, newLimit)` | `AsteraIdentityRegistry` | Can raise or lower individual investor limits. Setting to 0 restores platform default. |
| `setExchange(exchange, enabled)` | `AsteraIdentityRegistry` | Revoking an exchange stops its ability to update accounting. Adding a malicious exchange could corrupt `yearlySpent`. |
| `setFeeRecipient(newRecipient)` | `AsteraPrimaryExchange` | Changes destination of secondary market fees. |
| `setFeeBps(newFeeBps)` | `AsteraPrimaryExchange` | Changes fee rate for secondary trades. Hard-capped at 1000 bps (10%) on-chain. |
| `removeCompliantUser(user)` | `AsteraComplianceManager` | Revokes project compliance without affecting global KYC. Blocks further participation in this project. |

---

## Production Recommendations

The following measures are not enforced by the current contracts but are strongly recommended before operating in a production environment:

| Recommendation | Rationale |
|---------------|-----------|
| Use a multisig for all admin roles | Prevents single-key compromise from fully compromising the protocol |
| Use a dedicated, separated `feeRecipient` | Avoids mixing operational funds with admin keys |
| Monitor all sensitive events on-chain | `AdminForceCompliant`, `ForcedTransfer`, `Frozen`, `UserRegistered`, `FundingCompleted` — anomalies should trigger alerts |
| Rotate admin keys regularly | Reduces window of exposure if a key is silently compromised |
| Implement a timelock for critical parameter changes | Gives investors and regulators visibility into upcoming changes before they take effect |
| Legal review of admin power scope | Ensure the contractual admin permissions align with the regulatory framework governing the instrument |
| Full security audit before production deployment | This codebase is in an MVP/hackathon stage; critical paths should be reviewed by an external auditor |
