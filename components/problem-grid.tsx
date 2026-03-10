import { cn } from '@/lib/utils'
import type { Problem, Path } from '@/lib/problems'

interface ProblemGridProps {
  problems: Problem[]
  path: Path
  completed: Set<number>
  onSelect: (problem: Problem) => void
  onShowSST: () => void
}

export default function ProblemGrid({
  problems,
  path,
  completed,
  onSelect,
  onShowSST,
}: ProblemGridProps) {
  const filtered = problems.filter((p) => p.paths.includes(path))
  const doneCount = filtered.filter((p) => completed.has(p.id)).length

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 font-[family-name:var(--font-heading)]">
        Pick a problem
      </h2>
      <p className="text-[var(--color-muted)] text-center mb-10">
        {filtered.filter((p) => completed.has(p.id)).length} of {filtered.length} done
      </p>
      <div
        className={cn(
          'grid gap-5 w-full max-w-5xl',
          filtered.length <= 6
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        )}
      >
        {filtered.map((problem) => {
          const done = completed.has(problem.id)
          return (
            <button
              key={problem.id}
              onClick={() => onSelect(problem)}
              className={cn(
                'text-left p-5 bg-white border transition-all duration-200',
                'rounded-[2px] group cursor-pointer',
                done
                  ? 'border-[var(--color-done-green)] bg-[#f0fdf4]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-brand-orange)] hover:shadow-sm'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{problem.icon}</span>
                {done && (
                  <span className="text-[var(--color-done-green)] text-lg font-bold">
                    &#10003;
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold mb-1 font-[family-name:var(--font-heading)] leading-tight">
                {problem.title}
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-snug">
                {problem.subtitle}
              </p>
            </button>
          )
        })}
      </div>
      <button
        onClick={onShowSST}
        className="mt-8 text-xs text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors underline"
      >
        How does this work?
      </button>
    </div>
  )
}
