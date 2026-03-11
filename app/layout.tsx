import type { Metadata } from 'next'
import { Oxanium, Inter } from 'next/font/google'
import Navbar from '@/components/navbar'
import { GameProvider } from '@/components/game-provider'
import './globals.css'

const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-oxanium',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: '8020skill - The AI Game',
  description: 'See AI solve real business problems live. Pick your world. Level up.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${oxanium.variable} ${inter.variable} antialiased`}>
        <GameProvider>
          <Navbar />
          <main>{children}</main>
        </GameProvider>
      </body>
    </html>
  )
}
