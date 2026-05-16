// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { IAsteraIdentityRegistry } from "../interfaces/IAsteraIdentityRegistry.sol";
import { IAsteraComplianceManager } from "../interfaces/IAsteraComplianceManager.sol";
import { IAsteraToken } from "../interfaces/IAsteraToken.sol";
import { AsteraToken } from "../token/AsteraToken.sol";

/// @title AsteraPrimaryExchange
/// @notice Handles compliant primary issuance: project creation, USDC-to-token purchases, and
///         regulated funding flows for tokenized assets.
/// @dev Secondary market is handled by AsteraSecondaryExchange. The separation keeps each
///      contract's bytecode within manageable size and provides clear operational boundaries:
///      this contract is for initial issuance only; it never custodies primary-sale proceeds.
///      USDC is transferred directly to the project treasury on every buy.
contract AsteraPrimaryExchange is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant EXCHANGE_ADMIN_ROLE = keccak256("EXCHANGE_ADMIN_ROLE");

    uint256 public constant BPS_DENOMINATOR = 10_000;

    /// @notice Avalanche C-Chain USDC contract. All primary purchases are denominated in USDC.
    IERC20 public immutable usdc;
    IAsteraIdentityRegistry public immutable identityRegistry;

    address public feeRecipient;
    /// @notice Fee in basis points applied by the secondary exchange on each secondary trade.
    /// @dev Stored here so AsteraSecondaryExchange can read a single authoritative fee config.
    uint256 public feeBps = 100; // 1%

    /// @notice Address of the deployed AsteraSecondaryExchange.
    /// @dev Must be set via setExchangeSecondary before calling createProjectToken if automatic
    ///      secondary exchange authorization on new tokens is desired. Tokens created before this
    ///      is set require manual authorization via AsteraToken.setAuthorizedExchange.
    address public exchangeSecondary;

    /// @notice Tracks tokens created through this exchange.
    mapping(address token => bool supported) public supportedTokens;
    /// @notice Maps each supported token to its AsteraComplianceManager.
    mapping(address token => address compliance) public complianceOf;
    /// @notice Maximum supply for each supported token, in 6-decimal units.
    mapping(address token => uint256 cap) public tokenCap;

    event ProjectTokenCreated(
        address indexed token,
        address indexed compliance,
        address indexed treasury,
        uint256 maxSupply,
        uint256 softCap,
        uint256 fundingDeadline,
        bytes32 genericDocumentHash,
        string genericDocumentURI
    );
    event FeeRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);
    event FeeBpsUpdated(uint256 oldFeeBps, uint256 newFeeBps);
    event ExchangeSecondaryUpdated(address indexed oldSecondary, address indexed newSecondary);

    event BuyExecuted(
        address indexed buyer,
        address indexed token,
        address indexed treasury,
        uint256 usdcAmount,
        uint256 tokenAmount
    );

    error ZeroAddress();
    error ZeroAmount();
    error InvalidFee();
    error InvalidDocumentParams();
    error InvalidCaps();
    error DeadlineInPast();
    error UnsupportedToken(address token);
    error FundingAlreadyCompleted(address token);
    error FundingDeadlineExpired(address token);
    error CapExceeded(uint256 attemptedSupply, uint256 cap);
    error IdentityCheckFailed(address user);
    error ComplianceCheckFailed(address token, address from, address to, uint256 amount);
    error InvestmentLimitExceeded(address user, uint256 amount);

    /// @notice Deploys the primary exchange with USDC, identity registry, fee recipient, and admin.
    constructor(address usdc_, address identityRegistry_, address feeRecipient_, address admin_) {
        if (
            usdc_ == address(0) || identityRegistry_ == address(0) || feeRecipient_ == address(0)
                || admin_ == address(0)
        ) revert ZeroAddress();

        usdc = IERC20(usdc_);
        identityRegistry = IAsteraIdentityRegistry(identityRegistry_);
        feeRecipient = feeRecipient_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(EXCHANGE_ADMIN_ROLE, admin_);
    }

    /// @notice Sets the secondary exchange address used for auto-authorization on new tokens.
    /// @dev Call this before createProjectToken to have new tokens automatically grant
    ///      exchangeTransfer permission to the secondary exchange. Changing this after token
    ///      creation does not retroactively authorize existing tokens; those require a separate
    ///      AsteraToken.setAuthorizedExchange call per token.
    function setExchangeSecondary(address secondary_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (secondary_ == address(0)) revert ZeroAddress();
        address old = exchangeSecondary;
        exchangeSecondary = secondary_;
        emit ExchangeSecondaryUpdated(old, secondary_);
    }

    /// @notice Deploys a new AsteraToken + AsteraComplianceManager pair and registers it
    /// atomically. Also authorizes AsteraSecondaryExchange on the new token if set.
    /// @dev The caller (msg.sender) becomes the COMPLIANCE_ADMIN and TOKEN_ADMIN of the new token.
    ///      softCap must be > 0 and <= maxSupply. Both maxSupply and softCap are in 6-decimal
    /// units. The genericDocumentHash and URI define the base legal document investors sign; they
    /// are
    ///      fixed at creation and cannot be changed after deployment.
    /// @param maxSupply Maximum token supply in 6-decimal units (= hard cap for the funding round).
    /// @param softCap Minimum supply in 6-decimal units required to manually close the funding
    /// round. @param fundingDeadline Unix timestamp after which no more primary purchases are
    /// accepted.
    /// @param treasury Recipient of all primary-sale USDC proceeds (trust/fideicomiso wallet).
    /// @param genericDocumentHash keccak256 of the canonical legal document PDF for this project.
    /// @param genericDocumentURI IPFS or HTTP URI where the canonical document can be retrieved.
    function createProjectToken(
        string calldata name,
        string calldata symbol,
        uint256 maxSupply,
        uint256 softCap,
        uint256 fundingDeadline,
        address treasury,
        bytes32 genericDocumentHash,
        string calldata genericDocumentURI
    ) external onlyRole(EXCHANGE_ADMIN_ROLE) returns (address tokenAddr, address complianceAddr) {
        if (treasury == address(0)) revert ZeroAddress();
        if (maxSupply == 0 || softCap == 0) revert ZeroAmount();
        if (softCap > maxSupply) revert InvalidCaps();
        if (fundingDeadline <= block.timestamp) revert DeadlineInPast();
        if (genericDocumentHash == bytes32(0)) revert InvalidDocumentParams();
        if (bytes(genericDocumentURI).length == 0) revert InvalidDocumentParams();

        AsteraToken newToken = new AsteraToken(
            name,
            symbol,
            maxSupply,
            address(identityRegistry),
            address(this),
            treasury,
            softCap,
            fundingDeadline,
            msg.sender,
            genericDocumentHash,
            genericDocumentURI
        );

        tokenAddr = address(newToken);
        complianceAddr = newToken.compliance();

        supportedTokens[tokenAddr] = true;
        complianceOf[tokenAddr] = complianceAddr;
        tokenCap[tokenAddr] = maxSupply;

        if (exchangeSecondary != address(0)) {
            newToken.setAuthorizedExchange(exchangeSecondary, true);
        }

        emit ProjectTokenCreated(
            tokenAddr,
            complianceAddr,
            treasury,
            maxSupply,
            softCap,
            fundingDeadline,
            genericDocumentHash,
            genericDocumentURI
        );
    }

    function setFeeRecipient(address newRecipient) external onlyRole(EXCHANGE_ADMIN_ROLE) {
        if (newRecipient == address(0)) revert ZeroAddress();
        address oldRecipient = feeRecipient;
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(oldRecipient, newRecipient);
    }

    /// @notice Updates the secondary market fee rate.
    /// @dev Hard-capped at 10% (1000 bps) as an on-chain safety bound. Fee applies to secondary
    ///      trades only; primary purchases have no fee.
    /// @param newFeeBps New fee in basis points (100 = 1%).
    function setFeeBps(uint256 newFeeBps) external onlyRole(EXCHANGE_ADMIN_ROLE) {
        if (newFeeBps > 1000) revert InvalidFee(); // hard cap at 10% for safety
        uint256 oldFee = feeBps;
        feeBps = newFeeBps;
        emit FeeBpsUpdated(oldFee, newFeeBps);
    }

    /// @notice Executes a primary-market purchase for a supported project token.
    /// @dev USDC is transferred directly to the project treasury; this exchange does not custody
    ///      primary-sale proceeds. The minted token amount equals the USDC amount because both
    ///      assets use 6 decimals (1 USDC unit = 1 token unit). Reverts if:
    ///      - token is unsupported,
    ///      - funding is already completed or deadline has passed,
    ///      - buyer is not KYC-registered,
    ///      - purchase would exceed the token cap,
    ///      - buyer would exceed their annual investment limit,
    ///      - buyer is not compliant for this project.
    /// @param token Address of the AsteraToken to purchase.
    /// @param amount Amount in 6-decimal units. Equals both the USDC cost and the tokens received.
    function buy(address token, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        _requireSupported(token);

        address buyer = msg.sender;
        address compliance = complianceOf[token];
        IAsteraComplianceManager complianceContract = IAsteraComplianceManager(compliance);

        if (complianceContract.fundingCompleted()) revert FundingAlreadyCompleted(token);
        if (block.timestamp > complianceContract.fundingDeadline()) {
            revert FundingDeadlineExpired(token);
        }
        if (!identityRegistry.isRegistered(buyer)) revert IdentityCheckFailed(buyer);

        uint256 newSupply = IAsteraToken(token).totalSupply() + amount;
        uint256 cap = tokenCap[token];
        if (newSupply > cap) revert CapExceeded(newSupply, cap);

        identityRegistry.resetYearIfNeeded(buyer);
        if (!identityRegistry.canInvest(buyer, amount)) {
            revert InvestmentLimitExceeded(buyer, amount);
        }

        if (!complianceContract.canTransfer(address(0), buyer, amount)) {
            revert ComplianceCheckFailed(token, address(0), buyer, amount);
        }

        address treasury = complianceContract.treasury();
        usdc.safeTransferFrom(buyer, treasury, amount);
        IAsteraToken(token).mint(buyer, amount);
        identityRegistry.increaseSpent(buyer, amount);

        emit BuyExecuted(buyer, token, treasury, amount, amount);
    }

    function _requireSupported(address token) internal view {
        if (!supportedTokens[token]) revert UnsupportedToken(token);
    }
}
