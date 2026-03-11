'use client'

import { useEffect } from 'react'
import PathChooser from '@/components/path-chooser'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const seen = localStorage.getItem('cowork-seen')
      const prefix = seen ? '' : '/cowork?path='
      const direct = seen ? '/' : ''

      if (e.key === 'a' || e.key === 'A') router.push(seen ? '/agency' : '/cowork?path=agency')
      if (e.key === 'e' || e.key === 'E') router.push(seen ? '/employee' : '/cowork?path=employee')
      if (e.key === 'f' || e.key === 'F') router.push(seen ? '/freelancer' : '/cowork?path=freelancer')
      if (e.key === 'b' || e.key === 'B') router.push(seen ? '/business' : '/cowork?path=business')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router])

  return <PathChooser />
}
