'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProblemGrid from '@/components/problem-grid'
import type { Path } from '@/lib/problems'

const validPaths = ['agency', 'employee', 'freelancer', 'business']

export default function PathPage() {
  const params = useParams()
  const router = useRouter()
  const path = params.path as string

  useEffect(() => {
    if (!validPaths.includes(path)) {
      router.replace('/')
    }
  }, [path, router])

  if (!validPaths.includes(path)) return null

  return <ProblemGrid path={path as Path} />
}
