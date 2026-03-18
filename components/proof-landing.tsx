'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PROOF_DEMOS, PROOF_TYPES } from '@/lib/proof-data'
import { track } from '@/lib/tracking'
import { getCompletedProofs, allProofsCompleted } from '@/lib/proof-completion'

export default function ProofLanding() {
  const router = useRouter()
  const [completedProofs, setCompletedProofs] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (allProofsCompleted()) {
      router.replace('/setup')
      return
    }
    setCompletedProofs(getCompletedProofs())
    track({ eventType: 'homepage_viewed' })
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFAF8',
    }}>
      <style>{`
        @media (max-width: 639px) {
          .proof-landing-hero h1 { font-size: 32px !important; }
          .proof-landing-hero { padding-top: 48px !important; }
          .proof-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      {/* Hero */}
      <section className="proof-landing-hero" style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '80px 24px 40px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
          fontSize: 46,
          fontWeight: 800,
          color: '#1a1a2e',
          lineHeight: 1.1,
          letterSpacing: -1,
          marginBottom: 14,
        }}>
          ChatGPT gives you text.<br />This gives you finished work.
        </h1>
        <p style={{
          fontSize: 18,
          color: '#555',
          marginBottom: 10,
          letterSpacing: 0.2,
        }}>
          Pick a task. See what comes back. Then try it yourself.
        </p>
        <p style={{
          fontSize: 15,
          color: '#999',
          marginBottom: 56,
        }}>
          Every result below is real. No cherry-picking. No editing. Just raw AI output.
        </p>

        {/* Proof cards */}
        <div className="proof-card-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          maxWidth: 960,
        }}>
          {PROOF_TYPES.map((type, i) => {
            const demo = PROOF_DEMOS[type]
            const isCompleted = completedProofs.has(type)
            const isFirst = i === 0 && !isCompleted
            const cardStyle: React.CSSProperties = {
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none',
              color: 'inherit',
              background: isCompleted ? '#f0faf0' : '#fff',
              border: isCompleted ? '1px solid #c6e6c6' : isFirst ? '2px solid #D64C00' : '1px solid #E8E4DF',
              padding: '36px 28px',
              textAlign: 'left',
              position: 'relative',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              cursor: isCompleted ? 'default' : 'pointer',
            }
            const inner = (
              <>
                {isFirst && (
                  <span style={{
                    position: 'absolute',
                    top: -1,
                    right: 20,
                    background: '#D64C00',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 12px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    Start here
                  </span>
                )}
                <h2 style={{
                  fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#1a1a2e',
                  lineHeight: 1.25,
                  marginBottom: 12,
                }}>
                  {demo.cardHeadline}
                </h2>
                <p style={{
                  fontSize: 15,
                  color: '#555',
                  lineHeight: 1.5,
                  flex: 1,
                }}>
                  {demo.cardSubtext}
                </p>
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isCompleted ? '#5B8A5A' : '#D64C00',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 20,
                }}>
                  {isCompleted ? 'Demo completed' : (
                    <>
                      {demo.cardCta}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D64C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </span>
              </>
            )
            if (isCompleted) {
              return (
                <div key={type} style={cardStyle}>
                  {inner}
                </div>
              )
            }
            return (
              <Link
                key={type}
                href={`/proof/${type}`}
                onClick={() => track({
                  eventType: 'proof_card_clicked',
                  metadata: { proofType: type },
                })}
                style={cardStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#D64C00'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(214, 76, 0, 0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = isFirst ? '#D64C00' : '#E8E4DF'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {inner}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Bottom line */}
      <div style={{
        textAlign: 'center',
        padding: '40px 24px 80px',
      }}>
        <p style={{ fontSize: 14, color: '#888' }}>
          Join hundreds of business owners automating their work with AI.
        </p>
      </div>
    </div>
  )
}
