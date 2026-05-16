// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IAsteraToken
/// @notice Interface for a regulated 6-decimal token representing participation in a tokenized
/// asset. @dev Direct ERC20 transfers (transfer/transferFrom) are disabled. All secondary movements
/// must
///      go through exchangeTransfer. Consumed by AsteraComplianceManager (supply/balance checks)
///      and both exchange contracts.
interface IAsteraToken {
    /// @notice Address of the AsteraComplianceManager bound to this token.
    function compliance() external view returns (address);
    /// @notice Maximum token supply in 6-decimal units. Immutable after deployment.
    function cap() external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    /// @notice Always returns 6, aligned with USDC decimals.
    function decimals() external view returns (uint8);

    /// @notice Mints tokens to a buyer. Normally called by AsteraPrimaryExchange.buy.
    /// @param amount Amount in 6-decimal units.
    function mint(address to, uint256 amount) external;

    /// @notice Burns tokens from an address. Operational/admin tool; no primary redeem flow exists.
    function burn(address from, uint256 amount) external;

    /// @notice Moves tokens on behalf of an authorized exchange. No ERC20 allowance required.
    /// @dev The authorized exchange is the compliance gateway; allowance-less transfer is
    /// intentional.
    function exchangeTransfer(address from, address to, uint256 amount) external;

    /// @notice Exceptional admin transfer for legal/operational corrections. Bypasses sender
    /// freeze. @dev Recipient must still be compliant. Auditable via ForcedTransfer event.
    function forcedTransfer(address from, address to, uint256 amount) external;
}
