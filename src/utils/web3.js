import { ethers } from 'ethers'
import { getContractAddresses } from './contractConfig'

// Embedded ABIs
const JavaBeanABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function pause()',
  'function unpause()',
  'function paused() view returns (bool)',
  'function owner() view returns (address)',
  'function maxTransactionAmount() view returns (uint256)',
  'function setMaxTransactionAmount(uint256 amount)',
  'function setAnalyzer(address analyzerAddress)',
  'function recoverERC20(address tokenAddress, uint256 tokenAmount)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event CooldownTriggered(address indexed user, uint256 timestamp)',
  'event maxTransactionAmountUpdated(uint256 newAmount)',
  'event TokensRecovered(address token, uint256 amount)'
]

const JavaBeanAnalyzerABI = [
  'function recordGasUsage(string memory operation, uint256 gasUsed)',
  'function getGasInfo(string memory operation) view returns (uint256 totalGas, uint256 calls, uint256 avgGas, uint256 minGas, uint256 maxGas)',
  'function operationGas(bytes32) view returns (uint256 totalGas, uint256 calls, uint256 avgGas, uint256 minGas, uint256 maxGas)',
  'function owner() view returns (address)',
  'event GasUsageRecords(string operation, uint256 gasUsed, uint256 timestamp)'
]

export const connectWallet = async () => {
  if (!window.ethereum) {
    return { error: 'MetaMask is not installed. Please install it to proceed.' }
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    return { signer, address: await signer.getAddress(), provider, error: null }
  } catch (error) {
    if (error.code === 4001) {
      return { error: 'Wallet connection request denied. Please try again.' }
    }
    return {
      error: 'Failed to connect wallet. Please check MetaMask and try again.'
    }
  }
}

export const getContracts = async (signer = null) => {
  if (!signer) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    signer = await provider.getSigner()
  }

  // Get network info
  const network = await signer.provider.getNetwork()
  const chainId = Number(network.chainId)

  // Get contract addresses for this network
  const { javabeanAddress, analyzerAddress } = getContractAddresses(chainId)

  if (!javabeanAddress || !analyzerAddress) {
    throw new Error(
      `Contracts not deployed on network with chainId: ${chainId}`
    )
  }

  const javabean = new ethers.Contract(javabeanAddress, JavaBeanABI, signer)
  const analyzer = new ethers.Contract(
    analyzerAddress,
    JavaBeanAnalyzerABI,
    signer
  )

  return { javabean, analyzer }
}

// Set up wallet event listeners
export const setupWalletListeners = (handleAccountsChanged) => {
  if (!window.ethereum) return null

  const handleAccounts = (accounts) => {
    if (accounts.length === 0) {
      handleAccountsChanged(null)
    } else {
      handleAccountsChanged(accounts[0])
    }
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  window.ethereum.on('accountsChanged', handleAccounts)
  window.ethereum.on('chainChanged', handleChainChanged)

  // Return cleanup function
  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccounts)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }
}
