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

// ─── Node layout for the tactical command map (viewBox 0 0 1000 700) ────────
// Arranged as 3 sectors, each with 3 base installations
const RA_NODES = [
  // Sector Alpha (bottom tier) - left to right
  { x: 160, y: 560, sector: 1 },
  { x: 430, y: 520, sector: 1 },
  { x: 700, y: 560, sector: 1 },
  // Sector Bravo (middle tier) - right to left
  { x: 740, y: 330, sector: 2 },
  { x: 490, y: 290, sector: 2 },
  { x: 240, y: 330, sector: 2 },
  // Sector Charlie (top tier) - left to right
  { x: 210, y: 130, sector: 3 },
  { x: 480, y: 100, sector: 3 },
  { x: 750, y: 70, sector: 3 },
]

// Sector gate markers (between tiers)
const SECTOR_GATES = [
  { x: 830, y: 430, connects: [1, 2] },
  { x: 130, y: 220, connects: [2, 3] },
]

const SECTOR_NAMES = ['SECTOR ALPHA', 'SECTOR BRAVO', 'SECTOR CHARLIE']

// ─── Military HUD Stats ─────────────────────────────────────────────────────
function RedAlertStatsWidget({
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
          className="mb-2 p-3 border-2 shadow-lg"
          style={{
            background: 'var(--ra-panel)',
            borderColor: 'var(--ra-green)',
            boxShadow: '0 0 12px rgba(51, 255, 51, 0.15)',
          }}
        >
          <div className="space-y-2 text-xs" style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--ra-text)', opacity: 0.6 }}>TECHNOLOGIES</span>
              <span className="font-bold" style={{ color: 'var(--ra-green)' }}>{skillCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--ra-text)', opacity: 0.6 }}>MISSIONS CLEAR</span>
              <span className="font-bold" style={{ color: 'var(--ra-green)' }}>{completedCount}/{availableCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ color: 'var(--ra-text)', opacity: 0.6 }}>TIME SAVED</span>
              <span className="font-bold" style={{ color: 'var(--ra-green)' }}>{timeSavedLabel}</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="px-3 py-1.5 text-xs font-semibold border-2 shadow-md transition-all duration-200"
        style={{
          background: 'var(--ra-panel)',
          borderColor: 'var(--ra-green)',
          color: 'var(--ra-green)',
          fontFamily: "'Share Tech Mono', 'Courier New', monospace",
          letterSpacing: '0.1em',
        }}
      >
        {completedCount}/{availableCount} CLEAR
      </button>
    </div>
  )
}

// ─── Main Map Component ─────────────────────────────────────────────────────
export interface RedAlertMapProps {
  skin: SkinConfig
  showCelebration: boolean
  celebrationLevel: number
  onDismissCelebration: () => void
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}

export default function RedAlertMap({
  skin,
  showCelebration,
  celebrationLevel,
  onDismissCelebration,
  statsExpanded,
  setStatsExpanded,
}: RedAlertMapProps) {
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
    const prevKey = 'ra-prev-completed'
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
  for (let i = RA_NODES.length - 1; i >= 0; i--) {
    if (allDemos[i] && completed.has(allDemos[i].id)) {
      playerNodeIdx = i
      break
    }
  }

  // Find the first uncompleted node (current target)
  let currentNodeIdx = -1
  for (let i = 0; i < RA_NODES.length; i++) {
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
  for (let i = 0; i < RA_NODES.length - 1; i++) {
    const a = RA_NODES[i]
    const b = RA_NODES[i + 1]
    const segCompleted = allDemos[i] ? completed.has(allDemos[i].id) : false
    pathSegments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, completed: segCompleted, idx: i })
  }

  return (
    <div className="page-enter min-h-[calc(100vh-3.5rem)] flex flex-col skin-red-alert">
      <BadgeToast />

      <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--ra-dark)' }}>

        {/* SVG Tactical Map */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-auto max-h-[calc(100vh-3.5rem)]"
          preserveAspectRatio="xMidYMid meet"
          style={{ minHeight: '500px' }}
        >
          <defs>
            {/* Radar sweep gradient */}
            <linearGradient id="ra-sweep-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(51,255,51,0)" />
              <stop offset="70%" stopColor="rgba(51,255,51,0.03)" />
              <stop offset="100%" stopColor="rgba(51,255,51,0.12)" />
            </linearGradient>

            {/* Glow filter for active nodes */}
            <filter id="ra-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Stronger glow for current node */}
            <filter id="ra-glow-strong">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radar sweep clip path - a wedge */}
            <clipPath id="ra-sweep-clip">
              <path d="M500,350 L500,0 A350,350 0 0,1 850,350 Z" />
            </clipPath>

            {/* Scan line pattern for CRT effect */}
            <pattern id="ra-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="2" fill="transparent" />
              <rect y="2" width="4" height="2" fill="rgba(0,0,0,0.06)" />
            </pattern>

            {/* Supply route dash animation */}
            <pattern id="ra-supply-dash" width="16" height="4" patternUnits="userSpaceOnUse">
              <rect width="8" height="4" fill="rgba(51,255,51,0.5)" />
            </pattern>
          </defs>

          {/* ─── Background Layer ─── */}

          {/* World background image */}
          <image href={`/images/maps/red-alert-level-${isLevelComplete(2) ? 3 : isLevelComplete(1) ? 2 : 1}.png`} x="0" y="0" width="1000" height="700" preserveAspectRatio="xMidYMid slice" />
          {/* Dark overlay for readability */}
          <rect width="1000" height="700" fill="#0A1208" opacity="0.55" />

          {/* Phosphor grid overlay */}
          {/* Vertical grid lines */}
          {Array.from({ length: 21 }, (_, i) => (
            <line
              key={`vg-${i}`}
              x1={i * 50}
              y1={0}
              x2={i * 50}
              y2={700}
              stroke="#1A3A1A"
              strokeWidth={i % 5 === 0 ? 1 : 0.5}
              opacity={i % 5 === 0 ? 0.6 : 0.25}
            />
          ))}
          {/* Horizontal grid lines */}
          {Array.from({ length: 15 }, (_, i) => (
            <line
              key={`hg-${i}`}
              x1={0}
              y1={i * 50}
              x2={1000}
              y2={i * 50}
              stroke="#1A3A1A"
              strokeWidth={i % 5 === 0 ? 1 : 0.5}
              opacity={i % 5 === 0 ? 0.6 : 0.25}
            />
          ))}

          {/* Radar concentric rings (centered on map) */}
          {[80, 160, 240, 320].map((r) => (
            <circle
              key={`ring-${r}`}
              cx={500}
              cy={350}
              r={r}
              fill="none"
              stroke="#1A3A1A"
              strokeWidth={0.6}
              opacity={0.35}
            />
          ))}

          {/* Radar crosshair through center */}
          <line x1={500} y1={0} x2={500} y2={700} stroke="#1A3A1A" strokeWidth={0.6} opacity={0.3} />
          <line x1={0} y1={350} x2={1000} y2={350} stroke="#1A3A1A" strokeWidth={0.6} opacity={0.3} />

          {/* Rotating radar sweep */}
          <g style={{ transformOrigin: '500px 350px' }}>
            <path
              d="M500,350 L500,30 A320,320 0 0,1 810,280 Z"
              fill="url(#ra-sweep-grad)"
              opacity={0.5}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 500 350"
                to="360 500 350"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* CRT scan line overlay */}
          <rect width="1000" height="700" fill="url(#ra-scanlines)" opacity={0.5} />

          {/* ─── Hazard border strips at top and bottom ─── */}
          {/* Top hazard stripe */}
          <g>
            {Array.from({ length: 63 }, (_, i) => (
              <rect
                key={`ht-${i}`}
                x={i * 16}
                y={0}
                width={8}
                height={4}
                fill="#FFB800"
                opacity={0.4}
                transform={`skewX(-20)`}
              />
            ))}
          </g>
          {/* Bottom hazard stripe */}
          <g>
            {Array.from({ length: 63 }, (_, i) => (
              <rect
                key={`hb-${i}`}
                x={i * 16}
                y={696}
                width={8}
                height={4}
                fill="#FFB800"
                opacity={0.4}
                transform={`skewX(-20)`}
              />
            ))}
          </g>

          {/* ─── HUD Corner Decorations ─── */}

          {/* Top-left corner bracket */}
          <polyline points="5,30 5,5 30,5" fill="none" stroke="#33FF33" strokeWidth={2} opacity={0.5} />
          <text x="38" y="16" fill="#33FF33" fontSize="9" opacity={0.4} style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            TACT-MAP v3.7
          </text>

          {/* Top-right corner bracket */}
          <polyline points="970,5 995,5 995,30" fill="none" stroke="#33FF33" strokeWidth={2} opacity={0.5} />
          <text x="965" y="16" textAnchor="end" fill="#33FF33" fontSize="9" opacity={0.4} style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            COMMAND HQ
          </text>

          {/* Bottom-left corner bracket */}
          <polyline points="5,670 5,695 30,695" fill="none" stroke="#33FF33" strokeWidth={2} opacity={0.5} />
          <text x="38" y="692" fill="#33FF33" fontSize="9" opacity={0.4} style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            GRID REF: 04.27.91
          </text>

          {/* Bottom-right corner bracket */}
          <polyline points="970,695 995,695 995,670" fill="none" stroke="#33FF33" strokeWidth={2} opacity={0.5} />

          {/* ─── Sector Labels ─── */}
          <text
            x={430}
            y={610}
            textAnchor="middle"
            fill="#33FF33"
            fontSize="18"
            fontWeight="400"
            opacity={0.7}
            style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace", letterSpacing: '0.15em' }}
          >
            {SECTOR_NAMES[0]}
          </text>
          <text
            x={490}
            y={370}
            textAnchor="middle"
            fill="#33FF33"
            fontSize="18"
            fontWeight="400"
            opacity={0.7}
            style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace", letterSpacing: '0.15em' }}
          >
            {SECTOR_NAMES[1]}
          </text>
          <text
            x={480}
            y={165}
            textAnchor="middle"
            fill="#33FF33"
            fontSize="18"
            fontWeight="400"
            opacity={0.7}
            style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace", letterSpacing: '0.15em' }}
          >
            {SECTOR_NAMES[2]}
          </text>

          {/* ─── Supply Route Path Segments ─── */}
          {pathSegments.map((seg) => {
            const segLen = Math.sqrt((seg.x2 - seg.x1) ** 2 + (seg.y2 - seg.y1) ** 2)
            return (
              <g key={seg.idx}>
                {/* Base dim route line */}
                <line
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke={seg.completed ? '#33FF33' : '#1A3A1A'}
                  strokeWidth={seg.completed ? 2.5 : 1.5}
                  strokeDasharray={seg.completed ? 'none' : '8 6'}
                  strokeLinecap="butt"
                  opacity={seg.completed ? 0.8 : 0.5}
                />
                {/* Animated supply movement dots on completed routes */}
                {seg.completed && (
                  <>
                    <circle r={2.5} fill="#33FF33" opacity={0.8}>
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={`M${seg.x1},${seg.y1} L${seg.x2},${seg.y2}`}
                      />
                      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle r={2} fill="#33FF33" opacity={0.5}>
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        begin="1.5s"
                        path={`M${seg.x1},${seg.y1} L${seg.x2},${seg.y2}`}
                      />
                      <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" begin="1.5s" />
                    </circle>
                  </>
                )}
              </g>
            )
          })}

          {/* ─── Sector Gate Installations ─── */}
          {SECTOR_GATES.map((gate, i) => {
            const isOpen = gate.connects[0] === 1 ? isLevelComplete(1) : isLevelComplete(2)
            const gateColor = isOpen ? '#33FF33' : '#2A2A2A'
            const textColor = isOpen ? '#33FF33' : '#555'
            return (
              <g key={`gate-${i}`}>
                {/* Gate structure - military checkpoint */}
                <rect
                  x={gate.x - 25}
                  y={gate.y - 18}
                  width={50}
                  height={36}
                  fill={isOpen ? '#1A2A14' : '#1A1A1A'}
                  stroke={gateColor}
                  strokeWidth={2}
                />
                {/* Hazard stripe top */}
                <line
                  x1={gate.x - 25}
                  y1={gate.y - 18}
                  x2={gate.x + 25}
                  y2={gate.y - 18}
                  stroke={isOpen ? '#FFB800' : '#333'}
                  strokeWidth={3}
                />
                {/* Gate symbol */}
                <text
                  x={gate.x}
                  y={gate.y + 4}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="12"
                  style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.1em' }}
                >
                  {isOpen ? 'OPEN' : 'LOCKED'}
                </text>
                {/* Green blinking light when open */}
                {isOpen && (
                  <circle cx={gate.x + 20} cy={gate.y - 10} r={3} fill="#33FF33">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Red light when locked */}
                {!isOpen && (
                  <circle cx={gate.x + 20} cy={gate.y - 10} r={3} fill="#FF2020" opacity={0.6}>
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            )
          })}

          {/* ─── Inter-sector narrative text ─── */}
          {isLevelComplete(1) && (
            <text
              x={500}
              y={440}
              textAnchor="middle"
              fill="#FFB800"
              fontSize="11"
              opacity={0.6}
              style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.2em' }}
            >
              {'>> ADVANCING TO SECTOR BRAVO >>'}
            </text>
          )}
          {isLevelComplete(2) && (
            <text
              x={500}
              y={210}
              textAnchor="middle"
              fill="#FFB800"
              fontSize="11"
              opacity={0.6}
              style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.2em' }}
            >
              {'>> FINAL ASSAULT >>'}
            </text>
          )}

          {/* ─── Base Installation Nodes ─── */}
          {RA_NODES.map((node, i) => {
            const demo = allDemos[i]
            if (!demo) return null
            const done = completed.has(demo.id)
            const levelIdx = Math.floor(i / 3)
            const isLocked = levelIdx > 0 && !isLevelComplete(levelIdx)
            const isCurrent = i === currentNodeIdx
            const baseSize = isCurrent ? 28 : 24

            return (
              <g
                key={i}
                onClick={() => handleNodeClick(i)}
                style={{ cursor: isLocked ? 'default' : 'pointer' }}
              >
                {/* Current node: radar ping expanding ring */}
                {isCurrent && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={36}
                      fill="none"
                      stroke="#33FF33"
                      strokeWidth={1.5}
                      opacity={0}
                    >
                      <animate attributeName="r" values="28;48;28" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={30}
                      fill="none"
                      stroke="#33FF33"
                      strokeWidth={1}
                      opacity={0}
                    >
                      <animate attributeName="r" values="28;42;28" dur="2.5s" begin="0.3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" begin="0.3s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* Node glow background for active/done nodes */}
                {!isLocked && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={baseSize + 6}
                    fill={done ? 'rgba(51,255,51,0.08)' : 'rgba(51,255,51,0.04)'}
                  />
                )}

                {/* Base installation shape - octagonal military base */}
                <polygon
                  points={octagonPoints(node.x, node.y, baseSize)}
                  fill={
                    done ? '#1A3A1A'
                    : isLocked ? '#1A1A1A'
                    : '#1A2A14'
                  }
                  stroke={
                    done ? '#33FF33'
                    : isLocked ? '#2A2A2A'
                    : '#33FF33'
                  }
                  strokeWidth={done ? 2.5 : 2}
                  opacity={isLocked ? 0.35 : 1}
                  filter={done ? 'url(#ra-glow)' : isCurrent ? 'url(#ra-glow-strong)' : undefined}
                />

                {/* Inner detail - crosshair or status */}
                {done ? (
                  <>
                    {/* Completed: solid green diamond indicator */}
                    <polygon
                      points={`${node.x},${node.y - 8} ${node.x + 8},${node.y} ${node.x},${node.y + 8} ${node.x - 8},${node.y}`}
                      fill="#33FF33"
                      opacity={0.9}
                    />
                    {/* Checkmark */}
                    <polyline
                      points={`${node.x - 4},${node.y} ${node.x - 1},${node.y + 3} ${node.x + 5},${node.y - 4}`}
                      fill="none"
                      stroke="#0A1208"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : isLocked ? (
                  <>
                    {/* Locked: classified X */}
                    <line x1={node.x - 6} y1={node.y - 6} x2={node.x + 6} y2={node.y + 6} stroke="#555" strokeWidth={2} />
                    <line x1={node.x + 6} y1={node.y - 6} x2={node.x - 6} y2={node.y + 6} stroke="#555" strokeWidth={2} />
                  </>
                ) : (
                  <>
                    {/* Active: crosshair target */}
                    <line x1={node.x} y1={node.y - 10} x2={node.x} y2={node.y - 4} stroke="#33FF33" strokeWidth={1.5} opacity={0.8} />
                    <line x1={node.x} y1={node.y + 4} x2={node.x} y2={node.y + 10} stroke="#33FF33" strokeWidth={1.5} opacity={0.8} />
                    <line x1={node.x - 10} y1={node.y} x2={node.x - 4} y2={node.y} stroke="#33FF33" strokeWidth={1.5} opacity={0.8} />
                    <line x1={node.x + 4} y1={node.y} x2={node.x + 10} y2={node.y} stroke="#33FF33" strokeWidth={1.5} opacity={0.8} />
                    <circle cx={node.x} cy={node.y} r={2} fill="#33FF33" opacity={0.9}>
                      <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* Burst effect on newly completed */}
                {burstNodes.has(demo.id) && (
                  <>
                    <circle cx={node.x} cy={node.y} r={baseSize} fill="none" stroke="#33FF33" strokeWidth={2}>
                      <animate attributeName="r" values={`${baseSize};${baseSize + 30}`} dur="0.8s" fill="freeze" />
                      <animate attributeName="opacity" values="0.8;0" dur="0.8s" fill="freeze" />
                    </circle>
                    <circle cx={node.x} cy={node.y} r={baseSize} fill="none" stroke="#33FF33" strokeWidth={1.5}>
                      <animate attributeName="r" values={`${baseSize};${baseSize + 20}`} dur="0.6s" begin="0.1s" fill="freeze" />
                      <animate attributeName="opacity" values="0.6;0" dur="0.6s" begin="0.1s" fill="freeze" />
                    </circle>
                  </>
                )}

                {/* Node label */}
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
                      y={node.y + baseSize + 16}
                      textAnchor="middle"
                      fill="#CCFFCC"
                      fontSize="9"
                      style={{
                        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                        letterSpacing: '0.05em',
                      }}
                    >
                      <tspan x={node.x} dy="0">{line1.toUpperCase()}</tspan>
                      {line2 && <tspan x={node.x} dy="12">{line2.toUpperCase()}</tspan>}
                    </text>
                  )
                })()}

                {/* Score stars for completed nodes */}
                {done && choiceScores[demo.id] && (
                  <text
                    x={node.x}
                    y={node.y + baseSize + (demo.title.length > 20 ? 44 : 32)}
                    textAnchor="middle"
                    fill="#33FF33"
                    fontSize="11"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    {Array.from({ length: 3 }, (_, s) =>
                      s < choiceScores[demo.id] ? '\u2605' : '\u2606'
                    ).join('')}
                  </text>
                )}

                {/* Coordinate label (small, dim) */}
                <text
                  x={node.x + baseSize + 6}
                  y={node.y - baseSize + 4}
                  fill="#33FF33"
                  fontSize="7"
                  opacity={isLocked ? 0.15 : 0.3}
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  {`${String.fromCharCode(65 + levelIdx)}${i % 3 + 1}`}
                </text>
              </g>
            )
          })}

          {/* ─── Command HQ at the end ─── */}
          {(() => {
            const cx = RA_NODES[8].x + 60
            const cy = RA_NODES[8].y
            const allClear = allAvailableComplete
            return (
              <g>
                {/* Main HQ building */}
                <rect
                  x={cx - 20}
                  y={cy - 30}
                  width={40}
                  height={40}
                  fill={allClear ? '#1A3A1A' : '#1A1A1A'}
                  stroke={allClear ? '#33FF33' : '#2A2A2A'}
                  strokeWidth={2}
                />
                {/* Antenna */}
                <line
                  x1={cx}
                  y1={cy - 30}
                  x2={cx}
                  y2={cy - 50}
                  stroke={allClear ? '#33FF33' : '#2A2A2A'}
                  strokeWidth={2}
                />
                {/* Antenna blip */}
                {allClear && (
                  <circle cx={cx} cy={cy - 52} r={3} fill="#33FF33">
                    <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Radar dish */}
                <ellipse
                  cx={cx}
                  cy={cy - 45}
                  rx={8}
                  ry={3}
                  fill="none"
                  stroke={allClear ? '#33FF33' : '#2A2A2A'}
                  strokeWidth={1.5}
                />
                {/* HQ label */}
                <text
                  x={cx}
                  y={cy + 24}
                  textAnchor="middle"
                  fill={allClear ? '#33FF33' : '#555'}
                  fontSize="8"
                  style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.15em' }}
                >
                  CMD HQ
                </text>
                {/* Hazard stripe on HQ */}
                <line
                  x1={cx - 20}
                  y1={cy + 10}
                  x2={cx + 20}
                  y2={cy + 10}
                  stroke={allClear ? '#FFB800' : '#333'}
                  strokeWidth={2}
                />
              </g>
            )
          })()}

          {/* ─── Player Position Indicator ─── */}
          {playerNodeIdx >= 0 && (
            <g>
              {/* Blinking unit marker above the last completed node */}
              <polygon
                points={`${RA_NODES[playerNodeIdx].x},${RA_NODES[playerNodeIdx].y - 42} ${RA_NODES[playerNodeIdx].x - 6},${RA_NODES[playerNodeIdx].y - 50} ${RA_NODES[playerNodeIdx].x + 6},${RA_NODES[playerNodeIdx].y - 50} `}
                fill="#33FF33"
              >
                <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite" />
              </polygon>
              <text
                x={RA_NODES[playerNodeIdx].x}
                y={RA_NODES[playerNodeIdx].y - 55}
                textAnchor="middle"
                fill="#33FF33"
                fontSize="8"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                YOU
              </text>
            </g>
          )}

          {/* ─── Ambient radar blips (decoration) ─── */}
          {[
            { x: 120, y: 80, delay: '0s' },
            { x: 870, y: 200, delay: '2s' },
            { x: 350, y: 450, delay: '4s' },
            { x: 780, y: 600, delay: '1s' },
            { x: 60, y: 400, delay: '3s' },
          ].map((blip, i) => (
            <circle
              key={`blip-${i}`}
              cx={blip.x}
              cy={blip.y}
              r={2}
              fill="#33FF33"
              opacity={0}
            >
              <animate
                attributeName="opacity"
                values="0;0.5;0"
                dur="6s"
                begin={blip.delay}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="1;3;1"
                dur="6s"
                begin={blip.delay}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>

        {/* ─── Overlay UI Elements ─── */}
        <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="max-w-5xl mx-auto">
            <BadgeTray />
          </div>

          {allAvailableComplete && (
            <div className="text-center mt-2">
              <button
                onClick={() => {
                  playSound('ra-campaign-complete')
                  router.push('/victory')
                }}
                className="px-6 py-3 font-bold text-sm transition-all duration-300"
                style={{
                  background: 'var(--ra-panel)',
                  border: '2px solid var(--ra-green)',
                  color: 'var(--ra-green)',
                  fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                  letterSpacing: '0.15em',
                  boxShadow: '0 0 16px rgba(51, 255, 51, 0.3)',
                }}
              >
                CAMPAIGN COMPLETE - VIEW RESULTS
              </button>
            </div>
          )}
        </div>

        {/* Bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-12 flex items-center justify-center gap-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs transition-colors"
            style={{
              color: 'rgba(204, 255, 204, 0.4)',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.1em',
            }}
          >
            ABORT MISSION
          </button>
        </div>

        {/* Floating stats widget */}
        <div className="absolute bottom-0 right-0 z-20">
          <RedAlertStatsWidget
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

// ─── Helper: Generate octagon points for a given center and radius ──────────
function octagonPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 8) + (i * Math.PI / 4)
    const px = cx + r * Math.cos(angle)
    const py = cy + r * Math.sin(angle)
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`)
  }
  return pts.join(' ')
}
