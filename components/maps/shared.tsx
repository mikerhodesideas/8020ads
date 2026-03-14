'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'
import type { SkinConfig } from '@/lib/skin-config'

// Level complete celebration overlay (shared between gallery and mario maps)
export function LevelCelebration({
  levelNumber,
  onDismiss,
  skin,
}: {
  levelNumber: number
  onDismiss: () => void
  skin: SkinConfig
}) {
  const isDark = skin.isDark

  useEffect(() => {
    if (skin.sounds.levelComplete) playSound(skin.sounds.levelComplete)
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss, skin.sounds.levelComplete])

  const victoryImage = skin.victoryImage

  const levelImage = skin.levelImages?.[levelNumber as 1 | 2 | 3]
  const bandBg = isDark ? 'rgba(10, 10, 20, 0.75)' : 'rgba(40, 20, 0, 0.7)'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center celebration-overlay cursor-pointer"
      onClick={onDismiss}
    >
      {/* Full-bleed background image */}
      {levelImage ? (
        <>
          <Image
            src={levelImage}
            alt="Level Complete"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)' }} />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: isDark ? 'rgba(26, 26, 46, 0.9)' : 'rgba(120, 80, 20, 0.7)',
            backdropFilter: 'blur(8px)',
          }}
        />
      )}

      {/* Semi-transparent band across middle */}
      <div
        className="absolute inset-x-0"
        style={{
          top: '25%',
          bottom: '25%',
          background: `linear-gradient(to bottom, transparent, ${bandBg} 15%, ${bandBg} 85%, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-6">
        <div className="text-center celebration-text">
          <h2
            className={cn(
              'text-3xl sm:text-4xl font-extrabold font-heading mb-2 celebration-shimmer-text drop-shadow-lg',
              !isDark ? 'text-amber-300' : ''
            )}
            style={isDark ? { color: 'var(--mario-coin)' } : undefined}
          >
            {skin.celebrationText(levelNumber)}
          </h2>
          <p className="text-white/80 text-sm font-heading drop-shadow-md">
            {skin.levelCompleteSubtext}
          </p>
        </div>
        <p className="text-white/40 text-xs mt-4 font-heading">
          Click anywhere to continue
        </p>
      </div>
    </div>
  )
}
