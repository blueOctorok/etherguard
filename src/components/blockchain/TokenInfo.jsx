'use client'

import { ethers } from 'ethers'
import { useDispatch, useSelector } from 'react-redux'
import { setWalletAddress, setTokenInfo } from '@/store/slices/blockchainSlice'
import { connectWallet, getContracts } from '@/utils/web3'

export default function TokenInfo() {
  const dispatch = useDispatch()
  const { connected, tokenBalance, totalSupply } = useSelector(
    (state) => state.blockchain
  )

  const handleConnect = async () => {
    try {
      const { signer, address, error } = await connectWallet()
      if (error) {
        alert(error) // Show user-friendly alert instead of console error
        return
      }

      dispatch(setWalletAddress(address))

      // Ensure signer is used
      const { javabean } = await getContracts(signer)

      if (!javabean) {
        console.error('Error: Contract not instantiated.')
        return
      }

      // Ensure the balanceOf call is correct
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
    }
  }

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-700">
          JavaBean Token ($JAVA)
        </h3>
        <button
          onClick={handleConnect}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {connected ? 'Connected' : 'Connect Wallet'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 p-6 bg-white shadow-md rounded-lg">
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <p className="text-sm text-gray-500">Your Balance:</p>
          <p className="text-2xl font-bold text-gray-800">
            {tokenBalance} JAVA
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Supply:</p>
          <p className="text-2xl font-bold text-gray-800">{totalSupply} JAVA</p>
        </div>
      </div>
    </div>
  )
}
