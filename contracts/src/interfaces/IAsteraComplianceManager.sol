// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IAsteraComplianceManager
/// @notice Interface for the per-project compliance module deployed alongside each AsteraToken.
/// @dev Consumed by AsteraToken (mint/transfer checks), AsteraPrimaryExchange (buy checks), and
///      AsteraSecondaryExchange (order and fill checks). One compliance manager per token; the
///      instance address is stored in AsteraToken.compliance (immutable).
interface IAsteraComplianceManager {
    // ─── Immutable project data
    // ───────────────────────────────────────────

    /// @notice The AsteraToken this compliance manager is bound to.
    function token() external view returns (address);
    function identityRegistry() external view returns (address);
    /// @notice Project trust/fideicomiso wallet that receives all primary-sale USDC.
    function treasury() external view returns (address);
    /// @notice Minimum token supply (6-decimal units) required for manual funding close.
    function softCap() external view returns (uint256);
    /// @notice Unix timestamp after which primary purchases and manual funding close revert.
    function fundingDeadline() external view returns (uint256);
    /// @notice True once funding is closed; gates secondary market activity.
    function fundingCompleted() external view returns (bool);

    /// @notice keccak256 of the canonical legal document PDF. Fixed at project creation.
    function genericDocumentHash() external view returns (bytes32);

    /// @notice IPFS/URI of the canonical legal document PDF. Fixed at project creation.
    function genericDocumentURI() external view returns (string memory);

    /// @notice EIP712 typehash for AgreementAcceptance.
    function AGREEMENT_TYPEHASH() external view returns (bytes32);

    /// @notice EIP712 domain separator for this compliance contract. Used for off-chain signing.
    function domainSeparator() external view returns (bytes32);

    // ─── Agreement state
    // ──────────────────────────────────────────────────

    /// @notice Returns true if a signed-document hash has already been consumed by another wallet.
    function usedSignedDocumentHashes(bytes32 signedDocHash) external view returns (bool);

    // ─── Compliance views
    // ─────────────────────────────────────────────────

    /// @notice True if the user is KYC-registered, project-compliant, and not fully frozen.
    function isCompliant(address user) external view returns (bool);
    function isFrozen(address user) external view returns (bool);
    /// @notice Tokens locked via partial freeze, in 6-decimal units.
    function frozenAmount(address user) external view returns (uint256);
    /// @notice Returns available balance after subtracting partial freeze.
    function availableBalance(address user, uint256 balance) external view returns (uint256);
    /// @notice Standard check for mint (from == address(0)) and exchange transfers.
    function canTransfer(address from, address to, uint256 amount) external view returns (bool);
    /// @notice Forced-transfer check; sender freeze is bypassed, recipient must be compliant.
    function canForcedTransfer(address from, address to, uint256 amount)
        external
        view
        returns (bool);

    // ─── Term acceptance
    // ──────────────────────────────────────────────────

    /// @notice Self-service: caller submits their EIP712 signature directly.
    /// @dev On-chain evidence stored in agreements[user]. PDF kept off-chain.
    function acceptTermsAndJoin(bytes32 signedDocumentHash, bytes calldata signature) external;

    /// @notice Admin-relayed: operator submits a user's pre-collected EIP712 signature.
    /// @dev Backend pays gas; user's wallet must still be the EIP712 signer.
    function adminAcceptTermsAndJoin(
        address user,
        bytes32 signedDocumentHash,
        bytes calldata signature
    ) external;

    // ─── Admin compliance management
    // ──────────────────────────────────────

    /// @notice Emergency escape hatch. Does NOT generate an EIP712 agreement record.
    /// @dev Emits AdminForceCompliant with mandatory reason for audit traceability.
    ///      Must not be used as the standard onboarding path.
    function adminForceCompliant(address user, string calldata reason) external;
    /// @notice Revokes project-level compliance. Does not affect global KYC registration.
    function removeCompliantUser(address user) external;
    /// @notice Fully blocks all token movements for this user on this project.
    function freeze(address user) external;
    function unfreeze(address user) external;
    /// @notice Locks a specific token amount without blocking the remaining balance.
    function freezePartial(address user, uint256 amount) external;
    /// @notice Manual funding close. Requires softCap reached and deadline not expired.
    function setFundingCompleted() external;
    /// @notice Automatic funding close triggered by AsteraToken when totalSupply reaches cap.
    function autoCompleteFunding() external;
}
