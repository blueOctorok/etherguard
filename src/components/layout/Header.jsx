'use client'
import { useSelector, useDispatch } from 'react-redux'
import { setWalletAddress, setTokenInfo } from '@/store/slices/blockchainSlice'

export default function Header() {
  const { connected, address } = useSelector((state) => state.blockchain)
  const dispatch = useDispatch()

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
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

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-md">
            <span className="text-blue-700 font-bold text-lg">JB</span>
          </div>
          <h1 className="text-2xl font-bold">JavaBean Analytics</h1>
        </div>

        {connected && (
          <div className="flex items-center">
            <div className="flex items-center bg-blue-800/30 py-2 px-4 rounded-full mr-3">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
              <span className="text-sm font-medium">
                {formatAddress(address)}
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-white text-sm bg-blue-800/40 hover:bg-blue-800/60 py-2 px-3 rounded-full transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      <div className="container mx-auto px-6 pb-1">
        <div className="text-sm text-blue-100 opacity-80">
          Blockchain Gas Analytics Dashboard
        </div>
      </div>
    </header>
  )
}
