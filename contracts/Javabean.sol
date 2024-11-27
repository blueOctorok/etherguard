// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Interface to communicate with our analyzer contract
interface IJavaBeanAnalyzer {
    function recordGasUsage(string memory operation, uint256 gasUsed) external;
}

contract JavaBean is ERC20, Pausable, Ownable {
    // Cooldown mechanics
    mapping(address => uint256) private _lastTransferTime;
    uint256 public constant TRANSFER_COOLDOWN = 1 minutes;  // Adjustable

    // Max transaction limit
    uint256 public maxTransactionAmount;

    // Reference to our gas analyzer contract
    IJavaBeanAnalyzer public analyzer;

    // Events
    event CooldownTriggered(address indexed user, uint256 timestamp);
    event maxTransactionAmountUpdated(uint256 newAmount);
    event TokensRecovered(address token, uint256 amount);

    constructor() ERC20('JavaBean', 'JAVA') {
        _transferOwnership(msg.sender);
        uint256 totalSupply = 1_000_000_000 * 10 ** decimals();
        _mint(msg.sender, totalSupply);
        maxTransactionAmount = totalSupply / 100;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setMaxTransactionAmount(uint256 amount) public onlyOwner {
        require(amount > 0, 'JavaBean: Amount must be greater than 0');
        require(amount <= totalSupply(), 'JavaBean: Amount must be less than total supply');
        maxTransactionAmount = amount;
        emit maxTransactionAmountUpdated(amount);
    }

    // Set the analyzer contract address
    function setAnalyzer(address analyzerAddress) public onlyOwner {
        analyzer = IJavaBeanAnalyzer(analyzerAddress);
    }

    function recoverERC20(address tokenAddress, uint256 tokenAmount) public onlyOwner {
        require(tokenAddress != address(this), 'JavaBean: Cannot recover JavaBean tokens');
        IERC20(tokenAddress).transfer(owner(), tokenAmount);
        emit TokensRecovered(tokenAddress, tokenAmount); 
    }

    modifier checkCooldown(address from) {
        require(
            _lastTransferTime[from] + TRANSFER_COOLDOWN <= block.timestamp,
            'JavaBean: Cooldown period active. Good boys wait!'
        );
        _;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount 
    ) internal virtual override whenNotPaused { 
        // Start measuring gas usage
        uint256 startGas = gasleft();

        // First, check maximum transfer amount (simpler check)
        if (from != address(0) && to != address(0)) {
            require( 
                amount <= maxTransactionAmount,
                "JavaBean: Transfer amount exceeds maximum" 
            );
        }
        
        // Then check cooldown (more complex, time-based check)
        if (from != address(0)) {
            require(
                _lastTransferTime[from] + TRANSFER_COOLDOWN <= block.timestamp,
                "JavaBean: Cooldown period active. Good boys wait!"
            );
            _lastTransferTime[from] = block.timestamp;
            emit CooldownTriggered(from, block.timestamp);
        }
        
        super._beforeTokenTransfer(from, to, amount);

        // Calculate and record gas usage if analyzer is set
        uint256 gasUsed = startGas - gasleft();
        if (address(analyzer) != address(0)) {
            analyzer.recordGasUsage("transfer", gasUsed);
        }
    }
}