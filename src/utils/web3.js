import { ethers } from 'ethers'

// Get contract ABIs
import JavaBeanABI from '@/artifacts/contracts/JavaBean.sol/JavaBean.json'
import JavaBeanAnalyzerABI from '@/artifacts/contracts/JavaBeanAnalyzer.sol/JavaBeanAnalyzer.json'

// Contract addresses from our deployment
const JAVABEAN_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const ANALYZER_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

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
    console.error('Connection error:', error)
    if (error.code === 4001) {
      return { error: 'Wallet connection request denied. Please try again.' }
    }
    return {
      error: 'Failed to connect wallet. Please check MetaMask and try again.'
    }
  }
}

// Note: Actual MetaMask disconnection requires the wallet to be disconnected from the dApp
// Redux state reset is handled in the components
export const disconnectWallet = async () => {
  // In a real app, you might want to clear any cached connection info here
  return { success: true }
}

export const getContracts = async (signer = null) => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found')
  }

  if (!signer) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      signer = await provider.getSigner()
    } catch (error) {
      console.error('Error getting signer:', error)
      throw new Error('Unable to get signer. Please connect wallet first.')
    }
  }

  try {
    const javabean = new ethers.Contract(
      JAVABEAN_ADDRESS,
      JavaBeanABI.abi,
      signer
    )
    const analyzer = new ethers.Contract(
      ANALYZER_ADDRESS,
      JavaBeanAnalyzerABI.abi,
      signer
    )

    return { javabean, analyzer }
  } catch (error) {
    console.error('Error creating contract instances:', error)
    throw new Error('Failed to initialize contracts')
  }
}

// Utility function to listen for account changes
export const setupWalletListeners = (callback) => {
  if (!window.ethereum) return

  // Handle account changes
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      callback(null)
    } else {
      // Account changed
      callback(accounts[0])
    }
  })

  // Handle chain changes
  window.ethereum.on('chainChanged', () => {
    // Usually best to reload the page on chain change
    window.location.reload()
  })

  return () => {
    // Cleanup listeners when component unmounts
    window.ethereum.removeListener('accountsChanged', callback)
    window.ethereum.removeListener('chainChanged', () => {})
  }
}
