'use client'

import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { BadgeTray, BadgeToast } from '@/components/badge-system'
import { getLevels, type PlayerType } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'
import { useTransition } from '@/components/transition-overlay'
import type { SkinConfig } from '@/lib/skin-config'
import { LevelCelebration } from './shared'

const SECTOR_NAMES = ['SECTOR ALPHA', 'SECTOR BRAVO', 'SECTOR CHARLIE']

// Military HUD Stats Widget
function RedAlertStatsWidget({
  completedCount,
  availableCount,
  skillCount,
  timeSaved,
  expanded,
  onToggle,
}: {
  completedCount: number
  availableCount: number
  skillCount: number
  timeSaved: number
  expanded: boolean
  onToggle: () => void
}) {
  const timeSavedLabel =
    timeSaved >= 1 ? `~${Math.round(timeSaved)}h` : timeSaved > 0 ? `~${Math.round(timeSaved * 60)}m` : '0'

  return (
    <div className="z-30 flex flex-col items-end">
      {expanded && (
        <div
          className="mb-2 p-3 border-2 shadow-lg stats-widget-expand"
          style={{
            background: 'rgba(10, 18, 8, 0.92)',
            borderColor: 'var(--ra-green)',
            boxShadow: '0 0 12px rgba(51, 255, 51, 0.15)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="text-center pb-2 mb-3"
            style={{ borderBottom: '1px solid var(--ra-grid)' }}
          >
            <span
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{ color: 'var(--ra-text)', fontFamily: "'Share Tech Mono', 'Courier New', monospace", opacity: 0.6 }}
            >
              Mission Log
            </span>
          </div>
          <div className="space-y-2 text-xs" style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--ra-text)', opacity: 0.6 }}>TECHNOLOGIES</span>
              <span className="font-bold" style={{ color: 'var(--ra-green)' }}>{skillCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--ra-text)', opacity: 0.6 }}>MISSIONS CLEAR</span>
              <span className="font-bold" style={{ color: 'var(--ra-green)' }}>{completedCount}/{availableCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--ra-text)', opacity: 0.6 }}>TIME SAVED</span>
              <span className="font-bold" style={{ color: 'var(--ra-green)' }}>{timeSavedLabel}</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="px-3 py-1.5 text-xs font-semibold border-2 shadow-md transition-all duration-200"
        style={{
          background: 'rgba(10, 18, 8, 0.92)',
          borderColor: 'var(--ra-green)',
          color: 'var(--ra-green)',
          fontFamily: "'Share Tech Mono', 'Courier New', monospace",
          letterSpacing: '0.1em',
          backdropFilter: 'blur(8px)',
        }}
      >
        {completedCount}/{availableCount} CLEAR
      </button>
    </div>
  )
}

// Main Map Component
export interface RedAlertMapProps {
  skin: SkinConfig
  showCelebration: boolean
  celebrationLevel: number
  onDismissCelebration: () => void
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}

export default function RedAlertMap({
  skin,
  showCelebration,
  celebrationLevel,
  onDismissCelebration,
  statsExpanded,
  setStatsExpanded,
}: RedAlertMapProps) {
  const router = useRouter()
  const { navigateWithTransition } = useTransition()
  const { type, completed, skills, isLevelComplete, allAvailableComplete, totalTimeSaved, choiceScores } = useGame()

  if (!type) return null

  const levels = getLevels(type as PlayerType)
  const availableDemoCount = levels.filter(l => !l.comingSoon).reduce((sum, l) => sum + l.demos.length, 0)

  // Find the active level (first incomplete, or last if all done)
  const activeLevelIdx = isLevelComplete(2) ? 2 : isLevelComplete(1) ? 1 : 0
  const activeLevel = levels[activeLevelIdx]
  const activeDemos = activeLevel?.demos || []

  // Find the first uncompleted demo in the active level
  const currentDemoId = activeDemos.find(d => !completed.has(d.id))?.id ?? -1

  const handleDemoClick = (demoId: number) => {
    if (skin.sounds.selection) playSound(skin.sounds.selection)
    playSound('ra-radar-ping')
    navigateWithTransition(`/play/${demoId}`)
  }

  // Which background level image to use
  const bgLevel = isLevelComplete(2) ? 3 : isLevelComplete(1) ? 2 : 1

  return (
    <div className="page-enter skin-red-alert" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
      <BadgeToast />

      {/* Full-screen background image */}
      <div
        className="fixed inset-0 z-0"
      >
        <img
          src={`/images/maps/red-alert-level-${bgLevel}.png`}
          alt=""
          className="w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        {/* Dark military overlay for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center 30%, transparent 20%, rgba(10, 18, 8, 0.35) 100%)',
          }}
        />
        {/* CRT scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
            backgroundSize: '100% 4px',
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 min-h-[calc(100vh-3.5rem)] flex flex-col">

        {/* Badge tray at top */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="max-w-5xl mx-auto">
            <BadgeTray />
          </div>
        </div>

        {/* Sector hints and cards - vertically centered */}
        <div className="flex-1 flex flex-col justify-center items-center gap-6">

          {/* Other sectors (completed or locked) */}
          <div className="flex flex-col items-center gap-3">
            {[2, 1, 0].filter(idx => idx !== activeLevelIdx).map((idx, i) => {
              const done = isLevelComplete(idx + 1)
              return (
                <div key={idx} className="ra-sector-hint flex items-center gap-3" style={{ animationDelay: `${1 - i * 0.5}s` }}>
                  <div style={{ width: 40 + i * 10, height: 1, background: 'var(--ra-green)', opacity: done ? 0.4 : 0.2 + i * 0.1 }} />
                  <span
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{
                      color: 'var(--ra-green)',
                      fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                      opacity: done ? 0.6 : 0.3 + i * 0.1,
                      fontSize: `${11 + i}px`,
                      fontWeight: 400,
                    }}
                  >
                    {SECTOR_NAMES[idx]}{done ? ' \u2713' : ''}
                  </span>
                  <div style={{ width: 40 + i * 10, height: 1, background: 'var(--ra-green)', opacity: done ? 0.4 : 0.2 + i * 0.1 }} />
                </div>
              )
            })}
          </div>

          {/* Active sector title */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-3">
              <div style={{ width: 80, height: 1, background: 'var(--ra-green)', opacity: 0.5 }} />
              <div
                style={{
                  width: 8, height: 8,
                  background: 'var(--ra-green)',
                  opacity: 0.5,
                }}
              />
              <div style={{ width: 80, height: 1, background: 'var(--ra-green)', opacity: 0.5 }} />
            </div>
            <h2
              className="text-2xl sm:text-4xl tracking-[0.25em] uppercase"
              style={{
                color: 'var(--ra-green)',
                fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                fontWeight: 400,
                textShadow: '0 0 16px rgba(51, 255, 51, 0.5)',
              }}
            >
              {SECTOR_NAMES[activeLevelIdx]}
            </h2>
            <p
              className="text-sm sm:text-base mt-2 tracking-[0.1em] uppercase"
              style={{
                color: 'var(--ra-text)',
                fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                opacity: 0.5,
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
              }}
            >
              {activeLevel?.name || 'This Is Cowork'}
            </p>
          </div>

          {/* Demo cards area - vertically centered with title */}
          <div className="px-4 sm:px-8">
            <div className={cn('max-w-4xl mx-auto grid grid-cols-1 gap-4 sm:gap-6', activeDemos.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3')}>
              {activeDemos.map((demo) => {
                const done = completed.has(demo.id)
                const isCurrent = demo.id === currentDemoId
                const stars = choiceScores[demo.id] || 0

                return (
                  <button
                    key={demo.id}
                    onClick={() => handleDemoClick(demo.id)}
                    className={cn(
                      'ra-map-card relative text-left p-5 sm:p-6 border-2 transition-all duration-300',
                      isCurrent && 'ra-map-card-active',
                    )}
                    style={{
                      background: isCurrent
                        ? 'rgba(10, 18, 8, 0.92)'
                        : done
                          ? 'rgba(10, 18, 8, 0.88)'
                          : 'rgba(10, 18, 8, 0.75)',
                      borderColor: done
                        ? 'var(--ra-green)'
                        : isCurrent
                          ? 'var(--ra-green)'
                          : 'rgba(51, 255, 51, 0.2)',
                      borderWidth: isCurrent ? '2px' : done ? '2px' : '1px',
                      backdropFilter: 'blur(16px)',
                      cursor: 'pointer',
                      borderRadius: '0px',
                      boxShadow: isCurrent
                        ? '0 0 24px rgba(51, 255, 51, 0.25), inset 0 0 0 1px rgba(51, 255, 51, 0.1)'
                        : done
                          ? '0 0 12px rgba(51, 255, 51, 0.1)'
                          : '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Green scan line at top for active card */}
                    {isCurrent && (
                      <div
                        className="absolute top-0 left-[8px] right-[8px] h-[1px]"
                        style={{ background: 'linear-gradient(90deg, transparent, var(--ra-green), transparent)' }}
                      />
                    )}

                    {/* Military corner brackets */}
                    <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: '2px solid var(--ra-green)', borderLeft: '2px solid var(--ra-green)', opacity: (done || isCurrent) ? 0.8 : 0.2 }} />
                    <div className="absolute top-0 right-0 w-4 h-4" style={{ borderTop: '2px solid var(--ra-green)', borderRight: '2px solid var(--ra-green)', opacity: (done || isCurrent) ? 0.8 : 0.2 }} />
                    <div className="absolute bottom-0 left-0 w-4 h-4" style={{ borderBottom: '2px solid var(--ra-green)', borderLeft: '2px solid var(--ra-green)', opacity: (done || isCurrent) ? 0.8 : 0.2 }} />
                    <div className="absolute bottom-0 right-0 w-4 h-4" style={{ borderBottom: '2px solid var(--ra-green)', borderRight: '2px solid var(--ra-green)', opacity: (done || isCurrent) ? 0.8 : 0.2 }} />

                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      {done ? (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold"
                          style={{
                            color: 'var(--ra-dark)',
                            background: 'var(--ra-green)',
                            fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                          }}
                        >
                          {'\u2713'}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold"
                          style={{
                            color: 'var(--ra-green)',
                            fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                            border: '1.5px solid var(--ra-green)',
                            opacity: isCurrent ? 1 : 0.5,
                          }}
                        >
                          ?
                        </span>
                      )}
                      {done && stars > 0 && (
                        <span
                          className="text-xs ml-auto"
                          style={{ color: 'var(--ra-green)', fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
                        >
                          {Array.from({ length: 3 }, (_, s) =>
                            s < stars ? '\u2605' : '\u2606'
                          ).join('')}
                        </span>
                      )}
                    </div>

                    {/* Demo title */}
                    <h3
                      className="text-lg sm:text-xl leading-snug mb-2 uppercase"
                      style={{
                        color: 'var(--ra-text)',
                        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                        fontWeight: 400,
                        letterSpacing: '0.05em',
                        fontSize: '16px',
                      }}
                    >
                      {demo.title}
                    </h3>

                    {/* Demo subtitle */}
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: 'var(--ra-text)',
                        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                        opacity: 0.5,
                        fontWeight: 400,
                        fontSize: '12px',
                      }}
                    >
                      {demo.subtitle}
                    </p>

                    {/* Done label */}
                    {done && (
                      <div
                        className="mt-3 text-[10px] tracking-[0.15em] uppercase"
                        style={{
                          color: 'var(--ra-green)',
                          fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                          fontWeight: 400,
                        }}
                      >
                        Mission Clear
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Overlay UI: victory button */}
        {allAvailableComplete && (
          <div className="fixed bottom-24 left-0 right-0 z-20 text-center">
            <button
              onClick={() => {
                playSound('ra-campaign-complete')
                router.push('/victory')
              }}
              className="px-6 py-3 font-bold text-sm transition-all duration-300 uppercase"
              style={{
                background: 'rgba(10, 18, 8, 0.92)',
                border: '2px solid var(--ra-green)',
                color: 'var(--ra-green)',
                fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                letterSpacing: '0.15em',
                boxShadow: '0 0 16px rgba(51, 255, 51, 0.3)',
              }}
            >
              CAMPAIGN COMPLETE - VIEW RESULTS
            </button>
          </div>
        )}

        {/* Bottom nav: abort mission + stats */}
        <div className="relative z-20 pb-4 pt-6 px-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-xs transition-colors duration-300 uppercase"
            style={{
              color: 'var(--ra-text)',
              fontFamily: "'Share Tech Mono', 'Courier New', monospace",
              letterSpacing: '0.1em',
              opacity: 0.3,
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            Abort Mission
          </button>
          <RedAlertStatsWidget
            completedCount={completed.size}
            availableCount={availableDemoCount}
            skillCount={skills.size}
            timeSaved={totalTimeSaved}
            expanded={statsExpanded}
            onToggle={() => setStatsExpanded((p: boolean) => !p)}
          />
        </div>
      </div>

      {showCelebration && (
        <LevelCelebration
          levelNumber={celebrationLevel}
          onDismiss={onDismissCelebration}
          skin={skin}
        />
      )}
    </div>
  )
}
