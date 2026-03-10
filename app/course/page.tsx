'use client'

import Link from 'next/link'
import { modules } from '@/lib/course-data'
import { cn } from '@/lib/utils'

export default function CoursePage() {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 py-12 sm:py-16 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-orange)] mb-3 font-heading">
          Cowork26 Course
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] mb-4 font-heading text-[var(--color-ink)]">
          Claude Cowork for Agencies
        </h1>
        <p className="text-base text-[var(--color-muted)] max-w-lg mx-auto leading-relaxed">
          {modules.length} modules. {totalLessons} lessons. From first skill to
          embedded AI partner.
        </p>
      </div>

      <div className="space-y-6">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="bg-white border border-[var(--color-border)] rounded-[2px] overflow-hidden"
          >
            <div
              className="px-5 sm:px-6 py-4 border-b border-[var(--color-border)]"
              style={{ borderLeft: '3px solid var(--color-brand-orange)' }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-bold text-[var(--color-brand-orange)] font-heading">
                  Module {mod.id}
                </span>
                <h2 className="text-lg font-bold font-heading text-[var(--color-ink)]">
                  {mod.title}
                </h2>
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                {mod.outcome}
              </p>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {mod.lessons.map((lesson, i) => (
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
          </div>
        ))}
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
