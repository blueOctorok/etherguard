// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JavaBean is ERC20, Pausable, Ownable {
    // Cooldown mechanics
    mapping(address => uint256) private _lastTransferTime;
    uint256 public constant TRANSFER_COOLDOWN = 1 minutes;  // Adjustable

    constructor() ERC20('JavaBean', 'JAVA') {
        _transferOwnership(msg.sender);
        // 1 billion tokens with 18 decimals
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    modifier checkCooldown(address from) {
        require(_lastTransferTime[from] + TRANSFER_COOLDOWN <= block.timestamp, 'JavaBean: Cooldown period active. Good boys wait!');
        _;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal whenNotPaused checkCooldown(from) override {
        super._beforeTokenTransfer(from, to, amount);
        if (from != address(0)) {
            // Exclude minting from cooldown
            _lastTransferTime[from] = block.timestamp;
        }
    }
}