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

// ── Node positions for the Zelda overworld map (viewBox 0 0 1000 750) ──
// Three dungeon regions with a winding trail through varied terrain.
// Level 1 = "The Forest" (bottom), Level 2 = "The Mountain" (mid), Level 3 = "The Castle" (top)
const ZELDA_NODES = [
  // Dungeon 1 - The Forest (bottom tier, left to right)
  { x: 160, y: 580, level: 1 },
  { x: 430, y: 545, level: 1 },
  { x: 700, y: 575, level: 1 },
  // Dungeon 2 - The Mountain (middle tier, right to left)
  { x: 740, y: 355, level: 2 },
  { x: 500, y: 320, level: 2 },
  { x: 250, y: 350, level: 2 },
  // Dungeon 3 - The Castle (top tier, left to right)
  { x: 210, y: 155, level: 3 },
  { x: 490, y: 120, level: 3 },
  { x: 760, y: 100, level: 3 },
]

// Region labels
const REGION_LABELS = [
  { label: 'THE FOREST', x: 430, y: 645 },
  { label: 'THE MOUNTAIN', x: 500, y: 415 },
  { label: 'THE CASTLE', x: 490, y: 195 },
]

// ── Zelda-themed stats widget ──
function ZeldaStatsWidget({
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
          className="mb-2 p-3 border-[2px] shadow-lg stats-widget-expand"
          style={{ background: 'var(--zelda-dark)', borderColor: 'var(--zelda-gold)' }}
        >
          <div className="space-y-2 text-xs font-heading">
            <div className="flex justify-between gap-6">
              <span className="text-white/60">Treasures</span>
              <span className="font-bold" style={{ color: 'var(--zelda-gold)' }}>{skillCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/60">Rooms cleared</span>
              <span className="font-bold" style={{ color: 'var(--zelda-gold)' }}>{completedCount}/{availableCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/60">Time saved</span>
              <span className="font-bold" style={{ color: 'var(--zelda-gold)' }}>{timeSavedLabel}</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="px-3 py-1.5 text-xs font-heading font-semibold border-[2px] shadow-md transition-all duration-200"
        style={{
          background: 'var(--zelda-dark)',
          borderColor: 'var(--zelda-gold)',
          color: 'var(--zelda-gold)',
        }}
      >
        {completedCount}/{availableCount} clear
      </button>
    </div>
  )
}

// ── Hearts row: Zelda-style HP bar showing completion progress ──
function HeartsRow({ completed, total }: { completed: number; total: number }) {
  // Show up to `total` hearts. Each completed demo = 1 filled heart.
  const hearts = []
  for (let i = 0; i < total; i++) {
    const filled = i < completed
    hearts.push(
      <g key={i} transform={`translate(${i * 24}, 0)`}>
        {/* Heart shape via path */}
        <path
          d="M10 17.5 C5 13, 0 8, 0 5 C0 2, 2 0, 5 0 C7.5 0, 10 2.5, 10 2.5 C10 2.5, 12.5 0, 15 0 C18 0, 20 2, 20 5 C20 8, 15 13, 10 17.5Z"
          fill={filled ? '#FF1744' : '#4A4A4A'}
          stroke={filled ? '#CC0033' : '#333'}
          strokeWidth={1}
          opacity={filled ? 1 : 0.5}
        />
        {filled && (
          <path
            d="M7 5 C7 3, 8 2, 9 3"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        )}
      </g>
    )
  }
  return <g>{hearts}</g>
}

// ── Rupee counter SVG ──
function RupeeIcon({ x, y, size = 14 }: { x: number; y: number; size?: number }) {
  const s = size
  return (
    <g transform={`translate(${x},${y})`}>
      <polygon
        points={`${s * 0.5},0 ${s},${s * 0.35} ${s * 0.75},${s} ${s * 0.25},${s} 0,${s * 0.35}`}
        fill="var(--zelda-grass)"
        stroke="#1A5A1A"
        strokeWidth={1}
      />
      {/* Facet line */}
      <line x1={s * 0.5} y1={0} x2={s * 0.5} y2={s} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
    </g>
  )
}

// ── Triforce piece (small golden triangle for completed nodes) ──
function TriforceIcon({ x, y, size = 16 }: { x: number; y: number; size?: number }) {
  const s = size
  return (
    <polygon
      points={`${x},${y - s * 0.6} ${x - s * 0.5},${y + s * 0.3} ${x + s * 0.5},${y + s * 0.3}`}
      fill="var(--zelda-gold)"
      stroke="#B8860B"
      strokeWidth={1}
    />
  )
}

// ── Sealed dungeon entrance (locked node) ──
function SealedDoor({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* Stone frame */}
      <rect x={x - 18} y={y - 22} width={36} height={44} fill="#5A5A52" stroke="#444" strokeWidth={2} rx={2} />
      {/* Inner dark */}
      <rect x={x - 12} y={y - 16} width={24} height={32} fill="#2A2A2A" rx={1} />
      {/* Keyhole */}
      <circle cx={x} cy={y - 2} r={4} fill="#1A1A1A" />
      <rect x={x - 1.5} y={y + 1} width={3} height={8} fill="#1A1A1A" />
      {/* Stone details */}
      <line x1={x - 18} y1={y - 8} x2={x + 18} y2={y - 8} stroke="#4A4A42" strokeWidth={1} />
      <line x1={x - 18} y1={y + 6} x2={x + 18} y2={y + 6} stroke="#4A4A42" strokeWidth={1} />
    </g>
  )
}

// ── Open treasure chest (completed node) ──
function OpenChest({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* Chest body */}
      <rect x={x - 16} y={y - 6} width={32} height={22} fill="#8B6914" stroke="#5C3A1E" strokeWidth={2} rx={2} />
      {/* Gold clasp */}
      <rect x={x - 4} y={y - 6} width={8} height={6} fill="var(--zelda-gold)" stroke="#B8860B" strokeWidth={1} />
      {/* Open lid (rotated back) */}
      <rect x={x - 16} y={y - 24} width={32} height={16} fill="#A07828" stroke="#5C3A1E" strokeWidth={2} rx={2}
        transform={`rotate(-15, ${x - 16}, ${y - 8})`}
      />
      {/* Glow from inside */}
      <ellipse cx={x} cy={y - 4} rx={10} ry={5} fill="var(--zelda-gold)" opacity={0.4}>
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
      </ellipse>
    </g>
  )
}

// ── Active dungeon entrance node ──
function DungeonEntrance({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* Stone archway */}
      <rect x={x - 20} y={y - 24} width={40} height={48} fill="#7A7A72" stroke="#5A5A52" strokeWidth={2} rx={2} />
      {/* Dark entrance */}
      <rect x={x - 13} y={y - 18} width={26} height={36} fill="#1A1A1A" rx={1} />
      {/* Arch top */}
      <path
        d={`M${x - 13} ${y - 18} Q${x} ${y - 30} ${x + 13} ${y - 18}`}
        fill="#7A7A72"
        stroke="#5A5A52"
        strokeWidth={2}
      />
      {/* Torches on sides */}
      <circle cx={x - 22} cy={y - 14} r={4} fill="#FF8C00" opacity={0.9}>
        <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx={x + 22} cy={y - 14} r={4} fill="#FF8C00" opacity={0.9}>
        <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.2s" repeatCount="indefinite" />
      </circle>
      {/* Torch glow */}
      <circle cx={x - 22} cy={y - 14} r={8} fill="#FF8C00" opacity={0.15}>
        <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx={x + 22} cy={y - 14} r={8} fill="#FF8C00" opacity={0.15}>
        <animate attributeName="r" values="6;10;6" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </g>
  )
}

// ── Heart container for current node ──
function HeartContainer({ x, y }: { x: number; y: number }) {
  return (
    <g className="animate-heart-pulse">
      {/* Outer glow */}
      <circle cx={x} cy={y} r={30} fill="none" stroke="var(--zelda-heart)" strokeWidth={1.5} opacity={0.3}>
        <animate attributeName="r" values="28;34;28" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Heart background circle */}
      <circle cx={x} cy={y} r={26} fill="var(--zelda-dark)" stroke="var(--zelda-gold)" strokeWidth={2.5} />
      {/* Heart shape */}
      <g transform={`translate(${x - 12}, ${y - 11}) scale(1.2)`}>
        <path
          d="M10 17.5 C5 13, 0 8, 0 5 C0 2, 2 0, 5 0 C7.5 0, 10 2.5, 10 2.5 C10 2.5, 12.5 0, 15 0 C18 0, 20 2, 20 5 C20 8, 15 13, 10 17.5Z"
          fill="var(--zelda-heart)"
          stroke="#CC0033"
          strokeWidth={1}
        />
        {/* Shine */}
        <path
          d="M6 5 C6 3, 7.5 2, 8.5 3"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </g>
    </g>
  )
}



// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface ZeldaMapProps {
  skin: SkinConfig
  showCelebration: boolean
  celebrationLevel: number
  onDismissCelebration: () => void
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}

export default function ZeldaMap({
  skin,
  showCelebration,
  celebrationLevel,
  onDismissCelebration,
  statsExpanded,
  setStatsExpanded,
}: ZeldaMapProps) {
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
    const prevKey = 'zelda-prev-completed'
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
  for (let i = ZELDA_NODES.length - 1; i >= 0; i--) {
    if (allDemos[i] && completed.has(allDemos[i].id)) {
      playerNodeIdx = i
      break
    }
  }

  // Find the first uncompleted, unlocked node (current target)
  let currentNodeIdx = -1
  for (let i = 0; i < ZELDA_NODES.length; i++) {
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
  for (let i = 0; i < ZELDA_NODES.length - 1; i++) {
    const a = ZELDA_NODES[i]
    const b = ZELDA_NODES[i + 1]
    const segCompleted = allDemos[i] ? completed.has(allDemos[i].id) : false
    pathSegments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, completed: segCompleted, idx: i })
  }

  return (
    <div className="page-enter min-h-[calc(100vh-3.5rem)] flex flex-col skin-zelda">
      <BadgeToast />

      <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--zelda-dark)' }}>
        {/* SVG Overworld Map */}
        <svg
          viewBox="0 0 1000 750"
          className="w-full h-auto max-h-[calc(100vh-3.5rem)]"
          preserveAspectRatio="xMidYMid meet"
          style={{ minHeight: '500px' }}
        >
          <defs>
            <filter id="goldGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Background ── */}
          <image href={`/images/maps/zelda-level-${isLevelComplete(2) ? 3 : isLevelComplete(1) ? 2 : 1}.png`} x="0" y="0" width="1000" height="750" preserveAspectRatio="xMidYMid slice" />
          {/* Dark green overlay for node readability */}
          <rect x="0" y="0" width="1000" height="750" fill="rgba(16, 40, 16, 0.5)" />

          {/* ── Region labels ── */}
          {REGION_LABELS.map((rl, i) => {
            const regionIdx = i + 1
            const isLocked = regionIdx > 1 && !isLevelComplete(regionIdx - 1)
            // Only show completed region labels brightly
            const isCleared = isLevelComplete(regionIdx)
            return (
              <text
                key={i}
                x={rl.x}
                y={rl.y}
                textAnchor="middle"
                fill={isCleared ? 'var(--zelda-gold)' : isLocked ? '#555' : 'var(--zelda-parchment)'}
                fontSize="24"
                fontWeight="900"
                fontFamily="var(--font-oxanium), sans-serif"
                stroke="var(--zelda-dark)"
                strokeWidth="5"
                paintOrder="stroke"
                opacity={isLocked ? 0.5 : 0.9}
                letterSpacing="0.12em"
              >
                {rl.label}
              </text>
            )
          })}

          {/* ── Path segments (dirt trails) ── */}
          {pathSegments.map((seg) => {
            const segLen = Math.sqrt((seg.x2 - seg.x1) ** 2 + (seg.y2 - seg.y1) ** 2)
            return (
              <g key={seg.idx}>
                {/* Trail shadow */}
                <line
                  x1={seg.x1}
                  y1={seg.y1 + 2}
                  x2={seg.x2}
                  y2={seg.y2 + 2}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth={seg.completed ? 7 : 5}
                  strokeLinecap="round"
                />
                {/* Main trail */}
                <line
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke={seg.completed ? 'var(--zelda-gold)' : '#6B5B4F'}
                  strokeWidth={seg.completed ? 5 : 4}
                  strokeDasharray={seg.completed ? `${segLen}` : '8 6'}
                  strokeLinecap="round"
                  opacity={seg.completed ? 0.9 : 0.5}
                />
                {/* Gold glow on completed segments */}
                {seg.completed && (
                  <line
                    x1={seg.x1}
                    y1={seg.y1}
                    x2={seg.x2}
                    y2={seg.y2}
                    stroke="var(--zelda-gold)"
                    strokeWidth={10}
                    strokeLinecap="round"
                    opacity={0.1}
                  />
                )}
              </g>
            )
          })}

          {/* ── Inter-level narrative text ── */}
          {isLevelComplete(1) && (
            <text
              x={500}
              y={478}
              textAnchor="middle"
              fill="var(--zelda-gold)"
              fontSize="11"
              fontWeight="900"
              fontFamily="var(--font-oxanium), sans-serif"
              stroke="var(--zelda-dark)"
              strokeWidth="4"
              paintOrder="stroke"
              opacity="0.7"
              letterSpacing="0.05em"
            >
              THE PATH ASCENDS...
            </text>
          )}
          {isLevelComplete(2) && (
            <text
              x={500}
              y={225}
              textAnchor="middle"
              fill="var(--zelda-gold)"
              fontSize="11"
              fontWeight="900"
              fontFamily="var(--font-oxanium), sans-serif"
              stroke="var(--zelda-dark)"
              strokeWidth="4"
              paintOrder="stroke"
              opacity="0.7"
              letterSpacing="0.05em"
            >
              THE FINAL TRIAL AWAITS
            </text>
          )}

          {/* ── Nodes ── */}
          {ZELDA_NODES.map((node, i) => {
            const demo = allDemos[i]
            if (!demo) return null
            const done = completed.has(demo.id)
            const levelIdx = Math.floor(i / 3)
            const isLocked = levelIdx > 0 && !isLevelComplete(levelIdx)
            const isCurrent = i === currentNodeIdx

            return (
              <g
                key={i}
                onClick={() => handleNodeClick(i)}
                style={{ cursor: isLocked ? 'default' : 'pointer' }}
                className={cn(
                  !isLocked ? 'map-node--active' : '',
                  done ? 'map-node--complete' : '',
                  isLocked ? 'map-node--locked' : '',
                  isCurrent ? 'map-node--current' : ''
                )}
              >
                {/* Current node pulsing ring */}
                {isCurrent && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={38}
                    fill="none"
                    stroke="var(--zelda-gold)"
                    strokeWidth={2}
                    opacity={0.6}
                  >
                    <animate attributeName="r" values="34;42;34" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.15;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Node visual based on state */}
                {done ? (
                  // Completed = triforce piece (golden triangle)
                  <g>
                    <circle cx={node.x} cy={node.y} r={26} fill="var(--zelda-dark)" stroke="var(--zelda-gold)" strokeWidth={2.5} />
                    <TriforceIcon x={node.x} y={node.y} size={20} />
                  </g>
                ) : isLocked ? (
                  // Locked = sealed dungeon entrance
                  <SealedDoor x={node.x} y={node.y} />
                ) : isCurrent ? (
                  // Current = heart container
                  <HeartContainer x={node.x} y={node.y} />
                ) : (
                  // Active = dungeon entrance
                  <DungeonEntrance x={node.x} y={node.y} />
                )}

                {/* Burst animation on newly completed */}
                {burstNodes.has(demo.id) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={26}
                    fill="none"
                    stroke="var(--zelda-gold)"
                    strokeWidth={3}
                    className="node-burst-ring"
                  />
                )}

                {/* Node title label */}
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
                      y={node.y + 36}
                      textAnchor="middle"
                      fill="var(--zelda-parchment)"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="var(--font-oxanium), sans-serif"
                      stroke="var(--zelda-dark)"
                      strokeWidth={2.5}
                      paintOrder="stroke"
                    >
                      <tspan x={node.x} dy="0">{line1}</tspan>
                      {line2 && <tspan x={node.x} dy="13">{line2}</tspan>}
                    </text>
                  )
                })()}

                {/* Choice score stars */}
                {done && choiceScores[demo.id] && (
                  <text
                    x={node.x}
                    y={node.y + (demo.title.length > 20 ? 66 : 52)}
                    textAnchor="middle"
                    fill="var(--zelda-gold)"
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

          {/* ── Player indicator (Link-style shield) ── */}
          {playerNodeIdx >= 0 && (
            <g className="map-node--current">
              {/* Shield shape */}
              <g transform={`translate(${ZELDA_NODES[playerNodeIdx].x}, ${ZELDA_NODES[playerNodeIdx].y - 42})`}>
                <path
                  d="M0,-12 L10,-4 L8,10 L0,14 L-8,10 L-10,-4 Z"
                  fill="var(--zelda-grass)"
                  stroke="var(--zelda-gold)"
                  strokeWidth={2}
                />
                {/* Triforce emblem on shield */}
                <polygon points="0,-4 -3,2 3,2" fill="var(--zelda-gold)" />
                <polygon points="-3,2 -6,8 0,8" fill="var(--zelda-gold)" opacity={0.7} />
                <polygon points="3,2 0,8 6,8" fill="var(--zelda-gold)" opacity={0.7} />
              </g>
            </g>
          )}

          {/* ── Hearts row (top-left HUD) ── */}
          <g transform="translate(20, 15)">
            <HeartsRow completed={completed.size} total={availableDemoCount} />
          </g>

          {/* ── Rupee counter (top-right HUD) ── */}
          <g transform="translate(880, 15)">
            <RupeeIcon x={0} y={0} size={16} />
            <text
              x={22}
              y={14}
              fill="var(--zelda-gold)"
              fontSize="14"
              fontWeight="bold"
              fontFamily="var(--font-oxanium), sans-serif"
            >
              x{completed.size}
            </text>
          </g>
        </svg>

        {/* ── Overlay UI elements ── */}
        <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="max-w-5xl mx-auto">
            <BadgeTray />
          </div>

          {allAvailableComplete && (
            <div className="text-center mt-2">
              <button
                onClick={() => {
                  playSound('zelda-dungeon-clear')
                  router.push('/victory')
                }}
                className="px-6 py-3 font-heading font-bold text-sm transition-all duration-300 node-completed-glow"
                style={{
                  background: 'var(--zelda-dark)',
                  border: '2px solid var(--zelda-gold)',
                  color: 'var(--zelda-gold)',
                }}
              >
                TRIFORCE COMPLETE
              </button>
            </div>
          )}
        </div>

        {/* ── Bottom navigation ── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-12 flex items-center justify-center gap-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-white/60 hover:text-white transition-colors font-heading"
          >
            Start over
          </button>
        </div>

        {/* ── Floating stats widget ── */}
        <div className="absolute bottom-0 right-0 z-20">
          <ZeldaStatsWidget
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
