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

  const victoryImage = !isDark
    ? '/images/victory/gallery-victory.png'
    : '/images/victory/arcade-victory.png'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center celebration-overlay cursor-pointer"
      onClick={onDismiss}
      style={{
        backgroundColor: !isDark
          ? 'rgba(120, 80, 20, 0.6)'
          : 'rgba(26, 26, 46, 0.85)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex flex-col items-center gap-6 px-6">
        <div className="w-48 h-48 sm:w-56 sm:h-56 relative celebration-image">
          <Image
            src={victoryImage}
            alt="Level Complete"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
        <div className="text-center celebration-text">
          <h2
            className={cn(
              'text-3xl sm:text-4xl font-extrabold font-heading mb-2 celebration-shimmer-text',
              !isDark ? 'text-amber-300' : ''
            )}
            style={isDark ? { color: 'var(--mario-coin)' } : undefined}
          >
            {skin.celebrationText(levelNumber)}
          </h2>
          <p className="text-white/80 text-sm font-heading">
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
