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

const BONUS_SKILLS = [
  { name: 'Content Repurposer', description: 'Turn one blog post into platform-specific content for LinkedIn, X, email, and more.', path: '/demo-assets/skills/content-repurposer.zip' },
  { name: 'Meeting Intelligence', description: 'Extract action items, decisions, and follow-ups from rough meeting notes.', path: '/demo-assets/skills/meeting-intelligence.zip' },
  { name: 'Search Term Analyzer', description: 'Classify search terms by intent, flag waste, and generate negative keyword lists.', path: '/demo-assets/skills/search-term-analyzer.zip' },
  { name: 'CSV Analyzer', description: 'Run real statistical analysis on any CSV with Python-powered charts and insights.', path: '/demo-assets/skills/csv-analyzer.zip' },
]

const LEVEL_LEARNINGS = [
  {
    level: 1,
    summary: 'You saw what Cowork does with just a file and a prompt',
    detail: 'No setup, no skills, no configuration. Drag a file, type a prompt, get a result.',
  },
  {
    level: 2,
    summary: 'Skills transformed every output',
    detail: 'Same tool, but with specialized instructions. The difference between generic AI and purpose-built automation.',
  },
  {
    level: 3,
    summary: 'Real tools. Real data. Real safety.',
    detail: 'Connected to live services, evaluated with plugins, and defended against hidden threats.',
  },
]

const AVATAR_CTA: Record<string, {
  primaryLabel: string
  primaryHref?: string
  pitch: string
  secondaryLabel?: string
  secondaryHref?: string
  showBossLetter?: boolean
}> = {
  freelancer: {
    primaryLabel: 'Join Ads to AI',
    primaryHref: 'https://ads2ai.com',
    pitch: 'Offer Cowork setup as a service. Create skills for your clients and charge for the value you deliver.',
  },
  employee: {
    primaryLabel: 'Show Your Boss',
    pitch: "Here's everything you need to make the case for bringing Cowork to your team.",
    secondaryLabel: 'Join Ads to AI',
    secondaryHref: 'https://ads2ai.com',
    showBossLetter: true,
  },
  agency: {
    primaryLabel: 'Set Up Your Team',
    primaryHref: 'https://ads2ai.com',
    pitch: 'Deploy Cowork across your agency. Create skills that standardize your processes and scale your team\'s output.',
    secondaryLabel: 'Join Ads to AI',
    secondaryHref: 'https://ads2ai.com',
  },
  business: {
    primaryLabel: 'Join Ads to AI',
    primaryHref: 'https://ads2ai.com',
    pitch: 'The brain system runs your entire business: email, content, projects, contacts, and more. Cowork is just the beginning.',
  },
}

const BOSS_LETTER = `Hi [Boss Name],

I've been exploring a tool called Cowork (Claude Desktop's agentic mode) that could save our team significant time on repetitive tasks.

In a 15-minute demo, I saw it:
- Redesign a website from a single HTML file (47 seconds)
- Triage an entire inbox with priority sorting and draft replies (8 seconds)
- Build an interactive campaign dashboard with charts from a CSV (15 seconds)
- Extract action items from meeting notes into a trackable dashboard (10 seconds)

The tool works with skills (uploadable instruction sets) that turn it from a general assistant into a specialist. There's a community called Ads to AI that provides training and ready-made skills.

I'd love 15 minutes to show you what I found. Would [suggest a time] work?`

export default function VictoryScreen() {
  const router = useRouter()
  const { completed, skills, totalTimeSaved, totalStars, maxStars, isLevelComplete, resetGame, type } = useGame()
  const skin = useSkin()
  const [letterOpen, setLetterOpen] = useState(false)
  const [copyConfirm, setCopyConfirm] = useState(false)

  const isLight = skin.victoryLayout === 'light-elegant'
  const isDark = skin.victoryLayout === 'dark-celebration'

  // AI Readiness Score calculation
  const readinessScore = useMemo(() => {
    const demoPoints = completed.size * 8
    const skillPoints = Math.min(skills.size * 2, 16)
    let levelBonus = 0
    if (isLevelComplete(1)) levelBonus += 4
    if (isLevelComplete(2)) levelBonus += 4
    if (isLevelComplete(3)) levelBonus += 4
    return Math.min(demoPoints + skillPoints + levelBonus, 100)
  }, [completed.size, skills.size, isLevelComplete])

  const animatedScore = useAnimatedCounter(readinessScore, 1500)

  const scoreLabel = useMemo(() => {
    if (readinessScore >= 90) return 'AI-First Ready. You get it.'
    if (readinessScore >= 70) return 'AI-Amplified. Almost there.'
    if (readinessScore >= 50) return 'AI-Assisted. Good foundation.'
    return 'Getting Started. Keep exploring.'
  }, [readinessScore])

  // Weekly time projection
  const weeklyTimeSaved = totalTimeSaved * 5

  // Play fanfare on mount
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

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(BOSS_LETTER)
    setCopyConfirm(true)
    setTimeout(() => setCopyConfirm(false), 2000)
  }

  // Card styling based on skin layout
  const cardClass = cn(
    'w-full p-5 border-[3px]',
    isLight
      ? 'bg-[var(--world-card-bg)] border-[var(--world-data-border)] rounded-[2px]'
      : 'border-[var(--world-accent)]'
  )
  const cardStyle = isDark ? {
    background: 'var(--world-card-bg)',
    borderColor: 'var(--world-accent)',
  } : undefined

  const headingClass = cn(
    'text-xs font-heading font-semibold uppercase tracking-wider text-center mb-4',
    isLight ? 'text-[var(--world-text-muted)]' : 'text-[var(--world-text-muted)]'
  )

  const primaryBtnClass = cn(
    'w-full sm:w-auto flex-1 text-center px-6 py-3 font-heading font-bold text-sm transition-all duration-200',
    isLight
      ? 'bg-[var(--world-accent)] text-white hover:opacity-90 rounded-[2px]'
      : 'text-white rounded-[2px]'
  )
  const primaryBtnStyle = isDark ? {
    background: 'var(--world-accent2)',
    border: '3px solid var(--world-accent-border)',
  } : undefined

  const secondaryBtnClass = cn(
    'w-full sm:w-auto flex-1 text-center px-6 py-3 font-heading font-bold text-sm border-[3px] transition-all duration-200',
    isLight
      ? 'border-[var(--world-data-border)] text-[var(--world-text)] hover:bg-[var(--world-selection-bg)] rounded-[2px]'
      : 'rounded-[2px]'
  )
  const secondaryBtnStyle = isDark ? {
    borderColor: 'var(--world-accent)',
    color: 'var(--world-accent)',
  } : undefined

  // Firework/celebration particles for dark themes
  const fireworks = useMemo(() => {
    if (isLight) return []
    const colors = ['var(--world-accent)', 'var(--world-accent2)', 'var(--world-accent3)', '#FFFFFF', 'var(--world-accent)']
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 3,
      colorIndex: i % colors.length,
      size: 3 + Math.random() * 4,
    }))
  }, [isLight])

  const particleColors = ['var(--world-accent)', 'var(--world-accent2)', 'var(--world-accent3)', '#FFFFFF', 'var(--world-accent)']

  return (
    <div
      className={cn(
        'page-enter min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden',
        skin.skinClass
      )}
      style={{
        background: isDark ? 'var(--world-dark)' : undefined,
      }}
    >
      {/* Dark theme: starfield background + fireworks */}
      {isDark && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 1 + Math.random() * 2,
                  height: 1 + Math.random() * 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.3 + Math.random() * 0.5,
                  background: 'var(--world-text)',
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
                  background: particleColors[fw.colorIndex],
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
            src={skin.victoryImage}
            alt={skin.victoryHeading}
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {/* Heading */}
        <h1
          className={cn(
            'text-3xl sm:text-4xl font-extrabold font-heading text-center victory-shimmer-text'
          )}
          style={{ color: isLight ? 'var(--world-text)' : 'var(--world-text)' }}
        >
          {skin.victoryHeading}
        </h1>

        {/* Stats summary */}
        <div
          className={cn(cardClass, 'grid grid-cols-2 sm:grid-cols-4 gap-4 victory-stats-entrance')}
          style={cardStyle}
        >
          <StatBlock
            label={skin.victorySkillsLabel}
            value={String(skills.size)}
            isLight={isLight}
          />
          <StatBlock
            label={skin.victoryDemosLabel}
            value={`${completed.size}/9`}
            isLight={isLight}
          />
          <StatBlock
            label="Strategy Score"
            value={`${totalStars}/${maxStars}`}
            isLight={isLight}
          />
          <StatBlock
            label="Est. Time Saved"
            value={totalTimeSaved >= 1 ? `~${Math.round(totalTimeSaved)}h` : `~${Math.round(totalTimeSaved * 60)}m`}
            isLight={isLight}
          />
        </div>

        {/* What you learned recap */}
        <div
          className={cn(cardClass, 'victory-stats-entrance')}
          style={cardStyle}
        >
          <p className={headingClass}>What You Learned</p>
          <div className="flex flex-col gap-4">
            {LEVEL_LEARNINGS.map((item) => {
              const done = isLevelComplete(item.level)
              return (
                <div key={item.level} className="flex gap-3 items-start">
                  <div
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center border-[2px] mt-0.5"
                    style={{
                      borderColor: done ? 'var(--world-accent)' : (isLight ? 'var(--world-data-border)' : 'var(--world-text-muted)'),
                      background: done ? (isLight ? 'var(--world-accent)' : 'var(--world-accent)') : 'transparent',
                      borderRadius: skin.borderRadius,
                    }}
                  >
                    {done && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={isLight ? 'white' : 'var(--world-dark)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 7 6 10 11 4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p
                      className={cn(
                        'font-heading font-bold text-sm',
                        !done && 'opacity-40'
                      )}
                      style={{ color: 'var(--world-text)' }}
                    >
                      {skin.levelLabel} {item.level}: {item.summary}
                    </p>
                    <p
                      className={cn(
                        'text-xs font-heading mt-0.5 leading-relaxed',
                        !done && 'opacity-30'
                      )}
                      style={{ color: isLight ? 'var(--world-text-secondary)' : 'var(--world-text-secondary)' }}
                    >
                      {item.detail}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Earned badges */}
        <div className="w-full victory-badges-entrance">
          <p className={headingClass}>
            Achievements
          </p>
          <BadgeGrid />
        </div>

        {/* Avatar-specific CTA */}
        {type && AVATAR_CTA[type] && (
          <div
            className={cn(cardClass, 'p-6 victory-stats-entrance')}
            style={cardStyle}
          >
            <p
              className={cn(
                'text-sm text-center mb-4 font-heading'
              )}
              style={{ color: isLight ? 'var(--world-text-secondary)' : 'var(--world-text-secondary)' }}
            >
              {AVATAR_CTA[type].pitch}
            </p>

            {/* Boss letter for employees */}
            {AVATAR_CTA[type].showBossLetter && (
              <div className="mb-4">
                <button
                  onClick={() => setLetterOpen(!letterOpen)}
                  className={cn(
                    'w-full text-left px-4 py-3 font-heading font-semibold text-sm border-[3px] transition-all duration-200 flex items-center justify-between',
                    isLight
                      ? 'border-[var(--world-data-border)] hover:bg-[var(--world-selection-bg)] rounded-[2px]'
                      : 'rounded-[2px]'
                  )}
                  style={isDark ? { borderColor: 'var(--world-accent)', color: 'var(--world-accent)' } : { color: 'var(--world-text)' }}
                >
                  <span>{letterOpen ? 'Hide Letter' : 'View Pre-Written Letter'}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn('transition-transform', letterOpen && 'rotate-180')}
                  >
                    <polyline points="4 6 8 10 12 6" />
                  </svg>
                </button>
                {letterOpen && (
                  <div
                    className={cn(
                      'mt-0 px-4 py-4 border-[3px] border-t-0 font-mono text-xs leading-relaxed whitespace-pre-wrap',
                      isLight
                        ? 'bg-white border-[var(--world-data-border)] rounded-[2px]'
                        : 'rounded-[2px]'
                    )}
                    style={isDark ? {
                      background: 'rgba(0,0,0,0.3)',
                      borderColor: 'var(--world-accent)',
                      color: 'var(--world-text-secondary)',
                    } : { color: 'var(--world-text)' }}
                  >
                    {BOSS_LETTER}
                    <button
                      onClick={handleCopyLetter}
                      className={cn(primaryBtnClass, 'mt-4 block text-xs')}
                      style={primaryBtnStyle}
                    >
                      {copyConfirm ? 'Copied!' : 'Copy Letter'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {AVATAR_CTA[type].primaryHref ? (
                <a
                  href={AVATAR_CTA[type].primaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={primaryBtnClass}
                  style={primaryBtnStyle}
                >
                  {AVATAR_CTA[type].primaryLabel}
                </a>
              ) : (
                <button
                  onClick={() => setLetterOpen(!letterOpen)}
                  className={primaryBtnClass}
                  style={primaryBtnStyle}
                >
                  {AVATAR_CTA[type].primaryLabel}
                </button>
              )}
              {AVATAR_CTA[type].secondaryLabel && AVATAR_CTA[type].secondaryHref && (
                <a
                  href={AVATAR_CTA[type].secondaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={secondaryBtnClass}
                  style={secondaryBtnStyle}
                >
                  {AVATAR_CTA[type].secondaryLabel}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Join A2AI CTA (for all avatars) */}
        {type && (!AVATAR_CTA[type]?.primaryHref || AVATAR_CTA[type].primaryHref !== 'https://ads2ai.com') && (
          <div
            className={cn(cardClass, 'p-6 text-center victory-stats-entrance')}
            style={cardStyle}
          >
            <p
              className="text-sm font-heading mb-3"
              style={{ color: isLight ? 'var(--world-text-secondary)' : 'var(--world-text-secondary)' }}
            >
              Get access to ready-made skills, training, and a community of people building with AI.
            </p>
            <a
              href="https://ads2ai.com"
              target="_blank"
              rel="noopener noreferrer"
              className={primaryBtnClass}
              style={primaryBtnStyle}
            >
              Join Ads to AI
            </a>
          </div>
        )}

        {/* Bonus Skills */}
        <div
          className={cn(cardClass, 'victory-stats-entrance')}
          style={cardStyle}
        >
          <p className={headingClass}>
            Bonus Skills
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BONUS_SKILLS.map((skill) => (
              <div
                key={skill.name}
                className={cn(
                  'p-4 border-[2px] flex flex-col gap-2',
                  isLight
                    ? 'bg-[var(--world-card-bg)] border-[var(--world-data-border)] rounded-[2px]'
                    : 'rounded-[2px]'
                )}
                style={isDark ? {
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'var(--world-text-muted)',
                } : undefined}
              >
                <p
                  className="font-heading font-bold text-sm"
                  style={{ color: 'var(--world-text)' }}
                >
                  {skill.name}
                </p>
                <p
                  className="text-xs font-heading leading-relaxed"
                  style={{ color: isLight ? 'var(--world-text-secondary)' : 'var(--world-text-secondary)' }}
                >
                  {skill.description}
                </p>
                <a
                  href={skill.path}
                  download
                  className={cn(
                    'mt-auto inline-flex items-center gap-1.5 px-3 py-1.5 font-heading font-bold text-xs transition-all duration-200 self-start',
                    isLight
                      ? 'bg-[var(--world-accent)] text-white hover:opacity-90 rounded-[2px]'
                      : 'text-white rounded-[2px]'
                  )}
                  style={isDark ? {
                    background: 'var(--world-accent2)',
                    border: '2px solid var(--world-accent-border)',
                  } : undefined}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2v7" />
                    <path d="M3 7l3 3 3-3" />
                    <path d="M2 11h8" />
                  </svg>
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Time Saved section */}
        {totalTimeSaved > 0 && (
          <div
            className={cn(cardClass, 'p-6 text-center victory-stats-entrance')}
            style={cardStyle}
          >
            <p className={headingClass}>
              Time Saved
            </p>
            <p
              className="text-2xl sm:text-3xl font-extrabold font-heading"
              style={{ color: 'var(--world-accent)' }}
            >
              <svg className="inline-block mr-2 -mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--world-accent)' }}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {totalTimeSaved >= 1
                ? `${totalTimeSaved % 1 === 0 ? totalTimeSaved : totalTimeSaved.toFixed(1)} hours`
                : `${Math.round(totalTimeSaved * 60)} minutes`
              } this session
            </p>
            <p
              className="text-sm mt-2 font-heading"
              style={{ color: isLight ? 'var(--world-text-secondary)' : 'var(--world-text-secondary)' }}
            >
              That&apos;s{' '}
              <span className="font-bold" style={{ color: 'var(--world-text)' }}>
                {weeklyTimeSaved >= 1
                  ? `${weeklyTimeSaved % 1 === 0 ? weeklyTimeSaved : weeklyTimeSaved.toFixed(1)} hours`
                  : `${Math.round(weeklyTimeSaved * 60)} minutes`
                }
              </span>
              {' '}per week if you use them daily.
            </p>
            <Link
              href="/how-it-works"
              className={cn(primaryBtnClass, 'inline-block mt-4')}
              style={primaryBtnStyle}
            >
              Ready to save this time for real?
            </Link>
          </div>
        )}

        {/* AI Readiness Score */}
        <div className="w-full flex flex-col items-center victory-stats-entrance">
          <p className={headingClass}>
            AI Readiness Score
          </p>
          {/* Circular progress */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={isLight ? 'var(--world-data-border)' : 'var(--world-text-muted)'}
                strokeWidth="8"
                opacity={0.3}
              />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="var(--world-accent)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - animatedScore / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.1s ease-out', filter: isDark ? 'drop-shadow(0 0 6px var(--world-accent))' : 'none' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-3xl sm:text-4xl font-extrabold font-heading"
                style={{ color: 'var(--world-accent)' }}
              >
                {animatedScore}
              </span>
              <span
                className="text-[10px] font-heading"
                style={{ color: 'var(--world-text-muted)' }}
              >
                /100
              </span>
            </div>
          </div>
          <p
            className="text-sm font-heading font-semibold mt-3"
            style={{ color: 'var(--world-text)' }}
          >
            {scoreLabel}
          </p>
        </div>

        {/* Tagline */}
        <p
          className="text-sm text-center font-heading victory-tagline-entrance"
          style={{ color: isLight ? 'var(--world-text-secondary)' : 'var(--world-text-secondary)' }}
        >
          AI is way more powerful than you realized.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full victory-ctas-entrance">
          <button
            onClick={handlePlayAgain}
            className={secondaryBtnClass}
            style={secondaryBtnStyle}
          >
            Back to Map
          </button>
          <button
            onClick={handleStartOver}
            className={cn(
              'w-full sm:w-auto text-center px-6 py-3 font-heading font-medium text-sm transition-colors'
            )}
            style={{ color: 'var(--world-text-muted)' }}
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
  isLight,
}: {
  label: string
  value: string
  isLight: boolean
}) {
  return (
    <div className="text-center">
      <p
        className="text-2xl sm:text-3xl font-extrabold font-heading"
        style={{ color: 'var(--world-accent)' }}
      >
        {value}
      </p>
      <p
        className={cn(
          'text-[10px] sm:text-xs font-heading mt-1'
        )}
        style={{ color: isLight ? 'var(--world-text-secondary)' : 'var(--world-text-secondary)' }}
      >
        {label}
      </p>
    </div>
  )
}
