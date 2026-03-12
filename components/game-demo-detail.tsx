'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGame, useSkin } from '@/components/game-provider'
import { getLevels, DEMO_SKILLS, type PlayerType, type Demo } from '@/lib/game-data'
import DragFile from './drag-file'
import GlossaryTip from './glossary-tip'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'
import { useTransition } from '@/components/transition-overlay'

type QuestPhase = 'briefing' | 'running-before' | 'skill-unlock' | 'prompt-tuning' | 'running-after' | 'celebration'

interface GameDemoDetailProps {
  demoId: number
}

// Processing stage labels
const BEFORE_STAGES = [
  'Reading input data...',
  'Analyzing content...',
  'Generating response...',
]

function getAfterStages(skillName: string): string[] {
  return [
    `Loading ${skillName} skill...`,
    'Applying specialist knowledge...',
    'Optimizing output...',
    'Generating enhanced result...',
  ]
}

export default function GameDemoDetail({ demoId }: GameDemoDetailProps) {
  const router = useRouter()
  const { navigateWithTransition } = useTransition()
  const {
    type,
    world,
    completed,
    markComplete,
    installSkill,
    startDemoTimer,
    recordBeforeAfterView,
    playerChoices,
    setPlayerChoice,
    promptChoices,
    setPromptChoice,
    choiceScores,
    setChoiceScore,
  } = useGame()
  const skin = useSkin()

  const [phase, setPhase] = useState<QuestPhase>('briefing')
  const [progressPct, setProgressPct] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [showBeforeResult, setShowBeforeResult] = useState(false)
  const [reactionStep, setReactionStep] = useState(0)
  const [showSkillCard, setShowSkillCard] = useState(false)
  const [skillInstalled, setSkillInstalled] = useState(false)
  const [skillShrinking, setSkillShrinking] = useState(false)
  const [showAfterResult, setShowAfterResult] = useState(false)
  const [showWowStat, setShowWowStat] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showTryThis, setShowTryThis] = useState(false)
  const [copied, setCopied] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [wowCounter, setWowCounter] = useState(0)

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [showRetryOption, setShowRetryOption] = useState(false)
  const [hasRetried, setHasRetried] = useState(false)

  const animFrameRef = useRef<number>(0)

  const runProgressBar = useCallback(
    (stages: string[], duration: number): Promise<void> => {
      return new Promise((resolve) => {
        const start = performance.now()
        setProgressPct(0)
        setProgressLabel(stages[0])

        const tick = (now: number) => {
          const elapsed = now - start
          const pct = Math.min((elapsed / duration) * 100, 100)
          setProgressPct(pct)

          const stageIdx = Math.min(
            Math.floor((pct / 100) * stages.length),
            stages.length - 1
          )
          setProgressLabel(stages[stageIdx])

          if (pct < 100) {
            animFrameRef.current = requestAnimationFrame(tick)
          } else {
            setProgressPct(100)
            resolve()
          }
        }
        animFrameRef.current = requestAnimationFrame(tick)
      })
    },
    []
  )

  if (!type || !world) {
    router.replace('/')
    return null
  }

  const levels = getLevels(type as PlayerType)
  const level = levels.find((l) => l.demos.some((d) => d.id === demoId))
  const demo = level?.demos.find((d) => d.id === demoId)

  if (!demo || !level) {
    router.replace('/play')
    return null
  }

  const demoIndex = level.demos.findIndex((d) => d.id === demoId)
  const nextDemo = level.demos[demoIndex + 1]
  const isDark = skin.isDark
  const done = completed.has(demo.id)
  const skill = demo.skillId ? DEMO_SKILLS[demo.id] : null

  // Player choice for this demo (A1)
  const selectedChoiceId = playerChoices[demoId] || null
  const selectedChoiceOption = demo.choices?.options.find(o => o.id === selectedChoiceId) || null
  const hasChoices = !!demo.choices
  const choiceMade = !!selectedChoiceId

  // Prompt strategy for Level 2+ (B2)
  const hasPromptStrategies = !!demo.promptStrategies
  const selectedPromptStrategy = demo.promptStrategies?.find(s => s.id === selectedPromptId) || null

  // Effective stages based on choice (A2) and prompt strategy (B2)
  const effectiveBeforeStages = selectedChoiceOption?.beforeStages || demo.beforeStages || BEFORE_STAGES
  const effectiveAfterStages = selectedPromptStrategy?.afterStages || selectedChoiceOption?.afterStages || demo.afterStages || null
  const effectiveWowStat = selectedChoiceOption?.wowStatText || demo.wowStat
  const promptQuality = selectedPromptStrategy?.quality
  const resultTierReaction = promptQuality && demo.resultTiers ? demo.resultTiers[promptQuality].reaction : null
  const effectiveReactionAfterLine = resultTierReaction || selectedPromptStrategy?.reactionAfterLine || selectedChoiceOption?.reactionAfterLine || null

  // If already completed, skip to celebration view
  const effectivePhase = done && phase === 'briefing' ? 'celebration' : phase

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Accent colors from skin
  const accentBg = skin.colors.accentBg
  const accentHover = skin.colors.accentHover
  const accentText = skin.colors.accentText
  const accentBorder = skin.colors.accentBorder

  // Phase 2: Run AI (Before)
  const handleRunAI = async () => {
    if (skin.sounds.demoStart) playSound(skin.sounds.demoStart)
    startDemoTimer(demoId)
    setPhase('running-before')
    await runProgressBar(effectiveBeforeStages, 600)

    setShowBeforeResult(true)
    if (skin.sounds.transition) playSound(skin.sounds.transition)

    await delay(200)
    setReactionStep(1)
    await delay(400)
    setReactionStep(2)

    await delay(400)
    setPhase('skill-unlock')
    setShowSkillCard(true)
  }

  // Phase 3: Install skill
  const handleInstallSkill = async () => {
    if (!skill) return
    if (skin.sounds.skillUnlock) playSound(skin.sounds.skillUnlock)
    installSkill(skill.id)
    setSkillInstalled(true)
    await delay(200)
    setSkillShrinking(true)
    await delay(300)
    setShowSkillCard(false)
    setShowBeforeResult(false)
    setProgressPct(0)
    if (hasPromptStrategies) {
      setPhase('prompt-tuning')
    } else {
      setPhase('running-after')
    }
  }

  // Phase 4: Run AI Again (After)
  const handleRunAgain = async () => {
    const afterStages = effectiveAfterStages || getAfterStages(skill?.name || 'Specialist')
    await runProgressBar(afterStages, 600)

    setShowBeforeResult(false)
    await delay(150)
    setShowAfterResult(true)

    const quality = selectedPromptStrategy?.quality
    const tier = quality && demo.resultTiers ? demo.resultTiers[quality] : null
    const multiplier = tier?.wowMultiplier ?? 1.0

    await delay(200)
    setShowWowStat(true)
    animateWowCounter(demo, multiplier)

    // Sound based on result quality
    if (quality === 'direct') {
      if (skin.sounds.resultOk) playSound(skin.sounds.resultOk)
    } else if (quality === 'expert') {
      if (skin.sounds.resultGreat) playSound(skin.sounds.resultGreat)
    } else if (quality === 'structured') {
      if (skin.sounds.resultGood) playSound(skin.sounds.resultGood)
    }

    if (quality === 'direct') {
      setShowRetryOption(true)
      return
    }

    if (demo.promptStrategies && quality) {
      let stars: number
      if (hasRetried) {
        stars = 2
      } else if (quality === 'expert') {
        stars = 3
      } else if (quality === 'structured') {
        stars = 2
      } else {
        stars = 1
      }
      setChoiceScore(demo.id, stars)
    } else if (!demo.promptStrategies) {
      setChoiceScore(demo.id, 3)
    }

    if (skin.sounds.demoComplete && quality !== 'structured') playSound(skin.sounds.demoComplete)
    await delay(400)
    setPhase('celebration')
    setJustCompleted(true)
    markComplete(demo.id)
    recordBeforeAfterView(demo.id)

    await delay(300)
    setShowComparison(true)
    await delay(200)
    setShowTryThis(true)
  }

  const handlePromptConfirm = () => {
    if (!selectedPromptId) return
    if (skin.sounds.demoStart) playSound(skin.sounds.demoStart)
    setPromptChoice(demoId, selectedPromptId)
    setPhase('running-after')
  }

  const handleRetry = () => {
    setShowAfterResult(false)
    setShowWowStat(false)
    setShowRetryOption(false)
    setProgressPct(0)
    setSelectedPromptId(null)
    setHasRetried(true)
    if (skin.sounds.retry) playSound(skin.sounds.retry)
    setPhase('prompt-tuning')
  }

  const handleContinueAnyway = async () => {
    setShowRetryOption(false)
    setChoiceScore(demo.id, 1)
    if (skin.sounds.demoComplete) playSound(skin.sounds.demoComplete)
    await delay(200)
    setPhase('celebration')
    setJustCompleted(true)
    markComplete(demo.id)
    recordBeforeAfterView(demo.id)
    await delay(300)
    setShowComparison(true)
    await delay(200)
    setShowTryThis(true)
  }

  const animateWowCounter = (d: Demo, multiplier: number = 1.0) => {
    let target: number
    if (d.resultTiers && multiplier < 1.0) {
      target = Math.round(multiplier * 100)
    } else if (d.resultTiers && multiplier === 1.0) {
      target = 100
    } else {
      const match = d.wowTime?.match(/(\d+)/)
      if (!match) return
      target = parseInt(match[1], 10)
    }
    const duration = 1200
    const start = performance.now()
    const step = (now: number) => {
      const pct = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3)
      setWowCounter(Math.round(eased * target))
      if (pct < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const handleBack = () => {
    if (skin.useTransitions) {
      navigateWithTransition('/play')
    } else {
      router.push('/play')
    }
  }

  const handleNext = () => {
    const path = nextDemo ? `/play/${nextDemo.id}` : '/play'
    if (skin.useTransitions) {
      navigateWithTransition(path)
    } else {
      router.push(path)
    }
  }

  const handleMarkComplete = async () => {
    if (done) return
    await copyToClipboard(demo.tryThis)
    markComplete(demo.id)
    setJustCompleted(true)
  }

  return (
    <div
      className={cn(
        'page-enter min-h-[calc(100vh-3.5rem)] flex flex-col',
        !isDark
          ? 'bg-gradient-to-b from-[#faf6ef] to-[#f5ece0]'
          : 'skin-arcade arcade-ground arcade-scanlines'
      )}
      style={isDark ? { background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' } : undefined}
    >
      {/* Arcade: pixel star background */}
      {isDark && <PixelStars />}

      <div className={cn('flex-1 px-4 sm:px-6 py-8 sm:py-10 max-w-6xl mx-auto w-full', isDark && 'pb-16')}>
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={cn(
                'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-heading',
                accentBg, 'text-white'
              )}
            >
              {level.id}
            </span>
            <p
              className={cn(
                'text-[10px] font-bold uppercase tracking-widest font-heading',
                accentText
              )}
            >
              {level.name} &middot; Demo {demoIndex + 1} of {level.demos.length}
            </p>
            {done && (
              <span className="text-emerald-500 text-sm font-bold">
                &#10003; Complete
              </span>
            )}
          </div>
          <h1 className={cn(
            'text-2xl md:text-3xl font-bold font-heading leading-tight',
            isDark ? 'text-white' : 'text-[var(--color-ink)]'
          )}>
            {demo.icon} {demo.title}
          </h1>
          <p className={cn('text-sm mt-1', isDark ? 'text-white/60' : 'text-[var(--color-muted)]')}>
            {demo.subtitle}
          </p>
        </div>

        {/* === PHASE 1: Mission Briefing === */}
        {effectivePhase === 'briefing' && (
          <div className="quest-phase-in">
            {skin.showMissionBrief && (
              <div className="text-center mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-heading text-[var(--mario-coin)] terminal-cursor">
                  {skin.briefingHeader}
                </p>
              </div>
            )}
            {skin.showMissionBrief && demo.missionBrief && (
              <div
                className="mb-6 p-4 border-2 quest-fade-in"
                style={{
                  background: 'rgba(26, 26, 46, 0.9)',
                  borderColor: 'var(--mario-coin)',
                }}
              >
                <p
                  className="text-sm font-heading font-semibold leading-relaxed"
                  style={{ color: 'var(--mario-coin)' }}
                >
                  {demo.missionBrief}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left: Problem + Fix */}
              <div className="space-y-5">
                <ContextBox
                  label="The Problem"
                  text={demo.pain}
                  borderColor={isDark ? '#FF6B6B' : 'var(--color-pain-red)'}
                  bgColor={isDark ? 'rgba(255,107,107,0.1)' : 'var(--color-pain-bg)'}
                  isDark={isDark}
                />
                <div className="relative">
                  <ContextBox
                    label={isDark ? 'The Fix' : 'The Fix'}
                    text={demo.fix}
                    borderColor={isDark ? 'var(--mario-pipe)' : 'var(--color-fix-green)'}
                    bgColor={isDark ? 'rgba(0,168,0,0.1)' : 'var(--color-fix-bg)'}
                    isDark={isDark}
                    glossaryTip={skin.showGlossaryTips ? <GlossaryTip termId="skill" /> : undefined}
                  />
                </div>
              </div>
              {/* Right: Data preview */}
              <div className="space-y-5">
                {skin.intelLabel && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-heading text-[var(--mario-coin)]">
                    {skin.intelLabel}
                  </p>
                )}
                <div
                  className={cn(
                    'border rounded-[2px] p-5',
                    !isDark
                      ? 'bg-white/80 border-amber-200/60'
                      : 'border-[var(--mario-block)]'
                  )}
                  style={isDark ? { background: 'rgba(255,255,255,0.95)' } : undefined}
                >
                  <DemoDataPreview demo={demo} />
                </div>
              </div>
            </div>

            {/* Player choice (A1) */}
            {demo.choices && (
              <div className="mt-8 mb-2">
                {skin.chooseTargetLabel ? (
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-heading text-[var(--mario-coin)] mb-4 text-center">
                    {skin.chooseTargetLabel}
                  </p>
                ) : (
                  <p className="text-xs font-bold uppercase tracking-widest font-heading text-[var(--color-faint)] mb-4 text-center">
                    {demo.choices.label}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {demo.choices.options.map((option) => {
                    const isSelected = playerChoices[demoId] === option.id
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          if (skin.sounds.selection) playSound(skin.sounds.selection)
                          setPlayerChoice(demoId, option.id)
                        }}
                        className={cn(
                          'p-5 rounded-[2px] border-2 text-left transition-all duration-200',
                          isDark
                            ? isSelected
                              ? 'border-[var(--mario-coin)] question-block-glow'
                              : 'border-white/20 hover:border-white/40'
                            : isSelected
                              ? 'border-amber-400 shadow-md'
                              : 'border-[var(--color-border)] hover:border-amber-300'
                        )}
                        style={
                          isDark
                            ? { background: isSelected ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)' }
                            : { background: isSelected ? '#FFF8E7' : 'white' }
                        }
                      >
                        <p className={cn(
                          'text-base font-heading font-bold mb-1',
                          isDark
                            ? isSelected ? 'text-[var(--mario-coin)]' : 'text-white'
                            : isSelected ? 'text-amber-700' : 'text-[var(--color-ink)]'
                        )}>
                          {option.name}
                        </p>
                        <p className={cn(
                          'text-xs',
                          isDark ? 'text-white/50' : 'text-[var(--color-muted)]'
                        )}>
                          {option.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Run AI button */}
            <div className="flex justify-center mt-10">
              <button
                onClick={handleRunAI}
                disabled={hasChoices && !choiceMade}
                className={cn(
                  'inline-flex items-center gap-3 font-heading font-bold rounded-[2px] text-white transition-all duration-300',
                  isDark ? 'px-14 py-5 text-lg' : cn('px-10 py-4 text-base', accentBg, accentHover),
                  hasChoices && !choiceMade
                    ? 'opacity-40 cursor-not-allowed'
                    : cn(
                        isDark && 'question-block-glow',
                        'hover:shadow-lg active:scale-[0.97]',
                        !isDark && 'hover:shadow-amber-200/40'
                      )
                )}
                style={isDark ? {
                  background: 'var(--mario-block)',
                  border: '3px solid #C07800',
                } : undefined}
              >
                {isDark ? (
                  <>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-[2px] text-white font-bold text-lg" style={{ background: '#C07800' }}>?</span>
                    {skin.runButtonLabel}
                  </>
                ) : (
                  <>
                    {skin.runButtonLabel}
                    <span className="text-xl leading-none">&#9654;</span>
                  </>
                )}
              </button>
              {skin.showGlossaryTips && <GlossaryTip termId="prompt" />}
            </div>
          </div>
        )}

        {/* === PHASE 2: Running Before === */}
        {(effectivePhase === 'running-before' || effectivePhase === 'skill-unlock') && (
          <div className="quest-phase-in">
            {!showBeforeResult && (
              <div className="max-w-2xl mx-auto mb-8">
                <ProcessingBar
                  pct={progressPct}
                  label={progressLabel}
                  isDark={isDark}
                />
              </div>
            )}

            {showBeforeResult && (
              <div className="quest-phase-in">
                {reactionStep >= 1 && (
                  <div className="text-center mb-6 space-y-2">
                    <p className={cn('text-sm quest-fade-in', isDark ? 'text-white/60' : 'text-[var(--color-muted)]')}>
                      {skin.showBeforeReaction ? (selectedChoiceOption?.reactionLine1 || demo.beforeReaction || skin.beforeReactionFallback) : skin.beforeReactionFallback}
                    </p>
                    {reactionStep >= 2 && (
                      <p className={cn('text-sm font-semibold quest-fade-in', isDark ? 'text-white' : 'text-[var(--color-ink)]')}>
                        {skin.showBeforeReaction ? (selectedChoiceOption?.reactionLine2 || skin.beforeReactionLine2Fallback) : skin.beforeReactionLine2Fallback}
                      </p>
                    )}
                  </div>
                )}

                {demo.beforeFile && (
                  <div className={cn("before-result-container mx-auto max-w-5xl", isDark && "screen-shake")}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'text-[10px] font-bold uppercase tracking-widest font-heading',
                        isDark ? 'text-white/40' : 'text-[var(--color-faint)]'
                      )}>
                        AI Result
                      </span>
                    </div>
                    <div className={cn(
                      'border rounded-[2px] overflow-hidden',
                      isDark ? 'border-[var(--mario-block)]' : 'border-[var(--color-border)]'
                    )}>
                      <iframe
                        src={demo.beforeFile}
                        className="w-full h-[500px] sm:h-[700px] bg-white"
                        title="Before result"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {effectivePhase === 'skill-unlock' && showSkillCard && skill && (
              <>
                {isDark && <div className="fixed inset-0 z-30 bg-black/60 quest-fade-in" />}
                <SkillUnlockCard
                  skill={skill}
                  isDark={isDark}
                  installed={skillInstalled}
                  shrinking={skillShrinking}
                  onInstall={handleInstallSkill}
                  skin={skin}
                />
              </>
            )}
          </div>
        )}

        {/* === PROMPT TUNING PHASE (Level 2+) === */}
        {effectivePhase === 'prompt-tuning' && demo.promptStrategies && (
          <div className="quest-phase-in">
            {isDark ? (
              <div className="text-center mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-heading text-[var(--mario-coin)] terminal-cursor">
                  {skin.choosePromptLabel}
                </p>
              </div>
            ) : (
              <p className="text-xs font-bold uppercase tracking-widest font-heading text-[var(--color-faint)] mb-6 text-center">
                {skin.choosePromptLabel}
              </p>
            )}
            <p className={cn('text-center text-sm mb-8', isDark ? 'text-white/60' : 'text-[var(--color-muted)]')}>
              Skill installed. Now, how you prompt matters.
            </p>

            <div className="max-w-2xl mx-auto space-y-4">
              {demo.promptStrategies.map((strategy) => {
                const isSelected = selectedPromptId === strategy.id
                const hasSelection = !!selectedPromptId
                return (
                  <button
                    key={strategy.id}
                    onClick={() => {
                      if (skin.sounds.selection) playSound(skin.sounds.selection)
                      setSelectedPromptId(strategy.id)
                    }}
                    className={cn(
                      'w-full text-left p-5 rounded-[2px] border-2 transition-all duration-200',
                      isDark
                        ? isSelected
                          ? 'border-[var(--mario-coin)] question-block-glow scale-[1.02]'
                          : hasSelection
                            ? 'border-white/10 opacity-50'
                            : 'border-white/20 hover:border-white/40'
                        : isSelected
                          ? 'border-amber-400 shadow-md scale-[1.02]'
                          : hasSelection
                            ? 'border-[var(--color-border)] opacity-50'
                            : 'border-[var(--color-border)] hover:border-amber-300'
                    )}
                    style={
                      isDark
                        ? { background: isSelected ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)' }
                        : { background: isSelected ? '#FFF8E7' : 'white' }
                    }
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn(
                        'text-xs font-heading font-bold px-2 py-0.5 rounded-[2px]',
                        isDark
                          ? isSelected ? 'bg-[var(--mario-coin)] text-[var(--mario-dark)]' : 'bg-white/10 text-white/60'
                          : isSelected ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                      )}>
                        {strategy.name}
                      </span>
                    </div>
                    <p className={cn(
                      'text-sm font-mono',
                      isDark
                        ? isSelected ? 'text-white' : 'text-white/40'
                        : isSelected ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)]'
                    )}>
                      &quot;{strategy.promptText}&quot;
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Confirm button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handlePromptConfirm}
                disabled={!selectedPromptId}
                className={cn(
                  'inline-flex items-center gap-3 px-10 py-4 text-base font-heading font-bold rounded-[2px] text-white transition-all duration-300',
                  !selectedPromptId
                    ? 'opacity-40 cursor-not-allowed'
                    : cn(accentBg, accentHover, 'hover:shadow-lg active:scale-[0.97]')
                )}
                style={isDark && selectedPromptId ? { border: '3px solid #C07800' } : undefined}
              >
                {skin.runAgainLabel}
                <span className="text-xl leading-none">&#9889;</span>
              </button>
            </div>
          </div>
        )}

        {/* === PHASE 4: Running After === */}
        {effectivePhase === 'running-after' && (
          <div className="quest-phase-in">
            {!showAfterResult && !showBeforeResult && (
              <>
                {progressPct > 0 && progressPct < 100 && (
                  <div className="max-w-2xl mx-auto mb-8">
                    <ProcessingBar
                      pct={progressPct}
                      label={progressLabel}
                      isDark={isDark}
                      enhanced
                    />
                  </div>
                )}

                {progressPct === 0 && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={handleRunAgain}
                      className={cn(
                        'inline-flex items-center gap-3 px-10 py-4 text-base font-heading font-bold rounded-[2px] text-white transition-all duration-300',
                        accentBg, accentHover,
                        'hover:shadow-lg active:scale-[0.97]',
                        'quest-phase-in'
                      )}
                      style={isDark ? { border: '3px solid #C07800' } : undefined}
                    >
                      {skin.runAgainLabel}
                      <span className="text-xl leading-none">&#9889;</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {showBeforeResult && (
              <div className="before-crossfade-out mx-auto max-w-5xl">
                <div className={cn(
                  'border rounded-[2px] overflow-hidden',
                  isDark ? 'border-[var(--mario-block)]' : 'border-[var(--color-border)]'
                )}>
                  <iframe
                    src={demo.beforeFile}
                    className="w-full h-[500px] sm:h-[700px] bg-white"
                    title="Before result"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            )}

            {showAfterResult && demo.afterFile && (
              <div className="quest-phase-in mx-auto max-w-5xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    'text-[10px] font-bold uppercase tracking-widest font-heading',
                    accentText
                  )}>
                    Enhanced AI Result
                  </span>
                </div>
                <div className={cn(
                  'border-2 rounded-[2px] overflow-hidden',
                  !isDark ? 'border-amber-400' : 'border-[var(--mario-coin)]'
                )}>
                  <iframe
                    src={demo.afterFile}
                    className="w-full h-[500px] sm:h-[700px] bg-white"
                    title="After result"
                    sandbox="allow-same-origin"
                  />
                </div>

                {showWowStat && effectiveWowStat && (
                  <div className="flex justify-center mt-4">
                    <div className={cn(
                      'inline-flex items-center gap-2 px-5 py-2 rounded-[2px] font-heading font-bold text-sm wow-stat-in',
                      !isDark
                        ? 'bg-amber-50 text-amber-800 border border-amber-300'
                        : 'border-[var(--mario-coin)] text-white'
                    )}
                    style={isDark ? { background: 'rgba(255,215,0,0.15)', borderWidth: '2px', borderStyle: 'solid' } : undefined}
                    >
                      {demo.resultTiers && promptQuality ? (
                        <>
                          <span className="text-lg">{wowCounter}%</span>
                          <span>improvement</span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg">{wowCounter}</span>
                          <span>seconds</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <p className={cn(
                  'text-center text-sm font-semibold mt-4 quest-fade-in',
                  isDark ? 'text-white' : 'text-[var(--color-ink)]'
                )}>
                  {effectiveReactionAfterLine
                    ? effectiveReactionAfterLine
                    : skin.showBeforeReaction
                      ? (demo.afterReaction || skin.afterReactionFallback)
                      : <>{skin.afterReactionFallback}</>
                  }
                </p>

                {showRetryOption && (
                  <div className="text-center mt-6 space-y-4 quest-fade-in">
                    <p className={cn(
                      'text-sm',
                      isDark ? 'text-white/60' : 'text-[var(--color-muted)]'
                    )}>
                      Good start! A better prompt could unlock much stronger results. Want to try again?
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={handleRetry}
                        className={cn(
                          'inline-flex items-center gap-2 px-8 py-3.5 text-sm font-heading font-bold rounded-[2px] transition-all',
                          isDark
                            ? 'text-[var(--mario-dark)] power-pulse'
                            : 'border-2 border-amber-400 text-amber-700 hover:bg-amber-50 hover:shadow-md'
                        )}
                        style={isDark ? { background: 'var(--mario-coin)', border: '3px solid #C07800' } : undefined}
                      >
                        RETRY?
                      </button>
                      <button
                        onClick={handleContinueAnyway}
                        className={cn(
                          'text-xs transition-colors',
                          isDark ? 'text-white/30 hover:text-white/60' : 'text-[var(--color-faint)] hover:text-[var(--color-muted)]'
                        )}
                      >
                        Continue anyway &#8594;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* === PHASE 5: Celebration + Compare === */}
        {effectivePhase === 'celebration' && (
          <div className="quest-phase-in">
            {justCompleted && (
              <div className="fixed inset-0 pointer-events-none z-50">
                <ConfettiBurst isDark={isDark} />
              </div>
            )}

            {justCompleted && isDark && (
              <div className="text-center mb-8 stage-clear-drop">
                <h2 className="text-4xl md:text-5xl font-heading font-bold" style={{ color: 'var(--mario-coin)' }}>
                  STAGE CLEAR!
                </h2>
              </div>
            )}

            {(showComparison || done) && demo.beforeFile && demo.afterFile && (
              <div className="comparison-slide-in">
                <p className={cn(
                  'text-center text-xs font-bold uppercase tracking-widest font-heading mb-4',
                  isDark ? 'text-white/40' : 'text-[var(--color-faint)]'
                )}>
                  Before vs After
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'text-[10px] font-bold uppercase tracking-widest font-heading',
                        isDark ? 'text-white/40' : 'text-[var(--color-faint)]'
                      )}>
                        Before
                      </span>
                    </div>
                    <div className={cn(
                      'border rounded-[2px] overflow-hidden before-muted',
                      isDark ? 'border-white/20' : 'border-[var(--color-border)]'
                    )}>
                      <iframe
                        src={demo.beforeFile}
                        className="w-full h-[400px] sm:h-[500px] bg-white"
                        title="Before"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'text-[10px] font-bold uppercase tracking-widest font-heading',
                        accentText
                      )}>
                        After
                      </span>
                      {effectiveWowStat && (
                        <span className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-[2px]',
                          !isDark
                            ? 'bg-amber-100 text-amber-700'
                            : 'text-white'
                        )}
                        style={isDark ? { background: 'rgba(255,215,0,0.15)' } : undefined}
                        >
                          {effectiveWowStat}
                        </span>
                      )}
                    </div>
                    <div className={cn(
                      'border-2 rounded-[2px] overflow-hidden after-vibrant',
                      !isDark ? 'border-amber-400' : 'border-[var(--mario-coin)]'
                    )}>
                      <iframe
                        src={demo.afterFile}
                        className="w-full h-[400px] sm:h-[500px] bg-white"
                        title="After"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(showTryThis || done) && (
              <div className="mt-8 max-w-5xl mx-auto quest-phase-in">
                <p className={cn(
                  'text-xs font-bold uppercase tracking-widest font-heading mb-3',
                  isDark ? 'text-[var(--mario-coin)]' : 'text-[var(--color-faint)]'
                )}>
                  {skin.tryThisPrefix}
                </p>
                <ContextBox
                  label="Prompt"
                  text={demo.tryThis}
                  borderColor={!isDark ? '#B8860B' : 'var(--mario-coin)'}
                  bgColor={!isDark ? '#FFF8E7' : 'rgba(255,215,0,0.08)'}
                  onCopy={() => copyToClipboard(demo.tryThis)}
                  copied={copied}
                  isDark={isDark}
                />
                {demo.dragFile && (
                  <div className="mt-4">
                    <DragFile file={demo.dragFile} />
                  </div>
                )}

                <div className="flex justify-center mt-6">
                  <div className="relative">
                    {justCompleted && <ConfettiBurst isDark={isDark} />}
                    <button
                      onClick={handleMarkComplete}
                      disabled={done}
                      className={cn(
                        'relative inline-flex items-center gap-2 px-10 py-4 text-sm font-heading font-bold rounded-[2px] transition-all duration-300',
                        done
                          ? isDark
                            ? 'border-2 border-emerald-500 text-emerald-400 cursor-default'
                            : 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300 cursor-default'
                          : cn(accentBg, 'text-white', accentHover, 'hover:shadow-lg active:scale-[0.97]')
                      )}
                      style={done && isDark ? { background: 'rgba(16,185,129,0.1)' } : isDark && !done ? { border: '3px solid #C07800' } : undefined}
                    >
                      {done ? (
                        <>
                          <span className="text-emerald-500">&#10003;</span>
                          Demo Complete
                        </>
                      ) : (
                        <>
                          Copy Prompt &amp; Mark Complete
                          <span className="text-lg leading-none">&#9733;</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {done && !showComparison && !justCompleted && demo.afterFile && (
              <div className="mx-auto max-w-5xl mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    'text-[10px] font-bold uppercase tracking-widest font-heading',
                    accentText
                  )}>
                    Result
                  </span>
                  {effectiveWowStat && (
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-[2px]',
                      !isDark ? 'bg-amber-100 text-amber-700' : 'text-white'
                    )}
                    style={isDark ? { background: 'rgba(255,215,0,0.15)' } : undefined}
                    >
                      {effectiveWowStat}
                    </span>
                  )}
                </div>
                <div className={cn(
                  'border-2 rounded-[2px] overflow-hidden',
                  !isDark ? 'border-amber-400' : 'border-[var(--mario-coin)]'
                )}>
                  <iframe
                    src={demo.afterFile}
                    className="w-full h-[500px] sm:h-[700px] bg-white"
                    title="Result"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom navigation */}
        <div className={cn(
          'flex items-center justify-between mt-10 pt-6 border-t',
          isDark ? 'border-white/10' : 'border-[var(--color-border)]'
        )}>
          <button
            onClick={handleBack}
            className={cn(
              'text-sm transition-colors font-heading',
              isDark ? 'text-white/40 hover:text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            )}
          >
            &#8592; Back to map
          </button>
          <button
            onClick={handleNext}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2 text-white text-sm font-heading font-semibold rounded-[2px] transition-colors',
              accentBg, accentHover
            )}
          >
            {nextDemo ? 'Next demo' : 'Back to map'}
            <span>&#8594;</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// === Sub-components ===

function ProcessingBar({
  pct,
  label,
  isDark,
  enhanced,
}: {
  pct: number
  label: string
  isDark: boolean
  enhanced?: boolean
}) {

  // Arcade: segmented blocks
  if (isDark) {
    const totalBlocks = 10
    const filledBlocks = Math.floor((pct / 100) * totalBlocks)
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-heading font-semibold text-white/60">
            {label}
          </p>
          <p className="text-[10px] font-heading text-white/30">
            {Math.round(pct)}%
          </p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalBlocks }, (_, i) => (
            <div
              key={i}
              className={cn(
                'h-3 flex-1 rounded-[1px] transition-all duration-75',
                i < filledBlocks
                  ? enhanced
                    ? 'processing-bar-mario'
                    : 'bg-[var(--mario-block)]'
                  : 'bg-white/10'
              )}
            />
          ))}
        </div>
      </div>
    )
  }

  // Gallery: smooth bar
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-heading font-semibold text-[var(--color-muted)]">
          {label}
        </p>
        <p className="text-[10px] font-heading text-[var(--color-faint)]">
          {Math.round(pct)}%
        </p>
      </div>
      <div className="h-1 rounded-[1px] overflow-hidden bg-[var(--color-border)]">
        <div
          className={cn(
            'h-full transition-none rounded-[1px]',
            enhanced ? 'processing-bar-enhanced-gallery' : 'bg-amber-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function SkillUnlockCard({
  skill,
  isDark,
  installed,
  shrinking,
  onInstall,
  skin,
}: {
  skill: { id: string; name: string; capabilities: string[] }
  isDark: boolean
  installed: boolean
  shrinking: boolean
  onInstall: () => void
  skin: { skillUnlockLabel: string; installLabel: string; installedLabel: string; skillUnlockIcon: string; showGlossaryTips: boolean }
}) {
  return (
    <div
      className={cn(
        'fixed z-40',
        !isDark
          ? 'right-4 top-1/2 -translate-y-1/2 skill-card-enter'
          : 'bottom-20 left-1/2 -translate-x-1/2 skill-card-grow',
        shrinking && (!isDark ? 'skill-card-shrink-gallery' : 'skill-card-shrink-arcade')
      )}
    >
      <div className={!isDark ? 'w-72' : 'w-80'}>
        <div
          className={cn(
            'border-[3px]',
            !isDark
              ? 'p-6 bg-[#faf6ef] border-amber-400 rounded-[2px]'
              : 'p-8'
          )}
          style={isDark ? {
            background: 'var(--mario-dark)',
            borderColor: 'var(--mario-pipe)',
          } : undefined}
        >
          {!installed ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">
                  {skin.skillUnlockIcon}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-widest font-heading',
                    !isDark ? 'text-amber-700' : ''
                  )}
                  style={isDark ? { color: 'var(--mario-pipe, #00A800)' } : undefined}
                >
                  {skin.skillUnlockLabel}
                </span>
                {skin.showGlossaryTips && <GlossaryTip termId="power-up" />}
              </div>
              <h3 className={cn(
                'text-lg font-heading font-bold mb-3',
                !isDark ? 'text-[var(--color-ink)]' : 'text-white'
              )}>
                {skill.name}
              </h3>
              <ul className="space-y-1.5 mb-5">
                {skill.capabilities.map((cap, i) => (
                  <li
                    key={i}
                    className={cn(
                      'flex items-center gap-2 text-sm',
                      !isDark ? 'text-[var(--color-muted)]' : 'text-white/70'
                    )}
                  >
                    <span className={cn(
                      'text-xs',
                      !isDark ? 'text-amber-500' : ''
                    )} style={isDark ? { color: 'var(--mario-coin)' } : undefined}>+</span>
                    {cap}
                  </li>
                ))}
              </ul>
              <button
                onClick={onInstall}
                className={cn(
                  'w-full font-heading font-bold rounded-[2px] text-white transition-all',
                  !isDark
                    ? 'py-2.5 text-sm bg-amber-600 hover:bg-amber-500'
                    : 'py-3.5 text-base power-pulse'
                )}
                style={isDark ? { background: 'var(--mario-pipe, #00A800)' } : undefined}
              >
                {skin.installLabel}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <span className={cn('text-4xl mb-3', !isDark ? '' : 'text-white')}>&#10003;</span>
              <p className={cn(
                'text-lg font-heading font-bold',
                !isDark ? 'text-[var(--color-ink)]' : 'text-white'
              )}>
                {skin.installedLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ContextBox({
  label,
  text,
  borderColor,
  bgColor,
  onCopy,
  copied,
  isDark,
  glossaryTip,
}: {
  label: string
  text: string
  borderColor: string
  bgColor: string
  onCopy?: () => void
  copied?: boolean
  isDark?: boolean
  glossaryTip?: React.ReactNode
}) {
  return (
    <div
      className="p-4 sm:p-5 rounded-[2px]"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        backgroundColor: bgColor,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <p
          className="text-[10px] font-bold uppercase tracking-widest font-heading inline-flex items-center"
          style={{ color: borderColor }}
        >
          {label}
          {glossaryTip}
        </p>
        {onCopy && (
          <button
            onClick={onCopy}
            className={cn(
              'text-xs flex items-center gap-1 px-2 py-1 rounded-[2px] transition-all duration-200 active:scale-95',
              isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
            )}
            style={{ color: borderColor }}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="font-heading font-semibold">Copied</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="1" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></svg>
                <span className="font-heading font-semibold">Copy</span>
              </>
            )}
          </button>
        )}
      </div>
      <p className={cn('text-sm leading-relaxed', isDark ? 'text-white/80' : 'text-[var(--color-ink)]')}>{text}</p>
    </div>
  )
}

function DemoDataPreview({ demo }: { demo: Demo }) {
  if (demo.dataType === 'table' && demo.dataHeaders && demo.dataRows) {
    return (
      <div className="overflow-x-auto">
        {demo.dataLabel && (
          <p className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wide mb-3 font-heading">
            {demo.dataLabel}
          </p>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {demo.dataHeaders.map((h, i) => (
                <th
                  key={i}
                  className="text-left py-2 px-2 text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wide font-heading"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {demo.dataRows.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  'border-b border-[var(--color-border)] last:border-0',
                  row.highlight && 'text-[var(--color-pain-red)]',
                  row.muted && 'text-[var(--color-faint)] italic'
                )}
              >
                {row.cells.map((cell, j) => (
                  <td key={j} className="py-1.5 px-2 text-xs">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (demo.dataType === 'file-list' && demo.dataFiles) {
    return (
      <div className="space-y-2">
        {demo.dataLabel && (
          <p className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wide mb-3 font-heading">
            {demo.dataLabel}
          </p>
        )}
        {demo.dataFiles.map((file, i) => (
          <div
            key={i}
            className="flex items-center gap-2 py-2 px-3 bg-[var(--color-cream)] rounded-[2px] text-sm"
          >
            <span className="text-[var(--color-faint)]">&#128196;</span>
            <span>{file}</span>
          </div>
        ))}
      </div>
    )
  }

  if (demo.dataType === 'text' && demo.dataText) {
    return (
      <div>
        {demo.dataLabel && (
          <p className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wide mb-3 font-heading">
            {demo.dataLabel}
          </p>
        )}
        <div className="space-y-2 text-sm text-[var(--color-muted)] leading-relaxed">
          {demo.dataText.map((line, i) => (
            <p key={i} className={cn(!line && 'h-2')}>
              {line}
            </p>
          ))}
        </div>
      </div>
    )
  }

  if (demo.dataType === 'html-preview' && demo.dataText) {
    return (
      <div>
        {demo.dataLabel && (
          <p className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wide mb-3 font-heading">
            {demo.dataLabel}
          </p>
        )}
        <div className="bg-white border border-[var(--color-border)] p-4 rounded-[2px] space-y-2 text-sm">
          {demo.dataText.map((line, i) => (
            <p
              key={i}
              className={cn(
                i === 0 && 'text-base font-bold text-[var(--color-pain-red)]',
                i === 1 && 'text-sm font-semibold',
                i >= 2 && 'text-xs text-[var(--color-muted)]'
              )}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    )
  }

  return null
}

function ConfettiBurst({ isDark }: { isDark: boolean }) {
  const isGallery = !isDark
  const particles = useMemo(() => {
    const colors = isGallery
      ? ['#B8860B', '#D4A843', '#22c55e', '#f59e0b', '#e8b04b']
      : ['#FFD700', '#E8A000', '#FFE44D', '#FFC800', '#FFAA00']
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * 360 + (Math.random() - 0.5) * 30
      const distance = 50 + Math.random() * 90
      const tx = Math.cos((angle * Math.PI) / 180) * distance
      const ty = Math.sin((angle * Math.PI) / 180) * distance - 30
      return {
        tx,
        ty,
        color: colors[i % colors.length],
        size: 3 + Math.random() * 5,
        delay: Math.random() * 0.12,
        id: i,
      }
    })
  }, [isGallery])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50 flex items-center justify-center">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute confetti-particle"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: !isDark ? undefined : '50%',
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// Utility
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Pixel stars background for arcade demo pages
function PixelStars() {
  const stars = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      speed: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 4}s`,
      baseOpacity: 0.2 + Math.random() * 0.3,
      peakOpacity: 0.6 + Math.random() * 0.4,
    })),
  [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="pixel-star"
          style={{
            left: s.left,
            top: s.top,
            '--star-speed': s.speed,
            '--star-delay': s.delay,
            '--star-base': s.baseOpacity,
            '--star-peak': s.peakOpacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
