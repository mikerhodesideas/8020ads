'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import LevelMap from '@/components/level-map'

export default function PlayPage() {
  const { world, setWorld } = useGame()
  const [showTooltip, setShowTooltip] = useState(false)
  const isGameMode = world !== 'gallery'

  const handleMarioClick = () => {
    setWorld('arcade')
    // Page will re-render with game world
  }

  return (
    <>
      <LevelMap />

      {/* Bouncing Mario - only show in Classic/gallery mode */}
      {!isGameMode && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 24,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          // Keep container still so tooltip doesn't bounce
          onClick={handleMarioClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Tooltip - positioned to the left of Mario */}
          {showTooltip && (
            <div style={{
              position: 'absolute',
              right: 76,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#1a1a2e',
              color: '#fbbf24',
              fontSize: 13,
              fontWeight: 600,
              padding: '8px 14px',
              whiteSpace: 'nowrap',
              border: '2px solid #f59e0b',
              fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
              pointerEvents: 'none',
            }}>
              Switch to the game version of the demos
              <div style={{
                position: 'absolute',
                right: -6,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: '6px solid #f59e0b',
              }} />
            </div>
          )}

          {/* Mario image with bounce */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #f59e0b',
              animation: 'marioBounce 2s ease-in-out infinite',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)',
            }}
          >
            <Image
              src="/images/sprites/mario.png"
              alt="Play game version"
              width={64}
              height={64}
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Click me text */}
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#D64C00',
            marginTop: 4,
            fontFamily: 'var(--font-oxanium), system-ui, sans-serif',
            animation: 'marioBounce 2s ease-in-out infinite',
          }}>
            Click me!
          </span>

          <style>{`
            @keyframes marioBounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
          `}</style>
        </div>
      )}
    </>
  )
}
