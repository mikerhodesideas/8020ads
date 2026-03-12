'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame, useSkin } from '@/components/game-provider'
import { GalleryMap, MarioMap } from '@/components/maps'
import type { SkinConfig } from '@/lib/skin-config'

// Map component registry - maps skin.mapId to the corresponding component
const MAP_REGISTRY: Record<string, React.ComponentType<{
  skin: SkinConfig
  showCelebration: boolean
  celebrationLevel: number
  onDismissCelebration: () => void
  statsExpanded: boolean
  setStatsExpanded: (fn: (prev: boolean) => boolean) => void
}>> = {
  gallery: GalleryMap,
  mario: MarioMap,
}

export default function LevelMap() {
  const router = useRouter()
  const { type, world, isLevelComplete } = useGame()
  const skin = useSkin()
  const [showCelebration, setShowCelebration] = useState(false)
  const [statsExpanded, setStatsExpanded] = useState(false)
  const [celebrationLevel, setCelebrationLevel] = useState(0)

  // Detect when a level just completed (show celebration once per session)
  useEffect(() => {
    if (typeof window === 'undefined') return
    for (const lvl of [1, 2, 3]) {
      if (
        isLevelComplete(lvl) &&
        !sessionStorage.getItem(`level${lvl}-celebrated`)
      ) {
        const timer = setTimeout(() => {
          setCelebrationLevel(lvl)
          setShowCelebration(true)
          sessionStorage.setItem(`level${lvl}-celebrated`, 'true')
        }, 600)
        return () => clearTimeout(timer)
      }
    }
  }, [isLevelComplete])

  if (!type || !world) {
    router.replace('/')
    return null
  }

  const MapComponent = MAP_REGISTRY[skin.mapId]
  if (!MapComponent) {
    router.replace('/')
    return null
  }

  return (
    <MapComponent
      skin={skin}
      showCelebration={showCelebration}
      celebrationLevel={celebrationLevel}
      onDismissCelebration={() => setShowCelebration(false)}
      statsExpanded={statsExpanded}
      setStatsExpanded={setStatsExpanded}
    />
  )
}
