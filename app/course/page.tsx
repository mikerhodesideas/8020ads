'use client'

import Link from 'next/link'
import { modules } from '@/lib/course-data'
import { useGame } from '@/components/game-provider'
import { cn } from '@/lib/utils'

export default function CoursePage() {
  const { isLevelComplete } = useGame()
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const level1Done = isLevelComplete(1)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 py-12 sm:py-16 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-orange)] mb-3 font-heading">
          The Cowork Course
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] mb-4 font-heading text-[var(--color-ink)]">
          Learn Cowork
        </h1>
        <p className="text-base text-[var(--color-muted)] max-w-lg mx-auto leading-relaxed">
          {modules.length} modules. {totalLessons} lessons. From first launch to
          running your business with AI.
        </p>
      </div>

      <div className="space-y-6">
        {modules.map((mod) => {
          const isLocked = mod.id >= 4 && !level1Done

          return (
            <div
              key={mod.id}
              className={cn(
                'border rounded-[2px] overflow-hidden',
                isLocked
                  ? 'bg-[#f8f8f6] border-[var(--color-border)] opacity-60'
                  : 'bg-white border-[var(--color-border)]'
              )}
            >
              <div
                className="px-5 sm:px-6 py-4 border-b border-[var(--color-border)]"
                style={{
                  borderLeft: isLocked
                    ? '3px solid var(--color-border)'
                    : '3px solid var(--color-brand-orange)',
                }}
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className={cn(
                      'text-xs font-bold font-heading',
                      isLocked
                        ? 'text-[var(--color-faint)]'
                        : 'text-[var(--color-brand-orange)]'
                    )}
                  >
                    Module {mod.id}
                  </span>
                  <h2
                    className={cn(
                      'text-lg font-bold font-heading',
                      isLocked
                        ? 'text-[var(--color-faint)]'
                        : 'text-[var(--color-ink)]'
                    )}
                  >
                    {mod.title}
                  </h2>
                  {isLocked && (
                    <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-[var(--color-faint)] ml-auto">
                      Locked
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    'text-xs mt-1 leading-relaxed',
                    isLocked
                      ? 'text-[var(--color-faint)]'
                      : 'text-[var(--color-muted)]'
                  )}
                >
                  {mod.outcome}
                </p>
              </div>

              {isLocked ? (
                <div className="px-5 sm:px-6 py-4">
                  <p className="text-xs text-[var(--color-faint)] font-heading">
                    Complete Level 1 of the game to unlock this module.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {mod.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/course/${lesson.id}`}
                      className={cn(
                        'flex items-center gap-3 px-5 sm:px-6 py-3',
                        'hover:bg-[var(--color-cream)] transition-colors group'
                      )}
                    >
                      <span className="text-xs text-[var(--color-faint)] font-mono w-6 shrink-0">
                        {lesson.id}
                      </span>
                      <span className="text-sm text-[var(--color-ink)] group-hover:text-[var(--color-brand-orange)] transition-colors">
                        {lesson.title}
                      </span>
                      <span className="ml-auto text-[var(--color-faint)] text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        &#8594;
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-heading"
        >
          &#8592; Back to demo
        </Link>
      </div>
    </div>
  )
}
