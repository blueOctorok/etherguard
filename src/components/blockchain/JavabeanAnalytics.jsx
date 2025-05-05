import { useState } from 'react'

const JavaBeanAnalytics = () => {
  // Mock state for demonstration
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [tokenBalance, setTokenBalance] = useState('0')
  const [totalSupply, setTotalSupply] = useState('1000000000')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')
  const [loading, setLoading] = useState(false)
  const [gasStats, setGasStats] = useState({
    transfer: {
      avgGas: '21000',
      minGas: '20000',
      maxGas: '25000',
      totalCalls: '3'
    }
  })

  // Mock connect handler
  const handleConnect = () => {
    setLoading(true)
    setTimeout(() => {
      setConnected(true)
      setAddress('0x1234...5678')
      setTokenBalance('50000')
      setLoading(false)
    }, 1000)
  }

  // Mock transfer handler
  const handleTransfer = (e) => {
    e.preventDefault()
    if (!recipient || !amount) {
      setStatusType('error')
      setStatus('Please provide both recipient address and amount')
      return
    }

    setLoading(true)
    setStatusType('pending')
    setStatus('Processing transaction...')

    setTimeout(() => {
      setStatusType('success')
      setStatus('Transfer complete! Tokens sent successfully.')
      setRecipient('')
      setAmount('')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">JavaBean Analytics</h1>
          {connected ? (
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
              <span className="text-sm font-medium">{address}</span>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Token Information Card */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-blue-500 px-6 py-4">
              <h2 className="text-white text-xl font-bold">
                Token Information
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">JB</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">JavaBean Token</h3>
                    <p className="text-gray-500 text-sm">$JAVA</p>
                  </div>
                </div>
                {!connected && (
                  <button
                    onClick={handleConnect}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow"
                  >
                    {loading ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500">
                    Your Balance
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {connected ? `${tokenBalance} JAVA` : '-- JAVA'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Supply
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {connected ? `${totalSupply} JAVA` : '-- JAVA'}
                  </p>
                </div>
              </div>

              {!connected && (
                <div className="mt-6 text-center text-gray-500 text-sm">
                  <p>Connect your wallet to view your JavaBean token balance</p>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Form Card */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-indigo-500 px-6 py-4">
              <h2 className="text-white text-xl font-bold">Transfer Tokens</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                    disabled={!connected || loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (JAVA)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                    disabled={!connected || loading}
                    min="0"
                    step="0.01"
                  />
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={!connected || loading}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                    !connected
                      ? 'bg-gray-400 cursor-not-allowed'
                      : loading
                        ? 'bg-indigo-400 cursor-wait'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
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
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : statusType === 'error'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    <p className="text-sm text-center">{status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gas Analytics Card */}
        <div className="mt-8 bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-violet-500 px-6 py-4">
            <h2 className="text-white text-xl font-bold">Gas Analytics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Average Gas</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {connected ? gasStats.transfer.avgGas : '0'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-500">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {connected ? gasStats.transfer.totalCalls : '0'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Minimum Gas</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {connected ? gasStats.transfer.minGas : '0'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Maximum Gas</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {connected ? gasStats.transfer.maxGas : '0'}
                </p>
              </div>
            </div>

            {connected && gasStats.transfer.totalCalls !== '0' ? (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-700 mb-4">
                  Gas Usage Chart
                </h3>
                <div className="h-64 bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-center">
                  <div className="flex items-end h-full w-full justify-center space-x-12">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 bg-green-400 rounded-t-lg"
                        style={{
                          height: `${parseInt(gasStats.transfer.minGas) / 300}px`
                        }}
                      ></div>
                      <p className="text-sm mt-2 font-medium">Min</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 bg-blue-400 rounded-t-lg"
                        style={{
                          height: `${parseInt(gasStats.transfer.avgGas) / 300}px`
                        }}
                      ></div>
                      <p className="text-sm mt-2 font-medium">Avg</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 bg-red-400 rounded-t-lg"
                        style={{
                          height: `${parseInt(gasStats.transfer.maxGas) / 300}px`
                        }}
                      ></div>
                      <p className="text-sm mt-2 font-medium">Max</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">
                  {connected
                    ? 'No transaction data available yet'
                    : 'Connect your wallet to view gas analytics'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200 py-6">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>JavaBean Analytics - A Blockchain Portfolio Project</p>
        </div>
      </footer>
    </div>
  )
}

export default JavaBeanAnalytics
