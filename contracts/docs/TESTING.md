# Testing

---

## Test Suite Structure

```
test/
├── unit/
│   ├── AsteraIdentityRegistry.t.sol   — identity registry core unit tests
│   ├── YearlyLimits.t.sol             — setYearlyLimit, canInvest, remainingLimit, removeUser
│   ├── TermsAcceptance.t.sol          — EIP-712 terms acceptance and compliance admin paths
│   └── FreezeAndForcedTransfer.t.sol  — freeze/unfreeze, forcedTransfer, reservedForSale accounting
├── integration/
│   └── ExchangeFlow.t.sol             — full primary → funding close → secondary flow
├── fuzz/
│   └── CapAndLimits.t.sol             — fuzz: totalSupply ≤ cap, yearlySpent ≤ limit invariants
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

**Notable gaps**: no tests for `setExchange`, `canInvest` / `remainingLimit` with multiple sequential investments in the same cycle, or explicit `resetYearIfNeeded` call. Covered separately in `YearlyLimits.t.sol`.

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

**Notable gaps**: no tests for `freezePartial` in isolation, or the `canTransfer` / `canForcedTransfer` views called directly. Freeze/unfreeze and `removeCompliantUser` are covered in `FreezeAndForcedTransfer.t.sol`.

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

**Notable gaps**: no tests for `decreaseSpent` directly, fee of 0 bps edge case, or multi-token isolation scenarios. `forcedTransfer`, secondary yearly limit exceeded, and `cancelSellOrder` by non-seller are now covered in `FreezeAndForcedTransfer.t.sol`.

---

### `test/unit/YearlyLimits.t.sol`

Unit tests for per-wallet investment limit configuration in `AsteraIdentityRegistry`.

| Test | What it checks |
|------|---------------|
| `testSetYearlyLimitCustomOverridesDefault` | Custom limit replaces DEFAULT_YEARLY_LIMIT |
| `testSetYearlyLimitZeroRestoresDefault` | Setting limit to 0 reverts to platform default |
| `testSetYearlyLimitEmitsEvent` | `YearlyLimitUpdated` event emitted with correct args |
| `testSetYearlyLimitOnlyAdmin` | Non-admin cannot call `setYearlyLimit` |
| `testCustomLimitBlocksExceedingAmount` | `increaseSpent` reverts above custom limit with typed error |
| `testCustomLimitAllowsExactAmount` | Spending exactly the custom limit succeeds |
| `testRemainingLimitDecreasesAfterSpend` | `remainingLimit` reflects current spend correctly |
| `testRemainingLimitIsZeroWhenAtLimit` | `remainingLimit` returns 0 at the cap |
| `testRemainingLimitTreatsExpiredCycleAsFullReset` | View treats expired cycle as zero spend without writing state |
| `testCanInvestReturnsFalseForUnregisteredUser` | Unregistered address always returns false |
| `testCanInvestReturnsTrueWithinLimit` | Returns true for registered user with capacity |
| `testCanInvestReturnsFalseWhenAtLimit` | Returns false when no remaining capacity |
| `testRemoveUserClearsRegistration` | `removeUser` sets `isRegistered` to false |
| `testRemoveUserBlocksIncreaseSpent` | `increaseSpent` reverts for removed user |
| `testRemoveUserEmitsEvent` | `UserRemoved` event emitted |
| `testOnlyAdminCanRemoveUser` | Non-admin cannot call `removeUser` |

---

### `test/unit/FreezeAndForcedTransfer.t.sol`

Tests for compliance escape hatches and secondary accounting correctness. Uses a full wired stack.

| Test group | Coverage |
|------------|---------|
| freeze / unfreeze | `isCompliant` blocked/restored, `canTransfer` blocked, events, admin-only access control |
| Frozen user secondary | Frozen holder cannot create sell orders; frozen buyer cannot execute |
| forcedTransfer | Happy path; frozen sender; recipient not compliant (reverts); insufficient balance (reverts); event; non-admin (reverts) |
| removeCompliantUser | Revokes compliance; blocks canTransfer; event; admin-only |
| reservedForSale accounting | Set on createSellOrder; released on cancel; released on full fill; decreased on partial fill |
| cancelSellOrder access control | Non-seller revert with `NotOrderSeller` |
| Secondary yearly limit exceeded | `InvestmentLimitExceeded` on executeSellOrder |
| exchangeTransfer authorization | Unauthorized caller reverts with `NotAuthorizedExchange` |
| Primary exchange USDC balance | Primary exchange never holds USDC after a buy |
| Secondary exchange residual USDC | Secondary exchange holds zero USDC after a fill |

---

### `test/fuzz/CapAndLimits.t.sol`

Fuzz tests (256 runs each) for the two most critical numeric invariants.

| Test | Invariant verified |
|------|--------------------|
| `testFuzz_yearlySpentBoundedByLimit` | After any `increaseSpent(amount)` with `amount ≤ limit`, `yearlySpent ≤ limit` |
| `testFuzz_increaseSpentRevertsAboveLimit` | Any `amount > limit` causes revert; `yearlySpent` unchanged |
| `testFuzz_totalSupplyBoundedByCap` | After any buy within cap and yearly limit, `totalSupply ≤ cap` |
| `testFuzz_buyRevertsIfWouldExceedCap` | Any buy that would push supply past cap reverts; no tokens minted |
| `testFuzz_quoteUSDCIsZeroForSmallInputs` | `quoteUSDC` returns 0 when product < 1e6; verifies rounding domain |

---

### `test/fork/AvalancheUSDCFork.t.sol`

Requires a live Avalanche C-Chain RPC. Excluded from the default `forge test` run unless `--fork-url` is provided.

| Test | What it checks |
|------|---------------|
| `testAvalancheUSDCExists` | USDC address has deployed bytecode on Avalanche C-Chain |
| `testAvalancheUSDCTotalSupplyCanBeRead` | `totalSupply()` is readable and > 0 |

---

## Remaining Coverage Gaps

The following areas still have no test coverage:

| Area | Risk |
|------|------|
| Fee of 0 bps | Zero fee edge case: seller receives full grossUSDC, feeRecipient receives nothing |
| Multi-token scenarios | Isolation between projects: one project's compliance/freeze should not affect another |
| `decreaseSpent` direct assertion | Only tested indirectly via secondary fill; no unit-level assertion of the exact decrement |
| Funding deadline exact boundary | Exact deadline timestamp (`block.timestamp == fundingDeadline`) not tested |
| `setExchange` revoke path | Revoking `EXCHANGE_ROLE` immediately prevents accounting writes — not exercised |
| Partial freeze + secondary combined | `frozenAmount + reservedForSale > balance` boundary not directly tested |

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
