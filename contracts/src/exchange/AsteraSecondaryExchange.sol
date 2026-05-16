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
/// @notice Handles compliant secondary market operations and regulated asset transfers.
/// @dev Reads token registry and fee config from AsteraPrimaryExchange.
contract AsteraSecondaryExchange is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant EXCHANGE_ADMIN_ROLE = keccak256("EXCHANGE_ADMIN_ROLE");

    uint256 public constant TOKEN_DECIMALS = 1e6;
    uint256 public constant BPS_DENOMINATOR = 10_000;

    IERC20 public immutable usdc;
    IAsteraIdentityRegistry public immutable identityRegistry;
    IAsteraPrimaryExchange public immutable exchange;

    mapping(address token => mapping(address seller => uint256 amount)) public reservedForSale;

    struct SellOrder {
        uint256 id;
        address seller;
        address token;
        uint256 amountRemaining;
        uint256 unitPriceUSDC;
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

    /// @notice Creates a secondary-market sell order after funding is completed.
    /// @param token AsteraToken address.
    /// @param amount Amount of tokens to sell, in 6 decimals.
    /// @param unitPriceUSDC Price per 1 whole token, in USDC 6 decimals.
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

    /// @notice Executes a full or partial secondary-market order.
    /// @dev Buyer pays gross price. Seller receives gross minus fee. Seller accounting is reduced
    /// by gross price.
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

    function activeSellOrderCount() external view returns (uint256) {
        return _activeSellOrders.length;
    }

    function activeSellOrderAt(uint256 index) external view returns (SellOrder memory) {
        return _activeSellOrders[index];
    }

    function getSellOrder(uint256 orderId) external view returns (SellOrder memory) {
        return _activeSellOrders[_orderIndex(orderId)];
    }

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
