import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

export default function GasChart({ gasStats }) {
  // Format numbers with comma separators
  const formatNumber = (value) => {
    return new Intl.NumberFormat().format(value)
  }

  // Transform the gas stats into a format suitable for the chart
  const chartData = [
    {
      name: 'Gas Usage',
      Min: parseInt(gasStats.transfer.minGas) || 0,
      Average: parseInt(gasStats.transfer.avgGas) || 0,
      Max: parseInt(gasStats.transfer.maxGas) || 0
    }
  ]

  // Custom tooltip formatter
  const tooltipFormatter = (value) => {
    return formatNumber(value)
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          Gas Usage Comparison
        </h3>
        <div className="text-sm text-gray-500">
          {gasStats.transfer.totalCalls} transactions
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.2}
            />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="Min"
              name="Minimum Gas"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
            <Bar
              dataKey="Average"
              name="Average Gas"
              fill="#6366F1"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
            <Bar
              dataKey="Max"
              name="Maximum Gas"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <div>
            <p className="text-xs text-gray-500">Min</p>
            <p className="text-sm font-medium">
              {formatNumber(gasStats.transfer.minGas)}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
          <div>
            <p className="text-xs text-gray-500">Average</p>
            <p className="text-sm font-medium">
              {formatNumber(gasStats.transfer.avgGas)}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <div>
            <p className="text-xs text-gray-500">Max</p>
            <p className="text-sm font-medium">
              {formatNumber(gasStats.transfer.maxGas)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Gas comparison across all transactions. Lower gas usage means more
          efficient operations.
        </p>
      </div>
    </div>
  )
}
