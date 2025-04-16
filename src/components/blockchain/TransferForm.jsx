'use client'
import { useState } from 'react'
import { ethers } from 'ethers'
import { useSelector } from 'react-redux'
import { getContracts } from '@/utils/web3'

export default function TransferForm() {
  // Track the recipient address and amount to send
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  // Track transaction status for user feedback
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('') // 'success', 'error', or 'pending'

  // Add loading state
  const [loading, setLoading] = useState(false)

  // Check if we're connected to use in UI
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
    <div className="bg-white p-6 mt-6 shadow-md rounded-lg">
      <h3 className="text-xl font-bold text-gray-700 mb-4">Transfer Tokens</h3>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Amount (JAVA)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            disabled={loading}
            min="0"
            step="0.01"
          />
        </div>

        <button
          type="submit"
          disabled={!connected || loading}
          className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition 
            ${
              loading
                ? 'bg-gray-400 cursor-wait'
                : connected
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-md'
                  : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {loading
            ? 'Processing...'
            : connected
              ? 'Send Tokens'
              : 'Connect Wallet First'}
        </button>

        {status && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              statusType === 'success'
                ? 'bg-green-50 text-green-600'
                : statusType === 'error'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-blue-50 text-blue-600'
            }`}
          >
            <p className="text-sm text-center">{status}</p>
          </div>
        )}
      </form>
    </div>
  )
}
