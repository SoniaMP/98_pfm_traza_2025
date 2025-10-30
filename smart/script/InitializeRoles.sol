// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {AccessManager} from "../src/AccessManager.sol";

contract InitializeRoles is Script {
    address accessManagerAddress = vm.envAddress("ACCESS_MANAGER_ADDRESS");
    uint256 adminPk = vm.envUint("ADMIN_PRIVATE_KEY");
    uint256 citizenPk = vm.envUint("CITIZEN_PRIVATE_KEY");
    address citizenAddress = vm.envAddress("CITIZEN_ADDRESS");
    uint256 transporterPk = vm.envUint("TRANSPORTER_PRIVATE_KEY");
    address transporterAddress = vm.envAddress("TRANSPORTER_ADDRESS");
    uint256 processorPk = vm.envUint("PROCESSOR_PRIVATE_KEY");
    address processorAddress = vm.envAddress("PROCESSOR_ADDRESS");
    uint256 rewardAuthorityPk = vm.envUint("REWARD_AUTHORITY_PRIVATE_KEY");
    address rewardAuthorityAddress = vm.envAddress("REWARD_AUTHORITY_ADDRESS");

    function run() external {
        AccessManager access = AccessManager(accessManagerAddress);

        // --- Leer los roles antes de hacer broadcast ---
        bytes32 citizenRole = access.CITIZEN();
        bytes32 transporterRole = access.TRANSPORTER();
        bytes32 processorRole = access.PROCESSOR();
        bytes32 rewardRole = access.REWARD_AUTHORITY();

        // --- PASO 1: Solicitudes de rol ---
        vm.startBroadcast(citizenPk);
        access.requestRole(citizenRole);
        vm.stopBroadcast();

        vm.startBroadcast(transporterPk);
        access.requestRole(transporterRole);
        vm.stopBroadcast();

        vm.startBroadcast(processorPk);
        access.requestRole(processorRole);
        vm.stopBroadcast();

        vm.startBroadcast(rewardAuthorityPk);
        access.requestRole(rewardRole);
        vm.stopBroadcast();

        // --- PASO 2: Aprobaciones del admin ---
        vm.startBroadcast(adminPk);

        access.approveAccount(citizenAddress);
        access.approveAccount(transporterAddress);
        access.approveAccount(processorAddress);
        access.approveAccount(rewardAuthorityAddress);

        vm.stopBroadcast();
    }
}
