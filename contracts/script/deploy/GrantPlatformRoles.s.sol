// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console2 } from "forge-std/Script.sol";
import { AsteraIdentityRegistry } from "../../src/identity/AsteraIdentityRegistry.sol";
import { AsteraPrimaryExchange } from "../../src/exchange/AsteraPrimaryExchange.sol";
import { AsteraSecondaryExchange } from "../../src/exchange/AsteraSecondaryExchange.sol";

/// @notice Grants the same platform roles held by the deployer to CO_ADMIN_1 and CO_ADMIN_2.
/// Run once after DeployPlatform. For per-token contracts (AsteraToken, AsteraComplianceManager)
/// the grants are handled in DeployToken.s.sol.
contract GrantPlatformRoles is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        AsteraIdentityRegistry identity = AsteraIdentityRegistry(vm.envAddress("IDENTITY_REGISTRY"));
        AsteraPrimaryExchange exchange = AsteraPrimaryExchange(vm.envAddress("EXCHANGE"));
        AsteraSecondaryExchange secondary =
            AsteraSecondaryExchange(vm.envAddress("EXCHANGE_SECONDARY"));

        address[2] memory newAdmins = [vm.envAddress("CO_ADMIN_1"), vm.envAddress("CO_ADMIN_2")];

        vm.startBroadcast(deployerPrivateKey);

        for (uint256 i = 0; i < newAdmins.length; i++) {
            address admin = newAdmins[i];

            identity.grantRole(identity.DEFAULT_ADMIN_ROLE(), admin);
            identity.grantRole(identity.IDENTITY_ADMIN_ROLE(), admin);

            exchange.grantRole(exchange.DEFAULT_ADMIN_ROLE(), admin);
            exchange.grantRole(exchange.EXCHANGE_ADMIN_ROLE(), admin);

            secondary.grantRole(secondary.DEFAULT_ADMIN_ROLE(), admin);
            secondary.grantRole(secondary.EXCHANGE_ADMIN_ROLE(), admin);

            console2.log("Roles granted on platform contracts to:", admin);
        }

        vm.stopBroadcast();
    }
}
