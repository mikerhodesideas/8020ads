'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { modules } from '@/lib/course-data'

const lessonImages: Record<string, string> = {
  '1-1': '/images/lessons/cowork26-1-1.png',
  '1-2': '/images/lessons/cowork26-1-2.png',
  '1-3': '/images/lessons/cowork26-1-3.png',
  '1-4': '/images/lessons/cowork26-1-4.png',
  '2-1': '/images/lessons/cowork26-2-1.png',
  '2-2': '/images/lessons/cowork26-2-2.png',
  '3-1': '/images/lessons/cowork26-3-1.png',
  '3-2': '/images/lessons/cowork26-3-2.png',
  '3-3': '/images/lessons/cowork26-3-3.png',
  '4-1': '/images/lessons/cowork26-4-1.png',
  '4-2': '/images/lessons/cowork26-4-2.png',
  '4-3': '/images/lessons/cowork26-4-3.png',
  '5-1': '/images/lessons/cowork26-5-1.png',
  '5-2': '/images/lessons/cowork26-5-2.png',
  '5-3': '/images/lessons/cowork26-5-3.png',
  '6-1': '/images/lessons/cowork26-6-1.png',
  '6-2': '/images/lessons/cowork26-6-2.png',
  '6-3': '/images/lessons/cowork26-6-3.png',
  '7-1': '/images/lessons/cowork26-7-1.png',
  '7-2': '/images/lessons/cowork26-7-2.png',
  '7-3': '/images/lessons/cowork26-7-3.png',
  '7-4': '/images/lessons/cowork26-7-4.png',
  '8-1': '/images/lessons/cowork26-8-1.png',
  '8-2': '/images/lessons/cowork26-8-2.png',
  '8-3': '/images/lessons/cowork26-8-3.png',
  '8-4': '/images/lessons/cowork26-8-4.png',
}

export default function LessonPage() {
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
        router.push(`/course/${prev.id}`)
      }
      if (e.key === 'ArrowRight' && next) {
        router.push(`/course/${next.id}`)
      }
      if (e.key === 'Escape') {
        router.push('/course')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next, router])

  if (!lesson) {
    router.replace('/course')
    return null
  }

  // Strip the # heading from content since we render it separately
  const contentWithoutTitle = lesson.content
    .replace(/^#\s+.+\n+/, '')
    .trim()

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 py-8 sm:py-12 max-w-3xl mx-auto">
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

      {/* Whiteboard explainer image */}
      {lessonImages[lessonId] && (
        <div className="mb-10 border border-[var(--color-border)] rounded-[2px] overflow-hidden">
          <img
            src={lessonImages[lessonId]}
            alt={`${lesson.title} — whiteboard explainer`}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Lesson content */}
      <article className="prose-lesson">
        <ReactMarkdown>{contentWithoutTitle}</ReactMarkdown>
      </article>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--color-border)]">
        {prev ? (
          <Link
            href={`/course/${prev.id}`}
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-heading"
          >
            &#8592; {prev.title}
          </Link>
        ) : (
          <Link
            href="/course"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-heading"
          >
            &#8592; All lessons
          </Link>
        )}
        {next ? (
          <Link
            href={`/course/${next.id}`}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white text-sm font-heading font-semibold rounded-[2px] transition-colors"
          >
            Next lesson
            <span>&#8594;</span>
          </Link>
        ) : (
          <Link
            href="/course"
            className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white text-sm font-heading font-semibold rounded-[2px] transition-colors"
          >
            Back to course
          </Link>
        )}
      </div>
    </div>
  )
}
