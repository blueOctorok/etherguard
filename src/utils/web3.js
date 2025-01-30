import { ethers } from 'ethers'

// Get contract ABIs
import JavaBeanABI from '../artifacts/contracts/JavaBean.sol/JavaBean.json'
import JavaBeanAnalyzerABI from '../artifacts/contracts/JavaBeanAnalyzer.sol/JavaBeanAnalyzer.json'

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

    return { signer, address: await signer.getAddress(), error: null }
  } catch (error) {
    if (error.code === 4001) {
      return { error: 'Wallet connection request denied. Please try again.' }
    }
    return {
      error: 'Failed to connect wallet. Please check MetaMask and try again.'
    }
  }
}

export const getContracts = async (signer) => {
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
}
