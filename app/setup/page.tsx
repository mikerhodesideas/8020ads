'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { track } from '@/lib/tracking'
import { cn } from '@/lib/utils'
import type { PlayerType } from '@/lib/game-data'

const avatars = [
  {
    id: 'agency' as PlayerType,
    title: 'Agency Owner',
    desc: 'Client reporting, competitor analysis, deliverables',
    image: '/images/business-persona.png',
    accent: '#2563EB',
  },
  {
    id: 'employee' as PlayerType,
    title: 'Agency Employee',
    desc: 'Campaign management, search terms, content',
    image: '/images/employee-persona.png',
    accent: '#0D9488',
  },
  {
    id: 'freelancer' as PlayerType,
    title: 'Freelancer',
    desc: 'Solo client work, prospecting, reporting',
    image: '/images/freelancer-persona.png',
    accent: '#7C3AED',
  },
  {
    id: 'business' as PlayerType,
    title: 'Business Owner',
    desc: 'Inbox, meetings, financials, onboarding',
    image: '/images/business-owner-persona.png',
    accent: '#1B8C3A',
  },
]

export default function SetupPage() {
  const router = useRouter()
  const { setType, setWorld, markProofComplete } = useGame()

  useEffect(() => {
    let source = 'direct'
    if (typeof window !== 'undefined') {
      const ref = document.referrer
      if (ref.includes('/proof/inbox')) source = 'proof_inbox'
      else if (ref.includes('/proof/website')) source = 'proof_website'
      else if (ref.includes('/proof/data')) source = 'proof_data'
    }
    track({ eventType: 'setup_page_viewed', metadata: { source } })
  }, [])

  const handleAvatarSelect = (typeId: PlayerType) => {
    track({ eventType: 'avatar_selected', avatarType: typeId })
    setType(typeId)
    markProofComplete()
    setWorld('gallery')
    router.push('/play')
  }

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Compact requirements bar at top */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '10px 16px',
          background: '#fff',
          border: '1px solid #E8E4DF',
          marginBottom: 40,
          fontSize: 13,
          color: '#555',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontWeight: 700, color: '#1a1a2e', whiteSpace: 'nowrap' }}>Before you start:</span>
          <a
            href="https://claude.com/pricing/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#D64C00', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            1. Claude subscription (Pro or Max) &#8599;
          </a>
          <a
            href="https://claude.com/download"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#D64C00', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            2. Install Cowork &#8599;
          </a>
          <span style={{ color: '#999', marginLeft: 'auto' }}>Already set up? Pick your avatar below.</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 12 }}>
          <h1 style={{
            fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
            fontSize: 36,
            fontWeight: 800,
            color: '#1a1a2e',
            lineHeight: 1.15,
            letterSpacing: -0.5,
            marginBottom: 8,
          }}>
            Pick your role. We&apos;ll show you what AI can do for it.
          </h1>
          <p style={{ fontSize: 17, color: '#555', lineHeight: 1.5 }}>
            Each demo uses real files from your world. Pick the one closest to your day job.
          </p>
        </div>

        {/* Avatar selection */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" style={{ maxWidth: 1200 }}>
          {avatars.map((a) => (
            <button
              key={a.id}
              onClick={() => handleAvatarSelect(a.id)}
              className={cn(
                'group relative text-left overflow-hidden',
                'border border-[var(--color-border)]',
                'rounded-[2px] transition-all duration-300 ease-out',
                'cursor-pointer block',
                'aspect-[3/4]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]',
                'hover:shadow-lg hover:-translate-y-1'
              )}
            >
              <Image
                src={a.image}
                alt={a.title}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-0 inset-x-0 h-[3px]" style={{ backgroundColor: a.accent }} />
              <div className="absolute inset-x-0 bottom-0 px-4 sm:px-5 pb-4 sm:pb-5">
                <h3 className="text-base sm:text-lg font-bold mb-1 font-heading text-white leading-tight">
                  {a.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed mb-3">
                  {a.desc}
                </p>
                <div
                  className={cn(
                    'inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2',
                    'text-white text-[10px] sm:text-xs font-semibold',
                    'rounded-[2px] transition-all duration-200',
                    'group-hover:gap-3',
                    'font-heading'
                  )}
                  style={{ backgroundColor: a.accent }}
                >
                  Select
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    &#8594;
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
