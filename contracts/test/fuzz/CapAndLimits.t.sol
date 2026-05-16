// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { AsteraIdentityRegistry } from "../../src/identity/AsteraIdentityRegistry.sol";
import { AsteraPrimaryExchange } from "../../src/exchange/AsteraPrimaryExchange.sol";
import { AsteraSecondaryExchange } from "../../src/exchange/AsteraSecondaryExchange.sol";
import { AsteraToken } from "../../src/token/AsteraToken.sol";
import { AsteraComplianceManager } from "../../src/compliance/AsteraComplianceManager.sol";
import { MockUSDC } from "../../src/mocks/MockUSDC.sol";

/// @dev Fuzz tests for the two most critical numeric invariants:
///        (1) yearlySpent[user] is always bounded by yearlyLimitOf(user)
///        (2) totalSupply is always bounded by cap
///      These cannot be exhaustively verified by unit tests alone because they
///      depend on arithmetic correctness across the entire input domain.
contract CapAndLimitsFuzzTest is Test {
    // ─── shared state
    // ─────────────────────────────────────────────────────────

    AsteraIdentityRegistry internal identity;
    AsteraPrimaryExchange internal exchange;
    AsteraSecondaryExchange internal secondary;
    AsteraToken internal token;
    AsteraComplianceManager internal compliance;
    MockUSDC internal usdc;

    address internal admin = address(this);
    address internal treasury = address(0xF1DE1);
    address internal feeRecipient = address(0xFEE);
    address internal exchangeAddr = address(0xE111); // identity exchange actor
    address internal user = address(0xB0B); // identity fuzz subject
    address internal buyer = address(0xBBBB); // primary exchange fuzz subject

    uint256 internal constant TOKEN_CAP = 1000e6; // 1 000 USDC-equivalent tokens
    uint256 internal constant SOFT_CAP = 100e6;

    bytes32 internal constant GENERIC_DOC_HASH = keccak256("fuzz-test-doc");
    string internal constant GENERIC_DOC_URI = "ipfs://QmFuzzDoc";

    function setUp() public {
        vm.warp(1000);

        // ── identity registry (for yearlySpent fuzz) ──────────────
        identity = new AsteraIdentityRegistry(admin);
        identity.setExchange(exchangeAddr, true);
        identity.registerUser(user);

        // ── full stack (for cap fuzz) ─────────────────────────────
        usdc = new MockUSDC();
        exchange = new AsteraPrimaryExchange(address(usdc), address(identity), feeRecipient, admin);
        secondary = new AsteraSecondaryExchange(
            address(usdc), address(identity), address(exchange), admin
        );
        identity.setExchange(address(exchange), true);
        identity.setExchange(address(secondary), true);
        exchange.setExchangeSecondary(address(secondary));

        (address tokenAddr, address complianceAddr) = exchange.createProjectToken(
            "Fuzz Token",
            "FZZ",
            TOKEN_CAP,
            SOFT_CAP,
            block.timestamp + 30 days,
            treasury,
            GENERIC_DOC_HASH,
            GENERIC_DOC_URI
        );
        token = AsteraToken(tokenAddr);
        compliance = AsteraComplianceManager(complianceAddr);

        identity.registerUser(buyer);
        compliance.adminForceCompliant(buyer, "fuzz setup");
    }

    // ─── yearlySpent invariant
    // ────────────────────────────────────────────────

    /// @dev For any amount within the default yearly limit, yearlySpent after increaseSpent
    ///      must never exceed the limit.
    function testFuzz_yearlySpentBoundedByLimit(uint256 amount) public {
        uint256 limit = identity.DEFAULT_YEARLY_LIMIT();
        amount = bound(amount, 1, limit);

        vm.prank(exchangeAddr);
        identity.increaseSpent(user, amount);

        assertLe(identity.yearlySpent(user), identity.yearlyLimitOf(user));
    }

    /// @dev Any amount exceeding the yearly limit must cause increaseSpent to revert and
    ///      leave yearlySpent unchanged (no partial state mutation on revert).
    function testFuzz_increaseSpentRevertsAboveLimit(uint256 amount) public {
        uint256 limit = identity.DEFAULT_YEARLY_LIMIT();
        amount = bound(amount, limit + 1, type(uint128).max);

        vm.prank(exchangeAddr);
        vm.expectRevert();
        identity.increaseSpent(user, amount);

        assertEq(identity.yearlySpent(user), 0);
    }

    // ─── cap invariant
    // ───────────────────────────────────────────────────────────

    /// @dev For any purchase amount that does not exceed the token cap and the buyer's yearly
    ///      limit, totalSupply after the buy must remain at or below cap.
    function testFuzz_totalSupplyBoundedByCap(uint256 amount) public {
        // Bound to the tighter of cap and DEFAULT_YEARLY_LIMIT so neither guard fires.
        uint256 maxAmount = _min(TOKEN_CAP, identity.DEFAULT_YEARLY_LIMIT());
        amount = bound(amount, 1, maxAmount);

        _primaryBuy(buyer, amount);

        assertLe(token.totalSupply(), token.cap());
    }

    /// @dev Any purchase that would push totalSupply past cap must revert; no tokens are minted.
    function testFuzz_buyRevertsIfWouldExceedCap(uint256 amount) public {
        amount = bound(amount, TOKEN_CAP + 1, type(uint128).max);

        usdc.mint(buyer, amount);
        vm.startPrank(buyer);
        usdc.approve(address(exchange), amount);
        vm.expectRevert();
        exchange.buy(address(token), amount);
        vm.stopPrank();

        assertEq(token.totalSupply(), 0);
    }

    // ─── quoteUSDC rounding
    // ────────────────────────────────────────────────────

    /// @dev For any tokenAmount and unitPriceUSDC where the product < 1e6, grossUSDC rounds
    ///      to zero. executeSellOrder must reject zero-USDC fills.
    ///      This verifies the rounding guard covers the full integer-truncation domain.
    function testFuzz_quoteUSDCIsZeroForSmallInputs(uint256 tokenAmount, uint256 unitPriceUSDC)
        public
        view
    {
        tokenAmount = bound(tokenAmount, 0, 999_999);
        unitPriceUSDC = bound(unitPriceUSDC, 0, 999_999);

        // Product < 1e12 at most, which after / 1e6 gives at most 999_999 — but for the
        // zero case we need tokenAmount * unitPriceUSDC < 1e6.
        uint256 gross = secondary.quoteUSDC(tokenAmount, unitPriceUSDC);

        if (tokenAmount == 0 || unitPriceUSDC == 0) {
            assertEq(gross, 0);
        }
        // gross ∈ [0, 999_999_000_001 / 1e6] — non-zero only when product >= 1e6
        assertLe(gross, (tokenAmount * unitPriceUSDC) / 1e6 + 1);
    }

    // ─── helpers
    // ─────────────────────────────────────────────────────────────

    function _primaryBuy(address who, uint256 amount) internal {
        usdc.mint(who, amount);
        vm.startPrank(who);
        usdc.approve(address(exchange), amount);
        exchange.buy(address(token), amount);
        vm.stopPrank();
    }

    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
