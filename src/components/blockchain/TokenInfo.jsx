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
    const { signer, address, error } = await connectWallet()

    if (error) {
      alert(error) // Show user-friendly alert instead of console error
      return
    }

    dispatch(setWalletAddress(address))

    const { javabean } = await getContracts(signer)
    const balance = await javabean.balanceOf(address)
    const supply = await javabean.totalSupply()

    dispatch(
      setTokenInfo({
        balance: ethers.formatUnits(balance, 18),
        totalSupply: ethers.formatUnits(supply, 18)
      })
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">JavaBean Token ($JAVA)</h3>
        <button
          onClick={handleConnect}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {connected ? 'Connected' : 'Connect Wallet'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded text-black">
          <p className="text-sm text-gray-500">Your Balance:</p>
          <p className="text-xl font-bold">{tokenBalance} JAVA</p>
        </div>
        <div className="p-4 bg-gray-50 rounded text-black">
          <p className="text-sm text-gray-500">Total Supply:</p>
          <p className="text-xl font-bold">{totalSupply} JAVA</p>
        </div>
      </div>
    </div>
  )
}
