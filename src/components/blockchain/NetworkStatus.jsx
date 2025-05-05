'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function NetworkStatus() {
  const { connected } = useSelector((state) => state.blockchain)
  const [networkName, setNetworkName] = useState('')
  const [networkError, setNetworkError] = useState(null)

  useEffect(() => {
    const checkNetwork = async () => {
      if (!connected || !window.ethereum) return

      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        const networkMap = {
          '0x1': 'Ethereum Mainnet',
          '0x3': 'Ropsten Testnet',
          '0x4': 'Rinkeby Testnet',
          '0x5': 'Goerli Testnet',
          '0x2a': 'Kovan Testnet',
          '0x539': 'Hardhat Local',
          '0x7a69': 'Hardhat Network',
          '0x89': 'Polygon',
          '0x38': 'BSC',
          '0xa86a': 'Avalanche'
        }

        setNetworkName(
          networkMap[chainId] || `Chain ID: ${parseInt(chainId, 16)}`
        )
        setNetworkError(null)
      } catch (error) {
        console.error('Error getting network:', error)
        setNetworkError('Could not determine network')
      }
    }

    checkNetwork()

    // Listen for chain changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        checkNetwork()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', checkNetwork)
      }
    }
  }, [connected])

  if (!connected) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`px-4 py-2 rounded-full shadow-lg flex items-center 
        ${networkError ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
      >
        {!networkError && (
          <>
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium">{networkName}</span>
          </>
        )}
        {networkError && (
          <>
            <div className="h-2 w-2 rounded-full bg-red-300 mr-2"></div>
            <span className="text-sm font-medium">{networkError}</span>
          </>
        )}
      </div>
    </div>
  )
}
