'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { modules } from '@/lib/course-data-skills-course'

const mdComponents = {
  table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="my-8 border border-[var(--color-border)] rounded-[2px] overflow-hidden">
      <table className="w-full text-sm border-collapse" {...props}>{children}</table>
    </div>
  ),
  thead: ({ children, ...props }: React.ComponentPropsWithoutRef<'thead'>) => (
    <thead className="bg-[var(--color-cream)]" {...props}>{children}</thead>
  ),
  th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] font-heading border-b-2 border-[var(--color-border)]" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
    <td className="px-5 py-3.5 text-[var(--color-ink)] border-b border-[var(--color-border)] first:font-semibold first:text-[var(--color-ink)] first:text-xs first:uppercase first:tracking-wide first:font-heading first:bg-[var(--color-cream)]/60 first:w-[180px]" {...props}>
      {children}
    </td>
  ),
  tr: ({ children, ...props }: React.ComponentPropsWithoutRef<'tr'>) => (
    <tr {...props}>{children}</tr>
  ),
  blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-l-3 border-[var(--color-brand-orange)] bg-[var(--color-brand-orange-faint)] px-4 py-3 my-5 rounded-[2px]" {...props}>
      {children}
    </blockquote>
  ),
}

export default function SkillsCourseLessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.lesson as string

  // Build flat list of all lessons for prev/next navigation
  const allLessons = useMemo(
    () => modules.flatMap((m) => m.lessons),
    []
  )

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const lesson = allLessons[currentIndex]
  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const next =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  // Find which module this lesson belongs to
  const currentModule = modules.find((m) =>
    m.lessons.some((l) => l.id === lessonId)
  )

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prev) {
        router.push(`/skills-course/${prev.id}`)
      }
      if (e.key === 'ArrowRight' && next) {
        router.push(`/skills-course/${next.id}`)
      }
      if (e.key === 'Escape') {
        router.push('/skills-course')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next, router])

  if (!lesson) {
    router.replace('/skills-course')
    return null
  }

  // Strip the # heading from content since we render it separately
  const contentWithoutTitle = lesson.content
    .replace(/^#\s+.+\n+/, '')
    .trim()

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex max-w-6xl mx-auto">
      {/* Sidebar - hidden on mobile */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-[var(--color-border)] py-8 pr-4 pl-6">
        <div className="sticky top-[3.5rem] max-h-[calc(100vh-3.5rem)] overflow-y-auto pb-8">
          <Link
            href="/skills-course"
            className="text-xs font-heading font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors mb-6 block"
          >
            &#8592; All lessons
          </Link>
          <nav className="space-y-5">
            {modules.map((mod) => (
              <div key={mod.id}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 font-heading text-[var(--color-brand-orange)]">
                  Module {mod.id}
                </p>
                <ul className="space-y-0.5">
                  {mod.lessons.map((l) => {
                    const isCurrent = l.id === lessonId
                    return (
                      <li key={l.id}>
                        <Link
                          href={`/skills-course/${l.id}`}
                          className={`block text-xs py-1 transition-colors ${
                            isCurrent
                              ? 'text-[var(--color-ink)] font-semibold border-l-2 border-[var(--color-brand-orange)] pl-2 -ml-[2px]'
                              : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                          }`}
                        >
                          {l.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8 sm:py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          {currentModule && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-orange)] mb-2 font-heading">
              Module {currentModule.id}: {currentModule.title}
            </p>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold font-heading leading-tight text-[var(--color-ink)]">
            {lesson.title}
          </h1>
        </div>

        {/* CTA for final lesson */}
        {lessonId === 's3-1' && (
          <div className="mb-10">
            <a
              href="https://8020brain.com/ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white text-sm font-heading font-bold rounded-[2px] transition-colors"
            >
              Join Ads to AI
              <span>&#8594;</span>
            </a>
          </div>
        )}

        {/* Lesson content */}
        <article className="prose-lesson">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{contentWithoutTitle}</ReactMarkdown>
        </article>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--color-border)]">
          {prev ? (
            <Link
              href={`/skills-course/${prev.id}`}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-heading"
            >
              &#8592; {prev.title}
            </Link>
          ) : (
            <Link
              href="/skills-course"
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-heading"
            >
              &#8592; All lessons
            </Link>
          )}
          {next ? (
            <Link
              href={`/skills-course/${next.id}`}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white text-sm font-heading font-semibold rounded-[2px] transition-colors"
            >
              Next lesson
              <span>&#8594;</span>
            </Link>
          ) : lessonId === 's3-1' ? (
            <a
              href="https://8020brain.com/ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white text-sm font-heading font-semibold rounded-[2px] transition-colors"
            >
              Join Ads to AI
              <span>&#8594;</span>
            </a>
          ) : (
            <Link
              href="/skills-course"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white text-sm font-heading font-semibold rounded-[2px] transition-colors"
            >
              Back to course
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
