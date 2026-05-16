// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { AsteraIdentityRegistry } from "../../src/identity/AsteraIdentityRegistry.sol";
import { AsteraPrimaryExchange } from "../../src/exchange/AsteraPrimaryExchange.sol";
import { AsteraSecondaryExchange } from "../../src/exchange/AsteraSecondaryExchange.sol";
import { AsteraToken } from "../../src/token/AsteraToken.sol";
import { AsteraComplianceManager } from "../../src/compliance/AsteraComplianceManager.sol";
import { MockUSDC } from "../../src/mocks/MockUSDC.sol";

contract ExchangeFlowTest is Test {
    AsteraIdentityRegistry internal identity;
    AsteraPrimaryExchange internal exchange;
    AsteraSecondaryExchange internal secondary;
    AsteraToken internal token;
    AsteraComplianceManager internal compliance;
    MockUSDC internal usdc;

    address internal admin = address(this);
    address internal treasury = address(0xF1DE1);
    address internal feeRecipient = address(0xFEE);
    address internal buyer = address(0xB0B);
    address internal seller = address(0x5E11E2);
    address internal secondBuyer = address(0xBEEF);

    uint256 internal constant MAX_SUPPLY = 1000e6; // 1000 tokens
    uint256 internal constant SOFT_CAP = 100e6; // 100 tokens
    uint256 internal fundingDeadline;

    bytes32 internal constant GENERIC_DOC_HASH = keccak256("fideicomiso-terms-v1");
    string internal constant GENERIC_DOC_URI = "ipfs://QmTestGenericDoc";

    function setUp() public {
        vm.warp(1000);
        fundingDeadline = block.timestamp + 30 days;

        usdc = new MockUSDC();
        identity = new AsteraIdentityRegistry(admin);
        exchange = new AsteraPrimaryExchange(address(usdc), address(identity), feeRecipient, admin);
        secondary = new AsteraSecondaryExchange(
            address(usdc), address(identity), address(exchange), admin
        );

        // Wire: authorize secondary in identity registry and set it in exchange
        identity.setExchange(address(exchange), true);
        identity.setExchange(address(secondary), true);
        exchange.setExchangeSecondary(address(secondary));

        // createProjectToken now auto-authorizes secondary on the new token
        (address tokenAddr, address complianceAddr) = exchange.createProjectToken(
            "Fideicomiso Token",
            "FID",
            MAX_SUPPLY,
            SOFT_CAP,
            fundingDeadline,
            treasury,
            GENERIC_DOC_HASH,
            GENERIC_DOC_URI
        );
        token = AsteraToken(tokenAddr);
        compliance = AsteraComplianceManager(complianceAddr);

        _registerAndComply(buyer);
        _registerAndComply(seller);
        _registerAndComply(secondBuyer);

        usdc.mint(buyer, 10_000e6);
        usdc.mint(secondBuyer, 10_000e6);
    }

    // ─── wiring checks
    // ────────────────────────────────────────────────────────

    function testExchangeAuthorizedOnToken() public view {
        assertTrue(token.authorizedExchanges(address(exchange)));
    }

    function testSecondaryAuthorizedOnToken() public view {
        assertTrue(token.authorizedExchanges(address(secondary)));
    }

    // ─── primary market
    // ───────────────────────────────────────────────────────

    function testPrimaryBuyTransfersUSDCToTreasuryAndMintsTokens() public {
        vm.startPrank(buyer);
        usdc.approve(address(exchange), 10e6);
        exchange.buy(address(token), 10e6);
        vm.stopPrank();

        assertEq(usdc.balanceOf(treasury), 10e6);
        assertEq(token.balanceOf(buyer), 10e6);
        assertEq(identity.yearlySpent(buyer), 10e6);
    }

    function testDirectTokenTransferIsDisabled() public {
        _primaryBuy(buyer, 10e6);

        vm.prank(buyer);
        vm.expectRevert(AsteraToken.DirectTransfersDisabled.selector);
        token.transfer(secondBuyer, 1e6);
    }

    function testCannotBuyAfterFundingCompleted() public {
        _primaryBuy(buyer, SOFT_CAP);
        compliance.setFundingCompleted();

        vm.startPrank(secondBuyer);
        usdc.approve(address(exchange), 1e6);
        vm.expectRevert();
        exchange.buy(address(token), 1e6);
        vm.stopPrank();
    }

    // ─── secondary market
    // ─────────────────────────────────────────────────────

    function testSecondaryOrderPartialFillFeeAndAccounting() public {
        _primaryBuy(seller, 100e6);
        compliance.setFundingCompleted();

        vm.prank(seller);
        secondary.createSellOrder(address(token), 10e6, 1e6); // 10 tokens at 1 USDC each

        vm.startPrank(secondBuyer);
        usdc.approve(address(secondary), 5e6);
        secondary.executeSellOrder(1, 5e6);
        vm.stopPrank();

        assertEq(token.balanceOf(secondBuyer), 5e6);
        assertEq(token.balanceOf(seller), 95e6);
        assertEq(usdc.balanceOf(feeRecipient), 50_000);
        assertEq(usdc.balanceOf(seller), 4.95e6);
        assertEq(identity.yearlySpent(secondBuyer), 5e6);
        assertEq(identity.yearlySpent(seller), 95e6);
        assertEq(secondary.activeSellOrderCount(), 1);
    }

    function testSecondaryOrderFullFillRemovesOrder() public {
        _primaryBuy(seller, 100e6);
        compliance.setFundingCompleted();

        vm.prank(seller);
        secondary.createSellOrder(address(token), 10e6, 1e6);

        vm.startPrank(secondBuyer);
        usdc.approve(address(secondary), 10e6);
        secondary.executeSellOrder(1, 10e6);
        vm.stopPrank();

        assertEq(secondary.activeSellOrderCount(), 0);
        assertEq(identity.yearlySpent(seller), 90e6);
    }

    function testCannotOverReserveSameTokensAcrossOrders() public {
        _primaryBuy(seller, 100e6);
        compliance.setFundingCompleted();

        vm.startPrank(seller);
        secondary.createSellOrder(address(token), 100e6, 1e6);
        vm.expectRevert();
        secondary.createSellOrder(address(token), 1e6, 1e6);
        vm.stopPrank();
    }

    function testSellerCanCancelOrder() public {
        _primaryBuy(seller, 100e6);
        compliance.setFundingCompleted();

        vm.prank(seller);
        secondary.createSellOrder(address(token), 10e6, 1e6);

        vm.prank(seller);
        secondary.cancelSellOrder(1);

        assertEq(secondary.activeSellOrderCount(), 0);
    }

    function testPartialFreezeBlocksUnavailableBalanceOrder() public {
        _primaryBuy(seller, 100e6);
        compliance.setFundingCompleted();
        compliance.freezePartial(seller, 95e6);

        vm.prank(seller);
        vm.expectRevert();
        secondary.createSellOrder(address(token), 10e6, 1e6);
    }

    // ─── createProjectToken
    // ───────────────────────────────────────────────

    function testCreateProjectTokenRevertsIfSoftCapExceedsMaxSupply() public {
        vm.expectRevert(AsteraPrimaryExchange.InvalidCaps.selector);
        exchange.createProjectToken(
            "T",
            "T",
            100e6,
            200e6,
            block.timestamp + 1 days,
            treasury,
            GENERIC_DOC_HASH,
            GENERIC_DOC_URI
        );
    }

    function testCreateProjectTokenRevertsIfDeadlineInPast() public {
        vm.expectRevert(AsteraPrimaryExchange.DeadlineInPast.selector);
        exchange.createProjectToken(
            "T", "T", 1000e6, 100e6, block.timestamp, treasury, GENERIC_DOC_HASH, GENERIC_DOC_URI
        );
    }

    function testCreateProjectTokenDeploysAndRegisters() public {
        (address newToken, address newCompliance) = exchange.createProjectToken(
            "Test Token",
            "TST",
            500e6,
            50e6,
            block.timestamp + 7 days,
            treasury,
            GENERIC_DOC_HASH,
            GENERIC_DOC_URI
        );

        assertTrue(exchange.supportedTokens(newToken));
        assertEq(exchange.complianceOf(newToken), newCompliance);
        assertEq(exchange.tokenCap(newToken), 500e6);
        assertEq(AsteraToken(newToken).cap(), 500e6);
        assertEq(AsteraComplianceManager(newCompliance).softCap(), 50e6);
        // secondary auto-authorized
        assertTrue(AsteraToken(newToken).authorizedExchanges(address(secondary)));
    }

    // ─── fundingDeadline enforcement
    // ────────────────────────────────────

    function testBuyRevertsIfDeadlineExpired() public {
        vm.warp(fundingDeadline + 1);

        vm.startPrank(buyer);
        usdc.approve(address(exchange), 10e6);
        vm.expectRevert(
            abi.encodeWithSelector(
                AsteraPrimaryExchange.FundingDeadlineExpired.selector, address(token)
            )
        );
        exchange.buy(address(token), 10e6);
        vm.stopPrank();
    }

    function testBuySucceedsBeforeDeadline() public {
        vm.warp(fundingDeadline - 1);

        vm.startPrank(buyer);
        usdc.approve(address(exchange), 10e6);
        exchange.buy(address(token), 10e6);
        vm.stopPrank();

        assertEq(token.balanceOf(buyer), 10e6);
    }

    // ─── cap enforcement
    // ──────────────────────────────────────────────────

    function testBuyRevertsIfAmountExceedsCap() public {
        vm.startPrank(buyer);
        usdc.approve(address(exchange), MAX_SUPPLY + 1e6);
        vm.expectRevert(
            abi.encodeWithSelector(
                AsteraPrimaryExchange.CapExceeded.selector, MAX_SUPPLY + 1e6, MAX_SUPPLY
            )
        );
        exchange.buy(address(token), MAX_SUPPLY + 1e6);
        vm.stopPrank();
    }

    function testBuyAllowsExactCapAmount() public {
        _primaryBuy(buyer, MAX_SUPPLY);

        assertEq(token.totalSupply(), MAX_SUPPLY);
        assertEq(token.balanceOf(buyer), MAX_SUPPLY);
    }

    function testBuyAtCapAutoCompletesFunding() public {
        _primaryBuy(buyer, MAX_SUPPLY);

        assertTrue(compliance.fundingCompleted());
    }

    function testBuyAtCapEmitsFundingCompletedEventWithAutoCloseTrue() public {
        usdc.mint(buyer, MAX_SUPPLY);
        vm.startPrank(buyer);
        usdc.approve(address(exchange), MAX_SUPPLY);

        vm.expectEmit(true, false, false, true, address(compliance));
        emit AsteraComplianceManager.FundingCompleted(address(token), MAX_SUPPLY, SOFT_CAP, true);

        exchange.buy(address(token), MAX_SUPPLY);
        vm.stopPrank();
    }

    // ─── manual setFundingCompleted
    // ──────────────────────────────────────

    function testAdminCanManuallyCloseIfSoftCapReachedAndDeadlineNotExpired() public {
        _primaryBuy(buyer, SOFT_CAP);

        compliance.setFundingCompleted();

        assertTrue(compliance.fundingCompleted());
    }

    function testAdminCannotCloseIfSoftCapNotReached() public {
        _primaryBuy(buyer, SOFT_CAP - 1e6);

        vm.expectRevert(
            abi.encodeWithSelector(
                AsteraComplianceManager.SoftCapNotReached.selector, SOFT_CAP - 1e6, SOFT_CAP
            )
        );
        compliance.setFundingCompleted();
    }

    function testAdminCannotCloseIfDeadlineExpired() public {
        _primaryBuy(buyer, SOFT_CAP);
        vm.warp(fundingDeadline + 1);

        vm.expectRevert(AsteraComplianceManager.DeadlineExpired.selector);
        compliance.setFundingCompleted();
    }

    function testManualCloseIsIrreversible() public {
        _primaryBuy(buyer, SOFT_CAP);
        compliance.setFundingCompleted();

        vm.expectRevert(AsteraComplianceManager.AlreadyCompleted.selector);
        compliance.setFundingCompleted();
    }

    function testBuyRevertsAfterAutoClose() public {
        _primaryBuy(buyer, MAX_SUPPLY);
        assertTrue(compliance.fundingCompleted(), "auto-close should have fired");

        vm.startPrank(secondBuyer);
        usdc.approve(address(exchange), 1e6);
        vm.expectRevert(
            abi.encodeWithSelector(
                AsteraPrimaryExchange.FundingAlreadyCompleted.selector, address(token)
            )
        );
        exchange.buy(address(token), 1e6);
        vm.stopPrank();
    }

    function testSetFundingCompletedRevertsAfterAutoClose() public {
        _primaryBuy(buyer, MAX_SUPPLY);
        assertTrue(compliance.fundingCompleted(), "auto-close should have fired");

        vm.expectRevert(AsteraComplianceManager.AlreadyCompleted.selector);
        compliance.setFundingCompleted();
    }

    // ─── secondary market requires fundingCompleted
    // ──────────────────────

    function testSecondaryMarketRevertsIfFundingNotCompleted() public {
        _primaryBuy(seller, SOFT_CAP);

        vm.prank(seller);
        vm.expectRevert(
            abi.encodeWithSelector(
                AsteraSecondaryExchange.FundingNotCompleted.selector, address(token)
            )
        );
        secondary.createSellOrder(address(token), 10e6, 1e6);
    }

    function testSecondaryMarketWorksAfterFundingCompleted() public {
        _primaryBuy(seller, SOFT_CAP);
        compliance.setFundingCompleted();

        vm.prank(seller);
        secondary.createSellOrder(address(token), 10e6, 1e6);

        assertEq(secondary.activeSellOrderCount(), 1);
    }

    // ─── happy path end-to-end
    // ─────────────────────────────────────────────

    function testHappyPathEndToEnd() public {
        // 1. buy in primary
        _primaryBuy(seller, 100e6);
        // 2. close funding
        compliance.setFundingCompleted();
        // 3. create sell order
        vm.prank(seller);
        secondary.createSellOrder(address(token), 20e6, 1e6);
        assertEq(secondary.activeSellOrderCount(), 1);
        // 4. partial fill
        vm.startPrank(secondBuyer);
        usdc.approve(address(secondary), 10e6);
        secondary.executeSellOrder(1, 10e6);
        vm.stopPrank();
        assertEq(token.balanceOf(secondBuyer), 10e6);
        assertEq(secondary.activeSellOrderCount(), 1);
        // 5. cancel remaining
        vm.prank(seller);
        secondary.cancelSellOrder(1);
        assertEq(secondary.activeSellOrderCount(), 0);
    }

    // ─── setExchangeSecondary validation
    // ─────────────────────────────────────

    function testSetExchangeSecondaryRevertsOnZeroAddress() public {
        vm.expectRevert(AsteraPrimaryExchange.ZeroAddress.selector);
        exchange.setExchangeSecondary(address(0));
    }

    // ─── deploy config assumptions
    // ────────────────────────────────────────

    function testDeployConfigAdminHasRolesAndWiringIsCorrect() public view {
        assertTrue(exchange.hasRole(exchange.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(exchange.hasRole(exchange.EXCHANGE_ADMIN_ROLE(), admin));
        assertTrue(secondary.hasRole(secondary.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(secondary.hasRole(secondary.EXCHANGE_ADMIN_ROLE(), admin));
        assertEq(exchange.exchangeSecondary(), address(secondary));
        assertEq(address(secondary.exchange()), address(exchange));
    }

    // ─── grossUSDC == 0 guard
    // ──────────────────────────────────────────────

    function testExecuteSellOrderRevertsIfGrossUSDCIsZero() public {
        _primaryBuy(seller, 100e6);
        compliance.setFundingCompleted();

        // 1 micro-USDC per token: (1 micro-token * 1) / 1e6 = 0
        vm.prank(seller);
        secondary.createSellOrder(address(token), 10e6, 1);

        vm.prank(secondBuyer);
        vm.expectRevert(AsteraSecondaryExchange.ZeroAmount.selector);
        secondary.executeSellOrder(1, 1);
    }

    // ─── helpers
    // ─────────────────────────────────────────────────────────

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
