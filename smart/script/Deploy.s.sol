// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {AccessManager} from "../src/AccessManager.sol";
import {RecyclingTraceability} from "../src/RecyclingTraceability.sol";

contract DeployScript is Script {
    uint256 adminPk = vm.envUint("ADMIN_PRIVATE_KEY");
    address adminAddress = vm.envAddress("ADMIN_ADDRESS");

    function run() external {
        vm.startBroadcast(adminPk);

        AccessManager access = new AccessManager(adminAddress);

        new RecyclingTraceability(address(access));

        vm.stopBroadcast();
    }
}
