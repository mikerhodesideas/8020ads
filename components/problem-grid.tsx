'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useDemo } from '@/components/demo-provider'
import { problems, type Path } from '@/lib/problems'

interface ProblemGridProps {
  path: Path
}

export default function ProblemGrid({ path }: ProblemGridProps) {
  const router = useRouter()
  const { completed } = useDemo()
  const filtered = problems.filter((p) => p.paths.includes(path))
  const doneCount = filtered.filter((p) => completed.has(p.id)).length

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Number keys 1-9 to jump to problem
      const num = parseInt(e.key)
      if (num >= 1 && num <= filtered.length) {
        router.push(`/${path}/${num}`)
      }
      if (e.key === 'Escape') {
        router.push('/')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [filtered, path, router])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 font-heading">
          Pick a problem. Watch it get solved with AI.
        </h2>
        <p className="text-sm text-[var(--color-muted)] font-heading">
          {doneCount} of {filtered.length} completed
        </p>
      </div>

      <div
        className={cn(
          'grid gap-4 sm:gap-5 w-full max-w-5xl',
          filtered.length <= 6
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        )}
      >
        {filtered.map((problem, index) => {
          const position = index + 1
          const done = completed.has(problem.id)
          return (
            <Link
              key={problem.id}
              href={`/${path}/${position}`}
              className={cn(
                'text-left p-5 bg-white border transition-all duration-200',
                'rounded-[2px] group cursor-pointer block',
                done
                  ? 'border-[var(--color-done-green)] bg-[#f0fdf4]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-brand-orange)] hover:shadow-md hover:-translate-y-0.5'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl leading-none">{problem.icon}</span>
                  <kbd className="text-[10px] text-[var(--color-faint)] px-1.5 py-0.5 bg-[var(--color-cream)] border border-[var(--color-border)] rounded-[2px] font-mono">
                    {position}
                  </kbd>
                </div>
                {done && (
                  <span className="text-[var(--color-done-green)] text-sm font-bold">
                    &#10003;
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold mb-1.5 font-heading leading-tight text-[var(--color-ink)]">
                {problem.title}
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                {problem.subtitle}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Link
          href="/how-it-works"
          className="text-xs text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors underline font-heading"
        >
          How does this work?
        </Link>
        <p className="text-[10px] text-[var(--color-faint)] font-heading">
          Press{' '}
          <kbd className="px-1 py-0.5 bg-white border border-[var(--color-border)] rounded-[2px] text-[10px] font-mono">
            1
          </kbd>
          {' \u2013 '}
          <kbd className="px-1 py-0.5 bg-white border border-[var(--color-border)] rounded-[2px] text-[10px] font-mono">
            {filtered.length}
          </kbd>{' '}
          to pick a problem
        </p>
      </div>
    </div>
  )
}
