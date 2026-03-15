'use client'

import { useEffect } from 'react'
import { useGame, useSkin } from '@/components/game-provider'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'

// Badge definitions
export interface BadgeDef {
  id: string
  name: string
  description: string
}

export const BADGE_DEFS: BadgeDef[] = [
  { id: 'first-skill', name: 'First Skill', description: 'Complete your first demo' },
  { id: 'skill-collector', name: 'Skill Collector', description: 'Unlock all 3 Level 1 skills' },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete a demo in under 20 seconds' },
  { id: 'explorer', name: 'Explorer', description: 'Play in both Gallery and Arcade worlds' },
  { id: 'level-up', name: 'Level Up', description: 'Complete all demos in a level' },
  { id: 'full-clear', name: 'Full Clear', description: 'Complete all 9 demos' },
  { id: 'transformer', name: 'The Transformer', description: 'View all 3 before/after comparisons' },
  { id: 'replay-master', name: 'Replay Master', description: 'Replay a completed demo' },
]

// SVG icons for each badge
function BadgeIcon({ id, size = 20 }: { id: string; size?: number }) {
  const s = size
  const props = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  switch (id) {
    case 'first-skill':
      return (
        <svg {...props}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    case 'skill-collector':
      return (
        <svg {...props}>
          <path d="M12 2l1.5 4.5H18l-3.5 2.5L16 13.5 12 11l-4 2.5 1.5-4.5L6 6.5h4.5z" />
          <circle cx="5" cy="18" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="18" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'speed-demon':
      return (
        <svg {...props}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'explorer':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'level-up':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    case 'full-clear':
      return (
        <svg {...props}>
          <path d="M2 17l3-8 4 4 3-6 3 6 4-4 3 8z" fill="currentColor" stroke="none" />
          <rect x="2" y="17" width="20" height="3" rx="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'transformer':
      return (
        <svg {...props}>
          <rect x="2" y="4" width="8" height="16" rx="1" />
          <rect x="14" y="4" width="8" height="16" rx="1" />
          <path d="M12 9l2 3-2 3" strokeWidth="1.5" />
        </svg>
      )
    case 'replay-master':
      return (
        <svg {...props}>
          <path d="M17 2l4 4-4 4" />
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
          <path d="M7 22l-4-4 4-4" />
          <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
  }
}

// Badge tray for the level map
export function BadgeTray() {
  const { badges } = useGame()
  const skin = useSkin()
  const isDark = skin.isDark

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
      {BADGE_DEFS.map((def) => {
        const earned = !!badges[def.id]
        return (
          <div
            key={def.id}
            className="group relative"
          >
            <div
              className={cn(
                'w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border transition-all duration-300',
                !isDark ? 'rounded-[2px]' : '',
                earned
                  ? !isDark
                    ? 'bg-amber-50 border-amber-400 text-amber-700 badge-earned-glow-gallery'
                    : 'border-[2px] badge-earned-glow-mario'
                  : !isDark
                    ? 'bg-white/80 border-amber-300/50 text-amber-400/60'
                    : 'border-[2px] border-gray-600 text-gray-500'
              )}
              style={isDark && earned ? {
                background: 'rgba(232,160,0,0.15)',
                borderColor: 'var(--mario-coin)',
                color: 'var(--mario-coin)',
              } : isDark ? {
                background: 'rgba(255,255,255,0.05)',
              } : undefined}
            >
              <BadgeIcon id={def.id} size={18} />
            </div>
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 text-white text-xs font-heading rounded-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
              {def.name}
              {!earned && <span className="text-white/50"> (locked)</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Badge grid for victory screen
export function BadgeGrid() {
  const { badges } = useGame()
  const skin = useSkin()
  const isDark = skin.isDark

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {BADGE_DEFS.map((def) => {
        const earned = !!badges[def.id]
        return (
          <div
            key={def.id}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 border transition-all',
              !isDark ? 'rounded-[2px]' : 'border-[2px]',
              earned
                ? !isDark
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : ''
                : !isDark
                  ? 'bg-white/80 border-amber-300/50 text-amber-400/60'
                  : 'border-gray-600 text-gray-500'
            )}
            style={isDark && earned ? {
              background: 'rgba(232,160,0,0.15)',
              borderColor: 'var(--mario-coin)',
              color: 'var(--mario-coin)',
            } : isDark ? {
              background: 'rgba(255,255,255,0.05)',
            } : undefined}
          >
            <BadgeIcon id={def.id} size={22} />
            <span className={cn(
              'text-[9px] sm:text-[10px] font-heading font-semibold text-center leading-tight',
              earned ? '' : 'text-gray-400'
            )}>
              {def.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Toast notification for newly earned badges
export function BadgeToast() {
  const { badgeToastQueue, dismissBadgeToast } = useGame()
  const skin = useSkin()

  const currentBadgeId = badgeToastQueue[0]
  const def = currentBadgeId ? BADGE_DEFS.find((b) => b.id === currentBadgeId) : null

  useEffect(() => {
    if (!currentBadgeId) return
    if (skin.sounds.badgeEarned) playSound(skin.sounds.badgeEarned)
    const timer = setTimeout(dismissBadgeToast, 3000)
    return () => clearTimeout(timer)
  }, [currentBadgeId, dismissBadgeToast, skin.sounds.badgeEarned])

  if (!def) return null

  return (
    <div className="fixed top-16 right-4 z-[60] badge-toast-enter">
      <div
        className="flex items-center gap-3 px-4 py-3 shadow-lg min-w-[220px]"
        style={skin.isDark ? {
          background: 'var(--mario-dark)',
          border: '3px solid var(--mario-coin)',
        } : {
          background: 'white',
          border: '1px solid var(--color-border)',
          borderRadius: '2px',
        }}
      >
        <div style={skin.isDark ? { color: 'var(--mario-coin)' } : { color: '#B8860B' }}>
          <BadgeIcon id={def.id} size={24} />
        </div>
        <div>
          <p className={cn(
            'text-[10px] font-heading font-semibold uppercase tracking-wider',
            skin.isDark ? 'text-white/50' : 'text-[var(--color-faint)]'
          )}>
            {skin.badgeEarnedLabel}
          </p>
          <p className={cn(
            'text-sm font-heading font-bold',
            skin.isDark ? 'text-white' : 'text-[var(--color-ink)]'
          )}>
            {def.name}
          </p>
        </div>
      </div>
    </div>
  )
}
