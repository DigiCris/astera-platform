// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { AsteraComplianceManager } from "../compliance/AsteraComplianceManager.sol";
import { IAsteraComplianceManager } from "../interfaces/IAsteraComplianceManager.sol";

/// @title AsteraToken
/// @notice Regulated token representing permissioned participation in a tokenized asset.
/// @dev Six-decimal ERC20 that intentionally disables direct user-to-user transfers. The token
///      retains ERC20 interfaces for balance/supply/UX compatibility, but all secondary transfers
///      must route through an authorized exchange so compliance checks and yearly investment
///      accounting remain consistent. Simplified ERC-3643-inspired security token.
contract AsteraToken is ERC20, AccessControl {
    bytes32 public constant TOKEN_ADMIN_ROLE = keccak256("TOKEN_ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant FORCED_TRANSFER_ROLE = keccak256("FORCED_TRANSFER_ROLE");
    bytes32 public constant EXCHANGE_ROLE = keccak256("EXCHANGE_ROLE");

    uint8 private constant TOKEN_DECIMALS = 6;

    /// @notice Maximum token supply, in 6-decimal units. Immutable after deployment.
    uint256 public immutable cap;
    address public immutable identityRegistry;
    /// @notice Primary exchange address. Receives MINTER_ROLE, BURNER_ROLE, TOKEN_ADMIN_ROLE, and
    ///         EXCHANGE_ROLE at construction and is added to authorizedExchanges automatically.
    address public immutable exchange;
    /// @notice AsteraComplianceManager deployed by this token's constructor and permanently bound
    /// to it.
    address public immutable compliance;

    /// @notice Maps exchange addresses allowed to call exchangeTransfer.
    /// @dev The secondary exchange must be added here (via setAuthorizedExchange) to move tokens.
    ///      Kept as a mapping (rather than a single slot) to support future multi-exchange setups.
    mapping(address => bool) public authorizedExchanges;

    event ForcedTransfer(
        address indexed operator, address indexed from, address indexed to, uint256 amount
    );
    event ExchangeTransfer(
        address indexed exchange, address indexed from, address indexed to, uint256 amount
    );
    event ComplianceDeployed(address indexed compliance);

    error ZeroAddress();
    error CapExceeded(uint256 attemptedSupply, uint256 cap);
    error DirectTransfersDisabled();
    error ComplianceCheckFailed(address from, address to, uint256 amount);
    error NotAuthorizedExchange(address caller);

    /// @notice Deploys the token and atomically deploys its AsteraComplianceManager.
    /// @dev The compliance manager is deployed inline so the token and its rules are always
    ///      paired and cannot be mixed post-deployment. The primary exchange (`exchange_`)
    ///      receives all operational roles; the secondary exchange must be added separately via
    ///      setAuthorizedExchange (or automatically via AsteraPrimaryExchange.createProjectToken).
    /// @param cap_ Maximum token supply in 6-decimal units.
    /// @param softCap_ Minimum supply required to manually close the funding round (6-decimal
    /// units). @param fundingDeadline_ Unix timestamp after which primary purchases are blocked.
    /// @param genericDocumentHash_ keccak256 of the canonical legal document for this project.
    /// @param genericDocumentURI_ IPFS or HTTP URI of the canonical legal document.
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 cap_,
        address identityRegistry_,
        address exchange_,
        address treasury_,
        uint256 softCap_,
        uint256 fundingDeadline_,
        address admin_,
        bytes32 genericDocumentHash_,
        string memory genericDocumentURI_
    ) ERC20(name_, symbol_) {
        if (
            cap_ == 0 || identityRegistry_ == address(0) || exchange_ == address(0)
                || treasury_ == address(0) || admin_ == address(0)
        ) revert ZeroAddress();

        cap = cap_;
        identityRegistry = identityRegistry_;
        exchange = exchange_;

        AsteraComplianceManager complianceContract = new AsteraComplianceManager(
            identityRegistry_,
            address(this),
            treasury_,
            softCap_,
            fundingDeadline_,
            admin_,
            genericDocumentHash_,
            genericDocumentURI_
        );
        compliance = address(complianceContract);
        emit ComplianceDeployed(compliance);

        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(TOKEN_ADMIN_ROLE, admin_);
        _grantRole(FORCED_TRANSFER_ROLE, admin_);

        _grantRole(EXCHANGE_ROLE, exchange_);
        _grantRole(MINTER_ROLE, exchange_);
        _grantRole(BURNER_ROLE, exchange_);
        _grantRole(TOKEN_ADMIN_ROLE, exchange_);

        authorizedExchanges[exchange_] = true;
    }

    /// @notice Adds or removes an exchange address from the authorized set for exchangeTransfer.
    /// @dev Used to register the secondary exchange after token creation. If
    ///      AsteraPrimaryExchange.exchangeSecondary was set before createProjectToken, this is
    ///      called automatically. Otherwise it must be called manually for each existing token.
    function setAuthorizedExchange(address exchange_, bool enabled)
        external
        onlyRole(TOKEN_ADMIN_ROLE)
    {
        if (exchange_ == address(0)) revert ZeroAddress();
        authorizedExchanges[exchange_] = enabled;
    }

    function decimals() public pure override returns (uint8) {
        return TOKEN_DECIMALS;
    }

    /// @notice Mints tokens to a buyer. Normally called by AsteraPrimaryExchange.buy.
    /// @dev Validates cap and compliance before minting. If the mint brings totalSupply to cap and
    ///      funding is not already closed, triggers autoCompleteFunding on the compliance manager
    ///      to atomically open the secondary market.
    /// @param amount Amount in 6-decimal units. Primary market ratio is 1 USDC : 1 token unit.
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        uint256 newSupply = totalSupply() + amount;
        if (newSupply > cap) revert CapExceeded(newSupply, cap);
        if (!IAsteraComplianceManager(compliance).canTransfer(address(0), to, amount)) {
            revert ComplianceCheckFailed(address(0), to, amount);
        }
        _mint(to, amount);
        // Only trigger auto-close if not already completed (e.g. manually closed before cap was
        // reached). Without this guard, minting exactly to cap after a manual close would revert
        // via AlreadyCompleted.
        if (totalSupply() == cap && !IAsteraComplianceManager(compliance).fundingCompleted()) {
            IAsteraComplianceManager(compliance).autoCompleteFunding();
        }
    }

    /// @notice Burns tokens from an address. Operational/admin tool; no primary redeem flow is
    ///         implemented in this version.
    /// @dev Automatic refund/redeem flows are out of scope for the current MVP.
    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

    /// @notice Moves tokens between addresses on behalf of an authorized exchange.
    /// @dev Does not require an ERC20 allowance — the exchange is the regulated gateway and is
    ///      trusted to enforce compliance upstream. Runs canTransfer on the compliance manager
    ///      before executing the transfer.
    function exchangeTransfer(address from, address to, uint256 amount) external {
        if (!authorizedExchanges[msg.sender]) revert NotAuthorizedExchange(msg.sender);
        if (!IAsteraComplianceManager(compliance).canTransfer(from, to, amount)) {
            revert ComplianceCheckFailed(from, to, amount);
        }
        _transfer(from, to, amount);
        emit ExchangeTransfer(msg.sender, from, to, amount);
    }

    /// @notice Exceptional admin transfer for legal or operational corrections.
    /// @dev Bypasses sender freeze checks (canForcedTransfer allows frozen senders) but still
    ///      requires a compliant recipient. This path is auditable via the ForcedTransfer event
    ///      and must not be used for routine operations.
    function forcedTransfer(address from, address to, uint256 amount)
        external
        onlyRole(FORCED_TRANSFER_ROLE)
    {
        if (!IAsteraComplianceManager(compliance).canForcedTransfer(from, to, amount)) {
            revert ComplianceCheckFailed(from, to, amount);
        }
        _transfer(from, to, amount);
        emit ForcedTransfer(msg.sender, from, to, amount);
    }

    /// @notice Disables direct ERC20 transfers.
    /// @dev Astera tokens are permissioned market instruments. All secondary transfers must go
    ///      through an authorized exchange so compliance checks and yearly investment accounting
    ///      stay consistent.
    function transfer(address, uint256) public pure override returns (bool) {
        revert DirectTransfersDisabled();
    }

    /// @notice Disables direct ERC20 transferFrom.
    /// @dev Same rationale as transfer: free user-to-user transfers would break compliance
    ///      enforcement and annual investment accounting.
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert DirectTransfersDisabled();
    }
}
