// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract JavaBeanAnalyzer is Ownable {
    // Struc to store gas info for each operation
    struct GasInfo {
        uint256 totalGas;
        uint256 calls;
        uint256 avgGas;
        uint256 minGas;
        uint256 maxGas;
    }

    // Mapping to store gas usage by operation type
    mapping(bytes32 => GasInfo) public operationGas;

    // Events for tracking
    event GasUsageRecords (string operation, uint256 gasUsed, uint256 timestamp);

    constructor() {
        _transferOwnership(msg.sender);
    }

    // Function to record gas usage
    function recordGasUsage(string memory operation, uint256 gasUsed) public {
        bytes32 operationHash = keccak256(abi.encodePacked(operation));
        GasInfo storage info = operationGas[operationHash];

        // Update min gas if it's first call or new value is lower
        if (info.calls == 0 || gasUsed < info.minGas) {
            info.minGas = gasUsed;
        }

        // Update max gsa if new value is higher
        if (gasUsed > info.maxGas) {
            info.maxGas = gasUsed;
        }

        // Update totals
        info.totalGas += gasUsed;
        info.calls += 1;
        info.avgGas = info.totalGas / info.calls;

        emit GasUsageRecords(operation, gasUsed, block.timestamp);
    }

    // Get gas info for a specific operation
    function getGasInfo(string memory operation) public view returns (
        uint256 totalGas,
        uint256 calls,
        uint256 avgGas,
        uint256 minGas,
        uint256 maxGas
    ) {
        bytes32 operationHash = keccak256(abi.encodePacked(operation));
        GasInfo storage info = operationGas[operationHash];
        return (
            info.totalGas,
            info.calls,
            info.avgGas,
            info.minGas,
            info.maxGas
        );
    }
}