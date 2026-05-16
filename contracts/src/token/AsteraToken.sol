// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { AsteraComplianceManager } from "../compliance/AsteraComplianceManager.sol";
import { IAsteraComplianceManager } from "../interfaces/IAsteraComplianceManager.sol";

/// @title AsteraToken
/// @notice Regulated token representing permissioned participation in a tokenized asset.
/// @dev Six-decimal tokenized participation token. Direct user-to-user transfers are disabled.
/// Simplified ERC-3643-inspired security token. Secondary transfers must go through
/// AsteraPrimaryExchange.
contract AsteraToken is ERC20, AccessControl {
    bytes32 public constant TOKEN_ADMIN_ROLE = keccak256("TOKEN_ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant FORCED_TRANSFER_ROLE = keccak256("FORCED_TRANSFER_ROLE");
    bytes32 public constant EXCHANGE_ROLE = keccak256("EXCHANGE_ROLE");

    uint8 private constant TOKEN_DECIMALS = 6;

    uint256 public immutable cap;
    address public immutable identityRegistry;
    address public immutable exchange;
    address public immutable compliance;

    mapping(address => bool) public authorizedExchanges;

    event ForcedTransfer(
        address indexed operator, address indexed from, address indexed to, uint256 amount
    );
    event ExchangeTransfer(
        address indexed exchange, address indexed from, address indexed to, uint256 amount
    );
    event ComplianceDeployed(address indexed compliance);

    error ZeroAddress();
    error CapExceeded(uint256 attemptedSupply, uint256 cap);
    error DirectTransfersDisabled();
    error ComplianceCheckFailed(address from, address to, uint256 amount);
    error NotAuthorizedExchange(address caller);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 cap_,
        address identityRegistry_,
        address exchange_,
        address treasury_,
        uint256 softCap_,
        uint256 fundingDeadline_,
        address admin_,
        bytes32 genericDocumentHash_,
        string memory genericDocumentURI_
    ) ERC20(name_, symbol_) {
        if (
            cap_ == 0 || identityRegistry_ == address(0) || exchange_ == address(0)
                || treasury_ == address(0) || admin_ == address(0)
        ) revert ZeroAddress();

        cap = cap_;
        identityRegistry = identityRegistry_;
        exchange = exchange_;

        AsteraComplianceManager complianceContract = new AsteraComplianceManager(
            identityRegistry_,
            address(this),
            treasury_,
            softCap_,
            fundingDeadline_,
            admin_,
            genericDocumentHash_,
            genericDocumentURI_
        );
        compliance = address(complianceContract);
        emit ComplianceDeployed(compliance);

        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(TOKEN_ADMIN_ROLE, admin_);
        _grantRole(FORCED_TRANSFER_ROLE, admin_);

        _grantRole(EXCHANGE_ROLE, exchange_);
        _grantRole(MINTER_ROLE, exchange_);
        _grantRole(BURNER_ROLE, exchange_);
        _grantRole(TOKEN_ADMIN_ROLE, exchange_);

        authorizedExchanges[exchange_] = true;
    }

    function setAuthorizedExchange(address exchange_, bool enabled)
        external
        onlyRole(TOKEN_ADMIN_ROLE)
    {
        if (exchange_ == address(0)) revert ZeroAddress();
        authorizedExchanges[exchange_] = enabled;
    }

    function decimals() public pure override returns (uint8) {
        return TOKEN_DECIMALS;
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        uint256 newSupply = totalSupply() + amount;
        if (newSupply > cap) revert CapExceeded(newSupply, cap);
        if (!IAsteraComplianceManager(compliance).canTransfer(address(0), to, amount)) {
            revert ComplianceCheckFailed(address(0), to, amount);
        }
        _mint(to, amount);
        // Only trigger auto-close if not already completed (e.g. manually closed before cap was
        // reached). Without this guard, minting exactly to cap after a manual close would revert
        // via AlreadyCompleted.
        if (totalSupply() == cap && !IAsteraComplianceManager(compliance).fundingCompleted()) {
            IAsteraComplianceManager(compliance).autoCompleteFunding();
        }
    }

    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

    /// @notice Secondary-market movement, callable only by authorized exchanges. Does not require
    /// token allowance.
    function exchangeTransfer(address from, address to, uint256 amount) external {
        if (!authorizedExchanges[msg.sender]) revert NotAuthorizedExchange(msg.sender);
        if (!IAsteraComplianceManager(compliance).canTransfer(from, to, amount)) {
            revert ComplianceCheckFailed(from, to, amount);
        }
        _transfer(from, to, amount);
        emit ExchangeTransfer(msg.sender, from, to, amount);
    }

    /// @notice Exceptional admin transfer. Bypasses sender freeze but requires compliant recipient.
    function forcedTransfer(address from, address to, uint256 amount)
        external
        onlyRole(FORCED_TRANSFER_ROLE)
    {
        if (!IAsteraComplianceManager(compliance).canForcedTransfer(from, to, amount)) {
            revert ComplianceCheckFailed(from, to, amount);
        }
        _transfer(from, to, amount);
        emit ForcedTransfer(msg.sender, from, to, amount);
    }

    function transfer(address, uint256) public pure override returns (bool) {
        revert DirectTransfersDisabled();
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert DirectTransfersDisabled();
    }
}
