'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { SkinConfig } from '@/lib/skin-config'

interface LevelTransitionProps {
  fromLevel: number // 1, 2, or 3
  onContinue: () => void
  skin: SkinConfig
}

const CONNECTORS = [
  { name: 'Gmail', description: 'Read and draft emails', icon: '\u{2709}\u{FE0F}' },
  { name: 'Google Calendar', description: 'View and manage events', icon: '\u{1F4C5}' },
  { name: 'Design Plugin', description: '12 specialized design skills', icon: '\u{1F3A8}' },
]

export function LevelTransition({ fromLevel, onContinue, skin }: LevelTransitionProps) {
  const isDark = skin.isDark
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in on mount
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const nextLevel = fromLevel + 1

  const textColor = isDark ? 'text-white' : 'text-amber-900'
  const textSecondary = isDark ? 'text-white/80' : 'text-amber-800/80'
  const textMuted = isDark ? 'text-white/50' : 'text-amber-700/60'
  const accentColor = isDark ? 'text-[var(--world-accent)]' : 'text-amber-700'
  const borderColor = isDark ? 'var(--world-accent-border, rgba(255,255,255,0.2))' : 'rgba(180, 130, 50, 0.3)'
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.4)'

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500',
        visible ? 'opacity-100' : 'opacity-0'
      )}
      style={{
        backgroundColor: isDark
          ? 'rgba(26, 26, 46, 0.92)'
          : 'rgba(120, 80, 20, 0.7)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-lg w-full mx-6 flex flex-col items-center gap-6 px-8 py-12">
        {/* Level preview image (only if the skin has one for the next level) */}
        {skin.levelImages?.[nextLevel as 1 | 2 | 3] && (
          <div className="w-48 h-32 sm:w-60 sm:h-40 relative">
            <Image
              src={skin.levelImages[nextLevel as 1 | 2 | 3]!}
              alt={`${skin.levelLabel} ${nextLevel} preview`}
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        )}

        {fromLevel === 1 && (
          <>
            <h2
              className={cn(
                'text-2xl sm:text-3xl font-bold font-heading text-center leading-snug',
                textColor
              )}
            >
              You&apos;ve seen what Cowork can do with just a file and a prompt.
            </h2>

            <p
              className={cn(
                'text-lg sm:text-xl font-heading text-center font-bold',
                accentColor
              )}
            >
              {skin.levelLabel} 2 introduces SKILLS.
            </p>

            <div
              className={cn(
                'w-full space-y-4 text-sm sm:text-base',
                textSecondary
              )}
            >
              <p className="text-center">
                A skill is a set of instructions you install in Cowork. It turns Cowork from a general assistant into a specialist.
              </p>

              <div
                className="p-4"
                style={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: '2px',
                  backgroundColor: cardBg,
                }}
              >
                <p className={cn(
                  'text-xs font-heading font-bold uppercase tracking-widest mb-2',
                  textMuted
                )}>
                  HOW TO INSTALL
                </p>
                <p className={cn(
                  'font-mono text-sm',
                  isDark ? 'text-white/90' : 'text-amber-900'
                )}>
                  Customize &gt; Skills &gt; + &gt; Upload a skill
                </p>
              </div>
            </div>
          </>
        )}

        {fromLevel === 2 && (
          <>
            <h2
              className={cn(
                'text-2xl sm:text-3xl font-bold font-heading text-center leading-snug',
                textColor
              )}
            >
              Skills transform the output. Now let&apos;s connect to the real world.
            </h2>

            <p
              className={cn(
                'text-lg sm:text-xl font-heading text-center font-bold',
                accentColor
              )}
            >
              {skin.levelLabel} 3 connects Cowork to your actual tools.
            </p>

            <div className="w-full space-y-2 mt-2">
              {CONNECTORS.map((connector) => (
                <div
                  key={connector.name}
                  className="flex items-center gap-4 px-4 py-3"
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: '2px',
                    backgroundColor: cardBg,
                  }}
                >
                  <span className="text-xl shrink-0">{connector.icon}</span>
                  <div className="min-w-0">
                    <p className={cn(
                      'text-sm font-heading font-bold',
                      isDark ? 'text-white' : 'text-amber-900'
                    )}>
                      {connector.name}
                    </p>
                    <p className={cn(
                      'text-xs',
                      textMuted
                    )}>
                      {connector.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p
              className={cn(
                'text-xs sm:text-sm text-center',
                textSecondary
              )}
            >
              Plus a critical lesson on staying safe with AI.
            </p>
          </>
        )}

        <button
          onClick={onContinue}
          className={cn(
            'mt-4 px-10 py-4 font-heading text-base font-bold transition-all duration-200 cursor-pointer',
            isDark
              ? 'text-black hover:opacity-90'
              : 'text-white hover:opacity-90',
            'hover:shadow-lg active:scale-[0.97]'
          )}
          style={{
            borderRadius: '2px',
            backgroundColor: isDark ? 'var(--world-accent, #E8A800)' : '#92400e',
            border: isDark
              ? '2px solid var(--world-accent-border, #C07800)'
              : '2px solid #78350f',
          }}
        >
          Enter {skin.levelLabel} {nextLevel}
        </button>
      </div>
    </div>
  )
}
