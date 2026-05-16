// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { EIP712 } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { IAsteraIdentityRegistry } from "../interfaces/IAsteraIdentityRegistry.sol";
import { IAsteraToken } from "../interfaces/IAsteraToken.sol";

/// @title AsteraComplianceManager
/// @notice Enforces compliance rules, transfer restrictions, freezes, limits, and market
/// eligibility. Per-project compliance module for the Astera tokenization flow.
contract AsteraComplianceManager is AccessControl, EIP712 {
    using ECDSA for bytes32;

    bytes32 public constant COMPLIANCE_ADMIN_ROLE = keccak256("COMPLIANCE_ADMIN_ROLE");

    /// @notice EIP712 typehash for the agreement acceptance struct.
    bytes32 public constant AGREEMENT_TYPEHASH = keccak256(
        "AgreementAcceptance(bytes32 genericDocumentHash,string genericDocumentURI,bytes32 signedDocumentHash,address user)"
    );

    address public immutable token;
    address public immutable identityRegistry;
    address public immutable treasury;
    uint256 public immutable softCap;
    uint256 public immutable fundingDeadline;

    /// @notice keccak256 of the canonical legal document PDF for this project. Fixed at creation.
    bytes32 public immutable genericDocumentHash;

    /// @notice IPFS/URI of the canonical legal document PDF for this project. Fixed at creation.
    string public genericDocumentURI;

    bool public fundingCompleted;

    struct SignedAgreement {
        bytes32 signedDocumentHash;
        bytes signature;
        uint256 timestamp;
        bool selfService;
    }

    mapping(address user => bool compliant) private _compliant;
    mapping(address user => bool frozen) private _frozen;
    mapping(address user => uint256 amount) public frozenAmount;

    mapping(address user => SignedAgreement) public agreements;

    /// @notice Tracks consumed signed-document hashes to prevent reuse across users.
    mapping(bytes32 signedDocHash => bool used) public usedSignedDocumentHashes;

    event CompliantRemoved(address indexed user);
    event Frozen(address indexed user);
    event Unfrozen(address indexed user);
    event PartialFreeze(address indexed user, uint256 amount);
    event FundingCompleted(
        address indexed token, uint256 totalSupply, uint256 softCap, bool autoClose
    );

    event AdminForceCompliant(
        address indexed user, address indexed admin, string reason, uint256 timestamp
    );

    event TermsAccepted(
        address indexed user,
        bytes32 indexed genericDocumentHash,
        bytes32 indexed signedDocumentHash,
        string genericDocumentURI,
        bytes signature,
        uint256 timestamp,
        bool selfService
    );

    error ZeroAddress();
    error InvalidParams();
    error AlreadyCompleted();
    error SoftCapNotReached(uint256 totalSupply, uint256 softCap);
    error DeadlineExpired();
    error DeadlineInPast();
    error UnauthorizedAutoClose();
    error UserNotRegistered(address user);
    error AlreadyCompliant();
    error InvalidSignature();
    error DocumentAlreadyUsed();
    error InvalidDocumentHash();

    constructor(
        address identityRegistry_,
        address token_,
        address treasury_,
        uint256 softCap_,
        uint256 fundingDeadline_,
        address admin_,
        bytes32 genericDocumentHash_,
        string memory genericDocumentURI_
    ) EIP712("AsteraCompliance", "1") {
        if (
            identityRegistry_ == address(0) || token_ == address(0) || treasury_ == address(0)
                || admin_ == address(0)
        ) revert ZeroAddress();
        if (softCap_ == 0) revert InvalidParams();
        if (fundingDeadline_ <= block.timestamp) revert DeadlineInPast();
        if (genericDocumentHash_ == bytes32(0)) revert InvalidParams();
        if (bytes(genericDocumentURI_).length == 0) revert InvalidParams();

        identityRegistry = identityRegistry_;
        token = token_;
        treasury = treasury_;
        softCap = softCap_;
        fundingDeadline = fundingDeadline_;
        genericDocumentHash = genericDocumentHash_;
        genericDocumentURI = genericDocumentURI_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(COMPLIANCE_ADMIN_ROLE, admin_);
    }

    // ─── EIP712 term acceptance
    // ───────────────────────────────────────────

    /// @notice Self-service: user signs EIP712 typed data and submits on-chain.
    function acceptTermsAndJoin(bytes32 signedDocumentHash, bytes calldata signature) external {
        _acceptTerms(msg.sender, signedDocumentHash, signature, true);
    }

    /// @notice Admin path: operator submits the user's pre-collected EIP712 signature.
    /// @dev Admin cannot bypass signature validation; signer must equal user.
    function adminAcceptTermsAndJoin(
        address user,
        bytes32 signedDocumentHash,
        bytes calldata signature
    ) external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        _acceptTerms(user, signedDocumentHash, signature, false);
    }

    function _acceptTerms(
        address user,
        bytes32 signedDocumentHash,
        bytes memory signature,
        bool selfService
    ) internal {
        if (signedDocumentHash == bytes32(0)) revert InvalidDocumentHash();
        if (!IAsteraIdentityRegistry(identityRegistry).isRegistered(user)) {
            revert UserNotRegistered(user);
        }
        if (_compliant[user]) revert AlreadyCompliant();
        if (usedSignedDocumentHashes[signedDocumentHash]) revert DocumentAlreadyUsed();

        bytes32 structHash = keccak256(
            abi.encode(
                AGREEMENT_TYPEHASH,
                genericDocumentHash,
                keccak256(bytes(genericDocumentURI)),
                signedDocumentHash,
                user
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(digest, signature);
        if (signer != user) revert InvalidSignature();

        agreements[user] = SignedAgreement({
            signedDocumentHash: signedDocumentHash,
            signature: signature,
            timestamp: block.timestamp,
            selfService: selfService
        });

        usedSignedDocumentHashes[signedDocumentHash] = true;
        _compliant[user] = true;

        emit TermsAccepted(
            user,
            genericDocumentHash,
            signedDocumentHash,
            genericDocumentURI,
            signature,
            block.timestamp,
            selfService
        );
    }

    /// @notice Returns the EIP712 domain separator for off-chain signing and test verification.
    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    // ─── Admin compliance management
    // ──────────────────────────────────────

    /// @notice Emergency escape hatch for operational recovery. Does NOT generate an EIP712 record.
    /// @dev Leaves an explicit on-chain event for audit traceability.
    function adminForceCompliant(address user, string calldata reason)
        external
        onlyRole(COMPLIANCE_ADMIN_ROLE)
    {
        if (user == address(0)) revert ZeroAddress();
        if (!IAsteraIdentityRegistry(identityRegistry).isRegistered(user)) {
            revert UserNotRegistered(user);
        }
        if (bytes(reason).length == 0) revert InvalidParams();
        if (_compliant[user]) revert AlreadyCompliant();

        _compliant[user] = true;

        emit AdminForceCompliant(user, msg.sender, reason, block.timestamp);
    }

    function removeCompliantUser(address user) external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        _compliant[user] = false;
        emit CompliantRemoved(user);
    }

    function freeze(address user) external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        _frozen[user] = true;
        emit Frozen(user);
    }

    function unfreeze(address user) external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        _frozen[user] = false;
        emit Unfrozen(user);
    }

    function freezePartial(address user, uint256 amount) external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        frozenAmount[user] = amount;
        emit PartialFreeze(user, amount);
    }

    // ─── Funding lifecycle
    // ────────────────────────────────────────────────

    /// @notice Manual close: irreversibly enables secondary market if softCap reached and deadline
    /// not expired.
    function setFundingCompleted() external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        if (fundingCompleted) revert AlreadyCompleted();
        if (block.timestamp > fundingDeadline) revert DeadlineExpired();

        uint256 supply = IAsteraToken(token).totalSupply();
        if (supply < softCap) revert SoftCapNotReached(supply, softCap);

        fundingCompleted = true;
        emit FundingCompleted(token, supply, softCap, false);
    }

    /// @notice Auto-close triggered by the token when totalSupply reaches maxSupply (cap).
    function autoCompleteFunding() external {
        if (msg.sender != token) revert UnauthorizedAutoClose();
        if (fundingCompleted) revert AlreadyCompleted();

        uint256 supply = IAsteraToken(token).totalSupply();
        fundingCompleted = true;
        emit FundingCompleted(token, supply, softCap, true);
    }

    // ─── Views
    // ────────────────────────────────────────────────────────────

    function isCompliant(address user) public view returns (bool) {
        if (user == address(0) || !_compliant[user] || _frozen[user]) return false;
        return IAsteraIdentityRegistry(identityRegistry).isRegistered(user);
    }

    function isFrozen(address user) external view returns (bool) {
        return _frozen[user];
    }

    function availableBalance(address user, uint256 balance) public view returns (uint256) {
        uint256 frozen = frozenAmount[user];
        return frozen >= balance ? 0 : balance - frozen;
    }

    /// @notice Standard compliance validation for mint/secondary exchange transfers.
    /// @dev address(0) for `from` means mint; address(0) for `to` means sell-order reservation
    /// check.
    function canTransfer(address from, address to, uint256 amount) external view returns (bool) {
        if (amount == 0) return false;

        if (from != address(0)) {
            if (!isCompliant(from)) return false;
            uint256 balance = IAsteraToken(token).balanceOf(from);
            if (availableBalance(from, balance) < amount) return false;
        }

        if (to != address(0)) {
            if (!isCompliant(to)) return false;
        }

        return true;
    }

    /// @notice Forced transfer check. Sender freezes are intentionally bypassed for admin actions.
    function canForcedTransfer(address from, address to, uint256 amount)
        external
        view
        returns (bool)
    {
        if (from == address(0) || to == address(0) || amount == 0) return false;
        if (!isCompliant(to)) return false;
        return IAsteraToken(token).balanceOf(from) >= amount;
    }

    function _requireRegistered(address user) internal view {
        if (user == address(0)) revert ZeroAddress();
        if (!IAsteraIdentityRegistry(identityRegistry).isRegistered(user)) {
            revert UserNotRegistered(user);
        }
    }
}
