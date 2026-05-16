// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAsteraComplianceManager {
    // ─── Immutable project data
    // ───────────────────────────────────────────

    function token() external view returns (address);
    function identityRegistry() external view returns (address);
    function treasury() external view returns (address);
    function softCap() external view returns (uint256);
    function fundingDeadline() external view returns (uint256);
    function fundingCompleted() external view returns (bool);

    /// @notice keccak256 of the canonical legal document PDF. Fixed at project creation.
    function genericDocumentHash() external view returns (bytes32);

    /// @notice IPFS/URI of the canonical legal document PDF. Fixed at project creation.
    function genericDocumentURI() external view returns (string memory);

    /// @notice EIP712 typehash for AgreementAcceptance.
    function AGREEMENT_TYPEHASH() external view returns (bytes32);

    /// @notice EIP712 domain separator for this compliance contract.
    function domainSeparator() external view returns (bytes32);

    // ─── Agreement state
    // ──────────────────────────────────────────────────

    /// @notice Returns true if a signed-document hash has already been consumed.
    function usedSignedDocumentHashes(bytes32 signedDocHash) external view returns (bool);

    // ─── Compliance views
    // ─────────────────────────────────────────────────

    function isCompliant(address user) external view returns (bool);
    function isFrozen(address user) external view returns (bool);
    function frozenAmount(address user) external view returns (uint256);
    function availableBalance(address user, uint256 balance) external view returns (uint256);
    function canTransfer(address from, address to, uint256 amount) external view returns (bool);
    function canForcedTransfer(address from, address to, uint256 amount)
        external
        view
        returns (bool);

    // ─── Term acceptance
    // ──────────────────────────────────────────────────

    /// @notice Self-service: caller signs EIP712 typed data and submits directly.
    function acceptTermsAndJoin(bytes32 signedDocumentHash, bytes calldata signature) external;

    /// @notice Admin path: operator submits a user's pre-collected EIP712 signature.
    function adminAcceptTermsAndJoin(
        address user,
        bytes32 signedDocumentHash,
        bytes calldata signature
    ) external;

    // ─── Admin compliance management
    // ──────────────────────────────────────

    /// @notice Emergency escape hatch. Does NOT generate an EIP712 agreement record.
    function adminForceCompliant(address user, string calldata reason) external;
    function removeCompliantUser(address user) external;
    function freeze(address user) external;
    function unfreeze(address user) external;
    function freezePartial(address user, uint256 amount) external;
    function setFundingCompleted() external;
    function autoCompleteFunding() external;
}
