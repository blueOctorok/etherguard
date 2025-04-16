'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { useDispatch, useSelector } from 'react-redux'
import { setWalletAddress, setTokenInfo } from '@/store/slices/blockchainSlice'
import { connectWallet, getContracts } from '@/utils/web3'

export default function TokenInfo() {
  const dispatch = useDispatch()
  const { connected, tokenBalance, totalSupply, address } = useSelector(
    (state) => state.blockchain
  )

  // Add loading and error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConnect = async () => {
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const { signer, address, error } = await connectWallet()
      if (error) {
        setError(error)
        return
      }

      dispatch(setWalletAddress(address))

      // Ensure signer is used
      const { javabean } = await getContracts(signer)

      if (!javabean) {
        setError('Error: Contract not instantiated.')
        return
      }

      // Get token info
      const balance = await javabean.balanceOf(address)
      const supply = await javabean.totalSupply()

      dispatch(
        setTokenInfo({
          balance: ethers.formatUnits(balance, 18),
          totalSupply: ethers.formatUnits(supply, 18)
        })
      )
    } catch (error) {
      console.error('Error fetching balance:', error)
      setError('Failed to get token information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-700">
          JavaBean Token ($JAVA)
        </h3>
        <button
          onClick={handleConnect}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white transition ${
            loading
              ? 'bg-gray-400 cursor-wait'
              : connected
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading
            ? 'Connecting...'
            : connected
              ? `Connected: ${formatAddress(address)}`
              : 'Connect Wallet'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 shadow-md rounded-lg">
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">Your Balance:</p>
          <p className="text-2xl font-bold text-gray-800">
            {connected ? `${tokenBalance} JAVA` : '-- JAVA'}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Supply:</p>
          <p className="text-2xl font-bold text-gray-800">
            {connected ? `${totalSupply} JAVA` : '-- JAVA'}
          </p>
        </div>
      </div>

      {!connected && !loading && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          <p>Connect your wallet to view your JavaBean token balance</p>
        </div>
      )}
    </div>
  )
}
