'use client'

import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { BadgeTray, BadgeToast, WorldUnlockToast } from '@/components/badge-system'
import { getLevels, getDemoUrl, type PlayerType } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'
import { useTransition } from '@/components/transition-overlay'
import type { SkinConfig } from '@/lib/skin-config'
import { LevelCelebration } from './shared'

// Stats widget styled as a Nordic quest journal panel
function ElderScrollsStatsWidget({
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
          className="mb-2 p-4 border shadow-lg stats-widget-expand"
          style={{
            background: 'rgba(15, 15, 26, 0.92)',
            borderColor: 'var(--es-gold)',
            borderWidth: '1px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 2px 12px rgba(201, 168, 76, 0.12)',
          }}
        >
          <div
            className="text-center pb-2 mb-3"
            style={{ borderBottom: '1px solid rgba(201, 168, 76, 0.2)' }}
          >
            <span
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{ color: 'var(--es-steel)', fontFamily: "'Cinzel', serif" }}
            >
              Quest Journal
            </span>
          </div>
          <div className="space-y-2.5 text-xs" style={{ fontFamily: "'Crimson Text', Georgia, serif" }}>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--es-steel)' }}>Perks</span>
              <span className="font-bold" style={{ color: 'var(--es-gold)', fontFamily: "'Cinzel', serif" }}>{skillCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--es-steel)' }}>Quests</span>
              <span className="font-bold" style={{ color: 'var(--es-gold)', fontFamily: "'Cinzel', serif" }}>{completedCount}/{availableCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--es-steel)' }}>Time saved</span>
              <span className="font-bold" style={{ color: 'var(--es-gold)', fontFamily: "'Cinzel', serif" }}>{timeSavedLabel}</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="px-3 py-1.5 text-xs font-semibold border shadow-md transition-all duration-300"
        style={{
          background: 'rgba(15, 15, 26, 0.92)',
          borderColor: 'var(--es-gold)',
          color: 'var(--es-gold)',
          fontFamily: "'Cinzel', serif",
          letterSpacing: '0.05em',
          backdropFilter: 'blur(8px)',
          textTransform: 'uppercase' as const,
        }}
      >
        {completedCount}/{availableCount} complete
      </button>
    </div>
  )
}

export interface ElderScrollsMapProps {
  skin: SkinConfig
  showCelebration: boolean
  celebrationLevel: number
  onDismissCelebration: () => void
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}

export default function ElderScrollsMap({
  skin,
  showCelebration,
  celebrationLevel,
  onDismissCelebration,
  statsExpanded,
  setStatsExpanded,
}: ElderScrollsMapProps) {
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

  // Chapter names for this theme
  const chapterNames = ['Constellation I', 'Constellation II', 'Constellation III']

  const handleDemoClick = (demoId: number) => {
    if (skin.sounds.selection) playSound(skin.sounds.selection)
    playSound('es-node-select')
    navigateWithTransition(getDemoUrl(demoId))
  }

  // Which background level image to use
  const bgLevel = isLevelComplete(2) ? 3 : isLevelComplete(1) ? 2 : 1

  return (
    <div className="page-enter skin-elder-scrolls" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
      <BadgeToast />
      <WorldUnlockToast />

      {/* Full-screen background image */}
      <div
        className="fixed inset-0 z-0"
      >
        <img
          src={`/images/maps/elder-scrolls-level-${bgLevel}.png`}
          alt=""
          className="w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        {/* Vignette overlay for depth - darker than Clair Obscur for night sky feel */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center 30%, transparent 20%, rgba(15, 15, 26, 0.35) 100%)',
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

        {/* Chapter hints and cards - vertically centered */}
        <div className="flex-1 flex flex-col justify-center items-center gap-6">

          {/* Other constellations (completed or locked) */}
          <div className="flex flex-col items-center gap-3">
            {[2, 1, 0].filter(idx => idx !== activeLevelIdx).map((idx, i) => {
              const done = isLevelComplete(idx + 1)
              return (
                <div key={idx} className="es-chapter-hint flex items-center gap-3" style={{ animationDelay: `${1 - i * 0.5}s` }}>
                  <div style={{ width: 40 + i * 10, height: 1, background: 'var(--es-gold)', opacity: done ? 0.4 : 0.2 + i * 0.1 }} />
                  <span
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{
                      color: 'var(--es-gold)',
                      fontFamily: "'Cinzel', serif",
                      opacity: done ? 0.6 : 0.3 + i * 0.1,
                      fontSize: `${11 + i}px`,
                      fontWeight: 600,
                    }}
                  >
                    {chapterNames[idx]}{done ? ' \u2713' : ''}
                  </span>
                  <div style={{ width: 40 + i * 10, height: 1, background: 'var(--es-gold)', opacity: done ? 0.4 : 0.2 + i * 0.1 }} />
                </div>
              )
            })}
          </div>

          {/* Active constellation title */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-3">
              <div style={{ width: 80, height: 1, background: 'var(--es-gold)', opacity: 0.5 }} />
              {/* Four-pointed star separator */}
              <svg width="18" height="18" viewBox="0 0 14 14" style={{ opacity: 0.5 }}>
                <polygon
                  points="7,0 8.5,5.5 14,7 8.5,8.5 7,14 5.5,8.5 0,7 5.5,5.5"
                  fill="var(--es-gold)"
                />
              </svg>
              <div style={{ width: 80, height: 1, background: 'var(--es-gold)', opacity: 0.5 }} />
            </div>
            <h2
              className="text-2xl sm:text-4xl tracking-[0.2em] uppercase"
              style={{
                color: 'var(--es-star-white)',
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                textShadow: '0 2px 12px rgba(15, 15, 26, 0.8)',
              }}
            >
              {chapterNames[activeLevelIdx]}
            </h2>
            <p
              className="text-sm sm:text-base mt-2 tracking-[0.08em]"
              style={{
                color: 'var(--es-star-white)',
                fontFamily: "'Crimson Text', Georgia, serif",
                opacity: 0.6,
                fontStyle: 'italic',
                textShadow: '0 1px 4px rgba(15, 15, 26, 0.8)',
              }}
            >
              {activeLevel?.name || 'The Warrior'}
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
                      'es-map-card relative text-left p-5 sm:p-6 border transition-all duration-300',
                      isCurrent && 'es-map-card-active',
                    )}
                    style={{
                      background: isCurrent
                        ? 'rgba(15, 15, 26, 0.94)'
                        : done
                          ? 'rgba(15, 15, 26, 0.9)'
                          : 'rgba(15, 15, 26, 0.75)',
                      borderColor: done
                        ? 'var(--es-gold)'
                        : isCurrent
                          ? 'var(--es-constellation)'
                          : 'rgba(201, 168, 76, 0.15)',
                      borderWidth: isCurrent ? '2px' : done ? '1.5px' : '1px',
                      backdropFilter: 'blur(16px)',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      boxShadow: isCurrent
                        ? '0 4px 24px rgba(123, 158, 199, 0.25), 0 0 40px rgba(123, 158, 199, 0.08)'
                        : done
                          ? '0 2px 12px rgba(201, 168, 76, 0.15)'
                          : '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Rune-light accent bar at top for active card */}
                    {isCurrent && (
                      <div
                        className="absolute top-0 left-[12px] right-[12px] h-[2px]"
                        style={{ background: 'linear-gradient(90deg, transparent, var(--es-constellation), transparent)' }}
                      />
                    )}

                    {/* Nordic corner accents - rune-style angular corners */}
                    <div className="absolute top-0 left-0 w-5 h-5" style={{ borderTop: `2px solid var(--es-gold)`, borderLeft: `2px solid var(--es-gold)`, opacity: (done || isCurrent) ? 0.7 : 0.2 }} />
                    <div className="absolute top-0 right-0 w-5 h-5" style={{ borderTop: `2px solid var(--es-gold)`, borderRight: `2px solid var(--es-gold)`, opacity: (done || isCurrent) ? 0.7 : 0.2 }} />
                    <div className="absolute bottom-0 left-0 w-5 h-5" style={{ borderBottom: `2px solid var(--es-gold)`, borderLeft: `2px solid var(--es-gold)`, opacity: (done || isCurrent) ? 0.7 : 0.2 }} />
                    <div className="absolute bottom-0 right-0 w-5 h-5" style={{ borderBottom: `2px solid var(--es-gold)`, borderRight: `2px solid var(--es-gold)`, opacity: (done || isCurrent) ? 0.7 : 0.2 }} />

                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      {done ? (
                        <span style={{ color: 'var(--es-gold)', fontFamily: "'Cinzel', serif", fontSize: '16px' }}>
                          {'\u2605'}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 text-sm font-bold"
                          style={{
                            color: isCurrent ? 'var(--es-constellation)' : 'var(--es-gold)',
                            fontFamily: "'Cinzel', serif",
                            border: `1.5px solid ${isCurrent ? 'var(--es-constellation)' : 'var(--es-gold)'}`,
                            opacity: isCurrent ? 1 : 0.5,
                            borderRadius: '1px',
                          }}
                        >
                          ?
                        </span>
                      )}
                      {done && stars > 0 && (
                        <span
                          className="text-xs ml-auto"
                          style={{ color: 'var(--es-gold)', fontFamily: "'Cinzel', serif" }}
                        >
                          {Array.from({ length: 3 }, (_, s) =>
                            s < stars ? '\u2605' : '\u2606'
                          ).join('')}
                        </span>
                      )}
                    </div>

                    {/* Demo title */}
                    <h3
                      className="text-lg sm:text-xl leading-snug mb-2"
                      style={{
                        color: 'var(--es-star-white)',
                        fontFamily: "'Cinzel', serif",
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {demo.title}
                    </h3>

                    {/* Demo subtitle */}
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: 'var(--es-steel)',
                        fontFamily: "'Crimson Text', Georgia, serif",
                        fontStyle: 'italic',
                        opacity: 0.85,
                        fontWeight: 500,
                      }}
                    >
                      {demo.subtitle}
                    </p>

                    {/* Done label */}
                    {done && (
                      <div
                        className="mt-3 text-[10px] tracking-[0.15em] uppercase"
                        style={{
                          color: 'var(--es-gold)',
                          fontFamily: "'Cinzel', serif",
                          fontWeight: 600,
                        }}
                      >
                        Complete
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
                playSound('es-victory')
                router.push('/victory')
              }}
              className="px-6 py-3 font-bold text-sm transition-all duration-300"
              style={{
                background: 'var(--es-dark-leather)',
                color: 'var(--es-gold)',
                border: '1px solid var(--es-gold)',
                fontFamily: "'Cinzel', serif",
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                boxShadow: '0 0 16px rgba(201, 168, 76, 0.25)',
              }}
            >
              DRAGONBORN
            </button>
          </div>
        )}

        {/* Bottom nav: stats */}
        <div className="relative z-20 pb-4 pt-6 px-4 flex items-center justify-end">
          <ElderScrollsStatsWidget
            completedCount={Math.min(completed.size, availableDemoCount)}
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
