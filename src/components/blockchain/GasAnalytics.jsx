'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getContracts } from '@/utils/web3'
import GasChart from './GasChart' // Import the new chart component

export default function GasAnalytics() {
  // Track gas stats for different operations
  const [gasStats, setGasStats] = useState({
    transfer: {
      avgGas: '0',
      minGas: '0',
      maxGas: '0',
      totalCalls: '0'
    }
  })

  // Add loading state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get connected status from Redux to know when to fetch data
  const { connected } = useSelector((state) => state.blockchain)

  // Fetch gas stats when connected
  useEffect(() => {
    const fetchGasStats = async () => {
      if (!connected) return

      setLoading(true)
      setError(null)

      try {
        // Get analyzer contract instance
        const { analyzer } = await getContracts()

        // Fetch stats for transfer operations
        const [totalGas, calls, avgGas, minGas, maxGas] =
          await analyzer.getGasInfo('transfer')

        // Update state with formatted numbers
        setGasStats({
          transfer: {
            avgGas: avgGas.toString(),
            minGas: minGas.toString(),
            maxGas: maxGas.toString(),
            totalCalls: calls.toString()
          }
        })
      } catch (error) {
        console.error('Error fetching gas stats:', error)
        setError('Failed to load gas analytics. Please check your connection.')
      } finally {
        setLoading(false)
      }
    }

    fetchGasStats()
  }, [connected])

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h3 className="text-xl font-bold text-gray-700 mb-4">Gas Analytics</h3>

      {loading && (
        <div className="text-center py-6">
          <p className="text-gray-500">Loading gas statistics...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <p className="text-sm text-gray-500">Average Gas:</p>
              <p className="text-2xl font-bold text-gray-800">
                {gasStats.transfer.avgGas}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Transactions:</p>
              <p className="text-2xl font-bold text-gray-800">
                {gasStats.transfer.totalCalls}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <p className="text-sm text-gray-500">Minimum Gas:</p>
              <p className="text-2xl font-bold text-gray-800">
                {gasStats.transfer.minGas}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <p className="text-sm text-gray-500">Maximum Gas:</p>
              <p className="text-2xl font-bold text-gray-800">
                {gasStats.transfer.maxGas}
              </p>
            </div>
          </div>

          {/* Add the Gas Chart */}
          {gasStats.transfer.totalCalls !== '0' && (
            <GasChart gasStats={gasStats} />
          )}
        </>
      )}

      {!connected && (
        <div className="text-center p-6 bg-gray-50 rounded-lg mt-4">
          <p className="text-gray-500">
            Connect your wallet to view gas analytics
          </p>
        </div>
      )}
    </div>
  )
}
