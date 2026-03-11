'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { DEMO_SKILLS } from '@/lib/game-data'
import { cn } from '@/lib/utils'

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

export default function Navbar() {
  const pathname = usePathname()
  const { type, world, skills, resetGame } = useGame()
  const [panelOpen, setPanelOpen] = useState(false)

  const isPlaying = pathname.startsWith('/play') || pathname === '/world'
  const isGallery = world === 'gallery'
  const skillCount = skills.size

  // Get installed skill details
  const installedSkills = Object.values(DEMO_SKILLS).filter(
    (s) => skills.has(s.id)
  )
  // Deduplicate (data-analyst appears twice)
  const uniqueSkills = installedSkills.filter(
    (s, i, arr) => arr.findIndex((x) => x.id === s.id) === i
  )

  return (
    <>
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
                    <span
                      className={cn(
                        'font-semibold',
                        isGallery
                          ? 'text-amber-700'
                          : 'text-blue-600'
                      )}
                    >
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
                className={cn(
                  'relative flex items-center gap-1.5 px-2 py-1 rounded-[2px] border transition-all text-xs font-heading font-semibold',
                  isGallery
                    ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                    : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                )}
              >
                {/* Icon */}
                {isGallery ? (
                  // Gold frame icon
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                ) : (
                  // Star icon
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={skillCount > 0 ? 'skill-count-pulse' : ''}>
                    <path d="M12 2l2.4 7.2H22l-6 4.4 2.3 7.2L12 16.4l-6.3 4.4 2.3-7.2-6-4.4h7.6z" />
                  </svg>
                )}
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

      {/* Skill inventory slide-out panel */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-[55] skill-panel-backdrop"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          onClick={() => setPanelOpen(false)}
        >
          <div
            className={cn(
              'absolute top-0 right-0 h-full w-72 sm:w-80 bg-white shadow-xl border-l skill-panel-slide',
              isGallery ? 'border-amber-200' : 'border-blue-200'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel header */}
            <div
              className={cn(
                'flex items-center justify-between px-5 py-4 border-b',
                isGallery ? 'border-amber-100 bg-amber-50/50' : 'border-blue-100 bg-blue-50/50'
              )}
            >
              <h2 className="text-sm font-heading font-bold text-[var(--color-ink)]">
                Installed Skills
              </h2>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-[var(--color-faint)] hover:text-[var(--color-ink)] transition-colors text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {/* Skill list */}
            <div className="p-4 space-y-3">
              {uniqueSkills.length === 0 ? (
                <p className="text-xs text-[var(--color-faint)] font-heading">
                  No skills installed yet.
                </p>
              ) : (
                uniqueSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className={cn(
                      'p-3 border rounded-[2px]',
                      isGallery
                        ? 'border-amber-200 bg-amber-50/40'
                        : 'border-blue-200 bg-blue-50/40'
                    )}
                  >
                    <p
                      className={cn(
                        'text-sm font-heading font-bold',
                        isGallery ? 'text-amber-800' : 'text-blue-800'
                      )}
                    >
                      {skill.name}
                    </p>
                    <ul className="mt-1.5 space-y-0.5">
                      {skill.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className="text-xs text-[var(--color-muted)] flex items-center gap-1.5"
                        >
                          <span
                            className={cn(
                              'w-1 h-1 rounded-full flex-shrink-0',
                              isGallery ? 'bg-amber-400' : 'bg-blue-400'
                            )}
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
