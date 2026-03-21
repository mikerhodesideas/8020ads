'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import WipeComparison from '@/components/wipe-comparison'
import MobileReminder from '@/components/mobile-reminder'
import { track } from '@/lib/tracking'
import type { ProofDemo } from '@/lib/proof-data'
import { getOtherProofs, getNextUncompletedProof, getProofIndex, PROOF_ORDER } from '@/lib/proof-data'
import { getCompletedProofs, markProofCompleted } from '@/lib/proof-completion'

interface ProofPageProps {
  demo: ProofDemo
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
}

export default function ProofPage({ demo }: ProofPageProps) {
  const hasTrackedView = useRef(false)
  const hasTrackedWipe = useRef(false)
  const [iframeHeight, setIframeHeight] = useState(900)
  const [showMobileReminder, setShowMobileReminder] = useState(false)
  const [completedProofs, setCompletedProofs] = useState<Set<string>>(new Set())
  const isMobile = useIsMobile()
  const router = useRouter()

  const demoIndex = getProofIndex(demo.type)
  const demoNumber = demoIndex + 1
  const totalDemos = PROOF_ORDER.length

  // Mark this demo as completed and load completed set
  useEffect(() => {
    markProofCompleted(demo.type)
    setCompletedProofs(getCompletedProofs())
  }, [demo.type])

  // Find next uncompleted demo (smart: skips completed ones)
  const nextProof = getNextUncompletedProof(demo.type, completedProofs)

  // Track page view once
  useEffect(() => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true
      let source: string = 'direct'
      if (typeof window !== 'undefined') {
        const ref = document.referrer
        if (ref.includes(window.location.host)) {
          if (ref.includes('/proof/')) source = 'other_proof'
          else source = 'homepage'
        }
      }
      track({ eventType: 'proof_page_viewed', metadata: { proofType: demo.type, source } })
    }
  }, [demo.type])

  const handleWipeInteraction = () => {
    if (!hasTrackedWipe.current) {
      hasTrackedWipe.current = true
      track({ eventType: 'proof_wipe_interacted', metadata: { proofType: demo.type } })
    }
  }

  const others = getOtherProofs(demo.type)

  useEffect(() => {
    const updateHeight = () => {
      const h = Math.max(450, Math.min(700, Math.round(window.innerHeight * 0.6)))
      setIframeHeight(h)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const beforeFile = demo.beforeFile
  const afterFile = demo.afterFile

  const nextButton = nextProof ? (
    <Link
      href={`/proof/${nextProof.type}`}
      onClick={() => track({
        eventType: 'proof_path_chosen',
        metadata: { proofType: demo.type, path: 'next_demo', targetProof: nextProof.type },
      })}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: '#D64C00',
        color: '#fff',
        padding: '10px 24px',
        fontSize: 14,
        fontWeight: 700,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#FF6B1A' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#D64C00' }}
    >
      Next demo: {nextProof.cardHeadline} &rarr;
    </Link>
  ) : (
    <Link
      href="/setup"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: '#D64C00',
        color: '#fff',
        padding: '10px 24px',
        fontSize: 14,
        fontWeight: 700,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#FF6B1A' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#D64C00' }}
    >
      All demos complete. Try it yourself &rarr;
    </Link>
  )

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 639px) {
          .proof-header { padding: 32px 16px 24px !important; }
          .proof-headline { font-size: 26px !important; }
          .proof-how { font-size: 15px !important; }
          .proof-whats-next-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {showMobileReminder && (
        <MobileReminder
          proofType={demo.type}
          onClose={() => setShowMobileReminder(false)}
          onDismiss={() => {
            setShowMobileReminder(false)
            router.push('/setup')
          }}
        />
      )}

      {/* Header with demo number + next button */}
      <section className="proof-header" style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '48px 32px 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Link
            href="/"
            style={{
              fontSize: 12,
              color: '#888',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}
          >
            &larr; All demos
          </Link>
          {nextButton}
        </div>

        {/* Demo number label */}
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#D64C00',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: 12,
        }}>
          Demo {demoNumber} of {totalDemos}
        </div>

        <h1 className="proof-headline" style={{
          fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
          fontSize: 36,
          fontWeight: 800,
          color: '#1a1a2e',
          lineHeight: 1.15,
          letterSpacing: -0.5,
          marginBottom: 12,
        }}>
          {demo.proofHeadline}
        </h1>
        <p className="proof-how" style={{
          fontSize: 17,
          color: '#555',
          lineHeight: 1.6,
        }}>
          {demo.proofHow}
        </p>
      </section>

      {/* "You say" prompt */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 32px 16px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 20px',
          background: '#fff',
          border: '1px solid #E8E4DF',
          borderLeft: '3px solid #D64C00',
          marginBottom: 16,
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#D64C00',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}>You say:</span>
          <span style={{
            fontSize: 15,
            color: '#1a1a2e',
            fontWeight: 500,
            fontStyle: 'italic',
          }}>
            &ldquo;{demo.youSay}&rdquo;
          </span>
        </div>
      </section>

      {/* The comparison */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 32px 16px',
      }}>
        {/* Comparison labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            background: 'rgba(0,0,0,0.7)',
            padding: '6px 14px',
          }}>
            {demo.beforeLabel}
          </span>
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            background: '#D64C00',
            padding: '6px 14px',
          }}>
            {demo.afterLabel}
          </span>
        </div>

        <div onMouseDown={handleWipeInteraction} onTouchStart={handleWipeInteraction}>
          <WipeComparison
            beforeContent={
              <iframe
                src={beforeFile}
                style={{ width: '100%', height: iframeHeight, border: 'none', display: 'block' }}
                title={`${demo.beforeLabel} - ${demo.type}`}
              />
            }
            afterContent={
              <iframe
                src={afterFile}
                style={{ width: '100%', height: iframeHeight, border: 'none', display: 'block' }}
                title={`${demo.afterLabel} - ${demo.type}`}
              />
            }
            height={iframeHeight}
            initialPosition={30}
            beforeLabel={demo.beforeLabel}
            afterLabel={demo.afterLabel}
          />
        </div>

        {/* Result line */}
        <div style={{ marginTop: 20 }}>
          <p style={{
            fontSize: 18,
            color: '#1a1a2e',
            fontWeight: 700,
            letterSpacing: -0.2,
          }}>
            {demo.resultLine}
          </p>
          <p style={{
            fontSize: 15,
            color: '#888',
            marginTop: 4,
          }}>
            {demo.resultDetail}
          </p>
        </div>
      </section>

      {/* Next demo CTA - prominent */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 32px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 0',
        }}>
          {nextButton}
        </div>
      </section>

      {/* Try it yourself CTA */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '8px 32px 24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          background: '#fff',
          border: '1px solid #E8E4DF',
          padding: '20px 28px',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
              Want to try this with your own {demo.type === 'inbox' ? 'inbox' : demo.type === 'website' ? 'website' : 'data'}?
            </p>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>
              You need a{' '}
              <a href="https://claude.com/pricing/" target="_blank" rel="noopener noreferrer" style={{ color: '#D64C00', textDecoration: 'none', fontWeight: 600 }}
                onClick={() => track({ eventType: 'setup_requirements_clicked', metadata: { requirement: 'claude_subscription' } })}
              >Claude subscription</a>
              {' '}(free to try) and{' '}
              <a href="https://claude.com/download" target="_blank" rel="noopener noreferrer" style={{ color: '#D64C00', textDecoration: 'none', fontWeight: 600 }}
                onClick={() => track({ eventType: 'setup_requirements_clicked', metadata: { requirement: 'cowork_install' } })}
              >Cowork</a>
              {' '}(Anthropic's desktop app for Claude).
            </p>
            <p style={{ fontSize: 12, color: '#aaa' }}>
              Takes about 2 minutes to set up.
            </p>
          </div>
          {isMobile ? (
            <button
              onClick={() => {
                track({ eventType: 'proof_path_chosen', metadata: { proofType: demo.type, path: 'try_yourself', device: 'mobile' } })
                setShowMobileReminder(true)
              }}
              style={{
                background: '#D64C00', color: '#fff', padding: '10px 28px', fontSize: 14,
                fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Try it free
            </button>
          ) : (
            <Link
              href="/setup"
              onClick={() => track({ eventType: 'proof_path_chosen', metadata: { proofType: demo.type, path: 'try_yourself' } })}
              style={{
                background: '#D64C00', color: '#fff', padding: '10px 28px', fontSize: 14,
                fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FF6B1A' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#D64C00' }}
            >
              Try it free
            </Link>
          )}
        </div>
      </section>

      {/* Other demos with demo numbers */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 32px 80px',
      }}>
        <div className="proof-whats-next-grid" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${others.length}, 1fr)`,
          gap: 16,
        }}>
          {others.map(other => {
            const isCompleted = completedProofs.has(other.type)
            const otherIndex = getProofIndex(other.type)
            const otherNumber = otherIndex + 1
            const cardStyle: React.CSSProperties = {
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none',
              padding: '20px',
              background: isCompleted ? '#f0faf0' : '#fff',
              border: `1px solid ${isCompleted ? '#c6e6c6' : '#E8E4DF'}`,
              transition: 'border-color 0.15s',
              cursor: 'pointer',
              minHeight: 130,
            }
            const inner = (
              <>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#D64C00',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  display: 'block',
                  marginBottom: 6,
                }}>
                  Demo {otherNumber}
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 4 }}>
                  {other.cardHeadline}
                </span>
                <span style={{ fontSize: 13, color: '#888', flex: 1 }}>
                  {other.cardSubtext}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: isCompleted ? '#5B8A5A' : '#D64C00', display: 'block', marginTop: 12 }}>
                  {isCompleted ? 'Demo completed' : 'See the proof \u2192'}
                </span>
              </>
            )
            return (
              <Link
                key={other.type}
                href={`/proof/${other.type}`}
                onClick={() => track({
                  eventType: 'proof_path_chosen',
                  metadata: { proofType: demo.type, path: 'another_example', targetProof: other.type },
                })}
                style={cardStyle}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#D64C00' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isCompleted ? '#c6e6c6' : '#E8E4DF' }}
              >
                {inner}
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
