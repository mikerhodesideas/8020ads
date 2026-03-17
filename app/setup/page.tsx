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
  const [selectedAvatar, setSelectedAvatar] = useState<PlayerType | null>(null)

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
    setSelectedAvatar(typeId)
    // Scroll to the choice section
    setTimeout(() => {
      document.getElementById('path-choice')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleContinueStandard = () => {
    setWorld('gallery')
    router.push('/play')
  }

  const handleUnlockGame = () => {
    setWorld('arcade')
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
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
            fontSize: 36,
            fontWeight: 800,
            color: '#1a1a2e',
            lineHeight: 1.15,
            letterSpacing: -0.5,
            marginBottom: 8,
          }}>
            Ready to try it yourself?
          </h1>
          <p style={{ fontSize: 16, color: '#555', lineHeight: 1.5 }}>
            So we can show you the most relevant demos, which best describes you?
          </p>
        </div>

        {/* Avatar selection */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" style={{ maxWidth: 1200 }}>
          {avatars.map((a) => {
            const isSelected = selectedAvatar === a.id
            return (
              <button
                key={a.id}
                onClick={() => handleAvatarSelect(a.id)}
                className={cn(
                  'group relative text-left overflow-hidden',
                  'border',
                  'rounded-[2px] transition-all duration-300 ease-out',
                  'cursor-pointer block',
                  'aspect-[3/4]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]',
                  isSelected
                    ? 'border-[var(--color-brand-orange)] shadow-lg -translate-y-1'
                    : 'border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1'
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
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <span style={{
                      background: '#D64C00',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>Selected</span>
                  </div>
                )}
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
                    style={{ backgroundColor: isSelected ? '#D64C00' : a.accent }}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      &#8594;
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Path choice - appears after avatar selection */}
        {selectedAvatar && (
          <div id="path-choice" style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid #E8E4DF' }}>
            <h2 style={{
              fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
              fontSize: 28,
              fontWeight: 800,
              color: '#1a1a2e',
              marginBottom: 8,
            }}>
              You&apos;re about to see something most people don&apos;t believe until they watch it happen.
            </h2>
            <p style={{ fontSize: 16, color: '#555', marginBottom: 8, lineHeight: 1.6 }}>
              Three real tasks. Real files. AI does them in seconds, not hours. You&apos;ll drag in the file, see the result, then try it yourself with your own data.
            </p>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>
              Pick how you want to experience it:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Standard path */}
              <button
                onClick={handleContinueStandard}
                style={{
                  textAlign: 'left',
                  background: '#fff',
                  border: '1px solid #E8E4DF',
                  padding: '28px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#D64C00'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(214, 76, 0, 0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E8E4DF'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#1a1a2e',
                  marginBottom: 12,
                }}>
                  Straight to the demos
                </div>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 12, flex: 1 }}>
                  Clean, minimal interface. Watch AI handle real business tasks in seconds, compare the before and after, then try it yourself with your own files. No distractions, no game mechanics. Just the proof.
                </p>
                <div style={{ marginBottom: 16, border: '1px solid #E8E4DF', overflow: 'hidden' }}>
                  <Image
                    src="/images/skills-preview.jpg"
                    alt="Skills demo preview"
                    width={520}
                    height={140}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5, marginBottom: 20 }}>
                  6 demos across 3 levels. About 10 minutes total.
                </p>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#D64C00',
                  fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
                }}>
                  Start the demos &rarr;
                </span>
              </button>

              {/* Game path - Super Mario themed */}
              <button
                onClick={handleUnlockGame}
                style={{
                  textAlign: 'left',
                  background: '#1a1a2e',
                  border: '2px solid #f59e0b',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.15s, border-color 0.15s',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(245, 158, 11, 0.25)'
                  e.currentTarget.style.borderColor = '#fbbf24'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#f59e0b'
                }}
              >
                {/* Game banner image */}
                <div style={{
                  width: '100%',
                  height: 180,
                  backgroundImage: 'url(/images/game-banner.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 30%',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 48,
                    background: 'linear-gradient(transparent, #1a1a2e)',
                  }} />
                </div>

                <div style={{ padding: '16px 28px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#fbbf24',
                    marginBottom: 12,
                    textShadow: '0 1px 8px rgba(245, 158, 11, 0.3)',
                  }}>
                    Play the game version
                  </div>
                  <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 8, flex: 1 }}>
                    Same demos, but wrapped in a Super Mario-style game. Complete levels, unlock badges, and choose from 6 different themed worlds including Zelda, Tetris, and Red Alert. Business tools have never been this fun.
                  </p>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 20 }}>
                    6 demos across 3 levels. Choose your world.
                  </p>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#fbbf24',
                    fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
                  }}>
                    Let&apos;s-a go! &rarr;
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
