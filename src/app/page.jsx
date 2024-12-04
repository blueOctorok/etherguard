import TokenInfo from '@/components/blockchain/TokenInfo'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-slate-500 p-6 shadow">
        <h2 className="text-xl font-bold mb-4">Token Information</h2>
        <TokenInfo />
      </section>
      <section className="bg-slate-500 p-6 shadow">
        <h2 className="text-xl font-bold mb-4">Gas Analytics</h2>
        --- Gas Analytics go here ---
      </section>
    </div>
  )
}
