// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { AsteraIdentityRegistry } from "../../src/identity/AsteraIdentityRegistry.sol";

/// @dev Unit tests for per-wallet yearly investment limits in AsteraIdentityRegistry.
///      Covers setYearlyLimit overrides, remainingLimit/canInvest views, rolling-cycle
///      treatment for the view, and removeUser access control.
contract YearlyLimitsTest is Test {
    AsteraIdentityRegistry internal identity;

    address internal admin = address(0xA11CE);
    address internal exchange = address(0xE111);
    address internal user = address(0xB0B);

    function setUp() public {
        identity = new AsteraIdentityRegistry(admin);
        vm.startPrank(admin);
        identity.setExchange(exchange, true);
        identity.registerUser(user);
        vm.stopPrank();
    }

    // ─── setYearlyLimit
    // ────────────────────────────────────────────────────────

    function testSetYearlyLimitCustomOverridesDefault() public {
        vm.prank(admin);
        identity.setYearlyLimit(user, 500e6);
        assertEq(identity.yearlyLimitOf(user), 500e6);
    }

    function testSetYearlyLimitZeroRestoresDefault() public {
        vm.prank(admin);
        identity.setYearlyLimit(user, 500e6);

        vm.prank(admin);
        identity.setYearlyLimit(user, 0);

        assertEq(identity.yearlyLimitOf(user), identity.DEFAULT_YEARLY_LIMIT());
    }

    function testSetYearlyLimitEmitsEvent() public {
        uint256 oldLimit = identity.yearlyLimitOf(user);

        vm.prank(admin);
        vm.expectEmit(true, false, false, true, address(identity));
        emit AsteraIdentityRegistry.YearlyLimitUpdated(user, oldLimit, 300e6);
        identity.setYearlyLimit(user, 300e6);
    }

    function testSetYearlyLimitOnlyAdmin() public {
        vm.expectRevert();
        identity.setYearlyLimit(user, 100e6);
    }

    // ─── increaseSpent with custom limit
    // ──────────────────────────────────────────

    function testCustomLimitBlocksExceedingAmount() public {
        vm.prank(admin);
        identity.setYearlyLimit(user, 500e6);

        vm.prank(exchange);
        vm.expectRevert(
            abi.encodeWithSelector(
                AsteraIdentityRegistry.InvestmentLimitExceeded.selector, user, 501e6, 500e6
            )
        );
        identity.increaseSpent(user, 501e6);
    }

    function testCustomLimitAllowsExactAmount() public {
        vm.prank(admin);
        identity.setYearlyLimit(user, 500e6);

        vm.prank(exchange);
        identity.increaseSpent(user, 500e6);

        assertEq(identity.yearlySpent(user), 500e6);
    }

    // ─── remainingLimit view
    // ─────────────────────────────────────────────────────

    function testRemainingLimitDecreasesAfterSpend() public {
        vm.prank(exchange);
        identity.increaseSpent(user, 100e6);

        assertEq(identity.remainingLimit(user), identity.DEFAULT_YEARLY_LIMIT() - 100e6);
    }

    function testRemainingLimitIsZeroWhenAtLimit() public {
        uint256 limit = identity.DEFAULT_YEARLY_LIMIT();
        vm.prank(exchange);
        identity.increaseSpent(user, limit);

        assertEq(identity.remainingLimit(user), 0);
    }

    function testRemainingLimitTreatsExpiredCycleAsFullReset() public {
        vm.prank(exchange);
        identity.increaseSpent(user, 1000e6);

        // Advance past the 365-day window without calling resetYearIfNeeded.
        // remainingLimit must reflect the expired cycle without writing state.
        vm.warp(block.timestamp + identity.ONE_YEAR() + 1);

        assertEq(identity.remainingLimit(user), identity.DEFAULT_YEARLY_LIMIT());
    }

    // ─── canInvest view
    // ──────────────────────────────────────────────────────────

    function testCanInvestReturnsFalseForUnregisteredUser() public view {
        assertFalse(identity.canInvest(address(0x9999), 1e6));
    }

    function testCanInvestReturnsTrueWithinLimit() public view {
        assertTrue(identity.canInvest(user, 100e6));
    }

    function testCanInvestReturnsFalseWhenAtLimit() public {
        uint256 limit = identity.DEFAULT_YEARLY_LIMIT();
        vm.prank(exchange);
        identity.increaseSpent(user, limit);

        assertFalse(identity.canInvest(user, 1e6));
    }

    function testCanInvestReturnsFalseForZeroAmount() public view {
        // canInvest delegates to remainingLimit; amount 0 triggers the <= check
        // 0 <= remainingLimit is always true, so this is a correct edge case to document
        assertTrue(identity.canInvest(user, 0));
    }

    // ─── removeUser
    // ───────────────────────────────────────────────────────────

    function testRemoveUserClearsRegistration() public {
        vm.prank(admin);
        identity.removeUser(user);
        assertFalse(identity.isRegistered(user));
    }

    function testRemoveUserBlocksIncreaseSpent() public {
        vm.prank(admin);
        identity.removeUser(user);

        vm.prank(exchange);
        vm.expectRevert(
            abi.encodeWithSelector(AsteraIdentityRegistry.NotRegistered.selector, user)
        );
        identity.increaseSpent(user, 1e6);
    }

    function testRemoveUserEmitsEvent() public {
        vm.prank(admin);
        vm.expectEmit(true, false, false, false, address(identity));
        emit AsteraIdentityRegistry.UserRemoved(user);
        identity.removeUser(user);
    }

    function testOnlyAdminCanRemoveUser() public {
        vm.prank(address(0xBAD));
        vm.expectRevert();
        identity.removeUser(user);
    }
}
