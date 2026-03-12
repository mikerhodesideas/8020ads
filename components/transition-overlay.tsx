'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from './game-provider'
import { getSkin } from '@/lib/skin-config'
import { playSound } from '@/lib/sounds'

type TransitionPhase = 'idle' | 'closing' | 'closed' | 'opening'

interface TransitionContextType {
  navigateWithTransition: (path: string) => void
  isTransitioning: boolean
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithTransition: () => {},
  isTransitioning: false,
})

export function useTransition() {
  return useContext(TransitionContext)
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { world } = useGame()
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const busyRef = useRef(false)

  const skin = world ? getSkin(world) : getSkin('gallery')
  const useTransitions = skin.useTransitions
  const isDark = skin.isDark
  const isTransitioning = phase !== 'idle'

  const navigateWithTransition = useCallback(
    (path: string) => {
      // No transition style: just navigate
      if (!useTransitions) {
        router.push(path)
        return
      }

      // Prevent overlapping transitions
      if (busyRef.current) {
        router.push(path)
        return
      }
      busyRef.current = true

      // Play transition sound at the START
      if (skin.sounds.transition) {
        playSound(skin.sounds.transition)
      }

      // Start closing animation
      setPhase('closing')

      // Fallback: force idle after 2s no matter what
      if (fallbackRef.current) clearTimeout(fallbackRef.current)
      fallbackRef.current = setTimeout(() => {
        setPhase('idle')
        busyRef.current = false
      }, 2000)

      // After close animation (400ms), navigate
      setTimeout(() => {
        setPhase('closed')
        router.push(path)

        // Start opening after brief pause for page render
        setTimeout(() => {
          setPhase('opening')

          // After open animation (400ms), back to idle
          setTimeout(() => {
            setPhase('idle')
            busyRef.current = false
            if (fallbackRef.current) {
              clearTimeout(fallbackRef.current)
              fallbackRef.current = null
            }
          }, 400)
        }, 50)
      }, 400)
    },
    [useTransitions, router, skin.sounds.transition]
  )

  // Determine CSS class for the content wrapper
  const contentClass =
    useTransitions && phase === 'closing'
      ? 'iris-closing'
      : useTransitions && phase === 'closed'
        ? 'iris-closed'
        : useTransitions && phase === 'opening'
          ? 'iris-opening'
          : ''

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      <div
        style={{
          background: isTransitioning && isDark ? '#1a1a2e' : 'transparent',
          minHeight: '100vh',
        }}
      >
        <div className={contentClass}>{children}</div>
      </div>
    </TransitionContext.Provider>
  )
}
