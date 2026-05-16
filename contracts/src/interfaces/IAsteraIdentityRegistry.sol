// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IAsteraIdentityRegistry
/// @notice Interface for the platform-level KYC registry and rolling annual investment accounting.
/// @dev Consumed by AsteraComplianceManager (eligibility checks), AsteraPrimaryExchange, and
///      AsteraSecondaryExchange (spend accounting). Only addresses granted EXCHANGE_ROLE can
///      write spend state; only IDENTITY_ADMIN_ROLE can register or modify wallets.
interface IAsteraIdentityRegistry {
    /// @notice Default annual investment limit: 1500 USDC in 6-decimal units.
    function DEFAULT_YEARLY_LIMIT() external view returns (uint256);
    function ONE_YEAR() external view returns (uint256);

    /// @notice Returns true if the wallet passed KYC and has not been removed.
    function isRegistered(address user) external view returns (bool);

    /// @notice Returns the wallet's active annual limit in USDC 6-decimal units.
    function yearlyLimitOf(address user) external view returns (uint256);

    /// @notice Cumulative net investment exposure in the current 365-day cycle, in USDC 6-decimal
    /// units.
    function yearlySpent(address user) external view returns (uint256);

    /// @notice Timestamp of the first investment in the current rolling cycle.
    function firstInvestmentAt(address user) external view returns (uint256);

    /// @notice Remaining investment capacity in the current cycle. Accounts for cycle expiry
    /// without writing state; see AsteraIdentityRegistry.remainingLimit for edge-case details.
    function remainingLimit(address user) external view returns (uint256);

    /// @notice Returns true if the wallet is registered and has capacity to invest `amount`
    /// (6-decimal USDC).
    function canInvest(address user, uint256 amount) external view returns (bool);

    /// @notice Registers a wallet after off-chain KYC. IDENTITY_ADMIN_ROLE only.
    function registerUser(address user) external;

    /// @notice Removes a wallet from the registry. IDENTITY_ADMIN_ROLE only.
    function removeUser(address user) external;

    /// @notice Sets a per-wallet annual limit in USDC 6-decimal units. IDENTITY_ADMIN_ROLE only.
    function setYearlyLimit(address user, uint256 newLimit) external;

    /// @notice Grants or revokes EXCHANGE_ROLE for an exchange contract. DEFAULT_ADMIN_ROLE only.
    function setExchange(address exchange, bool enabled) external;

    /// @notice Writes the annual cycle reset if 365 days have elapsed. EXCHANGE_ROLE only.
    function resetYearIfNeeded(address user) external;

    /// @notice Increases yearlySpent on purchase. EXCHANGE_ROLE only.
    /// @param amount USDC 6-decimal investment amount.
    function increaseSpent(address user, uint256 amount) external;

    /// @notice Decreases yearlySpent on secondary sale. EXCHANGE_ROLE only.
    /// @param amount Gross USDC 6-decimal sale amount (not net after fee).
    function decreaseSpent(address user, uint256 amount) external;
}
