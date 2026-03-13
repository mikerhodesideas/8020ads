'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { worlds, type WorldId } from '@/lib/game-data'
import { cn } from '@/lib/utils'

export default function WorldChooser() {
  const router = useRouter()
  const { type, setWorld } = useGame()

  const handlePick = (worldId: WorldId) => {
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
    <div className="fixed inset-0 top-[3.5rem] flex flex-col bg-[#1e1e24]">
      {/* Compact header */}
      <div className="text-center py-4 sm:py-5 flex-shrink-0">
        <h1 className="text-lg sm:text-xl font-bold font-heading text-white/90 tracking-wide">
          Choose your world
        </h1>
        <p className="text-xs text-white/40 mt-0.5">
          Same quests. Different vibe.
        </p>
      </div>

      {/* World grid - fills available space */}
      <div className="flex-1 min-h-0 px-3 sm:px-4 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 h-full max-w-6xl mx-auto"
          style={{ gridTemplateRows: '1fr 1fr' }}
        >
          {gameWorlds.map((w) => (
            <button
              key={w.id}
              onClick={() => handlePick(w.id)}
              className={cn(
                'group relative overflow-hidden',
                'border border-white/10',
                'rounded-[2px] transition-all duration-500 ease-out',
                'hover:border-white/30 hover:z-10 hover:shadow-2xl hover:shadow-white/5',
                'cursor-pointer block',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]'
              )}
            >
              <Image
                src={w.image}
                alt={w.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                sizes="(max-width: 640px) 50vw, 33vw"
                priority
              />

              {/* Darken overlay - lightens on hover */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-500" />

              {/* Bottom gradient for text */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]"
                style={{ transition: 'opacity 0.7s, transform 1.2s' }} />

              {/* Content pinned to bottom */}
              <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold font-heading text-white leading-tight drop-shadow-lg">
                  {w.name}
                </h2>
                <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed mt-1 drop-shadow hidden sm:block">
                  {w.tagline}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Classic - minimal footer bar */}
      <div className="flex-shrink-0 px-3 sm:px-4 pb-3 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between">
          {classicWorld && (
            <button
              onClick={() => handlePick(classicWorld.id)}
              className="group flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
            >
              <span className="text-xs font-heading">
                {classicWorld.name}
              </span>
              <span className="text-[10px] text-white/20 group-hover:text-white/40 transition-colors hidden sm:inline">
                {classicWorld.tagline}
              </span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                &#8594;
              </span>
            </button>
          )}
          <button
            onClick={() => router.push('/')}
            className="text-[10px] text-white/20 hover:text-white/50 transition-colors font-heading ml-auto"
          >
            &#8592; Change avatar
          </button>
        </div>
      </div>
    </div>
  )
}
