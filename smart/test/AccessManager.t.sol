// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {AccessManager} from "../src/AccessManager.sol";

contract AccessManagerTest is Test {
    AccessManager public manager;
    address public admin = address(1);
    address public user1 = address(2);
    address public user2 = address(3);

    bytes32 constant ADMIN = keccak256("ADMIN");
    bytes32 constant CITIZEN = keccak256("CITIZEN");
    bytes32 constant TRANSPORTER = keccak256("TRANSPORTER");
    bytes32 constant PROCESSOR = keccak256("PROCESSOR");
    bytes32 constant REWARD_AUTHORITY = keccak256("REWARD_AUTHORITY");

    function setUp() public {
        manager = new AccessManager(admin);
    }

    // --- 1️⃣ Deploy ---
    function test_AdminHasRoleAfterDeploy() public view {
        assertTrue(manager.hasRole(ADMIN, admin), "Admin role missing");
        assertTrue(
            manager.hasRole(manager.DEFAULT_ADMIN_ROLE(), admin),
            "Default admin role missing"
        );

        (address account, bytes32 role, uint8 status) = manager.getAccountInfo(
            admin
        );
        assertEq(account, admin);
        assertEq(role, ADMIN);
        assertEq(status, uint8(AccessManager.AccountStatus.Approved));
    }

    // --- 2️⃣ Solicitud de rol ---
    function test_UserCanRequestRole() public {
        vm.startPrank(user1);
        manager.requestRole(CITIZEN);
        vm.stopPrank();

        (, bytes32 role, uint8 status) = manager.getAccountInfo(user1);
        assertEq(role, CITIZEN);
        assertEq(status, uint8(AccessManager.AccountStatus.Pending));
    }

    function test_RevertIfRequestInvalidRole() public {
        vm.startPrank(user1);
        vm.expectRevert("Invalid role");
        manager.requestRole(keccak256("INVALID_ROLE"));
        vm.stopPrank();
    }

    function test_RevertIfAlreadyRequested() public {
        vm.startPrank(user1);
        manager.requestRole(TRANSPORTER);
        vm.expectRevert("Already requested or processed");
        manager.requestRole(TRANSPORTER);
        vm.stopPrank();
    }

    // --- 3️⃣ Aprobación ---
    function test_AdminCanApproveAccount() public {
        vm.startPrank(user1);
        manager.requestRole(CITIZEN);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user1);
        vm.stopPrank();

        (, bytes32 role, uint8 status) = manager.getAccountInfo(user1);
        assertEq(role, CITIZEN);
        assertEq(status, uint8(AccessManager.AccountStatus.Approved));
        assertTrue(manager.hasRole(CITIZEN, user1));
    }

    // --- 4️⃣ Rechazo ---
    function test_AdminCanRejectAccount() public {
        vm.startPrank(user1);
        manager.requestRole(TRANSPORTER);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.rejectAccount(user1);
        vm.stopPrank();

        (, , uint8 status) = manager.getAccountInfo(user1);
        assertEq(status, uint8(AccessManager.AccountStatus.Rejected));
        assertFalse(manager.hasRole(TRANSPORTER, user1));
    }

    // --- 5️⃣ Cancelación ---
    function test_AdminCanCancelAccount() public {
        vm.startPrank(user1);
        manager.requestRole(PROCESSOR);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user1);
        manager.cancelAccount(user1);
        vm.stopPrank();

        (, , uint8 status) = manager.getAccountInfo(user1);
        assertEq(status, uint8(AccessManager.AccountStatus.Canceled));
        assertFalse(manager.hasRole(PROCESSOR, user1));
    }

    function test_RevertIfCancelWithoutApproval() public {
        vm.startPrank(user1);
        manager.requestRole(REWARD_AUTHORITY);
        vm.stopPrank();

        vm.startPrank(admin);
        vm.expectRevert("Not approved");
        manager.cancelAccount(user1);
        vm.stopPrank();
    }

    // --- 6️⃣ Roles activos ---
    function test_HasActiveRole() public {
        vm.startPrank(user1);
        manager.requestRole(CITIZEN);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user1);
        vm.stopPrank();

        assertTrue(manager.hasActiveRole(user1, CITIZEN));
    }

    // --- 7️⃣ Listado completo ---
    function test_GetAllAccounts() public {
        // User1 solicita y se aprueba
        vm.startPrank(user1);
        manager.requestRole(CITIZEN);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user1);
        vm.stopPrank();

        // User2 solicita y se aprueba
        vm.startPrank(user2);
        manager.requestRole(TRANSPORTER);
        vm.stopPrank();

        vm.startPrank(admin);
        manager.approveAccount(user2);
        vm.stopPrank();

        // Obtener todas las cuentas
        AccessManager.AccountView[] memory accounts = manager.getAllAccounts();

        // Debe haber 3: admin + user1 + user2
        assertEq(accounts.length, 3, "Expected 3 accounts total");

        bool adminFound;
        bool user1Found;
        bool user2Found;

        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i].account == admin) {
                adminFound = true;
                assertEq(accounts[i].role, ADMIN);
                assertEq(
                    accounts[i].status,
                    uint8(AccessManager.AccountStatus.Approved)
                );
            } else if (accounts[i].account == user1) {
                user1Found = true;
                assertEq(accounts[i].role, CITIZEN);
                assertEq(
                    accounts[i].status,
                    uint8(AccessManager.AccountStatus.Approved)
                );
            } else if (accounts[i].account == user2) {
                user2Found = true;
                assertEq(accounts[i].role, TRANSPORTER);
                assertEq(
                    accounts[i].status,
                    uint8(AccessManager.AccountStatus.Approved)
                );
            } else {
                fail("Unexpected account in list");
            }
        }

        assertTrue(adminFound, "Admin not found");
        assertTrue(user1Found, "User1 not found");
        assertTrue(user2Found, "User2 not found");
    }
}
