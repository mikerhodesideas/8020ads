'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useGame, useSkin } from '@/components/game-provider'
import { getLevels, DEMO_SKILLS, ALL_LEVEL_2_IDS, ALL_LEVEL_3_IDS, type PlayerType, type Demo } from '@/lib/game-data'
import DragFile from './drag-file'
import GlossaryTip from './glossary-tip'
import { demoContent } from './demo-content'
import { cn } from '@/lib/utils'
import { track } from '@/lib/tracking'
import { playSound, startProgressTick, stopProgressTick, playStarReveal, startBackgroundMusic, stopBackgroundMusic } from '@/lib/sounds'
import { useTransition } from '@/components/transition-overlay'

type QuestPhase = 'briefing' | 'running-before' | 'skill-unlock' | 'setup-guide' | 'celebration'

// Map world IDs to sprite filenames (gallery has no sprite)
const worldSprites: Record<string, string> = {
  arcade: '/images/sprites/mario.png',
  'red-alert': '/images/sprites/red-alert.png',
  'clair-obscur': '/images/sprites/clair-obscur.png',
  tetris: '/images/sprites/tetris.png',
  zelda: '/images/sprites/zelda.png',
  'elder-scrolls': '/images/sprites/elder-scrolls.png',
}

function getDemoLevel(demoId: number): number {
  if (ALL_LEVEL_2_IDS.has(demoId)) return 2
  if (ALL_LEVEL_3_IDS.has(demoId)) return 3
  return 1
}

// Setup guide content for Level 3 demos (shown before demo runs)
const SETUP_GUIDES: Record<number, { title: string; instructions: string[]; note?: string }> = {
  8: {
    title: 'Install the Design Plugin',
    instructions: [
      'Open Cowork and go to Customize > Browse Plugins',
      'Find the Design plugin by Anthropic',
      'Click Install',
      'The plugin adds 12 specialized design skills',
    ],
  },
}

// Post-demo connector guidance (shown after demo completes)
const POST_DEMO_GUIDES: Record<number, { title: string; instructions: string[]; connectors: string[] }> = {
  7: {
    title: 'Now connect your REAL accounts',
    instructions: [
      'Open Cowork and go to Customize > Connectors',
      'Find Gmail and click Connect',
      'Find Google Calendar and click Connect',
      'Grant the permissions when prompted',
    ],
    connectors: ['Gmail', 'Google Calendar', 'HubSpot', 'Asana', 'ClickUp', 'Slack', 'Excel', 'Outlook', 'Notion'],
  },
}

interface GameDemoDetailProps {
  demoId: number
}

// Processing stage labels
const BEFORE_STAGES = [
  'Reading input data...',
  'Analyzing content...',
  'Generating response...',
]

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
    choiceScores,
    setChoiceScore,
  } = useGame()
  const skin = useSkin()

  const [phase, setPhase] = useState<QuestPhase>('briefing')
  const [progressPct, setProgressPct] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [showBeforeResult] = useState(false)
  const [reactionStep, setReactionStep] = useState(0)
  const [showSkillCard, setShowSkillCard] = useState(false)
  const [skillInstalled, setSkillInstalled] = useState(false)
  const [skillShrinking, setSkillShrinking] = useState(false)
  const [showAfterResult] = useState(false)
  const [showWowStat] = useState(false)
  const [showTryThis, setShowTryThis] = useState(false)
  const [copied, setCopied] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [downloadedItems, setDownloadedItems] = useState<Set<string>>(new Set())


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

  // Background music for clair-obscur demos
  useEffect(() => {
    if (world === 'clair-obscur') {
      startBackgroundMusic('clair-obscur', demoId)
    }
    return () => {
      stopBackgroundMusic()
    }
  }, [world, demoId])

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

  const effectiveWowStat = selectedChoiceOption?.wowStatText || demo.wowStat

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

  // Phase 2: Run AI
  const handleRunAI = async () => {
    if (skin.sounds.demoStart) playSound(skin.sounds.demoStart)
    track({ eventType: 'demo_started', demoId, demoLevel: getDemoLevel(demoId), worldId: world })
    startDemoTimer(demoId)

    if (skill) {
      // Level 2: Show skill install card
      setPhase('skill-unlock')
      setShowSkillCard(true)
    } else if (SETUP_GUIDES[demoId]) {
      // Level 3 demos with setup: show setup guide first
      setPhase('setup-guide')
    } else {
      // Level 1 & Level 3 (no setup): Single run
      await runSingleDemo()
    }
  }

  // Shared: run progress bar -> celebration
  const runSingleDemo = async () => {
    setPhase('running-before')
    if (skin.sounds.progressTick) startProgressTick(skin.sounds.progressTick)
    const stages = demo.afterStages || BEFORE_STAGES
    await runProgressBar(stages, 600)
    stopProgressTick()
    await delay(300)
    if (skin.sounds.demoComplete) playSound(skin.sounds.demoComplete)
    setChoiceScore(demo.id, 3)
    playStarReveal(3, skin.id)
    setPhase('celebration')
    setJustCompleted(true)
    markComplete(demo.id)
    recordBeforeAfterView(demo.id)
    await delay(200)
    setShowTryThis(true)
  }

  // Level 3: Continue from setup guide
  const handleSetupContinue = async () => {
    if (skin.sounds.demoStart) playSound(skin.sounds.demoStart)
    await runSingleDemo()
  }

  // Phase 3: Install skill then auto-run
  const handleInstallSkill = async () => {
    if (!skill) return
    if (skin.sounds.skillUnlock) playSound(skin.sounds.skillUnlock)
    installSkill(skill.id)
    setSkillInstalled(true)
    await delay(200)
    setSkillShrinking(true)
    await delay(300)
    setShowSkillCard(false)
    setProgressPct(0)
    // Auto-run with the skill (no prompt-tuning step)
    await runSingleDemo()
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
        skin.skinClass,
        skin.id === 'arcade' && 'arcade-ground arcade-scanlines',
        skin.backgroundEffect === 'radar-grid' && 'bg-effect-radar-grid',
        skin.backgroundEffect === 'grid-lines' && 'bg-effect-grid-lines',
        skin.backgroundEffect === 'nebula' && 'bg-effect-nebula',
      )}
      style={{ background: 'var(--page-bg)' }}
    >
      {/* Arcade: pixel star background */}
      {skin.backgroundEffect === 'pixel-stars' && <PixelStars />}

      {/* World-specific atmospheric background images for play pages */}
      {skin.id !== 'gallery' && level && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img
            src={`/images/maps/${skin.id}-level-${level.id}.png`}
            alt=""
            className="w-full h-full"
            style={{
              objectFit: 'cover',
              objectPosition: 'center center',
              opacity: skin.id === 'clair-obscur' ? 0.08
                : skin.id === 'arcade' ? 0.15
                : skin.id === 'zelda' ? 0.15
                : skin.id === 'elder-scrolls' ? 0.15
                : skin.id === 'tetris' ? 0.12
                : 0.2,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: skin.id === 'arcade'
                ? 'radial-gradient(ellipse at center 40%, transparent 10%, rgba(26, 26, 46, 0.7) 100%)'
                : skin.id === 'clair-obscur'
                ? 'none'
                : skin.id === 'zelda'
                ? 'radial-gradient(ellipse at center 40%, transparent 10%, rgba(16, 40, 16, 0.7) 100%)'
                : skin.id === 'elder-scrolls'
                ? 'radial-gradient(ellipse at center 40%, transparent 10%, rgba(10, 10, 30, 0.7) 100%)'
                : skin.id === 'tetris'
                ? 'radial-gradient(ellipse at center 40%, transparent 10%, rgba(10, 10, 30, 0.7) 100%)'
                : 'radial-gradient(ellipse at center 40%, transparent 10%, rgba(10, 18, 8, 0.75) 100%)',
            }}
          />
        </div>
      )}

      <div
        className={cn('flex-1 px-4 sm:px-6 py-8 sm:py-10 max-w-6xl mx-auto w-full relative z-[1]', isDark && 'pb-16')}
        style={
          skin.id === 'clair-obscur' ? {
            background: 'rgba(250, 246, 239, 0.95)',
            marginTop: '1rem',
            marginBottom: '2rem',
            borderLeft: '1px solid rgba(197, 165, 90, 0.2)',
            borderRight: '1px solid rgba(197, 165, 90, 0.2)',
          }
          : skin.id === 'zelda' ? {
            background: 'rgba(240, 232, 208, 0.92)',
            marginTop: '1rem',
            marginBottom: '2rem',
            borderLeft: '1px solid rgba(218, 165, 32, 0.15)',
            borderRight: '1px solid rgba(218, 165, 32, 0.15)',
          }
          : undefined
        }
      >
        {/* Header - compact after briefing phase */}
        {effectivePhase === 'briefing' ? (
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
                  'text-xs font-bold uppercase tracking-widest font-heading',
                  accentText
                )}
              >
                {level.name} &middot; Demo {demoIndex + 1} of {level.demos.length}
              </p>
            </div>
            <h1 className={cn(
              'text-2xl md:text-3xl font-bold font-heading leading-tight',
              'text-[var(--world-text)]'
            )}>
              {demo.icon} {demo.title}
            </h1>
            <p className={cn('text-sm mt-1', 'text-[var(--world-text-secondary)]')}>
              {demo.subtitle}
            </p>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-3">
            <span
              className={cn(
                'inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold font-heading',
                accentBg, 'text-white'
              )}
            >
              {level.id}
            </span>
            <p className="text-xs text-[var(--world-text-muted)] font-heading">
              {level.name} &middot; Demo {demoIndex + 1} of {level.demos.length}
            </p>
            {done && (
              <span className="text-emerald-500 text-xs font-bold">
                &#10003; Complete
              </span>
            )}
          </div>
        )}

        {/* === PHASE 1: Mission Briefing === */}
        {effectivePhase === 'briefing' && (
          <div className="quest-phase-in">
            {skin.showMissionBrief && (
              <div className="flex items-center justify-center gap-3 mb-6">
                {world && worldSprites[world] && (
                  <div
                    className="w-11 h-11 overflow-hidden flex-shrink-0"
                    style={{
                      borderRadius: '50%',
                      border: '2px solid var(--world-accent)',
                      boxShadow: '0 0 8px rgba(255,215,0,0.25)',
                    }}
                  >
                    <img
                      src={worldSprites[world]}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                )}
                <p className="text-xs font-bold uppercase tracking-[0.3em] font-heading text-[var(--world-accent)] terminal-cursor">
                  {skin.briefingHeader}
                </p>
              </div>
            )}
            {skin.showMissionBrief && demo.missionBrief && (
              <div
                className="mb-6 p-4 border-2 quest-fade-in"
                style={{
                  background: 'var(--world-brief-bg)',
                  borderColor: 'var(--world-brief-border)',
                }}
              >
                <p
                  className="text-sm font-heading font-semibold leading-relaxed"
                  style={{ color: 'var(--world-accent)' }}
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
                  borderColor={'var(--world-problem-border)'}
                  bgColor={'var(--world-problem-bg)'}
                />
                <div className="relative">
                  <ContextBox
                    label="The Fix"
                    text={demo.fix}
                    borderColor={'var(--world-fix-border)'}
                    bgColor={'var(--world-fix-bg)'}
                    glossaryTip={skin.showGlossaryTips ? <GlossaryTip termId="skill" /> : undefined}
                  />
                </div>
              </div>
              {/* Right: Data preview */}
              <div className="space-y-5">
                {skin.intelLabel && (
                  <p className="text-xs font-bold uppercase tracking-[0.3em] font-heading text-[var(--world-accent)]">
                    {skin.intelLabel}
                  </p>
                )}
                <div
                  className="border rounded-[2px] p-5 border-[var(--world-data-border)]"
                  style={{ background: 'var(--world-data-bg)' }}
                >
                  <DemoDataPreview demo={demo} />
                </div>
              </div>
            </div>

            {/* Player choice (A1) */}
            {demo.choices && (
              <div className="mt-8 mb-2">
                {skin.chooseTargetLabel ? (
                  <p className="text-xs font-bold uppercase tracking-[0.3em] font-heading text-[var(--world-accent)] mb-4 text-center">
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
                          if (skin.sounds.promptSelect) playSound(skin.sounds.promptSelect)
                          setPlayerChoice(demoId, option.id)
                        }}
                        className={cn(
                          'p-5 rounded-[2px] border-2 text-left transition-all duration-200',
                          isSelected
                            ? 'border-[var(--world-accent)] question-block-glow'
                            : 'border-[var(--world-text-muted)] hover:border-[var(--world-text-secondary)]'
                        )}
                        style={{ background: isSelected ? 'var(--world-selection-bg)' : 'var(--world-card-bg)' }}
                      >
                        <p className={cn(
                          'text-base font-heading font-bold mb-1',
                          isSelected ? 'text-[var(--world-accent)]' : 'text-[var(--world-text)]'
                        )}>
                          {option.name}
                        </p>
                        <p className="text-xs text-[var(--world-text-secondary)]">
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
                  'inline-flex items-center gap-3 font-heading font-bold rounded-[2px] text-white transition-all duration-300 cta-pulse',
                  isDark ? 'px-14 py-5 text-lg' : cn('px-10 py-4 text-base', accentBg, accentHover),
                  hasChoices && !choiceMade
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:shadow-lg active:scale-[0.97]'
                )}
                style={{
                  background: isDark ? 'var(--world-accent3)' : undefined,
                  border: isDark ? '3px solid var(--world-accent-border)' : undefined,
                  boxShadow: hasChoices && !choiceMade ? undefined : 'var(--world-btn-shadow)',
                }}
              >
                {skin.id === 'arcade' ? (
                  <>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-[2px] text-white font-bold text-lg" style={{ background: 'var(--world-accent-border)' }}>?</span>
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
            {effectivePhase === 'running-before' && !showBeforeResult && (
              <div className="max-w-2xl mx-auto mb-8">
                <ProcessingBar
                  pct={progressPct}
                  label={progressLabel}
                  processingStyle={skin.processingStyle}
                  skinId={skin.id}
                />
              </div>
            )}

            {showBeforeResult && (
              <div className="quest-phase-in">
                {reactionStep >= 1 && (
                  <div className="text-center mb-6 space-y-2">
                    <p className={cn('text-sm quest-fade-in', 'text-[var(--world-text-secondary)]')}>
                      {skin.showBeforeReaction ? (selectedChoiceOption?.reactionLine1 || demo.beforeReaction || skin.beforeReactionFallback) : skin.beforeReactionFallback}
                    </p>
                    {reactionStep >= 2 && (
                      <p className={cn('text-sm font-semibold quest-fade-in', 'text-[var(--world-text)]')}>
                        {skin.showBeforeReaction ? (selectedChoiceOption?.reactionLine2 || skin.beforeReactionLine2Fallback) : skin.beforeReactionLine2Fallback}
                      </p>
                    )}
                  </div>
                )}

                {demoContent[demo.id] && (
                  <div className={cn("before-result-container mx-auto max-w-5xl", isDark && "screen-shake")}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'text-xs font-bold uppercase tracking-widest font-heading',
                        'text-[var(--world-text-muted)]'
                      )}>
                        AI Result
                      </span>
                    </div>
                    <div className={cn(
                      'border rounded-[2px] overflow-hidden',
                      'border-[var(--world-data-border)]'
                    )} style={{ maxHeight: 700, overflowY: 'hidden' }}>
                      {(() => { const B = demoContent[demo.id].before; return <B /> })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Skill unlock overlay + card: portalled to body to avoid ancestor
            transforms (page-enter, quest-phase-in) breaking fixed positioning */}
        {effectivePhase === 'skill-unlock' && showSkillCard && skill && createPortal(
          <>
            <div
              className="fixed inset-0 z-30 quest-fade-in"
              style={{ background: 'var(--world-overlay-bg)' }}
            />
            <SkillUnlockCard
              skill={skill}
              installed={skillInstalled}
              shrinking={skillShrinking}
              onInstall={handleInstallSkill}
              skin={skin}
              skillZip={demo.skillZip}
            />
          </>,
          document.body
        )}

        {/* === SETUP GUIDE PHASE (Level 3) === */}
        {effectivePhase === 'setup-guide' && SETUP_GUIDES[demoId] && (
          <div className="quest-phase-in">
            <div className="max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest font-heading text-[var(--world-text-muted)] mb-6 text-center">
                Setup Required
              </p>
              <div
                className="p-8 rounded-[2px] border-2 mb-8"
                style={{
                  background: 'var(--world-card-bg)',
                  borderColor: 'var(--world-accent)',
                }}
              >
                <h3 className="text-lg font-heading font-bold mb-4 text-[var(--world-text)]">
                  {SETUP_GUIDES[demoId].title}
                </h3>
                <ol className="space-y-3 mb-6">
                  {SETUP_GUIDES[demoId].instructions.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[var(--world-text-secondary)]"
                    >
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-heading shrink-0 mt-0.5 text-white"
                        style={{ background: 'var(--world-accent)' }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-[var(--world-text-muted)] text-center">
                  [SCREENSHOT: {SETUP_GUIDES[demoId].title} flow]
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleSetupContinue}
                  className={cn(
                    'inline-flex items-center gap-3 px-10 py-4 text-base font-heading font-bold rounded-[2px] text-white transition-all duration-300',
                    accentBg, accentHover,
                    'hover:shadow-lg active:scale-[0.97]'
                  )}
                  style={isDark ? { border: '3px solid var(--world-accent-border)' } : undefined}
                >
                  Got it, run the demo
                  <span className="text-xl leading-none">&#9889;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === PHASE 4: Celebration === */}
        {effectivePhase === 'celebration' && (
          <div className="quest-phase-in">
            {justCompleted && (
              <div className="fixed inset-0 pointer-events-none z-50">
                <ConfettiBurst />
              </div>
            )}

            {justCompleted && isDark && (
              <div className="text-center mb-8 stage-clear-drop">
                <h2 className="text-4xl md:text-5xl font-heading font-bold" style={{ color: 'var(--world-accent)' }}>
                  {skin.celebrationText(level.id)}
                </h2>
              </div>
            )}

            {/* Wow stat hero block (Level 1 especially) */}
            {effectiveWowStat && (
              <div className="quest-phase-in mx-auto max-w-5xl mb-6">
                <div
                  className="flex items-center justify-between gap-4 px-6 py-4 rounded-[2px]"
                  style={{
                    background: 'var(--world-card-bg)',
                    borderLeft: '4px solid var(--world-accent)',
                  }}
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest font-heading text-[var(--world-text-muted)] mb-1">
                      {skill ? 'Skill-Powered Result' : 'AI Result'}
                    </p>
                    <p className="text-lg sm:text-xl font-heading font-bold text-[var(--world-text)]">
                      {effectiveWowStat}
                    </p>
                  </div>
                  {demo.wowTime && (
                    <div className="text-right shrink-0">
                      <p className="text-2xl sm:text-3xl font-heading font-bold" style={{ color: 'var(--world-accent)' }}>
                        {demo.wowTime}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* After reaction text */}
            {demo.afterReaction && (
              <p className={cn(
                'text-center text-sm sm:text-base font-semibold mb-6 quest-fade-in max-w-3xl mx-auto',
                'text-[var(--world-text-secondary)]'
              )}>
                {demo.afterReaction}
              </p>
            )}

            {/* Result display (all demos) */}
            {demoContent[demo.id] && (
              <div className="quest-phase-in mx-auto max-w-5xl mb-4">
                <div className={cn(
                  'border-2 rounded-[2px] overflow-hidden',
                  'border-[var(--world-accent)]'
                )} style={{ maxHeight: 700, overflowY: 'hidden' }}>
                  {(() => { const A = demoContent[demo.id].after; return <A playerType={type as PlayerType} /> })()}
                </div>
              </div>
            )}

            {/* Post-celebration guidance: nudge user to the "Now Do It" section */}
            {(showTryThis || done) && (
              <div className="mt-6 mb-2 text-center quest-phase-in">
                <button
                  onClick={() => {
                    const el = document.getElementById('try-it-yourself')
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="inline-flex flex-col items-center gap-1 group transition-opacity hover:opacity-80"
                >
                  <span
                    className="text-sm font-heading font-semibold"
                    style={{ color: 'var(--world-accent)' }}
                  >
                    {level && level.id >= 3 ? 'Now try it with your own data' : 'Try it yourself'}
                  </span>
                  <span
                    className="text-lg animate-bounce"
                    style={{ color: 'var(--world-accent)' }}
                  >
                    &#8595;
                  </span>
                </button>
              </div>
            )}

            {(showTryThis || done) && (
              <div id="try-it-yourself" className="mt-4 max-w-5xl mx-auto quest-phase-in scroll-mt-4">
                {/* Post-demo connector guide (Demo 7) */}
                {POST_DEMO_GUIDES[demo.id] && (
                  <div
                    className="p-6 sm:p-8 rounded-[2px] mb-6"
                    style={{
                      background: 'var(--world-card-bg)',
                      border: '2px solid var(--world-accent)',
                    }}
                  >
                    <h3 className="text-lg font-heading font-bold mb-4 text-[var(--world-text)]">
                      {POST_DEMO_GUIDES[demo.id].title}
                    </h3>
                    <ol className="space-y-2 mb-6">
                      {POST_DEMO_GUIDES[demo.id].instructions.map((step, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-[var(--world-text-secondary)]"
                        >
                          <span
                            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold font-heading shrink-0 mt-0.5 text-white"
                            style={{ background: 'var(--world-accent)' }}
                          >
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <p className="text-xs font-bold uppercase tracking-widest font-heading mb-3 text-[var(--world-text-muted)]">
                      Cowork connects to everything you already use
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POST_DEMO_GUIDES[demo.id].connectors.map((name) => (
                        <span
                          key={name}
                          className="px-3 py-1 text-xs font-heading font-medium rounded-[2px]"
                          style={{
                            background: 'var(--world-selection-bg)',
                            color: 'var(--world-text)',
                            border: '1px solid var(--world-data-border)',
                          }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Big CTA section */}
                <div
                  className="p-8 sm:p-10 rounded-[2px] text-center"
                  style={{
                    background: 'var(--world-selection-bg)',
                    border: '2px solid var(--world-accent)',
                  }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest font-heading mb-3 text-[var(--world-text-muted)]">
                    {skin.tryThisPrefix}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2" style={{ color: 'var(--world-accent)' }}>
                    {level && level.id >= 3 ? 'Now do it with your own data' : 'Try it yourself'}
                  </h2>
                  <p className="text-sm text-[var(--world-text-secondary)] mb-4 max-w-xl mx-auto">
                    {skill
                      ? 'Install the skill, drag in the data file, and paste the prompt.'
                      : demo.dragFile
                        ? 'Drag the file into Cowork and paste the prompt.'
                        : 'Copy the prompt, open Cowork, and paste it in.'
                    }
                  </p>
                  {level && level.id < 3 && (
                    <p className="text-xs text-[var(--world-text-muted)] mb-8 max-w-lg mx-auto">
                      We&apos;ve created sample data for you to try this out. In Level 3, you&apos;ll connect your own accounts.
                    </p>
                  )}
                  {level && level.id >= 3 && <div className="mb-4" />}

                  {/* Skill zip download (Level 2) */}
                  {demo.skillZip && (
                    <div className="mb-4">
                      <p className={cn(
                        'text-xs font-bold uppercase tracking-widest font-heading mb-2 text-left',
                        'text-[var(--world-text-muted)]'
                      )}>
                        1. Download and install the skill
                      </p>
                      <a
                        href={demo.skillZip.path}
                        download={demo.skillZip.name}
                        className="flex items-center gap-4 px-6 py-4 border-2 rounded-[2px] transition-all text-left"
                        style={{
                          borderColor: downloadedItems.has(demo.skillZip.path)
                            ? (isDark ? 'rgba(16,185,129,0.6)' : '#10b981')
                            : 'var(--world-download-border)',
                          borderStyle: downloadedItems.has(demo.skillZip.path) ? 'solid' : 'dashed',
                          background: downloadedItems.has(demo.skillZip.path)
                            ? (isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)')
                            : 'var(--world-download-bg)',
                        }}
                        onMouseEnter={(e) => {
                          if (!downloadedItems.has(demo.skillZip!.path)) {
                            e.currentTarget.style.background = 'var(--world-download-hover-bg)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!downloadedItems.has(demo.skillZip!.path)) {
                            e.currentTarget.style.background = 'var(--world-download-bg)'
                          }
                        }}
                        onClick={() => {
                          if (skin.sounds.skillDownload) playSound(skin.sounds.skillDownload)
                          setDownloadedItems(prev => new Set(prev).add(demo.skillZip!.path))
                        }}
                      >
                        <span className="text-2xl shrink-0">
                          {downloadedItems.has(demo.skillZip.path) ? '\u2713' : '\uD83D\uDCE6'}
                        </span>
                        <span
                          className="text-base font-medium truncate font-heading"
                          style={{
                            color: downloadedItems.has(demo.skillZip.path)
                              ? (isDark ? '#6ee7b7' : '#059669')
                              : 'var(--world-download-text)',
                          }}
                        >
                          {downloadedItems.has(demo.skillZip.path) ? `${demo.skillZip.name} - Downloaded` : demo.skillZip.name}
                        </span>
                        <span
                          className="ml-auto text-sm font-heading font-bold shrink-0 px-4 py-2 rounded-[2px] text-white"
                          style={{
                            background: downloadedItems.has(demo.skillZip.path)
                              ? (isDark ? '#059669' : '#10b981')
                              : 'var(--world-download-badge-bg)',
                          }}
                        >
                          {downloadedItems.has(demo.skillZip.path) ? '\u2713 Done' : '\u2193 Download'}
                        </span>
                      </a>
                      <p
                        className="text-xs mt-1"
                        style={{ color: 'var(--world-download-subtext)' }}
                      >
                        In Cowork: Customize &gt; Skills &gt; + &gt; Upload this file
                      </p>
                    </div>
                  )}

                  <ContextBox
                    label={demo.skillZip ? (demo.dragFile ? '3. Paste the prompt' : '2. Paste the prompt') : 'Prompt'}
                    text={demo.tryThis}
                    borderColor={'var(--world-accent)'}
                    bgColor={'var(--world-prompt-bg)'}
                    onCopy={() => copyToClipboard(demo.tryThis)}
                    copied={copied}
                  />

                  {demo.dragFile && (
                    <div className="mt-4">
                      {demo.skillZip && (
                        <p className={cn(
                          'text-xs font-bold uppercase tracking-widest font-heading mb-2 text-left',
                          'text-[var(--world-text-muted)]'
                        )}>
                          2. Drag in the data file
                        </p>
                      )}
                      <DragFile file={demo.dragFile} />
                    </div>
                  )}

                  <div className="flex justify-center mt-8">
                    <div className="relative">
                      {justCompleted && <ConfettiBurst />}
                      <button
                        onClick={handleMarkComplete}
                        disabled={done}
                        className={cn(
                          'relative inline-flex items-center gap-3 px-12 py-5 text-lg font-heading font-bold rounded-[2px] transition-all duration-300',
                          done
                            ? isDark
                              ? 'border-2 border-emerald-500 text-emerald-400 cursor-default'
                              : 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300 cursor-default'
                            : cn(accentBg, 'text-white', accentHover, 'hover:shadow-lg active:scale-[0.97] cta-pulse')
                        )}
                        style={done && isDark ? { background: 'rgba(16,185,129,0.1)' } : isDark && !done ? { border: '3px solid var(--world-accent-border)' } : undefined}
                      >
                        {done ? (
                          <>
                            <span className="text-emerald-500">&#10003;</span>
                            Demo Complete
                          </>
                        ) : (
                          <>
                            Copy Prompt &amp; Mark Complete
                            <span className="text-xl leading-none">&#9733;</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--world-text-muted)]">
          <button
            onClick={handleBack}
            className="text-sm transition-colors font-heading text-[var(--world-text-muted)] hover:text-[var(--world-text)]"
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
  processingStyle,
  enhanced,
  skinId,
}: {
  pct: number
  label: string
  processingStyle: 'segmented-blocks' | 'smooth-bar'
  enhanced?: boolean
  skinId?: string
}) {

  // Segmented blocks (arcade, red-alert, tetris, zelda, elder-scrolls)
  if (processingStyle === 'segmented-blocks') {
    const totalBlocks = 10
    const filledBlocks = Math.floor((pct / 100) * totalBlocks)
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-heading font-semibold" style={{ color: 'var(--world-progress-label)' }}>
            {label}
          </p>
          <p className="text-xs font-heading" style={{ color: 'var(--world-progress-pct)' }}>
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
                    ? (skinId === 'arcade' ? 'processing-bar-mario' : `processing-bar-${skinId}`)
                    : ''
                  : ''
              )}
              style={{
                background: i < filledBlocks
                  ? (enhanced ? undefined : 'var(--world-accent3)')
                  : 'var(--world-progress-track)',
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Smooth bar (gallery, clair-obscur)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-heading font-semibold" style={{ color: 'var(--world-progress-label)' }}>
          {label}
        </p>
        <p className="text-xs font-heading" style={{ color: 'var(--world-progress-pct)' }}>
          {Math.round(pct)}%
        </p>
      </div>
      <div className="h-1 rounded-[1px] overflow-hidden" style={{ background: 'var(--world-progress-track)' }}>
        <div
          className={cn(
            'h-full transition-none rounded-[1px]',
            enhanced ? 'processing-bar-enhanced-gallery' : ''
          )}
          style={{ width: `${pct}%`, background: enhanced ? undefined : 'var(--world-progress-fill)' }}
        />
      </div>
    </div>
  )
}

function SkillUnlockCard({
  skill,
  installed,
  shrinking,
  onInstall,
  skin,
  skillZip,
}: {
  skill: { id: string; name: string; capabilities: string[] }
  installed: boolean
  shrinking: boolean
  onInstall: () => void
  skin: { skillUnlockLabel: string; installLabel: string; installedLabel: string; skillUnlockIcon: string; showGlossaryTips: boolean; isDark: boolean }
  skillZip?: { name: string; path: string }
}) {
  const isDark = skin.isDark
  return (
    <div
      className={cn(
        'fixed z-40',
        !isDark
          ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 skill-card-enter'
          : 'left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 skill-card-grow',
        shrinking && (!isDark ? 'skill-card-shrink-gallery' : 'skill-card-shrink-arcade')
      )}
    >
      <div className={!isDark ? 'w-96' : 'w-80'}>
        <div
          className="border-[3px] p-8 rounded-[2px] shadow-2xl"
          style={{
            background: isDark ? 'rgba(20, 30, 50, 0.95)' : '#faf6ef',
            backdropFilter: isDark ? 'blur(8px)' : undefined,
            borderColor: isDark ? 'var(--world-accent)' : 'var(--world-skill-card-border)',
          }}
        >
          {!installed ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">
                  {skin.skillUnlockIcon}
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-widest font-heading"
                  style={{ color: 'var(--world-accent2)' }}
                >
                  {skin.skillUnlockLabel}
                </span>
                {skin.showGlossaryTips && <GlossaryTip termId="power-up" />}
              </div>
              <h3
                className="text-lg font-heading font-bold mb-4"
                style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}
              >
                {skill.name}
              </h3>

              {/* Install button - prominent, near the top */}
              <button
                onClick={() => {
                  if (skillZip) {
                    const a = document.createElement('a')
                    a.href = skillZip.path
                    a.download = skillZip.name
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                  }
                  onInstall()
                }}
                className={cn(
                  'w-full font-heading font-bold rounded-[2px] text-white transition-all mb-5',
                  isDark ? 'py-3.5 text-base power-pulse' : 'py-2.5 text-sm'
                )}
                style={{ background: 'var(--world-accent2)' }}
              >
                {skin.installLabel}
              </button>

              {/* Skill zip download */}
              {skillZip && (
                <a
                  href={skillZip.path}
                  download={skillZip.name}
                  className="flex items-center gap-3 px-4 py-3 border border-dashed rounded-[2px] mb-4 transition-colors"
                  style={{
                    borderColor: 'var(--world-skill-download-border)',
                    background: 'var(--world-skill-download-bg)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--world-skill-download-hover-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--world-skill-download-bg)'}
                >
                  <span className="text-lg shrink-0">&#128230;</span>
                  <span
                    className="text-sm font-heading truncate"
                    style={{ color: isDark ? 'rgba(255,255,255,0.85)' : '#333' }}
                  >
                    {skillZip.name}
                  </span>
                  <span
                    className="ml-auto text-xs font-heading font-bold"
                    style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#888' }}
                  >
                    &#8595;
                  </span>
                </a>
              )}

              <ul className="space-y-1.5 mb-4">
                {skill.capabilities.map((cap, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: isDark ? 'rgba(255,255,255,0.75)' : '#555' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--world-accent)' }}>+</span>
                    {cap}
                  </li>
                ))}
              </ul>

              {/* Install instructions */}
              <p
                className="text-xs text-center"
                style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#999' }}
              >
                In Cowork: Customize &gt; Skills &gt; + &gt; Upload
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <span className="text-4xl mb-3" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>&#10003;</span>
              <p className="text-lg font-heading font-bold" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
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
  glossaryTip,
}: {
  label: string
  text: string
  borderColor: string
  bgColor: string
  onCopy?: () => void
  copied?: boolean
  glossaryTip?: React.ReactNode
}) {
  return (
    <div
      onClick={onCopy}
      className={cn(
        'p-4 sm:p-5 rounded-[2px] text-left',
        onCopy && 'cursor-pointer transition-all duration-150 active:scale-[0.99] hover:opacity-90',
      )}
      style={{
        borderLeft: `3px solid ${borderColor}`,
        backgroundColor: bgColor,
      }}
      title={onCopy ? 'Click to copy' : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <p
          className="text-xs font-bold uppercase tracking-widest font-heading inline-flex items-center"
          style={{ color: borderColor }}
        >
          {label}
          {glossaryTip}
        </p>
        {onCopy && (
          <span
            className="text-xs flex items-center gap-1 px-2 py-1 rounded-[2px]"
            style={{ color: borderColor }}
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="font-heading font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="1" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></svg>
                <span className="font-heading font-semibold">Click to copy</span>
              </>
            )}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-[var(--world-text)]">{text}</p>
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

function ConfettiBurst() {
  // CSS vars: --world-confetti-1 through --world-confetti-5, --world-confetti-radius
  const colorVars = [
    'var(--world-confetti-1)',
    'var(--world-confetti-2)',
    'var(--world-confetti-3)',
    'var(--world-confetti-4)',
    'var(--world-confetti-5)',
  ]
  const particles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * 360 + (Math.random() - 0.5) * 30
      const distance = 50 + Math.random() * 90
      const tx = Math.cos((angle * Math.PI) / 180) * distance
      const ty = Math.sin((angle * Math.PI) / 180) * distance - 30
      return {
        tx,
        ty,
        colorIdx: i % 5,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 0.12,
        id: i,
      }
    })
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50 flex items-center justify-center">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute confetti-particle"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: colorVars[p.colorIdx],
            borderRadius: 'var(--world-confetti-radius)',
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
