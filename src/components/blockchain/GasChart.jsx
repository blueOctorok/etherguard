import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

export default function GasChart({ gasStats }) {
  // Transform the gas stats into a format suitable for the chart
  const chartData = [
    {
      name: 'Transfer Gas',
      Average: parseInt(gasStats.transfer.avgGas) || 0,
      Min: parseInt(gasStats.transfer.minGas) || 0,
      Max: parseInt(gasStats.transfer.maxGas) || 0
    }
  ]

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <h4 className="text-lg font-semibold text-gray-700 mb-4">
        Gas Usage Chart
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => new Intl.NumberFormat().format(value)}
            />
            <Legend />
            <Bar dataKey="Min" fill="#10B981" name="Minimum Gas" />
            <Bar dataKey="Average" fill="#3B82F6" name="Average Gas" />
            <Bar dataKey="Max" fill="#EF4444" name="Maximum Gas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Gas consumption comparison across {gasStats.transfer.totalCalls}{' '}
        transactions
      </p>
    </div>
  )
}
