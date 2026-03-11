'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import PathChooser from '@/components/path-chooser'
import type { PlayerType } from '@/lib/game-data'

export default function Home() {
  const router = useRouter()
  const { type, world, setType } = useGame()

  // If they've already picked type and world, go straight to play
  useEffect(() => {
    if (type && world) {
      router.replace('/play')
    }
  }, [type, world, router])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const typeMap: Record<string, PlayerType> = {
        a: 'agency',
        e: 'employee',
        f: 'freelancer',
        b: 'business',
      }
      if (typeMap[key]) {
        setType(typeMap[key])
        router.push('/world')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router, setType])

  if (type && world) return null

  return <PathChooser />
}
