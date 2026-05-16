// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { IAsteraIdentityRegistry } from "../interfaces/IAsteraIdentityRegistry.sol";
import { IAsteraComplianceManager } from "../interfaces/IAsteraComplianceManager.sol";
import { IAsteraToken } from "../interfaces/IAsteraToken.sol";

interface IAsteraPrimaryExchange {
    function supportedTokens(address token) external view returns (bool);
    function complianceOf(address token) external view returns (address);
    function feeBps() external view returns (uint256);
    function feeRecipient() external view returns (address);
}

/// @title AsteraSecondaryExchange
/// @notice Order-book secondary market for compliant peer-to-peer token trades after a project's
///         funding round closes.
/// @dev Separated from AsteraPrimaryExchange for modularity, operational clarity, and bytecode
///      size. Token registry and fee config are read from AsteraPrimaryExchange to avoid
///      duplication. Direct user-to-user token transfers are prohibited; this exchange is the
///      only authorised path for secondary movements, preserving compliance checks and annual
///      investment accounting on every trade.
contract AsteraSecondaryExchange is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant EXCHANGE_ADMIN_ROLE = keccak256("EXCHANGE_ADMIN_ROLE");

    /// @notice Scaling factor for the price formula: tokenAmount * unitPriceUSDC / TOKEN_DECIMALS.
    uint256 public constant TOKEN_DECIMALS = 1e6;
    uint256 public constant BPS_DENOMINATOR = 10_000;

    /// @notice Avalanche C-Chain USDC. All secondary trades are settled in USDC.
    IERC20 public immutable usdc;
    IAsteraIdentityRegistry public immutable identityRegistry;
    /// @notice Primary exchange, used as the authoritative source for supported tokens and fee
    /// config.
    IAsteraPrimaryExchange public immutable exchange;

    /// @notice Tracks how many tokens each seller has reserved across all their open orders.
    /// @dev Prevents a seller from creating multiple orders that collectively exceed their
    ///      available balance. Updated on createSellOrder (+), executeSellOrder (-), and
    ///      cancelSellOrder (-).
    mapping(address token => mapping(address seller => uint256 amount)) public reservedForSale;

    /// @notice Represents a live sell order on the secondary market.
    struct SellOrder {
        uint256 id;
        address seller;
        address token;
        uint256 amountRemaining; // in 6-decimal token units; decreases on partial fills
        uint256 unitPriceUSDC; // price per 1 whole token (1e6 units), expressed in USDC 6-decimal
        // units
    }

    SellOrder[] private _activeSellOrders;
    mapping(uint256 orderId => uint256 indexPlusOne) private _orderIndexPlusOne;
    uint256 public nextOrderId = 1;

    event SellOrderCreated(
        uint256 indexed orderId,
        address indexed seller,
        address indexed token,
        uint256 amount,
        uint256 unitPriceUSDC
    );

    event SellOrderPartiallyFilled(
        uint256 indexed orderId,
        address indexed buyer,
        address indexed seller,
        address token,
        uint256 amountBought,
        uint256 amountRemaining,
        uint256 grossUSDC,
        uint256 feeUSDC
    );

    event SellOrderFilled(
        uint256 indexed orderId,
        address indexed buyer,
        address indexed seller,
        address token,
        uint256 amountBought,
        uint256 grossUSDC,
        uint256 feeUSDC
    );

    event SellOrderCancelled(
        uint256 indexed orderId,
        address indexed seller,
        address indexed token,
        uint256 amountRemaining,
        uint256 unitPriceUSDC
    );

    event FeeCollected(
        address indexed token, address indexed payer, address indexed recipient, uint256 amount
    );

    event InvestmentAccountingUpdated(
        address indexed buyer, address indexed seller, uint256 buyerIncrease, uint256 sellerDecrease
    );

    error ZeroAddress();
    error ZeroAmount();
    error UnsupportedToken(address token);
    error FundingNotCompleted(address token);
    error ComplianceCheckFailed(address token, address from, address to, uint256 amount);
    error InvestmentLimitExceeded(address user, uint256 amount);
    error InvalidOrder(uint256 orderId);
    error NotOrderSeller(address caller, address seller);
    error CannotBuyOwnOrder();
    error AmountExceedsOrder(uint256 requested, uint256 available);
    error InsufficientAvailableBalance(address seller, uint256 requested, uint256 available);

    /// @notice Deploys the secondary exchange linked to an existing AsteraPrimaryExchange.
    constructor(address usdc_, address identityRegistry_, address exchange_, address admin_) {
        if (
            usdc_ == address(0) || identityRegistry_ == address(0) || exchange_ == address(0)
                || admin_ == address(0)
        ) revert ZeroAddress();

        usdc = IERC20(usdc_);
        identityRegistry = IAsteraIdentityRegistry(identityRegistry_);
        exchange = IAsteraPrimaryExchange(exchange_);

        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(EXCHANGE_ADMIN_ROLE, admin_);
    }

    /// @notice Places a sell order on the secondary market. Only allowed after funding is complete.
    /// @dev Validates the seller's available balance (total balance minus partial freeze minus
    ///      already-reserved tokens) to prevent over-committing. The seller retains custody of
    ///      the tokens until a buyer fills the order; reservedForSale tracks the reserved amount
    ///      to block double-listing the same balance.
    /// @param token AsteraToken address being sold.
    /// @param amount Token amount to sell, in 6-decimal units.
    /// @param unitPriceUSDC Price per 1 whole token (1e6 token units) expressed in USDC 6-decimal
    /// units.
    function createSellOrder(address token, uint256 amount, uint256 unitPriceUSDC) external {
        if (amount == 0 || unitPriceUSDC == 0) revert ZeroAmount();
        _requireSupported(token);

        address seller = msg.sender;
        address compliance = exchange.complianceOf(token);
        IAsteraComplianceManager complianceContract = IAsteraComplianceManager(compliance);

        if (!complianceContract.fundingCompleted()) revert FundingNotCompleted(token);
        if (!complianceContract.canTransfer(seller, address(0), amount)) {
            revert ComplianceCheckFailed(token, seller, address(0), amount);
        }

        uint256 balance = IAsteraToken(token).balanceOf(seller);
        uint256 available = complianceContract.availableBalance(seller, balance);
        uint256 alreadyReserved = reservedForSale[token][seller];
        uint256 freeAvailable = available > alreadyReserved ? available - alreadyReserved : 0;
        if (freeAvailable < amount) {
            revert InsufficientAvailableBalance(seller, amount, freeAvailable);
        }
        reservedForSale[token][seller] = alreadyReserved + amount;

        uint256 id = nextOrderId++;
        _activeSellOrders.push(
            SellOrder({
                id: id,
                seller: seller,
                token: token,
                amountRemaining: amount,
                unitPriceUSDC: unitPriceUSDC
            })
        );
        _orderIndexPlusOne[id] = _activeSellOrders.length;

        emit SellOrderCreated(id, seller, token, amount, unitPriceUSDC);
    }

    /// @notice Executes a full or partial fill of an existing sell order.
    /// @dev Price formula: grossUSDC = amountToBuy * unitPriceUSDC / 1e6.
    ///      grossUSDC == 0 is blocked to prevent free fills caused by integer truncation at small
    /// amounts. Buyer pays grossUSDC; seller receives grossUSDC minus fee; fee goes to
    /// feeRecipient.
    ///      Annual investment accounting: buyer's yearlySpent increases by grossUSDC; seller's
    ///      yearlySpent decreases by grossUSDC (gross, not net) because the decrease represents
    ///      the capital economically divested, not the cash received after fee deduction.
    ///      Tokens move via AsteraToken.exchangeTransfer (no ERC20 allowance required).
    /// @param orderId ID of the target sell order.
    /// @param amountToBuy Token amount to purchase, in 6-decimal units. Must be <= amountRemaining.
    function executeSellOrder(uint256 orderId, uint256 amountToBuy) external nonReentrant {
        if (amountToBuy == 0) revert ZeroAmount();

        uint256 index = _orderIndex(orderId);
        SellOrder memory order = _activeSellOrders[index];

        address buyer = msg.sender;
        if (buyer == order.seller) revert CannotBuyOwnOrder();
        if (amountToBuy > order.amountRemaining) {
            revert AmountExceedsOrder(amountToBuy, order.amountRemaining);
        }

        address compliance = exchange.complianceOf(order.token);
        IAsteraComplianceManager complianceContract = IAsteraComplianceManager(compliance);
        if (!complianceContract.fundingCompleted()) revert FundingNotCompleted(order.token);

        if (!complianceContract.canTransfer(order.seller, buyer, amountToBuy)) {
            revert ComplianceCheckFailed(order.token, order.seller, buyer, amountToBuy);
        }

        uint256 grossUSDC = _quoteUSDC(amountToBuy, order.unitPriceUSDC);
        if (grossUSDC == 0) revert ZeroAmount();
        uint256 feeUSDC = (grossUSDC * exchange.feeBps()) / BPS_DENOMINATOR;
        uint256 sellerUSDC = grossUSDC - feeUSDC;

        identityRegistry.resetYearIfNeeded(buyer);
        if (!identityRegistry.canInvest(buyer, grossUSDC)) {
            revert InvestmentLimitExceeded(buyer, grossUSDC);
        }

        address feeDest = exchange.feeRecipient();
        usdc.safeTransferFrom(buyer, address(this), grossUSDC);
        if (feeUSDC != 0) {
            usdc.safeTransfer(feeDest, feeUSDC);
            emit FeeCollected(order.token, buyer, feeDest, feeUSDC);
        }
        usdc.safeTransfer(order.seller, sellerUSDC);

        reservedForSale[order.token][order.seller] -= amountToBuy;
        IAsteraToken(order.token).exchangeTransfer(order.seller, buyer, amountToBuy);

        identityRegistry.increaseSpent(buyer, grossUSDC);
        identityRegistry.decreaseSpent(order.seller, grossUSDC);
        emit InvestmentAccountingUpdated(buyer, order.seller, grossUSDC, grossUSDC);

        uint256 newRemaining = order.amountRemaining - amountToBuy;
        if (newRemaining == 0) {
            emit SellOrderFilled(
                order.id, buyer, order.seller, order.token, amountToBuy, grossUSDC, feeUSDC
            );
            _removeOrderAt(index);
        } else {
            _activeSellOrders[index].amountRemaining = newRemaining;
            emit SellOrderPartiallyFilled(
                order.id,
                buyer,
                order.seller,
                order.token,
                amountToBuy,
                newRemaining,
                grossUSDC,
                feeUSDC
            );
        }
    }

    /// @notice Cancels an open sell order and releases the reserved token amount.
    function cancelSellOrder(uint256 orderId) external {
        uint256 index = _orderIndex(orderId);
        SellOrder memory order = _activeSellOrders[index];

        if (msg.sender != order.seller) revert NotOrderSeller(msg.sender, order.seller);

        reservedForSale[order.token][order.seller] -= order.amountRemaining;
        emit SellOrderCancelled(
            order.id, order.seller, order.token, order.amountRemaining, order.unitPriceUSDC
        );
        _removeOrderAt(index);
    }

    /// @notice Returns the number of currently active sell orders across all tokens.
    function activeSellOrderCount() external view returns (uint256) {
        return _activeSellOrders.length;
    }

    /// @notice Returns the sell order at a given storage index. Use with activeSellOrderCount for
    /// iteration.
    function activeSellOrderAt(uint256 index) external view returns (SellOrder memory) {
        return _activeSellOrders[index];
    }

    /// @notice Returns a sell order by its ID.
    function getSellOrder(uint256 orderId) external view returns (SellOrder memory) {
        return _activeSellOrders[_orderIndex(orderId)];
    }

    /// @notice Returns the gross USDC cost for a given token amount and unit price.
    /// @dev grossUSDC = tokenAmount * unitPriceUSDC / 1e6. Exposed for frontend/backend quoting.
    /// @param tokenAmount Amount of tokens in 6-decimal units.
    /// @param unitPriceUSDC Price per 1 whole token in USDC 6-decimal units.
    /// @return Gross USDC cost in 6-decimal units (before fee deduction).
    function quoteUSDC(uint256 tokenAmount, uint256 unitPriceUSDC) external pure returns (uint256) {
        return _quoteUSDC(tokenAmount, unitPriceUSDC);
    }

    function _quoteUSDC(uint256 tokenAmount, uint256 unitPriceUSDC)
        internal
        pure
        returns (uint256)
    {
        return (tokenAmount * unitPriceUSDC) / TOKEN_DECIMALS;
    }

    function _requireSupported(address token) internal view {
        if (!exchange.supportedTokens(token)) revert UnsupportedToken(token);
    }

    function _orderIndex(uint256 orderId) internal view returns (uint256) {
        uint256 indexPlusOne = _orderIndexPlusOne[orderId];
        if (indexPlusOne == 0) revert InvalidOrder(orderId);
        return indexPlusOne - 1;
    }

    function _removeOrderAt(uint256 index) internal {
        uint256 lastIndex = _activeSellOrders.length - 1;
        uint256 removedId = _activeSellOrders[index].id;

        if (index != lastIndex) {
            SellOrder memory lastOrder = _activeSellOrders[lastIndex];
            _activeSellOrders[index] = lastOrder;
            _orderIndexPlusOne[lastOrder.id] = index + 1;
        }

        _activeSellOrders.pop();
        delete _orderIndexPlusOne[removedId];
    }
}
