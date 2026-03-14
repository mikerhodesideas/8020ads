'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { modules } from '@/lib/course-data'
import { useGame } from '@/components/game-provider'

// Maps screenshot descriptions from [SCREENSHOT: ...] placeholders to image files
// size: 'full' (default), 'medium' (60% centered), 'small' (40% centered)
const screenshotMap: Record<string, { src: string; size?: 'full' | 'medium' | 'small' }> = {
  'cowork working in a folder on your computer': { src: '/images/lessons/cowork-home-screen.png' },
  'the cowork download page showing mac and windows options': { src: '/images/lessons/cowork-download-page.png' },
  'cowork sign-in screen': { src: '/images/lessons/cowork-sign-in.png', size: 'small' },
  'cowork main interface': { src: '/images/lessons/cowork-main-interface.png' },
  'cowork settings menu': { src: '/images/lessons/cowork-settings-menu.png', size: 'small' },
  'cowork active conversation': { src: '/images/lessons/cowork-active-conversation.png' },
  'cowork folder picker': { src: '/images/lessons/cowork-folder-picker.png', size: 'medium' },
}

const sizeClasses = {
  full: 'w-full',
  medium: 'max-w-[60%] mx-auto',
  small: 'max-w-[40%] mx-auto',
}

function findScreenshot(text: string): { src: string; size: 'full' | 'medium' | 'small' } | null {
  const key = text.toLowerCase().trim()
  const entry = screenshotMap[key]
  if (!entry) return null
  return { src: entry.src, size: entry.size ?? 'full' }
}

function ScreenshotBlockquote({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) {
  // Extract text content from children to check for [SCREENSHOT: ...]
  const text = extractText(children)
  const match = text.match(/\[SCREENSHOT:\s*(.+?)\]/)
  if (match) {
    const desc = match[1]
    const result = findScreenshot(desc)
    if (result) {
      return (
        <div className={`my-8 ${sizeClasses[result.size]}`}>
          <div className="border border-[var(--color-border)] rounded-[2px] overflow-hidden">
            <img src={result.src} alt={desc} className="w-full h-auto" />
          </div>
        </div>
      )
    }
    // No image yet, show placeholder
    return (
      <blockquote className="border-l-3 border-[var(--color-brand-orange)] bg-[var(--color-brand-orange-faint)] px-4 py-3 my-5 rounded-[2px]" {...props}>
        {children}
      </blockquote>
    )
  }
  // Normal blockquote
  return (
    <blockquote className="border-l-3 border-[var(--color-brand-orange)] bg-[var(--color-brand-orange-faint)] px-4 py-3 my-5 rounded-[2px]" {...props}>
      {children}
    </blockquote>
  )
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as React.ReactElement).props.children)
  }
  return ''
}

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
  blockquote: ScreenshotBlockquote,
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { isLevelComplete } = useGame()
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

  // Block access to locked modules (4-6 require Level 1 complete)
  const isLocked = currentModule && currentModule.id >= 3 && !isLevelComplete(1)

  // Keyboard navigation
  useEffect(() => {
    if (isLocked) return
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
  }, [prev, next, router, isLocked])

  if (!lesson) {
    router.replace('/course')
    return null
  }

  if (isLocked) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 py-16 max-w-3xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-faint)] mb-3 font-heading">
          Module {currentModule.id}: {currentModule.title}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading leading-tight text-[var(--color-ink)] mb-6">
          This module is locked
        </h1>
        <p className="text-sm text-[var(--color-muted)] mb-8 max-w-md mx-auto leading-relaxed">
          Complete Level 1 of the game to unlock Modules 3 and 4. The first two modules are available now.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/course"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-heading"
          >
            &#8592; Back to course
          </Link>
          <Link
            href="/play"
            className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white text-sm font-heading font-semibold rounded-[2px] transition-colors"
          >
            Play the game
          </Link>
        </div>
      </div>
    )
  }

  // Don't nav into locked lessons
  const level1Done = isLevelComplete(1)
  const isNextLocked = next && modules.find((m) => m.lessons.some((l) => l.id === next.id))!.id >= 3 && !level1Done
  const isPrevLocked = prev && modules.find((m) => m.lessons.some((l) => l.id === prev.id))!.id >= 3 && !level1Done
  const safePrev = isPrevLocked ? null : prev
  const safeNext = isNextLocked ? null : next

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

      {/* Lesson content */}
      <article className="prose-lesson">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{contentWithoutTitle}</ReactMarkdown>
      </article>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--color-border)]">
        {safePrev ? (
          <Link
            href={`/course/${safePrev.id}`}
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-heading"
          >
            &#8592; {safePrev.title}
          </Link>
        ) : (
          <Link
            href="/course"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-heading"
          >
            &#8592; All lessons
          </Link>
        )}
        {safeNext ? (
          <Link
            href={`/course/${safeNext.id}`}
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
