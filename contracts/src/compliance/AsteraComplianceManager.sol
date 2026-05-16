// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { EIP712 } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { IAsteraIdentityRegistry } from "../interfaces/IAsteraIdentityRegistry.sol";
import { IAsteraToken } from "../interfaces/IAsteraToken.sol";

/// @title AsteraComplianceManager
/// @notice Per-project compliance module for a tokenized asset. Manages transfer eligibility,
///         freezes, funding lifecycle, and documentary evidence of investor agreement.
/// @dev Each AsteraToken deploys exactly one AsteraComplianceManager at construction time.
///      Platform-level KYC lives in AsteraIdentityRegistry; this contract handles project-specific
///      rules. The split allows a single KYC approval to cover multiple projects while each
///      instrument enforces its own terms acceptance, soft cap, deadline, and freeze controls.
contract AsteraComplianceManager is AccessControl, EIP712 {
    using ECDSA for bytes32;

    bytes32 public constant COMPLIANCE_ADMIN_ROLE = keccak256("COMPLIANCE_ADMIN_ROLE");

    /// @notice EIP712 typehash for the agreement acceptance struct.
    bytes32 public constant AGREEMENT_TYPEHASH = keccak256(
        "AgreementAcceptance(bytes32 genericDocumentHash,string genericDocumentURI,bytes32 signedDocumentHash,address user)"
    );

    /// @notice Token contract this compliance module is bound to. Immutable after deployment.
    address public immutable token;
    address public immutable identityRegistry;
    /// @notice Destination for primary-sale USDC proceeds. Represents the project trust/fideicomiso
    /// wallet.
    address public immutable treasury;
    /// @notice Minimum token supply (6-decimal units) required before funding can be manually
    /// closed.
    uint256 public immutable softCap;
    /// @notice Unix timestamp after which primary purchases are blocked and manual close reverts.
    uint256 public immutable fundingDeadline;

    /// @notice keccak256 of the canonical legal document PDF for this project. Fixed at creation.
    bytes32 public immutable genericDocumentHash;

    /// @notice IPFS/URI of the canonical legal document PDF for this project. Fixed at creation.
    string public genericDocumentURI;

    /// @notice True once funding is complete; gates secondary market activity.
    /// @dev Set either manually via setFundingCompleted (admin, requires softCap reached) or
    ///      automatically via autoCompleteFunding (token, when totalSupply reaches cap).
    bool public fundingCompleted;

    /// @notice On-chain evidence record for a user's acceptance of project terms.
    /// @dev The signed PDF is stored off-chain; only its hash and the EIP712 signature are kept
    /// here. Combines genericDocumentHash (base document set by admin) with signedDocumentHash
    /// (user's
    ///      individually signed PDF), binding both to the user's wallet via EIP712.
    struct SignedAgreement {
        bytes32 signedDocumentHash; // keccak256 of the holographically signed PDF
        bytes signature; // EIP712 signature produced by the user's wallet
        uint256 timestamp;
        bool selfService; // true if user submitted directly; false if admin relayed
    }

    mapping(address user => bool compliant) private _compliant;
    mapping(address user => bool frozen) private _frozen;
    /// @notice Amount of tokens (6-decimal units) locked for this user via partial freeze.
    mapping(address user => uint256 amount) public frozenAmount;

    /// @notice Stores signed agreement evidence per user. Not populated for adminForceCompliant
    /// paths.
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

    /// @notice Deploys the compliance module for a single tokenized project.
    /// @dev Initializes EIP712 domain ("AsteraCompliance", version "1") bound to this contract.
    ///      treasury_ receives all primary-sale USDC; no exchange contract custodies those funds.
    ///      genericDocumentHash_ and genericDocumentURI_ define the base legal document that all
    ///      investors sign — the user does not choose the document; the admin sets it at
    /// creation.
    /// @param softCap_ Minimum supply in 6-decimal token units required for manual funding close.
    /// @param fundingDeadline_ Unix timestamp; primary purchases and manual close revert after
    /// this. @param genericDocumentHash_ keccak256 of the canonical legal document distributed to
    /// investors.
    /// @param genericDocumentURI_ IPFS or HTTP URI where the canonical document can be retrieved.
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

    /// @notice Self-service onboarding: user submits their EIP712 signature directly.
    /// @dev The signed payload commits the caller's wallet to this project's genericDocumentHash,
    ///      genericDocumentURI, and the hash of their personally signed PDF. The PDF is kept
    ///      off-chain; on-chain evidence is signedDocumentHash + signature + timestamp stored in
    ///      agreements[user].
    /// @param signedDocumentHash keccak256 of the holographically signed PDF unique to this user.
    /// @param signature EIP712 signature over AgreementAcceptance produced by msg.sender's wallet.
    function acceptTermsAndJoin(bytes32 signedDocumentHash, bytes calldata signature) external {
        _acceptTerms(msg.sender, signedDocumentHash, signature, true);
    }

    /// @notice Admin-relayed onboarding: operator submits a user's pre-collected EIP712 signature.
    /// @dev Allows the backend to pay gas on behalf of the user. The user's wallet must still be
    /// the EIP712 signer — the admin cannot bypass signature validation or substitute a different
    ///      signer. msg.sender is the relaying operator; the recovered signer must equal user.
    /// @param user Wallet address that produced the signature off-chain.
    /// @param signedDocumentHash keccak256 of the holographically signed PDF unique to this user.
    /// @param signature EIP712 signature over AgreementAcceptance produced by user's wallet.
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

    /// @notice Marks a user compliant without storing a signed agreement.
    /// @dev Emergency/admin-only escape hatch for exceptional operational cases (e.g. technical
    ///      failure during normal onboarding). Does not populate agreements[user]. Emits an
    /// auditable event with a mandatory reason string. Must not be used as the standard onboarding
    /// path.
    /// @param reason Human-readable justification required for audit traceability.
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

    /// @notice Revokes project-level compliance for a user (e.g. investor request or regulatory
    /// action). @dev Does not affect the user's global KYC registration in AsteraIdentityRegistry.
    function removeCompliantUser(address user) external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        _compliant[user] = false;
        emit CompliantRemoved(user);
    }

    /// @notice Fully freezes a user, blocking all token movements for this project.
    /// @dev isCompliant returns false while frozen regardless of agreement state. Used for
    ///      regulatory holds that must block the entire balance.
    function freeze(address user) external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        _frozen[user] = true;
        emit Frozen(user);
    }

    /// @notice Lifts a full freeze, restoring normal compliance status if other conditions are met.
    function unfreeze(address user) external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        _frozen[user] = false;
        emit Unfrozen(user);
    }

    /// @notice Locks a specific token amount, preventing that portion from being transferred or
    /// sold. @dev Does not block the remaining available balance. Used for regulatory holds on a
    /// subset of
    ///      holdings without fully freezing the account.
    /// @param amount Amount in 6-decimal token units to lock.
    function freezePartial(address user, uint256 amount) external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        frozenAmount[user] = amount;
        emit PartialFreeze(user, amount);
    }

    // ─── Funding lifecycle
    // ────────────────────────────────────────────────

    /// @notice Manual close: irreversibly enables secondary market if softCap reached and deadline
    /// not expired.
    /// @dev If the deadline expires without this call and without cap-triggered auto-close, the
    ///      secondary market never opens. There is no automatic refund mechanism in this version;
    ///      refund/redeem flows are out of scope for the current MVP.
    function setFundingCompleted() external onlyRole(COMPLIANCE_ADMIN_ROLE) {
        if (fundingCompleted) revert AlreadyCompleted();
        if (block.timestamp > fundingDeadline) revert DeadlineExpired();

        uint256 supply = IAsteraToken(token).totalSupply();
        if (supply < softCap) revert SoftCapNotReached(supply, softCap);

        fundingCompleted = true;
        emit FundingCompleted(token, supply, softCap, false);
    }

    /// @notice Auto-close triggered by the token when totalSupply reaches maxSupply (cap).
    /// @dev Only callable by the bound token contract to enforce atomic close on the final mint.
    ///      Skips the softCap check because reaching cap implies softCap was already exceeded.
    function autoCompleteFunding() external {
        if (msg.sender != token) revert UnauthorizedAutoClose();
        if (fundingCompleted) revert AlreadyCompleted();

        uint256 supply = IAsteraToken(token).totalSupply();
        fundingCompleted = true;
        emit FundingCompleted(token, supply, softCap, true);
    }

    // ─── Views
    // ────────────────────────────────────────────────────────────

    /// @notice Returns true only if the user is KYC-registered, project-compliant, and not fully
    /// frozen.
    function isCompliant(address user) public view returns (bool) {
        if (user == address(0) || !_compliant[user] || _frozen[user]) return false;
        return IAsteraIdentityRegistry(identityRegistry).isRegistered(user);
    }

    function isFrozen(address user) external view returns (bool) {
        return _frozen[user];
    }

    /// @notice Returns the token balance available for transfer or sell-order reservation, after
    ///         subtracting partial freeze.
    /// @param balance The user's current token balance (passed in to avoid a redundant external
    /// call).
    function availableBalance(address user, uint256 balance) public view returns (uint256) {
        uint256 frozen = frozenAmount[user];
        return frozen >= balance ? 0 : balance - frozen;
    }

    /// @notice Standard compliance validation for mint and secondary exchange transfers.
    /// @dev address(0) for `from` signals a mint operation (no sender checks apply).
    ///      address(0) for `to` signals a sell-order reservation check (validates only the seller's
    ///      available balance and compliance, without a recipient).
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
    /// @dev Recipient must still be fully compliant. Intended for legal/operational corrections
    /// only.
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
