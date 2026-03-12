'use client'

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

  if (!type) {
    router.replace('/')
    return null
  }

  return (
    <div className="page-enter min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-orange)] mb-4 font-heading">
          Choose Your World
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] mb-4 font-heading text-[var(--color-ink)]">
          Same challenges.
          <br />
          <span className="text-[var(--color-brand-orange)]">
            Different vibe.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-muted)] max-w-md mx-auto leading-relaxed">
          Pick an aesthetic. The demos are the same, the experience is yours.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {worlds.map((w) => (
          <button
            key={w.id}
            onClick={() => handlePick(w.id)}
            className={cn(
              'group relative text-left overflow-hidden',
              'border border-[var(--color-border)]',
              'rounded-[2px] transition-all duration-500 ease-out',
              'hover:shadow-2xl hover:-translate-y-1',
              'cursor-pointer block',
              'aspect-[16/11] sm:aspect-[16/12]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]'
            )}
          >
            {/* Background image */}
            <Image
              src={w.image}
              alt={w.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500" />

            {/* Shimmer on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]"
              style={{ transition: 'opacity 0.7s, transform 1.2s' }} />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 font-heading text-white leading-tight drop-shadow-lg">
                {w.name}
              </h2>
              <p className="text-sm text-white/80 leading-relaxed mb-4 drop-shadow">
                {w.tagline}
              </p>
              <div
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-2.5',
                  'text-white text-sm font-semibold',
                  'rounded-[2px] transition-all duration-300',
                  'group-hover:gap-3',
                  'font-heading',
                  w.id === 'gallery'
                    ? 'bg-amber-600/90 group-hover:bg-amber-500'
                    : 'bg-[#E8A000]/90 group-hover:bg-[#FFD700]'
                )}
              >
                Enter World
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &#8594;
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => router.push('/')}
        className="mt-8 text-xs text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors font-heading"
      >
        &#8592; Change type
      </button>
    </div>
  )
}
