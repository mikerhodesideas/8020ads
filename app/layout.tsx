import type { Metadata } from 'next'
import { Oxanium, Inter, Cormorant_Garamond, Press_Start_2P, VT323 } from 'next/font/google'
import Navbar from '@/components/navbar'
import { GameProvider } from '@/components/game-provider'
import { TransitionProvider } from '@/components/transition-overlay'
import pkg from '@/package.json'
import DevTools from '@/components/dev-tools'
import SiteFooter from '@/components/site-footer'
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
  title: '8020skill - ChatGPT gives you text. This gives you finished work.',
  description: 'Pick a task. See what comes back. Then try it yourself.',
  other: { 'app-version': pkg.version },
  openGraph: {
    title: '8020skill - ChatGPT gives you text. This gives you finished work.',
    description: 'Pick a task. See what comes back. Then try it yourself.',
    type: 'website',
    url: 'https://8020skill.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Consent-gated tracking. consent.js sets Consent Mode v2 defaults, then
            loads the Google Ads tag, Meta pixel, and LinkedIn Insight tag immediately
            for visitors outside the EEA/UK/CH and only after Accept for regulated
            visitors. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__CONSENT_CONFIG={gtag:['G-7GLEPQ3QBZ','AW-17960620915'],meta:'3162038373979830',linkedin:'189092',privacy:'https://ads2ai.com/privacy',siteName:'8020skill.com'};`,
          }}
        />
        <script src="/consent.js" defer />
      </head>
      <body className={`${oxanium.variable} ${inter.variable} ${cormorant.variable} ${pressStart2P.variable} ${vt323.variable} antialiased`}>
        <GameProvider>
          <TransitionProvider>
            <Navbar />
            <main>{children}</main>
            <SiteFooter />
            <DevTools />
          </TransitionProvider>
        </GameProvider>
      </body>
    </html>
  )
}
