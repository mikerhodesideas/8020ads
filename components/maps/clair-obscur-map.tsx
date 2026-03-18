'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { BadgeTray, BadgeToast, WorldUnlockToast } from '@/components/badge-system'
import { getLevels, getDemoUrl, type PlayerType } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'
import { useTransition } from '@/components/transition-overlay'
import type { SkinConfig } from '@/lib/skin-config'
import { LevelCelebration } from './shared'

// Stats widget styled as an art deco expedition journal panel
function ExpeditionStatsWidget({
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
            background: 'rgba(253, 251, 247, 0.92)',
            borderColor: 'var(--co-gold)',
            borderWidth: '1px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 2px 12px rgba(197, 165, 90, 0.12)',
          }}
        >
          <div
            className="text-center pb-2 mb-3"
            style={{ borderBottom: '1px solid var(--co-border)' }}
          >
            <span
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{ color: 'var(--co-slate)', fontFamily: 'var(--co-font-body)' }}
            >
              Expedition Log
            </span>
          </div>
          <div className="space-y-2.5 text-xs" style={{ fontFamily: 'var(--co-font-body)' }}>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--co-slate)' }}>Techniques</span>
              <span className="font-bold" style={{ color: 'var(--co-gold)', fontFamily: 'var(--co-font-heading)' }}>{skillCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--co-slate)' }}>Expeditions</span>
              <span className="font-bold" style={{ color: 'var(--co-gold)', fontFamily: 'var(--co-font-heading)' }}>{completedCount}/{availableCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--co-slate)' }}>Time saved</span>
              <span className="font-bold" style={{ color: 'var(--co-gold)', fontFamily: 'var(--co-font-heading)' }}>{timeSavedLabel}</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="px-3 py-1.5 text-xs font-semibold border shadow-md transition-all duration-300"
        style={{
          background: 'rgba(253, 251, 247, 0.92)',
          borderColor: 'var(--co-gold)',
          color: 'var(--co-gold)',
          fontFamily: 'var(--co-font-heading)',
          letterSpacing: '0.05em',
          backdropFilter: 'blur(8px)',
        }}
      >
        {completedCount}/{availableCount} complete
      </button>
    </div>
  )
}

export interface ClairObscurMapProps {
  skin: SkinConfig
  showCelebration: boolean
  celebrationLevel: number
  onDismissCelebration: () => void
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}

export default function ClairObscurMap({
  skin,
  showCelebration,
  celebrationLevel,
  onDismissCelebration,
  statsExpanded,
  setStatsExpanded,
}: ClairObscurMapProps) {
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
  const chapterNames = ['Chapter I', 'Chapter II', 'Chapter III']

  const handleDemoClick = (demoId: number) => {
    if (skin.sounds.selection) playSound(skin.sounds.selection)
    playSound('co-page-chime')
    navigateWithTransition(getDemoUrl(demoId))
  }

  // Which background level image to use
  const bgLevel = isLevelComplete(2) ? 3 : isLevelComplete(1) ? 2 : 1

  return (
    <div className="page-enter skin-clair-obscur" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
      <BadgeToast />
      <WorldUnlockToast />

      {/* Full-screen background image */}
      <div
        className="fixed inset-0 z-0"
      >
        <img
          src={`/images/maps/clair-obscur-level-${bgLevel}.png`}
          alt=""
          className="w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        {/* Subtle vignette overlay for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center 30%, transparent 30%, rgba(42, 36, 28, 0.25) 100%)',
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

          {/* Other chapters (completed or locked) */}
          <div className="flex flex-col items-center gap-3">
            {[2, 1, 0].filter(idx => idx !== activeLevelIdx).map((idx, i) => {
              const done = isLevelComplete(idx + 1)
              return (
                <div key={idx} className="co-chapter-hint flex items-center gap-3" style={{ animationDelay: `${1 - i * 0.5}s` }}>
                  <div style={{ width: 40 + i * 10, height: 1, background: 'var(--co-gold)', opacity: done ? 0.5 : 0.3 + i * 0.1 }} />
                  <span
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{
                      color: 'var(--co-gold)',
                      fontFamily: 'var(--co-font-heading)',
                      opacity: done ? 0.7 : 0.4 + i * 0.1,
                      fontSize: `${11 + i}px`,
                      fontWeight: 600,
                    }}
                  >
                    {chapterNames[idx]}{done ? ' \u2713' : ''}
                  </span>
                  <div style={{ width: 40 + i * 10, height: 1, background: 'var(--co-gold)', opacity: done ? 0.5 : 0.3 + i * 0.1 }} />
                </div>
              )
            })}
          </div>

          {/* Active chapter title */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-3">
              <div style={{ width: 80, height: 1, background: 'var(--co-gold)', opacity: 0.6 }} />
              <div
                style={{
                  width: 10, height: 10,
                  background: 'var(--co-gold)',
                  opacity: 0.5,
                  transform: 'rotate(45deg)',
                }}
              />
              <div style={{ width: 80, height: 1, background: 'var(--co-gold)', opacity: 0.6 }} />
            </div>
            <h2
              className="text-2xl sm:text-4xl tracking-[0.2em] uppercase"
              style={{
                color: 'var(--co-cream)',
                fontFamily: 'var(--co-font-heading)',
                fontWeight: 700,
                textShadow: '0 2px 12px rgba(42, 36, 28, 0.6)',
              }}
            >
              {chapterNames[activeLevelIdx]}
            </h2>
            <p
              className="text-sm sm:text-base mt-2 tracking-[0.08em]"
              style={{
                color: 'var(--co-cream)',
                fontFamily: 'var(--co-font-body)',
                opacity: 0.7,
                fontStyle: 'italic',
                textShadow: '0 1px 4px rgba(42, 36, 28, 0.6)',
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
                      'co-map-card relative text-left p-5 sm:p-6 border transition-all duration-300',
                      isCurrent && 'co-map-card-active',
                    )}
                    style={{
                      background: isCurrent
                        ? 'rgba(253, 251, 247, 0.92)'
                        : done
                          ? 'rgba(253, 251, 247, 0.88)'
                          : 'rgba(253, 251, 247, 0.7)',
                      borderColor: done
                        ? 'var(--co-gold)'
                        : isCurrent
                          ? 'var(--co-gold)'
                          : 'rgba(197, 165, 90, 0.25)',
                      borderWidth: isCurrent ? '2px' : done ? '1.5px' : '1px',
                      backdropFilter: 'blur(16px)',
                      cursor: 'pointer',
                      borderRadius: '1px',
                      boxShadow: isCurrent
                        ? '0 4px 24px rgba(197, 165, 90, 0.3)'
                        : done
                          ? '0 2px 12px rgba(197, 165, 90, 0.15)'
                          : '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Gold accent bar at top for active card */}
                    {isCurrent && (
                      <div
                        className="absolute top-0 left-[12px] right-[12px] h-[2px]"
                        style={{ background: 'linear-gradient(90deg, transparent, var(--co-glow), transparent)' }}
                      />
                    )}

                    {/* Art deco corner accents */}
                    <div className="absolute top-0 left-0 w-5 h-5" style={{ borderTop: '2px solid var(--co-gold)', borderLeft: '2px solid var(--co-gold)', opacity: (done || isCurrent) ? 0.8 : 0.3 }} />
                    <div className="absolute top-0 right-0 w-5 h-5" style={{ borderTop: '2px solid var(--co-gold)', borderRight: '2px solid var(--co-gold)', opacity: (done || isCurrent) ? 0.8 : 0.3 }} />
                    <div className="absolute bottom-0 left-0 w-5 h-5" style={{ borderBottom: '2px solid var(--co-gold)', borderLeft: '2px solid var(--co-gold)', opacity: (done || isCurrent) ? 0.8 : 0.3 }} />
                    <div className="absolute bottom-0 right-0 w-5 h-5" style={{ borderBottom: '2px solid var(--co-gold)', borderRight: '2px solid var(--co-gold)', opacity: (done || isCurrent) ? 0.8 : 0.3 }} />

                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      {done ? (
                        <span
                          className="text-base"
                          style={{ color: 'var(--co-gold)', fontFamily: 'var(--co-font-heading)' }}
                        >
                          {'\u2605'}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 text-sm font-bold"
                          style={{
                            color: 'var(--co-gold)',
                            fontFamily: 'var(--co-font-heading)',
                            border: '1.5px solid var(--co-gold)',
                            opacity: isCurrent ? 1 : 0.6,
                          }}
                        >
                          ?
                        </span>
                      )}
                      {done && stars > 0 && (
                        <span
                          className="text-xs ml-auto"
                          style={{ color: 'var(--co-gold)', fontFamily: 'var(--co-font-heading)' }}
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
                        color: 'var(--co-ink)',
                        fontFamily: 'var(--co-font-heading)',
                        fontWeight: 700,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {demo.title}
                    </h3>

                    {/* Demo subtitle */}
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: 'var(--co-slate)',
                        fontFamily: 'var(--co-font-body)',
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
                          color: 'var(--co-gold)',
                          fontFamily: 'var(--co-font-heading)',
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
                playSound('co-expedition-complete')
                router.push('/victory')
              }}
              className="px-6 py-3 font-bold text-sm transition-all duration-300"
              style={{
                background: 'var(--co-gold)',
                color: 'var(--co-cream)',
                border: '1px solid var(--co-glow)',
                fontFamily: 'var(--co-font-heading)',
                letterSpacing: '0.08em',
              }}
            >
              VIEW EXPEDITION RESULTS
            </button>
          </div>
        )}

        {/* Bottom nav: stats */}
        <div className="relative z-20 pb-4 pt-6 px-4 flex items-center justify-end">
          <ExpeditionStatsWidget
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
