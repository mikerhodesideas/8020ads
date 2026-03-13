'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useGame } from '@/components/game-provider'
import { BadgeTray, BadgeToast } from '@/components/badge-system'
import { getLevels, type PlayerType, type DemoType } from '@/lib/game-data'
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
}: {
  demo: { id: number; icon: string; demoType: DemoType; title: string; subtitle: string }
  index: number
  done: boolean
  isGallery: boolean
  stars: number
  onClick: () => void
  iconImage?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative text-left p-5 rounded-[2px] transition-all duration-300 group',
        'border focus:outline-none node-entrance',
        done
          ? 'bg-emerald-50 border-emerald-300 node-completed-glow'
          : isGallery
            ? 'bg-white border-amber-200/80 hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 hover:shadow-amber-200/40'
            : 'bg-white border-blue-200/80 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 hover:shadow-blue-200/40',
        'cursor-pointer'
      )}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {iconImage ? (
            <Image src={iconImage} alt="" width={28} height={28} className="object-contain" />
          ) : (
            <span className="text-2xl leading-none">{demo.icon}</span>
          )}
          <span
            className={cn(
              'inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold font-heading',
              done
                ? 'bg-emerald-500 text-white'
                : isGallery
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-blue-100 text-blue-700'
            )}
          >
            {done ? '\u2713' : index + 1}
          </span>
        </div>
        {done && (
          <span className="text-emerald-500 text-lg demo-complete-pulse">
            &#10003;
          </span>
        )}
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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-300/15 rounded-full blur-3xl" />
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

  return (
    <div
      className={cn(
        'page-enter min-h-[calc(100vh-3.5rem)] flex flex-col',
        'skin-gallery'
      )}
    >
      <BadgeToast />

      <div
        className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#f8f0e3] via-[#faf6ef] to-[#f5ece0]"
      >
        <GalleryDecor />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3 font-heading text-amber-700">
              The Journey
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.1] mb-2 font-heading text-amber-950">
              3 Levels. 3 Demos.
            </h1>
            <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
              Complete each level to unlock the next. Start with Level 1.
            </p>
          </div>

          <BadgeTray />

          {allAvailableComplete && (
            <div className="text-center mb-8">
              <button
                onClick={() => router.push('/victory')}
                className="px-6 py-3 font-heading font-bold text-sm rounded-[2px] transition-all duration-300 node-completed-glow bg-amber-700 text-white hover:bg-amber-800"
              >
                View Results
              </button>
            </div>
          )}

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
                        isLocked ? 'bg-amber-200/50' : 'bg-amber-400/60'
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
                        'flex items-center justify-between px-5 sm:px-6 py-4 border-b border-amber-200/60',
                        isLocked
                          ? 'bg-amber-100/40'
                          : 'bg-gradient-to-r from-amber-100/80 to-amber-50/40'
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold font-heading',
                              isLocked
                                ? 'bg-amber-200/50 text-amber-400'
                                : 'bg-amber-600 text-white'
                            )}
                          >
                            {isLocked ? '\u{1F512}' : level.id}
                          </span>
                          <div>
                            <h2 className="text-lg sm:text-xl font-bold font-heading text-amber-950">
                              {level.name}
                            </h2>
                            <p className="text-xs text-[var(--color-muted)]">
                              {level.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                      {!isLocked && level.demos.length > 0 && (
                        <div className="text-right flex flex-col items-end gap-1.5">
                          <p
                            className={cn(
                              'text-sm font-bold font-heading',
                              levelDoneCount === level.demos.length
                                ? 'text-emerald-600'
                                : 'text-amber-700'
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
                                  : 'bg-amber-500'
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
                      <div className="px-5 sm:px-6 py-10 text-center relative overflow-hidden bg-gradient-to-r from-amber-50/20 via-amber-100/30 to-amber-50/20">
                        <div className="flex justify-center gap-6 mb-4">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-20 h-14 rounded-[2px] border-2 border-dashed border-amber-200/60 bg-amber-100/20"
                            >
                              <div className="flex items-center justify-center h-full">
                                <span className="text-xl opacity-30">?</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm font-heading font-semibold text-amber-500">
                          {skin.lockedNodeText(levelIndex)}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 sm:p-6 bg-white/60">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {level.demos.map((demo, demoIndex) => {
                            const done = completed.has(demo.id)
                            const iconImage = skin.demoIcons?.[demo.demoType]
                            return (
                              <DemoNode
                                key={demo.id}
                                demo={demo}
                                index={demoIndex}
                                done={done}
                                isGallery={true}
                                stars={choiceScores[demo.id] || 0}
                                onClick={() =>
                                  router.push(`/play/${demo.id}`)
                                }
                                iconImage={iconImage}
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

          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              onClick={() => router.push('/')}
              className="text-xs text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors font-heading"
            >
              Start over
            </button>
          </div>
        </div>

        <StatsWidget
          isGallery={true}
          completedCount={completed.size}
          availableCount={availableDemoCount}
          skillCount={skills.size}
          timeSaved={totalTimeSaved}
          expanded={statsExpanded}
          onToggle={() => setStatsExpanded((p) => !p)}
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
