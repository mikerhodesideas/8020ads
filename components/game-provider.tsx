'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from 'react'
import type { PlayerType, WorldId } from '@/lib/game-data'
import { getLevel1Demos, DEMO_TIME_SAVED, ALL_LEVEL_1_IDS, LEVEL_1_SKILL_IDS, DEMO_SKILLS } from '@/lib/game-data'

interface GameState {
  type: PlayerType | null
  world: WorldId | null
  completed: Set<number>
  skills: Set<string>
  badges: Record<string, number> // badgeId -> earnedAt timestamp
  worldsVisited: Set<string>
  replays: Set<number>
  beforeAfterViews: Set<number>
  hasSpeedComplete: boolean
}

interface GameContextType extends GameState {
  setType: (t: PlayerType) => void
  setWorld: (w: WorldId) => void
  markComplete: (demoId: number) => void
  resetGame: () => void
  isLevelComplete: (levelId: number) => boolean
  // V2-B additions
  installSkill: (skillId: string) => void
  startDemoTimer: (demoId: number) => void
  recordReplay: (demoId: number) => void
  recordBeforeAfterView: (demoId: number) => void
  badgeToastQueue: string[]
  dismissBadgeToast: () => void
  allAvailableComplete: boolean
  totalTimeSaved: number
}

const defaultState: GameState = {
  type: null,
  world: null,
  completed: new Set(),
  skills: new Set(),
  badges: {},
  worldsVisited: new Set(),
  replays: new Set(),
  beforeAfterViews: new Set(),
  hasSpeedComplete: false,
}

const GameContext = createContext<GameContextType>({
  ...defaultState,
  setType: () => {},
  setWorld: () => {},
  markComplete: () => {},
  resetGame: () => {},
  isLevelComplete: () => false,
  installSkill: () => {},
  startDemoTimer: () => {},
  recordReplay: () => {},
  recordBeforeAfterView: () => {},
  badgeToastQueue: [],
  dismissBadgeToast: () => {},
  allAvailableComplete: false,
  totalTimeSaved: 0,
})

const STORAGE_KEY = 'cowork-game'

function loadState(): GameState {
  if (typeof window === 'undefined') return { ...defaultState }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState, completed: new Set(), skills: new Set(), worldsVisited: new Set(), replays: new Set(), beforeAfterViews: new Set() }
    const parsed = JSON.parse(raw)
    return {
      type: parsed.type || null,
      world: parsed.world || null,
      completed: new Set(parsed.completed || []),
      skills: new Set(parsed.skills || []),
      badges: parsed.badges || {},
      worldsVisited: new Set(parsed.worldsVisited || []),
      replays: new Set(parsed.replays || []),
      beforeAfterViews: new Set(parsed.beforeAfterViews || []),
      hasSpeedComplete: parsed.hasSpeedComplete || false,
    }
  } catch {
    return { ...defaultState, completed: new Set(), skills: new Set(), worldsVisited: new Set(), replays: new Set(), beforeAfterViews: new Set() }
  }
}

function saveState(state: GameState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      type: state.type,
      world: state.world,
      completed: Array.from(state.completed),
      skills: Array.from(state.skills),
      badges: state.badges,
      worldsVisited: Array.from(state.worldsVisited),
      replays: Array.from(state.replays),
      beforeAfterViews: Array.from(state.beforeAfterViews),
      hasSpeedComplete: state.hasSpeedComplete,
    })
  )
}

// Evaluate which badges SHOULD be earned based on current state
function evaluateBadges(state: GameState): string[] {
  const shouldHave: string[] = []

  // First Skill: complete first demo
  if (state.completed.size >= 1) shouldHave.push('first-skill')

  // Skill Collector: all 3 Level 1 skills
  const l1Skills = Array.from(state.skills).filter((s) => LEVEL_1_SKILL_IDS.has(s))
  if (l1Skills.length >= 3) shouldHave.push('skill-collector')

  // Speed Demon: completed a demo in under 20 seconds
  if (state.hasSpeedComplete) shouldHave.push('speed-demon')

  // Explorer: played in both worlds
  if (state.worldsVisited.has('gallery') && state.worldsVisited.has('arcade')) {
    shouldHave.push('explorer')
  }

  // Level Up: all demos in Level 1 complete (need 3 from the Level 1 set)
  const l1Done = Array.from(state.completed).filter((id) => ALL_LEVEL_1_IDS.has(id))
  if (l1Done.length >= 3) shouldHave.push('level-up')

  // Full Clear: all 9 demos (currently only 3 exist, so only achievable when L2/L3 added)
  if (state.completed.size >= 9) shouldHave.push('full-clear')

  // The Transformer: viewed all 3 before/after comparisons
  if (state.beforeAfterViews.size >= 3) shouldHave.push('transformer')

  // Replay Master: replayed at least one completed demo
  if (state.replays.size >= 1) shouldHave.push('replay-master')

  return shouldHave
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    ...defaultState,
    completed: new Set(),
    skills: new Set(),
    worldsVisited: new Set(),
    replays: new Set(),
    beforeAfterViews: new Set(),
  })
  const [loaded, setLoaded] = useState(false)
  const [badgeToastQueue, setBadgeToastQueue] = useState<string[]>([])
  const demoStartTimesRef = useRef<Record<number, number>>({})

  useEffect(() => {
    setState(loadState())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) saveState(state)
  }, [state, loaded])

  // Badge evaluation effect
  useEffect(() => {
    if (!loaded) return

    const shouldHave = evaluateBadges(state)
    const newBadges = shouldHave.filter((id) => !state.badges[id])

    if (newBadges.length > 0) {
      const now = Date.now()
      setBadgeToastQueue((prev) => [...prev, ...newBadges])
      setState((prev) => {
        const updatedBadges = { ...prev.badges }
        let changed = false
        newBadges.forEach((id) => {
          if (!updatedBadges[id]) {
            updatedBadges[id] = now
            changed = true
          }
        })
        return changed ? { ...prev, badges: updatedBadges } : prev
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.completed.size,
    state.skills.size,
    state.worldsVisited.size,
    state.replays.size,
    state.beforeAfterViews.size,
    state.hasSpeedComplete,
    loaded,
  ])

  const setType = useCallback((t: PlayerType) => {
    setState((prev) => ({ ...prev, type: t }))
  }, [])

  const setWorld = useCallback((w: WorldId) => {
    setState((prev) => ({
      ...prev,
      world: w,
      worldsVisited: new Set(prev.worldsVisited).add(w),
    }))
  }, [])

  const markComplete = useCallback((demoId: number) => {
    const startTime = demoStartTimesRef.current[demoId]
    const wasFast = startTime ? Date.now() - startTime < 20000 : false

    setState((prev) => {
      const newCompleted = new Set(prev.completed).add(demoId)
      // Auto-install the skill for this demo
      const skill = DEMO_SKILLS[demoId]
      const newSkills = skill ? new Set(prev.skills).add(skill.id) : prev.skills
      return {
        ...prev,
        completed: newCompleted,
        skills: newSkills,
        hasSpeedComplete: prev.hasSpeedComplete || wasFast,
      }
    })

    // Clean up timer
    delete demoStartTimesRef.current[demoId]
  }, [])

  const resetGame = useCallback(() => {
    const fresh: GameState = {
      type: null,
      world: null,
      completed: new Set(),
      skills: new Set(),
      badges: {},
      worldsVisited: new Set(),
      replays: new Set(),
      beforeAfterViews: new Set(),
      hasSpeedComplete: false,
    }
    setState(fresh)
    setBadgeToastQueue([])
    demoStartTimesRef.current = {}
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
  }, [])

  const isLevelComplete = useCallback(
    (levelId: number) => {
      if (levelId === 1) {
        const l1Done = Array.from(state.completed).filter((id) =>
          ALL_LEVEL_1_IDS.has(id)
        )
        return l1Done.length >= 3
      }
      return false
    },
    [state.completed]
  )

  const installSkill = useCallback((skillId: string) => {
    setState((prev) => ({
      ...prev,
      skills: new Set(prev.skills).add(skillId),
    }))
  }, [])

  const startDemoTimer = useCallback((demoId: number) => {
    demoStartTimesRef.current[demoId] = Date.now()
  }, [])

  const recordReplay = useCallback((demoId: number) => {
    setState((prev) => ({
      ...prev,
      replays: new Set(prev.replays).add(demoId),
    }))
  }, [])

  const recordBeforeAfterView = useCallback((demoId: number) => {
    setState((prev) => ({
      ...prev,
      beforeAfterViews: new Set(prev.beforeAfterViews).add(demoId),
    }))
  }, [])

  const dismissBadgeToast = useCallback(() => {
    setBadgeToastQueue((prev) => prev.slice(1))
  }, [])

  const allAvailableComplete = useMemo(() => {
    if (!state.type) return false
    const demos = getLevel1Demos(state.type)
    return demos.every((d) => state.completed.has(d.id))
  }, [state.type, state.completed])

  const totalTimeSaved = useMemo(() => {
    let total = 0
    state.completed.forEach((id) => {
      total += DEMO_TIME_SAVED[id] || 0
    })
    return total
  }, [state.completed])

  if (!loaded) return null

  return (
    <GameContext.Provider
      value={{
        ...state,
        setType,
        setWorld,
        markComplete,
        resetGame,
        isLevelComplete,
        installSkill,
        startDemoTimer,
        recordReplay,
        recordBeforeAfterView,
        badgeToastQueue,
        dismissBadgeToast,
        allAvailableComplete,
        totalTimeSaved,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}
