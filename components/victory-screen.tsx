'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useGame, useSkin } from '@/components/game-provider'
import { BadgeGrid } from '@/components/badge-system'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'

function useAnimatedCounter(target: number, duration: number = 1200): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const pct = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3)
      setValue(Math.round(eased * target))
      if (pct < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

export default function VictoryScreen() {
  const router = useRouter()
  const { completed, skills, totalTimeSaved, totalStars, maxStars, isLevelComplete, resetGame } = useGame()
  const skin = useSkin()

  const isDark = skin.isDark
  const victoryImage = !isDark
    ? '/images/victory/gallery-victory.png'
    : '/images/victory/arcade-victory.png'

  // AI Readiness Score calculation (arcade only)
  const readinessScore = useMemo(() => {
    if (!isDark) return 0
    const demoPoints = completed.size * 8
    const skillPoints = Math.min(skills.size * 2, 16)
    let levelBonus = 0
    if (isLevelComplete(1)) levelBonus += 4
    if (isLevelComplete(2)) levelBonus += 4
    if (isLevelComplete(3)) levelBonus += 4
    return Math.min(demoPoints + skillPoints + levelBonus, 100)
  }, [isDark, completed.size, skills.size, isLevelComplete])

  const animatedScore = useAnimatedCounter(isDark ? readinessScore : 0, 1500)

  const scoreLabel = useMemo(() => {
    if (readinessScore >= 90) return 'AI-First Ready. You get it.'
    if (readinessScore >= 70) return 'AI-Amplified. Almost there.'
    if (readinessScore >= 50) return 'AI-Assisted. Good foundation.'
    return 'Getting Started. Keep exploring.'
  }, [readinessScore])

  // Weekly time projection
  const weeklyTimeSaved = totalTimeSaved * 5

  // Play fanfare on mount for arcade
  useEffect(() => {
    if (skin.sounds.victory) {
      const t = setTimeout(() => playSound(skin.sounds.victory!), 400)
      return () => clearTimeout(t)
    }
  }, [skin.sounds.victory])

  const handlePlayAgain = () => {
    router.push('/play')
  }

  const handleStartOver = () => {
    resetGame()
    router.push('/')
  }

  // Arcade firework particles
  const fireworks = useMemo(() => {
    if (!isDark) return []
    const colors = ['#FFD700', '#FF0000', '#00A800', '#5C94FC', '#FF6B1A']
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 3,
      color: colors[i % colors.length],
      size: 3 + Math.random() * 4,
    }))
  }, [isDark])

  return (
    <div
      className={cn(
        'page-enter min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden',
        !isDark
          ? 'bg-gradient-to-b from-[#f8f0e3] via-[#faf6ef] to-[#f5ece0]'
          : 'skin-arcade arcade-ground arcade-scanlines'
      )}
      style={isDark ? { background: 'var(--mario-dark)' } : undefined}
    >
      {/* Arcade: starfield background + fireworks */}
      {isDark && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: 1 + Math.random() * 2,
                  height: 1 + Math.random() * 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.3 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>
          {fireworks.map((fw) => (
            <div
              key={fw.id}
              className="absolute pointer-events-none"
              style={{
                left: `${fw.x}%`,
                bottom: '10%',
                animation: `firework-rise 2s ease-out ${fw.delay}s infinite`,
              }}
            >
              <div
                style={{
                  width: fw.size,
                  height: fw.size,
                  background: fw.color,
                  borderRadius: 0,
                }}
              />
            </div>
          ))}
        </>
      )}

      <div className={cn('max-w-lg w-full flex flex-col items-center gap-8 relative z-10', isDark && 'pb-12')}>
        {/* Victory image */}
        <div className="w-40 h-40 sm:w-52 sm:h-52 relative victory-image-entrance">
          <Image
            src={victoryImage}
            alt={isDark ? 'Game Clear' : 'Journey Complete'}
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {/* Heading */}
        <h1
          className={cn(
            'text-3xl sm:text-4xl font-extrabold font-heading text-center victory-shimmer-text',
            !isDark ? 'text-amber-800' : 'text-white'
          )}
        >
          {skin.victoryHeading}
        </h1>

        {/* Stats */}
        <div
          className={cn(
            'w-full grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border-[3px] victory-stats-entrance',
            !isDark
              ? 'bg-amber-50/60 border-amber-200 rounded-[2px]'
              : ''
          )}
          style={isDark ? {
            background: 'rgba(255,255,255,0.05)',
            borderColor: 'var(--mario-coin)',
          } : undefined}
        >
          <StatBlock
            label={skin.victorySkillsLabel}
            value={String(skills.size)}
            isDark={isDark}
          />
          <StatBlock
            label={skin.victoryDemosLabel}
            value={`${completed.size}/9`}
            isDark={isDark}
          />
          <StatBlock
            label="Strategy Score"
            value={`${totalStars}/${maxStars}`}
            isDark={isDark}
            icon={isDark ? '\u2605' : undefined}
          />
          <StatBlock
            label="Est. Time Saved"
            value={totalTimeSaved >= 1 ? `~${Math.round(totalTimeSaved)}h` : `~${Math.round(totalTimeSaved * 60)}m`}
            isDark={isDark}
          />
        </div>

        {/* Earned badges */}
        <div className="w-full victory-badges-entrance">
          <p className={cn(
            'text-xs font-heading font-semibold uppercase tracking-wider text-center mb-3',
            isDark ? 'text-white/40' : 'text-[var(--color-faint)]'
          )}>
            Achievements
          </p>
          <BadgeGrid />
        </div>

        {/* Arcade: Time Saved section */}
        {isDark && totalTimeSaved > 0 && (
          <div
            className="w-full p-6 border-[3px] text-center victory-stats-entrance"
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderColor: 'var(--mario-coin)',
            }}
          >
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-white/40 mb-3">
              Time Saved
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold font-heading" style={{ color: 'var(--mario-coin)' }}>
              <svg className="inline-block mr-2 -mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--mario-coin)' }}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {totalTimeSaved >= 1
                ? `${totalTimeSaved % 1 === 0 ? totalTimeSaved : totalTimeSaved.toFixed(1)} hours`
                : `${Math.round(totalTimeSaved * 60)} minutes`
              } this session
            </p>
            <p className="text-sm text-white/60 mt-2 font-heading">
              That&apos;s{' '}
              <span className="font-bold text-white">
                {weeklyTimeSaved >= 1
                  ? `${weeklyTimeSaved % 1 === 0 ? weeklyTimeSaved : weeklyTimeSaved.toFixed(1)} hours`
                  : `${Math.round(weeklyTimeSaved * 60)} minutes`
                }
              </span>
              {' '}per week if you use them daily.
            </p>
            <Link
              href="/how-it-works"
              className="inline-block mt-4 px-6 py-2.5 text-sm font-heading font-bold text-white transition-all hover:brightness-110"
              style={{ background: 'var(--mario-pipe)', border: '3px solid #006400' }}
            >
              Ready to save this time for real?
            </Link>
          </div>
        )}

        {/* Arcade: AI Readiness Score */}
        {isDark && (
          <div className="w-full flex flex-col items-center victory-stats-entrance">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-white/40 mb-4">
              AI Readiness Score
            </p>
            {/* Circular progress */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="var(--mario-coin)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - animatedScore / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.1s ease-out', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-extrabold font-heading" style={{ color: 'var(--mario-coin)' }}>
                  {animatedScore}
                </span>
                <span className="text-[10px] font-heading text-white/40">/100</span>
              </div>
            </div>
            <p className="text-sm font-heading font-semibold text-white mt-3">
              {scoreLabel}
            </p>
          </div>
        )}

        {/* Tagline */}
        <p className={cn(
          'text-sm text-center font-heading victory-tagline-entrance',
          isDark ? 'text-white/60' : 'text-[var(--color-muted)]'
        )}>
          AI is way more powerful than you realized.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full victory-ctas-entrance">
          <a
            href="https://ads2ai.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'w-full sm:w-auto flex-1 text-center px-6 py-3 font-heading font-bold text-sm transition-all duration-200',
              !isDark
                ? 'bg-amber-700 text-white hover:bg-amber-800 rounded-[2px]'
                : 'text-white'
            )}
            style={isDark ? { background: 'var(--mario-pipe)', border: '3px solid #006400' } : undefined}
          >
            Join the Community
          </a>
          <button
            onClick={handlePlayAgain}
            className={cn(
              'w-full sm:w-auto flex-1 text-center px-6 py-3 font-heading font-bold text-sm border-[3px] transition-all duration-200',
              !isDark
                ? 'border-amber-300 text-amber-800 hover:bg-amber-50 rounded-[2px]'
                : 'text-white/80 hover:text-white'
            )}
            style={isDark ? { borderColor: 'var(--mario-coin)', color: 'var(--mario-coin)' } : undefined}
          >
            Back to Map
          </button>
          <button
            onClick={handleStartOver}
            className={cn(
              'w-full sm:w-auto text-center px-6 py-3 font-heading font-medium text-sm transition-colors',
              isDark ? 'text-white/30 hover:text-white/60' : 'text-[var(--color-faint)] hover:text-[var(--color-muted)]'
            )}
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
  isDark,
  icon,
}: {
  label: string
  value: string
  isDark: boolean
  icon?: string
}) {
  return (
    <div className="text-center">
      <p
        className={cn(
          'text-2xl sm:text-3xl font-extrabold font-heading',
          !isDark ? 'text-amber-700' : ''
        )}
        style={isDark ? { color: 'var(--mario-coin)' } : undefined}
      >
        {icon && <span className="mr-1">{icon}</span>}{value}
      </p>
      <p className={cn(
        'text-[10px] sm:text-xs font-heading mt-1',
        !isDark ? 'text-[var(--color-muted)]' : 'text-white/50'
      )}>
        {label}
      </p>
    </div>
  )
}
