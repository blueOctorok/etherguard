'use client'
import { useState } from 'react'
import { ethers } from 'ethers'
import { useSelector } from 'react-redux'
import { getContracts } from '@/utils/web3'

export default function TransferForm() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('') // 'success', 'error', or 'pending'
  const [loading, setLoading] = useState(false)

  const { connected } = useSelector((state) => state.blockchain)

  const handleTransfer = async (e) => {
    e.preventDefault()
    if (!connected) {
      setStatusType('error')
      setStatus('Please connect your wallet first')
      return
    }

    // Basic validation
    if (!recipient || !amount) {
      setStatusType('error')
      setStatus('Please provide both recipient address and amount')
      return
    }

    if (!ethers.isAddress(recipient)) {
      setStatusType('error')
      setStatus(
        'Invalid recipient address. Please enter a valid wallet address.'
      )
      return
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setStatusType('error')
      setStatus('Please enter a valid amount greater than 0')
      return
    }

    setLoading(true)
    setStatusType('pending')
    setStatus('Initiating transfer...')

    try {
      // Ensure a signer is used
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Pass the signer when fetching contracts
      const { javabean } = await getContracts(signer)

      const transferAmount = ethers.parseUnits(amount, 18)

      // Send the transaction
      const tx = await javabean.transfer(recipient, transferAmount)
      setStatus('Transfer pending. Please wait for confirmation...')

      // Wait for the transaction to be mined
      await tx.wait()

      setStatusType('success')
      setStatus('Transfer complete! Tokens sent successfully.')

      // Clear the form after successful transfer
      setRecipient('')
      setAmount('')
    } catch (error) {
      setStatusType('error')

      if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        setStatus('Transaction failed due to insufficient funds or gas issues.')
      } else if (error.code === 'ACTION_REJECTED') {
        setStatus(
          'Transaction rejected. You declined the transaction in your wallet.'
        )
      } else if (error.reason?.includes('cooldown')) {
        setStatus(
          'Transfer failed: Cooldown period active. Please wait before trying again.'
        )
      } else if (error.reason?.includes('exceeds maximum')) {
        setStatus(
          'Transfer failed: Amount exceeds the maximum transaction limit.'
        )
      } else {
        setStatus(
          `Transfer failed: ${error.message || 'Unknown error occurred'}`
        )
      }

      console.error('Transfer error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4">
        <h2 className="text-white text-xl font-bold">Transfer Tokens</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                disabled={loading || !connected}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (JAVA)
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 8.5C14.315 7.81501 13.1087 7.33855 12 7.30977C10.4113 7.31245 8.3623 8.68456 8.3623 10.9996C8.3623 13.3147 9.49649 14.6867 12 14.6965"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14.7V17.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 7.30981V10.0998"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                disabled={loading || !connected}
                min="0"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <span className="h-full px-3 py-0 text-gray-500 text-sm border-l border-gray-300 bg-gray-50 rounded-r-lg">
                  JAVA
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleTransfer}
            disabled={!connected || loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition-all flex items-center justify-center ${
              !connected
                ? 'bg-gray-400 cursor-not-allowed'
                : loading
                  ? 'bg-indigo-400 cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
            }`}
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading
              ? 'Processing...'
              : connected
                ? 'Send Tokens'
                : 'Connect Wallet First'}
          </button>

          {status && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                statusType === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : statusType === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              <div className="flex">
                {statusType === 'success' && (
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {statusType === 'error' && (
                  <svg
                    className="h-5 w-5 mr-2 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {statusType === 'pending' && (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                <p className="text-sm">{status}</p>
              </div>
            </div>
          )}

          {!connected && !status && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-lg text-center">
              <p className="text-gray-500 text-sm">
                Connect your wallet to transfer tokens
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
