'use client'

/**
 * TetrisBackground - decorative fixed background for the Tetris skin
 * on the demo-layout page. Shows a subtle grid, scattered tetrominoes
 * drifting downward, and "completed rows" at the bottom.
 */

const CELL = 32 // grid cell size in px

// Classic NES Tetris palette
const COLORS = {
  I: '#00F0F0',
  O: '#F0F000',
  T: '#A000F0',
  S: '#00F000',
  Z: '#F00000',
  L: '#F0A000',
  J: '#0000F0',
}

// Tetromino layouts: each block is [col, row] offset from the piece origin
type PieceKey = keyof typeof COLORS
const LAYOUTS: Record<PieceKey, [number, number][]> = {
  I: [[0, 0], [1, 0], [2, 0], [3, 0]],
  O: [[0, 0], [1, 0], [0, 1], [1, 1]],
  T: [[0, 0], [1, 0], [2, 0], [1, 1]],
  S: [[1, 0], [2, 0], [0, 1], [1, 1]],
  Z: [[0, 0], [1, 0], [1, 1], [2, 1]],
  L: [[0, 0], [0, 1], [0, 2], [1, 2]],
  J: [[1, 0], [1, 1], [1, 2], [0, 2]],
}

// A single bevelled block (SVG)
function Block({ x, y, size, color, opacity = 1 }: {
  x: number; y: number; size: number; color: string; opacity?: number
}) {
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={size} height={size} fill={color} />
      <rect x={x} y={y} width={size} height={size * 0.15} fill="white" opacity={0.25} />
      <rect x={x} y={y} width={size * 0.15} height={size} fill="white" opacity={0.15} />
      <rect x={x} y={y + size * 0.85} width={size} height={size * 0.15} fill="black" opacity={0.25} />
      <rect x={x + size * 0.85} y={y} width={size * 0.15} height={size} fill="black" opacity={0.15} />
      <rect x={x + size * 0.18} y={y + size * 0.18} width={size * 0.3} height={size * 0.3} fill="white" opacity={0.08} />
    </g>
  )
}

// A full tetromino shape drawn from its layout
function Tetromino({ piece, x, y, blockSize, opacity }: {
  piece: PieceKey; x: number; y: number; blockSize: number; opacity: number
}) {
  const blocks = LAYOUTS[piece]
  return (
    <g>
      {blocks.map((b, i) => (
        <Block
          key={i}
          x={x + b[0] * blockSize}
          y={y + b[1] * blockSize}
          size={blockSize}
          color={COLORS[piece]}
          opacity={opacity}
        />
      ))}
    </g>
  )
}

// Static tetrominoes scattered around the edges (positioned in viewport %)
const STATIC_PIECES: {
  piece: PieceKey; left: string; top: string; blockSize: number; opacity: number
}[] = [
  // Left edge
  { piece: 'L', left: '2%',  top: '8%',   blockSize: 18, opacity: 0.12 },
  { piece: 'T', left: '4%',  top: '45%',  blockSize: 16, opacity: 0.10 },
  { piece: 'S', left: '1%',  top: '72%',  blockSize: 14, opacity: 0.08 },
  // Right edge
  { piece: 'J', left: '90%', top: '12%',  blockSize: 16, opacity: 0.10 },
  { piece: 'Z', left: '88%', top: '55%',  blockSize: 18, opacity: 0.12 },
  { piece: 'I', left: '92%', top: '35%',  blockSize: 14, opacity: 0.09 },
  // Top area
  { piece: 'O', left: '35%', top: '2%',   blockSize: 14, opacity: 0.08 },
  { piece: 'T', left: '65%', top: '4%',   blockSize: 12, opacity: 0.07 },
  // Mid-edges
  { piece: 'I', left: '5%',  top: '28%',  blockSize: 12, opacity: 0.07 },
  { piece: 'O', left: '85%', top: '78%',  blockSize: 16, opacity: 0.10 },
]

// Falling pieces - slow drift animation
const FALLING_PIECES: {
  piece: PieceKey; left: string; blockSize: number; duration: string; delay: string; opacity: number
}[] = [
  { piece: 'I', left: '12%', blockSize: 14, duration: '22s', delay: '0s',  opacity: 0.15 },
  { piece: 'T', left: '78%', blockSize: 12, duration: '28s', delay: '4s',  opacity: 0.12 },
  { piece: 'S', left: '45%', blockSize: 10, duration: '25s', delay: '8s',  opacity: 0.10 },
  { piece: 'Z', left: '25%', blockSize: 12, duration: '30s', delay: '12s', opacity: 0.12 },
  { piece: 'O', left: '60%', blockSize: 14, duration: '20s', delay: '2s',  opacity: 0.13 },
  { piece: 'L', left: '88%', blockSize: 10, duration: '26s', delay: '6s',  opacity: 0.09 },
]

// Bottom "completed rows" - 3 rows of filled blocks across the screen
function CompletedRows() {
  // Use 10 columns across full width for each row
  const cols = 12
  const rowColors: PieceKey[][] = [
    ['I', 'T', 'T', 'T', 'O', 'O', 'S', 'S', 'Z', 'Z', 'L', 'J'],
    ['J', 'J', 'I', 'I', 'I', 'I', 'T', 'L', 'L', 'S', 'O', 'O'],
    ['Z', 'S', 'S', 'J', 'J', 'T', 'T', 'T', 'I', 'I', 'I', 'I'],
  ]
  const bSize = 100 / cols // percentage width per block

  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: `${CELL * 3}px` }}>
      {rowColors.map((row, rowIdx) => (
        <div key={rowIdx} className="flex w-full" style={{ height: `${CELL}px` }}>
          {row.map((piece, colIdx) => (
            <div
              key={colIdx}
              style={{
                width: `${bSize}%`,
                height: '100%',
                backgroundColor: COLORS[piece],
                opacity: 0.18 - rowIdx * 0.03,
                borderRight: '1px solid rgba(0,0,0,0.3)',
                borderBottom: '1px solid rgba(0,0,0,0.3)',
                boxShadow: `inset 2px 2px 0 rgba(255,255,255,0.15), inset -2px -2px 0 rgba(0,0,0,0.2)`,
              }}
            />
          ))}
        </div>
      ))}
      {/* Flash/glow on the top completed row - about to clear */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: `${CELL}px`,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
          animation: 'tetris-row-flash 3s ease-in-out infinite',
        }}
      />
    </div>
  )
}

export default function TetrisBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: '#0a0a14' }}>
      {/* Inline keyframes for falling and row flash animations */}
      <style>{`
        @keyframes tetris-fall {
          0% { transform: translateY(-15vh); opacity: 0; }
          5% { opacity: var(--fall-opacity, 0.12); }
          90% { opacity: var(--fall-opacity, 0.12); }
          100% { transform: translateY(105vh); opacity: 0; }
        }
        @keyframes tetris-row-flash {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes tetris-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: `${CELL}px ${CELL}px`,
        }}
      />

      {/* Faint radial glow in the center (cyan accent) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(34,211,238,0.04) 0%, transparent 60%)',
        }}
      />

      {/* Static tetrominoes scattered around edges */}
      {STATIC_PIECES.map((sp, i) => (
        <div
          key={`static-${i}`}
          className="absolute pointer-events-none"
          style={{ left: sp.left, top: sp.top }}
        >
          <svg
            width={sp.blockSize * 4 + 2}
            height={sp.blockSize * 4 + 2}
            viewBox={`0 0 ${sp.blockSize * 4 + 2} ${sp.blockSize * 4 + 2}`}
          >
            <Tetromino
              piece={sp.piece}
              x={1}
              y={1}
              blockSize={sp.blockSize}
              opacity={sp.opacity}
            />
          </svg>
        </div>
      ))}

      {/* Falling tetrominoes - slow drift animation */}
      {FALLING_PIECES.map((fp, i) => (
        <div
          key={`fall-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: fp.left,
            top: 0,
            // @ts-expect-error CSS custom property
            '--fall-opacity': fp.opacity,
            animation: `tetris-fall ${fp.duration} linear ${fp.delay} infinite`,
          }}
        >
          <svg
            width={fp.blockSize * 4 + 2}
            height={fp.blockSize * 4 + 2}
            viewBox={`0 0 ${fp.blockSize * 4 + 2} ${fp.blockSize * 4 + 2}`}
          >
            <Tetromino
              piece={fp.piece}
              x={1}
              y={1}
              blockSize={fp.blockSize}
              opacity={fp.opacity}
            />
          </svg>
        </div>
      ))}

      {/* Completed rows at the bottom */}
      <CompletedRows />

      {/* Scanline / CRT overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.04) 2px,
            rgba(0,0,0,0.04) 4px
          )`,
          pointerEvents: 'none',
        }}
      />

      {/* Slow-moving scanline beam */}
      <div
        className="absolute left-0 right-0"
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.08), transparent)',
          animation: 'tetris-scanline 8s linear infinite',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
