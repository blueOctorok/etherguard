import TokenInfo from '@/components/blockchain/TokenInfo'
import GasAnalytics from '@/components/blockchain/GasAnalytics'
import TransferForm from '@/components/blockchain/TransferForm'

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TokenInfo />
          <TransferForm />
        </div>

        <div className="mt-8">
          <GasAnalytics />
        </div>
      </div>
    </div>
  )
}
