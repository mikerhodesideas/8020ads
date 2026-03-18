'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { worlds, type WorldId } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import { track } from '@/lib/tracking'

export default function WorldChooser() {
  const router = useRouter()
  const { type, setWorld, unlockedWorlds, worldUnlockToastQueue, dismissWorldUnlockToast } = useGame()

  const handlePick = (worldId: WorldId) => {
    track({ eventType: 'world_selected', worldId })
    setWorld(worldId)
    router.push('/play')
  }

  useEffect(() => {
    if (!type) router.replace('/')
  }, [type, router])

  if (!type) return null

  const gameWorlds = worlds.filter((w) => w.id !== 'gallery')
  const classicWorld = worlds.find((w) => w.id === 'gallery')

  return (
    <div className="fixed inset-0 top-[3.5rem] flex flex-col bg-[#EDEAE4]">
      {/* Compact header */}
      <div className="text-center py-4 sm:py-5 flex-shrink-0">
        <h1 className="text-lg sm:text-xl font-bold font-heading text-[var(--color-ink)] tracking-wide">
          Choose your world
        </h1>
        <p className="text-xs text-[var(--color-faint)] mt-0.5">
          Same quests. Different vibe.
        </p>
      </div>

      {/* World grid - fills available space but cards capped in height */}
      <div className="flex-1 min-h-0 px-3 sm:px-4 pb-2 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-6xl mx-auto auto-rows-[minmax(0,200px)] sm:auto-rows-[minmax(0,220px)] md:auto-rows-[minmax(0,280px)]"
        >
          {gameWorlds.map((w) => {
            const isUnlocked = unlockedWorlds.has(w.id)
            const isNewlyUnlocked = worldUnlockToastQueue.includes(w.id)
            return (
              <button
                key={w.id}
                onClick={isUnlocked ? () => handlePick(w.id) : undefined}
                className={cn(
                  'group relative overflow-hidden',
                  'border border-[var(--color-border)]',
                  'rounded-[2px] transition-all duration-500 ease-out',
                  'max-h-[200px] sm:max-h-[240px] md:max-h-[280px]',
                  isUnlocked
                    ? 'hover:border-[var(--color-muted)] hover:z-10 hover:shadow-xl hover:shadow-black/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]'
                    : 'cursor-not-allowed opacity-30 grayscale'
                )}
                disabled={!isUnlocked}
              >
                <Image
                  src={w.image}
                  alt={w.name}
                  fill
                  className={cn(
                    'object-cover transition-transform duration-700',
                    isUnlocked && 'group-hover:scale-[1.04]'
                  )}
                  sizes="(max-width: 640px) 50vw, 33vw"
                  priority
                />

                {/* Subtle overlay - lightens on hover (unlocked only) */}
                <div className={cn(
                  'absolute inset-0 transition-all duration-500',
                  isUnlocked ? 'bg-black/15 group-hover:bg-black/5' : 'bg-black/30'
                )} />

                {/* Lock icon overlay for locked worlds */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <svg className="w-10 h-10 text-white/70 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                )}

                {/* "New!" badge for freshly unlocked worlds */}
                {isUnlocked && isNewlyUnlocked && (
                  <div className="absolute top-2 right-2 z-10 bg-[var(--color-brand-orange)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] shadow-md animate-pulse">
                    New!
                  </div>
                )}

                {/* Bottom gradient for text */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Content pinned to bottom */}
                <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold font-heading text-white leading-tight drop-shadow-lg">
                    {w.name}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-white/80 leading-relaxed mt-1 drop-shadow hidden sm:block">
                    {isUnlocked ? w.tagline : 'Complete more levels to unlock'}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Classic - prominent card for non-gamers */}
      <div className="flex-shrink-0 px-3 sm:px-4 pb-3 max-w-6xl mx-auto w-full space-y-2">
        {classicWorld && (() => {
          const classicUnlocked = unlockedWorlds.has(classicWorld.id)
          return (
            <button
              onClick={classicUnlocked ? () => handlePick(classicWorld.id) : undefined}
              disabled={!classicUnlocked}
              className={cn(
                'w-full py-3 px-5 rounded-[2px]',
                'border',
                'transition-all duration-300',
                'flex items-center justify-center gap-3',
                classicUnlocked
                  ? 'quest-glow bg-white hover:bg-[var(--color-cream)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]'
                  : 'border-[var(--color-border)] bg-white/50 cursor-not-allowed opacity-40'
              )}
            >
              {!classicUnlocked && (
                <svg className="w-4 h-4 text-[var(--color-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              )}
              <span className="text-sm sm:text-base text-[var(--color-muted)] group-hover:text-[var(--color-ink)] font-heading">
                {classicUnlocked ? 'Not into the gaming vibe? Get the demos without it.' : 'Complete all levels to unlock Classic mode'}
              </span>
              {classicUnlocked && <span className="text-[var(--color-faint)] text-sm">&#8594;</span>}
            </button>
          )
        })()}
        <div className="flex justify-end">
          <button
            onClick={() => router.push('/')}
            className="text-[10px] sm:text-xs text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors font-heading"
          >
            &#8592; Change avatar
          </button>
        </div>
      </div>
    </div>
  )
}
