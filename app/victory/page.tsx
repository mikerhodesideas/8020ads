'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import VictoryScreen from '@/components/victory-screen'

export default function VictoryPage() {
  const router = useRouter()
  const { allAvailableComplete, type, world } = useGame()

  // Redirect if they haven't actually completed everything
  useEffect(() => {
    if (!type || !world) {
      router.replace('/')
    } else if (!allAvailableComplete) {
      router.replace('/play')
    }
  }, [type, world, allAvailableComplete, router])

  if (!allAvailableComplete || !type || !world) return null

  return <VictoryScreen />
}
