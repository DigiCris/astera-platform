// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title AsteraIdentityRegistry
/// @notice Platform-level KYC registry and rolling annual investment accounting for Astera
/// regulated markets. @dev Wallets are registered after completing KYC off-chain; no personal
/// identity data or documents are stored
///      on-chain. Separated from per-project compliance (AsteraComplianceManager) so a single KYC
/// approval grants eligibility across all projects without re-running KYC per instrument.
///      This is intentionally simple and ERC-3643-inspired, not a full ERC-3643 identity stack.
contract AsteraIdentityRegistry is AccessControl {
    bytes32 public constant IDENTITY_ADMIN_ROLE = keccak256("IDENTITY_ADMIN_ROLE");
    bytes32 public constant EXCHANGE_ROLE = keccak256("EXCHANGE_ROLE");

    /// @notice Default rolling annual investment limit per wallet: 1500 USDC expressed in 6-decimal
    /// units.
    uint256 public constant DEFAULT_YEARLY_LIMIT = 1500e6;
    uint256 public constant ONE_YEAR = 365 days;

    mapping(address user => bool registered) private _registered;
    /// @dev Zero means the user falls back to DEFAULT_YEARLY_LIMIT. Set explicitly only for
    /// non-default profiles.
    mapping(address user => uint256 limit) private _yearlyLimit;

    /// @notice Cumulative net investment exposure within the current rolling 365-day cycle, in USDC
    /// 6-decimal units. @dev Represents economic exposure, not gross historical volume: increased
    /// on purchase, decreased on secondary sale.
    mapping(address user => uint256 spent) public yearlySpent;

    /// @notice Timestamp of the first investment in the current rolling cycle. Resets when the
    /// cycle expires.
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

    /// @notice Deploys the registry and grants DEFAULT_ADMIN_ROLE and IDENTITY_ADMIN_ROLE to
    /// `admin`.
    constructor(address admin) {
        if (admin == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(IDENTITY_ADMIN_ROLE, admin);
    }

    /// @notice Registers a wallet that completed the platform-level KYC flow.
    /// @dev Personal identity data is intentionally kept off-chain. This registry only stores the
    ///      wallet-level eligibility flag consumed by project-specific compliance managers.
    function registerUser(address user) external onlyRole(IDENTITY_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        _registered[user] = true;
        emit UserRegistered(user);
    }

    /// @notice Removes a wallet from the KYC registry, disabling participation across all projects.
    /// @dev Does not reset yearlySpent or firstInvestmentAt. Existing holdings are unaffected;
    ///      further purchases are blocked.
    function removeUser(address user) external onlyRole(IDENTITY_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        _registered[user] = false;
        emit UserRemoved(user);
    }

    /// @notice Sets a per-wallet annual investment limit, overriding DEFAULT_YEARLY_LIMIT.
    /// @dev Setting newLimit to 0 restores the platform default on next read via yearlyLimitOf.
    /// @param newLimit Annual limit in USDC 6-decimal units.
    function setYearlyLimit(address user, uint256 newLimit) external onlyRole(IDENTITY_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        uint256 oldLimit = yearlyLimitOf(user);
        _yearlyLimit[user] = newLimit;
        emit YearlyLimitUpdated(user, oldLimit, newLimit);
    }

    /// @notice Grants or revokes EXCHANGE_ROLE for an exchange contract.
    /// @dev Both primary and secondary exchanges must hold EXCHANGE_ROLE to call increaseSpent,
    ///      decreaseSpent, and resetYearIfNeeded. Revocation immediately prevents further
    /// accounting writes.
    function setExchange(address exchange, bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (exchange == address(0)) revert ZeroAddress();
        if (enabled) {
            _grantRole(EXCHANGE_ROLE, exchange);
        } else {
            _revokeRole(EXCHANGE_ROLE, exchange);
        }
        emit ExchangeStatusUpdated(exchange, enabled);
    }

    /// @notice Writes the annual cycle reset on-chain if the rolling 365-day window has elapsed.
    /// @dev Exchanges call this before canInvest checks to keep on-chain state consistent with
    ///      _effectiveSpent. A separate call avoids redundant resets when increaseSpent already
    ///      triggers internally.
    function resetYearIfNeeded(address user) external onlyRole(EXCHANGE_ROLE) {
        _resetYearIfNeeded(user);
    }

    /// @notice Records a USDC-equivalent investment for a primary or secondary market purchase.
    /// @dev Called by authorized exchanges on buy execution. Initializes firstInvestmentAt on the
    ///      first investment of a cycle. Reverts if the new cumulative spent would exceed the
    /// limit. @param amount Investment amount in USDC 6-decimal units.
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

    /// @notice Reduces recorded investment exposure when a user sells on the secondary market.
    /// @dev The secondary exchange passes the gross USDC sale value (not the net after fees) to
    ///      maintain symmetry with increaseSpent: the decrease represents capital economically
    ///      divested, not cash received. If amount >= currentSpent the result clamps to 0 and
    ///      never underflows.
    /// @param amount Gross USDC sale amount in 6-decimal units.
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

    /// @notice Returns the active annual limit for a wallet.
    /// @return Limit in USDC 6-decimal units. Returns DEFAULT_YEARLY_LIMIT if no per-wallet
    /// override is set.
    function yearlyLimitOf(address user) public view returns (uint256) {
        uint256 customLimit = _yearlyLimit[user];
        return customLimit == 0 ? DEFAULT_YEARLY_LIMIT : customLimit;
    }

    /// @notice Returns remaining investment capacity within the current annual cycle.
    /// @dev Applies cycle expiry without writing state: if 365 days have elapsed since
    ///      firstInvestmentAt, effective spent is treated as 0. The value may therefore exceed
    ///      on-chain yearlySpent if the cycle expired but resetYearIfNeeded has not been called
    /// yet.
    function remainingLimit(address user) public view returns (uint256) {
        uint256 spent = _effectiveSpent(user);
        uint256 limit = yearlyLimitOf(user);
        return spent >= limit ? 0 : limit - spent;
    }

    /// @notice Returns whether a wallet is eligible and has sufficient capacity to invest `amount`.
    function canInvest(address user, uint256 amount) external view returns (bool) {
        if (!_registered[user]) return false;
        return amount <= remainingLimit(user);
    }

    /// @dev Computes effective yearlySpent without writing state, treating an expired cycle as
    /// reset.
    function _effectiveSpent(address user) internal view returns (uint256) {
        uint256 startedAt = firstInvestmentAt[user];
        if (startedAt != 0 && block.timestamp >= startedAt + ONE_YEAR) {
            return 0;
        }
        return yearlySpent[user];
    }

    /// @dev Resets yearlySpent to 0 and advances firstInvestmentAt if the 365-day cycle has
    /// elapsed.
    function _resetYearIfNeeded(address user) internal {
        uint256 startedAt = firstInvestmentAt[user];
        if (startedAt != 0 && block.timestamp >= startedAt + ONE_YEAR) {
            yearlySpent[user] = 0;
            firstInvestmentAt[user] = block.timestamp;
            emit YearlyCycleReset(user, startedAt, block.timestamp);
        }
    }
}
