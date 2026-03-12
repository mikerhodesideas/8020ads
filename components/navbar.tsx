'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGame, useSkin } from '@/components/game-provider'
import { DEMO_SKILLS, DEMO_TIME_SAVED } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import { isMuted, toggleMute, playSound } from '@/lib/sounds'

const typeLabels: Record<string, string> = {
  agency: 'Agency Owner',
  employee: 'Agency Employee',
  freelancer: 'Freelancer',
  business: 'Business Owner',
}

const worldLabels: Record<string, string> = {
  gallery: 'The Gallery',
  arcade: 'The Arcade',
}

function formatTimeSaved(hours: number): string {
  if (hours >= 1) {
    return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hrs saved`
  }
  return `${Math.round(hours * 60)} min saved`
}

export default function Navbar() {
  const pathname = usePathname()
  const { type, world, skills, completed, resetGame } = useGame()
  const skin = useSkin()
  const [panelOpen, setPanelOpen] = useState(false)
  const [soundMuted, setSoundMuted] = useState(true)
  const [displayTimeSaved, setDisplayTimeSaved] = useState(0)
  const prevTimeSavedRef = useRef(0)
  const [showCoinPlus, setShowCoinPlus] = useState(false)
  const prevCompletedRef = useRef(completed.size)

  // Calculate actual time saved from completed demos
  const actualTimeSaved = useMemo(() => {
    let total = 0
    completed.forEach((id) => { total += DEMO_TIME_SAVED[id] || 0 })
    return total
  }, [completed])

  // Animate time saved counter when value changes
  useEffect(() => {
    const prev = prevTimeSavedRef.current
    const target = actualTimeSaved
    if (prev === target) {
      setDisplayTimeSaved(target)
      return
    }
    const duration = 500
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const pct = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3)
      setDisplayTimeSaved(prev + (target - prev) * eased)
      if (pct < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        prevTimeSavedRef.current = target
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [actualTimeSaved])

  // Coin counter "+1" flash when completed count changes
  useEffect(() => {
    if (completed.size > prevCompletedRef.current && completed.size > 0) {
      setShowCoinPlus(true)
      const t = setTimeout(() => setShowCoinPlus(false), 900)
      prevCompletedRef.current = completed.size
      return () => clearTimeout(t)
    }
    prevCompletedRef.current = completed.size
  }, [completed.size])

  // Sync mute state on mount
  useEffect(() => {
    setSoundMuted(isMuted())
  }, [])

  const isPlaying = pathname.startsWith('/play') || pathname === '/world'
  const isDark = skin.isDark
  const skillCount = skills.size

  // Get installed skill details
  const installedSkills = Object.values(DEMO_SKILLS).filter(
    (s) => skills.has(s.id)
  )
  // Deduplicate (data-analyst appears twice)
  const uniqueSkills = installedSkills.filter(
    (s, i, arr) => arr.findIndex((x) => x.id === s.id) === i
  )

  // Determine current world level from pathname
  const getCurrentWorldLabel = () => {
    if (!pathname.startsWith('/play/')) return null
    const demoId = parseInt(pathname.split('/').pop() || '0', 10)
    if (demoId >= 1 && demoId <= 4) return 'WORLD 1'
    if (demoId >= 5 && demoId <= 8) return 'WORLD 2'
    if (demoId >= 9 && demoId <= 11) return 'WORLD 3'
    return null
  }

  const handleSoundToggle = () => {
    toggleMute()
    setSoundMuted(isMuted())
    if (!isMuted()) playSound('coin')
  }

  return (
    <>
      {/* ARCADE NAVBAR - Mario HUD style */}
      {skin.navLayout === 'dark-hud' ? (
        <nav className="sticky top-0 z-50 border-b border-[#333]" style={{ background: '#1a1a2e' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-heading font-bold text-lg tracking-tight text-white"
              onClick={() => { if (isPlaying) resetGame() }}
            >
              <span style={{ color: 'var(--mario-coin)' }}>8020skill</span>
              <span className="text-white/80"> The AI Game</span>
            </Link>

            <div className="flex items-center gap-4 sm:gap-6">
              {/* World indicator */}
              {getCurrentWorldLabel() && (
                <span className="hidden sm:inline text-xs font-heading font-bold text-white tracking-wider">
                  {getCurrentWorldLabel()}
                </span>
              )}

              {/* Coin counter */}
              {completed.size > 0 && (
                <div className={cn('relative flex items-center gap-1.5 text-xs font-heading font-bold', showCoinPlus && 'coin-counter-flash')} style={{ color: 'var(--mario-coin)' }}>
                  <span className="coin-spin text-sm">&#9679;</span>
                  <span>x{completed.size}</span>
                  {showCoinPlus && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold coin-plus-one" style={{ color: 'var(--mario-coin)' }}>
                      +1
                    </span>
                  )}
                </div>
              )}

              {/* Star counter (skills) */}
              {skillCount > 0 && (
                <button
                  onClick={() => setPanelOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-heading font-bold transition-all"
                  style={{ color: 'var(--mario-coin)' }}
                >
                  <span className="text-sm">{'\u2605'}</span>
                  <span>x{skillCount}</span>
                </button>
              )}

              {/* Time saved counter (arcade only) */}
              {actualTimeSaved > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-heading font-bold" style={{ color: 'var(--mario-coin)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{formatTimeSaved(displayTimeSaved)}</span>
                </div>
              )}

              {/* Sound toggle */}
              <button
                onClick={handleSoundToggle}
                className="text-white/60 hover:text-white transition-colors"
                title={soundMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {soundMuted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>

              {/* Map link when in demo */}
              {pathname.startsWith('/play/') && (
                <Link
                  href="/play"
                  className="text-xs sm:text-sm font-heading font-medium text-white/60 hover:text-white transition-colors"
                >
                  Map
                </Link>
              )}

              {/* How it works */}
              <Link
                href="/how-it-works"
                className={cn(
                  'text-xs sm:text-sm font-heading font-medium transition-colors',
                  pathname === '/how-it-works'
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                How It Works
              </Link>
            </div>
          </div>
        </nav>
      ) : (
        /* GALLERY NAVBAR - Original style */
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-heading font-bold text-lg tracking-tight"
              onClick={() => {
                if (isPlaying) resetGame()
              }}
            >
              <span className="text-[var(--color-brand-orange)]">8020skill</span>
              <span className="text-[var(--color-ink)]"> The AI Game</span>
            </Link>

            <div className="flex items-center gap-4 sm:gap-6">
              {/* Breadcrumb context */}
              {type && (
                <div className="hidden sm:flex items-center gap-2 text-xs font-heading">
                  <span className="text-[var(--color-faint)]">
                    {typeLabels[type]}
                  </span>
                  {world && (
                    <>
                      <span className="text-[var(--color-border)]">/</span>
                      <span className="font-semibold text-amber-700">
                        {worldLabels[world]}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Skill inventory indicator */}
              {world && skillCount > 0 && (
                <button
                  onClick={() => setPanelOpen(true)}
                  className="relative flex items-center gap-1.5 px-2 py-1 rounded-[2px] border transition-all text-xs font-heading font-semibold border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                  <span>{skillCount}</span>
                </button>
              )}

              {/* Map link when in demo */}
              {pathname.startsWith('/play/') && (
                <Link
                  href="/play"
                  className="text-xs sm:text-sm font-heading font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                  Map
                </Link>
              )}

              {/* How it works */}
              <Link
                href="/how-it-works"
                className={cn(
                  'text-xs sm:text-sm font-heading font-medium transition-colors',
                  pathname === '/how-it-works'
                    ? 'text-[var(--color-brand-orange)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                )}
              >
                How It Works
              </Link>
            </div>
          </div>
        </nav>
      )}

      {/* Skill inventory slide-out panel */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-[55] skill-panel-backdrop"
          style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }}
          onClick={() => setPanelOpen(false)}
        >
          <div
            className={cn(
              'absolute top-0 right-0 h-full w-72 sm:w-80 shadow-xl border-l skill-panel-slide',
              isDark
                ? 'border-[#333]'
                : 'bg-white border-amber-200'
            )}
            style={isDark ? { background: 'var(--mario-dark)' } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel header */}
            <div
              className={cn(
                'flex items-center justify-between px-5 py-4 border-b',
                isDark
                  ? 'border-[#333]'
                  : 'border-amber-100 bg-amber-50/50'
              )}
            >
              <h2 className={cn(
                'text-sm font-heading font-bold',
                isDark ? 'text-white' : 'text-[var(--color-ink)]'
              )}>
                {skin.skillInventoryTitle}
              </h2>
              <button
                onClick={() => setPanelOpen(false)}
                className={cn(
                  'transition-colors text-lg leading-none',
                  isDark ? 'text-white/50 hover:text-white' : 'text-[var(--color-faint)] hover:text-[var(--color-ink)]'
                )}
              >
                &times;
              </button>
            </div>

            {/* Skill list */}
            <div className="p-4 space-y-3">
              {uniqueSkills.length === 0 ? (
                <p className={cn('text-xs font-heading', isDark ? 'text-white/40' : 'text-[var(--color-faint)]')}>
                  {skin.noSkillsText}
                </p>
              ) : (
                uniqueSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className={cn(
                      'p-3 border',
                      isDark
                        ? 'border-[#444]'
                        : 'border-amber-200 bg-amber-50/40'
                    )}
                    style={isDark ? { background: 'rgba(255,255,255,0.05)', borderColor: 'var(--mario-block)' } : undefined}
                  >
                    <p
                      className={cn(
                        'text-sm font-heading font-bold',
                        isDark ? '' : 'text-amber-800'
                      )}
                      style={isDark ? { color: 'var(--mario-coin)' } : undefined}
                    >
                      {skill.name}
                    </p>
                    <ul className="mt-1.5 space-y-0.5">
                      {skill.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className={cn(
                            'text-xs flex items-center gap-1.5',
                            isDark ? 'text-white/60' : 'text-[var(--color-muted)]'
                          )}
                        >
                          <span
                            className="w-1 h-1 flex-shrink-0"
                            style={isDark ? { background: 'var(--mario-pipe)', borderRadius: 0 } : undefined}
                          />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
