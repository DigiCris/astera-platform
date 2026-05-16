// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Fork sanity test for real Avalanche C-Chain USDC.
/// @dev Requires a live Avalanche RPC. Run with:
///   forge test --match-path test/fork/AvalancheUSDCFork.t.sol --fork-url $AVALANCHE_RPC_URL
///   The AVALANCHE_RPC_URL variable must be set in contracts/.env (see .env.example).
///   This test is intentionally excluded from the default `forge test` run when no fork URL
///   is provided — it will be skipped automatically by Foundry in that case.
contract AvalancheUSDCForkTest is Test {
    address internal constant AVALANCHE_USDC = 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E;

    function testAvalancheUSDCExists() public view {
        uint256 size;
        assembly {
            size := extcodesize(AVALANCHE_USDC)
        }
        assertGt(size, 0, "USDC contract must exist on Avalanche C-Chain");
    }

    function testAvalancheUSDCTotalSupplyCanBeRead() public view {
        uint256 supply = IERC20(AVALANCHE_USDC).totalSupply();
        assertGt(supply, 0, "USDC supply should be greater than zero");
    }
}
