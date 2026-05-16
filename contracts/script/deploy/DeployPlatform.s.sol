// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console2 } from "forge-std/Script.sol";
import { AsteraIdentityRegistry } from "../../src/identity/AsteraIdentityRegistry.sol";
import { AsteraPrimaryExchange } from "../../src/exchange/AsteraPrimaryExchange.sol";
import { AsteraSecondaryExchange } from "../../src/exchange/AsteraSecondaryExchange.sol";

contract DeployPlatform is Script {
    function run()
        external
        returns (
            AsteraIdentityRegistry identity,
            AsteraPrimaryExchange exchange,
            AsteraSecondaryExchange secondary
        )
    {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address asteraAdmin = vm.envAddress("ASTERA_ADMIN");
        address feeRecipient = vm.envAddress("FEE_RECIPIENT");
        address usdc = vm.envAddress("USDC_ADDRESS");

        address deployer = vm.addr(deployerPrivateKey);
        require(
            deployer == asteraAdmin, "DeployPlatform: PRIVATE_KEY wallet must equal ASTERA_ADMIN"
        );
        require(
            deployer == feeRecipient, "DeployPlatform: PRIVATE_KEY wallet must equal FEE_RECIPIENT"
        );

        vm.startBroadcast(deployerPrivateKey);

        identity = new AsteraIdentityRegistry(asteraAdmin);
        exchange = new AsteraPrimaryExchange(usdc, address(identity), feeRecipient, asteraAdmin);
        secondary =
            new AsteraSecondaryExchange(usdc, address(identity), address(exchange), asteraAdmin);

        identity.setExchange(address(exchange), true);
        identity.setExchange(address(secondary), true);
        exchange.setExchangeSecondary(address(secondary));

        vm.stopBroadcast();

        console2.log("AsteraIdentityRegistry:", address(identity));
        console2.log("AsteraPrimaryExchange:", address(exchange));
        console2.log("AsteraSecondaryExchange:", address(secondary));
        console2.log("USDC:", usdc);
        console2.log("Astera admin:", asteraAdmin);
        console2.log("Fee recipient:", feeRecipient);
    }
}
