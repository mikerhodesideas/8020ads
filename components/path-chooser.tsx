import { cn } from '@/lib/utils'
import type { Path } from '@/lib/problems'

interface PathChooserProps {
  onChoose: (path: Path) => void
}

const paths = [
  {
    id: 'agency' as Path,
    icon: '\u{1F4C8}',
    title: 'I run an agency',
    desc: 'See how AI handles search terms, campaign reporting, competitor analysis, and client deliverables.',
    tagline: 'From manual grind to strategic clarity',
    accent: '#2563EB',
    accentBg: '#EFF4FF',
  },
  {
    id: 'business' as Path,
    icon: '\u{1F3E2}',
    title: 'I run a business',
    desc: 'See how AI tackles inbox overload, meeting follow-ups, financial reporting, and team onboarding.',
    tagline: 'From operational chaos to running smoothly',
    accent: '#1B8C3A',
    accentBg: '#EEFBF0',
  },
]

export default function PathChooser({ onChoose }: PathChooserProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-3 font-[family-name:var(--font-heading)]">
        See AI solve real problems
      </h1>
      <p className="text-lg text-[var(--color-muted)] text-center mb-12 max-w-xl">
        Choose your path. Every problem gets solved live.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
        {paths.map((p) => (
          <button
            key={p.id}
            onClick={() => onChoose(p.id)}
            className={cn(
              'text-left p-8 bg-white border border-[var(--color-border)]',
              'rounded-[2px] transition-all duration-200',
              'hover:shadow-md hover:border-[var(--color-brand-orange)]',
              'group cursor-pointer'
            )}
          >
            <div className="text-4xl mb-4">{p.icon}</div>
            <h2 className="text-2xl font-bold mb-2 font-[family-name:var(--font-heading)]">
              {p.title}
            </h2>
            <p className="text-[var(--color-muted)] mb-4 text-sm leading-relaxed">
              {p.desc}
            </p>
            <p
              className="text-xs font-medium uppercase tracking-wider mb-6"
              style={{ color: p.accent }}
            >
              {p.tagline}
            </p>
            <span
              className={cn(
                'inline-block px-5 py-2 text-white text-sm font-semibold',
                'rounded-[2px] transition-opacity group-hover:opacity-90',
                'font-[family-name:var(--font-heading)]'
              )}
              style={{ backgroundColor: p.accent }}
            >
              Start Demo
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
