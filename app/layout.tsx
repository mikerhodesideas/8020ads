import type { Metadata } from 'next'
import { Oxanium, Inter, Cormorant_Garamond, Press_Start_2P, VT323 } from 'next/font/google'
import Navbar from '@/components/navbar'
import { GameProvider } from '@/components/game-provider'
import { TransitionProvider } from '@/components/transition-overlay'
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

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pixel',
})

const vt323 = VT323({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-terminal',
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
      <body className={`${oxanium.variable} ${inter.variable} ${cormorant.variable} ${pressStart2P.variable} ${vt323.variable} antialiased`}>
        <GameProvider>
          <TransitionProvider>
            <Navbar />
            <main>{children}</main>
          </TransitionProvider>
        </GameProvider>
      </body>
    </html>
  )
}
