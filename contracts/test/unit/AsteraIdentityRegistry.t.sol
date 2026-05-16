// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { AsteraIdentityRegistry } from "../../src/identity/AsteraIdentityRegistry.sol";

contract AsteraIdentityRegistryTest is Test {
    AsteraIdentityRegistry internal identity;

    address internal admin = address(0xA11CE);
    address internal exchange = address(0xE111);
    address internal user = address(0xB0B);

    function setUp() public {
        identity = new AsteraIdentityRegistry(admin);
        vm.prank(admin);
        identity.setExchange(exchange, true);
    }

    function testRegisterUserAndDefaultLimit() public {
        vm.prank(admin);
        identity.registerUser(user);

        assertTrue(identity.isRegistered(user));
        assertEq(identity.yearlyLimitOf(user), 1500e6);
        assertEq(identity.remainingLimit(user), 1500e6);
    }

    function testOnlyAdminCanRegister() public {
        vm.expectRevert();
        identity.registerUser(user);
    }

    function testIncreaseSpentInitializesCycle() public {
        vm.prank(admin);
        identity.registerUser(user);

        vm.prank(exchange);
        identity.increaseSpent(user, 100e6);

        assertEq(identity.yearlySpent(user), 100e6);
        assertEq(identity.firstInvestmentAt(user), block.timestamp);
    }

    function testCannotExceedLimit() public {
        vm.prank(admin);
        identity.registerUser(user);

        vm.prank(exchange);
        vm.expectRevert();
        identity.increaseSpent(user, 1501e6);
    }

    function testDecreaseSpentCannotUnderflow() public {
        vm.prank(admin);
        identity.registerUser(user);

        vm.prank(exchange);
        identity.increaseSpent(user, 100e6);

        vm.prank(exchange);
        identity.decreaseSpent(user, 200e6);

        assertEq(identity.yearlySpent(user), 0);
    }

    function testRollingYearResetUpdatesCycleStart() public {
        vm.prank(admin);
        identity.registerUser(user);

        vm.prank(exchange);
        identity.increaseSpent(user, 100e6);

        uint256 oldStart = identity.firstInvestmentAt(user);
        vm.warp(oldStart + 365 days + 1);

        vm.prank(exchange);
        identity.increaseSpent(user, 50e6);

        assertEq(identity.yearlySpent(user), 50e6);
        assertEq(identity.firstInvestmentAt(user), block.timestamp);
        assertGt(identity.firstInvestmentAt(user), oldStart);
    }
}
