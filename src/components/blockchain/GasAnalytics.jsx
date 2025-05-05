'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getContracts } from '@/utils/web3'
import GasChart from './GasChart'

export default function GasAnalytics() {
  const [gasStats, setGasStats] = useState({
    transfer: {
      avgGas: '0',
      minGas: '0',
      maxGas: '0',
      totalCalls: '0'
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { connected } = useSelector((state) => state.blockchain)

  useEffect(() => {
    const fetchGasStats = async () => {
      if (!connected) return

      setLoading(true)
      setError(null)

      try {
        const { analyzer } = await getContracts()

        const [totalGas, calls, avgGas, minGas, maxGas] =
          await analyzer.getGasInfo('transfer')

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

  // Format numbers with comma separators
  const formatNumber = (num) => {
    return parseInt(num).toLocaleString()
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-4">
        <h2 className="text-white text-xl font-bold">Gas Analytics</h2>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg">
            <div className="flex items-center">
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
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-violet-500"
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
            <span className="ml-3 text-gray-500">
              Loading gas statistics...
            </span>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-500">Average Gas</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatNumber(gasStats.transfer.avgGas)}
                </p>
                <div className="mt-1 h-1 w-full bg-violet-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{
                      width: `${Math.min(100, parseInt(gasStats.transfer.avgGas) / 300)}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-500">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatNumber(gasStats.transfer.totalCalls)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {parseInt(gasStats.transfer.totalCalls) > 0
                    ? 'Transactions recorded'
                    : 'No transactions yet'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-500">Minimum Gas</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatNumber(gasStats.transfer.minGas)}
                </p>
                <div className="mt-1 h-1 w-full bg-green-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${Math.min(100, parseInt(gasStats.transfer.minGas) / 300)}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-500">Maximum Gas</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatNumber(gasStats.transfer.maxGas)}
                </p>
                <div className="mt-1 h-1 w-full bg-red-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${Math.min(100, parseInt(gasStats.transfer.maxGas) / 300)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {connected && gasStats.transfer.totalCalls !== '0' ? (
              <div className="mt-8">
                <GasChart gasStats={gasStats} />
              </div>
            ) : (
              <div className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-lg text-center">
                <svg
                  className="h-12 w-12 text-gray-400 mx-auto mb-3"
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
                    d="M12 8V12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16H12.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-gray-500">
                  {connected
                    ? 'No transaction data available yet. Make a transfer to see gas analytics.'
                    : 'Connect your wallet to view gas analytics'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
