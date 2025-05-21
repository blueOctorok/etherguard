// Contract configuration for different networks
export const contractConfig = {
  // Local development (Hardhat)
  localhost: {
    chainId: 31337,
    javabeanAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    analyzerAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
  },

  // For demo purposes - you would replace these with actual testnet addresses
  sepolia: {
    chainId: 11155111,
    javabeanAddress: process.env.NEXT_PUBLIC_SEPOLIA_JAVABEAN_ADDRESS || '',
    analyzerAddress: process.env.NEXT_PUBLIC_SEPOLIA_ANALYZER_ADDRESS || ''
  },

  // Mainnet (if ever deployed)
  mainnet: {
    chainId: 1,
    javabeanAddress: process.env.NEXT_PUBLIC_MAINNET_JAVABEAN_ADDRESS || '',
    analyzerAddress: process.env.NEXT_PUBLIC_MAINNET_ANALYZER_ADDRESS || ''
  }
}

// Get contract addresses based on current network
export const getContractAddresses = (chainId) => {
  switch (chainId) {
    case 31337:
      return contractConfig.localhost
    case 11155111:
      return contractConfig.sepolia
    case 1:
      return contractConfig.mainnet
    default:
      // Fall back to localhost for demo
      return contractConfig.localhost
  }
}
