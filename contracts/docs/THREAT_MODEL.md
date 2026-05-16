# Threat Model

Each threat is classified by its origin (on-chain, off-chain, or operational) and includes impact, current mitigation, and production recommendation.

---

## T-01: Admin Key Compromise

**Origin**: On-chain / operational

**Description**: Any address holding `DEFAULT_ADMIN_ROLE` or operational admin roles can register arbitrary wallets, force compliance, execute forced transfers, change fee recipients, change fee rates, freeze or unfreeze investors, and modify exchange authorization.

**Impact**: Complete protocol compromise. All investor funds and token movements could be redirected.

**Current mitigation**: None on-chain. Admin is a single EOA at deploy time. `GrantPlatformRoles` can add co-admins.

**Production recommendation**: Use a multisig (e.g., Gnosis Safe) with threshold >= 2/3. Implement a timelock for parameter changes. Limit who can receive admin role grants.

---

## T-02: Treasury Misconfiguration

**Origin**: On-chain (deploy-time)

**Description**: The `treasury` address is set at project creation and is immutable. If set incorrectly — wrong address, uncontrolled wallet, or compromised address — all primary-sale USDC flows to the wrong destination with no on-chain recovery mechanism.

**Impact**: Loss of all primary-sale proceeds for the affected project.

**Current mitigation**: No on-chain safeguard. The script prompts the operator to supply `FIDEICOMISO_WALLET` from env.

**Production recommendation**: Verify treasury address independently before `createProjectToken`. Consider a deployment review process requiring two-person confirmation for treasury configuration.

---

## T-03: KYC Backend Registering Unverified Wallets

**Origin**: Off-chain

**Description**: If the off-chain KYC process is bypassed, incomplete, or the backend is compromised, an admin could register an unverified wallet. That wallet would then pass all on-chain KYC checks.

**Impact**: Unverified users participate in regulated instruments, breaking compliance guarantees.

**Current mitigation**: None on-chain. The registry stores only the registration flag; it does not verify identity evidence.

**Production recommendation**: Enforce off-chain workflow controls. The KYC system and the admin key should be in separate trust domains. Log and audit all `UserRegistered` events.

---

## T-04: Frontend Showing Wrong Document at Signing

**Origin**: Off-chain

**Description**: If the frontend shows a document different from the one whose `keccak256` is stored in `genericDocumentHash`, the user signs an EIP-712 message they did not intend to sign.

**Impact**: The on-chain evidence binds the user's signature to a document they never saw. Regulatory validity of the signed agreement is undermined.

**Current mitigation**: The contract stores the hash and URI. A user could independently verify the hash matches the document before signing. In practice, most users rely on the frontend.

**Production recommendation**: The frontend must compute and display the document hash. Third-party audits of the frontend UI flow are required. Consider embedding the hash in the signing prompt.

---

## T-05: Loss of Signed PDFs Off-Chain

**Origin**: Off-chain

**Description**: On-chain evidence is limited to `signedDocumentHash + signature + timestamp`. If the off-chain backend fails to persist the actual signed PDFs, the on-chain hashes become unverifiable in a regulatory context.

**Impact**: Loss of documentary evidence for regulatory audits or legal proceedings.

**Current mitigation**: None on-chain. The URI stored in `genericDocumentURI` points to the canonical document but not to individual signed copies.

**Production recommendation**: Use content-addressed storage (IPFS) for canonical documents. Store individually signed PDFs in redundant, auditable storage. Back up signed PDF hashes against on-chain `agreements[user].signedDocumentHash`.

---

## T-06: Misuse of `adminForceCompliant`

**Origin**: On-chain / operational

**Description**: `adminForceCompliant` marks a user compliant without any EIP-712 agreement. If used routinely instead of the normal onboarding flow, users gain access without documentary evidence.

**Impact**: Investors participate without enforceable agreement records. Regulatory traceability is broken.

**Current mitigation**: A mandatory `reason` string is required and emitted in `AdminForceCompliant`. The function reverts with empty reason. Does not populate `agreements[user]`.

**Production recommendation**: Treat as an audit-trigger: any `AdminForceCompliant` event should automatically alert compliance staff and be reviewed within 24 hours. Consider adding on-chain rate-limiting or multisig requirement for this function.

---

## T-07: Misuse of `forcedTransfer`

**Origin**: On-chain / operational

**Description**: `forcedTransfer` moves tokens from any address (including frozen ones) without the owner's consent. If misused, it constitutes unauthorized seizure of investor assets.

**Impact**: Investor tokens moved without consent.

**Current mitigation**: `FORCED_TRANSFER_ROLE` required. Recipient must be compliant (`canForcedTransfer` check). Emits `ForcedTransfer` event.

**Production recommendation**: Require multisig approval before any `forcedTransfer`. Treat as an extraordinary action requiring written justification and regulatory authorization.

---

## T-08: Secondary Exchange Accounting Bugs (`yearlySpent`, `reservedForSale`)

**Origin**: On-chain

**Description**: The secondary exchange maintains two critical accounting state variables: `yearlySpent` in the identity registry and `reservedForSale` on the secondary exchange. An accounting bug could allow a buyer to exceed their yearly limit, a seller to double-list, or a seller's `yearlySpent` to be incorrectly reduced.

**Impact**: Protocol invariants broken; investors could bypass regulatory caps or over-commit token balances.

**Current mitigation**: `grossUSDC == 0` guard prevents free fills. `reservedForSale` is checked before order creation. `decreaseSpent` clamps to 0. Integration tests cover these paths.

**Production recommendation**: Implement invariant tests and fuzz tests for accounting paths. Separately audit the `executeSellOrder` accounting sequence.

---

## T-09: `reservedForSale` Inconsistency

**Origin**: On-chain

**Description**: `reservedForSale` can become inconsistent if a sell order is partially filled but the token balance later changes via `forcedTransfer` or `burn`. The reserved amount would still be tracked but the actual available balance would be lower.

**Impact**: Order execution could attempt to move more tokens than available.

**Current mitigation**: `exchangeTransfer` calls `canTransfer` which checks the actual balance via `availableBalance`. If available balance is insufficient, the transfer reverts.

**Production recommendation**: When using `forcedTransfer` or `burn` on a seller with open orders, cancel those orders first. Document this as an operational procedure.

---

## T-10: Fee Recipient Misconfiguration

**Origin**: On-chain / operational

**Description**: `feeRecipient` is a single mutable address controlled by `EXCHANGE_ADMIN_ROLE`. If set to zero, a compromised address, or an inaccessible wallet, fees are either burned, lost, or diverted.

**Impact**: Fee revenue lost or misdirected.

**Current mitigation**: `setFeeRecipient` reverts on zero address. Fee is only sent if `feeUSDC != 0` (zero fee rate sends nothing to recipient).

**Production recommendation**: Use a dedicated, multi-controlled fee recipient address. Monitor `FeeRecipientUpdated` events.

---

## T-11: USDC Approval Phishing (Primary and Secondary)

**Origin**: Off-chain (user-facing)

**Description**: Users must approve USDC to the exchange before buying or filling orders. A phishing frontend could trick users into approving to a malicious contract instead.

**Impact**: User USDC drained by malicious contract.

**Current mitigation**: None on-chain. The contracts themselves are not vulnerable; the risk is in the approval target.

**Production recommendation**: Publish and prominently display the canonical exchange addresses. Implement EIP-2612 permit-based approvals where possible to limit exposure window. Frontend should clearly show the approval target.

---

## T-12: Stale Indexer or Backend State

**Origin**: Off-chain

**Description**: The backend/indexer must track on-chain events to maintain off-chain state (open orders, compliance status, yearly limits). If the indexer falls behind, the UI may show stale state, leading to failed transactions or incorrect display.

**Impact**: Poor UX and potential failed transactions. Not a direct fund loss risk.

**Current mitigation**: None on-chain. Events are emitted for all state changes.

**Production recommendation**: Monitor indexer lag. Alert on any gap > 10 blocks. Implement a fallback read-from-chain mode for critical state queries (e.g., `fundingCompleted`, `isCompliant`).

---

## Summary by Origin

| Origin | Threats |
|--------|---------|
| On-chain | T-01 (admin key), T-02 (treasury), T-08 (accounting bugs), T-09 (reservedForSale), T-10 (fee recipient) |
| Off-chain | T-03 (KYC backend), T-04 (frontend document), T-05 (PDF storage), T-11 (USDC phishing), T-12 (stale indexer) |
| Operational | T-06 (adminForceCompliant misuse), T-07 (forcedTransfer misuse) |
