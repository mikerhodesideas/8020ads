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
  const { type, setWorld } = useGame()

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
          {gameWorlds.map((w) => (
            <button
              key={w.id}
              onClick={() => handlePick(w.id)}
              className={cn(
                'group relative overflow-hidden',
                'border border-[var(--color-border)]',
                'rounded-[2px] transition-all duration-500 ease-out',
                'hover:border-[var(--color-muted)] hover:z-10 hover:shadow-xl hover:shadow-black/10',
                'cursor-pointer block',
                'max-h-[200px] sm:max-h-[240px] md:max-h-[280px]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]'
              )}
            >
              <Image
                src={w.image}
                alt={w.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 50vw, 33vw"
                priority
              />

              {/* Subtle overlay - lightens on hover */}
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-all duration-500" />

              {/* Bottom gradient for text */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Content pinned to bottom */}
              <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold font-heading text-white leading-tight drop-shadow-lg">
                  {w.name}
                </h2>
                <p className="text-[10px] sm:text-xs text-white/80 leading-relaxed mt-1 drop-shadow hidden sm:block">
                  {w.tagline}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Classic - prominent card for non-gamers */}
      <div className="flex-shrink-0 px-3 sm:px-4 pb-3 max-w-6xl mx-auto w-full space-y-2">
        {classicWorld && (
          <button
            onClick={() => handlePick(classicWorld.id)}
            className={cn(
              'w-full py-3 px-5 rounded-[2px]',
              'border border-[var(--color-border)] hover:border-[var(--color-muted)]',
              'bg-white hover:bg-[var(--color-cream)]',
              'transition-all duration-300',
              'flex items-center justify-center gap-3',
              'cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]'
            )}
          >
            <span className="text-sm sm:text-base text-[var(--color-muted)] group-hover:text-[var(--color-ink)] font-heading">
              Not into the gaming vibe? Get the demos without it.
            </span>
            <span className="text-[var(--color-faint)] text-sm">&#8594;</span>
          </button>
        )}
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
