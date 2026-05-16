// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { AsteraIdentityRegistry } from "../../src/identity/AsteraIdentityRegistry.sol";
import { AsteraPrimaryExchange } from "../../src/exchange/AsteraPrimaryExchange.sol";
import { AsteraSecondaryExchange } from "../../src/exchange/AsteraSecondaryExchange.sol";
import { AsteraToken } from "../../src/token/AsteraToken.sol";
import { AsteraComplianceManager } from "../../src/compliance/AsteraComplianceManager.sol";
import { MockUSDC } from "../../src/mocks/MockUSDC.sol";

/// @dev Tests for compliance escape hatches: freeze/unfreeze, forcedTransfer, removeCompliantUser,
///      and reservedForSale accounting correctness on cancel and fill.
///      Also covers: cancel by non-seller access control and secondary yearlyLimit exceeded.
contract FreezeAndForcedTransferTest is Test {
    AsteraIdentityRegistry internal identity;
    AsteraPrimaryExchange internal exchange;
    AsteraSecondaryExchange internal secondary;
    AsteraToken internal token;
    AsteraComplianceManager internal compliance;
    MockUSDC internal usdc;

    address internal admin = address(this);
    address internal treasury = address(0xF1DE1);
    address internal feeRecipient = address(0xFEE);
    address internal holder = address(0x1111); // has tokens after setUp
    address internal receiver = address(0x2222); // compliant, no tokens

    uint256 internal constant MAX_SUPPLY = 1000e6;
    uint256 internal constant SOFT_CAP = 100e6;

    bytes32 internal constant GENERIC_DOC_HASH = keccak256("test-legal-doc-v1");
    string internal constant GENERIC_DOC_URI = "ipfs://QmTestDoc";

    function setUp() public {
        vm.warp(1000);
        uint256 fundingDeadline = block.timestamp + 30 days;

        usdc = new MockUSDC();
        identity = new AsteraIdentityRegistry(admin);
        exchange = new AsteraPrimaryExchange(address(usdc), address(identity), feeRecipient, admin);
        secondary = new AsteraSecondaryExchange(
            address(usdc), address(identity), address(exchange), admin
        );

        identity.setExchange(address(exchange), true);
        identity.setExchange(address(secondary), true);
        exchange.setExchangeSecondary(address(secondary));

        (address tokenAddr, address complianceAddr) = exchange.createProjectToken(
            "Test Token",
            "TST",
            MAX_SUPPLY,
            SOFT_CAP,
            fundingDeadline,
            treasury,
            GENERIC_DOC_HASH,
            GENERIC_DOC_URI
        );
        token = AsteraToken(tokenAddr);
        compliance = AsteraComplianceManager(complianceAddr);

        _registerAndComply(holder);
        _registerAndComply(receiver);

        _primaryBuy(holder, 200e6);
        compliance.setFundingCompleted();
    }

    // ─── freeze / unfreeze
    // ────────────────────────────────────────────────────────

    function testFreezeBlocksIsCompliant() public {
        assertTrue(compliance.isCompliant(holder));
        compliance.freeze(holder);
        assertFalse(compliance.isCompliant(holder));
    }

    function testUnfreezeRestoresCompliance() public {
        compliance.freeze(holder);
        compliance.unfreeze(holder);
        assertTrue(compliance.isCompliant(holder));
    }

    function testFreezeBlocksCanTransfer() public {
        compliance.freeze(holder);
        assertFalse(compliance.canTransfer(holder, receiver, 10e6));
    }

    function testFreezeEmitsEvent() public {
        vm.expectEmit(true, false, false, false, address(compliance));
        emit AsteraComplianceManager.Frozen(holder);
        compliance.freeze(holder);
    }

    function testUnfreezeEmitsEvent() public {
        compliance.freeze(holder);
        vm.expectEmit(true, false, false, false, address(compliance));
        emit AsteraComplianceManager.Unfrozen(holder);
        compliance.unfreeze(holder);
    }

    function testOnlyAdminCanFreeze() public {
        vm.prank(address(0xBAD));
        vm.expectRevert();
        compliance.freeze(holder);
    }

    function testOnlyAdminCanUnfreeze() public {
        compliance.freeze(holder);
        vm.prank(address(0xBAD));
        vm.expectRevert();
        compliance.unfreeze(holder);
    }

    function testFrozenHolderCannotCreateSellOrder() public {
        compliance.freeze(holder);
        vm.prank(holder);
        vm.expectRevert();
        secondary.createSellOrder(address(token), 10e6, 1e6);
    }

    function testFrozenBuyerCannotExecuteSellOrder() public {
        address frozenBuyer = address(0xFB);
        _registerAndComply(frozenBuyer);
        compliance.freeze(frozenBuyer);
        usdc.mint(frozenBuyer, 100e6);

        vm.prank(holder);
        secondary.createSellOrder(address(token), 10e6, 1e6);

        vm.startPrank(frozenBuyer);
        usdc.approve(address(secondary), 10e6);
        vm.expectRevert();
        secondary.executeSellOrder(1, 10e6);
        vm.stopPrank();
    }

    // ─── forcedTransfer
    // ───────────────────────────────────────────────────────

    function testForcedTransferHappyPath() public {
        uint256 beforeHolder = token.balanceOf(holder);
        uint256 beforeReceiver = token.balanceOf(receiver);

        token.forcedTransfer(holder, receiver, 50e6);

        assertEq(token.balanceOf(holder), beforeHolder - 50e6);
        assertEq(token.balanceOf(receiver), beforeReceiver + 50e6);
    }

    function testForcedTransferFromFrozenSenderSucceeds() public {
        // Frozen sender — freeze bypassed by canForcedTransfer; recipient must still be compliant.
        compliance.freeze(holder);
        token.forcedTransfer(holder, receiver, 50e6);
        assertEq(token.balanceOf(receiver), 50e6);
    }

    function testForcedTransferFailsIfRecipientNotCompliant() public {
        address nonCompliant = address(0xBEBE);
        identity.registerUser(nonCompliant);
        // nonCompliant is registered in identity but has not accepted project terms.
        // canForcedTransfer checks isCompliant(to), which requires project compliance.

        vm.expectRevert();
        token.forcedTransfer(holder, nonCompliant, 10e6);
    }

    function testForcedTransferFailsIfInsufficientBalance() public {
        uint256 balance = token.balanceOf(holder);
        vm.expectRevert();
        token.forcedTransfer(holder, receiver, balance + 1e6);
    }

    function testForcedTransferEmitsEvent() public {
        vm.expectEmit(true, true, true, true, address(token));
        emit AsteraToken.ForcedTransfer(admin, holder, receiver, 50e6);
        token.forcedTransfer(holder, receiver, 50e6);
    }

    function testNonAdminCannotCallForcedTransfer() public {
        vm.prank(address(0xBAD));
        vm.expectRevert();
        token.forcedTransfer(holder, receiver, 10e6);
    }

    // ─── removeCompliantUser
    // ──────────────────────────────────────────────────────

    function testRemoveCompliantUserRevokesCompliance() public {
        assertTrue(compliance.isCompliant(holder));
        compliance.removeCompliantUser(holder);
        assertFalse(compliance.isCompliant(holder));
    }

    function testRemoveCompliantUserBlocksSubsequentTransfer() public {
        compliance.removeCompliantUser(holder);
        assertFalse(compliance.canTransfer(holder, receiver, 10e6));
    }

    function testRemoveCompliantUserOnlyAdmin() public {
        vm.prank(address(0xBAD));
        vm.expectRevert();
        compliance.removeCompliantUser(holder);
    }

    function testRemoveCompliantUserEmitsEvent() public {
        vm.expectEmit(true, false, false, false, address(compliance));
        emit AsteraComplianceManager.CompliantRemoved(holder);
        compliance.removeCompliantUser(holder);
    }

    // ─── reservedForSale accounting
    // ───────────────────────────────────────────

    function testReservedForSaleSetOnCreateSellOrder() public {
        assertEq(secondary.reservedForSale(address(token), holder), 0);
        vm.prank(holder);
        secondary.createSellOrder(address(token), 50e6, 1e6);
        assertEq(secondary.reservedForSale(address(token), holder), 50e6);
    }

    function testReservedForSaleReleasedOnCancel() public {
        vm.prank(holder);
        secondary.createSellOrder(address(token), 50e6, 1e6);
        assertEq(secondary.reservedForSale(address(token), holder), 50e6);

        vm.prank(holder);
        secondary.cancelSellOrder(1);
        assertEq(secondary.reservedForSale(address(token), holder), 0);
    }

    function testReservedForSaleReleasedOnFullFill() public {
        vm.prank(holder);
        secondary.createSellOrder(address(token), 10e6, 1e6);
        assertEq(secondary.reservedForSale(address(token), holder), 10e6);

        usdc.mint(receiver, 10e6);
        vm.startPrank(receiver);
        usdc.approve(address(secondary), 10e6);
        secondary.executeSellOrder(1, 10e6);
        vm.stopPrank();

        assertEq(secondary.reservedForSale(address(token), holder), 0);
    }

    function testReservedForSaleDecreasedOnPartialFill() public {
        vm.prank(holder);
        secondary.createSellOrder(address(token), 20e6, 1e6);

        usdc.mint(receiver, 5e6);
        vm.startPrank(receiver);
        usdc.approve(address(secondary), 5e6);
        secondary.executeSellOrder(1, 5e6);
        vm.stopPrank();

        assertEq(secondary.reservedForSale(address(token), holder), 15e6);
    }

    // ─── cancelSellOrder access control
    // ────────────────────────────────────────

    function testCancelSellOrderByNonSellerReverts() public {
        vm.prank(holder);
        secondary.createSellOrder(address(token), 10e6, 1e6);

        vm.prank(address(0xBAD));
        vm.expectRevert(
            abi.encodeWithSelector(
                AsteraSecondaryExchange.NotOrderSeller.selector, address(0xBAD), holder
            )
        );
        secondary.cancelSellOrder(1);
    }

    // ─── secondary market yearly limit
    // ──────────────────────────────────────

    function testSecondaryBuyExceedsYearlyLimitReverts() public {
        // Set a custom low yearly limit on the buyer so it's easy to exceed on secondary
        address limitedBuyer = address(0x1B1B);
        _registerAndComply(limitedBuyer);
        identity.setYearlyLimit(limitedBuyer, 5e6); // 5 USDC limit

        vm.prank(holder);
        secondary.createSellOrder(address(token), 100e6, 1e6); // 100 tokens at 1 USDC each

        usdc.mint(limitedBuyer, 100e6);
        vm.startPrank(limitedBuyer);
        usdc.approve(address(secondary), 100e6);
        vm.expectRevert(
            abi.encodeWithSelector(
                AsteraSecondaryExchange.InvestmentLimitExceeded.selector, limitedBuyer, 10e6
            )
        );
        secondary.executeSellOrder(1, 10e6); // 10 USDC gross → exceeds 5 USDC limit
        vm.stopPrank();
    }

    // ─── exchangeTransfer authorization
    // ─────────────────────────────────────

    function testExchangeTransferFromUnauthorizedCallerReverts() public {
        vm.prank(address(0xBAD));
        vm.expectRevert(
            abi.encodeWithSelector(AsteraToken.NotAuthorizedExchange.selector, address(0xBAD))
        );
        token.exchangeTransfer(holder, receiver, 10e6);
    }

    // ─── primary exchange never holds USDC
    // ──────────────────────────────────────

    function testPrimaryExchangeNeverHoldsUSDC() public {
        assertEq(usdc.balanceOf(address(exchange)), 0);
    }

    // ─── secondary exchange no residual USDC after fill
    // ───────────────────────────────────

    function testSecondaryExchangeNoResidualUSDCAfterFill() public {
        vm.prank(holder);
        secondary.createSellOrder(address(token), 10e6, 1e6);

        usdc.mint(receiver, 10e6);
        vm.startPrank(receiver);
        usdc.approve(address(secondary), 10e6);
        secondary.executeSellOrder(1, 10e6);
        vm.stopPrank();

        assertEq(usdc.balanceOf(address(secondary)), 0);
    }

    // ─── helpers
    // ─────────────────────────────────────────────────────────────

    function _registerAndComply(address user) internal {
        identity.registerUser(user);
        compliance.adminForceCompliant(user, "test setup");
    }

    function _primaryBuy(address user, uint256 amount) internal {
        usdc.mint(user, amount);
        vm.startPrank(user);
        usdc.approve(address(exchange), amount);
        exchange.buy(address(token), amount);
        vm.stopPrank();
    }
}
