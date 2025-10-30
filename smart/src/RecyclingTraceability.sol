// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessManager} from "./AccessManager.sol";

contract RecyclingTraceability {
    AccessManager public accessManager;

    enum Stage {
        None,
        Created,
        Collected,
        Processed,
        Rewarded
    }

    struct Token {
        uint256 id;
        address creator;
        address currentHolder;
        string name;
        uint256 totalSupply;
        string citizenFeatures;
        string processorFeatures;
        uint256 parentId;
        uint256 dateCreated;
        Stage stage;
    }

    struct TokenView {
        uint256 id;
        address creator;
        address currentHolder;
        string name;
        uint256 totalSupply;
        uint8 stage;
        string citizenFeatures;
        string processorFeatures;
        uint256 dateCreated;
    }

    uint256 private _tokenCounter;
    mapping(uint256 => Token) private _tokens;
    uint256[] private _allTokenIds;

    event TokenCreated(uint256 indexed id, address indexed citizen);
    event TokenCollected(uint256 indexed id, address indexed transporter);
    event TokenProcessed(uint256 indexed id, address indexed processor);
    event TokenRewarded(
        uint256 indexed id,
        address indexed citizen,
        uint256 amount,
        address indexed authority,
        string rewardFeatures
    );

    event CustodyChanged(
        uint256 indexed tokenId,
        address indexed previousHolder,
        address indexed newHolder,
        uint8 action,
        uint256 timestamp
    );

    enum TransferStatus {
        None,
        Pending,
        Accepted,
        Rejected
    }

    struct Transfer {
        uint256 id;
        uint256 tokenId;
        address from;
        address to;
        uint256 amount;
        TransferStatus status;
        uint256 timestamp;
    }

    uint256 private _transferCounter;
    mapping(uint256 => Transfer) private _transfers;

    event TransferInitiated(
        uint256 indexed transferId,
        uint256 indexed tokenId,
        address indexed from,
        address to,
        uint256 amount,
        uint256 timestamp
    );

    event TransferStatusChanged(
        uint256 indexed transferId,
        uint256 indexed tokenId,
        address indexed from,
        TransferStatus status,
        uint256 timestamp
    );

    modifier onlyRoleActive(bytes32 role) {
        require(
            accessManager.hasActiveRole(msg.sender, role),
            "Access denied: inactive or missing role"
        );
        _;
    }

    constructor(address accessManagerAddr) {
        require(accessManagerAddr != address(0), "Invalid AccessManager");
        accessManager = AccessManager(accessManagerAddr);
    }

    // --- Citizen: crea el token inicial ---
    function createToken(
        string memory name,
        uint256 totalSupply,
        string memory citizenFeatures,
        uint256 parentId
    ) external onlyRoleActive(accessManager.CITIZEN()) {
        require(bytes(name).length > 0, "Empty name");
        require(totalSupply > 0, "Invalid totalSupply");

        _tokenCounter++;
        uint256 newId = _tokenCounter;

        _tokens[newId] = Token({
            id: newId,
            creator: msg.sender,
            currentHolder: msg.sender,
            name: name,
            totalSupply: totalSupply,
            citizenFeatures: citizenFeatures,
            processorFeatures: "",
            parentId: parentId,
            dateCreated: block.timestamp,
            stage: Stage.Created
        });

        _allTokenIds.push(newId);

        emit TokenCreated(newId, msg.sender);
        emit CustodyChanged(
            newId,
            address(0),
            msg.sender,
            uint8(Stage.Created),
            block.timestamp
        );
    }

    function collectToken(
        uint256 tokenId
    ) external onlyRoleActive(accessManager.TRANSPORTER()) {
        Token storage t = _tokens[tokenId];
        require(t.id != 0, "Token not found");
        require(t.stage == Stage.Created, "Already collected or beyond");

        address previous = t.currentHolder;
        t.stage = Stage.Collected;
        t.currentHolder = msg.sender;

        emit TokenCollected(tokenId, msg.sender);
        emit CustodyChanged(
            tokenId,
            previous,
            msg.sender,
            uint8(Stage.Collected),
            block.timestamp
        );
    }

    function processToken(
        uint256 tokenId,
        string memory processorFeatures
    ) external onlyRoleActive(accessManager.PROCESSOR()) {
        Token storage t = _tokens[tokenId];
        require(t.id != 0, "Token not found");
        require(t.stage == Stage.Collected, "Not collected yet");

        address previous = t.currentHolder;
        t.stage = Stage.Processed;
        t.processorFeatures = processorFeatures;
        t.currentHolder = msg.sender;

        emit TokenProcessed(tokenId, msg.sender);
        emit CustodyChanged(
            tokenId,
            previous,
            msg.sender,
            uint8(Stage.Processed),
            block.timestamp
        );
    }

    function rewardToken(
        uint256 tokenId,
        uint256 amount,
        string memory rewardFeatures
    ) external onlyRoleActive(accessManager.REWARD_AUTHORITY()) {
        Token storage t = _tokens[tokenId];
        require(t.id != 0, "Token not found");
        require(t.stage == Stage.Processed, "Not processed yet");

        t.stage = Stage.Rewarded;

        emit TokenRewarded(
            tokenId,
            t.creator,
            amount,
            msg.sender,
            rewardFeatures
        );
        emit CustodyChanged(
            tokenId,
            t.currentHolder,
            msg.sender,
            uint8(Stage.Rewarded),
            block.timestamp
        );
    }

    function getToken(
        uint256 tokenId
    )
        external
        view
        returns (
            uint256 id,
            address creator,
            address currentHolder,
            string memory name,
            uint256 totalSupply,
            string memory citizenFeatures,
            string memory processorFeatures,
            uint256 parentId,
            uint256 dateCreated,
            uint8 stage
        )
    {
        Token storage t = _tokens[tokenId];
        require(t.id != 0, "Token not found");

        return (
            t.id,
            t.creator,
            t.currentHolder,
            t.name,
            t.totalSupply,
            t.citizenFeatures,
            t.processorFeatures,
            t.parentId,
            t.dateCreated,
            uint8(t.stage)
        );
    }

    function getAllTokens() external view returns (TokenView[] memory list) {
        uint256 total = _allTokenIds.length;
        list = new TokenView[](total);

        for (uint256 i = 0; i < total; i++) {
            Token storage t = _tokens[_allTokenIds[i]];
            list[i] = TokenView({
                id: t.id,
                creator: t.creator,
                currentHolder: t.currentHolder,
                name: t.name,
                totalSupply: t.totalSupply,
                stage: uint8(t.stage),
                citizenFeatures: t.citizenFeatures,
                processorFeatures: t.processorFeatures,
                dateCreated: t.dateCreated
            });
        }
    }

    function getTokensByUser(
        address user
    ) external view returns (TokenView[] memory list) {
        uint256 total = _allTokenIds.length;
        uint256 count = 0;

        for (uint256 i = 0; i < total; i++) {
            if (_tokens[_allTokenIds[i]].creator == user) {
                count++;
            }
        }

        list = new TokenView[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < total; i++) {
            Token storage t = _tokens[_allTokenIds[i]];
            if (t.creator == user) {
                list[index] = TokenView({
                    id: t.id,
                    creator: t.creator,
                    currentHolder: t.currentHolder,
                    name: t.name,
                    totalSupply: t.totalSupply,
                    stage: uint8(t.stage),
                    citizenFeatures: t.citizenFeatures,
                    processorFeatures: t.processorFeatures,
                    dateCreated: t.dateCreated
                });
                index++;
            }
        }
    }

    /**
     * @notice Inicia la transferencia de un token hacia otro usuario.
     */
    function transfer(address to, uint256 tokenId, uint256 amount) external {
        Token storage t = _tokens[tokenId];
        require(t.id != 0, "Token not found");
        require(t.currentHolder == msg.sender, "Not current holder");
        require(amount > 0 && amount <= t.totalSupply, "Invalid amount");

        _transferCounter++;
        uint256 newTransferId = _transferCounter;

        _transfers[newTransferId] = Transfer({
            id: newTransferId,
            tokenId: tokenId,
            from: msg.sender,
            to: to,
            amount: amount,
            status: TransferStatus.Pending,
            timestamp: block.timestamp
        });

        emit TransferInitiated(
            newTransferId,
            tokenId,
            msg.sender,
            to,
            amount,
            block.timestamp
        );
    }

    /**
     * @notice Acepta o rechaza una transferencia pendiente.
     * Solo puede ejecutarlo el PROCESSOR activo.
     */
    function setTransferStatus(uint256 transferId, bool accept) external {
        Transfer storage tr = _transfers[transferId];
        require(tr.id != 0, "Transfer not found");
        require(tr.status == TransferStatus.Pending, "Transfer not pending");
        require(tr.to == msg.sender, "Not recipient");

        if (accept) {
            tr.status = TransferStatus.Accepted;

            Token storage t = _tokens[tr.tokenId];
            address previous = t.currentHolder;
            t.currentHolder = tr.to;

            emit CustodyChanged(
                tr.tokenId,
                previous,
                tr.to,
                uint8(t.stage),
                block.timestamp
            );
        } else {
            tr.status = TransferStatus.Rejected;
        }

        emit TransferStatusChanged(
            transferId,
            tr.tokenId,
            tr.from,
            tr.status,
            block.timestamp
        );
    }

    /**
     * @notice Obtiene la información de una transferencia por su ID.
     */
    function getTransfer(
        uint256 transferId
    ) external view returns (Transfer memory) {
        require(_transfers[transferId].id != 0, "Transfer not found");
        return _transfers[transferId];
    }

    /**
     * @notice Obtiene todas las transferencias realizadas.
     * Se podrán filtrar por estado.
     */
    function getTransfers(
        TransferStatus statusFilter
    ) external view returns (Transfer[] memory list) {
        uint256 total = _transferCounter;
        uint256 count = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (
                statusFilter == TransferStatus.None ||
                _transfers[i].status == statusFilter
            ) {
                count++;
            }
        }

        list = new Transfer[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= total; i++) {
            Transfer storage tr = _transfers[i];
            if (
                statusFilter == TransferStatus.None || tr.status == statusFilter
            ) {
                list[index] = tr;
                index++;
            }
        }

        return list;
    }
}
