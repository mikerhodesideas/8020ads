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
import { getLevel1Demos, getLevel2Demos, getLevel3Demos, DEMO_TIME_SAVED, ALL_LEVEL_1_IDS, ALL_LEVEL_2_IDS, ALL_LEVEL_3_IDS, LEVEL_1_SKILL_IDS, LEVEL_2_SKILL_IDS, LEVEL_3_SKILL_IDS, DEMO_SKILLS } from '@/lib/game-data'
import { getSkin, type SkinConfig } from '@/lib/skin-config'
import { track } from '@/lib/tracking'

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
  playerChoices: Record<number, string>
  promptChoices: Record<number, string>
  choiceScores: Record<number, number> // demo ID -> stars 1-3
  openedGlossary: Set<string> // glossary term IDs opened by the player
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
  setPlayerChoice: (demoId: number, choiceId: string) => void
  setPromptChoice: (demoId: number, strategyId: string) => void
  setChoiceScore: (demoId: number, stars: number) => void
  openGlossaryTerm: (termId: string) => void
  badgeToastQueue: string[]
  dismissBadgeToast: () => void
  allAvailableComplete: boolean
  totalTimeSaved: number
  totalStars: number
  maxStars: number
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
  playerChoices: {},
  promptChoices: {},
  choiceScores: {},
  openedGlossary: new Set(),
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
  setPlayerChoice: () => {},
  setPromptChoice: () => {},
  setChoiceScore: () => {},
  openGlossaryTerm: () => {},
  badgeToastQueue: [],
  dismissBadgeToast: () => {},
  allAvailableComplete: false,
  totalTimeSaved: 0,
  totalStars: 0,
  maxStars: 0,
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
      playerChoices: parsed.playerChoices || {},
      promptChoices: parsed.promptChoices || {},
      choiceScores: parsed.choiceScores || {},
      openedGlossary: new Set(parsed.openedGlossary || []),
    }
  } catch {
    return { ...defaultState, completed: new Set(), skills: new Set(), worldsVisited: new Set(), replays: new Set(), beforeAfterViews: new Set(), openedGlossary: new Set() }
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
      playerChoices: state.playerChoices,
      promptChoices: state.promptChoices,
      choiceScores: state.choiceScores,
      openedGlossary: Array.from(state.openedGlossary),
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

  // Full Clear: all 9 available demos (L1 + L2 + L3)
  const l2Done = Array.from(state.completed).filter((id) => ALL_LEVEL_2_IDS.has(id))
  const l3Done = Array.from(state.completed).filter((id) => ALL_LEVEL_3_IDS.has(id))
  if (l1Done.length >= 3 && l2Done.length >= 3 && l3Done.length >= 3) shouldHave.push('full-clear')

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
    openedGlossary: new Set(),
  })
  const [loaded, setLoaded] = useState(false)
  const [badgeToastQueue, setBadgeToastQueue] = useState<string[]>([])
  const demoStartTimesRef = useRef<Record<number, number>>({})
  const trackedLevelsRef = useRef<Set<number>>(new Set())

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

  // Track level completions (fire once per level per session)
  useEffect(() => {
    if (!loaded) return
    for (const lvl of [1, 2, 3]) {
      if (trackedLevelsRef.current.has(lvl)) continue
      const ids = lvl === 1 ? ALL_LEVEL_1_IDS : lvl === 2 ? ALL_LEVEL_2_IDS : ALL_LEVEL_3_IDS
      const done = Array.from(state.completed).filter((id) => ids.has(id)).length
      if (done >= 3) {
        trackedLevelsRef.current.add(lvl)
        track({ eventType: 'level_completed', demoLevel: lvl })
      }
    }
  }, [state.completed.size, loaded])

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
    const demoLevel = ALL_LEVEL_2_IDS.has(demoId) ? 2 : ALL_LEVEL_3_IDS.has(demoId) ? 3 : 1

    track({ eventType: 'demo_completed', demoId, demoLevel })

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
      playerChoices: {},
      promptChoices: {},
      choiceScores: {},
      openedGlossary: new Set(),
    }
    setState(fresh)
    setBadgeToastQueue([])
    demoStartTimesRef.current = {}
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
  }, [])

  const isLevelComplete = useCallback(
    (levelId: number) => {
      if (!state.type) return false
      // Check against the player's actual demos for this level, not the global ID sets.
      // This ensures we only count the 3 demos assigned to this player type.
      const t = state.type as PlayerType
      const levelDemos = levelId === 1
        ? getLevel1Demos(t)
        : levelId === 2
          ? getLevel2Demos(t)
          : levelId === 3
            ? getLevel3Demos(t)
            : []
      if (levelDemos.length === 0) return false
      return levelDemos.every((d) => state.completed.has(d.id))
    },
    [state.completed, state.type]
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

  const setPlayerChoice = useCallback((demoId: number, choiceId: string) => {
    setState((prev) => ({
      ...prev,
      playerChoices: { ...prev.playerChoices, [demoId]: choiceId },
    }))
  }, [])

  const setPromptChoice = useCallback((demoId: number, strategyId: string) => {
    setState((prev) => ({
      ...prev,
      promptChoices: { ...prev.promptChoices, [demoId]: strategyId },
    }))
  }, [])

  const setChoiceScore = useCallback((demoId: number, stars: number) => {
    setState((prev) => ({
      ...prev,
      choiceScores: { ...prev.choiceScores, [demoId]: stars },
    }))
  }, [])

  const openGlossaryTerm = useCallback((termId: string) => {
    setState((prev) => ({
      ...prev,
      openedGlossary: new Set(prev.openedGlossary).add(termId),
    }))
  }, [])

  const dismissBadgeToast = useCallback(() => {
    setBadgeToastQueue((prev) => prev.slice(1))
  }, [])

  const allAvailableComplete = useMemo(() => {
    if (!state.type) return false
    const l1Demos = getLevel1Demos(state.type)
    const l2Demos = getLevel2Demos(state.type)
    const l3Demos = getLevel3Demos()
    const allDemos = [...l1Demos, ...l2Demos, ...l3Demos]
    return allDemos.every((d) => state.completed.has(d.id))
  }, [state.type, state.completed])

  const totalTimeSaved = useMemo(() => {
    let total = 0
    state.completed.forEach((id) => {
      total += DEMO_TIME_SAVED[id] || 0
    })
    return total
  }, [state.completed])

  const totalStars = useMemo(() => {
    return Object.values(state.choiceScores).reduce((sum, s) => sum + s, 0)
  }, [state.choiceScores])

  // Level 1 demos don't have prompt strategies, so they get 3 stars automatically when completed
  // Level 2+ demos earn 1-3 stars based on prompt quality
  // Max = 9 demos * 3 stars = 27
  const maxStars = useMemo(() => {
    if (!state.type) return 0
    const l1Demos = getLevel1Demos(state.type)
    const l2Demos = getLevel2Demos(state.type)
    const l3Demos = getLevel3Demos()
    return (l1Demos.length + l2Demos.length + l3Demos.length) * 3
  }, [state.type])

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
        setPlayerChoice,
        setPromptChoice,
        setChoiceScore,
        openGlossaryTerm,
        badgeToastQueue,
        dismissBadgeToast,
        allAvailableComplete,
        totalTimeSaved,
        totalStars,
        maxStars,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}

export function useSkin(): SkinConfig {
  const { world } = useGame()
  return getSkin(world || 'gallery')
}
