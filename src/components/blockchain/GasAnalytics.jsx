'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getContracts } from '@/utils/web3'

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

  // Get connected status from Redux to know when to fetch data
  const { connected } = useSelector((state) => state.blockchain)

  // Fetch gas stats when connected
  useEffect(() => {
    const fetchGasStats = async () => {
      if (!connected) return

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
      }
    }

    fetchGasStats()
  }, [connected])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <h3 className="text-xl font-semibold mb-2">Transfer Operations</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Average Gas:</p>
              <p className="text-xl text-black font-bold">
                {gasStats.transfer.avgGas}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Total Transactions:</p>
              <p className="text-xl text-black font-bold">
                {gasStats.transfer.totalCalls}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Minimum Gas:</p>
              <p className="text-xl text-black font-bold">
                {gasStats.transfer.minGas}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Maximum Gas:</p>
              <p className="text-xl text-black font-bold">
                {gasStats.transfer.maxGas}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
