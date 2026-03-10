import type { Metadata } from 'next'
import { Oxanium, Inter } from 'next/font/google'
import Navbar from '@/components/navbar'
import { DemoProvider } from '@/components/demo-provider'
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
  title: 'Cowork26 - Live AI Demo',
  description: 'See AI solve real business problems live in Claude Cowork',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${oxanium.variable} ${inter.variable} antialiased`}>
        <DemoProvider>
          <Navbar />
          <main>{children}</main>
          <div className="fixed bottom-2 right-3 text-[10px] text-[var(--color-faint)] opacity-50 font-heading">
            v{process.env.NEXT_PUBLIC_VERSION}
          </div>
        </DemoProvider>
      </body>
    </html>
  )
}
