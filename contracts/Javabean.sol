// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract JavaBean is ERC20, Pausable, Ownable {
    // Cooldown mechanics
    mapping(address => uint256) private _lastTransferTime;
    uint256 public constant TRANSFER_COOLDOWN = 1 minutes;  // Adjustable

    // Max transaction limit
    uint256 public maxTransactionAmount;

    event CooldownTriggered(address indexed user, uint256 timestamp);
    event maxTransactionAmountUpdated(uint256 newAmount);
    event TokensRecovered(address token, uint256 amount);

    // Set the token name & and symbol ( JavaBean, JAVA)
    constructor() ERC20('JavaBean', 'JAVA') {
        // Makes the deployer the owner
        _transferOwnership(msg.sender);
        // 1 billion tokens with 18 decimals
        // Decimals function returns 18 (standard ERC20)
        // All tokens are minted to the deployers address
        uint256 totalSupply = 1_000_000_000 * 10 ** decimals();
        _mint(msg.sender, totalSupply);

        // Set initial max transaction amount to 1% of total supply
        maxTransactionAmount = totalSupply / 100;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setTransactionAmount(uint256 amount) public onlyOwner {
        require(amount > 0, 'JavaBean: Amount must be greater than 0');
        require(amount <= totalSupply(), 'JavaBean: Amount must be less than total supply');
        maxTransactionAmount = amount;
        emit maxTransactionAmountUpdated(amount);
    }

    // Emergency Token Recovery
    function recoverERC20(address tokenAddress, uint256 tokenAmount) public onlyOwner {
        require(tokenAddress != address(this), 'JavaBean: Cannot recover JavaBean tokens');
        IERC20(tokenAddress).transfer(owner(), tokenAmount);
        emit TokensRecovered(tokenAddress, tokenAmount);
    }

    // modifier that checks if enough time has passed
    modifier checkCooldown(address from) {
        // block.timestamp is the current time
        // will revert if trying to transfer too quickly
        require(_lastTransferTime[from] + TRANSFER_COOLDOWN <= block.timestamp, 'JavaBean: Cooldown period active. Good boys wait!');
        _;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused checkCooldown(from) {
        require(
            amount <= maxTransactionAmount,
            "JavaBean: Transfer amount exceeds maximum"
        );
        
        super._beforeTokenTransfer(from, to, amount);
        
        if(from != address(0)) { // Exclude minting from cooldown
            _lastTransferTime[from] = block.timestamp;
            emit CooldownTriggered(from, block.timestamp);
        }
    }
}