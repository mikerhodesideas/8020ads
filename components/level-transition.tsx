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

const MORE_CONNECTORS = ['HubSpot', 'Asana', 'ClickUp', 'Slack', 'Excel', 'Outlook']

export function LevelTransition({ fromLevel, onContinue, skin }: LevelTransitionProps) {
  const isDark = skin.isDark
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const nextLevel = fromLevel + 1
  const levelImage = skin.levelImages?.[nextLevel as 1 | 2 | 3]

  const accentColor = isDark ? 'text-[var(--world-accent)]' : 'text-amber-700'
  const borderColor = isDark ? 'var(--world-accent-border, rgba(255,255,255,0.2))' : 'rgba(180, 130, 50, 0.3)'
  const cardBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)'
  const bandBg = isDark ? 'rgba(10, 10, 20, 0.75)' : 'rgba(40, 20, 0, 0.7)'

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Full-bleed background image */}
      {levelImage ? (
        <>
          <Image
            src={levelImage}
            alt={`${skin.levelLabel} ${nextLevel}`}
            fill
            className="object-cover"
            priority
          />
          {/* Slight overall darken so the band reads well */}
          <div className="absolute inset-0" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)' }} />
        </>
      ) : (
        /* Fallback when no image */
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: isDark ? 'rgba(26, 26, 46, 0.95)' : 'rgba(120, 80, 20, 0.8)',
            backdropFilter: 'blur(12px)',
          }}
        />
      )}

      {/* Semi-transparent band across middle with faded edges */}
      <div
        className="absolute inset-x-0 flex items-center justify-center"
        style={{
          top: '15%',
          bottom: '15%',
          background: `linear-gradient(to bottom, transparent, ${bandBg} 12%, ${bandBg} 88%, transparent)`,
        }}
      />

      {/* Content over the band */}
      <div className="relative z-10 max-w-lg w-full mx-6 flex flex-col items-center gap-5 px-8">
        {fromLevel === 1 && (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-center leading-snug text-white drop-shadow-lg">
              You&apos;ve seen what Cowork can do with just a file and a prompt.
            </h2>

            <p className={cn('text-lg sm:text-xl font-heading text-center font-bold drop-shadow-md', accentColor)}>
              {skin.levelLabel} 2 introduces SKILLS.
            </p>

            <div className="w-full space-y-4 text-sm sm:text-base text-white/85">
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
                <p className="text-xs font-heading font-bold uppercase tracking-widest mb-2 text-white/50">
                  HOW TO INSTALL
                </p>
                <p className="font-mono text-sm text-white/90">
                  Customize &gt; Skills &gt; + &gt; Upload a skill
                </p>
              </div>
            </div>
          </>
        )}

        {fromLevel === 2 && (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-center leading-snug text-white drop-shadow-lg">
              Skills transform the output. Now let&apos;s connect to the real world.
            </h2>

            <p className={cn('text-lg sm:text-xl font-heading text-center font-bold drop-shadow-md', accentColor)}>
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
                    <p className="text-sm font-heading font-bold text-white">
                      {connector.name}
                    </p>
                    <p className="text-xs text-white/50">
                      {connector.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-center text-white/50">
              Plus {MORE_CONNECTORS.join(', ')}, and more.
            </p>

            <p className="text-xs sm:text-sm text-center text-white/80">
              Plus a critical lesson on staying safe with AI.
            </p>
          </>
        )}

        <button
          onClick={onContinue}
          className={cn(
            'mt-4 px-10 py-4 font-heading text-base font-bold transition-all duration-200 cursor-pointer',
            'text-black hover:opacity-90 hover:shadow-lg active:scale-[0.97]'
          )}
          style={{
            borderRadius: '2px',
            backgroundColor: isDark ? 'var(--world-accent, #E8A800)' : '#92400e',
            border: isDark
              ? '2px solid var(--world-accent-border, #C07800)'
              : '2px solid #78350f',
            color: isDark ? 'black' : 'white',
          }}
        >
          Enter {skin.levelLabel} {nextLevel}
        </button>
      </div>
    </div>
  )
}
