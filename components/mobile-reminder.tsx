'use client'

import { useState } from 'react'
import { track, getSessionId } from '@/lib/tracking'

interface MobileReminderProps {
  proofType: string
  onClose: () => void
  onDismiss: () => void
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function MobileReminder({ proofType, onClose, onDismiss }: MobileReminderProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) return
    setStatus('submitting')

    try {
      const sessionId = getSessionId()
      const emailHash = await sha256(email.toLowerCase().trim())

      await fetch('https://api.ads2ai.com/api/skill-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, proofType, sessionId }),
      })

      track({
        eventType: 'mobile_reminder_requested',
        metadata: { proofType, email_hash: emailHash },
      })

      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          maxWidth: 400,
          width: '100%',
          padding: '36px 28px',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            color: '#888',
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          &times;
        </button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 48,
              height: 48,
              background: '#E8F5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              color: '#1a1a2e',
              marginBottom: 12,
            }}>
              Check your inbox!
            </h2>
            <p style={{
              fontSize: 15,
              color: '#555',
              lineHeight: 1.6,
              marginBottom: 24,
            }}>
              We sent you the links. Open the email on your desktop to get started.
            </p>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: 14,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{
              width: 48,
              height: 48,
              background: '#FFF3E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D64C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="0" />
                <polyline points="2 3 12 13 22 3" />
              </svg>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              color: '#1a1a2e',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              Cowork runs on your desktop
            </h2>

            <p style={{
              fontSize: 15,
              color: '#555',
              textAlign: 'center',
              lineHeight: 1.6,
              marginBottom: 24,
            }}>
              Want to come back to this later?
            </p>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: 15,
                border: '1px solid #E8E4DF',
                outline: 'none',
                marginBottom: 12,
                boxSizing: 'border-box',
                color: '#1a1a2e',
                background: '#FAFAF8',
              }}
            />

            <button
              onClick={handleSubmit}
              disabled={status === 'submitting' || !email.includes('@')}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                background: status === 'submitting' ? '#999' : '#D64C00',
                color: '#fff',
                padding: '14px 24px',
                fontSize: 15,
                fontWeight: 700,
                border: 'none',
                cursor: status === 'submitting' ? 'wait' : 'pointer',
                letterSpacing: 0.3,
                marginBottom: 16,
                transition: 'background 0.15s',
              }}
            >
              {status === 'submitting' ? 'Sending...' : 'Email me a reminder'}
            </button>

            {status === 'error' && (
              <p style={{
                fontSize: 13,
                color: '#c62828',
                textAlign: 'center',
                marginBottom: 12,
              }}>
                Something went wrong. Try again or continue to setup.
              </p>
            )}

            <button
              onClick={onDismiss}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: 14,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              No thanks, take me to setup anyway
            </button>
          </>
        )}
      </div>
    </div>
  )
}
