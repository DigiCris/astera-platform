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
/// @notice Handles compliant primary issuance, initial purchases, and regulated funding flows.
/// @dev Secondary market is handled by AsteraSecondaryExchange.
contract AsteraPrimaryExchange is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant EXCHANGE_ADMIN_ROLE = keccak256("EXCHANGE_ADMIN_ROLE");

    uint256 public constant BPS_DENOMINATOR = 10_000;

    IERC20 public immutable usdc;
    IAsteraIdentityRegistry public immutable identityRegistry;

    address public feeRecipient;
    uint256 public feeBps = 100; // 1%

    address public exchangeSecondary;

    mapping(address token => bool supported) public supportedTokens;
    mapping(address token => address compliance) public complianceOf;
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

    function setExchangeSecondary(address secondary_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (secondary_ == address(0)) revert ZeroAddress();
        address old = exchangeSecondary;
        exchangeSecondary = secondary_;
        emit ExchangeSecondaryUpdated(old, secondary_);
    }

    /// @notice Deploys a new AsteraToken + AsteraComplianceManager pair and registers it
    /// atomically. Also authorizes AsteraSecondaryExchange on the new token if set.
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

    function setFeeBps(uint256 newFeeBps) external onlyRole(EXCHANGE_ADMIN_ROLE) {
        if (newFeeBps > 1000) revert InvalidFee(); // hard cap at 10% for safety
        uint256 oldFee = feeBps;
        feeBps = newFeeBps;
        emit FeeBpsUpdated(oldFee, newFeeBps);
    }

    /// @notice Primary market purchase. Buyer calls directly after approving USDC to this exchange.
    /// @param token Security token address.
    /// @param amount Amount in 6 decimals. Primary market is 1 USDC : 1 token.
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
