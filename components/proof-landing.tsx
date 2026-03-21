'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
          .proof-card-grid {
            grid-template-columns: 1fr !important;
          }
          .trust-bar {
            flex-direction: column !important;
          }
          .trust-bar > div {
            border-right: none !important;
            border-bottom: 1px solid #E8E4DF;
          }
          .trust-bar > div:last-child {
            border-bottom: none;
          }
        }
      `}</style>
      {/* Dark hero zone with background image */}
      <section className="proof-landing-hero" style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#1a1a2e',
      }}>
        <Image
          src="/images/bg.png"
          alt=""
          fill
          style={{ objectFit: 'cover', opacity: 0.35 }}
          sizes="100vw"
          priority
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(26,26,46,0.92), rgba(26,26,46,0.55), transparent)',
        }} />
        <div style={{
          position: 'relative',
          maxWidth: 960,
          margin: '0 auto',
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
            fontSize: 46,
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: -1,
            marginBottom: 14,
          }}>
            ChatGPT gives you text.<br />This gives you finished work.
          </h1>
          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 10,
            letterSpacing: 0.2,
          }}>
            Skills built for your industry. You just use them.
          </p>
          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.45)',
            marginBottom: 0,
          }}>
            Nothing is staged. Pick a demo. See what it actually does.
          </p>
        </div>
      </section>

      {/* Orange accent divider */}
      <div style={{ height: 4, background: '#D64C00' }} />

      {/* Content zone */}
      <section style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '40px 24px 0',
        textAlign: 'center',
      }}>
        {/* Completion reward teaser */}
        <p style={{
          fontSize: 13,
          color: '#D64C00',
          fontWeight: 600,
          marginBottom: 20,
        }}>
          Complete all 3 levels and get 10 free skills + a course on building your own
        </p>

        {/* Tab-style levels container */}
        <div style={{
          border: '1px solid #E8E4DF',
          background: '#fff',
          maxWidth: 960,
          overflow: 'hidden',
        }}>
          {/* Tab row */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #E8E4DF',
          }}>
            <div style={{
              flex: 1,
              padding: '16px 24px',
              textAlign: 'center',
              borderBottom: '3px solid #D64C00',
              marginBottom: -1,
              borderRight: '1px solid #E8E4DF',
            }}>
              <div style={{
                fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase' as const,
                color: '#D64C00',
                marginBottom: 2,
              }}>Level 1</div>
              <div style={{ fontSize: 13, color: '#555' }}>
                See what AI does with just a file
              </div>
            </div>
            <div style={{
              flex: 1,
              padding: '16px 24px',
              textAlign: 'center',
              background: '#f4f3f1',
              opacity: 0.5,
              borderRight: '1px solid #E8E4DF',
            }}>
              <div style={{
                fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase' as const,
                color: '#999',
                marginBottom: 2,
              }}>Level 2</div>
              <div style={{ fontSize: 13, color: '#aaa' }}>
                One sentence. Finished work.
              </div>
            </div>
            <div style={{
              flex: 1,
              padding: '16px 24px',
              textAlign: 'center',
              background: '#f4f3f1',
              opacity: 0.5,
            }}>
              <div style={{
                fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase' as const,
                color: '#999',
                marginBottom: 2,
              }}>Level 3</div>
              <div style={{ fontSize: 13, color: '#aaa' }}>
                Connected to your real tools
              </div>
            </div>
          </div>

          {/* Tab content: proof cards */}
          <div style={{ padding: '28px 24px' }}>
            <div className="proof-card-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
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
          </div>

          {/* Unlock hint */}
          <div style={{
            textAlign: 'center',
            padding: 20,
            fontSize: 13,
            color: '#aaa',
            fontStyle: 'italic',
            borderTop: '1px solid #eee',
          }}>
            Complete Level 1 to unlock Levels 2 &amp; 3
          </div>
        </div>
      </section>

      {/* Trust line */}
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '32px 24px 0',
      }}>
        <div className="trust-bar" style={{
          display: 'flex',
          background: '#fff',
          border: '1px solid #E8E4DF',
        }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '18px 16px', borderRight: '1px solid #E8E4DF' }}>
            <strong style={{ fontFamily: 'var(--font-oxanium), system-ui, sans-serif', color: '#1a1a2e', fontSize: 20, fontWeight: 800, display: 'block', lineHeight: 1.25, marginBottom: 2 }}>It drafts.</strong>
            <span style={{ fontSize: 14, color: '#555' }}>You review.</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '18px 16px', borderRight: '1px solid #E8E4DF' }}>
            <strong style={{ fontFamily: 'var(--font-oxanium), system-ui, sans-serif', color: '#1a1a2e', fontSize: 20, fontWeight: 800, display: 'block', lineHeight: 1.25, marginBottom: 2 }}>It suggests.</strong>
            <span style={{ fontSize: 14, color: '#555' }}>You decide.</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '18px 16px' }}>
            <span style={{ fontSize: 14, color: '#555', display: 'block', marginBottom: 2 }}>Nothing goes out</span>
            <strong style={{ fontFamily: 'var(--font-oxanium), system-ui, sans-serif', color: '#1a1a2e', fontSize: 20, fontWeight: 800 }}>without your approval.</strong>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div style={{
        textAlign: 'center',
        padding: '32px 24px 80px',
      }}>
        <p style={{ fontSize: 14, color: '#888' }}>
          Join hundreds of business owners automating their work with AI.
        </p>
      </div>
    </div>
  )
}
