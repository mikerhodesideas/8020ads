'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { BadgeTray, BadgeToast } from '@/components/badge-system'
import { getLevels, type PlayerType } from '@/lib/game-data'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'
import { useTransition } from '@/components/transition-overlay'
import type { SkinConfig } from '@/lib/skin-config'
import { LevelCelebration } from './shared'

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
    <div className="page-enter min-h-[calc(100vh-3.5rem)] flex flex-col skin-arcade arcade-scanlines">
      <BadgeToast />

      <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--mario-sky)' }}>
        {/* SVG Overworld Map */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-auto max-h-[calc(100vh-3.5rem)]"
          preserveAspectRatio="xMidYMid meet"
          style={{ minHeight: '500px' }}
        >
          {/* Clouds */}
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
                <rect
                  x={pipe.x - 22}
                  y={pipe.y - 20}
                  width={44}
                  height={60}
                  fill={isOpen ? 'var(--mario-pipe)' : '#666'}
                  stroke={isOpen ? '#006400' : '#444'}
                  strokeWidth={3}
                />
                <rect
                  x={pipe.x - 28}
                  y={pipe.y - 28}
                  width={56}
                  height={16}
                  fill={isOpen ? 'var(--mario-pipe)' : '#666'}
                  stroke={isOpen ? '#006400' : '#444'}
                  strokeWidth={3}
                />
                {isOpen && (
                  <>
                    <text x={pipe.x} y={pipe.y + 18} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                      {'\u25BC'}
                    </text>
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

          {/* Inter-level narrative text */}
          {isLevelComplete(1) && (
            <text
              x={500}
              y={418}
              textAnchor="middle"
              fill="var(--mario-coin)"
              fontSize="13"
              fontWeight="900"
              fontFamily="var(--font-oxanium), sans-serif"
              stroke="var(--mario-dark)"
              strokeWidth="4"
              paintOrder="stroke"
              opacity="0.7"
            >
              {'>> THINGS GET REAL >>'}
            </text>
          )}
          {isLevelComplete(2) && (
            <text
              x={500}
              y={200}
              textAnchor="middle"
              fill="var(--mario-coin)"
              fontSize="13"
              fontWeight="900"
              fontFamily="var(--font-oxanium), sans-serif"
              stroke="var(--mario-dark)"
              strokeWidth="4"
              paintOrder="stroke"
              opacity="0.7"
            >
              {'>> NO TRAINING WHEELS >>'}
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

                {done ? (
                  <text x={node.x} y={node.y + 7} textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">
                    {'\u2605'}
                  </text>
                ) : isLocked ? (
                  <text x={node.x} y={node.y + 6} textAnchor="middle" fill="#999" fontSize="18">
                    {'\u{1F512}'}
                  </text>
                ) : (
                  <text x={node.x} y={node.y + 9} textAnchor="middle" fill="white" fontSize="24" fontWeight="900" fontFamily="var(--font-oxanium), sans-serif" className="qmark-shimmer">
                    ?
                  </text>
                )}

                {!isLocked && (() => {
                  const title = demo.title
                  const maxLen = 20
                  let line1 = title
                  let line2 = ''
                  if (title.length > maxLen) {
                    const sp = title.lastIndexOf(' ', maxLen)
                    if (sp > 8) {
                      line1 = title.slice(0, sp)
                      line2 = title.slice(sp + 1)
                    } else {
                      line1 = title.slice(0, maxLen)
                      line2 = title.slice(maxLen)
                    }
                    if (line2.length > maxLen) line2 = line2.slice(0, maxLen - 1) + '\u2026'
                  }
                  return (
                    <text
                      x={node.x}
                      y={node.y + radius + 16}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="var(--font-oxanium), sans-serif"
                      stroke="var(--mario-dark)"
                      strokeWidth={2.5}
                      paintOrder="stroke"
                    >
                      <tspan x={node.x} dy="0">{line1}</tspan>
                      {line2 && <tspan x={node.x} dy="13">{line2}</tspan>}
                    </text>
                  )
                })()}

                {done && choiceScores[demo.id] && (
                  <text
                    x={node.x}
                    y={node.y + radius + (demo.title.length > 20 ? 46 : 32)}
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

          {/* Castle at the end */}
          {(() => {
            const cx = MARIO_NODES[8].x + 50
            const cy = MARIO_NODES[8].y
            return (
              <g>
                <rect x={cx - 5} y={cy - 65} width={50} height={40} fill="#C84C0C" stroke="#8B3300" strokeWidth={2} />
                <rect x={cx + 10} y={cy - 82} width={20} height={20} fill="#C84C0C" stroke="#8B3300" strokeWidth={2} />
                <line x1={cx + 20} y1={cy - 82} x2={cx + 20} y2={cy - 100} stroke="white" strokeWidth={2} />
                <polygon
                  points={`${cx + 20},${cy - 100} ${cx + 35},${cy - 94} ${cx + 20},${cy - 88}`}
                  fill={allAvailableComplete ? 'var(--mario-coin)' : '#FF0000'}
                />
                <rect x={cx + 14} y={cy - 40} width={12} height={16} fill="#1a1a2e" rx={6} />
                {[0, 12, 24, 36].map((dx) => (
                  <rect key={dx} x={cx - 5 + dx} y={cy - 72} width={8} height={8} fill="#C84C0C" stroke="#8B3300" strokeWidth={1} />
                ))}
              </g>
            )
          })()}

          {/* Player indicator */}
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
        </svg>

        {/* Overlay UI elements */}
        <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="max-w-5xl mx-auto">
            <BadgeTray />
          </div>

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

        {/* Bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-12 flex items-center justify-center gap-6">
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
