'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useGame } from '@/components/game-provider'
import { BadgeGrid } from '@/components/badge-system'
import { cn } from '@/lib/utils'

export default function VictoryScreen() {
  const router = useRouter()
  const { world, completed, skills, totalTimeSaved, resetGame } = useGame()

  const isGallery = world === 'gallery'
  const victoryImage = isGallery
    ? '/images/victory/gallery-victory.png'
    : '/images/victory/arcade-victory.png'

  const handleTryAnotherWorld = () => {
    router.push('/world')
  }

  const handleStartOver = () => {
    resetGame()
    router.push('/')
  }

  return (
    <div
      className={cn(
        'min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12',
        isGallery
          ? 'bg-gradient-to-b from-[#f8f0e3] via-[#faf6ef] to-[#f5ece0]'
          : 'bg-gradient-to-b from-[#e8f4ff] via-[#f0f8ff] to-[#e0f0ff]'
      )}
    >
      <div className="max-w-lg w-full flex flex-col items-center gap-8">
        {/* Victory image */}
        <div className="w-40 h-40 sm:w-52 sm:h-52 relative victory-image-entrance">
          <Image
            src={victoryImage}
            alt="Journey Complete"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {/* Heading */}
        <h1
          className={cn(
            'text-3xl sm:text-4xl font-extrabold font-heading text-center victory-shimmer-text',
            isGallery ? 'text-amber-800' : 'text-blue-800'
          )}
        >
          JOURNEY COMPLETE
        </h1>

        {/* Stats */}
        <div
          className={cn(
            'w-full grid grid-cols-3 gap-4 p-5 border rounded-[2px] victory-stats-entrance',
            isGallery
              ? 'bg-amber-50/60 border-amber-200'
              : 'bg-blue-50/60 border-blue-200'
          )}
        >
          <StatBlock
            label="Skills Unlocked"
            value={String(skills.size)}
            isGallery={isGallery}
          />
          <StatBlock
            label="Demos Completed"
            value={`${completed.size}/3`}
            isGallery={isGallery}
          />
          <StatBlock
            label="Est. Time Saved"
            value={totalTimeSaved >= 1 ? `~${Math.round(totalTimeSaved)}h` : `~${Math.round(totalTimeSaved * 60)}m`}
            isGallery={isGallery}
          />
        </div>

        {/* Earned badges */}
        <div className="w-full victory-badges-entrance">
          <p className="text-xs font-heading font-semibold uppercase tracking-wider text-[var(--color-faint)] text-center mb-3">
            Achievements
          </p>
          <BadgeGrid isGallery={isGallery} />
        </div>

        {/* Tagline */}
        <p className="text-sm text-[var(--color-muted)] text-center font-heading victory-tagline-entrance">
          AI is way more powerful than you realized.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full victory-ctas-entrance">
          <a
            href="https://ads2ai.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'w-full sm:w-auto flex-1 text-center px-6 py-3 font-heading font-bold text-sm rounded-[2px] transition-all duration-200',
              isGallery
                ? 'bg-amber-700 text-white hover:bg-amber-800'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            Join the Community
          </a>
          <button
            onClick={handleTryAnotherWorld}
            className={cn(
              'w-full sm:w-auto flex-1 text-center px-6 py-3 font-heading font-bold text-sm rounded-[2px] border transition-all duration-200',
              isGallery
                ? 'border-amber-300 text-amber-800 hover:bg-amber-50'
                : 'border-blue-300 text-blue-800 hover:bg-blue-50'
            )}
          >
            Try Another World
          </button>
          <button
            onClick={handleStartOver}
            className="w-full sm:w-auto text-center px-6 py-3 font-heading font-medium text-sm text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBlock({
  label,
  value,
  isGallery,
}: {
  label: string
  value: string
  isGallery: boolean
}) {
  return (
    <div className="text-center">
      <p
        className={cn(
          'text-2xl sm:text-3xl font-extrabold font-heading',
          isGallery ? 'text-amber-700' : 'text-blue-700'
        )}
      >
        {value}
      </p>
      <p className="text-[10px] sm:text-xs font-heading text-[var(--color-muted)] mt-1">
        {label}
      </p>
    </div>
  )
}
