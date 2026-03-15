'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { cn } from '@/lib/utils'
import { track } from '@/lib/tracking'
import type { PlayerType } from '@/lib/game-data'

const avatars = [
  {
    id: 'agency' as PlayerType,
    title: 'Agency Owner',
    desc: 'Client reporting, competitor analysis, deliverables',
    image: '/images/business-persona.png',
    accent: '#2563EB',
    key: 'A',
  },
  {
    id: 'employee' as PlayerType,
    title: 'Agency Employee',
    desc: 'Campaign management, search terms, content',
    image: '/images/employee-persona.png',
    accent: '#0D9488',
    key: 'E',
  },
  {
    id: 'freelancer' as PlayerType,
    title: 'Freelancer',
    desc: 'Solo client work, prospecting, reporting',
    image: '/images/freelancer-persona.png',
    accent: '#7C3AED',
    key: 'F',
  },
  {
    id: 'business' as PlayerType,
    title: 'Business Owner',
    desc: 'Inbox, meetings, financials, onboarding',
    image: '/images/business-owner-persona.png',
    accent: '#1B8C3A',
    key: 'B',
  },
]

const worldSprites = [
  { id: 'mario', src: '/images/sprites/mario.png' },
  { id: 'red-alert', src: '/images/sprites/red-alert.png' },
  { id: 'clair-obscur', src: '/images/sprites/clair-obscur.png' },
  { id: 'tetris', src: '/images/sprites/tetris.png' },
  { id: 'zelda', src: '/images/sprites/zelda.png' },
  { id: 'elder-scrolls', src: '/images/sprites/elder-scrolls.png' },
]

export default function PathChooser() {
  const router = useRouter()
  const { setType } = useGame()

  const handleClick = (typeId: PlayerType) => {
    track({ eventType: 'avatar_selected', avatarType: typeId })
    setType(typeId)
    router.push('/world')
  }

  return (
    <div className="page-enter min-h-[calc(100vh-3.5rem)] flex flex-col items-center px-4 sm:px-6 py-6 sm:py-10 relative overflow-hidden">

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Hero */}
      <div className="text-center mb-6 sm:mb-8 relative z-10 mt-4 sm:mt-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6 font-heading text-[var(--color-ink)]">
          From tutorial mode
          <br />
          <span className="text-[var(--color-brand-orange)]">
            to boss level
          </span>
        </h1>
        <div className="max-w-2xl mx-auto space-y-2 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed text-left">
          <p>
            <span className="font-heading font-bold text-[var(--color-ink)]">Level 1</span> sets the scene. Drag a file, paste a prompt. Deliberately basic.
          </p>
          <p>
            <span className="font-heading font-bold text-[var(--color-brand-orange)]">Level 2</span> is where it clicks. Install a skill and the output transforms.
          </p>
          <p>
            <span className="font-heading font-bold text-[var(--color-ink)]">Level 3</span> connects to the real world. Gmail, calendar, plugins, and safety.
          </p>
        </div>
      </div>

      {/* Step 1 + Avatar cards */}
      <div className="max-w-5xl w-full z-10">

        {/* Step 1 label - above cards, left-aligned, animated */}
        <div className="mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-brand-orange)] step-label-glow">
            Step 1
          </span>
          <span className="text-sm sm:text-base font-heading font-bold text-[var(--color-ink)]">
            Choose your avatar
          </span>
          <span className="text-[var(--color-brand-orange)] animate-bounce-right">&#8594;</span>
        </div>

        {/* Avatar cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {avatars.map((a) => (
            <button
              key={a.id}
              onClick={() => handleClick(a.id)}
              className={cn(
                'group relative text-left overflow-hidden',
                'border border-[var(--color-border)]',
                'rounded-[2px] transition-all duration-300 ease-out',
                'hover:shadow-lg hover:-translate-y-1',
                'cursor-pointer block',
                'aspect-[3/4]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]'
              )}
            >
              <Image
                src={a.image}
                alt={a.title}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-0 inset-x-0 h-[3px]" style={{ backgroundColor: a.accent }} />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <kbd className="px-1.5 py-0.5 bg-black/60 border border-white/20 text-[10px] font-mono text-white/80">
                  {a.key}
                </kbd>
              </div>
              <div className="absolute inset-x-0 bottom-0 px-4 sm:px-5 pb-4 sm:pb-5">
                <h3 className="text-base sm:text-lg font-bold mb-1 font-heading text-white leading-tight">
                  {a.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed mb-3">
                  {a.desc}
                </p>
                <div
                  className={cn(
                    'inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2',
                    'text-white text-[10px] sm:text-xs font-semibold',
                    'rounded-[2px] transition-all duration-200',
                    'group-hover:gap-3',
                    'font-heading'
                  )}
                  style={{ backgroundColor: a.accent }}
                >
                  Select
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    &#8594;
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Choose your game - world sprites */}
      <div className="mt-10 sm:mt-12 max-w-5xl w-full relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-faint)]">
            Step 2
          </span>
          <span className="text-sm sm:text-base font-heading font-bold text-[var(--color-faint)]">
            Choose your style
          </span>
        </div>
        <div className="grid grid-cols-6 gap-3 sm:gap-4">
          {worldSprites.map((sprite) => (
            <div
              key={sprite.id}
              className="relative aspect-square overflow-hidden rounded-full border-2 border-[var(--color-border)] opacity-40 hover:opacity-70 transition-opacity"
            >
              <Image
                src={sprite.src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 16vw, 140px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard hints */}
      <p className="mt-8 text-[10px] text-[var(--color-faint)] tracking-wide font-heading relative z-10">
        Press{' '}
        {avatars.map((a, i) => (
          <span key={a.key}>
            <kbd className="px-1.5 py-0.5 bg-white border border-[var(--color-border)] rounded-[2px] text-[10px] font-mono">
              {a.key}
            </kbd>{' '}
            {a.id}
            {i < avatars.length - 1 ? ' \u00b7 ' : ''}
          </span>
        ))}
      </p>
    </div>
  )
}
