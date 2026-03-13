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

// ─────────────────────────────────────────────────
// Node positions for the expedition map (viewBox 0 0 1000 800)
// Winding golden trail through a painterly landscape
// ─────────────────────────────────────────────────
const EXPEDITION_NODES = [
  // Chapter I (bottom, left to right arc)
  { x: 180, y: 640, chapter: 1 },
  { x: 480, y: 600, chapter: 1 },
  { x: 760, y: 640, chapter: 1 },
  // Chapter II (middle, right to left arc)
  { x: 720, y: 420, chapter: 2 },
  { x: 460, y: 380, chapter: 2 },
  { x: 200, y: 420, chapter: 2 },
  // Chapter III (top, left to right arc)
  { x: 240, y: 200, chapter: 3 },
  { x: 500, y: 160, chapter: 3 },
  { x: 780, y: 130, chapter: 3 },
]

// Art deco compass rose for the current node
function CompassRose({ cx, cy, size }: { cx: number; cy: number; size: number }) {
  const s = size
  return (
    <g opacity="0.5">
      {/* Cardinal points */}
      <line x1={cx} y1={cy - s} x2={cx} y2={cy + s} stroke="var(--co-gold)" strokeWidth="0.8" />
      <line x1={cx - s} y1={cy} x2={cx + s} y2={cy} stroke="var(--co-gold)" strokeWidth="0.8" />
      {/* Diagonal points */}
      <line x1={cx - s * 0.6} y1={cy - s * 0.6} x2={cx + s * 0.6} y2={cy + s * 0.6} stroke="var(--co-gold)" strokeWidth="0.5" />
      <line x1={cx + s * 0.6} y1={cy - s * 0.6} x2={cx - s * 0.6} y2={cy + s * 0.6} stroke="var(--co-gold)" strokeWidth="0.5" />
      {/* Inner diamond */}
      <polygon
        points={`${cx},${cy - s * 0.3} ${cx + s * 0.3},${cy} ${cx},${cy + s * 0.3} ${cx - s * 0.3},${cy}`}
        fill="none"
        stroke="var(--co-gold)"
        strokeWidth="0.6"
      />
    </g>
  )
}

// Art deco corner flourish (rendered at each corner of the map border)
function CornerFlourish({ x, y, rotation }: { x: number; y: number; rotation: number }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`} opacity="0.4">
      <path
        d="M0,0 L40,0 M0,0 L0,40"
        stroke="var(--co-gold)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M0,0 L28,0 L28,4 L4,4 L4,28 L0,28 Z"
        fill="none"
        stroke="var(--co-gold)"
        strokeWidth="1"
      />
      {/* Inner geometric detail */}
      <rect x="8" y="8" width="8" height="8" fill="none" stroke="var(--co-gold)" strokeWidth="0.6" />
      <line x1="12" y1="8" x2="12" y2="16" stroke="var(--co-gold)" strokeWidth="0.4" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="var(--co-gold)" strokeWidth="0.4" />
    </g>
  )
}

// Art deco horizontal divider between chapters
function ArtDecoDivider({ y, width }: { y: number; width: number }) {
  const cx = 500
  const halfW = width / 2
  return (
    <g opacity="0.3">
      <line x1={cx - halfW} y1={y} x2={cx - 30} y2={y} stroke="var(--co-gold)" strokeWidth="1" />
      <line x1={cx + 30} y1={y} x2={cx + halfW} y2={y} stroke="var(--co-gold)" strokeWidth="1" />
      {/* Central diamond ornament */}
      <polygon
        points={`${cx},${y - 8} ${cx + 12},${y} ${cx},${y + 8} ${cx - 12},${y}`}
        fill="none"
        stroke="var(--co-gold)"
        strokeWidth="1"
      />
      <circle cx={cx} cy={y} r="3" fill="var(--co-gold)" opacity="0.5" />
      {/* Side dots */}
      <circle cx={cx - 20} cy={y} r="2" fill="var(--co-gold)" opacity="0.4" />
      <circle cx={cx + 20} cy={y} r="2" fill="var(--co-gold)" opacity="0.4" />
    </g>
  )
}

// Watercolor wash background blobs
function WatercolorWashes() {
  return (
    <g>
      {/* Soft rose wash - top right */}
      <ellipse cx="780" cy="100" rx="200" ry="120" fill="var(--co-rose)" opacity="0.04" />
      {/* Gold wash - middle */}
      <ellipse cx="400" cy="400" rx="300" ry="180" fill="var(--co-gold)" opacity="0.03" />
      {/* Rose wash - bottom left */}
      <ellipse cx="200" cy="650" rx="250" ry="140" fill="var(--co-rose)" opacity="0.05" />
      {/* Cream-gold wash - center top */}
      <ellipse cx="550" cy="220" rx="180" ry="100" fill="var(--co-glow)" opacity="0.03" />
      {/* Soft blush - right mid */}
      <ellipse cx="800" cy="450" rx="150" ry="200" fill="var(--co-rose)" opacity="0.03" />
    </g>
  )
}

// Decorative painterly landscape elements
function LandscapeElements() {
  return (
    <g opacity="0.12">
      {/* Distant mountain silhouettes - very faint */}
      <path
        d="M0,300 Q100,200 200,280 Q300,180 420,260 Q500,200 600,250 Q700,170 800,230 Q900,190 1000,260 L1000,350 L0,350 Z"
        fill="var(--co-slate)"
        opacity="0.3"
      />
      {/* Rolling hills - middle ground */}
      <path
        d="M0,500 Q150,460 300,490 Q450,430 600,480 Q750,440 900,470 Q950,475 1000,480 L1000,540 L0,540 Z"
        fill="var(--co-rose)"
        opacity="0.15"
      />
      {/* Foreground rolling terrain */}
      <path
        d="M0,680 Q200,650 400,670 Q600,640 800,665 Q900,660 1000,670 L1000,800 L0,800 Z"
        fill="var(--co-gold)"
        opacity="0.12"
      />

      {/* Scattered trees (simple painterly marks) */}
      <circle cx="120" cy="590" r="8" fill="var(--co-slate)" opacity="0.2" />
      <circle cx="130" cy="585" r="6" fill="var(--co-slate)" opacity="0.15" />
      <circle cx="870" cy="580" r="7" fill="var(--co-slate)" opacity="0.18" />
      <circle cx="880" cy="575" r="5" fill="var(--co-slate)" opacity="0.12" />

      <circle cx="340" cy="370" r="6" fill="var(--co-slate)" opacity="0.15" />
      <circle cx="660" cy="365" r="5" fill="var(--co-slate)" opacity="0.12" />

      <circle cx="400" cy="170" r="5" fill="var(--co-slate)" opacity="0.1" />
      <circle cx="650" cy="140" r="4" fill="var(--co-slate)" opacity="0.08" />
    </g>
  )
}

// Art deco border frame around entire map
function MapBorderFrame() {
  return (
    <g>
      {/* Outer border */}
      <rect x="20" y="20" width="960" height="760" fill="none" stroke="var(--co-gold)" strokeWidth="1.5" opacity="0.25" />
      {/* Inner border */}
      <rect x="30" y="30" width="940" height="740" fill="none" stroke="var(--co-gold)" strokeWidth="0.5" opacity="0.15" />

      {/* Corner flourishes */}
      <CornerFlourish x={22} y={22} rotation={0} />
      <CornerFlourish x={978} y={22} rotation={90} />
      <CornerFlourish x={978} y={778} rotation={180} />
      <CornerFlourish x={22} y={778} rotation={270} />
    </g>
  )
}

// Final destination marker (expedition's end)
function ExpeditionEnd({ x, y, complete }: { x: number; y: number; complete: boolean }) {
  return (
    <g>
      {/* Art deco sunburst behind the final marker */}
      {complete && (
        <g opacity="0.3">
          {[0, 30, 60, 90, 120, 150].map((angle) => (
            <line
              key={angle}
              x1={x}
              y1={y}
              x2={x + Math.cos((angle * Math.PI) / 180) * 45}
              y2={y + Math.sin((angle * Math.PI) / 180) * 45}
              stroke="var(--co-glow)"
              strokeWidth="1"
            >
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" begin={`${angle * 0.02}s`} repeatCount="indefinite" />
            </line>
          ))}
          {[180, 210, 240, 270, 300, 330].map((angle) => (
            <line
              key={angle}
              x1={x}
              y1={y}
              x2={x + Math.cos((angle * Math.PI) / 180) * 45}
              y2={y + Math.sin((angle * Math.PI) / 180) * 45}
              stroke="var(--co-glow)"
              strokeWidth="1"
            >
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" begin={`${angle * 0.02}s`} repeatCount="indefinite" />
            </line>
          ))}
        </g>
      )}
      {/* Flag pole */}
      <line x1={x + 40} y1={y - 30} x2={x + 40} y2={y + 15} stroke="var(--co-gold)" strokeWidth="2" opacity="0.7" />
      {/* Flag */}
      <polygon
        points={`${x + 40},${y - 30} ${x + 65},${y - 22} ${x + 40},${y - 14}`}
        fill={complete ? 'var(--co-glow)' : 'var(--co-rose)'}
        opacity={complete ? 0.9 : 0.5}
      />
      {/* Base ornament */}
      <circle cx={x + 40} cy={y + 15} r="4" fill="var(--co-gold)" opacity="0.5" />
    </g>
  )
}

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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
      {expanded && (
        <div
          className="mb-2 p-4 border shadow-lg stats-widget-expand"
          style={{
            background: 'var(--co-card)',
            borderColor: 'var(--co-gold)',
            borderWidth: '1px',
            boxShadow: '0 2px 12px rgba(197, 165, 90, 0.12)',
          }}
        >
          {/* Title bar */}
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
          background: 'var(--co-card)',
          borderColor: 'var(--co-gold)',
          color: 'var(--co-gold)',
          fontFamily: 'var(--co-font-heading)',
          letterSpacing: '0.05em',
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

  // Flatten all demos in order
  const allDemos = levels.flatMap((l) => l.demos)

  // Detect newly completed nodes for burst animation
  const [burstNodes, setBurstNodes] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prevKey = 'co-prev-completed'
    const prev = new Set<number>(JSON.parse(sessionStorage.getItem(prevKey) || '[]'))
    const newlyDone = new Set<number>()
    completed.forEach((id) => {
      if (!prev.has(id)) newlyDone.add(id)
    })
    if (newlyDone.size > 0) {
      setBurstNodes(newlyDone)
      const timer = setTimeout(() => setBurstNodes(new Set()), 1200)
      sessionStorage.setItem(prevKey, JSON.stringify(Array.from(completed)))
      return () => clearTimeout(timer)
    }
    sessionStorage.setItem(prevKey, JSON.stringify(Array.from(completed)))
  }, [completed])

  // Find last completed node index for player indicator
  let playerNodeIdx = -1
  for (let i = EXPEDITION_NODES.length - 1; i >= 0; i--) {
    if (allDemos[i] && completed.has(allDemos[i].id)) {
      playerNodeIdx = i
      break
    }
  }

  // Find the first uncompleted node (current target)
  let currentNodeIdx = -1
  for (let i = 0; i < EXPEDITION_NODES.length; i++) {
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
    playSound('co-page-chime')
    navigateWithTransition(`/play/${demo.id}`)
  }

  // Build path segments between consecutive nodes
  const pathSegments: { x1: number; y1: number; x2: number; y2: number; completed: boolean; idx: number }[] = []
  for (let i = 0; i < EXPEDITION_NODES.length - 1; i++) {
    const a = EXPEDITION_NODES[i]
    const b = EXPEDITION_NODES[i + 1]
    const segCompleted = allDemos[i] ? completed.has(allDemos[i].id) : false
    pathSegments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, completed: segCompleted, idx: i })
  }

  // Build curved path data for a golden winding trail
  function buildCurvedPath(seg: typeof pathSegments[0]): string {
    const dx = seg.x2 - seg.x1
    const dy = seg.y2 - seg.y1
    // Offset control points perpendicular to the line for gentle curves
    const mx = (seg.x1 + seg.x2) / 2
    const my = (seg.y1 + seg.y2) / 2
    const perpX = -dy * 0.15
    const perpY = dx * 0.15
    return `M${seg.x1},${seg.y1} Q${mx + perpX},${my + perpY} ${seg.x2},${seg.y2}`
  }

  return (
    <div className="page-enter min-h-[calc(100vh-3.5rem)] flex flex-col skin-clair-obscur">
      <BadgeToast />

      <div
        className="flex-1 relative overflow-hidden"
        style={{ background: 'var(--co-cream)' }}
      >
        {/* SVG Expedition Map */}
        <svg
          viewBox="0 0 1000 800"
          className="w-full h-auto max-h-[calc(100vh-3.5rem)]"
          preserveAspectRatio="xMidYMid meet"
          style={{ minHeight: '500px' }}
        >
          <defs>
            {/* Gold gradient for completed paths */}
            <linearGradient id="co-gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--co-gold)" />
              <stop offset="50%" stopColor="var(--co-glow)" />
              <stop offset="100%" stopColor="var(--co-gold)" />
            </linearGradient>
            {/* Radial glow for active nodes */}
            <radialGradient id="co-node-glow">
              <stop offset="0%" stopColor="var(--co-glow)" stopOpacity="0.4" />
              <stop offset="70%" stopColor="var(--co-gold)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--co-gold)" stopOpacity="0" />
            </radialGradient>
            {/* Soft watercolor texture filter */}
            <filter id="co-soft-blur">
              <feGaussianBlur stdDeviation="2" />
            </filter>
            {/* Sunburst glow for current node */}
            <radialGradient id="co-sunburst">
              <stop offset="0%" stopColor="var(--co-glow)" stopOpacity="0.35" />
              <stop offset="50%" stopColor="var(--co-gold)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--co-gold)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Gorgeous art deco watercolor background */}
          <image href={`/images/maps/clair-obscur-level-${isLevelComplete(2) ? 3 : isLevelComplete(1) ? 2 : 1}.png`} x="0" y="0" width="1000" height="800" preserveAspectRatio="xMidYMid slice" />
          {/* Cream veil for node readability */}
          <rect x="0" y="0" width="1000" height="800" fill="var(--co-cream)" opacity="0.55" />

          {/* Art deco border frame */}
          <MapBorderFrame />

          {/* Chapter dividers */}
          <ArtDecoDivider y={520} width={600} />
          <ArtDecoDivider y={300} width={600} />

          {/* Chapter labels */}
          <text
            x={500}
            y={730}
            textAnchor="middle"
            fill="var(--co-gold)"
            fontSize="22"
            fontWeight="700"
            fontFamily="var(--co-font-heading)"
            letterSpacing="0.18em"
            opacity="0.85"
          >
            CHAPTER I
          </text>
          <text
            x={500}
            y={480}
            textAnchor="middle"
            fill="var(--co-gold)"
            fontSize="22"
            fontWeight="700"
            fontFamily="var(--co-font-heading)"
            letterSpacing="0.18em"
            opacity="0.85"
          >
            CHAPTER II
          </text>
          <text
            x={500}
            y={260}
            textAnchor="middle"
            fill="var(--co-gold)"
            fontSize="22"
            fontWeight="700"
            fontFamily="var(--co-font-heading)"
            letterSpacing="0.18em"
            opacity="0.85"
          >
            CHAPTER III
          </text>

          {/* Inter-chapter narrative text */}
          {isLevelComplete(1) && (
            <text
              x={500}
              y={508}
              textAnchor="middle"
              fill="var(--co-rose)"
              fontSize="10"
              fontFamily="var(--co-font-body)"
              fontStyle="italic"
              letterSpacing="0.08em"
              opacity="0.5"
            >
              The path deepens. Techniques sharpen.
            </text>
          )}
          {isLevelComplete(2) && (
            <text
              x={500}
              y={288}
              textAnchor="middle"
              fill="var(--co-rose)"
              fontSize="10"
              fontFamily="var(--co-font-body)"
              fontStyle="italic"
              letterSpacing="0.08em"
              opacity="0.5"
            >
              The final chapter awaits.
            </text>
          )}

          {/* Trail path segments (golden dotted trails) */}
          {pathSegments.map((seg) => {
            const pathD = buildCurvedPath(seg)
            // Rough path length for dash animation
            const segLen = Math.sqrt((seg.x2 - seg.x1) ** 2 + (seg.y2 - seg.y1) ** 2)

            return (
              <g key={seg.idx}>
                {/* Shadow/underline for depth */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="var(--co-gold)"
                  strokeWidth={seg.completed ? 4 : 2}
                  strokeDasharray={seg.completed ? `${segLen}` : '6 10'}
                  strokeLinecap="round"
                  opacity={seg.completed ? 0.15 : 0.06}
                  style={{ filter: 'url(#co-soft-blur)' }}
                />
                {/* Main trail */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={seg.completed ? 'url(#co-gold-gradient)' : 'var(--co-gold)'}
                  strokeWidth={seg.completed ? 3 : 1.5}
                  strokeDasharray={seg.completed ? `${segLen}` : '4 8'}
                  strokeLinecap="round"
                  opacity={seg.completed ? 0.7 : 0.25}
                  className={seg.completed ? 'path-segment-completed' : ''}
                  style={seg.completed ? { '--seg-len': segLen } as React.CSSProperties : undefined}
                />
              </g>
            )
          })}

          {/* Decorative compass roses near chapter transitions */}
          <CompassRose cx={900} cy={520} size={25} />
          <CompassRose cx={100} cy={300} size={20} />

          {/* Expedition nodes */}
          {EXPEDITION_NODES.map((node, i) => {
            const demo = allDemos[i]
            if (!demo) return null
            const done = completed.has(demo.id)
            const levelIdx = Math.floor(i / 3)
            const isLocked = levelIdx > 0 && !isLevelComplete(levelIdx)
            const isCurrent = i === currentNodeIdx
            const radius = isCurrent ? 24 : 20

            return (
              <g
                key={i}
                onClick={() => handleNodeClick(i)}
                style={{ cursor: isLocked ? 'default' : 'pointer' }}
              >
                {/* Current node: pulsing gold sunburst glow */}
                {isCurrent && (
                  <g>
                    <circle cx={node.x} cy={node.y} r={42} fill="url(#co-sunburst)">
                      <animate attributeName="r" values="38;46;38" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
                    </circle>
                    {/* Brush stroke ring effect */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={32}
                      fill="none"
                      stroke="var(--co-gold)"
                      strokeWidth="1.5"
                      strokeDasharray="8 4 2 4"
                      opacity="0.4"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values={`0 ${node.x} ${node.y};360 ${node.x} ${node.y}`}
                        dur="20s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                )}

                {/* Node burst animation on completion */}
                {burstNodes.has(demo.id) && (
                  <g>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={20}
                      fill="none"
                      stroke="var(--co-glow)"
                      strokeWidth={2}
                      opacity={0}
                    >
                      <animate attributeName="r" values="20;50" dur="0.8s" fill="freeze" />
                      <animate attributeName="opacity" values="0.8;0" dur="0.8s" fill="freeze" />
                    </circle>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={20}
                      fill="none"
                      stroke="var(--co-gold)"
                      strokeWidth={1}
                      opacity={0}
                    >
                      <animate attributeName="r" values="20;40" dur="0.6s" begin="0.1s" fill="freeze" />
                      <animate attributeName="opacity" values="0.6;0" dur="0.6s" begin="0.1s" fill="freeze" />
                    </circle>
                  </g>
                )}

                {/* Art deco geometric node base (octagonal feel) */}
                {done ? (
                  <g>
                    {/* Filled gold circle for completed */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius}
                      fill="var(--co-gold)"
                      stroke="var(--co-glow)"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                    {/* Inner geometric detail */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius - 6}
                      fill="none"
                      stroke="var(--co-cream)"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </g>
                ) : isLocked ? (
                  <g>
                    {/* Muted gray circle for locked */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius}
                      fill="var(--co-cream)"
                      stroke="var(--co-border)"
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                    {/* Inner dashed ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius - 5}
                      fill="none"
                      stroke="var(--co-border)"
                      strokeWidth="0.5"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                  </g>
                ) : (
                  <g>
                    {/* Active (available but not done): gold outline circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius}
                      fill="var(--co-card)"
                      stroke="var(--co-gold)"
                      strokeWidth="2"
                    />
                    {/* Art deco inner diamond */}
                    <polygon
                      points={`${node.x},${node.y - 8} ${node.x + 8},${node.y} ${node.x},${node.y + 8} ${node.x - 8},${node.y}`}
                      fill="none"
                      stroke="var(--co-gold)"
                      strokeWidth="0.8"
                      opacity="0.4"
                    />
                  </g>
                )}

                {/* Node content icons */}
                {done ? (
                  <text
                    x={node.x}
                    y={node.y + 6}
                    textAnchor="middle"
                    fill="var(--co-cream)"
                    fontSize="16"
                    fontFamily="var(--co-font-heading)"
                    fontWeight="bold"
                  >
                    {'\u2605'}
                  </text>
                ) : isLocked ? (
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill="var(--co-border)"
                    fontSize="14"
                    opacity="0.6"
                  >
                    {'\u{1F512}'}
                  </text>
                ) : (
                  <text
                    x={node.x}
                    y={node.y + 7}
                    textAnchor="middle"
                    fill="var(--co-gold)"
                    fontSize="18"
                    fontFamily="var(--co-font-heading)"
                    fontWeight="700"
                    className="shimmer"
                  >
                    ?
                  </text>
                )}

                {/* Node title label */}
                {!isLocked && (() => {
                  const title = demo.title
                  const maxLen = 22
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
                      fill="var(--co-ink)"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="var(--co-font-body)"
                      letterSpacing="0.02em"
                    >
                      <tspan x={node.x} dy="0">{line1}</tspan>
                      {line2 && <tspan x={node.x} dy="13">{line2}</tspan>}
                    </text>
                  )
                })()}

                {/* Star rating for completed nodes */}
                {done && choiceScores[demo.id] && (
                  <text
                    x={node.x}
                    y={node.y + radius + (demo.title.length > 22 ? 46 : 32)}
                    textAnchor="middle"
                    fill="var(--co-gold)"
                    fontSize="11"
                    fontFamily="var(--co-font-heading)"
                  >
                    {Array.from({ length: 3 }, (_, s) =>
                      s < choiceScores[demo.id] ? '\u2605' : '\u2606'
                    ).join('')}
                  </text>
                )}
              </g>
            )
          })}

          {/* Expedition end marker (flag at final node) */}
          <ExpeditionEnd
            x={EXPEDITION_NODES[8].x}
            y={EXPEDITION_NODES[8].y}
            complete={allAvailableComplete}
          />

          {/* Player indicator: small gold quill/compass marker above last completed node */}
          {playerNodeIdx >= 0 && (
            <g>
              <circle
                cx={EXPEDITION_NODES[playerNodeIdx].x}
                cy={EXPEDITION_NODES[playerNodeIdx].y - 34}
                r={8}
                fill="var(--co-gold)"
                stroke="var(--co-cream)"
                strokeWidth="2"
              />
              <text
                x={EXPEDITION_NODES[playerNodeIdx].x}
                y={EXPEDITION_NODES[playerNodeIdx].y - 30}
                textAnchor="middle"
                fill="var(--co-cream)"
                fontSize="9"
                fontFamily="var(--co-font-heading)"
                fontWeight="bold"
              >
                {'\u270E'}
              </text>
            </g>
          )}

          {/* Title cartouche at top center */}
          <g>
            {/* Decorative lines flanking the title */}
            <line x1="320" y1="55" x2="440" y2="55" stroke="var(--co-gold)" strokeWidth="0.8" opacity="0.4" />
            <line x1="560" y1="55" x2="680" y2="55" stroke="var(--co-gold)" strokeWidth="0.8" opacity="0.4" />
            <polygon
              points="450,55 455,50 460,55 455,60"
              fill="var(--co-gold)"
              opacity="0.3"
            />
            <polygon
              points="540,55 545,50 550,55 545,60"
              fill="var(--co-gold)"
              opacity="0.3"
            />
            <text
              x={500}
              y={60}
              textAnchor="middle"
              fill="var(--co-ink)"
              fontSize="14"
              fontWeight="700"
              fontFamily="var(--co-font-heading)"
              letterSpacing="0.12em"
            >
              EXPEDITION
            </text>
          </g>
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
        </div>

        {/* Bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-12 flex items-center justify-center gap-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs transition-colors duration-300"
            style={{
              color: 'var(--co-slate)',
              fontFamily: 'var(--co-font-body)',
              letterSpacing: '0.05em',
              opacity: 0.5,
            }}
          >
            Start over
          </button>
        </div>

        {/* Floating stats widget */}
        <div className="absolute bottom-0 right-0 z-20">
          <ExpeditionStatsWidget
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
