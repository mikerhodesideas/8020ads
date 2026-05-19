'use client'

import Link from 'next/link'

export default function Level3() {
  return (
    <main style={{
      minHeight: 'calc(100vh - 80px)',
      maxWidth: 1600,
      margin: '0 auto',
      padding: '120px 48px',
      fontFamily: 'var(--font-oxanium), sans-serif',
      color: '#0A0A0A',
      background: '#FAFAF8',
    }}>
      <div style={{
        fontSize: 11,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: '#D64C00',
        fontWeight: 700,
        marginBottom: 16,
      }}>§ Level 3 · Coming soon</div>
      <h1 style={{
        fontFamily: 'var(--font-oxanium), sans-serif',
        fontWeight: 700,
        fontSize: 'clamp(48px, 6vw, 88px)',
        lineHeight: 0.95,
        letterSpacing: '-0.03em',
        marginBottom: 24,
        maxWidth: 1100,
      }}>
        Connect Cowork to your own data.
      </h1>
      <p style={{
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: 18,
        lineHeight: 1.55,
        color: '#2A2A2A',
        maxWidth: 720,
        marginBottom: 16,
      }}>
        The same kind of skills you just ran, pointed at your real spreadsheets, your real numbers, your real work. This is where it stops being a demo.
      </p>
      <p style={{
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: 17,
        lineHeight: 1.55,
        color: '#555555',
        maxWidth: 720,
        marginBottom: 36,
      }}>
        I'm still designing this bit. If you want to be first in line when it ships, get in touch.
      </p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-oxanium), sans-serif',
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: 0.5,
          padding: '11px 18px',
          border: '1px solid #0A0A0A',
          background: '#0A0A0A',
          color: '#FAFAF8',
          textDecoration: 'none',
          borderRadius: 2,
        }}>← Back to start</Link>
        <Link href="https://ads2ai.com" style={{
          fontFamily: 'var(--font-oxanium), sans-serif',
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: 0.5,
          padding: '11px 18px',
          border: '1px solid #0A0A0A',
          background: 'transparent',
          color: '#0A0A0A',
          textDecoration: 'none',
          borderRadius: 2,
        }}>Get in touch ↗</Link>
      </div>
    </main>
  )
}
