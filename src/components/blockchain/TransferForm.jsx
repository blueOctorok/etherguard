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

  // Check if we're connected to use in UI
  const { connected } = useSelector((state) => state.blockchain)

  const handleTransfer = async (e) => {
    e.preventDefault()
    if (!connected) {
      setStatus('Please connect your wallet first')
      return
    }

    try {
      setStatus('Initiating transfer...')
      const { javabean } = await getContracts()

      // Convert the amount into the correct format (18 decimals)
      const transferAmount = ethers.parseUnits(amount, 18)

      // Send the transaction
      const tx = await javabean.transfer(recipient, transferAmount)
      setStatus('Transfer Pending...')

      // Wait for tx to be mined
      await tx.wait()
      setStatus('Transfer complete!')

      // Clear the form
      setRecipient('')
      setAmount('')
    } catch (error) {
      setStatus(`Transfer failed: ${error.message}`)
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Transfer Tokens</h3>
      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount (JAVA)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={!connected}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Send Tokens
        </button>
        {status && (
          <p className="text-sm text-center text-gray-600">{status}</p>
        )}
      </form>
    </div>
  )
}
