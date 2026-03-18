'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGame, useSkin } from '@/components/game-provider'
import { DEMO_SKILLS, DEMO_TIME_SAVED, ALL_LEVEL_1_IDS, ALL_LEVEL_2_IDS, ALL_LEVEL_3_IDS } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import { isMuted, toggleMute, playSound, getVolume, setVolume } from '@/lib/sounds'
import WorldSwitcher from '@/components/world-switcher'

const typeLabels: Record<string, string> = {
  agency: 'Agency Owner',
  employee: 'Agency Employee',
  freelancer: 'Freelancer',
  business: 'Business Owner',
}

const worldLabels: Record<string, string> = {
  gallery: 'Classic',
  arcade: 'Super Mario',
  'red-alert': 'Red Alert',
  'clair-obscur': 'Clair Obscur',
  tetris: 'Tetris',
  zelda: 'Zelda',
  'elder-scrolls': 'Elder Scrolls',
}

// Map world IDs to sprite filenames (gallery has no sprite)
const worldSprites: Record<string, string> = {
  arcade: '/images/sprites/mario.png',
  'red-alert': '/images/sprites/red-alert.png',
  'clair-obscur': '/images/sprites/clair-obscur.png',
  tetris: '/images/sprites/tetris.png',
  zelda: '/images/sprites/zelda.png',
  'elder-scrolls': '/images/sprites/elder-scrolls.png',
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
  const [worldSwitcherOpen, setWorldSwitcherOpen] = useState(false)
  const [soundMuted, setSoundMuted] = useState(true)
  const [volume, setVol] = useState(0.7)
  const [showVolume] = useState(true)
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

  // Sync mute/volume state on mount
  useEffect(() => {
    setSoundMuted(isMuted())
    setVol(getVolume())
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
    const label = skin.levelLabel.toUpperCase()
    if (ALL_LEVEL_1_IDS.has(demoId)) return `${label} 1`
    if (ALL_LEVEL_2_IDS.has(demoId)) return `${label} 2`
    if (ALL_LEVEL_3_IDS.has(demoId)) return `${label} 3`
    return null
  }

  const handleSoundToggle = () => {
    toggleMute()
    setSoundMuted(isMuted())
    if (!isMuted()) playSound('coin')
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    setVol(v)
  }

  return (
    <>
      {/* ARCADE NAVBAR - Mario HUD style (commented out - always use light bar now) */}
      {/* skin.navLayout === 'dark-hud' ? ( */}
      {false ? (
        <nav className={cn("sticky top-0 z-50 border-b", skin.skinClass)} style={{ background: 'var(--world-dark)', borderBottomColor: 'var(--nav-border, #333)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-heading font-bold text-lg tracking-tight text-white"
              onClick={() => { if (isPlaying) resetGame() }}
            >
              <span style={{ color: 'var(--world-accent)' }}>AI demos.</span>
              <span className="text-white/80"> See it. Then try it.</span>
            </Link>

            <div className="flex items-center gap-4 sm:gap-6">
              {/* Character sprite in navbar - opens world switcher */}
              {world && worldSprites[world as string] && (
                <button
                  onClick={() => setWorldSwitcherOpen(true)}
                  className="w-6 h-6 sm:w-7 sm:h-7 overflow-hidden flex-shrink-0 cursor-pointer transition-transform hover:scale-110"
                  style={{
                    borderRadius: '50%',
                    border: '2px solid var(--world-accent)',
                    boxShadow: '0 0 6px rgba(255,215,0,0.3)',
                  }}
                  title="Switch world"
                >
                  <img
                    src={worldSprites[world as string]}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </button>
              )}

              {/* World indicator */}
              {getCurrentWorldLabel() && (
                <span className="hidden sm:inline text-xs font-heading font-bold text-white tracking-wider">
                  {getCurrentWorldLabel()}
                </span>
              )}

              {/* Coin counter */}
              {completed.size > 0 && (
                <div className={cn('relative flex items-center gap-1.5 text-xs font-heading font-bold', showCoinPlus && 'coin-counter-flash')} style={{ color: 'var(--world-accent)' }}>
                  <span className="coin-spin text-sm">&#9679;</span>
                  <span>x{completed.size}</span>
                  {showCoinPlus && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-bold coin-plus-one" style={{ color: 'var(--world-accent)' }}>
                      +1
                    </span>
                  )}
                </div>
              )}

              {/* Star counter (skills) */}
              {skillCount > 0 && (
                <button
                  onClick={() => setPanelOpen(true)}
                  className="min-h-[44px] flex items-center gap-1.5 text-xs font-heading font-bold transition-all"
                  style={{ color: 'var(--world-accent)' }}
                >
                  <span className="text-sm">{'\u2605'}</span>
                  <span>x{skillCount}</span>
                </button>
              )}

              {/* Time saved counter (arcade only) */}
              {actualTimeSaved > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-heading font-bold" style={{ color: 'var(--world-accent)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{formatTimeSaved(displayTimeSaved)}</span>
                </div>
              )}

              {/* Sound toggle + volume */}
              <div className="relative flex items-center gap-1">
                <button
                  onClick={handleSoundToggle}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
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
                {showVolume && !soundMuted && (
                  <div
                    className="flex items-center gap-1 pl-1"
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 accent-white/60 cursor-pointer"
                      style={{ accentColor: 'currentColor' }}
                    />
                  </div>
                )}
              </div>

              {/* Map link when in demo */}
              {pathname.startsWith('/play/') && (
                <Link
                  href="/play"
                  className="text-xs sm:text-sm font-heading font-medium text-white/60 hover:text-white transition-colors"
                >
                  Map
                </Link>
              )}

              {/* Course */}
              <Link
                href="/course"
                className={cn(
                  'text-xs sm:text-sm font-heading font-medium transition-colors',
                  pathname.startsWith('/course')
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                Free Cowork Course
              </Link>

              {/* FAQ */}
              <Link
                href="/faq"
                className={cn(
                  'text-xs sm:text-sm font-heading font-medium transition-colors',
                  pathname === '/faq'
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                FAQ
              </Link>
            </div>
          </div>
        </nav>
      ) : (
        /* GALLERY NAVBAR - Original style */
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link
              href={isPlaying ? '/play' : '/'}
              className="font-heading font-bold text-lg tracking-tight"
            >
              <span className="text-[var(--color-brand-orange)]">AI demos.</span>
              <span className="text-[var(--color-ink)]"> See it. Then try it.</span>
            </Link>

            <div className="flex items-center gap-4 sm:gap-6">
              {/* Character sprite in navbar - opens world switcher */}
              {world && worldSprites[world] && (
                <button
                  onClick={() => setWorldSwitcherOpen(true)}
                  className="hidden sm:block w-6 h-6 sm:w-7 sm:h-7 overflow-hidden flex-shrink-0 cursor-pointer transition-transform hover:scale-110"
                  style={{
                    borderRadius: '50%',
                    border: '2px solid var(--world-accent)',
                  }}
                  title="Switch world"
                >
                  <img
                    src={worldSprites[world]}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </button>
              )}

              {/* Breadcrumb context */}
              {type && (
                <div className="hidden sm:flex items-center gap-2 text-xs font-heading">
                  <span className="text-[var(--color-faint)]">
                    {typeLabels[type]}
                  </span>
                  {world && (
                    <>
                      <span className="text-[var(--color-border)]">/</span>
                      <button
                        onClick={() => setWorldSwitcherOpen(true)}
                        className="font-semibold text-amber-700 hover:text-[var(--color-brand-orange)] transition-colors cursor-pointer"
                        title="Switch world"
                      >
                        {worldLabels[world]}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Skill inventory indicator */}
              {world && skillCount > 0 && (
                <button
                  onClick={() => setPanelOpen(true)}
                  className="relative flex items-center gap-1.5 px-2 py-1 min-h-[44px] rounded-[2px] border transition-all text-xs font-heading font-semibold border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                  <span>{skillCount}</span>
                </button>
              )}

              {/* Sound toggle + volume (light navbar) */}
              <div className="relative flex items-center gap-1">
                <button
                  onClick={handleSoundToggle}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
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
                {showVolume && !soundMuted && (
                  <div className="flex items-center gap-1 pl-1">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 cursor-pointer"
                      style={{ accentColor: 'var(--color-muted)' }}
                    />
                  </div>
                )}
              </div>

              {/* Map link when in demo */}
              {pathname.startsWith('/play/') && (
                <Link
                  href="/play"
                  className="text-xs sm:text-sm font-heading font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                  Map
                </Link>
              )}

              {/* Course */}
              <Link
                href="/course"
                className={cn(
                  'text-xs sm:text-sm font-heading font-medium transition-colors',
                  pathname.startsWith('/course')
                    ? 'text-[var(--color-brand-orange)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                )}
              >
                Free Cowork Course
              </Link>

              {/* FAQ */}
              <Link
                href="/faq"
                className={cn(
                  'text-xs sm:text-sm font-heading font-medium transition-colors',
                  pathname === '/faq'
                    ? 'text-[var(--color-brand-orange)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                )}
              >
                FAQ
              </Link>
            </div>
          </div>
        </nav>
      )}

      {/* World switcher slide-out panel */}
      <WorldSwitcher open={worldSwitcherOpen} onClose={() => setWorldSwitcherOpen(false)} />

      {/* Skill inventory slide-out panel */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-[55] skill-panel-backdrop"
          style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }}
          onClick={() => setPanelOpen(false)}
        >
          <div
            className={cn(
              'absolute top-0 right-0 h-full w-full sm:w-80 shadow-xl border-l skill-panel-slide',
              skin.skinClass,
              isDark
                ? 'border-[#333]'
                : 'bg-white border-amber-200'
            )}
            style={isDark ? { background: 'var(--world-dark)' } : undefined}
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
              <h2 className="text-sm font-heading font-bold text-[var(--world-text)]">
                {skin.skillInventoryTitle}
              </h2>
              <button
                onClick={() => setPanelOpen(false)}
                className={cn(
                  'min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors text-lg leading-none',
                  'text-[var(--world-text-muted)] hover:text-[var(--world-text)]'
                )}
              >
                &times;
              </button>
            </div>

            {/* Skill list */}
            <div className="p-4 space-y-3 max-h-[85vh] overflow-y-auto">
              {uniqueSkills.length === 0 ? (
                <p className="text-xs font-heading text-[var(--world-text-muted)]">
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
                    style={{ background: 'var(--world-card-bg)', borderColor: 'var(--world-accent3)' }}
                  >
                    <p
                      className="text-sm font-heading font-bold"
                      style={{ color: 'var(--world-accent)' }}
                    >
                      {skill.name}
                    </p>
                    <ul className="mt-1.5 space-y-0.5">
                      {skill.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className={cn(
                            'text-xs flex items-center gap-1.5 text-[var(--world-text-secondary)]'
                          )}
                        >
                          <span
                            className="w-1 h-1 flex-shrink-0"
                            style={{ background: 'var(--world-accent2)', borderRadius: 0 }}
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
