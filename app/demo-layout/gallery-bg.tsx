'use client'

/**
 * GalleryBackground - Clean, art gallery / museum aesthetic.
 * Warm cream/parchment base with subtle canvas texture,
 * faint geometric accents, and minimal picture frame outlines.
 * No game characters, no pixel art, no animations.
 */
export default function GalleryBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base warm cream */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: '#f5f0e8' }}
      />

      {/* Subtle warm gradient - lighter in center, slightly deeper at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 45%, #faf6f0 0%, #f5f0e8 50%, #ede5d8 100%)',
        }}
      />

      {/* Canvas / linen texture using repeating micro-gradients */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(120, 100, 70, 0.5) 1px,
              rgba(120, 100, 70, 0.5) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(120, 100, 70, 0.4) 1px,
              rgba(120, 100, 70, 0.4) 2px
            )
          `,
          backgroundSize: '4px 4px',
        }}
      />

      {/* Very faint horizontal gallery rail line - upper third */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: '18%',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 5%, rgba(180,160,130,0.12) 20%, rgba(180,160,130,0.18) 50%, rgba(180,160,130,0.12) 80%, transparent 95%)',
        }}
      />

      {/* Second faint rail line - lower area */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: '72%',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 8%, rgba(180,160,130,0.1) 25%, rgba(180,160,130,0.15) 50%, rgba(180,160,130,0.1) 75%, transparent 92%)',
        }}
      />

      {/* Picture frame outlines - elegant, very subtle */}
      {/* Frame 1 - upper left area, landscape orientation */}
      <svg
        className="absolute pointer-events-none"
        style={{ left: '6%', top: '22%', width: '120px', height: '90px' }}
        viewBox="0 0 120 90"
        fill="none"
      >
        <rect
          x="2"
          y="2"
          width="116"
          height="86"
          rx="1"
          stroke="rgba(180,160,130,0.12)"
          strokeWidth="1.5"
        />
        <rect
          x="8"
          y="8"
          width="104"
          height="74"
          rx="0.5"
          stroke="rgba(180,160,130,0.08)"
          strokeWidth="0.75"
        />
      </svg>

      {/* Frame 2 - right side, portrait orientation */}
      <svg
        className="absolute pointer-events-none"
        style={{ right: '8%', top: '30%', width: '80px', height: '110px' }}
        viewBox="0 0 80 110"
        fill="none"
      >
        <rect
          x="2"
          y="2"
          width="76"
          height="106"
          rx="1"
          stroke="rgba(180,160,130,0.1)"
          strokeWidth="1.5"
        />
        <rect
          x="7"
          y="7"
          width="66"
          height="96"
          rx="0.5"
          stroke="rgba(180,160,130,0.06)"
          strokeWidth="0.75"
        />
      </svg>

      {/* Frame 3 - lower left, small square */}
      <svg
        className="absolute pointer-events-none"
        style={{ left: '12%', bottom: '18%', width: '70px', height: '70px' }}
        viewBox="0 0 70 70"
        fill="none"
      >
        <rect
          x="2"
          y="2"
          width="66"
          height="66"
          rx="1"
          stroke="rgba(180,160,130,0.1)"
          strokeWidth="1.5"
        />
        <rect
          x="7"
          y="7"
          width="56"
          height="56"
          rx="0.5"
          stroke="rgba(180,160,130,0.06)"
          strokeWidth="0.75"
        />
      </svg>

      {/* Warm vignette - darker cream at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 40%, rgba(200,185,160,0.15) 100%)',
        }}
      />

      {/* Very subtle burnt orange accent - a thin line at the very bottom like a baseboard */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '2px',
          background:
            'linear-gradient(90deg, transparent 10%, rgba(214,76,0,0.08) 30%, rgba(214,76,0,0.12) 50%, rgba(214,76,0,0.08) 70%, transparent 90%)',
        }}
      />
    </div>
  )
}
