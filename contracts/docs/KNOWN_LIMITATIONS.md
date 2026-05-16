# Known Limitations

This document separates intentional design constraints from operational risks and areas identified for future improvement. The goal is to ensure auditors do not confuse scope decisions with bugs.

---

## Intentional Design Constraints

These are explicit out-of-scope decisions for the current version, not implementation gaps.

| Limitation | Detail |
|-----------|--------|
| No automatic refund if soft cap is not reached | If `fundingDeadline` expires without `fundingCompleted`, no refund mechanism exists. Primary funds already sent to treasury are not recoverable on-chain. Refund/recovery flows are a future scope item. |
| No redeem or sellback against treasury | Token holders cannot redeem tokens back to the treasury for USDC. There is no burn-for-USDC flow. This is intentional for the MVP. |
| No ERC-3643 ONCHAINID | The identity model is inspired by ERC-3643 but does not implement the full standard: no `ONCHAINID` registry, no trusted issuers, no claim topics. Global KYC is a flat boolean flag (`_registered`) managed by the admin. |
| No upgradeability or proxy pattern | Contracts are not upgradeable. A bug or required change would require redeploying and migrating state. This is intentional to reduce proxy-related attack surface. |
| No timelock or multisig enforcement in contracts | Admin operations (freeze, force-compliant, forced transfer, parameter changes) take immediate effect. There is no on-chain delay or multi-party approval requirement. This is recommended to add for production. |
| No on-chain order book ordering by price | The order book is stored as an unordered array. There is no automatic price sorting. The UI/backend must handle order discovery and presentation. |
| No matching engine or AMM | Buyers must identify specific orders by ID. There is no automatic matching of buy and sell intent. |
| No cross-chain bridging | Tokens and USDC are native to Avalanche C-Chain. No bridge or cross-chain mechanism is implemented. |
| Off-chain document storage | Signed PDFs are stored off-chain (IPFS or backend). On-chain only stores `keccak256` hashes and EIP-712 signatures. Integrity depends on off-chain infrastructure. |
| No on-chain KYC provider | KYC is executed off-chain. The registry records only the outcome (registered/not registered). The admin is solely responsible for the accuracy of registration. |

---

## Operational Risks

These are known constraints that require careful operational management.

| Risk | Detail |
|------|--------|
| Deadline expiry without funding close permanently locks both markets | If `fundingDeadline` passes and `fundingCompleted` is not set, primary buys revert and secondary market never opens. There is no recovery path. The admin must monitor progress and call `setFundingCompleted` before the deadline if softCap is reached. |
| Admin escape hatches are not rate-limited or logged on-chain beyond events | `adminForceCompliant` and `forcedTransfer` are auditable via events but have no on-chain usage frequency limits. Operational monitoring of these events is required. |
| Treasury address is immutable after project creation | If the treasury address is wrong or compromised after deploy, all subsequent primary-sale USDC is lost. Verify the treasury address before calling `createProjectToken`. |
| `signedDocumentHash` uniqueness relies on off-chain process | The contract rejects reuse of `signedDocumentHash` across wallets. The off-chain document generation process must ensure each user receives a unique signed PDF and therefore a unique hash. |
| `feeRecipient` is a single address | Fees accumulate at one address. No splitting mechanism exists. If the fee recipient address is lost, fees become unrecoverable from that point. |
| Secondary exchange fee rate is set on primary exchange | `feeBps` is stored on `AsteraPrimaryExchange` and read by `AsteraSecondaryExchange`. Changing the fee affects all open orders immediately on their next fill. No per-order fee locking exists. |

---

## Future Improvements

These are areas that could be improved in future versions without changing the current audit surface.

| Area | Possible improvement |
|------|---------------------|
| Refund mechanism | On-chain refund flow if soft cap is not reached by deadline |
| Redeem/buyback | Token redemption against treasury for USDC |
| Timelock for admin actions | Delay on critical parameter changes (freeze, fee update, exchange changes) |
| Multisig enforcement | On-chain multi-party requirement for sensitive admin operations |
| Partial ERC-3643 compliance | Trusted issuers, claim topics, or ONCHAINID integration |
| Order book price discovery | On-chain ordering of sell orders by price for better UX |
| Yearly limit adjustment | Currently resets on cycle expiry; could add prorated or per-project limits |
| Multiple fee tiers | Per-project or per-token fee configuration instead of global |
| Event indexing schema | Standardized subgraph schema for reliable off-chain event indexing |
