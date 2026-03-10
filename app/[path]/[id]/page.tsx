'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { problems, type Path } from '@/lib/problems'
import { useDemo } from '@/components/demo-provider'
import ProblemDetail from '@/components/problem-detail'

export default function ProblemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { markComplete } = useDemo()

  const path = params.path as string
  const id = parseInt(params.id as string)

  const filtered = problems.filter((p) => p.paths.includes(path as Path))
  const problem = filtered[id - 1]
  const hasNext = id < filtered.length

  const handleBack = useCallback(() => {
    if (problem) markComplete(problem.id)
    router.push(`/${path}`)
  }, [markComplete, problem, router, path])

  const handleNext = useCallback(() => {
    if (problem) markComplete(problem.id)
    router.push(`/${path}/${id + 1}`)
  }, [markComplete, problem, router, path, id])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack()
      }
      if (e.key === 'ArrowLeft') {
        if (id > 1) {
          if (problem) markComplete(problem.id)
          router.push(`/${path}/${id - 1}`)
        } else {
          handleBack()
        }
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (problem) markComplete(problem.id)
        if (hasNext) {
          router.push(`/${path}/${id + 1}`)
        } else {
          router.push(`/${path}`)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleBack, id, hasNext, markComplete, problem, router, path])

  useEffect(() => {
    if (path !== 'agency' && path !== 'business') {
      router.replace('/')
    }
  }, [path, router])

  if (path !== 'agency' && path !== 'business') return null
  if (!problem) {
    router.replace(`/${path}`)
    return null
  }

  return (
    <ProblemDetail
      problem={problem}
      position={id}
      total={filtered.length}
      onBack={handleBack}
      onNext={hasNext ? handleNext : null}
    />
  )
}
