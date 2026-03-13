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
  const isDragging = useRef(false)

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100))
    setSliderPos(pct)
  }, [])

  const handleMouseDown = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    if (e && containerRef.current) {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as React.MouseEvent).clientX
      if (clientX !== undefined) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const pct = Math.max(2, Math.min(98, (x / rect.width) * 100))
        setSliderPos(pct)
      }
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX)
    }
    const onEnd = () => handleMouseUp()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [handleMove, handleMouseUp])

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        border: '2px solid #333',
        cursor: 'col-resize',
      }}
    >
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

      {/* Labels */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        zIndex: 10,
        pointerEvents: 'none' as const,
      }}>
        {beforeLabel}
      </div>
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        background: 'var(--world-accent, rgba(245,158,11,0.9))',
        color: '#0f172a',
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        zIndex: 10,
        pointerEvents: 'none' as const,
      }}>
        {afterLabel}
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
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
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
