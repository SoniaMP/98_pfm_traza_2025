// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {AccessManager} from "../src/AccessManager.sol";
import {RecyclingTraceability} from "../src/RecyclingTraceability.sol";

contract RecyclingTraceabilityTest is Test {
    AccessManager public access;
    RecyclingTraceability public trace;

    address public admin = address(1);
    address public citizen = address(2);
    address public transporter = address(3);
    address public processor = address(4);
    address public rewardAuthority = address(5);
    address public attacker = address(6);
    address public fakeCitizen = address(0x99);

    function setUp() public {
        access = new AccessManager(admin);

        vm.startPrank(citizen);
        access.requestRole(access.CITIZEN());
        vm.stopPrank();

        vm.startPrank(transporter);
        access.requestRole(access.TRANSPORTER());
        vm.stopPrank();

        vm.startPrank(processor);
        access.requestRole(access.PROCESSOR());
        vm.stopPrank();

        vm.startPrank(rewardAuthority);
        access.requestRole(access.REWARD_AUTHORITY());
        vm.stopPrank();

        vm.startPrank(admin);
        access.approveAccount(citizen);
        access.approveAccount(transporter);
        access.approveAccount(processor);
        access.approveAccount(rewardAuthority);
        vm.stopPrank();

        trace = new RecyclingTraceability(address(access));
    }

    function test_CitizenCanCreateToken() public {
        vm.startPrank(citizen);
        trace.createToken(
            "Botellas PET",
            1000,
            '{"tipo":"plastico","formato":"botellas","cantidad_estim":"3kg"}',
            0
        );
        vm.stopPrank();

        (
            uint256 id,
            address creator,
            address currentHolder,
            string memory name,
            uint256 totalSupply,
            string memory citizenFeatures,
            string memory processorFeatures,
            ,
            ,
            uint8 stage
        ) = trace.getToken(1);

        assertEq(id, 1);
        assertEq(creator, citizen);
        assertEq(currentHolder, citizen);
        assertEq(name, "Botellas PET");
        assertEq(totalSupply, 1000);
        assertEq(stage, uint8(RecyclingTraceability.Stage.Created));
        assertEq(
            citizenFeatures,
            '{"tipo":"plastico","formato":"botellas","cantidad_estim":"3kg"}'
        );
        assertEq(processorFeatures, "");
    }

    function test_RevertIfNonCitizenCreatesToken() public {
        vm.startPrank(attacker);
        vm.expectRevert("Access denied: inactive or missing role");
        trace.createToken(
            "Aluminio",
            500,
            '{"tipo":"metal","formato":"latas"}',
            0
        );
        vm.stopPrank();
    }

    function test_TransporterCanCollectTokenAndUpdatesCustody() public {
        vm.startPrank(citizen);
        trace.createToken("Vidrio", 800, '{"tipo":"vidrio"}', 0);
        vm.stopPrank();

        // Antes de recoger
        (, , address holderBefore, , , , , , , uint8 stageBefore) = trace
            .getToken(1);
        assertEq(holderBefore, citizen);
        assertEq(stageBefore, uint8(RecyclingTraceability.Stage.Created));

        vm.startPrank(transporter);
        trace.collectToken(1);
        vm.stopPrank();

        // Después de recoger
        (, , address holderAfter, , , , , , , uint8 stageAfter) = trace
            .getToken(1);
        assertEq(holderAfter, transporter);
        assertEq(stageAfter, uint8(RecyclingTraceability.Stage.Collected));
    }

    function test_RevertIfProcessorTriesBeforeTransport() public {
        vm.startPrank(citizen);
        trace.createToken("Papel", 300, '{"tipo":"papel"}', 0);
        vm.stopPrank();

        vm.startPrank(processor);
        vm.expectRevert("Not collected yet");
        trace.processToken(1, '{"peso_neto":"1.2","pureza":"90%"}');
        vm.stopPrank();
    }

    // --- 3️⃣ Procesamiento ---

    function test_ProcessorCanProcessTokenAndCustodyTransfers() public {
        vm.startPrank(citizen);
        trace.createToken("Carton", 500, '{"tipo":"carton"}', 0);
        vm.stopPrank();

        vm.startPrank(transporter);
        trace.collectToken(1);
        vm.stopPrank();

        vm.startPrank(processor);
        trace.processToken(1, '{"peso_neto":"480","pureza":"95%"}');
        vm.stopPrank();

        (
            ,
            ,
            address holderAfter,
            ,
            ,
            ,
            string memory processorFeatures,
            ,
            ,
            uint8 stage
        ) = trace.getToken(1);

        assertEq(stage, uint8(RecyclingTraceability.Stage.Processed));
        assertEq(processorFeatures, '{"peso_neto":"480","pureza":"95%"}');
        assertEq(holderAfter, processor);
    }

    function test_RevertIfNonProcessorProcesses() public {
        vm.startPrank(citizen);
        trace.createToken("PET", 200, '{"tipo":"PET"}', 0);
        vm.stopPrank();

        vm.startPrank(transporter);
        vm.expectRevert("Access denied: inactive or missing role");
        trace.processToken(1, '{"peso_neto":"190","pureza":"93%"}');
        vm.stopPrank();
    }

    function test_RewardAuthorityCanFinalize() public {
        vm.startPrank(citizen);
        trace.createToken("PET reciclado", 1200, '{"tipo":"PET"}', 0);
        vm.stopPrank();

        vm.startPrank(transporter);
        trace.collectToken(1);
        vm.stopPrank();

        vm.startPrank(processor);
        trace.processToken(1, '{"peso_neto":"1170","pureza":"96%"}');
        vm.stopPrank();

        vm.startPrank(rewardAuthority);
        trace.rewardToken(1, 1200);
        vm.stopPrank();

        (, , address holder, , , , , , , uint8 stage) = trace.getToken(1);
        assertEq(stage, uint8(RecyclingTraceability.Stage.Rewarded));
        // El holder puede quedarse como el procesador (último custodio físico)
        assertEq(holder, processor);
    }

    function test_RevertIfRewardTooEarly() public {
        vm.startPrank(citizen);
        trace.createToken("PET", 300, '{"tipo":"PET"}', 0);
        vm.stopPrank();

        vm.startPrank(rewardAuthority);
        vm.expectRevert("Not processed yet");
        trace.rewardToken(1, 300);
        vm.stopPrank();
    }

    function test_RevertIfAttackerTriesCollect() public {
        vm.startPrank(citizen);
        trace.createToken("Vidrio verde", 200, '{"tipo":"vidrio"}', 0);
        vm.stopPrank();

        vm.startPrank(attacker);
        vm.expectRevert("Access denied: inactive or missing role");
        trace.collectToken(1);
        vm.stopPrank();
    }

    function test_GetAllTokens_ReturnsAllCreated() public {
        vm.startPrank(citizen);
        trace.createToken("Botellas PET", 1200, '{"tipo":"plastico"}', 0);
        trace.createToken("Vidrio verde", 800, '{"tipo":"vidrio"}', 0);
        trace.createToken("Papel y carton", 500, '{"tipo":"papel"}', 0);
        vm.stopPrank();

        RecyclingTraceability.TokenView[] memory tokens = trace.getAllTokens();

        assertEq(tokens.length, 3, "Expected 3 tokens total");

        assertEq(tokens[0].id, 1);
        assertEq(tokens[1].id, 2);
        assertEq(tokens[2].id, 3);

        assertEq(tokens[0].creator, citizen);
        assertEq(tokens[0].currentHolder, citizen);
        assertEq(tokens[0].stage, uint8(RecyclingTraceability.Stage.Created));
    }

    function test_GetTokensByUser_ReturnsOnlyUserTokens() public {
        vm.startPrank(citizen);
        trace.createToken("PET", 1000, '{"tipo":"plastico"}', 0);
        trace.createToken("Carton", 700, '{"tipo":"carton"}', 0);
        vm.stopPrank();

        vm.startPrank(fakeCitizen);
        access.requestRole(access.CITIZEN());
        vm.stopPrank();

        vm.startPrank(admin);
        access.approveAccount(fakeCitizen);
        vm.stopPrank();

        vm.startPrank(fakeCitizen);
        trace.createToken("Vidrio", 500, '{"tipo":"vidrio"}', 0);
        vm.stopPrank();

        RecyclingTraceability.TokenView[] memory all = trace.getAllTokens();
        assertEq(all.length, 3);

        RecyclingTraceability.TokenView[] memory userTokens = trace
            .getTokensByUser(citizen);
        assertEq(userTokens.length, 2, "Citizen should have 2 tokens");

        assertEq(userTokens[0].creator, citizen);
        assertEq(userTokens[1].creator, citizen);

        RecyclingTraceability.TokenView[] memory otherTokens = trace
            .getTokensByUser(fakeCitizen);
        assertEq(otherTokens.length, 1, "Fake citizen should have 1 token");
        assertEq(otherTokens[0].creator, fakeCitizen);
    }

    function test_TransporterCanInitiateTransfer() public {
        vm.startPrank(citizen);
        trace.createToken("PET", 1000, '{"tipo":"PET"}', 0);
        vm.stopPrank();

        vm.startPrank(transporter);
        trace.collectToken(1);
        trace.transfer(processor, 1, 500);
        vm.stopPrank();

        RecyclingTraceability.Transfer memory tr = trace.getTransfer(1);

        assertEq(tr.id, 1);
        assertEq(tr.tokenId, 1);
        assertEq(tr.from, transporter);
        assertEq(tr.to, processor);
        assertEq(tr.amount, 500);
        assertEq(
            uint8(tr.status),
            uint8(RecyclingTraceability.TransferStatus.Pending)
        );
    }

    function test_ProcessorCanAcceptTransferAndCustodyChanges() public {
        vm.startPrank(citizen);
        trace.createToken("PET", 800, '{"tipo":"plastico"}', 0);
        vm.stopPrank();

        vm.startPrank(transporter);
        trace.collectToken(1);
        trace.transfer(processor, 1, 800);
        vm.stopPrank();

        vm.startPrank(processor);
        trace.setTransferStatus(1, true);
        vm.stopPrank();

        RecyclingTraceability.Transfer memory tr = trace.getTransfer(1);
        assertEq(
            uint8(tr.status),
            uint8(RecyclingTraceability.TransferStatus.Accepted)
        );

        (, , address holder, , , , , , , ) = trace.getToken(1);
        assertEq(holder, processor);
    }

    function test_ProcessorCanRejectTransfer() public {
        vm.startPrank(citizen);
        trace.createToken("Vidrio", 1000, '{"tipo":"vidrio"}', 0);
        vm.stopPrank();

        vm.startPrank(transporter);
        trace.collectToken(1);
        trace.transfer(processor, 1, 500);
        vm.stopPrank();

        vm.startPrank(processor);
        trace.setTransferStatus(1, false);
        vm.stopPrank();

        RecyclingTraceability.Transfer memory tr = trace.getTransfer(1);
        assertEq(
            uint8(tr.status),
            uint8(RecyclingTraceability.TransferStatus.Rejected)
        );
    }

    function test_RevertIfTransferAlreadyProcessed() public {
        vm.startPrank(citizen);
        trace.createToken("PET", 800, '{"tipo":"plastico"}', 0);
        vm.stopPrank();

        vm.startPrank(transporter);
        trace.collectToken(1);
        trace.transfer(processor, 1, 800);
        vm.stopPrank();

        vm.startPrank(processor);
        trace.setTransferStatus(1, true);
        vm.expectRevert("Transfer not pending");
        trace.setTransferStatus(1, false);
        vm.stopPrank();
    }
}
