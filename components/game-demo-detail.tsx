'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { getLevels, DEMO_SKILLS, type PlayerType, type Demo } from '@/lib/game-data'
import DragFile from './drag-file'
import { cn } from '@/lib/utils'

type QuestPhase = 'briefing' | 'running-before' | 'skill-unlock' | 'running-after' | 'celebration'

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
  const {
    type,
    world,
    completed,
    markComplete,
    installSkill,
    startDemoTimer,
    recordBeforeAfterView,
  } = useGame()

  const [phase, setPhase] = useState<QuestPhase>('briefing')
  const [progressPct, setProgressPct] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [showBeforeResult, setShowBeforeResult] = useState(false)
  const [reactionStep, setReactionStep] = useState(0) // 0=none, 1=first line, 2=second line
  const [showSkillCard, setShowSkillCard] = useState(false)
  const [skillInstalled, setSkillInstalled] = useState(false)
  const [skillFlipping, setSkillFlipping] = useState(false)
  const [skillShrinking, setSkillShrinking] = useState(false)
  const [showAfterResult, setShowAfterResult] = useState(false)
  const [showWowStat, setShowWowStat] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showTryThis, setShowTryThis] = useState(false)
  const [copied, setCopied] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [wowCounter, setWowCounter] = useState(0)

  const animFrameRef = useRef<number>(0)

  // Animate a progress bar over `duration` ms through `stages`
  // Must be declared before early returns (React hooks rule)
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
  const isGallery = world === 'gallery'
  const done = completed.has(demo.id)
  const skill = demo.skillId ? DEMO_SKILLS[demo.id] : null

  // If already completed, skip to celebration view
  const effectivePhase = done && phase === 'briefing' ? 'celebration' : phase

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Phase 2: Run AI (Before)
  const handleRunAI = async () => {
    startDemoTimer(demoId)
    setPhase('running-before')
    await runProgressBar(BEFORE_STAGES, 3500)

    // Show before result
    setShowBeforeResult(true)

    // Reaction text
    await delay(800)
    setReactionStep(1)
    await delay(1500)
    setReactionStep(2)

    // Phase 3: Skill unlock after pause
    await delay(1500)
    setPhase('skill-unlock')
    setShowSkillCard(true)
  }

  // Phase 3: Install skill
  const handleInstallSkill = async () => {
    if (!skill) return
    setSkillFlipping(true)
    await delay(600)
    setSkillInstalled(true)
    installSkill(skill.id)
    await delay(800)
    setSkillShrinking(true)
    await delay(500)
    setShowSkillCard(false)
    // Reset state so "Run Again" button renders correctly
    setShowBeforeResult(false)
    setProgressPct(0)
    setPhase('running-after')
  }

  // Phase 4: Run AI Again (After)
  const handleRunAgain = async () => {
    const afterStages = getAfterStages(skill?.name || 'Specialist')
    await runProgressBar(afterStages, 4500)

    // Crossfade: hide before, show after
    setShowBeforeResult(false)
    await delay(300)
    setShowAfterResult(true)

    // Wow stat
    await delay(600)
    setShowWowStat(true)
    animateWowCounter(demo)

    // Phase 5: Celebration
    await delay(1500)
    setPhase('celebration')
    setJustCompleted(true)
    markComplete(demo.id)
    recordBeforeAfterView(demo.id)

    // Show comparison after confetti
    await delay(1200)
    setShowComparison(true)
    await delay(600)
    setShowTryThis(true)
  }

  // Animate the wow counter number
  const animateWowCounter = (d: Demo) => {
    const match = d.wowTime?.match(/(\d+)/)
    if (!match) return
    const target = parseInt(match[1], 10)
    const duration = 1200
    const start = performance.now()
    const step = (now: number) => {
      const pct = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3) // ease-out cubic
      setWowCounter(Math.round(eased * target))
      if (pct < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const handleBack = () => {
    router.push('/play')
  }

  const handleNext = () => {
    if (nextDemo) {
      router.push(`/play/${nextDemo.id}`)
    } else {
      router.push('/play')
    }
  }

  const handleMarkComplete = async () => {
    if (done) return
    await copyToClipboard(demo.tryThis)
    markComplete(demo.id)
    setJustCompleted(true)
  }

  // Accent colors
  const accent = isGallery ? 'amber' : 'blue'
  const accentBg = isGallery ? 'bg-amber-600' : 'bg-blue-600'
  const accentHover = isGallery ? 'hover:bg-amber-500' : 'hover:bg-blue-500'
  const accentText = isGallery ? 'text-amber-700' : 'text-blue-600'
  const accentBorder = isGallery ? 'border-amber-200/60' : 'border-blue-200/60'

  return (
    <div
      className={cn(
        'min-h-[calc(100vh-3.5rem)] flex flex-col',
        isGallery
          ? 'bg-gradient-to-b from-[#faf6ef] to-[#f5ece0]'
          : 'bg-gradient-to-b from-[#f0f8ff] to-[#e8f4ff]'
      )}
    >
      <div className="flex-1 px-4 sm:px-6 py-8 sm:py-10 max-w-6xl mx-auto w-full">
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
          <h1 className="text-2xl md:text-3xl font-bold font-heading leading-tight text-[var(--color-ink)]">
            {demo.icon} {demo.title}
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {demo.subtitle}
          </p>
        </div>

        {/* === PHASE 1: Mission Briefing === */}
        {effectivePhase === 'briefing' && (
          <div className="quest-phase-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left: Problem + Fix */}
              <div className="space-y-5">
                <ContextBox
                  label="The Problem"
                  text={demo.pain}
                  borderColor="var(--color-pain-red)"
                  bgColor="var(--color-pain-bg)"
                />
                <ContextBox
                  label="The Fix"
                  text={demo.fix}
                  borderColor="var(--color-fix-green)"
                  bgColor="var(--color-fix-bg)"
                />
              </div>
              {/* Right: Data preview */}
              <div className="space-y-5">
                <div
                  className={cn(
                    'border rounded-[2px] p-5',
                    isGallery
                      ? 'bg-white/80 border-amber-200/60'
                      : 'bg-white/90 border-blue-200/60'
                  )}
                >
                  <DemoDataPreview demo={demo} />
                </div>
              </div>
            </div>

            {/* Run AI button */}
            <div className="flex justify-center mt-10">
              <button
                onClick={handleRunAI}
                className={cn(
                  'inline-flex items-center gap-3 px-10 py-4 text-base font-heading font-bold rounded-[2px] text-white transition-all duration-300',
                  accentBg, accentHover,
                  'hover:shadow-lg active:scale-[0.97]',
                  isGallery ? 'hover:shadow-amber-200/40' : 'hover:shadow-blue-200/40'
                )}
              >
                Run AI
                <span className="text-xl leading-none">&#9654;</span>
              </button>
            </div>
          </div>
        )}

        {/* === PHASE 2: Running Before === */}
        {(effectivePhase === 'running-before' || effectivePhase === 'skill-unlock') && (
          <div className="quest-phase-in">
            {/* Progress bar (visible during processing, hides once result shows) */}
            {!showBeforeResult && (
              <div className="max-w-2xl mx-auto mb-8">
                <ProcessingBar
                  pct={progressPct}
                  label={progressLabel}
                  isGallery={isGallery}
                />
              </div>
            )}

            {/* Before result */}
            {showBeforeResult && (
              <div className="quest-phase-in">
                {/* Reaction text */}
                {reactionStep >= 1 && (
                  <div className="text-center mb-6 space-y-2">
                    <p className="text-sm text-[var(--color-muted)] quest-fade-in">
                      AI produced a result.
                    </p>
                    {reactionStep >= 2 && (
                      <p className="text-sm font-semibold text-[var(--color-ink)] quest-fade-in">
                        But is this actually impressive?
                      </p>
                    )}
                  </div>
                )}

                {/* Before HTML result in iframe */}
                {demo.beforeFile && (
                  <div className="before-result-container mx-auto max-w-4xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest font-heading text-[var(--color-faint)]">
                        AI Result
                      </span>
                    </div>
                    <div className={cn(
                      'border rounded-[2px] overflow-hidden',
                      'border-[var(--color-border)]'
                    )}>
                      <iframe
                        src={demo.beforeFile}
                        className="w-full h-[400px] sm:h-[500px] bg-white"
                        title="Before result"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Skill unlock card */}
            {effectivePhase === 'skill-unlock' && showSkillCard && skill && (
              <SkillUnlockCard
                skill={skill}
                isGallery={isGallery}
                flipping={skillFlipping}
                installed={skillInstalled}
                shrinking={skillShrinking}
                onInstall={handleInstallSkill}
              />
            )}
          </div>
        )}

        {/* === PHASE 4: Running After === */}
        {effectivePhase === 'running-after' && (
          <div className="quest-phase-in">
            {!showAfterResult && !showBeforeResult && (
              <>
                {/* Show progress bar while running */}
                {progressPct > 0 && progressPct < 100 && (
                  <div className="max-w-2xl mx-auto mb-8">
                    <ProcessingBar
                      pct={progressPct}
                      label={progressLabel}
                      isGallery={isGallery}
                      enhanced
                    />
                  </div>
                )}

                {/* Run Again button (before clicking) */}
                {progressPct === 0 && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={handleRunAgain}
                      className={cn(
                        'inline-flex items-center gap-3 px-10 py-4 text-base font-heading font-bold rounded-[2px] text-white transition-all duration-300',
                        accentBg, accentHover,
                        'hover:shadow-lg active:scale-[0.97]',
                        isGallery ? 'hover:shadow-amber-200/40' : 'hover:shadow-blue-200/40',
                        'quest-phase-in'
                      )}
                    >
                      Run Again with Skill
                      <span className="text-xl leading-none">&#9889;</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Before result fading out */}
            {showBeforeResult && (
              <div className="before-crossfade-out mx-auto max-w-4xl">
                <div className={cn(
                  'border rounded-[2px] overflow-hidden',
                  'border-[var(--color-border)]'
                )}>
                  <iframe
                    src={demo.beforeFile}
                    className="w-full h-[400px] sm:h-[500px] bg-white"
                    title="Before result"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            )}

            {/* After result */}
            {showAfterResult && demo.afterFile && (
              <div className="quest-phase-in mx-auto max-w-4xl">
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
                  isGallery ? 'border-amber-400' : 'border-blue-400'
                )}>
                  <iframe
                    src={demo.afterFile}
                    className="w-full h-[400px] sm:h-[500px] bg-white"
                    title="After result"
                    sandbox="allow-same-origin"
                  />
                </div>

                {/* Wow stat floating badge */}
                {showWowStat && demo.wowStat && (
                  <div className="flex justify-center mt-4">
                    <div className={cn(
                      'inline-flex items-center gap-2 px-5 py-2 rounded-[2px] font-heading font-bold text-sm wow-stat-in',
                      isGallery
                        ? 'bg-amber-50 text-amber-800 border border-amber-300'
                        : 'bg-blue-50 text-blue-800 border border-blue-300'
                    )}>
                      <span className="text-lg">{wowCounter}</span>
                      <span>seconds</span>
                    </div>
                  </div>
                )}

                {/* Reaction text */}
                <p className="text-center text-sm font-semibold text-[var(--color-ink)] mt-4 quest-fade-in">
                  Now THAT&apos;S what AI can do with the right skills.
                </p>
              </div>
            )}
          </div>
        )}

        {/* === PHASE 5: Celebration + Compare === */}
        {effectivePhase === 'celebration' && (
          <div className="quest-phase-in">
            {/* Confetti */}
            {justCompleted && (
              <div className="fixed inset-0 pointer-events-none z-50">
                <ConfettiBurst isGallery={isGallery} />
              </div>
            )}

            {/* Side-by-side comparison */}
            {(showComparison || done) && demo.beforeFile && demo.afterFile && (
              <div className="comparison-slide-in">
                <p className="text-center text-xs font-bold uppercase tracking-widest font-heading text-[var(--color-faint)] mb-4">
                  Before vs After
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                  {/* Before (muted) */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest font-heading text-[var(--color-faint)]">
                        Before
                      </span>
                    </div>
                    <div className="border rounded-[2px] overflow-hidden border-[var(--color-border)] before-muted">
                      <iframe
                        src={demo.beforeFile}
                        className="w-full h-[300px] sm:h-[380px] bg-white"
                        title="Before"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                  {/* After (vibrant) */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'text-[10px] font-bold uppercase tracking-widest font-heading',
                        accentText
                      )}>
                        After
                      </span>
                      {demo.wowStat && (
                        <span className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-[2px]',
                          isGallery
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        )}>
                          {demo.wowStat}
                        </span>
                      )}
                    </div>
                    <div className={cn(
                      'border-2 rounded-[2px] overflow-hidden after-vibrant',
                      isGallery ? 'border-amber-400' : 'border-blue-400'
                    )}>
                      <iframe
                        src={demo.afterFile}
                        className="w-full h-[300px] sm:h-[380px] bg-white"
                        title="After"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm font-heading font-semibold text-[var(--color-ink)] mt-6">
                  Skills unlock the real power.
                </p>

                {/* Subtle branding watermark */}
                <p className="text-center text-[10px] text-[var(--color-faint)] mt-1">
                  8020skill.com
                </p>
              </div>
            )}

            {/* Try This section */}
            {(showTryThis || done) && (
              <div className="mt-8 max-w-3xl mx-auto quest-phase-in">
                <p className="text-xs font-bold uppercase tracking-widest font-heading text-[var(--color-faint)] mb-3">
                  Try it yourself in CoWork
                </p>
                <ContextBox
                  label="Prompt"
                  text={demo.tryThis}
                  borderColor={isGallery ? '#B8860B' : '#2563EB'}
                  bgColor={isGallery ? '#FFF8E7' : '#EFF4FF'}
                  onCopy={() => copyToClipboard(demo.tryThis)}
                  copied={copied}
                />
                {demo.dragFile && (
                  <div className="mt-4">
                    <DragFile file={demo.dragFile} />
                  </div>
                )}

                {/* Complete / Copy button */}
                <div className="flex justify-center mt-6">
                  <div className="relative">
                    {justCompleted && <ConfettiBurst isGallery={isGallery} />}
                    <button
                      onClick={handleMarkComplete}
                      disabled={done}
                      className={cn(
                        'relative inline-flex items-center gap-2 px-8 py-3 text-sm font-heading font-bold rounded-[2px] transition-all duration-300',
                        done
                          ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300 cursor-default'
                          : cn(accentBg, 'text-white', accentHover, 'hover:shadow-lg active:scale-[0.97]')
                      )}
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

            {/* If already done and just revisiting, show the after result directly */}
            {done && !showComparison && !justCompleted && demo.afterFile && (
              <div className="mx-auto max-w-4xl mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    'text-[10px] font-bold uppercase tracking-widest font-heading',
                    accentText
                  )}>
                    Result
                  </span>
                  {demo.wowStat && (
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-[2px]',
                      isGallery ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    )}>
                      {demo.wowStat}
                    </span>
                  )}
                </div>
                <div className={cn(
                  'border-2 rounded-[2px] overflow-hidden',
                  isGallery ? 'border-amber-400' : 'border-blue-400'
                )}>
                  <iframe
                    src={demo.afterFile}
                    className="w-full h-[400px] sm:h-[500px] bg-white"
                    title="Result"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--color-border)]">
          <button
            onClick={handleBack}
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-heading"
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
  isGallery,
  enhanced,
}: {
  pct: number
  label: string
  isGallery: boolean
  enhanced?: boolean
}) {
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
      <div className="h-1 bg-[var(--color-border)] rounded-[1px] overflow-hidden">
        <div
          className={cn(
            'h-full transition-none rounded-[1px]',
            enhanced
              ? isGallery
                ? 'processing-bar-enhanced-gallery'
                : 'processing-bar-enhanced-arcade'
              : isGallery
                ? 'bg-amber-500'
                : 'bg-blue-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function SkillUnlockCard({
  skill,
  isGallery,
  flipping,
  installed,
  shrinking,
  onInstall,
}: {
  skill: { id: string; name: string; capabilities: string[] }
  isGallery: boolean
  flipping: boolean
  installed: boolean
  shrinking: boolean
  onInstall: () => void
}) {
  return (
    <div
      className={cn(
        'fixed right-4 top-1/2 -translate-y-1/2 z-40 skill-card-enter',
        shrinking && 'skill-card-shrink'
      )}
      style={{ perspective: '800px' }}
    >
      <div
        className={cn(
          'w-72 transition-transform duration-500',
          flipping && 'skill-card-flip'
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face */}
        <div
          className={cn(
            'p-6 border-2 rounded-[2px]',
            isGallery
              ? 'bg-[#faf6ef] border-amber-400'
              : 'bg-[#f0f8ff] border-blue-400',
            installed && 'invisible'
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">
              {isGallery ? '\u{1F3A8}' : '\u{2B50}'}
            </span>
            <span
              className={cn(
                'text-[10px] font-bold uppercase tracking-widest font-heading',
                isGallery ? 'text-amber-700' : 'text-blue-600'
              )}
            >
              Skill Unlocked
            </span>
          </div>
          <h3 className="text-lg font-heading font-bold text-[var(--color-ink)] mb-3">
            {skill.name}
          </h3>
          <ul className="space-y-1.5 mb-5">
            {skill.capabilities.map((cap, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-[var(--color-muted)]"
              >
                <span className={cn(
                  'text-xs',
                  isGallery ? 'text-amber-500' : 'text-blue-500'
                )}>+</span>
                {cap}
              </li>
            ))}
          </ul>
          <button
            onClick={onInstall}
            className={cn(
              'w-full py-2.5 text-sm font-heading font-bold rounded-[2px] text-white transition-all',
              isGallery
                ? 'bg-amber-600 hover:bg-amber-500'
                : 'bg-blue-600 hover:bg-blue-500'
            )}
          >
            Install Skill
          </button>
        </div>

        {/* Back face (installed) */}
        {installed && (
          <div
            className={cn(
              'absolute inset-0 p-6 border-2 rounded-[2px] flex flex-col items-center justify-center',
              isGallery
                ? 'bg-[#faf6ef] border-amber-400'
                : 'bg-[#f0f8ff] border-blue-400'
            )}
          >
            <span className="text-4xl mb-3">&#10003;</span>
            <p className="text-lg font-heading font-bold text-[var(--color-ink)]">
              Installed!
            </p>
          </div>
        )}
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
}: {
  label: string
  text: string
  borderColor: string
  bgColor: string
  onCopy?: () => void
  copied?: boolean
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
          className="text-[10px] font-bold uppercase tracking-widest font-heading"
          style={{ color: borderColor }}
        >
          {label}
        </p>
        {onCopy && (
          <button
            onClick={onCopy}
            className="text-xs flex items-center gap-1 px-2 py-1 rounded-[2px] transition-all duration-200 hover:bg-black/5 active:scale-95"
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
      <p className="text-sm text-[var(--color-ink)] leading-relaxed">{text}</p>
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

function ConfettiBurst({ isGallery }: { isGallery: boolean }) {
  const particles = useMemo(() => {
    const colors = isGallery
      ? ['#B8860B', '#D4A843', '#22c55e', '#f59e0b', '#e8b04b']
      : ['#3b82f6', '#22c55e', '#ec4899', '#f59e0b', '#8b5cf6']
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
