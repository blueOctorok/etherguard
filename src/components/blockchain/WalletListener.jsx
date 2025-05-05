'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setWalletAddress, setTokenInfo } from '@/store/slices/blockchainSlice'
import { setupWalletListeners } from '@/utils/web3'

// This is an invisible component that just listens for wallet events
export default function WalletListener() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Handle wallet account changes or disconnections
    const handleAccountsChanged = (address) => {
      if (address) {
        dispatch(setWalletAddress(address))
      } else {
        // Reset state when wallet is disconnected
        dispatch(setWalletAddress(null))
        dispatch(
          setTokenInfo({
            balance: '0',
            totalSupply: '0'
          })
        )
      }
    }

    // Set up event listeners for wallet changes
    const cleanup = setupWalletListeners(handleAccountsChanged)

    // Clean up listeners on unmount
    return cleanup
  }, [dispatch])

  // This component doesn't render anything
  return null
}
