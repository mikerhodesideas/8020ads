'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { BadgeTray, BadgeToast } from '@/components/badge-system'
import { getLevels, type PlayerType } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'
import { useTransition } from '@/components/transition-overlay'
import Image from 'next/image'

export default function LevelMap() {
  const router = useRouter()
  const { navigateWithTransition } = useTransition()
  const { type, world, completed, skills, isLevelComplete, allAvailableComplete, totalTimeSaved, choiceScores } = useGame()
  const [showCelebration, setShowCelebration] = useState(false)
  const [statsExpanded, setStatsExpanded] = useState(false)

  const [celebrationLevel, setCelebrationLevel] = useState(0)

  // Detect when a level just completed (show celebration once per session)
  useEffect(() => {
    if (typeof window === 'undefined') return
    for (const lvl of [1, 2, 3]) {
      if (
        isLevelComplete(lvl) &&
        !sessionStorage.getItem(`level${lvl}-celebrated`)
      ) {
        const timer = setTimeout(() => {
          setCelebrationLevel(lvl)
          setShowCelebration(true)
          sessionStorage.setItem(`level${lvl}-celebrated`, 'true')
        }, 600)
        return () => clearTimeout(timer)
      }
    }
  }, [isLevelComplete])

  if (!type || !world) {
    router.replace('/')
    return null
  }

  const levels = getLevels(type as PlayerType)
  const isGallery = world === 'gallery'
  const availableDemoCount = levels.filter(l => !l.comingSoon).reduce((sum, l) => sum + l.demos.length, 0)

  // For arcade world, render Mario-style overworld
  if (!isGallery) {
    return (
      <div className="page-enter min-h-[calc(100vh-3.5rem)] flex flex-col skin-arcade arcade-scanlines">
        <BadgeToast />
        <MarioLevelMap
          levels={levels}
          completed={completed}
          skills={skills}
          isLevelComplete={isLevelComplete}
          allAvailableComplete={allAvailableComplete}
          availableDemoCount={availableDemoCount}
          totalTimeSaved={totalTimeSaved}
          router={router}
          navigateWithTransition={navigateWithTransition}
          choiceScores={choiceScores}
          statsExpanded={statsExpanded}
          setStatsExpanded={setStatsExpanded}
        />
        {showCelebration && (
          <LevelCelebration
            levelNumber={celebrationLevel}
            isGallery={false}
            onDismiss={() => setShowCelebration(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'page-enter min-h-[calc(100vh-3.5rem)] flex flex-col',
        'skin-gallery'
      )}
    >
      {/* Badge toast notifications */}
      <BadgeToast />

      {/* Map background */}
      <div
        className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#f8f0e3] via-[#faf6ef] to-[#f5ece0]"
      >
        {/* Decorative background elements */}
        <GalleryDecor />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Header */}
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

          {/* Badge tray */}
          <BadgeTray isGallery={true} />

          {/* Victory button when all available demos complete */}
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

          {/* Levels */}
          <div className="space-y-8 sm:space-y-12">
            {levels.map((level, levelIndex) => {
              const isLocked = level.comingSoon || (levelIndex > 0 && !isLevelComplete(levelIndex))
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
                        isLocked ? 'bg-amber-200/50' : 'bg-amber-400/60'
                      )}
                    />
                  )}

                  {/* Level card */}
                  <div
                    className={cn(
                      'relative rounded-[2px] overflow-hidden transition-all duration-500',
                      isLocked ? 'opacity-50' : 'opacity-100'
                    )}
                  >
                    {/* Level header */}
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

                    {/* Demo nodes */}
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
                          {levelIndex === 1
                            ? 'Complete Level 1 to unlock'
                            : 'Complete Level 2 to unlock'}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 sm:p-6 bg-white/60">
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
          isGallery={true}
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
          levelNumber={celebrationLevel}
          isGallery={true}
          onDismiss={() => setShowCelebration(false)}
        />
      )}
    </div>
  )
}

// ============ MARIO LEVEL MAP ============

// Node positions for the Mario overworld map (in viewBox 0 0 1000 700)
const MARIO_NODES = [
  // Level 1 (bottom tier, left to right)
  { x: 150, y: 530, level: 1 },
  { x: 420, y: 500, level: 1 },
  { x: 690, y: 530, level: 1 },
  // Level 2 (middle tier, right to left)
  { x: 730, y: 310, level: 2 },
  { x: 480, y: 280, level: 2 },
  { x: 230, y: 310, level: 2 },
  // Level 3 (top tier, left to right)
  { x: 200, y: 120, level: 3 },
  { x: 470, y: 90, level: 3 },
  { x: 740, y: 60, level: 3 },
]

// Pipe positions (between level tiers)
const MARIO_PIPES = [
  { x: 820, y: 400, connects: [1, 2] },
  { x: 120, y: 200, connects: [2, 3] },
]

function MarioLevelMap({
  levels,
  completed,
  skills,
  isLevelComplete,
  allAvailableComplete,
  availableDemoCount,
  totalTimeSaved,
  router,
  navigateWithTransition,
  choiceScores,
  statsExpanded,
  setStatsExpanded,
}: {
  levels: ReturnType<typeof getLevels>
  completed: Set<number>
  skills: Set<string>
  isLevelComplete: (level: number) => boolean
  allAvailableComplete: boolean
  availableDemoCount: number
  totalTimeSaved: number
  router: ReturnType<typeof useRouter>
  navigateWithTransition: (path: string) => void
  choiceScores: Record<number, number>
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}) {
  // Flatten all demos in order
  const allDemos = levels.flatMap((l) => l.demos)

  // Detect newly completed nodes for burst animation
  const [burstNodes, setBurstNodes] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prevKey = 'arcade-prev-completed'
    const prev = new Set<number>(JSON.parse(sessionStorage.getItem(prevKey) || '[]'))
    const newlyDone = new Set<number>()
    completed.forEach((id) => {
      if (!prev.has(id)) newlyDone.add(id)
    })
    if (newlyDone.size > 0) {
      setBurstNodes(newlyDone)
      const timer = setTimeout(() => setBurstNodes(new Set()), 800)
      sessionStorage.setItem(prevKey, JSON.stringify(Array.from(completed)))
      return () => clearTimeout(timer)
    }
    sessionStorage.setItem(prevKey, JSON.stringify(Array.from(completed)))
  }, [completed])

  // Find last completed node index for player indicator
  let playerNodeIdx = -1
  for (let i = MARIO_NODES.length - 1; i >= 0; i--) {
    if (allDemos[i] && completed.has(allDemos[i].id)) {
      playerNodeIdx = i
      break
    }
  }

  // Find the first uncompleted node (current target)
  let currentNodeIdx = -1
  for (let i = 0; i < MARIO_NODES.length; i++) {
    if (allDemos[i] && !completed.has(allDemos[i].id)) {
      const levelIdx = Math.floor(i / 3)
      const isLocked = levelIdx > 0 && !isLevelComplete(levelIdx)
      if (!isLocked) {
        currentNodeIdx = i
        break
      }
    }
  }

  const handleNodeClick = (nodeIdx: number) => {
    const demo = allDemos[nodeIdx]
    if (!demo) return
    const levelIdx = Math.floor(nodeIdx / 3)
    const isLocked = levelIdx > 0 && !isLevelComplete(levelIdx)
    if (isLocked) return
    navigateWithTransition(`/play/${demo.id}`)
  }

  // Build path segments between consecutive nodes
  const pathSegments: { x1: number; y1: number; x2: number; y2: number; completed: boolean; idx: number }[] = []
  for (let i = 0; i < MARIO_NODES.length - 1; i++) {
    const a = MARIO_NODES[i]
    const b = MARIO_NODES[i + 1]
    const segCompleted = allDemos[i] ? completed.has(allDemos[i].id) : false
    pathSegments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, completed: segCompleted, idx: i })
  }

  return (
    <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--mario-sky)' }}>
      {/* SVG Overworld Map */}
      <svg
        viewBox="0 0 1000 700"
        className="w-full h-auto max-h-[calc(100vh-3.5rem)]"
        preserveAspectRatio="xMidYMid meet"
        style={{ minHeight: '500px' }}
      >
        {/* Sky is the background color */}

        {/* Clouds - parallax layers (near=fast, far=slow) */}
        <g className="cloud-float">
          <ellipse cx="180" cy="50" rx="60" ry="25" fill="white" opacity="0.85" />
          <ellipse cx="210" cy="40" rx="40" ry="20" fill="white" opacity="0.85" />
          <ellipse cx="150" cy="42" rx="35" ry="18" fill="white" opacity="0.85" />
        </g>
        <g className="cloud-float-mid" style={{ animationDelay: '3s' }}>
          <ellipse cx="650" cy="35" rx="50" ry="22" fill="white" opacity="0.65" />
          <ellipse cx="680" cy="25" rx="35" ry="18" fill="white" opacity="0.65" />
          <ellipse cx="625" cy="28" rx="30" ry="15" fill="white" opacity="0.65" />
        </g>
        <g className="cloud-float-far" style={{ animationDelay: '6s' }}>
          <ellipse cx="880" cy="100" rx="45" ry="20" fill="white" opacity="0.5" />
          <ellipse cx="905" cy="92" rx="30" ry="15" fill="white" opacity="0.5" />
        </g>
        <g className="cloud-float-far" style={{ animationDelay: '12s' }}>
          <ellipse cx="400" cy="15" rx="38" ry="16" fill="white" opacity="0.45" />
          <ellipse cx="425" cy="8" rx="25" ry="12" fill="white" opacity="0.45" />
        </g>

        {/* Hills */}
        <ellipse cx="200" cy="650" rx="200" ry="100" fill="#2D8B2D" opacity="0.5" />
        <ellipse cx="600" cy="670" rx="250" ry="80" fill="#3DA33D" opacity="0.4" />
        <ellipse cx="900" cy="660" rx="180" ry="90" fill="#2D8B2D" opacity="0.45" />

        {/* Ground strip */}
        <rect x="0" y="620" width="1000" height="80" fill="var(--mario-ground)" />
        <rect x="0" y="620" width="1000" height="8" fill="#E8A000" />

        {/* World labels */}
        <text x="420" y="590" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="var(--font-oxanium), sans-serif" stroke="var(--mario-dark)" strokeWidth="3" paintOrder="stroke">
          WORLD 1
        </text>
        <text x="480" y="350" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="var(--font-oxanium), sans-serif" stroke="var(--mario-dark)" strokeWidth="3" paintOrder="stroke">
          WORLD 2
        </text>
        <text x="470" y="155" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="var(--font-oxanium), sans-serif" stroke="var(--mario-dark)" strokeWidth="3" paintOrder="stroke">
          WORLD 3
        </text>

        {/* Path segments */}
        {pathSegments.map((seg) => {
          const segLen = Math.sqrt((seg.x2 - seg.x1) ** 2 + (seg.y2 - seg.y1) ** 2)
          return (
            <line
              key={seg.idx}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={seg.completed ? 'var(--mario-coin)' : '#ffffff40'}
              strokeWidth={seg.completed ? 5 : 3}
              strokeDasharray={seg.completed ? segLen : '12 8'}
              strokeLinecap="round"
              className={seg.completed ? 'path-segment-completed' : ''}
              style={seg.completed ? { '--seg-len': segLen } as React.CSSProperties : undefined}
            />
          )
        })}

        {/* Pipes between levels */}
        {MARIO_PIPES.map((pipe, i) => {
          const isOpen = pipe.connects[0] === 1 ? isLevelComplete(1) : isLevelComplete(2)
          return (
            <g key={i}>
              {/* Pipe body */}
              <rect
                x={pipe.x - 22}
                y={pipe.y - 20}
                width={44}
                height={60}
                fill={isOpen ? 'var(--mario-pipe)' : '#666'}
                stroke={isOpen ? '#006400' : '#444'}
                strokeWidth={3}
              />
              {/* Pipe rim */}
              <rect
                x={pipe.x - 28}
                y={pipe.y - 28}
                width={56}
                height={16}
                fill={isOpen ? 'var(--mario-pipe)' : '#666'}
                stroke={isOpen ? '#006400' : '#444'}
                strokeWidth={3}
              />
              {/* Open indicator */}
              {isOpen && (
                <>
                  <text x={pipe.x} y={pipe.y + 18} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                    {'\u25BC'}
                  </text>
                  {/* Steam particles */}
                  {[0, 1, 2, 3, 4].map((p) => (
                    <circle
                      key={p}
                      cx={pipe.x - 8 + p * 4}
                      cy={pipe.y - 32}
                      r={2}
                      fill="white"
                      opacity={0}
                    >
                      <animate
                        attributeName="cy"
                        values={`${pipe.y - 32};${pipe.y - 60}`}
                        dur="2.5s"
                        begin={`${p * 0.5}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.5;0"
                        dur="2.5s"
                        begin={`${p * 0.5}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="r"
                        values="2;1"
                        dur="2.5s"
                        begin={`${p * 0.5}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </>
              )}
            </g>
          )
        })}

        {/* Inter-level narrative text (appears when level completed) */}
        {isLevelComplete(1) && (
          <text
            x={MARIO_PIPES[0].x}
            y={MARIO_PIPES[0].y - 50}
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="900"
            fontFamily="var(--font-oxanium), sans-serif"
            stroke="var(--mario-dark)"
            strokeWidth="4"
            paintOrder="stroke"
          >
            THINGS GET REAL
          </text>
        )}
        {isLevelComplete(2) && (
          <text
            x={MARIO_PIPES[1].x}
            y={MARIO_PIPES[1].y - 50}
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="900"
            fontFamily="var(--font-oxanium), sans-serif"
            stroke="var(--mario-dark)"
            strokeWidth="4"
            paintOrder="stroke"
          >
            NO TRAINING WHEELS
          </text>
        )}

        {/* Nodes */}
        {MARIO_NODES.map((node, i) => {
          const demo = allDemos[i]
          if (!demo) return null
          const done = completed.has(demo.id)
          const levelIdx = Math.floor(i / 3)
          const isLocked = levelIdx > 0 && !isLevelComplete(levelIdx)
          const isCurrent = i === currentNodeIdx
          const radius = isCurrent ? 30 : 26

          return (
            <g
              key={i}
              onClick={() => handleNodeClick(i)}
              style={{ cursor: isLocked ? 'default' : 'pointer' }}
              className={cn(
                isCurrent ? 'character-bounce' : '',
                !done && !isLocked ? 'qblock-bob' : ''
              )}
            >
              {/* Glow for current node */}
              {isCurrent && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={38}
                  fill="none"
                  stroke="var(--mario-coin)"
                  strokeWidth={2}
                  opacity={0.6}
                >
                  <animate attributeName="r" values="34;40;34" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={
                  done ? 'var(--mario-coin)'
                  : isLocked ? '#666'
                  : 'var(--mario-block)'
                }
                stroke={
                  done ? '#B8860B'
                  : isLocked ? '#444'
                  : '#C07800'
                }
                strokeWidth={3}
              />

              {/* Burst ring for newly completed nodes */}
              {burstNodes.has(demo.id) && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={26}
                  fill="none"
                  stroke="var(--mario-coin)"
                  strokeWidth={3}
                  className="node-burst-ring"
                />
              )}

              {/* Node content */}
              {done ? (
                // Star for completed
                <text x={node.x} y={node.y + 7} textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">
                  {'\u2605'}
                </text>
              ) : isLocked ? (
                // Lock
                <text x={node.x} y={node.y + 6} textAnchor="middle" fill="#999" fontSize="18">
                  {'\u{1F512}'}
                </text>
              ) : (
                // Question mark for available
                <text x={node.x} y={node.y + 9} textAnchor="middle" fill="white" fontSize="24" fontWeight="900" fontFamily="var(--font-oxanium), sans-serif" className="qmark-shimmer">
                  ?
                </text>
              )}

              {/* Demo title label (below node) */}
              {!isLocked && (
                <text
                  x={node.x}
                  y={node.y + radius + 18}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="var(--font-oxanium), sans-serif"
                  stroke="var(--mario-dark)"
                  strokeWidth={2}
                  paintOrder="stroke"
                >
                  {demo.title.length > 22 ? demo.title.slice(0, 20) + '...' : demo.title}
                </text>
              )}

              {/* Star rating (below title, for completed nodes) */}
              {done && choiceScores[demo.id] && (
                <text
                  x={node.x}
                  y={node.y + radius + 32}
                  textAnchor="middle"
                  fill="var(--mario-coin)"
                  fontSize="12"
                  fontFamily="var(--font-oxanium), sans-serif"
                >
                  {Array.from({ length: 3 }, (_, s) =>
                    s < choiceScores[demo.id] ? '\u2605' : '\u2606'
                  ).join('')}
                </text>
              )}
            </g>
          )
        })}

        {/* Player indicator on last completed node */}
        {playerNodeIdx >= 0 && (
          <g className="character-bounce">
            <circle
              cx={MARIO_NODES[playerNodeIdx].x}
              cy={MARIO_NODES[playerNodeIdx].y - 38}
              r={10}
              fill="#FF0000"
              stroke="white"
              strokeWidth={2}
            />
            <text
              x={MARIO_NODES[playerNodeIdx].x}
              y={MARIO_NODES[playerNodeIdx].y - 34}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontWeight="bold"
            >
              M
            </text>
          </g>
        )}

        {/* Castle at the end */}
        <g>
          {/* Castle body */}
          <rect x={MARIO_NODES[8].x - 5} y={MARIO_NODES[8].y - 65} width={50} height={40} fill="#C84C0C" stroke="#8B3300" strokeWidth={2} />
          {/* Castle tower */}
          <rect x={MARIO_NODES[8].x + 10} y={MARIO_NODES[8].y - 82} width={20} height={20} fill="#C84C0C" stroke="#8B3300" strokeWidth={2} />
          {/* Castle flag */}
          <line x1={MARIO_NODES[8].x + 20} y1={MARIO_NODES[8].y - 82} x2={MARIO_NODES[8].x + 20} y2={MARIO_NODES[8].y - 100} stroke="white" strokeWidth={2} />
          <polygon
            points={`${MARIO_NODES[8].x + 20},${MARIO_NODES[8].y - 100} ${MARIO_NODES[8].x + 35},${MARIO_NODES[8].y - 94} ${MARIO_NODES[8].x + 20},${MARIO_NODES[8].y - 88}`}
            fill={allAvailableComplete ? 'var(--mario-coin)' : '#FF0000'}
          />
          {/* Castle door */}
          <rect x={MARIO_NODES[8].x + 14} y={MARIO_NODES[8].y - 40} width={12} height={16} fill="#1a1a2e" rx={6} />
          {/* Battlements */}
          {[0, 12, 24, 36].map((dx) => (
            <rect key={dx} x={MARIO_NODES[8].x - 5 + dx} y={MARIO_NODES[8].y - 72} width={8} height={8} fill="#C84C0C" stroke="#8B3300" strokeWidth={1} />
          ))}
        </g>
      </svg>

      {/* Overlay UI elements */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-6 pt-4 sm:pt-6">
        {/* Badge tray */}
        <div className="max-w-5xl mx-auto">
          <BadgeTray isGallery={false} />
        </div>

        {/* Victory button */}
        {allAvailableComplete && (
          <div className="text-center mt-2">
            <button
              onClick={() => {
                playSound('fanfare')
                router.push('/victory')
              }}
              className="px-6 py-3 font-heading font-bold text-sm transition-all duration-300 node-completed-glow text-white"
              style={{ background: 'var(--mario-pipe)', border: '3px solid #006400' }}
            >
              VIEW RESULTS
            </button>
          </div>
        )}
      </div>

      {/* Bottom navigation (above ground strip) */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-12 flex items-center justify-center gap-6">
        <button
          onClick={() => router.push('/world')}
          className="text-xs text-white/60 hover:text-white transition-colors font-heading"
        >
          &#8592; Change world
        </button>
        <button
          onClick={() => router.push('/')}
          className="text-xs text-white/60 hover:text-white transition-colors font-heading"
        >
          Start over
        </button>
      </div>

      {/* Floating stats widget */}
      <div className="absolute bottom-0 right-0 z-20">
        <MarioStatsWidget
          completedCount={completed.size}
          availableCount={availableDemoCount}
          skillCount={skills.size}
          timeSaved={totalTimeSaved}
          expanded={statsExpanded}
          onToggle={() => setStatsExpanded((p: boolean) => !p)}
        />
      </div>
    </div>
  )
}

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
  stars,
  onClick,
}: {
  demo: { id: number; icon: string; title: string; subtitle: string }
  index: number
  done: boolean
  isGallery: boolean
  stars: number
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

      {/* Star rating */}
      {done && stars > 0 && (
        <div className="mt-2 text-sm tracking-wider">
          {Array.from({ length: 3 }, (_, s) => (
            <span key={s} className={s < stars ? 'text-amber-500' : 'text-gray-300'}>
              {s < stars ? '\u2605' : '\u2606'}
            </span>
          ))}
        </div>
      )}

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
  levelNumber,
  isGallery,
  onDismiss,
}: {
  levelNumber: number
  isGallery: boolean
  onDismiss: () => void
}) {
  useEffect(() => {
    if (!isGallery) playSound('oneUp')
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss, isGallery])

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
          : 'rgba(26, 26, 46, 0.85)',
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
              isGallery ? 'text-amber-300' : ''
            )}
            style={!isGallery ? { color: 'var(--mario-coin)' } : undefined}
          >
            {isGallery ? `Level ${levelNumber} Complete!` : `WORLD ${levelNumber} CLEAR!`}
          </h2>
          <p className="text-white/80 text-sm font-heading">
            {isGallery ? 'All demos finished. Well done.' : 'All stages cleared. Let\'s-a go!'}
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
