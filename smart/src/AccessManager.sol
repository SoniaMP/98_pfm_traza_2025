// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

contract AccessManager is AccessControl {
    // --- Roles ---
    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant CITIZEN = keccak256("CITIZEN");
    bytes32 public constant TRANSPORTER = keccak256("TRANSPORTER");
    bytes32 public constant PROCESSOR = keccak256("PROCESSOR");
    bytes32 public constant REWARD_AUTHORITY = keccak256("REWARD_AUTHORITY");

    // --- Estados ---
    enum AccountStatus {
        None,
        Pending,
        Approved,
        Rejected,
        Canceled
    }

    struct Account {
        bytes32 role;
        uint8 status;
    }

    struct AccountView {
        address account;
        bytes32 role;
        uint8 status;
    }

    // --- Storage ---
    mapping(address => Account) private accounts;
    address[] private _allAccounts;
    mapping(address => bool) private _accountExists;

    // --- Eventos ---
    event RoleRequested(address indexed account, bytes32 indexed role);
    event AccountApproved(address indexed account, bytes32 indexed role);
    event AccountRejected(address indexed account);
    event AccountCanceled(address indexed account);

    // --- Constructor ---
    constructor(address _admin) {
        require(_admin != address(0), "Admin cannot be zero address");

        _grantRole(ADMIN, _admin);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);

        accounts[_admin] = Account({
            role: ADMIN,
            status: uint8(AccountStatus.Approved)
        });

        _allAccounts.push(_admin);
        _accountExists[_admin] = true;
    }

    // --- Solicitud de rol ---
    function requestRole(bytes32 role) external {
        require(isValidRole(role), "Invalid role");
        Account storage acc = accounts[msg.sender];
        require(
            acc.status == uint8(AccountStatus.None),
            "Already requested or processed"
        );

        accounts[msg.sender] = Account({
            role: role,
            status: uint8(AccountStatus.Pending)
        });

        if (!_accountExists[msg.sender]) {
            _allAccounts.push(msg.sender);
            _accountExists[msg.sender] = true;
        }

        emit RoleRequested(msg.sender, role);
    }

    // --- Aprobación ---
    function approveAccount(address account) external onlyRole(ADMIN) {
        Account storage acc = accounts[account];

        acc.status = uint8(AccountStatus.Approved);
        _grantRole(acc.role, account);

        emit AccountApproved(account, acc.role);
    }

    // --- Rechazo ---
    function rejectAccount(address account) external onlyRole(ADMIN) {
        Account storage acc = accounts[account];

        acc.status = uint8(AccountStatus.Rejected);
        emit AccountRejected(account);
    }

    // --- Cancelación ---
    function cancelAccount(address account) external onlyRole(ADMIN) {
        Account storage acc = accounts[account];
        require(acc.status == uint8(AccountStatus.Approved), "Not approved");

        acc.status = uint8(AccountStatus.Canceled);
        _revokeRole(acc.role, account);

        emit AccountCanceled(account);
    }

    // --- Consultas ---
    function getAccountInfo(
        address user
    ) external view returns (address account, bytes32 role, uint8 status) {
        Account memory acc = accounts[user];
        return (user, acc.role, acc.status);
    }

    function getAllAccounts()
        external
        view
        returns (AccountView[] memory list)
    {
        uint256 total = _allAccounts.length;
        list = new AccountView[](total);

        for (uint256 i = 0; i < total; i++) {
            address member = _allAccounts[i];
            Account storage acc = accounts[member];
            list[i] = AccountView({
                account: member,
                role: acc.role,
                status: acc.status
            });
        }
    }

    function hasActiveRole(
        address account,
        bytes32 role
    ) external view returns (bool) {
        Account memory acc = accounts[account];
        return
            acc.status == uint8(AccountStatus.Approved) &&
            hasRole(role, account);
    }

    // --- Validaciones ---
    function isValidRole(bytes32 role) public pure returns (bool) {
        return
            role == ADMIN ||
            role == CITIZEN ||
            role == TRANSPORTER ||
            role == PROCESSOR ||
            role == REWARD_AUTHORITY;
    }

}
