import { Inter } from 'next/font/google'
import { ReduxProvider } from '@/components/Provider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EtherGuard',
  description: 'Blockchain Analytics at its finest'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ReduxProvider>
          <Header />
          <main className="flex-1 container mx-auto p-4">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  )
}
