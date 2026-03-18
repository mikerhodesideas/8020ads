'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useGame } from '@/components/game-provider'
import { BadgeTray, BadgeToast, WorldUnlockToast } from '@/components/badge-system'
import { getLevels, getDemoUrl, type PlayerType, type DemoType } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import type { SkinConfig } from '@/lib/skin-config'
import { LevelCelebration } from './shared'

// Demo node card within a level
function DemoNode({
  demo,
  index,
  done,
  isGallery,
  stars,
  onClick,
  iconImage,
  isRecommended,
}: {
  demo: { id: number; icon: string; demoType: DemoType; title: string; subtitle: string }
  index: number
  done: boolean
  isGallery: boolean
  stars: number
  onClick: () => void
  iconImage?: string
  isRecommended?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative text-left p-5 rounded-[2px] transition-all duration-300 group',
        'border focus:outline-none',
        !done && 'node-entrance',
        done
          ? 'bg-[#f0fdf4] border-l-[3px] border-l-[#22c55e] border-t border-r border-b border-t-gray-100 border-r-gray-100 border-b-gray-100'
          : isRecommended
            ? 'bg-white quest-glow hover:shadow-lg hover:-translate-y-1'
            : 'bg-white border-[var(--color-border)] hover:border-[var(--color-brand-orange)] hover:shadow-lg hover:-translate-y-1',
        'cursor-pointer'
      )}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-3 h-7">
        <span
          className={cn(
            'inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold font-heading',
            done
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-[var(--color-brand-orange-faint)] text-[var(--color-brand-orange)]'
          )}
        >
          {done ? '\u2713' : index + 1}
        </span>
      </div>

      <h3
        className={cn(
          'text-sm font-bold mb-1 font-heading leading-tight',
          done ? 'text-emerald-800' : 'text-[var(--color-ink)]'
        )}
      >
        {demo.title}
      </h3>
      <p className="text-xs text-[var(--color-muted)] leading-relaxed">
        {demo.subtitle}
      </p>

      {done && stars > 0 && (
        <div className="mt-2 text-sm tracking-wider">
          {Array.from({ length: 3 }, (_, s) => (
            <span key={s} className={s < stars ? 'text-amber-500' : 'text-gray-300'}>
              {s < stars ? '\u2605' : '\u2606'}
            </span>
          ))}
        </div>
      )}

      <div
        className={cn(
          'absolute top-1/2 right-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1',
          isGallery ? 'text-amber-500' : 'text-blue-500'
        )}
      >
        &#8594;
      </div>
    </button>
  )
}

// Floating stats widget
function StatsWidget({
  isGallery,
  completedCount,
  availableCount,
  skillCount,
  timeSaved,
  expanded,
  onToggle,
}: {
  isGallery: boolean
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
          className={cn(
            'mb-2 p-3 border rounded-[2px] shadow-lg bg-white stats-widget-expand',
            isGallery ? 'border-amber-200' : 'border-blue-200'
          )}
        >
          <div className="space-y-2 text-xs font-heading">
            <div className="flex justify-between gap-6">
              <span className="text-[var(--color-muted)]">Skills installed</span>
              <span className={cn('font-bold', isGallery ? 'text-amber-700' : 'text-blue-700')}>
                {skillCount}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-[var(--color-muted)]">Demos completed</span>
              <span className={cn('font-bold', isGallery ? 'text-amber-700' : 'text-blue-700')}>
                {completedCount}/{availableCount}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-[var(--color-muted)]">Est. time saved</span>
              <span className={cn('font-bold', isGallery ? 'text-amber-700' : 'text-blue-700')}>
                {timeSavedLabel}
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className={cn(
          'px-3 py-1.5 text-xs font-heading font-semibold rounded-[2px] border shadow-md transition-all duration-200 bg-white',
          isGallery
            ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
            : 'border-blue-300 text-blue-700 hover:bg-blue-50'
        )}
      >
        {completedCount}/{availableCount} complete
      </button>
    </div>
  )
}

// Decorative background for Gallery world
function GalleryDecor() {
  return (
    <>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gray-200/15 rounded-full blur-3xl" />
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 C200,180 400,220 600,190 C800,160 1000,200 1000,200"
          fill="none"
          stroke="#B8860B"
          strokeWidth="1"
        />
        <path
          d="M0,500 C250,480 500,520 750,490 C900,470 1000,500 1000,500"
          fill="none"
          stroke="#B8860B"
          strokeWidth="1"
        />
        <path
          d="M0,800 C300,780 600,820 900,790 C950,785 1000,800 1000,800"
          fill="none"
          stroke="#B8860B"
          strokeWidth="1"
        />
      </svg>
    </>
  )
}

export interface GalleryMapProps {
  skin: SkinConfig
  showCelebration: boolean
  celebrationLevel: number
  onDismissCelebration: () => void
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}

export default function GalleryMap({
  skin,
  showCelebration,
  celebrationLevel,
  onDismissCelebration,
  statsExpanded,
  setStatsExpanded,
}: GalleryMapProps) {
  const router = useRouter()
  const { type, completed, skills, isLevelComplete, allAvailableComplete, totalTimeSaved, choiceScores } = useGame()

  if (!type) return null

  const levels = getLevels(type as PlayerType)
  const availableDemoCount = levels.filter(l => !l.comingSoon).reduce((sum, l) => sum + l.demos.length, 0)
  // Count only demos that belong to the current role (not stale IDs from other roles)
  const currentDemoIds = levels.filter(l => !l.comingSoon).flatMap(l => l.demos.map(d => d.id))
  const roleCompletedCount = currentDemoIds.filter(id => completed.has(id)).length

  // Find the recommended next demo (first uncompleted in first unlocked level)
  const recommendedNextId = (() => {
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i]
      if (level.comingSoon) continue
      const isLocked = i > 0 && !isLevelComplete(i)
      if (isLocked) continue
      for (const demo of level.demos) {
        if (!completed.has(demo.id)) return demo.id
      }
    }
    return null
  })()

  return (
    <div
      className={cn(
        'page-enter min-h-[calc(100vh-3.5rem)] flex flex-col',
        'skin-gallery'
      )}
    >
      <BadgeToast />
      <WorldUnlockToast />

      <div
        className="flex-1 relative overflow-hidden bg-[#FAFAF8]"
      >
        {/* GalleryDecor removed - clean flat background */}

        <div className="relative z-10 mx-auto px-4 sm:px-6 py-10 sm:py-14" style={{ maxWidth: 1200 }}>
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3 font-heading text-[var(--color-brand-orange)]">
              Your Demos
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.1] mb-2 font-heading text-[var(--color-ink)]">
              3 Levels. 9 Demos.
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              {isLevelComplete(1)
                ? 'Level 1 complete. Level 2 introduces skills.'
                : 'Complete each level to unlock the next. Start with Level 1.'}
            </p>
          </div>

          {/* BadgeTray removed - badges are out of place in new flow */}

          {/* Top "View Results" button removed - CTA is at the bottom now */}

          <div className="space-y-8 sm:space-y-12">
            {levels.map((level, levelIndex) => {
              const isLocked = level.comingSoon || (levelIndex > 0 && !isLevelComplete(levelIndex))
              const levelDoneCount = level.demos.filter((d) =>
                completed.has(d.id)
              ).length

              return (
                <div key={level.id} className="relative">
                  {levelIndex < levels.length - 1 && (
                    <div
                      className={cn(
                        'absolute left-1/2 -translate-x-1/2 w-[2px] -bottom-8 sm:-bottom-12 h-8 sm:h-12',
                        isLocked ? 'bg-gray-200' : 'bg-[var(--color-border)]'
                      )}
                    />
                  )}

                  <div
                    className={cn(
                      'relative rounded-[2px] overflow-hidden transition-all duration-500',
                      isLocked ? 'opacity-50' : 'opacity-100'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-between px-5 sm:px-6 py-3 border-b',
                        isLocked
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-white border-[var(--color-border)]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-heading',
                            isLocked
                              ? 'bg-gray-200 text-gray-400'
                              : 'bg-[var(--color-brand-orange)] text-white'
                          )}
                        >
                          {isLocked ? '\u{1F512}' : level.id}
                        </span>
                        <h2 className="text-base sm:text-lg font-bold font-heading text-[var(--color-ink)]">
                          {levelIndex === 0 && levelDoneCount === level.demos.length
                            ? 'Level 1 Complete'
                            : level.name}
                        </h2>
                        <span className="text-xs text-[var(--color-muted)] hidden sm:inline">
                          {level.subtitle}
                        </span>
                      </div>
                      {!isLocked && level.demos.length > 0 && (
                        <div className="text-right flex flex-col items-end gap-1.5">
                          <p
                            className={cn(
                              'text-sm font-bold font-heading',
                              levelDoneCount === level.demos.length
                                ? 'text-emerald-600'
                                : 'text-[var(--color-brand-orange)]'
                            )}
                          >
                            {levelDoneCount}/{level.demos.length}
                          </p>
                          <div className="w-20 h-1.5 bg-black/5 rounded-[1px] overflow-hidden">
                            <div
                              className={cn(
                                'h-full transition-all duration-700 ease-out',
                                levelDoneCount === level.demos.length
                                  ? 'bg-emerald-500'
                                  : 'bg-[var(--color-brand-orange)]'
                              )}
                              style={{
                                width: `${(levelDoneCount / level.demos.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {isLocked ? (
                      <div className="px-5 sm:px-6 py-8 text-center bg-gray-50">
                        <p className="text-sm font-heading font-semibold text-gray-400">
                          {skin.lockedNodeText(levelIndex)}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 sm:p-6 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {level.demos.map((demo, demoIndex) => {
                            const done = completed.has(demo.id)
                            return (
                              <DemoNode
                                key={demo.id}
                                demo={demo}
                                index={demoIndex}
                                done={done}
                                isGallery={true}
                                stars={choiceScores[demo.id] || 0}
                                isRecommended={demo.id === recommendedNextId}
                                onClick={() =>
                                  router.push(getDemoUrl(demo.id))
                                }
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {allAvailableComplete && (
            <div
              style={{
                marginTop: 48,
                padding: '40px 48px',
                background: '#0f172a',
                border: '2px solid #D64C00',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <h2
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 12,
                  lineHeight: 1.2,
                }}
              >
                You just saw what one person can do with AI.
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: '#94a3b8',
                  marginBottom: 32,
                  lineHeight: 1.6,
                }}
              >
                Imagine your whole team running skills like these every day. Ads to AI gives you the skills, the training, and a community of people building with AI.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => router.push('/victory')}
                  style={{
                    padding: '14px 32px',
                    fontSize: 16,
                    fontWeight: 700,
                    background: '#D64C00',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontFamily: '-apple-system, system-ui, sans-serif',
                  }}
                >
                  See Your Full Results
                </button>
                <a
                  href="https://ads2ai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '14px 32px',
                    fontSize: 16,
                    fontWeight: 700,
                    background: 'transparent',
                    color: '#fff',
                    border: '2px solid #475569',
                    borderRadius: 2,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontFamily: '-apple-system, system-ui, sans-serif',
                  }}
                >
                  Learn About Ads to AI
                </a>
              </div>
            </div>
          )}

          <div className="relative z-20 pb-4 pt-6 px-4 flex items-center justify-end">
            <StatsWidget
              isGallery={true}
              completedCount={roleCompletedCount}
              availableCount={availableDemoCount}
              skillCount={skills.size}
              timeSaved={totalTimeSaved}
              expanded={statsExpanded}
              onToggle={() => setStatsExpanded((p) => !p)}
            />
          </div>
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
