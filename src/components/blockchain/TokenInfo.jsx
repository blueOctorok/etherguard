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

      const { javabean } = await getContracts(signer)

      if (!javabean) {
        setError('Error: Contract not instantiated.')
        return
      }

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

  const handleDisconnect = () => {
    // Reset the Redux state
    dispatch(setWalletAddress(null))
    dispatch(
      setTokenInfo({
        balance: '0',
        totalSupply: '0'
      })
    )
  }

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
        <h2 className="text-white text-xl font-bold">Token Information</h2>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600 font-bold">JB</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">JavaBean Token</h3>
              <p className="text-gray-500 text-sm">$JAVA</p>
            </div>
          </div>

          {connected ? (
            <div className="flex items-center">
              <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 mr-3">
                <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                <span className="text-sm font-medium text-gray-700">
                  {formatAddress(address)}
                </span>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-3 py-2 rounded-lg text-red-600 border border-red-200 bg-red-50 font-medium hover:bg-red-100 transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md'
              }`}
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-500">Your Balance</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {connected ? (
                <span className="flex items-baseline">
                  {parseFloat(tokenBalance).toLocaleString()}
                  <span className="text-sm ml-1 text-gray-500">JAVA</span>
                </span>
              ) : (
                '-- JAVA'
              )}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-500">Total Supply</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {connected ? (
                <span className="flex items-baseline">
                  {parseFloat(totalSupply).toLocaleString()}
                  <span className="text-sm ml-1 text-gray-500">JAVA</span>
                </span>
              ) : (
                '-- JAVA'
              )}
            </p>
          </div>
        </div>

        {!connected && !loading && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-center">
            <p className="text-blue-600 text-sm">
              Connect your wallet to view your JavaBean token balance
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
