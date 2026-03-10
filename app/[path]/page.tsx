'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProblemGrid from '@/components/problem-grid'
import type { Path } from '@/lib/problems'

export default function PathPage() {
  const params = useParams()
  const router = useRouter()
  const path = params.path as string

  useEffect(() => {
    if (path !== 'agency' && path !== 'business') {
      router.replace('/')
    }
  }, [path, router])

  if (path !== 'agency' && path !== 'business') return null

  return <ProblemGrid path={path as Path} />
}
