// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { AsteraIdentityRegistry } from "../../src/identity/AsteraIdentityRegistry.sol";
import { AsteraPrimaryExchange } from "../../src/exchange/AsteraPrimaryExchange.sol";
import { AsteraToken } from "../../src/token/AsteraToken.sol";
import { AsteraComplianceManager } from "../../src/compliance/AsteraComplianceManager.sol";
import { MockUSDC } from "../../src/mocks/MockUSDC.sol";

contract TermsAcceptanceTest is Test {
    AsteraIdentityRegistry internal identity;
    AsteraPrimaryExchange internal exchange;
    AsteraToken internal token;
    AsteraComplianceManager internal compliance;
    MockUSDC internal usdc;

    address internal admin = address(this);
    address internal treasury = address(0xF1DE1);
    address internal feeRecipient = address(0xFEE);

    uint256 internal userKey = 0xA11CE;
    address internal user;

    bytes32 internal constant GENERIC_DOC_HASH = keccak256("fideicomiso-legal-terms-v1.pdf");
    string internal constant GENERIC_DOC_URI = "ipfs://QmXyzGenericLegalDoc";

    bytes32 internal constant SIGNED_DOC_HASH = keccak256("signed-doc-user1-v1.pdf");
    bytes32 internal constant SIGNED_DOC_HASH_2 = keccak256("signed-doc-user2-v1.pdf");

    uint256 internal constant MAX_SUPPLY = 1000e6;
    uint256 internal constant SOFT_CAP = 100e6;

    function setUp() public {
        vm.warp(1000);
        uint256 fundingDeadline = block.timestamp + 30 days;
        user = vm.addr(userKey);

        usdc = new MockUSDC();
        identity = new AsteraIdentityRegistry(admin);
        exchange = new AsteraPrimaryExchange(address(usdc), address(identity), feeRecipient, admin);
        identity.setExchange(address(exchange), true);

        (address tokenAddr,) = exchange.createProjectToken(
            "Fideicomiso Token",
            "FID",
            MAX_SUPPLY,
            SOFT_CAP,
            fundingDeadline,
            treasury,
            GENERIC_DOC_HASH,
            GENERIC_DOC_URI
        );

        token = AsteraToken(tokenAddr);
        compliance = AsteraComplianceManager(token.compliance());

        identity.registerUser(user);
    }

    // ─── Helpers
    // ──────────────────────────────────────────────────────────

    function _buildDigest(bytes32 signedDocHash, address forUser) internal view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                compliance.AGREEMENT_TYPEHASH(),
                compliance.genericDocumentHash(),
                keccak256(bytes(compliance.genericDocumentURI())),
                signedDocHash,
                forUser
            )
        );
        return keccak256(abi.encodePacked("\x19\x01", compliance.domainSeparator(), structHash));
    }

    function _sign(uint256 privateKey, bytes32 digest) internal pure returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        return abi.encodePacked(r, s, v);
    }

    // ─── Self-service: happy path
    // ─────────────────────────────────────────

    function testSelfServiceUserBecomesCompliant() public {
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, user));

        vm.prank(user);
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH, sig);

        assertTrue(compliance.isCompliant(user));
    }

    function testSelfServiceStoresAgreementCorrectly() public {
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, user));

        vm.prank(user);
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH, sig);

        (bytes32 storedHash,, uint256 ts, bool selfService) = compliance.agreements(user);
        assertEq(storedHash, SIGNED_DOC_HASH);
        assertEq(ts, block.timestamp);
        assertTrue(selfService);
    }

    function testSelfServiceMarksHashAsUsed() public {
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, user));

        vm.prank(user);
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH, sig);

        assertTrue(compliance.usedSignedDocumentHashes(SIGNED_DOC_HASH));
    }

    function testSelfServiceEmitsTermsAccepted() public {
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, user));

        // Only check indexed topics (user, genericDocumentHash, signedDocumentHash)
        vm.expectEmit(true, true, true, false, address(compliance));
        emit AsteraComplianceManager.TermsAccepted(
            user, GENERIC_DOC_HASH, SIGNED_DOC_HASH, "", new bytes(0), 0, false
        );

        vm.prank(user);
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH, sig);
    }

    // ─── Self-service: reverts
    // ────────────────────────────────────────────

    function testSelfServiceRevertsIfUserNotRegistered() public {
        address stranger = address(0x1234);

        vm.prank(stranger);
        vm.expectRevert(
            abi.encodeWithSelector(AsteraComplianceManager.UserNotRegistered.selector, stranger)
        );
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH, new bytes(65));
    }

    function testSelfServiceRevertsIfAlreadyCompliant() public {
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, user));
        vm.prank(user);
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH, sig);

        bytes memory sig2 = _sign(userKey, _buildDigest(SIGNED_DOC_HASH_2, user));
        vm.prank(user);
        vm.expectRevert(AsteraComplianceManager.AlreadyCompliant.selector);
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH_2, sig2);
    }

    function testSelfServiceRevertsOnInvalidSignature() public {
        // Valid format signature but signed with wrong key
        bytes memory wrongSig = _sign(0xDEAD, _buildDigest(SIGNED_DOC_HASH, user));

        vm.prank(user);
        vm.expectRevert(AsteraComplianceManager.InvalidSignature.selector);
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH, wrongSig);
    }

    function testSelfServiceRevertsIfSignerIsNotCaller() public {
        // otherAddr signs for themselves, but we use that sig as `user`
        uint256 otherKey = 0xBEEF;
        address otherAddr = vm.addr(otherKey);
        identity.registerUser(otherAddr);

        // otherAddr signs for otherAddr — signer recovered = otherAddr ≠ user
        bytes memory sig = _sign(otherKey, _buildDigest(SIGNED_DOC_HASH, user));

        vm.prank(user);
        vm.expectRevert(AsteraComplianceManager.InvalidSignature.selector);
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH, sig);
    }

    function testSelfServiceRevertsIfSignedDocHashAlreadyUsed() public {
        // First user accepts with SIGNED_DOC_HASH
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, user));
        vm.prank(user);
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH, sig);

        // Second user tries to reuse the same signed doc hash
        uint256 user2Key = 0xB22;
        address user2 = vm.addr(user2Key);
        identity.registerUser(user2);

        bytes memory sig2 = _sign(user2Key, _buildDigest(SIGNED_DOC_HASH, user2));
        vm.prank(user2);
        vm.expectRevert(AsteraComplianceManager.DocumentAlreadyUsed.selector);
        compliance.acceptTermsAndJoin(SIGNED_DOC_HASH, sig2);
    }

    // ─── Admin flow: happy path
    // ───────────────────────────────────────────

    function testAdminCanRegisterUserWithValidSignature() public {
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, user));

        compliance.adminAcceptTermsAndJoin(user, SIGNED_DOC_HASH, sig);

        assertTrue(compliance.isCompliant(user));
    }

    function testAdminFlowStoresSelfServiceFalse() public {
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, user));

        compliance.adminAcceptTermsAndJoin(user, SIGNED_DOC_HASH, sig);

        (,,, bool selfService) = compliance.agreements(user);
        assertFalse(selfService);
    }

    // ─── Admin flow: reverts
    // ──────────────────────────────────────────────

    function testNonAdminCannotCallAdminAccept() public {
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, user));

        vm.prank(address(0xBAD));
        vm.expectRevert();
        compliance.adminAcceptTermsAndJoin(user, SIGNED_DOC_HASH, sig);
    }

    function testAdminCannotBypassSignatureValidation() public {
        // Wrong signer: admin signs on behalf of user but with own key
        uint256 adminKey = 0xAD1;
        bytes memory sig = _sign(adminKey, _buildDigest(SIGNED_DOC_HASH, user));

        // signer = vm.addr(adminKey) ≠ user → InvalidSignature
        vm.expectRevert(AsteraComplianceManager.InvalidSignature.selector);
        compliance.adminAcceptTermsAndJoin(user, SIGNED_DOC_HASH, sig);
    }

    function testAdminRevertsOnDuplicateSignedDocHash() public {
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, user));
        compliance.adminAcceptTermsAndJoin(user, SIGNED_DOC_HASH, sig);

        uint256 user2Key = 0xB22;
        address user2 = vm.addr(user2Key);
        identity.registerUser(user2);

        bytes memory sig2 = _sign(user2Key, _buildDigest(SIGNED_DOC_HASH, user2));
        vm.expectRevert(AsteraComplianceManager.DocumentAlreadyUsed.selector);
        compliance.adminAcceptTermsAndJoin(user2, SIGNED_DOC_HASH, sig2);
    }

    function testAdminRevertsIfUserNotRegistered() public {
        address stranger = address(0x5555);
        bytes memory sig = _sign(userKey, _buildDigest(SIGNED_DOC_HASH, stranger));

        vm.expectRevert(
            abi.encodeWithSelector(AsteraComplianceManager.UserNotRegistered.selector, stranger)
        );
        compliance.adminAcceptTermsAndJoin(stranger, SIGNED_DOC_HASH, sig);
    }

    // ─── EIP712 digest correctness
    // ────────────────────────────────────────

    function testDigestChangesIfGenericDocHashChanges() public view {
        bytes32 digest1 = _buildDigest(SIGNED_DOC_HASH, user);

        bytes32 structHash = keccak256(
            abi.encode(
                compliance.AGREEMENT_TYPEHASH(),
                keccak256("different-doc-hash"),
                keccak256(bytes(compliance.genericDocumentURI())),
                SIGNED_DOC_HASH,
                user
            )
        );
        bytes32 digest2 =
            keccak256(abi.encodePacked("\x19\x01", compliance.domainSeparator(), structHash));

        assertNotEq(digest1, digest2);
    }

    function testDigestChangesIfGenericDocURIChanges() public view {
        bytes32 digest1 = _buildDigest(SIGNED_DOC_HASH, user);

        bytes32 structHash = keccak256(
            abi.encode(
                compliance.AGREEMENT_TYPEHASH(),
                compliance.genericDocumentHash(),
                keccak256(bytes("ipfs://QmDifferentURI")),
                SIGNED_DOC_HASH,
                user
            )
        );
        bytes32 digest2 =
            keccak256(abi.encodePacked("\x19\x01", compliance.domainSeparator(), structHash));

        assertNotEq(digest1, digest2);
    }

    function testDigestChangesIfSignedDocHashChanges() public view {
        bytes32 digest1 = _buildDigest(SIGNED_DOC_HASH, user);
        bytes32 digest2 = _buildDigest(SIGNED_DOC_HASH_2, user);

        assertNotEq(digest1, digest2);
    }

    function testDigestChangesIfUserChanges() public view {
        bytes32 digest1 = _buildDigest(SIGNED_DOC_HASH, user);
        bytes32 digest2 = _buildDigest(SIGNED_DOC_HASH, address(0xBEEF));

        assertNotEq(digest1, digest2);
    }

    function testValidTypedSignatureRecovery() public pure {
        // vm.sign returns (v, r, s) directly — verify ecrecover round-trips correctly
        bytes32 digest = keccak256("test");
        // Private key 1 → 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf
        address expected = 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf;
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, digest);
        assertEq(ecrecover(digest, v, r, s), expected);
    }

    // ─── Project creation stores document data immutably
    // ─────────────────

    function testCreateProjectTokenStoresGenericDocHash() public view {
        assertEq(compliance.genericDocumentHash(), GENERIC_DOC_HASH);
    }

    function testCreateProjectTokenStoresGenericDocURI() public view {
        assertEq(compliance.genericDocumentURI(), GENERIC_DOC_URI);
    }

    function testGenericDocHashMatchesBetweenTokenAndCompliance() public view {
        assertEq(
            AsteraComplianceManager(token.compliance()).genericDocumentHash(), GENERIC_DOC_HASH
        );
    }

    function testCreateProjectTokenRevertsOnZeroDocHash() public {
        vm.expectRevert(AsteraPrimaryExchange.InvalidDocumentParams.selector);
        exchange.createProjectToken(
            "T", "T", 1000e6, 100e6, block.timestamp + 1 days, treasury, bytes32(0), GENERIC_DOC_URI
        );
    }

    function testCreateProjectTokenRevertsOnEmptyDocURI() public {
        vm.expectRevert(AsteraPrimaryExchange.InvalidDocumentParams.selector);
        exchange.createProjectToken(
            "T", "T", 1000e6, 100e6, block.timestamp + 1 days, treasury, GENERIC_DOC_HASH, ""
        );
    }

    // ─── signedDocumentHash zero validation
    // ─────────────────────────────────────

    function testSelfServiceRevertsIfSignedDocHashIsZero() public {
        vm.prank(user);
        vm.expectRevert(AsteraComplianceManager.InvalidDocumentHash.selector);
        compliance.acceptTermsAndJoin(bytes32(0), new bytes(65));
    }

    function testAdminAcceptRevertsIfSignedDocHashIsZero() public {
        vm.expectRevert(AsteraComplianceManager.InvalidDocumentHash.selector);
        compliance.adminAcceptTermsAndJoin(user, bytes32(0), new bytes(65));
    }

    // ─── adminForceCompliant
    // ──────────────────────────────────────────────

    function testAdminForceCompliantMakesUserCompliant() public {
        compliance.adminForceCompliant(user, "manual KYC recovery");
        assertTrue(compliance.isCompliant(user));
    }

    function testNonAdminCannotCallAdminForceCompliant() public {
        vm.prank(address(0xBAD));
        vm.expectRevert();
        compliance.adminForceCompliant(user, "should fail");
    }

    function testAdminForceCompliantRevertsIfUserNotRegistered() public {
        address stranger = address(0x5555);
        vm.expectRevert(
            abi.encodeWithSelector(AsteraComplianceManager.UserNotRegistered.selector, stranger)
        );
        compliance.adminForceCompliant(stranger, "not registered");
    }

    function testAdminForceCompliantRevertsOnEmptyReason() public {
        vm.expectRevert(AsteraComplianceManager.InvalidParams.selector);
        compliance.adminForceCompliant(user, "");
    }

    function testAdminForceCompliantRevertsIfAlreadyCompliant() public {
        compliance.adminForceCompliant(user, "first override");
        vm.expectRevert(AsteraComplianceManager.AlreadyCompliant.selector);
        compliance.adminForceCompliant(user, "duplicate attempt");
    }

    function testAdminForceCompliantDoesNotCreateAgreement() public {
        compliance.adminForceCompliant(user, "no eip712 record");
        (bytes32 storedHash, bytes memory sig, uint256 ts,) = compliance.agreements(user);
        assertEq(storedHash, bytes32(0));
        assertEq(sig.length, 0);
        assertEq(ts, 0);
    }

    function testAdminForceCompliantEmitsEvent() public {
        vm.expectEmit(true, true, false, true, address(compliance));
        emit AsteraComplianceManager.AdminForceCompliant(
            user, address(this), "emergency override", block.timestamp
        );
        compliance.adminForceCompliant(user, "emergency override");
    }

    function testForceCompliantUserIsCompliant() public {
        compliance.adminForceCompliant(user, "operational recovery");
        assertTrue(compliance.isCompliant(user));
        assertTrue(compliance.canTransfer(address(0), user, 1e6));
    }

    // ─── ProjectTokenCreated emits document metadata
    // ─────────────────────────

    function testCreateProjectTokenEmitsDocumentMetadata() public {
        uint256 deadline = block.timestamp + 7 days;
        // Check treasury (topic3) and data fields; token/compliance addresses are unknown
        // pre-deploy
        vm.expectEmit(false, false, true, true, address(exchange));
        emit AsteraPrimaryExchange.ProjectTokenCreated(
            address(0),
            address(0),
            treasury,
            500e6,
            50e6,
            deadline,
            GENERIC_DOC_HASH,
            GENERIC_DOC_URI
        );
        exchange.createProjectToken(
            "Test Token", "TST", 500e6, 50e6, deadline, treasury, GENERIC_DOC_HASH, GENERIC_DOC_URI
        );
    }
}
