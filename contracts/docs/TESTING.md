# Testing

---

## Test Suite Structure

```
test/
├── unit/
│   ├── AsteraIdentityRegistry.t.sol   — identity registry unit tests
│   └── TermsAcceptance.t.sol          — EIP-712 terms acceptance and compliance admin paths
├── integration/
│   └── ExchangeFlow.t.sol             — full primary → funding close → secondary flow
└── fork/
    └── AvalancheUSDCFork.t.sol        — sanity check of real Avalanche C-Chain USDC contract
```

---

## What Each Suite Covers

### `test/unit/AsteraIdentityRegistry.t.sol`

Tests the identity registry in isolation.

| Test | What it checks |
|------|---------------|
| `testRegisterUserAndDefaultLimit` | Registration sets `isRegistered` and applies `DEFAULT_YEARLY_LIMIT` |
| `testOnlyAdminCanRegister` | Non-admin cannot call `registerUser` |
| `testIncreaseSpentInitializesCycle` | First investment sets `firstInvestmentAt` and `yearlySpent` |
| `testCannotExceedLimit` | `increaseSpent` reverts if new total exceeds limit |
| `testDecreaseSpentCannotUnderflow` | `decreaseSpent` clamps to 0, never underflows |
| `testRollingYearResetUpdatesCycleStart` | After 365 days, `yearlySpent` resets and cycle start advances |

**Notable gaps**: no tests for `setYearlyLimit`, `setExchange`, `removeUser`, `canInvest`, `remainingLimit` directly, or the case where `resetYearIfNeeded` is called explicitly.

---

### `test/unit/TermsAcceptance.t.sol`

Tests EIP-712 agreement acceptance and all compliance admin paths. Uses a full stack (identity + primary exchange + token + compliance + mock USDC).

| Test group | Coverage |
|------------|---------|
| Self-service happy path | `acceptTermsAndJoin` sets compliant, stores agreement, marks hash used, emits event |
| Self-service reverts | Not registered, already compliant, wrong signature, signer ≠ caller, hash already used, zero hash |
| Admin-relayed happy path | `adminAcceptTermsAndJoin` sets compliant, marks `selfService = false` |
| Admin-relayed reverts | Non-admin caller, admin cannot bypass signature, duplicate hash, user not registered |
| EIP-712 digest correctness | Digest changes with any field mutation (genericDocumentHash, URI, signedDocumentHash, user) |
| `adminForceCompliant` | Makes user compliant, reverts for non-admin, non-registered, empty reason, already compliant; does not create agreement; emits event |
| Project token creation | Stores document hash and URI immutably; reverts on zero hash or empty URI; emits full metadata |

**Notable gaps**: no tests for `freeze`, `unfreeze`, `freezePartial`, `setFundingCompleted`, `removeCompliantUser`, or the `canTransfer` / `canForcedTransfer` views directly.

---

### `test/integration/ExchangeFlow.t.sol`

End-to-end integration test covering the full protocol lifecycle. Uses full wired stack (identity + primary + secondary + token + compliance + mock USDC).

| Test group | Coverage |
|------------|---------|
| Wiring | Secondary authorized on token; admin has all roles; secondary linked to primary |
| Primary market | Buy transfers USDC to treasury, mints tokens, increases `yearlySpent` |
| Direct transfer disabled | `token.transfer` reverts with `DirectTransfersDisabled` |
| Post-funding primary block | Buy reverts after `setFundingCompleted` |
| Secondary: partial fill | Fee, seller net, buyer receives tokens, `yearlySpent` accounting, order remains |
| Secondary: full fill | Order removed after full fill; seller `yearlySpent` decreases |
| Double-reservation prevention | Second sell order on the same balance reverts |
| Cancel order | Seller can cancel; order removed; `reservedForSale` decreases |
| Partial freeze + secondary | Partial freeze blocks sell orders exceeding available balance |
| `createProjectToken` reverts | softCap > maxSupply; deadline in past |
| `createProjectToken` success | Token and compliance registered; cap set; secondary auto-authorized |
| Deadline enforcement | Buy reverts after deadline; buy succeeds before deadline |
| Cap enforcement | Buy reverts if exceeds cap; exact cap succeeds; auto-closes funding |
| Manual `setFundingCompleted` | Admin can close if softCap reached and deadline not expired; reverts otherwise |
| `autoCompleteFunding` event | `FundingCompleted` emitted with `autoClose = true` |
| Secondary requires `fundingCompleted` | `createSellOrder` reverts before funding close; works after |
| `grossUSDC == 0` guard | `executeSellOrder` reverts if price rounds to zero |
| Happy path end-to-end | Buy primary → close funding → create order → partial fill → cancel remaining |

**Notable gaps**: no tests for `forcedTransfer`, `decreaseSpent` directly, yearly limit exceeded on secondary buy, `cancelSellOrder` by non-seller revert, fee of 0 bps edge case, or multi-token scenarios.

---

### `test/fork/AvalancheUSDCFork.t.sol`

Requires a live Avalanche C-Chain RPC. Excluded from the default `forge test` run unless `--fork-url` is provided.

| Test | What it checks |
|------|---------------|
| `testAvalancheUSDCExists` | USDC address has deployed bytecode on Avalanche C-Chain |
| `testAvalancheUSDCTotalSupplyCanBeRead` | `totalSupply()` is readable and > 0 |

---

## Commands

```bash
# All tests (excludes fork tests if no fork URL is provided)
forge test

# Verbose output with traces
forge test -vvv

# Fork test (requires AVALANCHE_RPC_URL in .env)
forge test --match-path test/fork/AvalancheUSDCFork.t.sol --fork-url $AVALANCHE_RPC_URL

# Coverage report
forge coverage
```

---

## Test Coverage Gaps

The following areas have no test coverage in the current suite:

| Area | Risk |
|------|------|
| `forcedTransfer` path | Admin-only exceptional transfer is not exercised; bypass of sender freeze not verified |
| `freeze` / `unfreeze` full blocking | Full freeze effect on secondary transfers not directly tested |
| Yearly limit exceeded on secondary buy | `InvestmentLimitExceeded` in secondary exchange not tested |
| `cancelSellOrder` by non-seller | Access control revert not tested |
| `removeCompliantUser` | Compliance revocation not tested |
| `setYearlyLimit` / custom limits | Per-wallet limit override not tested |
| Fee of 0 bps | Zero fee edge case not tested |
| Multi-token scenarios | Isolation between projects not tested |
| `decreaseSpent` clamping | Tested indirectly; no direct assertion |
| Funding deadline edge cases | Exact deadline timestamp (not just +1) not tested |

---

## Recommended Future Tests

| Test type | Rationale |
|-----------|-----------|
| Invariant / fuzzing on accounting | `yearlySpent` and `reservedForSale` are critical accounting state; fuzz for under/overflow and inconsistency |
| Invariant: `totalSupply <= cap` | Verify no code path can mint past cap |
| Fuzzing: `grossUSDC` rounding | Verify zero-USDC guard covers all edge cases |
| `forcedTransfer` path | Verify frozen sender can be transferred from, recipient must be compliant |
| Admin path exhaustive coverage | All admin reverts and success cases for freeze, removal, limit changes |
| Deadline boundary | Test at exact deadline timestamp |
| Multi-project isolation | Verify one project's state does not affect another |
| Partial freeze + secondary sell | Verify `reservedForSale` + `frozenAmount` combination is correctly bounded |
