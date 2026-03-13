'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame, useSkin } from '@/components/game-provider'
import { GalleryMap, MarioMap, RedAlertMap, ClairObscurMap, TetrisMap, ZeldaMap, ElderScrollsMap } from '@/components/maps'
import { LevelTransition } from '@/components/level-transition'
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
  'red-alert': RedAlertMap,
  'clair-obscur': ClairObscurMap,
  tetris: TetrisMap,
  zelda: ZeldaMap,
  'elder-scrolls': ElderScrollsMap,
}

export default function LevelMap() {
  const router = useRouter()
  const { type, world, isLevelComplete } = useGame()
  const skin = useSkin()
  const [showCelebration, setShowCelebration] = useState(false)
  const [statsExpanded, setStatsExpanded] = useState(false)
  const [celebrationLevel, setCelebrationLevel] = useState(0)
  const [showTransition, setShowTransition] = useState(false)
  const [transitionLevel, setTransitionLevel] = useState(0)

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

  const MapComponent = skin ? MAP_REGISTRY[skin.mapId] : null

  useEffect(() => {
    if (!type || !world || !MapComponent) {
      router.replace('/')
    }
  }, [type, world, MapComponent, router])

  if (!type || !world || !MapComponent) {
    return null
  }

  return (
    <>
      <MapComponent
        skin={skin}
        showCelebration={showCelebration}
        celebrationLevel={celebrationLevel}
        onDismissCelebration={() => {
          setShowCelebration(false)
          if (celebrationLevel < 3) {
            setShowTransition(true)
            setTransitionLevel(celebrationLevel)
          }
        }}
        statsExpanded={statsExpanded}
        setStatsExpanded={setStatsExpanded}
      />
      {showTransition && (
        <LevelTransition
          fromLevel={transitionLevel}
          onContinue={() => setShowTransition(false)}
          skin={skin}
        />
      )}
    </>
  )
}
