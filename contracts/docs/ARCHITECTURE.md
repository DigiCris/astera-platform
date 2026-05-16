# Architecture

---

## Module Overview

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
        └──────────┬──────────┘  config                 │ exchangeTransfer
                   │ mint / authorizedExchange           │
        ┌──────────▼──────────────────────────────────┐ │
        │             AsteraToken                     │◄┘
        │  (ERC20, 6 dec, direct transfers disabled,  │
        │   exchangeTransfer for authorized exchanges) │
        └──────────┬──────────────────────────────────┘
                   │ deployed atomically by AsteraToken constructor
        ┌──────────▼──────────┐
        │AsteraComplianceManager│
        │(per-project: treasury,│
        │ softCap, deadline,   │
        │ EIP-712 terms, freeze,│
        │ funding lifecycle)   │
        └──────────────────────┘
```

### Module responsibilities

| Module | Responsibility |
|--------|---------------|
| `AsteraIdentityRegistry` | Single source of truth for platform-level KYC eligibility and rolling annual investment exposure across all projects. |
| `AsteraPrimaryExchange` | Entry point for project operators. Creates tokens, runs primary issuance, routes USDC to treasury, holds authoritative fee configuration for secondary. |
| `AsteraSecondaryExchange` | Implements peer-to-peer secondary trading after funding is closed. Reads token registry and fee config from primary exchange. |
| `AsteraToken` | The on-chain instrument. Represents participation in a specific tokenized asset. Restricts transfers to authorized exchange paths. |
| `AsteraComplianceManager` | Encapsulates all project-specific rules: who accepted terms, what the treasury is, when funding closes, freeze states. |

---

## Flow: Project Creation

```
Admin
  │
  ├── (pre-condition) setExchangeSecondary(secondary) on primary
  │
  └── createProjectToken(name, symbol, maxSupply, softCap, fundingDeadline,
                         treasury, genericDocumentHash, genericDocumentURI)
        │
        ├── deploys AsteraToken
        │     └── AsteraToken constructor deploys AsteraComplianceManager
        │           (identityRegistry, token, treasury, softCap, fundingDeadline,
        │            admin, genericDocumentHash, genericDocumentURI)
        │
        ├── registers: supportedTokens[token] = true
        ├── registers: complianceOf[token] = compliance
        ├── registers: tokenCap[token] = maxSupply
        │
        └── if exchangeSecondary is set:
              token.setAuthorizedExchange(secondary, true)
```

The compliance manager is deployed inline by the token constructor so token and compliance are permanently paired and cannot be reassigned post-deployment.

---

## Flow: KYC and Terms Acceptance

```
Off-chain KYC
  └── Admin registers wallet: identity.registerUser(user)

Terms acceptance (two paths):

  Self-service:
    User signs EIP-712 AgreementAcceptance off-chain
      └── user calls: compliance.acceptTermsAndJoin(signedDocumentHash, signature)

  Admin-relayed (backend pays gas):
    User signs EIP-712 off-chain → backend collects signature
      └── admin calls: compliance.adminAcceptTermsAndJoin(user, signedDocumentHash, signature)
      └── contract recovers signer; must equal user — admin cannot substitute a signer

  EIP-712 struct:
    AgreementAcceptance(
      bytes32 genericDocumentHash,   // hash of the canonical legal document (fixed at project creation)
      string  genericDocumentURI,    // URI of the canonical legal document
      bytes32 signedDocumentHash,    // hash of this user's individually signed PDF (unique per user)
      address user                   // wallet accepting the terms
    )

  On-chain evidence stored:
    agreements[user] = { signedDocumentHash, signature, timestamp, selfService }
    usedSignedDocumentHashes[signedDocumentHash] = true

  Admin escape hatch:
    compliance.adminForceCompliant(user, reason)
      Marks compliant without agreement. Does NOT populate agreements[user].
      Emits AdminForceCompliant(user, admin, reason, timestamp).
      Must not be used as the standard onboarding path.
```

---

## Flow: Primary Purchase

```
User
  ├── usdc.approve(primaryExchange, amount)
  └── exchange.buy(token, amount)
        │
        ├── requires: token is supported
        ├── requires: fundingCompleted == false
        ├── requires: block.timestamp <= fundingDeadline
        ├── requires: identity.isRegistered(buyer)
        ├── requires: totalSupply + amount <= cap
        ├── requires: identity.canInvest(buyer, amount)
        ├── requires: compliance.canTransfer(address(0), buyer, amount)
        │
        ├── usdc.safeTransferFrom(buyer, treasury, amount)
        ├── token.mint(buyer, amount)
        │     └── if totalSupply == cap: compliance.autoCompleteFunding()
        └── identity.increaseSpent(buyer, amount)
```

Primary exchange never custodies USDC. Funds flow directly from buyer to treasury.

---

## Flow: Funding Lifecycle

```
State: fundingCompleted = false (initial)

Manual close (admin):
  compliance.setFundingCompleted()
    requires: fundingCompleted == false
    requires: block.timestamp <= fundingDeadline
    requires: totalSupply >= softCap
    → fundingCompleted = true
    → secondary market opens

Auto close (triggered by mint reaching cap):
  token.mint(buyer, amount) where totalSupply == cap
    → compliance.autoCompleteFunding()  (called by token, not admin)
    → fundingCompleted = true
    → secondary market opens

Expired without close:
  block.timestamp > fundingDeadline AND fundingCompleted == false
    → primary buys revert (FundingDeadlineExpired)
    → setFundingCompleted reverts (DeadlineExpired)
    → secondary market never opens
    → no automatic refund mechanism exists in this version
```

---

## Flow: Secondary Market

```
Seller
  └── secondary.createSellOrder(token, amount, unitPriceUSDC)
        ├── requires: fundingCompleted == true
        ├── requires: compliance.canTransfer(seller, address(0), amount)
        │     (checks compliance + available balance - frozenAmount)
        ├── requires: availableBalance - reservedForSale[token][seller] >= amount
        └── reservedForSale[token][seller] += amount
        (tokens stay in seller's wallet until fill)

Buyer
  ├── usdc.approve(secondary, grossUSDC)
  └── secondary.executeSellOrder(orderId, amountToBuy)
        ├── requires: fundingCompleted == true
        ├── requires: compliance.canTransfer(seller, buyer, amountToBuy)
        ├── grossUSDC = amountToBuy * unitPriceUSDC / 1e6
        ├── requires: grossUSDC > 0
        ├── requires: identity.canInvest(buyer, grossUSDC)
        │
        ├── usdc from buyer → secondary (grossUSDC)
        ├── usdc from secondary → feeRecipient (feeUSDC)
        ├── usdc from secondary → seller (grossUSDC - feeUSDC)
        │
        ├── reservedForSale[token][seller] -= amountToBuy
        ├── token.exchangeTransfer(seller, buyer, amountToBuy)
        │     (no ERC20 allowance needed; exchange is authorized gateway)
        │
        ├── identity.increaseSpent(buyer, grossUSDC)
        └── identity.decreaseSpent(seller, grossUSDC)
              (decrease uses gross, not net: represents economic divestment)
```

---

## Relationship: Token ↔ Compliance Manager

- `AsteraToken` deploys exactly one `AsteraComplianceManager` in its constructor. The address is stored in `AsteraToken.compliance` (immutable).
- The compliance manager's `token` field is also immutable, pointing back to the token.
- `autoCompleteFunding` on the compliance manager is only callable by `token`. Any other caller reverts.
- The compliance manager reads `token.totalSupply()` and `token.balanceOf()` for supply/balance checks.
- These two contracts are always paired. Mixing compliance managers across tokens is not possible.

---

## Why Primary and Secondary Are Separate Contracts

- **Bytecode size**: a single contract would exceed the EVM deployment size limit.
- **Operational clarity**: primary issuance and secondary trading have different lifecycles, permissions, and accounting flows. Separation makes auditing each surface independent.
- **Fee config**: primary exchange stores `feeRecipient` and `feeBps` as the single authoritative source. Secondary reads them via the `IAsteraPrimaryExchange` interface, avoiding duplication and config drift.

---

## Why Direct ERC20 Transfers Are Disabled

`AsteraToken.transfer` and `transferFrom` unconditionally revert with `DirectTransfersDisabled`.

Reasons:
- Compliance checks (`isCompliant`, `canTransfer`) must run on every movement. An unrestricted ERC20 transfer would bypass them.
- Annual investment accounting (`yearlySpent`) must be updated on every secondary transfer. A direct transfer would silently skip accounting.
- Seller's `reservedForSale` balance would become inconsistent if tokens could move without going through the secondary exchange.

The only authorized movement paths are:
- `mint` (primary exchange via `MINTER_ROLE`)
- `exchangeTransfer` (authorized exchanges in `authorizedExchanges`)
- `forcedTransfer` (admin via `FORCED_TRANSFER_ROLE`, exceptional path)
- `burn` (via `BURNER_ROLE`, operational/admin tool)
