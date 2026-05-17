# Backend Services — Astera Finance

Off-chain services layer for regulated tokenization operations.

**Current demo:** Next.js + Supabase (see `frontend/app/`). There is no standalone backend server in this repository. The Next.js app handles KYC records, document metadata, and auth via Supabase.

**Production services (future):** the responsibilities below describe the full production backend surface planned for regulated deployments.

---

## Responsibilities

| Service | Description |
|---------|-------------|
| KYC orchestration | Off-chain identity verification with on-chain wallet registration |
| Document management | PDF generation, IPFS/storage upload, holographic signature capture, hash calculation |
| Event indexing | On-chain event ingestion for admin panels, compliance reporting, and audit exports |
| Admin APIs | KYC registration, project creation, compliance management, funding lifecycle operations |
| Compliance workflows | Freeze/unfreeze management, forced transfer monitoring, anomaly alerting |
| Notifications | Webhook delivery for key events: KYC completion, purchases, funding close, compliance changes |
| Audit logs | Off-chain record of sensitive admin actions paired with on-chain event evidence |

---

## API Surface (Reference)

```
POST   /api/kyc/start
GET    /api/kyc/status/:wallet
POST   /api/admin/users/register
GET    /api/projects
GET    /api/projects/:token
POST   /api/projects
POST   /api/documents/base
POST   /api/documents/signed
GET    /api/orders
GET    /api/events
GET    /api/admin/audit
```

---

## Key Events Indexed

From `AsteraIdentityRegistry`: `UserRegistered`, `UserRemoved`, `YearlyLimitUpdated`, `YearlyCycleReset`

From `AsteraPrimaryExchange`: `ProjectTokenCreated`, `BuyExecuted`, `FeeRecipientUpdated`

From `AsteraSecondaryExchange`: `SellOrderCreated`, `SellOrderFilled`, `SellOrderCancelled`, `FeeCollected`

From `AsteraComplianceManager`: `TermsAccepted`, `AdminForceCompliant`, `Frozen`, `Unfrozen`, `FundingCompleted`

---

## Critical Alerts

The following events require immediate operational monitoring:

- `AdminForceCompliant` — compliance override without EIP-712 evidence
- `ForcedTransfer` — administrative token movement bypassing sender freeze
- `CompliantRemoved` — user removed from project eligibility
- `Frozen` / `Unfrozen` / `PartialFreeze` — user restriction changes
- Funding deadline approaching or expired without completion
