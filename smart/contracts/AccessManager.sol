// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AccessManager
 * @dev Contract that manages access control for the supply chain tracker
 * Inherits from OpenZeppelin's AccessControl for role-based access control
 */
contract AccessManager is AccessControl {
    // Role definitions
    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant CONSUMER = keccak256("CONSUMER");
    bytes32 public constant RETAILER = keccak256("RETAILER");
    bytes32 public constant FACTORY = keccak256("FACTORY");
    bytes32 public constant PRODUCER = keccak256("PRODUCER");

    // Events for role management
    event RoleAssigned(address indexed account, bytes32 indexed role, address indexed admin);
    event RoleRevoked(address indexed account, bytes32 indexed role, address indexed admin);

    /**
     * @dev Constructor sets up the initial admin role
     * @param _admin The address that will be granted the admin role
     */
    constructor(address _admin) {
        require(_admin != address(0), "AccessManager: Admin cannot be zero address");
        
        // Grant the admin role to the specified address
        _grantRole(ADMIN, _admin);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);

        emit RoleAssigned(_admin, ADMIN, _admin);
    }

    /**
     * @dev Assign a role to an account (only admin can do this)
     * @param account The address to assign the role to
     * @param role The role to assign (ADMIN, CONSUMER, RETAILER, FACTORY, or PRODUCER)
     */
    function assignRole(address account, bytes32 role) external onlyRole(ADMIN) {
        require(account != address(0), "AccessManager: Account cannot be zero address");
        require(isValidRole(role), "AccessManager: Invalid role");
        
        _grantRole(role, account);
        emit RoleAssigned(account, role, msg.sender);
    }

    /**
     * @dev Revoke a role from an account (only admin can do this)
     * @param account The address to revoke the role from
     * @param role The role to revoke
     */
    function revokeRole(address account, bytes32 role) external onlyRole(ADMIN) {
        require(account != address(0), "AccessManager: Account cannot be zero address");
        require(isValidRole(role), "AccessManager: Invalid role");
        
        _revokeRole(role, account);
        emit RoleRevoked(account, role, msg.sender);
    }


    /**
    * @dev Check if an account has a specific role
    * @param account The address to check the role for
    * @param role The role to check
    * @return bool True if the account has the role, false otherwise
    */
    function checkRole(address account, bytes32 role) public view returns (bool) {
        return super.hasRole(role, account);    
    }

    /**
    * @dev Check if an account is an admin
    * @param account The address to check the role for
    * @return bool True if the account is an admin, false otherwise
    */
    function isAdmin(address account) external view returns (bool) {
        return super.hasRole(ADMIN, account);
    }

    /**
     * @dev Check if an account has the consumer role
     * @param account The address to check
     * @return bool True if the account has consumer role, false otherwise
     */
    function isConsumer(address account) external view returns (bool) {
        return super.hasRole(CONSUMER, account);
    }

    /**
     * @dev Check if an account has the retailer role
     * @param account The address to check
     * @return bool True if the account has retailer role, false otherwise
     */
    function isRetailer(address account) external view returns (bool) {
        return super.hasRole(RETAILER, account);
    }

    /**
     * @dev Check if an account has the factory role
     * @param account The address to check
     * @return bool True if the account has factory role, false otherwise
     */
    function isFactory(address account) external view returns (bool) {
        return super.hasRole(FACTORY, account);
    }

    /**
     * @dev Check if an account has the producer role
     * @param account The address to check
     * @return bool True if the account has producer role, false otherwise
     */
    function isProducer(address account) external view returns (bool) {
        return super.hasRole(PRODUCER, account);
    }

    /**
     * @dev Check if a role is valid (one of the 5 defined roles)
     * @param role The role to validate
     * @return bool True if the role is valid, false otherwise
     */
    function isValidRole(bytes32 role) public pure returns (bool) {
        return role == ADMIN || 
               role == CONSUMER || 
               role == RETAILER || 
               role == FACTORY || 
               role == PRODUCER;
    }

    /**
     * @dev Get role name as string for a given role bytes32
     * @param role The role bytes32
     * @return string The role name
     */
    function getRoleName(bytes32 role) external pure returns (string memory) {
        if (role == ADMIN) return "ADMIN";
        if (role == CONSUMER) return "CONSUMER";
        if (role == RETAILER) return "RETAILER";
        if (role == FACTORY) return "FACTORY";
        if (role == PRODUCER) return "PRODUCER";
        return "UNKNOWN";
    }

    function getAccountsByRole(bytes32 role) external view returns (address[] memory) {
        uint256 roleMemberCount = getRoleMemberCount(role);
        address[] memory members = new address[](roleMemberCount);
        
        for (uint256 i = 0; i < roleMemberCount; i++) {
            members[i] = getRoleMember(role, i);
        }
        
        return members;
    }
}
