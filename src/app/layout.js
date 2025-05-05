import { Inter } from 'next/font/google'
import { ReduxProvider } from '@/components/Provider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import NetworkStatus from '@/components/blockchain/NetworkStatus'
import WalletListener from '@/components/blockchain/WalletListener'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JavaBean Analytics',
  description: 'Blockchain Gas Analytics for ERC20 Operations'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
      >
        <ReduxProvider>
          <WalletListener />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <NetworkStatus />
        </ReduxProvider>
      </body>
    </html>
  )
}
