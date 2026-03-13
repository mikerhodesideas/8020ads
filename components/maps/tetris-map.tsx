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

// Tetromino piece colors (classic NES palette)
const PIECE_COLORS = {
  I: '#00F0F0',
  O: '#F0F000',
  T: '#A000F0',
  S: '#00F000',
  Z: '#F00000',
  J: '#0000F0',
  L: '#F0A000',
}

// Each node gets a tetromino type for its visual style
const NODE_PIECES: (keyof typeof PIECE_COLORS)[] = [
  'I', 'T', 'L',   // Level 1 (bottom row)
  'S', 'O', 'Z',   // Level 2 (middle row)
  'J', 'I', 'T',   // Level 3 (top row)
]

// The Tetris well: 10 columns wide, nodes stacked bottom-to-top
// viewBox: 0 0 1000 800
// Well area: roughly centered, 10-col grid
const WELL_LEFT = 180
const WELL_RIGHT = 720
const WELL_TOP = 60
const WELL_BOTTOM = 680
const WELL_WIDTH = WELL_RIGHT - WELL_LEFT
const WELL_HEIGHT = WELL_BOTTOM - WELL_TOP
const CELL_SIZE = WELL_WIDTH / 10  // 54px per cell

// Node positions within the well (bottom-to-top, 3 per row)
// Each node occupies a 2x2 block area (like an O-piece slot)
const TETRIS_NODES = [
  // Level 1 (bottom row, y ~ 580)
  { x: WELL_LEFT + CELL_SIZE * 1.5, y: 590, level: 1, col: 1 },
  { x: WELL_LEFT + CELL_SIZE * 4.5, y: 580, level: 1, col: 4 },
  { x: WELL_LEFT + CELL_SIZE * 7.5, y: 595, level: 1, col: 7 },
  // Level 2 (middle row, y ~ 380)
  { x: WELL_LEFT + CELL_SIZE * 2, y: 390, level: 2, col: 2 },
  { x: WELL_LEFT + CELL_SIZE * 5, y: 375, level: 2, col: 5 },
  { x: WELL_LEFT + CELL_SIZE * 8, y: 385, level: 2, col: 8 },
  // Level 3 (top row, y ~ 180)
  { x: WELL_LEFT + CELL_SIZE * 1.5, y: 185, level: 3, col: 1 },
  { x: WELL_LEFT + CELL_SIZE * 5, y: 170, level: 3, col: 5 },
  { x: WELL_LEFT + CELL_SIZE * 8, y: 180, level: 3, col: 8 },
]

// Draw a single tetromino block with 3D bevel effect
function TetrominoBlock({
  x,
  y,
  size,
  color,
  opacity = 1,
  className,
}: {
  x: number
  y: number
  size: number
  color: string
  opacity?: number
  className?: string
}) {
  return (
    <g opacity={opacity} className={className}>
      {/* Main face */}
      <rect x={x} y={y} width={size} height={size} fill={color} />
      {/* Top highlight bevel */}
      <rect x={x} y={y} width={size} height={size * 0.15} fill="white" opacity={0.3} />
      {/* Left highlight bevel */}
      <rect x={x} y={y} width={size * 0.15} height={size} fill="white" opacity={0.2} />
      {/* Bottom shadow bevel */}
      <rect x={x} y={y + size * 0.85} width={size} height={size * 0.15} fill="black" opacity={0.3} />
      {/* Right shadow bevel */}
      <rect x={x + size * 0.85} y={y} width={size * 0.15} height={size} fill="black" opacity={0.2} />
      {/* Inner shine */}
      <rect x={x + size * 0.2} y={y + size * 0.2} width={size * 0.35} height={size * 0.35} fill="white" opacity={0.12} />
    </g>
  )
}

// Draw a tetromino shape (2-block arrangements around center)
function TetrominoPiece({
  cx,
  cy,
  piece,
  blockSize,
  ghost,
  glow,
  className,
}: {
  cx: number
  cy: number
  piece: keyof typeof PIECE_COLORS
  blockSize: number
  ghost?: boolean
  glow?: boolean
  className?: string
}) {
  const color = PIECE_COLORS[piece]
  const s = blockSize
  const half = s / 2

  // Tetromino block offsets from center (each is a 2x2 or 4x1 arrangement)
  const layouts: Record<keyof typeof PIECE_COLORS, [number, number][]> = {
    I: [[-1.5, -0.5], [-0.5, -0.5], [0.5, -0.5], [1.5, -0.5]],
    O: [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]],
    T: [[-1, -0.5], [0, -0.5], [1, -0.5], [0, 0.5]],
    S: [[0, -0.5], [1, -0.5], [-1, 0.5], [0, 0.5]],
    Z: [[-1, -0.5], [0, -0.5], [0, 0.5], [1, 0.5]],
    J: [[-1, -0.5], [-1, 0.5], [0, 0.5], [1, 0.5]],
    L: [[1, -0.5], [-1, 0.5], [0, 0.5], [1, 0.5]],
  }

  const blocks = layouts[piece]

  if (ghost) {
    return (
      <g className={className}>
        {blocks.map((b, i) => (
          <rect
            key={i}
            x={cx + b[0] * s - half}
            y={cy + b[1] * s - half}
            width={s}
            height={s}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={2}
            strokeDasharray="4 3"
          />
        ))}
      </g>
    )
  }

  return (
    <g className={className}>
      {/* Glow filter if completed */}
      {glow && (
        <rect
          x={cx - s * 2}
          y={cy - s * 1.5}
          width={s * 4}
          height={s * 3}
          fill="none"
          filter="url(#tetris-glow)"
        />
      )}
      {blocks.map((b, i) => (
        <TetrominoBlock
          key={i}
          x={cx + b[0] * s - half}
          y={cy + b[1] * s - half}
          size={s}
          color={color}
        />
      ))}
    </g>
  )
}

// Tetris stats widget (side panel style)
function TetrisStatsWidget({
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
            background: 'var(--tetris-void, #0A0A0A)',
            borderColor: 'var(--tetris-i, #00F0F0)',
            borderRadius: '0px',
          }}
        >
          <div className="space-y-2 text-xs" style={{ fontFamily: "'Courier New', monospace" }}>
            <div className="flex justify-between gap-6">
              <span className="text-white/50 uppercase" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>Lines</span>
              <span className="font-bold" style={{ color: 'var(--tetris-i, #00F0F0)' }}>{skillCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/50 uppercase" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>Pieces</span>
              <span className="font-bold" style={{ color: 'var(--tetris-i, #00F0F0)' }}>{completedCount}/{availableCount}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-white/50 uppercase" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>Time</span>
              <span className="font-bold" style={{ color: 'var(--tetris-i, #00F0F0)' }}>{timeSavedLabel}</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onToggle}
        className="px-3 py-1.5 text-xs font-semibold border-2 shadow-md transition-all duration-200 uppercase"
        style={{
          background: 'var(--tetris-void, #0A0A0A)',
          borderColor: 'var(--tetris-i, #00F0F0)',
          color: 'var(--tetris-i, #00F0F0)',
          borderRadius: '0px',
          fontFamily: "'Courier New', monospace",
          letterSpacing: '0.08em',
        }}
      >
        {completedCount}/{availableCount} clear
      </button>
    </div>
  )
}

// "NEXT" piece preview (decorative, shown on the right side)
function NextPiecePreview({ piece }: { piece: keyof typeof PIECE_COLORS }) {
  const color = PIECE_COLORS[piece]
  const s = 12
  const layouts: Record<keyof typeof PIECE_COLORS, [number, number][]> = {
    I: [[-1.5, 0], [-0.5, 0], [0.5, 0], [1.5, 0]],
    O: [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]],
    T: [[-1, 0], [0, 0], [1, 0], [0, 1]],
    S: [[0, 0], [1, 0], [-1, 1], [0, 1]],
    Z: [[-1, 0], [0, 0], [0, 1], [1, 1]],
    J: [[-1, 0], [-1, 1], [0, 1], [1, 1]],
    L: [[1, 0], [-1, 1], [0, 1], [1, 1]],
  }
  const blocks = layouts[piece]
  const cx = 40
  const cy = 28
  return (
    <g>
      {blocks.map((b, i) => (
        <TetrominoBlock
          key={i}
          x={cx + b[0] * s}
          y={cy + b[1] * s}
          size={s}
          color={color}
        />
      ))}
    </g>
  )
}

export interface TetrisMapProps {
  skin: SkinConfig
  showCelebration: boolean
  celebrationLevel: number
  onDismissCelebration: () => void
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}

export default function TetrisMap({
  skin,
  showCelebration,
  celebrationLevel,
  onDismissCelebration,
  statsExpanded,
  setStatsExpanded,
}: TetrisMapProps) {
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
    const prevKey = 'tetris-prev-completed'
    const prev = new Set<number>(JSON.parse(sessionStorage.getItem(prevKey) || '[]'))
    const newlyDone = new Set<number>()
    completed.forEach((id) => {
      if (!prev.has(id)) newlyDone.add(id)
    })
    if (newlyDone.size > 0) {
      setBurstNodes(newlyDone)
      const timer = setTimeout(() => setBurstNodes(new Set()), 600)
      sessionStorage.setItem(prevKey, JSON.stringify(Array.from(completed)))
      return () => clearTimeout(timer)
    }
    sessionStorage.setItem(prevKey, JSON.stringify(Array.from(completed)))
  }, [completed])

  // Check for completed rows (all 3 nodes in a level complete) and trigger line-clear
  // Derive clearingRows from game state instead of useEffect to avoid infinite re-renders
  const clearingRowsDerived = new Set<number>()
  levels.forEach((level, levelIdx) => {
    const allDone = level.demos.every(d => completed.has(d.id))
    if (allDone && level.demos.length > 0) {
      clearingRowsDerived.add(levelIdx + 1)
    }
  })

  // Find last completed node index for player indicator
  let playerNodeIdx = -1
  for (let i = TETRIS_NODES.length - 1; i >= 0; i--) {
    if (allDemos[i] && completed.has(allDemos[i].id)) {
      playerNodeIdx = i
      break
    }
  }

  // Find the first uncompleted node (current target)
  let currentNodeIdx = -1
  for (let i = 0; i < TETRIS_NODES.length; i++) {
    if (allDemos[i] && !completed.has(allDemos[i].id)) {
      const levelIdx = Math.floor(i / 3)
      const isLocked = levelIdx > 0 && !isLevelComplete(levelIdx)
      if (!isLocked) {
        currentNodeIdx = i
        break
      }
    }
  }

  // Determine the "next piece" to show in the preview
  const nextPieceType = currentNodeIdx >= 0 ? NODE_PIECES[currentNodeIdx] : 'T'

  const handleNodeClick = (nodeIdx: number) => {
    const demo = allDemos[nodeIdx]
    if (!demo) return
    const levelIdx = Math.floor(nodeIdx / 3)
    const isLocked = levelIdx > 0 && !isLevelComplete(levelIdx)
    if (isLocked) return
    playSound('tetris-soft-drop')
    navigateWithTransition(`/play/${demo.id}`)
  }

  // Build path segments between consecutive nodes
  const pathSegments: { x1: number; y1: number; x2: number; y2: number; completed: boolean; idx: number }[] = []
  for (let i = 0; i < TETRIS_NODES.length - 1; i++) {
    const a = TETRIS_NODES[i]
    const b = TETRIS_NODES[i + 1]
    const segCompleted = allDemos[i] ? completed.has(allDemos[i].id) : false
    pathSegments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, completed: segCompleted, idx: i })
  }

  // Score calculation (decorative)
  const score = completed.size * 100 + (skills.size * 40)

  return (
    <div className="page-enter min-h-[calc(100vh-3.5rem)] flex flex-col skin-tetris">
      <BadgeToast />

      <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--tetris-void, #0A0A0A)' }}>
        {/* SVG Tetris Well Map */}
        <svg
          viewBox="0 0 1000 800"
          className="w-full h-auto max-h-[calc(100vh-3.5rem)]"
          preserveAspectRatio="xMidYMid meet"
          style={{ minHeight: '500px' }}
        >
          <defs>
            {/* Glow filter for completed pieces */}
            <filter id="tetris-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Stronger glow for current node pulse */}
            <filter id="tetris-pulse-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* World background image */}
          <image href={`/images/maps/tetris-level-${isLevelComplete(2) ? 3 : isLevelComplete(1) ? 2 : 1}.png`} x="0" y="0" width="1000" height="800" preserveAspectRatio="xMidYMid slice" />
          {/* Dark overlay for readability */}
          <rect width="1000" height="800" fill="#0A0A0A" opacity="0.55" />

          {/* Background grid lines (the Tetris matrix) */}
          {/* Vertical grid lines */}
          {Array.from({ length: 11 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={WELL_LEFT + i * CELL_SIZE}
              y1={WELL_TOP}
              x2={WELL_LEFT + i * CELL_SIZE}
              y2={WELL_BOTTOM}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
            />
          ))}
          {/* Horizontal grid lines */}
          {Array.from({ length: Math.floor(WELL_HEIGHT / CELL_SIZE) + 1 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={WELL_LEFT}
              y1={WELL_TOP + i * CELL_SIZE}
              x2={WELL_RIGHT}
              y2={WELL_TOP + i * CELL_SIZE}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
            />
          ))}

          {/* Well border (the walls of the Tetris playfield) */}
          <rect
            x={WELL_LEFT - 3}
            y={WELL_TOP - 3}
            width={WELL_WIDTH + 6}
            height={WELL_HEIGHT + 6}
            fill="none"
            stroke="var(--tetris-grid, #1A1A2E)"
            strokeWidth={3}
          />
          {/* Inner well highlight */}
          <rect
            x={WELL_LEFT}
            y={WELL_TOP}
            width={WELL_WIDTH}
            height={WELL_HEIGHT}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />

          {/* Bottom floor of the well */}
          <rect
            x={WELL_LEFT - 3}
            y={WELL_BOTTOM}
            width={WELL_WIDTH + 6}
            height={4}
            fill="var(--tetris-grid, #1A1A2E)"
          />

          {/* Scattered ghost blocks on the floor (decorative) */}
          {[0, 2, 3, 6, 9].map((col) => (
            <rect
              key={`floor-${col}`}
              x={WELL_LEFT + col * CELL_SIZE + 2}
              y={WELL_BOTTOM - CELL_SIZE + 2}
              width={CELL_SIZE - 4}
              height={CELL_SIZE - 4}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
            />
          ))}

          {/* LEFT SIDE PANEL: Score + Level */}
          <g>
            {/* Panel frame */}
            <rect x={20} y={60} width={130} height={220} fill="rgba(10,10,10,0.9)" stroke="var(--tetris-grid, #1A1A2E)" strokeWidth={2} />

            {/* SCORE label */}
            <text x={85} y={95} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="'Courier New', monospace" letterSpacing="0.12em">
              SCORE
            </text>
            <text x={85} y={122} textAnchor="middle" fill="var(--tetris-i, #00F0F0)" fontSize="18" fontWeight="bold" fontFamily="'Courier New', monospace">
              {String(score).padStart(6, '0')}
            </text>

            {/* LINES label */}
            <text x={85} y={160} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="'Courier New', monospace" letterSpacing="0.12em">
              LINES
            </text>
            <text x={85} y={187} textAnchor="middle" fill="var(--tetris-s, #00F000)" fontSize="18" fontWeight="bold" fontFamily="'Courier New', monospace">
              {completed.size}/{availableDemoCount}
            </text>

            {/* LEVEL label */}
            <text x={85} y={225} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="'Courier New', monospace" letterSpacing="0.12em">
              LEVEL
            </text>
            <text x={85} y={252} textAnchor="middle" fill="var(--tetris-l, #F0A000)" fontSize="18" fontWeight="bold" fontFamily="'Courier New', monospace">
              {isLevelComplete(3) ? '3' : isLevelComplete(2) ? '3' : isLevelComplete(1) ? '2' : '1'}
            </text>
          </g>

          {/* RIGHT SIDE PANEL: Next piece preview */}
          <g>
            {/* Panel frame */}
            <rect x={760} y={60} width={130} height={130} fill="rgba(10,10,10,0.9)" stroke="var(--tetris-grid, #1A1A2E)" strokeWidth={2} />

            {/* NEXT label */}
            <text x={825} y={90} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="'Courier New', monospace" letterSpacing="0.12em">
              NEXT
            </text>

            {/* Next piece preview */}
            <g transform={`translate(${785}, ${95})`}>
              <NextPiecePreview piece={nextPieceType} />
            </g>
          </g>

          {/* RIGHT SIDE PANEL: Statistics */}
          <g>
            <rect x={760} y={210} width={130} height={70} fill="rgba(10,10,10,0.9)" stroke="var(--tetris-grid, #1A1A2E)" strokeWidth={2} />
            <text x={825} y={240} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="'Courier New', monospace" letterSpacing="0.12em">
              SKILLS
            </text>
            <text x={825} y={265} textAnchor="middle" fill="var(--tetris-t, #A000F0)" fontSize="16" fontWeight="bold" fontFamily="'Courier New', monospace">
              {skills.size}
            </text>
          </g>

          {/* Level row labels */}
          <text
            x={WELL_LEFT + WELL_WIDTH / 2}
            y={650}
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="13"
            fontWeight="bold"
            fontFamily="'Courier New', monospace"
            letterSpacing="0.2em"
          >
            LEVEL 1
          </text>
          <text
            x={WELL_LEFT + WELL_WIDTH / 2}
            y={445}
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="13"
            fontWeight="bold"
            fontFamily="'Courier New', monospace"
            letterSpacing="0.2em"
          >
            LEVEL 2
          </text>
          <text
            x={WELL_LEFT + WELL_WIDTH / 2}
            y={240}
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="13"
            fontWeight="bold"
            fontFamily="'Courier New', monospace"
            letterSpacing="0.2em"
          >
            LEVEL 3
          </text>

          {/* Line-clear flash for completed rows */}
          {clearingRowsDerived.has(1) && (
            <rect
              x={WELL_LEFT}
              y={560}
              width={WELL_WIDTH}
              height={60}
              fill="white"
              opacity={0}
            >
              <animate attributeName="opacity" values="0;0.15;0" dur="3s" repeatCount="indefinite" />
            </rect>
          )}
          {clearingRowsDerived.has(2) && (
            <rect
              x={WELL_LEFT}
              y={355}
              width={WELL_WIDTH}
              height={60}
              fill="white"
              opacity={0}
            >
              <animate attributeName="opacity" values="0;0.15;0" dur="3s" repeatCount="indefinite" />
            </rect>
          )}
          {clearingRowsDerived.has(3) && (
            <rect
              x={WELL_LEFT}
              y={150}
              width={WELL_WIDTH}
              height={60}
              fill="white"
              opacity={0}
            >
              <animate attributeName="opacity" values="0;0.15;0" dur="3s" repeatCount="indefinite" />
            </rect>
          )}

          {/* Path segments (vertical dotted lines between nodes) */}
          {pathSegments.map((seg) => (
            <line
              key={seg.idx}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={seg.completed ? 'var(--tetris-i, #00F0F0)' : 'rgba(255,255,255,0.08)'}
              strokeWidth={seg.completed ? 3 : 2}
              strokeDasharray={seg.completed ? 'none' : '6 6'}
              strokeLinecap="square"
            />
          ))}

          {/* Level transition markers */}
          {isLevelComplete(1) && (
            <g>
              <line x1={WELL_LEFT + 20} y1={490} x2={WELL_RIGHT - 20} y2={490} stroke="var(--tetris-i, #00F0F0)" strokeWidth={1} opacity={0.3} strokeDasharray="2 4" />
              <text
                x={WELL_LEFT + WELL_WIDTH / 2}
                y={505}
                textAnchor="middle"
                fill="var(--tetris-i, #00F0F0)"
                fontSize="10"
                fontFamily="'Courier New', monospace"
                letterSpacing="0.15em"
                opacity={0.5}
              >
                LEVEL UP
              </text>
            </g>
          )}
          {isLevelComplete(2) && (
            <g>
              <line x1={WELL_LEFT + 20} y1={290} x2={WELL_RIGHT - 20} y2={290} stroke="var(--tetris-t, #A000F0)" strokeWidth={1} opacity={0.3} strokeDasharray="2 4" />
              <text
                x={WELL_LEFT + WELL_WIDTH / 2}
                y={305}
                textAnchor="middle"
                fill="var(--tetris-t, #A000F0)"
                fontSize="10"
                fontFamily="'Courier New', monospace"
                letterSpacing="0.15em"
                opacity={0.5}
              >
                LEVEL UP
              </text>
            </g>
          )}

          {/* Nodes (tetromino pieces) */}
          {TETRIS_NODES.map((node, i) => {
            const demo = allDemos[i]
            if (!demo) return null
            const done = completed.has(demo.id)
            const levelIdx = Math.floor(i / 3)
            const isLocked = levelIdx > 0 && !isLevelComplete(levelIdx)
            const isCurrent = i === currentNodeIdx
            const pieceType = NODE_PIECES[i]
            const blockSize = isCurrent ? 24 : 22

            return (
              <g
                key={i}
                onClick={() => handleNodeClick(i)}
                style={{ cursor: isLocked ? 'default' : 'pointer' }}
                className={cn(
                  isCurrent ? 'map-node--current' : '',
                  done ? 'map-node--complete' : '',
                )}
              >
                {/* Pulsing ring for current node */}
                {isCurrent && (
                  <rect
                    x={node.x - blockSize * 2.2}
                    y={node.y - blockSize * 1.5}
                    width={blockSize * 4.4}
                    height={blockSize * 3}
                    fill="none"
                    stroke={PIECE_COLORS[pieceType]}
                    strokeWidth={2}
                    opacity={0.4}
                    rx={0}
                  >
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-width" values="2;1;2" dur="2s" repeatCount="indefinite" />
                  </rect>
                )}

                {/* The tetromino piece */}
                {isLocked ? (
                  <TetrominoPiece
                    cx={node.x}
                    cy={node.y}
                    piece={pieceType}
                    blockSize={blockSize}
                    ghost={true}
                  />
                ) : (
                  <TetrominoPiece
                    cx={node.x}
                    cy={node.y}
                    piece={pieceType}
                    blockSize={blockSize}
                    glow={done}
                  />
                )}

                {/* Burst animation on completion */}
                {burstNodes.has(demo.id) && (
                  <rect
                    x={node.x - blockSize * 2}
                    y={node.y - blockSize * 1.5}
                    width={blockSize * 4}
                    height={blockSize * 3}
                    fill="white"
                    opacity={0}
                    rx={0}
                  >
                    <animate attributeName="opacity" values="0.6;0" dur="0.5s" fill="freeze" />
                  </rect>
                )}

                {/* Status icon overlay */}
                {done ? (
                  <text
                    x={node.x}
                    y={node.y + 6}
                    textAnchor="middle"
                    fill="white"
                    fontSize="18"
                    fontWeight="bold"
                    filter="url(#tetris-glow)"
                  >
                    {'\u2713'}
                  </text>
                ) : isLocked ? (
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.2)"
                    fontSize="14"
                  >
                    {'\u{1F512}'}
                  </text>
                ) : (
                  <text
                    x={node.x}
                    y={node.y + 7}
                    textAnchor="middle"
                    fill="white"
                    fontSize="18"
                    fontWeight="bold"
                    fontFamily="'Courier New', monospace"
                    opacity={0.9}
                  >
                    ?
                  </text>
                )}

                {/* Node title label */}
                {!isLocked && (() => {
                  const title = demo.title
                  const maxLen = 18
                  let line1 = title
                  let line2 = ''
                  if (title.length > maxLen) {
                    const sp = title.lastIndexOf(' ', maxLen)
                    if (sp > 6) {
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
                      y={node.y + blockSize + 20}
                      textAnchor="middle"
                      fill="white"
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="'Courier New', monospace"
                      letterSpacing="0.04em"
                    >
                      <tspan x={node.x} dy="0">{line1}</tspan>
                      {line2 && <tspan x={node.x} dy="12">{line2}</tspan>}
                    </text>
                  )
                })()}

                {/* Star rating for completed demos */}
                {done && choiceScores[demo.id] && (
                  <text
                    x={node.x}
                    y={node.y + blockSize + (demo.title.length > 18 ? 48 : 36)}
                    textAnchor="middle"
                    fill={PIECE_COLORS[pieceType]}
                    fontSize="11"
                    fontFamily="'Courier New', monospace"
                  >
                    {Array.from({ length: 3 }, (_, s) =>
                      s < choiceScores[demo.id] ? '\u2605' : '\u2606'
                    ).join('')}
                  </text>
                )}
              </g>
            )
          })}

          {/* Player position indicator (small block above the last completed node) */}
          {playerNodeIdx >= 0 && (() => {
            const node = TETRIS_NODES[playerNodeIdx]
            const pieceColor = PIECE_COLORS[NODE_PIECES[playerNodeIdx]]
            return (
              <g className="map-node--current">
                <rect
                  x={node.x - 8}
                  y={node.y - 40}
                  width={16}
                  height={16}
                  fill={pieceColor}
                  stroke="white"
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y - 28}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="'Courier New', monospace"
                >
                  P1
                </text>
              </g>
            )
          })()}

          {/* Decorative falling pieces at the very top (ambient animation) */}
          {[
            { x: WELL_LEFT + CELL_SIZE * 2, delay: '0s', color: PIECE_COLORS.I, dur: '8s' },
            { x: WELL_LEFT + CELL_SIZE * 6, delay: '3s', color: PIECE_COLORS.T, dur: '10s' },
            { x: WELL_LEFT + CELL_SIZE * 9, delay: '6s', color: PIECE_COLORS.Z, dur: '9s' },
          ].map((p, i) => (
            <rect
              key={`falling-${i}`}
              x={p.x - 6}
              y={WELL_TOP - 20}
              width={12}
              height={12}
              fill={p.color}
              opacity={0}
            >
              <animate
                attributeName="y"
                values={`${WELL_TOP - 20};${WELL_TOP + 50}`}
                dur={p.dur}
                begin={p.delay}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.3;0.3;0"
                dur={p.dur}
                begin={p.delay}
                repeatCount="indefinite"
              />
            </rect>
          ))}

          {/* HIGH SCORE banner when all complete */}
          {allAvailableComplete && (
            <g>
              <rect
                x={WELL_LEFT + WELL_WIDTH / 2 - 100}
                y={WELL_TOP + WELL_HEIGHT / 2 - 30}
                width={200}
                height={60}
                fill="var(--tetris-void, #0A0A0A)"
                stroke="var(--tetris-o, #F0F000)"
                strokeWidth={3}
              />
              <text
                x={WELL_LEFT + WELL_WIDTH / 2}
                y={WELL_TOP + WELL_HEIGHT / 2 + 8}
                textAnchor="middle"
                fill="var(--tetris-o, #F0F000)"
                fontSize="18"
                fontWeight="bold"
                fontFamily="'Courier New', monospace"
                letterSpacing="0.15em"
                filter="url(#tetris-glow)"
              >
                HIGH SCORE!
              </text>
              <animate attributeName="opacity" values="1;0.7;1" dur="1.5s" repeatCount="indefinite" />
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
                  playSound('tetris-high-score')
                  router.push('/victory')
                }}
                className="px-6 py-3 font-bold text-sm transition-all duration-300 text-black uppercase"
                style={{
                  background: 'var(--tetris-o, #F0F000)',
                  border: '2px solid var(--tetris-o, #F0F000)',
                  borderRadius: '0px',
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.1em',
                  boxShadow: '0 0 20px rgba(240, 240, 0, 0.4)',
                }}
              >
                VIEW HIGH SCORE
              </button>
            </div>
          )}
        </div>

        {/* Bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-12 flex items-center justify-center gap-6">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-white/30 hover:text-white/60 transition-colors uppercase"
            style={{ fontFamily: "'Courier New', monospace", letterSpacing: '0.1em' }}
          >
            Start over
          </button>
        </div>

        {/* Floating stats widget */}
        <div className="absolute bottom-0 right-0 z-20">
          <TetrisStatsWidget
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
