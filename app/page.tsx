'use client'

import { useEffect } from 'react'
import PathChooser from '@/components/path-chooser'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') router.push('/cowork?path=agency')
      if (e.key === 'b' || e.key === 'B') router.push('/cowork?path=business')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router])

  return <PathChooser />
}
