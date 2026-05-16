// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title IdentityRegistry
/// @notice Global PSAV identity registry and rolling annual investment accounting.
///         Maintains approved wallet-to-identity mappings for regulated tokenized markets.
/// @dev This is intentionally simple and ERC-3643-inspired, not a full ERC-3643 identity stack.
contract AsteraIdentityRegistry is AccessControl {
    bytes32 public constant IDENTITY_ADMIN_ROLE = keccak256("IDENTITY_ADMIN_ROLE");
    bytes32 public constant EXCHANGE_ROLE = keccak256("EXCHANGE_ROLE");

    uint256 public constant DEFAULT_YEARLY_LIMIT = 1500e6;
    uint256 public constant ONE_YEAR = 365 days;

    mapping(address user => bool registered) private _registered;
    mapping(address user => uint256 limit) private _yearlyLimit;

    mapping(address user => uint256 spent) public yearlySpent;
    mapping(address user => uint256 timestamp) public firstInvestmentAt;

    event UserRegistered(address indexed user);
    event UserRemoved(address indexed user);
    event YearlyLimitUpdated(address indexed user, uint256 oldLimit, uint256 newLimit);
    event YearlySpentIncreased(address indexed user, uint256 amount, uint256 newSpent);
    event YearlySpentDecreased(address indexed user, uint256 amount, uint256 newSpent);
    event YearlyCycleReset(address indexed user, uint256 oldCycleStart, uint256 newCycleStart);
    event ExchangeStatusUpdated(address indexed exchange, bool enabled);

    error ZeroAddress();
    error NotRegistered(address user);
    error InvestmentLimitExceeded(address user, uint256 attemptedSpent, uint256 limit);

    constructor(address admin) {
        if (admin == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(IDENTITY_ADMIN_ROLE, admin);
    }

    function registerUser(address user) external onlyRole(IDENTITY_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        _registered[user] = true;
        emit UserRegistered(user);
    }

    function removeUser(address user) external onlyRole(IDENTITY_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        _registered[user] = false;
        emit UserRemoved(user);
    }

    function setYearlyLimit(address user, uint256 newLimit) external onlyRole(IDENTITY_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        uint256 oldLimit = yearlyLimitOf(user);
        _yearlyLimit[user] = newLimit;
        emit YearlyLimitUpdated(user, oldLimit, newLimit);
    }

    function setExchange(address exchange, bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (exchange == address(0)) revert ZeroAddress();
        if (enabled) {
            _grantRole(EXCHANGE_ROLE, exchange);
        } else {
            _revokeRole(EXCHANGE_ROLE, exchange);
        }
        emit ExchangeStatusUpdated(exchange, enabled);
    }

    function resetYearIfNeeded(address user) external onlyRole(EXCHANGE_ROLE) {
        _resetYearIfNeeded(user);
    }

    function increaseSpent(address user, uint256 amount) external onlyRole(EXCHANGE_ROLE) {
        if (!_registered[user]) revert NotRegistered(user);
        _resetYearIfNeeded(user);

        if (firstInvestmentAt[user] == 0) {
            firstInvestmentAt[user] = block.timestamp;
        }

        uint256 newSpent = yearlySpent[user] + amount;
        uint256 limit = yearlyLimitOf(user);
        if (newSpent > limit) revert InvestmentLimitExceeded(user, newSpent, limit);

        yearlySpent[user] = newSpent;
        emit YearlySpentIncreased(user, amount, newSpent);
    }

    function decreaseSpent(address user, uint256 amount) external onlyRole(EXCHANGE_ROLE) {
        if (!_registered[user]) revert NotRegistered(user);
        _resetYearIfNeeded(user);

        uint256 currentSpent = yearlySpent[user];
        uint256 newSpent = amount >= currentSpent ? 0 : currentSpent - amount;
        yearlySpent[user] = newSpent;

        emit YearlySpentDecreased(user, amount, newSpent);
    }

    function isRegistered(address user) external view returns (bool) {
        return _registered[user];
    }

    function yearlyLimitOf(address user) public view returns (uint256) {
        uint256 customLimit = _yearlyLimit[user];
        return customLimit == 0 ? DEFAULT_YEARLY_LIMIT : customLimit;
    }

    function remainingLimit(address user) public view returns (uint256) {
        uint256 spent = _effectiveSpent(user);
        uint256 limit = yearlyLimitOf(user);
        return spent >= limit ? 0 : limit - spent;
    }

    function canInvest(address user, uint256 amount) external view returns (bool) {
        if (!_registered[user]) return false;
        return amount <= remainingLimit(user);
    }

    function _effectiveSpent(address user) internal view returns (uint256) {
        uint256 startedAt = firstInvestmentAt[user];
        if (startedAt != 0 && block.timestamp >= startedAt + ONE_YEAR) {
            return 0;
        }
        return yearlySpent[user];
    }

    function _resetYearIfNeeded(address user) internal {
        uint256 startedAt = firstInvestmentAt[user];
        if (startedAt != 0 && block.timestamp >= startedAt + ONE_YEAR) {
            yearlySpent[user] = 0;
            firstInvestmentAt[user] = block.timestamp;
            emit YearlyCycleReset(user, startedAt, block.timestamp);
        }
    }
}
