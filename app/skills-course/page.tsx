'use client'

import Link from 'next/link'
import { modules } from '@/lib/course-data-skills-course'

export default function SkillsCoursePage() {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 py-12 sm:py-16 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-orange)] mb-3 font-heading">
          Skills Course
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] mb-4 font-heading text-[var(--color-ink)]">
          Build Your Own Skills
        </h1>
        <p className="text-base text-[var(--color-muted)] max-w-lg mx-auto leading-relaxed">
          {modules.length} modules. {totalLessons} lessons. From zero skills to a working collection.
        </p>
      </div>

      {/* Download link */}
      <div className="text-center mb-10">
        <a
          href="/skills/skills-course-lessons.zip"
          download="skills-course-lessons.zip"
          className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-[var(--color-brand-orange)] text-[var(--color-brand-orange)] text-sm font-heading font-semibold rounded-[2px] hover:bg-[var(--color-brand-orange-faint)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download course lessons (.zip)
        </a>
      </div>

      <div className="space-y-6">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="border rounded-[2px] overflow-hidden bg-white border-[var(--color-border)]"
          >
            <div
              className="px-5 sm:px-6 py-4 border-b border-[var(--color-border)]"
              style={{
                borderLeft: '3px solid var(--color-brand-orange)',
              }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-bold font-heading text-[var(--color-brand-orange)]">
                  Module {mod.id}
                </span>
                <h2 className="text-lg font-bold font-heading text-[var(--color-ink)]">
                  {mod.title}
                </h2>
              </div>
              <p className="text-xs mt-1 leading-relaxed text-[var(--color-muted)]">
                {mod.outcome}
              </p>
            </div>

            <div className="divide-y divide-[var(--color-border)]">
              {mod.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/skills-course/${lesson.id}`}
                  className="flex items-center gap-3 px-5 sm:px-6 py-3 hover:bg-[var(--color-cream)] transition-colors group"
                >
                  <span className="text-xs text-[var(--color-faint)] font-mono w-8 shrink-0">
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
