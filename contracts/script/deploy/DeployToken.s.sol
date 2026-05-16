// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console2 } from "forge-std/Script.sol";
import { AsteraPrimaryExchange } from "../../src/exchange/AsteraPrimaryExchange.sol";

contract DeployToken is Script {
    function run() external returns (address tokenAddr, address complianceAddr) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        string memory tokenName = vm.envString("TOKEN_NAME");
        string memory tokenSymbol = vm.envString("TOKEN_SYMBOL");
        uint256 maxSupply = vm.envUint("TOKEN_MAX_SUPPLY");
        uint256 softCap = vm.envUint("TOKEN_SOFT_CAP");
        uint256 fundingDeadline = vm.envUint("TOKEN_FUNDING_DEADLINE");
        address fideicomisoWallet = vm.envAddress("FIDEICOMISO_WALLET");
        bytes32 genericDocumentHash = vm.envBytes32("GENERIC_DOCUMENT_HASH");
        string memory genericDocumentURI = vm.envString("GENERIC_DOCUMENT_URI");

        address exchange = vm.envAddress("EXCHANGE");

        vm.startBroadcast(deployerPrivateKey);
        (tokenAddr, complianceAddr) = AsteraPrimaryExchange(exchange)
            .createProjectToken(
                tokenName,
                tokenSymbol,
                maxSupply,
                softCap,
                fundingDeadline,
                fideicomisoWallet,
                genericDocumentHash,
                genericDocumentURI
            );
        vm.stopBroadcast();

        console2.log("AsteraToken:", tokenAddr);
        console2.log("AsteraComplianceManager:", complianceAddr);
        console2.log("Fideicomiso wallet:", fideicomisoWallet);
        console2.log("Max supply:", maxSupply);
        console2.log("Soft cap:", softCap);
        console2.log("Funding deadline:", fundingDeadline);
    }
}
