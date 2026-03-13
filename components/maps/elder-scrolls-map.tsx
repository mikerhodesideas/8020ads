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

// --- Constellation layout ---
// Three constellations arranged across the sky: Warrior (left), Mage (center), Thief (right)
// Each has 3 star nodes. ViewBox is 1000x700.
const CONSTELLATION_NODES = [
  // Quest Line 1: THE WARRIOR (lower-left region)
  { x: 140, y: 520, level: 1 },
  { x: 310, y: 440, level: 1 },
  { x: 200, y: 340, level: 1 },
  // Quest Line 2: THE MAGE (upper-center region)
  { x: 460, y: 320, level: 2 },
  { x: 580, y: 230, level: 2 },
  { x: 500, y: 140, level: 2 },
  // Quest Line 3: THE THIEF (right region)
  { x: 720, y: 300, level: 3 },
  { x: 860, y: 220, level: 3 },
  { x: 800, y: 110, level: 3 },
]

// Constellation names per level
const CONSTELLATION_NAMES = ['THE WARRIOR', 'THE MAGE', 'THE THIEF']
// Label positions (centered near each constellation group)
const CONSTELLATION_LABEL_POS = [
  { x: 220, y: 580 },
  { x: 510, y: 380 },
  { x: 790, y: 360 },
]

// Aurora bridge paths between constellations (curved paths connecting the groups)
const AURORA_BRIDGES = [
  // Warrior to Mage
  'M 200,340 C 280,300 380,310 460,320',
  // Mage to Thief
  'M 580,230 C 620,240 680,280 720,300',
]

// Background stars (random scattered dots for the night sky)
const BG_STARS: { x: number; y: number; r: number; opacity: number; twinkle: boolean }[] = []
// Seed a deterministic set of background stars
const STAR_SEED = [
  37, 91, 14, 68, 42, 85, 23, 56, 79, 3, 61, 48, 95, 17, 72, 34, 88, 5, 53, 26,
  70, 11, 44, 82, 39, 66, 8, 58, 93, 21, 76, 31, 64, 47, 87, 15, 52, 78, 2, 41,
  69, 96, 28, 55, 83, 10, 46, 73, 36, 89, 19, 62, 50, 81, 7, 43, 71, 99, 25, 57,
]
for (let i = 0; i < STAR_SEED.length; i++) {
  const s = STAR_SEED[i]
  BG_STARS.push({
    x: (s * 10.1 + i * 16.7) % 1000,
    y: (s * 7.3 + i * 11.9) % 700,
    r: 0.5 + (s % 3) * 0.4,
    opacity: 0.2 + (s % 5) * 0.12,
    twinkle: s % 4 === 0,
  })
}

// Nordic rune border segments (decorative corner and edge runes)
function NordicRuneBorder() {
  const gold = '#C9A84C'
  const goldFaint = 'rgba(201, 168, 76, 0.25)'
  return (
    <g>
      {/* Outer border rectangle */}
      <rect x="20" y="15" width="960" height="670" fill="none" stroke={goldFaint} strokeWidth="1" />
      {/* Corner accents - top left */}
      <line x1="20" y1="15" x2="55" y2="15" stroke={gold} strokeWidth="2" opacity="0.5" />
      <line x1="20" y1="15" x2="20" y2="50" stroke={gold} strokeWidth="2" opacity="0.5" />
      {/* Corner accents - top right */}
      <line x1="980" y1="15" x2="945" y2="15" stroke={gold} strokeWidth="2" opacity="0.5" />
      <line x1="980" y1="15" x2="980" y2="50" stroke={gold} strokeWidth="2" opacity="0.5" />
      {/* Corner accents - bottom left */}
      <line x1="20" y1="685" x2="55" y2="685" stroke={gold} strokeWidth="2" opacity="0.5" />
      <line x1="20" y1="685" x2="20" y2="650" stroke={gold} strokeWidth="2" opacity="0.5" />
      {/* Corner accents - bottom right */}
      <line x1="980" y1="685" x2="945" y2="685" stroke={gold} strokeWidth="2" opacity="0.5" />
      <line x1="980" y1="685" x2="980" y2="650" stroke={gold} strokeWidth="2" opacity="0.5" />
      {/* Midpoint rune marks */}
      <line x1="490" y1="15" x2="510" y2="15" stroke={gold} strokeWidth="1.5" opacity="0.35" />
      <line x1="490" y1="685" x2="510" y2="685" stroke={gold} strokeWidth="1.5" opacity="0.35" />
      <line x1="20" y1="345" x2="20" y2="355" stroke={gold} strokeWidth="1.5" opacity="0.35" />
      <line x1="980" y1="345" x2="980" y2="355" stroke={gold} strokeWidth="1.5" opacity="0.35" />
      {/* Small diamond rune marks on edges */}
      {[250, 750].map((cx) => (
        <polygon key={`top-${cx}`} points={`${cx},12 ${cx + 4},17 ${cx},22 ${cx - 4},17`} fill={gold} opacity="0.2" />
      ))}
      {[250, 750].map((cx) => (
        <polygon key={`bot-${cx}`} points={`${cx},682 ${cx + 4},687 ${cx},692 ${cx - 4},687`} fill={gold} opacity="0.2" />
      ))}
    </g>
  )
}

// Compass rose at the bottom center
function CompassRose({ x, y }: { x: number; y: number }) {
  const gold = '#C9A84C'
  const faint = 'rgba(201, 168, 76, 0.4)'
  const size = 18
  return (
    <g>
      {/* Outer ring */}
      <circle cx={x} cy={y} r={size + 6} fill="none" stroke={faint} strokeWidth="0.8" />
      {/* Cardinal points */}
      <polygon points={`${x},${y - size} ${x - 4},${y} ${x + 4},${y}`} fill={gold} opacity="0.6" />
      <polygon points={`${x},${y + size} ${x - 4},${y} ${x + 4},${y}`} fill={faint} />
      <polygon points={`${x - size},${y} ${x},${y - 4} ${x},${y + 4}`} fill={faint} />
      <polygon points={`${x + size},${y} ${x},${y - 4} ${x},${y + 4}`} fill={faint} />
      {/* Intercardinal points (smaller) */}
      {[45, 135, 225, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const px = x + Math.cos(rad) * (size * 0.7)
        const py = y + Math.sin(rad) * (size * 0.7)
        return <circle key={angle} cx={px} cy={py} r="1.2" fill={gold} opacity="0.35" />
      })}
      {/* Center dot */}
      <circle cx={x} cy={y} r="2" fill={gold} opacity="0.5" />
      {/* N label */}
      <text x={x} y={y - size - 8} textAnchor="middle" fill={gold} fontSize="8" fontFamily="'Cinzel', serif" opacity="0.5" letterSpacing="0.1em">
        N
      </text>
    </g>
  )
}

// A four-pointed star SVG shape for completed/active nodes
function StarPoint({ cx, cy, outerR, innerR, fill, opacity = 1, className }: {
  cx: number
  cy: number
  outerR: number
  innerR: number
  fill: string
  opacity?: number
  className?: string
}) {
  // 4-pointed star: points at 0, 90, 180, 270 degrees, inner points at 45, 135, 225, 315
  const points: string[] = []
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45 - 90) * (Math.PI / 180)
    const r = i % 2 === 0 ? outerR : innerR
    points.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`)
  }
  return (
    <polygon
      points={points.join(' ')}
      fill={fill}
      opacity={opacity}
      className={className}
    />
  )
}

// Stats widget for Elder Scrolls theme
function ElderScrollsStatsWidget({
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
          className="mb-2 p-3 border shadow-lg stats-widget-expand"
          style={{
            background: '#1A1A2A',
            borderColor: 'rgba(201, 168, 76, 0.3)',
            borderWidth: '1px',
          }}
        >
          <div className="space-y-2 text-xs" style={{ fontFamily: "'Crimson Text', Georgia, serif" }}>
            <div className="flex justify-between gap-6">
              <span style={{ color: '#5A5A5A', fontFamily: "'Cinzel', serif", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Perks Activated
              </span>
              <span className="font-bold" style={{ color: '#C9A84C' }}>{skillCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ color: '#5A5A5A', fontFamily: "'Cinzel', serif", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Quests Complete
              </span>
              <span className="font-bold" style={{ color: '#C9A84C' }}>{completedCount}/{availableCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ color: '#5A5A5A', fontFamily: "'Cinzel', serif", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Time Saved
              </span>
              <span className="font-bold" style={{ color: '#C9A84C' }}>{timeSavedLabel}</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="px-3 py-1.5 text-xs font-semibold border shadow-md transition-all duration-200"
        style={{
          background: '#1A1A2A',
          borderColor: 'rgba(201, 168, 76, 0.4)',
          color: '#C9A84C',
          fontFamily: "'Cinzel', serif",
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
        }}
      >
        {completedCount}/{availableCount} complete
      </button>
    </div>
  )
}

export interface ElderScrollsMapProps {
  skin: SkinConfig
  showCelebration: boolean
  celebrationLevel: number
  onDismissCelebration: () => void
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}

export default function ElderScrollsMap({
  skin,
  showCelebration,
  celebrationLevel,
  onDismissCelebration,
  statsExpanded,
  setStatsExpanded,
}: ElderScrollsMapProps) {
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
    const prevKey = 'es-prev-completed'
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

  // Find last completed node index for player position
  let playerNodeIdx = -1
  for (let i = CONSTELLATION_NODES.length - 1; i >= 0; i--) {
    if (allDemos[i] && completed.has(allDemos[i].id)) {
      playerNodeIdx = i
      break
    }
  }

  // Find the first uncompleted, unlocked node (current target)
  let currentNodeIdx = -1
  for (let i = 0; i < CONSTELLATION_NODES.length; i++) {
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
    playSound('es-node-select')
    navigateWithTransition(`/play/${demo.id}`)
  }

  // Build path segments between consecutive nodes within each constellation
  const pathSegments: { x1: number; y1: number; x2: number; y2: number; completed: boolean; idx: number; sameGroup: boolean }[] = []
  for (let i = 0; i < CONSTELLATION_NODES.length - 1; i++) {
    const a = CONSTELLATION_NODES[i]
    const b = CONSTELLATION_NODES[i + 1]
    const sameGroup = a.level === b.level
    const segCompleted = allDemos[i] ? completed.has(allDemos[i].id) : false
    pathSegments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, completed: segCompleted, idx: i, sameGroup })
  }

  // Determine which constellation groups are fully complete
  const constellationComplete = [
    isLevelComplete(1),
    isLevelComplete(2),
    isLevelComplete(3),
  ]

  return (
    <div className="page-enter min-h-[calc(100vh-3.5rem)] flex flex-col skin-elder-scrolls">
      <BadgeToast />

      <div className="flex-1 relative overflow-hidden" style={{ background: '#1A1A2E' }}>
        {/* SVG Constellation Map */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-auto max-h-[calc(100vh-3.5rem)]"
          preserveAspectRatio="xMidYMid meet"
          style={{ minHeight: '500px' }}
        >
          <defs>
            {/* Radial glow for completed stars */}
            <radialGradient id="es-star-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#C9A84C" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
            </radialGradient>
            {/* Blue glow for current node */}
            <radialGradient id="es-current-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7B9EC7" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#7B9EC7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#7B9EC7" stopOpacity="0" />
            </radialGradient>
            {/* Nebula gradient 1 */}
            <radialGradient id="es-nebula-1" cx="30%" cy="40%" r="40%">
              <stop offset="0%" stopColor="#7B9EC7" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#7B9EC7" stopOpacity="0" />
            </radialGradient>
            {/* Nebula gradient 2 */}
            <radialGradient id="es-nebula-2" cx="70%" cy="55%" r="35%">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.025" />
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
            </radialGradient>
            {/* Nebula gradient 3 - purple hint */}
            <radialGradient id="es-nebula-3" cx="55%" cy="25%" r="30%">
              <stop offset="0%" stopColor="#6B4C8A" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#6B4C8A" stopOpacity="0" />
            </radialGradient>
            {/* Completed constellation group glow */}
            <filter id="es-group-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Star ignite filter */}
            <filter id="es-ignite" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* World background image */}
          <image href={`/images/maps/elder-scrolls-level-${isLevelComplete(2) ? 3 : isLevelComplete(1) ? 2 : 1}.png`} x="0" y="0" width="1000" height="700" preserveAspectRatio="xMidYMid slice" />
          {/* Dark overlay for constellation readability */}
          <rect x="0" y="0" width="1000" height="700" fill="#0F0F1A" opacity="0.55" />

          {/* Faint mountain silhouette along the bottom */}
          <path
            d="M0,690 L0,640 L60,610 L120,630 L180,590 L250,620 L320,570 L380,600 L440,560 L500,585 L560,550 L620,580 L680,540 L740,570 L800,530 L860,560 L920,520 L960,545 L1000,530 L1000,700 L0,700 Z"
            fill="#0A0A14"
            opacity="0.6"
          />
          <path
            d="M0,690 L0,660 L80,640 L160,655 L240,625 L320,650 L400,615 L480,640 L560,610 L640,635 L720,605 L800,625 L880,595 L940,615 L1000,600 L1000,700 L0,700 Z"
            fill="#08080F"
            opacity="0.8"
          />

          {/* Background stars */}
          {BG_STARS.map((star, i) => (
            <g key={`bg-star-${i}`}>
              <circle
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill="#E8E4D8"
                opacity={star.opacity}
              >
                {star.twinkle && (
                  <animate
                    attributeName="opacity"
                    values={`${star.opacity};${star.opacity * 0.3};${star.opacity}`}
                    dur={`${3 + (i % 4)}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            </g>
          ))}

          {/* Nordic rune border */}
          <NordicRuneBorder />

          {/* Aurora bridges between constellations (faint curved paths) */}
          {AURORA_BRIDGES.map((path, i) => {
            const bridgeActive = i === 0 ? isLevelComplete(1) : isLevelComplete(2)
            return (
              <path
                key={`aurora-${i}`}
                d={path}
                fill="none"
                stroke={bridgeActive ? '#7B9EC7' : 'rgba(123, 158, 199, 0.08)'}
                strokeWidth={bridgeActive ? 1.5 : 1}
                strokeDasharray={bridgeActive ? 'none' : '4 6'}
                opacity={bridgeActive ? 0.3 : 0.15}
              >
                {bridgeActive && (
                  <animate
                    attributeName="opacity"
                    values="0.2;0.4;0.2"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
            )
          })}

          {/* Constellation lines (within groups) */}
          {pathSegments.filter(seg => seg.sameGroup).map((seg) => {
            const segLen = Math.sqrt((seg.x2 - seg.x1) ** 2 + (seg.y2 - seg.y1) ** 2)
            return (
              <line
                key={`line-${seg.idx}`}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke={seg.completed ? '#7B9EC7' : 'rgba(123, 158, 199, 0.15)'}
                strokeWidth={seg.completed ? 2 : 1}
                strokeLinecap="round"
                opacity={seg.completed ? 0.7 : 0.4}
                style={seg.completed ? {
                  filter: 'drop-shadow(0 0 3px rgba(123, 158, 199, 0.4))',
                } : undefined}
              >
                {seg.completed && (
                  <animate
                    attributeName="opacity"
                    values="0.5;0.8;0.5"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                )}
              </line>
            )
          })}

          {/* Constellation group labels */}
          {CONSTELLATION_NAMES.map((name, i) => {
            const pos = CONSTELLATION_LABEL_POS[i]
            const levelIdx = i + 1
            const isLocked = i > 0 && !isLevelComplete(i)
            const isComplete = constellationComplete[i]
            return (
              <text
                key={`label-${i}`}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                fill={isComplete ? '#C9A84C' : isLocked ? '#2A2A3A' : '#8A8A9A'}
                fontSize="22"
                fontFamily="'Cinzel', 'Palatino Linotype', serif"
                fontWeight="700"
                letterSpacing="0.14em"
                opacity={isLocked ? 0.4 : isComplete ? 1 : 0.75}
              >
                {name}
              </text>
            )
          })}

          {/* Narrative text between constellations */}
          {isLevelComplete(1) && (
            <text
              x={340}
              y={395}
              textAnchor="middle"
              fill="#C9A84C"
              fontSize="12"
              fontFamily="'Cinzel', serif"
              fontWeight="400"
              letterSpacing="0.15em"
              opacity="0.5"
            >
              THE PATH REVEALS ITSELF
            </text>
          )}
          {isLevelComplete(2) && (
            <text
              x={660}
              y={265}
              textAnchor="middle"
              fill="#C9A84C"
              fontSize="12"
              fontFamily="'Cinzel', serif"
              fontWeight="400"
              letterSpacing="0.15em"
              opacity="0.5"
            >
              ANCIENT KNOWLEDGE AWAITS
            </text>
          )}

          {/* Constellation nodes */}
          {CONSTELLATION_NODES.map((node, i) => {
            const demo = allDemos[i]
            if (!demo) return null
            const done = completed.has(demo.id)
            const levelIdx = Math.floor(i / 3)
            const isLocked = levelIdx > 0 && !isLevelComplete(levelIdx)
            const isCurrent = i === currentNodeIdx
            const isBurst = demo && burstNodes.has(demo.id)

            // Node sizing: tap target must be >= 44px. In a 1000-unit viewbox typically rendered ~800px wide,
            // each viewbox unit ~ 0.8px, so 55 viewbox units ~ 44px.
            const tapR = 28

            return (
              <g
                key={`node-${i}`}
                onClick={() => handleNodeClick(i)}
                style={{ cursor: isLocked ? 'default' : 'pointer' }}
              >
                {/* Invisible tap target */}
                <circle cx={node.x} cy={node.y} r={tapR} fill="transparent" />

                {/* Completed star: golden glow halo */}
                {done && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={22}
                    fill="url(#es-star-glow)"
                  >
                    <animate
                      attributeName="r"
                      values="18;24;18"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Current node: pulsing blue-white glow */}
                {isCurrent && !done && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={24}
                    fill="url(#es-current-glow)"
                  >
                    <animate
                      attributeName="r"
                      values="20;28;20"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;1;0.6"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Burst ring on newly completed */}
                {isBurst && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={10}
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth={2}
                    opacity={0}
                  >
                    <animate
                      attributeName="r"
                      values="10;35"
                      dur="0.8s"
                      fill="freeze"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.9;0"
                      dur="0.8s"
                      fill="freeze"
                    />
                    <animate
                      attributeName="stroke-width"
                      values="3;0.5"
                      dur="0.8s"
                      fill="freeze"
                    />
                  </circle>
                )}

                {/* The star itself */}
                {done ? (
                  // Completed: bright golden 4-point star
                  <g filter="url(#es-ignite)">
                    <StarPoint
                      cx={node.x}
                      cy={node.y}
                      outerR={10}
                      innerR={3.5}
                      fill="#C9A84C"
                      opacity={1}
                    />
                    {/* Inner bright core */}
                    <circle cx={node.x} cy={node.y} r="3" fill="#FFFBE6" opacity="0.9" />
                  </g>
                ) : isCurrent ? (
                  // Current: pulsing blue-white star
                  <g>
                    <StarPoint
                      cx={node.x}
                      cy={node.y}
                      outerR={9}
                      innerR={3}
                      fill="#E8E4D8"
                      opacity={0.9}
                    />
                    <circle cx={node.x} cy={node.y} r="2.5" fill="#FFFFFF" opacity="0.8">
                      <animate
                        attributeName="r"
                        values="2;3.5;2"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ) : isLocked ? (
                  // Locked: barely visible dim dot
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="3"
                    fill="#3A3A4A"
                    opacity="0.25"
                  />
                ) : (
                  // Available but not current: softly glowing star
                  <g>
                    <StarPoint
                      cx={node.x}
                      cy={node.y}
                      outerR={7}
                      innerR={2.5}
                      fill="#E8E4D8"
                      opacity={0.6}
                    />
                    <circle cx={node.x} cy={node.y} r="2" fill="#E8E4D8" opacity="0.5">
                      <animate
                        attributeName="opacity"
                        values="0.4;0.7;0.4"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                )}

                {/* Node label (title) */}
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
                      y={node.y + 24}
                      textAnchor="middle"
                      fill={done ? '#C9A84C' : '#E8E4D8'}
                      fontSize="12"
                      fontWeight="500"
                      fontFamily="'Cinzel', 'Palatino Linotype', serif"
                      letterSpacing="0.04em"
                      opacity={done ? 0.95 : 0.75}
                    >
                      <tspan x={node.x} dy="0">{line1}</tspan>
                      {line2 && <tspan x={node.x} dy="14">{line2}</tspan>}
                    </text>
                  )
                })()}

                {/* Choice score stars below title */}
                {done && choiceScores[demo.id] && (
                  <text
                    x={node.x}
                    y={node.y + (demo.title.length > 20 ? 52 : 42)}
                    textAnchor="middle"
                    fill="#C9A84C"
                    fontSize="13"
                    fontFamily="'Cinzel', serif"
                  >
                    {Array.from({ length: 3 }, (_, s) =>
                      s < choiceScores[demo.id] ? '\u2605' : '\u2606'
                    ).join('')}
                  </text>
                )}
              </g>
            )
          })}

          {/* Player position indicator: compass rose at current/last completed node */}
          {playerNodeIdx >= 0 && (
            <g>
              {/* Small rotating compass indicator near last completed node */}
              <g
                style={{
                  transformOrigin: `${CONSTELLATION_NODES[playerNodeIdx].x}px ${CONSTELLATION_NODES[playerNodeIdx].y - 24}px`,
                }}
              >
                <polygon
                  points={`
                    ${CONSTELLATION_NODES[playerNodeIdx].x},${CONSTELLATION_NODES[playerNodeIdx].y - 30}
                    ${CONSTELLATION_NODES[playerNodeIdx].x - 3},${CONSTELLATION_NODES[playerNodeIdx].y - 24}
                    ${CONSTELLATION_NODES[playerNodeIdx].x},${CONSTELLATION_NODES[playerNodeIdx].y - 21}
                    ${CONSTELLATION_NODES[playerNodeIdx].x + 3},${CONSTELLATION_NODES[playerNodeIdx].y - 24}
                  `}
                  fill="#C9A84C"
                  opacity="0.8"
                >
                  <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </polygon>
              </g>
            </g>
          )}

          {/* Dragon emblem watermark (very faint) in center */}
          <g opacity="0.04" transform="translate(500, 400)">
            {/* Simplified dragon silhouette using paths */}
            <path
              d="M0,-60 C20,-55 35,-40 40,-20 C42,-10 38,0 30,10 C25,15 15,20 10,30 C8,35 12,40 20,42 L30,40 C35,38 40,42 38,48 C36,52 28,55 20,52 C12,50 5,45 0,50 C-5,45 -12,50 -20,52 C-28,55 -36,52 -38,48 C-40,42 -35,38 -30,40 L-20,42 C-12,40 -8,35 -10,30 C-15,20 -25,15 -30,10 C-38,0 -42,-10 -40,-20 C-35,-40 -20,-55 0,-60"
              fill="#C9A84C"
              stroke="none"
            />
            {/* Wings */}
            <path
              d="M30,10 C50,-5 75,-15 95,-10 C80,-5 65,5 55,15 C48,22 40,25 30,10"
              fill="#C9A84C"
            />
            <path
              d="M-30,10 C-50,-5 -75,-15 -95,-10 C-80,-5 -65,5 -55,15 C-48,22 -40,25 -30,10"
              fill="#C9A84C"
            />
          </g>

          {/* Compass rose at bottom center */}
          <CompassRose x={500} y={655} />
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
                  playSound('es-victory')
                  router.push('/victory')
                }}
                className="px-6 py-3 font-bold text-sm transition-all duration-300"
                style={{
                  background: '#2C1810',
                  border: '1px solid #C9A84C',
                  color: '#C9A84C',
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  boxShadow: '0 0 12px rgba(201, 168, 76, 0.2)',
                }}
              >
                DRAGONBORN
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
              color: 'rgba(90, 90, 90, 0.6)',
              fontFamily: "'Cinzel', serif",
              letterSpacing: '0.06em',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(90, 90, 90, 0.6)')}
          >
            Start over
          </button>
        </div>

        {/* Floating stats widget */}
        <div className="absolute bottom-0 right-0 z-20">
          <ElderScrollsStatsWidget
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
