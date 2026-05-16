# Invariants

Protocol invariants expected to hold at all times. Organized by test status and dependency type.

---

## Invariants with Existing Test Coverage

These invariants are exercised by the current test suite (`test/unit/`, `test/integration/`).

| # | Invariant | Where tested |
|---|-----------|-------------|
| I-01 | `totalSupply <= cap` | `testBuyRevertsIfAmountExceedsCap`, `testBuyAllowsExactCapAmount` |
| I-02 | Direct `transfer` always reverts with `DirectTransfersDisabled` | `testDirectTokenTransferIsDisabled` |
| I-03 | Direct `transferFrom` always reverts (same guard as `transfer`) | Covered by same override |
| I-04 | Primary buy reverts if `fundingCompleted == true` | `testCannotBuyAfterFundingCompleted`, `testBuyRevertsAfterAutoClose` |
| I-05 | Primary buy reverts if `block.timestamp > fundingDeadline` | `testBuyRevertsIfDeadlineExpired` |
| I-06 | `createSellOrder` reverts if `fundingCompleted == false` | `testSecondaryMarketRevertsIfFundingNotCompleted` |
| I-07 | `executeSellOrder` reverts if `grossUSDC == 0` | `testExecuteSellOrderRevertsIfGrossUSDCIsZero` |
| I-08 | Buying above the yearly limit reverts | `testCannotExceedLimit` (identity unit test) |
| I-09 | `signedDocumentHash` cannot be reused across wallets | `testSelfServiceRevertsIfSignedDocHashAlreadyUsed`, `testAdminRevertsOnDuplicateSignedDocHash` |
| I-10 | `adminAcceptTermsAndJoin` cannot bypass user signature — recovered signer must equal user | `testAdminCannotBypassSignatureValidation` |
| I-11 | `reservedForSale` blocks double-listing the same balance | `testCannotOverReserveSameTokensAcrossOrders` |
| I-12 | Auto-close fires when `totalSupply == cap` | `testBuyAtCapAutoCompletesFunding`, `testBuyAtCapEmitsFundingCompletedEventWithAutoCloseTrue` |
| I-13 | Manual close reverts if `fundingCompleted == true` | `testManualCloseIsIrreversible`, `testSetFundingCompletedRevertsAfterAutoClose` |
| I-14 | Manual close reverts if `totalSupply < softCap` | `testAdminCannotCloseIfSoftCapNotReached` |
| I-15 | Manual close reverts if `block.timestamp > fundingDeadline` | `testAdminCannotCloseIfDeadlineExpired` |
| I-16 | Partial freeze blocks sell orders exceeding available balance | `testPartialFreezeBlocksUnavailableBalanceOrder` |
| I-17 | `decreaseSpent` clamps to 0, never underflows | `testDecreaseSpentCannotUnderflow` |
| I-18 | Rolling year resets `yearlySpent` to 0 after 365 days | `testRollingYearResetUpdatesCycleStart` |

---

## Invariants Recommended for New Tests

These invariants are asserted by design and code review, but not exercised by any existing test.

| # | Invariant | Recommended test |
|---|-----------|-----------------|
| I-19 | Only addresses in `authorizedExchanges` can call `exchangeTransfer`; any other caller reverts with `NotAuthorizedExchange` | Unit test calling `exchangeTransfer` from an arbitrary address |
| I-20 | Primary USDC goes directly to treasury; the primary exchange never holds USDC balance from a buy | Assert `usdc.balanceOf(primaryExchange) == 0` after every buy |
| I-21 | Secondary market fee goes exclusively to `feeRecipient`; no USDC remains in secondary exchange after a fill | Assert residual balance is zero after each `executeSellOrder` |
| I-22 | `forcedTransfer` bypasses sender freeze but recipient must be compliant | Test with frozen sender and non-compliant recipient; verify revert on non-compliant recipient |
| I-23 | Buyer `yearlySpent` increases by exactly `grossUSDC` on secondary fill | Assert `identity.yearlySpent(buyer)` increment equals `grossUSDC` |
| I-24 | Seller `yearlySpent` decreases by exactly `grossUSDC` on secondary fill | Assert `identity.yearlySpent(seller)` decrement equals `grossUSDC` |
| I-25 | Seller cannot buy their own order (`CannotBuyOwnOrder`) | Test with seller as buyer |
| I-26 | `amountToBuy` cannot exceed `amountRemaining` on an order | Test partial fill exceeding remaining amount |
| I-27 | `adminForceCompliant` does not populate `agreements[user]` | Assert `agreements[user].signedDocumentHash == bytes32(0)` |
| I-28 | A fully frozen user fails `isCompliant` regardless of agreement state | Assert `isCompliant(frozenUser) == false` even after `acceptTermsAndJoin` |
| I-29 | `canTransfer(address(0), to, amount)` passes for mint if recipient is compliant | Verify mint succeeds for compliant users and fails for non-compliant |
| I-30 | `setFeeRecipient` with zero address reverts | Assert `ZeroAddress` revert |

---

## Invariants Depending on Off-Chain Assumptions

These invariants hold only if off-chain infrastructure behaves correctly. They cannot be fully verified on-chain.

| # | Invariant | Off-chain dependency |
|---|-----------|---------------------|
| I-31 | `signedDocumentHash` is unique per user | The off-chain document generation process must produce a unique PDF (and thus unique hash) for each investor |
| I-32 | `genericDocumentHash` matches the document shown to users at signing time | The frontend must display exactly the document whose `keccak256` is stored in `compliance.genericDocumentHash` |
| I-33 | KYC identity corresponds to the registered wallet | The off-chain KYC provider must verify that the wallet owner's identity was checked before admin calls `registerUser` |
| I-34 | On-chain events for sensitive operations are observed and acted upon | Backend/indexer must monitor `AdminForceCompliant`, `ForcedTransfer`, `Frozen`, `YearlySpentIncreased` in near real-time |
| I-35 | Signed PDFs are preserved and retrievable | Off-chain storage (IPFS or backend) must retain the documents whose hashes are stored in `agreements[user].signedDocumentHash` |
