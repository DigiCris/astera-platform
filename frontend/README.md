# Frontend — Astera Finance

## Structure

| Directory | Purpose |
|-----------|---------|
| `landing/` | Institutional and commercial presentation for PSAVs, fintechs, and enterprise operators |
| `app/` | Reference implementation of a regulated tokenized marketplace built on Astera infrastructure |

## Landing

The landing site (`landing/index.html`) presents Astera as B2B regulated tokenization infrastructure. In Spanish for LATAM institutional audiences.

Objectives: explain the problem, demonstrate the architecture, present the B2B value proposition, and direct prospects to the demo and meeting booking.

## App (Reference Implementation)

The app (`app/`) is a Scaffold-ETH based reference implementation showing how a compliant tokenized asset marketplace can be built on Astera.

It demonstrates end-to-end: wallet connection, KYC status, project listing, EIP-712 document acceptance, primary purchase, portfolio view, secondary order creation and execution.

**The app is a reference implementation, not the product.** The product is the underlying infrastructure and regulatory rails.

## Responsibilities

- User onboarding and KYC status display
- EIP-712 document acceptance flow
- Token purchase flow (primary and secondary)
- Investor dashboard and portfolio
- Compliance status visualization
- Wallet interactions via USDC approval and exchange calls
