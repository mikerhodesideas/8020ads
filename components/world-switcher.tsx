'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame, useSkin } from '@/components/game-provider'
import { worlds, type WorldId } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'
import { getSkin } from '@/lib/skin-config'
import { track } from '@/lib/tracking'

const worldSprites: Record<string, string> = {
  arcade: '/images/sprites/mario.png',
  'red-alert': '/images/sprites/red-alert.png',
  'clair-obscur': '/images/sprites/clair-obscur.png',
  tetris: '/images/sprites/tetris.png',
  zelda: '/images/sprites/zelda.png',
  'elder-scrolls': '/images/sprites/elder-scrolls.png',
}

interface WorldSwitcherProps {
  open: boolean
  onClose: () => void
}

export default function WorldSwitcher({ open, onClose }: WorldSwitcherProps) {
  const router = useRouter()
  const { world, setWorld, unlockedWorlds } = useGame()
  const skin = useSkin()

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const isDark = skin.isDark

  const handleWorldSelect = (worldId: WorldId) => {
    if (worldId === world) {
      onClose()
      return
    }
    track({ eventType: 'world_selected', worldId })
    // Play the target world's selection sound
    const targetSkin = getSkin(worldId)
    if (targetSkin.sounds.selection) {
      playSound(targetSkin.sounds.selection)
    }
    setWorld(worldId)
    onClose()
    router.push('/play')
  }

  return (
    <div
      className="fixed inset-0 z-[60] world-switcher-backdrop"
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }}
      onClick={onClose}
    >
      <div
        className={cn(
          'absolute top-0 right-0 h-full w-full sm:w-80 shadow-xl border-l world-switcher-slide',
          skin.skinClass,
          isDark
            ? 'border-[#333]'
            : 'bg-white border-[var(--color-border)]'
        )}
        style={isDark ? { background: '#111111' } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between px-5 py-4 border-b',
            isDark
              ? 'border-[#333] bg-[#0a0a0a]'
              : 'border-[var(--color-border)] bg-[var(--color-cream,#faf9f6)]'
          )}
        >
          <h2
            className="text-sm font-heading font-bold"
            style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
          >
            Switch World
          </h2>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors text-lg leading-none"
            style={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#888' }}
          >
            &times;
          </button>
        </div>

        {/* World list */}
        <div className="p-4 space-y-2 max-h-[85vh] overflow-y-auto">
          {worlds.map((w) => {
            const isCurrent = w.id === world
            const isUnlocked = unlockedWorlds.has(w.id)
            const hasSprite = worldSprites[w.id]

            return (
              <button
                key={w.id}
                onClick={isUnlocked ? () => handleWorldSelect(w.id) : undefined}
                disabled={!isUnlocked}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 border transition-all text-left',
                  isCurrent && isDark && 'border-[var(--world-accent)] bg-white/5',
                  isCurrent && !isDark && 'border-[var(--color-brand-orange)] bg-amber-50/60',
                  !isCurrent && isDark && 'border-[#444] hover:border-[#666] hover:bg-white/10',
                  !isCurrent && !isDark && 'border-[var(--color-border)] hover:border-[var(--color-muted)] hover:bg-[var(--color-cream,#faf9f6)]',
                  !isUnlocked && 'opacity-30 grayscale cursor-not-allowed',
                  isUnlocked && 'cursor-pointer'
                )}
                style={{ borderRadius: '2px' }}
              >
                {/* World image / sprite */}
                <div
                  className="w-10 h-10 flex-shrink-0 overflow-hidden relative"
                  style={{ borderRadius: '2px' }}
                >
                  {hasSprite ? (
                    <img
                      src={worldSprites[w.id]}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <img
                      src={w.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* World info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-heading font-bold truncate"
                      style={{ color: isCurrent ? (isDark ? 'var(--world-accent)' : '#D64C00') : (isDark ? '#ffffff' : '#1a1a1a') }}
                    >
                      {w.name}
                    </span>
                    {isCurrent && (
                      <span
                        className="text-[10px] font-heading font-semibold px-1.5 py-0.5"
                        style={{
                          color: isDark ? 'var(--world-accent)' : '#D64C00',
                          border: `1px solid ${isDark ? 'var(--world-accent)' : '#D64C00'}`,
                          borderRadius: '2px',
                        }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#666' }}
                  >
                    {isUnlocked ? w.tagline : 'Complete more levels to unlock'}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
