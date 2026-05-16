// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAsteraIdentityRegistry {
    function DEFAULT_YEARLY_LIMIT() external view returns (uint256);
    function ONE_YEAR() external view returns (uint256);

    function isRegistered(address user) external view returns (bool);
    function yearlyLimitOf(address user) external view returns (uint256);
    function yearlySpent(address user) external view returns (uint256);
    function firstInvestmentAt(address user) external view returns (uint256);
    function remainingLimit(address user) external view returns (uint256);
    function canInvest(address user, uint256 amount) external view returns (bool);

    function registerUser(address user) external;
    function removeUser(address user) external;
    function setYearlyLimit(address user, uint256 newLimit) external;
    function setExchange(address exchange, bool enabled) external;
    function resetYearIfNeeded(address user) external;
    function increaseSpent(address user, uint256 amount) external;
    function decreaseSpent(address user, uint256 amount) external;
}
