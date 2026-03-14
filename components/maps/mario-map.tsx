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

// Mario-themed stats widget
function MarioStatsWidget({
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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
      {expanded && (
        <div
          className="mb-2 p-3 border-[3px] shadow-lg stats-widget-expand"
          style={{ background: 'var(--mario-dark)', borderColor: 'var(--mario-coin)' }}
        >
          <div className="space-y-2 text-xs font-heading">
            <div className="flex justify-between gap-6">
              <span className="text-white/60">Power-ups</span>
              <span className="font-bold" style={{ color: 'var(--mario-coin)' }}>{skillCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/60">Stages cleared</span>
              <span className="font-bold" style={{ color: 'var(--mario-coin)' }}>{completedCount}/{availableCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/60">Time saved</span>
              <span className="font-bold" style={{ color: 'var(--mario-coin)' }}>{timeSavedLabel}</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="px-3 py-1.5 text-xs font-heading font-semibold border-[3px] shadow-md transition-all duration-200"
        style={{
          background: 'var(--mario-dark)',
          borderColor: 'var(--mario-coin)',
          color: 'var(--mario-coin)',
        }}
      >
        {completedCount}/{availableCount} clear
      </button>
    </div>
  )
}

export interface MarioMapProps {
  skin: SkinConfig
  showCelebration: boolean
  celebrationLevel: number
  onDismissCelebration: () => void
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}

export default function MarioMap({
  skin,
  showCelebration,
  celebrationLevel,
  onDismissCelebration,
  statsExpanded,
  setStatsExpanded,
}: MarioMapProps) {
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

  const worldNames = ['WORLD 1', 'WORLD 2', 'WORLD 3']

  const handleDemoClick = (demoId: number) => {
    if (skin.sounds.selection) playSound(skin.sounds.selection)
    navigateWithTransition(`/play/${demoId}`)
  }

  // Which background level image to use
  const bgLevel = isLevelComplete(2) ? 3 : isLevelComplete(1) ? 2 : 1

  return (
    <div className="page-enter skin-arcade arcade-scanlines" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
      <BadgeToast />

      {/* Full-screen background image */}
      <div className="fixed inset-0 z-0">
        <img
          src={`/images/maps/arcade-level-${bgLevel}.png`}
          alt=""
          className="w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center bottom', opacity: 0.5 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center 60%, transparent 20%, rgba(26, 26, 46, 0.5) 100%)',
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

        {/* World hints and cards - vertically centered */}
        <div className="flex-1 flex flex-col justify-center items-center gap-6">

          {/* Other worlds (completed or locked) */}
          <div className="flex flex-col items-center gap-3">
            {[2, 1, 0].filter(idx => idx !== activeLevelIdx).map((idx, i) => {
              const done = isLevelComplete(idx + 1)
              const locked = idx > 0 && !isLevelComplete(idx)
              return (
                <div key={idx} className="flex items-center gap-3" style={{ animationDelay: `${1 - i * 0.5}s` }}>
                  <div style={{ width: 40 + i * 10, height: 2, background: 'var(--mario-coin)', opacity: done ? 0.5 : 0.2 }} />
                  <span
                    className="text-xs tracking-[0.2em] uppercase font-heading font-bold"
                    style={{
                      color: 'var(--mario-coin)',
                      opacity: done ? 0.7 : 0.3,
                      fontSize: `${11 + i}px`,
                    }}
                  >
                    {worldNames[idx]}{done ? ' \u2605' : locked ? ' \u{1F512}' : ''}
                  </span>
                  <div style={{ width: 40 + i * 10, height: 2, background: 'var(--mario-coin)', opacity: done ? 0.5 : 0.2 }} />
                </div>
              )
            })}
          </div>

          {/* Active world title */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-3">
              <div style={{ width: 60, height: 3, background: 'var(--mario-coin)', opacity: 0.6 }} />
              {/* Coin icon */}
              <div
                className="w-6 h-6 flex items-center justify-center font-heading font-black text-sm"
                style={{
                  background: 'var(--mario-coin)',
                  color: 'var(--mario-dark)',
                  border: '2px solid #B8860B',
                  borderRadius: '50%',
                }}
              >
                $
              </div>
              <div style={{ width: 60, height: 3, background: 'var(--mario-coin)', opacity: 0.6 }} />
            </div>
            <h2
              className="text-3xl sm:text-5xl tracking-[0.15em] uppercase font-heading font-black"
              style={{
                color: 'white',
                textShadow: '3px 3px 0 var(--mario-dark), -1px -1px 0 var(--mario-dark), 1px -1px 0 var(--mario-dark), -1px 1px 0 var(--mario-dark)',
              }}
            >
              {worldNames[activeLevelIdx]}
            </h2>
            <p
              className="text-sm sm:text-base mt-2 tracking-[0.08em] font-heading"
              style={{
                color: 'var(--mario-coin)',
                opacity: 0.8,
                textShadow: '0 1px 4px rgba(0,0,0,0.7)',
              }}
            >
              {activeLevel?.name || 'World 1'}
            </p>
          </div>

          {/* Demo cards */}
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
                      'relative text-left p-5 sm:p-6 border-[3px] transition-all duration-300',
                      isCurrent && 'character-bounce',
                    )}
                    style={{
                      background: isCurrent
                        ? 'rgba(26, 26, 46, 0.95)'
                        : done
                          ? 'rgba(26, 26, 46, 0.88)'
                          : 'rgba(26, 26, 46, 0.8)',
                      borderColor: done
                        ? 'var(--mario-coin)'
                        : isCurrent
                          ? 'var(--mario-block)'
                          : 'rgba(200, 76, 12, 0.4)',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      boxShadow: isCurrent
                        ? '0 0 20px rgba(232, 160, 0, 0.3), inset 0 0 20px rgba(232, 160, 0, 0.05)'
                        : done
                          ? '0 0 12px rgba(255, 215, 0, 0.15)'
                          : '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Pixel-style top accent for active card */}
                    {isCurrent && (
                      <div
                        className="absolute top-0 left-[8px] right-[8px] h-[3px]"
                        style={{ background: 'var(--mario-block)' }}
                      />
                    )}

                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      {done ? (
                        <span
                          className="text-lg"
                          style={{ color: 'var(--mario-coin)' }}
                        >
                          {'\u2605'}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 text-base font-heading font-black"
                          style={{
                            background: isCurrent ? 'var(--mario-block)' : 'rgba(232, 160, 0, 0.3)',
                            color: isCurrent ? 'white' : 'var(--mario-block)',
                            border: `2px solid ${isCurrent ? '#C07800' : 'rgba(232, 160, 0, 0.4)'}`,
                            borderRadius: '2px',
                          }}
                        >
                          ?
                        </span>
                      )}
                      {done && stars > 0 && (
                        <span
                          className="text-xs ml-auto font-heading"
                          style={{ color: 'var(--mario-coin)' }}
                        >
                          {Array.from({ length: 3 }, (_, s) =>
                            s < stars ? '\u2605' : '\u2606'
                          ).join('')}
                        </span>
                      )}
                    </div>

                    {/* Demo title */}
                    <h3
                      className="text-lg sm:text-xl leading-snug mb-2 font-heading font-bold uppercase"
                      style={{
                        color: 'white',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {demo.title}
                    </h3>

                    {/* Demo subtitle */}
                    <p
                      className="text-sm leading-relaxed font-heading"
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: 500,
                      }}
                    >
                      {demo.subtitle}
                    </p>

                    {/* Done label */}
                    {done && (
                      <div
                        className="mt-3 text-[10px] tracking-[0.15em] uppercase font-heading font-bold"
                        style={{ color: 'var(--mario-pipe)' }}
                      >
                        Stage Clear!
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Victory button */}
        {allAvailableComplete && (
          <div className="fixed bottom-24 left-0 right-0 z-20 text-center">
            <button
              onClick={() => {
                playSound('fanfare')
                router.push('/victory')
              }}
              className="px-6 py-3 font-heading font-bold text-sm transition-all duration-300 node-completed-glow text-white uppercase tracking-wider"
              style={{ background: 'var(--mario-pipe)', border: '3px solid #006400' }}
            >
              View Results
            </button>
          </div>
        )}

        {/* Bottom nav: start over */}
        <div className="fixed bottom-4 left-4 z-20">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-white/40 hover:text-white/70 transition-colors font-heading"
          >
            Start over
          </button>
        </div>

        {/* Floating stats widget */}
        <MarioStatsWidget
          completedCount={completed.size}
          availableCount={availableDemoCount}
          skillCount={skills.size}
          timeSaved={totalTimeSaved}
          expanded={statsExpanded}
          onToggle={() => setStatsExpanded((p: boolean) => !p)}
        />
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
