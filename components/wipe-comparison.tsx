'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface WipeComparisonProps {
  beforeContent: React.ReactNode
  afterContent: React.ReactNode
  height?: number
  initialPosition?: number
  beforeLabel?: string
  afterLabel?: string
}

export default function WipeComparison({
  beforeContent,
  afterContent,
  height = 1000,
  initialPosition = 30,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: WipeComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPos, setSliderPos] = useState(initialPosition)
  const [dragging, setDragging] = useState(false)

  const getPos = useCallback((clientX: number) => {
    if (!containerRef.current) return null
    const rect = containerRef.current.getBoundingClientRect()
    return Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100))
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setDragging(true)
    const pos = getPos(e.clientX)
    if (pos !== null) setSliderPos(pos)
  }, [getPos])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    const pos = getPos(e.clientX)
    if (pos !== null) setSliderPos(pos)
  }, [dragging, getPos])

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  // Set cursor on body during drag
  useEffect(() => {
    if (dragging) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [dragging])

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        border: '2px solid #333',
        cursor: 'col-resize',
        touchAction: 'none',
      }}
    >
      {/* Drag shield: blocks iframes from stealing pointer events during drag */}
      {dragging && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            cursor: 'col-resize',
          }}
        />
      )}

      {/* AFTER layer (full width, sits behind) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
        {afterContent}
      </div>

      {/* BEFORE layer (clipped to slider position, overlaid on top) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          overflow: 'hidden',
        }}
      >
        <div style={{ filter: 'grayscale(100%) brightness(0.85)', width: '100%' }}>
          {beforeContent}
        </div>
      </div>

      {/* Slider line (visible) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${sliderPos}%`,
          transform: 'translateX(-50%)',
          width: 3,
          height: '100%',
          background: 'var(--world-accent, #f59e0b)',
          zIndex: 20,
          pointerEvents: 'none' as const,
          boxShadow: '0 0 8px rgba(245,158,11,0.4)',
        }}
      />

      {/* Slider grab zone (wide invisible hit area, covers full height) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${sliderPos}%`,
          transform: 'translateX(-50%)',
          width: 32,
          height: '100%',
          cursor: 'col-resize',
          zIndex: 25,
          touchAction: 'none',
        }}
      />

      {/* Small handle indicator (centered on line) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${sliderPos}%`,
          transform: 'translate(-50%, -50%)',
          width: 36,
          height: 36,
          background: 'var(--world-accent, #f59e0b)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          pointerEvents: 'none' as const,
          boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M8 5l-5 7 5 7" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 5l5 7-5 7" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}
