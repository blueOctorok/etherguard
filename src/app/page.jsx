import TokenInfo from '@/components/blockchain/TokenInfo'
import GasAnalytics from '@/components/blockchain/GasAnalytics'
import TransferForm from '@/components/blockchain/TransferForm'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-slate-500 p-6 shadow">
        <h2 className="text-xl font-bold mb-4">Token Information</h2>
        <TokenInfo />
        <TransferForm />
      </section>

      <section className="bg-slate-500 p-6 shadow">
        <h2 className="text-xl font-bold mb-4">Gas Analytics</h2>
        <GasAnalytics />
      </section>
    </div>
  )
}
