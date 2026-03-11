'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { BadgeTray, BadgeToast } from '@/components/badge-system'
import { getLevels, type PlayerType } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function LevelMap() {
  const router = useRouter()
  const { type, world, completed, skills, isLevelComplete, allAvailableComplete, totalTimeSaved } = useGame()
  const [showCelebration, setShowCelebration] = useState(false)
  const [statsExpanded, setStatsExpanded] = useState(false)

  // Detect when Level 1 just completed (show celebration once per session)
  useEffect(() => {
    if (
      isLevelComplete(1) &&
      typeof window !== 'undefined' &&
      !sessionStorage.getItem('level1-celebrated')
    ) {
      const timer = setTimeout(() => {
        setShowCelebration(true)
        sessionStorage.setItem('level1-celebrated', 'true')
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [isLevelComplete])

  if (!type || !world) {
    router.replace('/')
    return null
  }

  const levels = getLevels(type as PlayerType)
  const isGallery = world === 'gallery'
  const availableDemoCount = levels.filter(l => !l.comingSoon).reduce((sum, l) => sum + l.demos.length, 0)

  return (
    <div
      className={cn(
        'min-h-[calc(100vh-3.5rem)] flex flex-col',
        isGallery ? 'skin-gallery' : 'skin-arcade'
      )}
    >
      {/* Badge toast notifications */}
      <BadgeToast />

      {/* Map background */}
      <div
        className={cn(
          'flex-1 relative overflow-hidden',
          isGallery
            ? 'bg-gradient-to-b from-[#f8f0e3] via-[#faf6ef] to-[#f5ece0]'
            : 'bg-gradient-to-b from-[#e8f4ff] via-[#f0f8ff] to-[#e0f0ff]'
        )}
      >
        {/* Decorative background elements */}
        {isGallery ? <GalleryDecor /> : <ArcadeDecor />}

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <p
              className={cn(
                'text-xs font-semibold uppercase tracking-[0.25em] mb-3 font-heading',
                isGallery ? 'text-amber-700' : 'text-blue-600'
              )}
            >
              The Journey
            </p>
            <h1
              className={cn(
                'text-3xl sm:text-4xl font-extrabold leading-[1.1] mb-2 font-heading',
                isGallery ? 'text-amber-950' : 'text-slate-800'
              )}
            >
              3 Levels. 3 Demos.
            </h1>
            <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
              Complete each level to unlock the next. Start with Level 1.
            </p>
          </div>

          {/* Badge tray */}
          <BadgeTray isGallery={isGallery} />

          {/* Victory button when all available demos complete */}
          {allAvailableComplete && (
            <div className="text-center mb-8">
              <button
                onClick={() => router.push('/victory')}
                className={cn(
                  'px-6 py-3 font-heading font-bold text-sm rounded-[2px] transition-all duration-300 node-completed-glow',
                  isGallery
                    ? 'bg-amber-700 text-white hover:bg-amber-800'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                View Results
              </button>
            </div>
          )}

          {/* Levels */}
          <div className="space-y-8 sm:space-y-12">
            {levels.map((level, levelIndex) => {
              const isLocked = level.comingSoon
              const prevComplete =
                levelIndex === 0 || isLevelComplete(levelIndex)
              const levelDoneCount = level.demos.filter((d) =>
                completed.has(d.id)
              ).length

              return (
                <div key={level.id} className="relative">
                  {/* Connecting line between levels */}
                  {levelIndex < levels.length - 1 && (
                    <div
                      className={cn(
                        'absolute left-1/2 -translate-x-1/2 w-[2px] -bottom-8 sm:-bottom-12 h-8 sm:h-12',
                        isGallery
                          ? isLocked
                            ? 'bg-amber-200/50'
                            : 'bg-amber-400/60'
                          : isLocked
                            ? 'bg-blue-200/50'
                            : 'bg-blue-400/60'
                      )}
                    />
                  )}

                  {/* Level card */}
                  <div
                    className={cn(
                      'relative rounded-[2px] overflow-hidden transition-all duration-500',
                      isLocked
                        ? 'opacity-50'
                        : 'opacity-100'
                    )}
                  >
                    {/* Level header */}
                    <div
                      className={cn(
                        'flex items-center justify-between px-5 sm:px-6 py-4',
                        isGallery
                          ? isLocked
                            ? 'bg-amber-100/40'
                            : 'bg-gradient-to-r from-amber-100/80 to-amber-50/40'
                          : isLocked
                            ? 'bg-blue-100/40'
                            : 'bg-gradient-to-r from-blue-100/80 to-blue-50/40',
                        'border-b',
                        isGallery
                          ? 'border-amber-200/60'
                          : 'border-blue-200/60'
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold font-heading',
                              isGallery
                                ? isLocked
                                  ? 'bg-amber-200/50 text-amber-400'
                                  : 'bg-amber-600 text-white'
                                : isLocked
                                  ? 'bg-blue-200/50 text-blue-400'
                                  : 'bg-blue-600 text-white'
                            )}
                          >
                            {isLocked ? '\u{1F512}' : level.id}
                          </span>
                          <div>
                            <h2
                              className={cn(
                                'text-lg sm:text-xl font-bold font-heading',
                                isGallery
                                  ? 'text-amber-950'
                                  : 'text-slate-800'
                              )}
                            >
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
                                : isGallery
                                  ? 'text-amber-700'
                                  : 'text-blue-700'
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
                                  : isGallery
                                    ? 'bg-amber-500'
                                    : 'bg-blue-500'
                              )}
                              style={{
                                width: `${(levelDoneCount / level.demos.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Demo nodes */}
                    {isLocked ? (
                      <div
                        className={cn(
                          'px-5 sm:px-6 py-10 text-center relative overflow-hidden',
                          isGallery
                            ? 'bg-gradient-to-r from-amber-50/20 via-amber-100/30 to-amber-50/20'
                            : 'bg-gradient-to-r from-blue-50/20 via-blue-100/30 to-blue-50/20'
                        )}
                      >
                        {/* Mystery silhouette nodes */}
                        <div className="flex justify-center gap-6 mb-4">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className={cn(
                                'w-20 h-14 rounded-[2px] border-2 border-dashed',
                                isGallery
                                  ? 'border-amber-200/60 bg-amber-100/20'
                                  : 'border-blue-200/60 bg-blue-100/20'
                              )}
                            >
                              <div className="flex items-center justify-center h-full">
                                <span className="text-xl opacity-30">?</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p
                          className={cn(
                            'text-sm font-heading font-semibold',
                            isGallery
                              ? 'text-amber-500'
                              : 'text-blue-500'
                          )}
                        >
                          {levelIndex === 1
                            ? 'Complete Level 1 to unlock'
                            : 'Complete Level 2 to unlock'}
                        </p>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          'p-4 sm:p-6',
                          isGallery ? 'bg-white/60' : 'bg-white/70'
                        )}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {level.demos.map((demo, demoIndex) => {
                            const done = completed.has(demo.id)
                            return (
                              <DemoNode
                                key={demo.id}
                                demo={demo}
                                index={demoIndex}
                                done={done}
                                isGallery={isGallery}
                                onClick={() =>
                                  router.push(`/play/${demo.id}`)
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

          {/* Bottom navigation */}
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              onClick={() => router.push('/world')}
              className="text-xs text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors font-heading"
            >
              &#8592; Change world
            </button>
            <button
              onClick={() => router.push('/')}
              className="text-xs text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors font-heading"
            >
              Start over
            </button>
          </div>
        </div>

        {/* Floating stats widget */}
        <StatsWidget
          isGallery={isGallery}
          completedCount={completed.size}
          availableCount={availableDemoCount}
          skillCount={skills.size}
          timeSaved={totalTimeSaved}
          expanded={statsExpanded}
          onToggle={() => setStatsExpanded((p) => !p)}
        />
      </div>

      {/* Level Complete celebration overlay */}
      {showCelebration && (
        <LevelCelebration
          isGallery={isGallery}
          onDismiss={() => setShowCelebration(false)}
        />
      )}
    </div>
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
      {/* Expanded panel */}
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

      {/* Collapsed pill */}
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

// Demo node card within a level
function DemoNode({
  demo,
  index,
  done,
  isGallery,
  onClick,
}: {
  demo: { id: number; icon: string; title: string; subtitle: string }
  index: number
  done: boolean
  isGallery: boolean
  onClick: () => void
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
      {/* Node number */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{demo.icon}</span>
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

      {/* Title */}
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

      {/* Hover arrow */}
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

// Level complete celebration overlay
function LevelCelebration({
  isGallery,
  onDismiss,
}: {
  isGallery: boolean
  onDismiss: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const victoryImage = isGallery
    ? '/images/victory/gallery-victory.png'
    : '/images/victory/arcade-victory.png'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center celebration-overlay cursor-pointer"
      onClick={onDismiss}
      style={{
        backgroundColor: isGallery
          ? 'rgba(120, 80, 20, 0.6)'
          : 'rgba(20, 50, 120, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex flex-col items-center gap-6 px-6">
        <div className="w-48 h-48 sm:w-56 sm:h-56 relative celebration-image">
          <Image
            src={victoryImage}
            alt="Level Complete"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
        <div className="text-center celebration-text">
          <h2
            className={cn(
              'text-3xl sm:text-4xl font-extrabold font-heading mb-2 celebration-shimmer-text',
              isGallery ? 'text-amber-300' : 'text-blue-300'
            )}
          >
            Level 1 Complete!
          </h2>
          <p className="text-white/80 text-sm font-heading">
            All demos finished. Well done.
          </p>
        </div>
        <p className="text-white/40 text-xs mt-4 font-heading">
          Click anywhere to continue
        </p>
      </div>
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

// Decorative background for Arcade world
function ArcadeDecor() {
  return (
    <>
      <div className="absolute top-10 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl" />
      <div className="absolute top-1/3 left-10 w-32 h-32 bg-green-200/25 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-1/3 w-48 h-48 bg-yellow-200/20 rounded-full blur-2xl" />
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <pattern
          id="dots"
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2.5" cy="2.5" r="0.8" fill="#3B82F6" />
        </pattern>
        <rect width="100" height="100" fill="url(#dots)" />
      </svg>
      <div className="absolute top-20 left-[15%] w-24 h-8 bg-white/40 rounded-full blur-sm cloud-float" />
      <div
        className="absolute top-32 right-[20%] w-32 h-10 bg-white/30 rounded-full blur-sm cloud-float"
        style={{ animationDelay: '3s' }}
      />
      <div
        className="absolute top-16 left-[60%] w-20 h-6 bg-white/35 rounded-full blur-sm cloud-float"
        style={{ animationDelay: '7s' }}
      />
    </>
  )
}
