import type { WorldId } from './game-data'

type SoundName = 'coin' | 'powerUp' | 'oneUp' | 'pipe' | 'blockHit' | 'fanfare' | 'blip' | 'whoosh' | 'thud' | 'bonk' | 'chime' | 'select' | 'retry'

// Layout template types
type NavLayout = 'light-bar' | 'dark-hud'
type VictoryLayout = 'light-elegant' | 'dark-celebration'
type ProcessingStyle = 'smooth-bar' | 'segmented-blocks'
type TransitionStyle = 'none' | 'iris-wipe'
type ParticleStyle = 'confetti' | 'coins'

export interface SkinConfig {
  id: WorldId

  // Labels & Terminology
  skillLabel: string
  skillLabelPlural: string
  currencyLabel: string
  levelLabel: string
  briefingHeader: string | null
  intelLabel: string | null
  runButtonLabel: string
  runAgainLabel: string
  celebrationText: (levelNumber: number) => string
  victoryHeading: string
  skillUnlockLabel: string
  installLabel: string
  installedLabel: string
  badgeEarnedLabel: string
  lockedNodeText: (levelIndex: number) => string
  skillInventoryTitle: string
  noSkillsText: string
  statsSkillLabel: string
  statsDemoLabel: string
  statsCompleteSuffix: string
  chooseTargetLabel: string | null
  choosePromptLabel: string
  tryThisPrefix: string
  victorySkillsLabel: string
  victoryDemosLabel: string
  beforeReactionFallback: string
  beforeReactionLine2Fallback: string
  afterReactionFallback: string
  levelCompleteSubtext: string
  skillUnlockIcon: string

  // Visual Properties
  skinClass: string
  isDark: boolean
  borderRadius: string

  // Colors (used as CSS values in inline styles or class names)
  colors: {
    accent: string           // 'amber-700' or 'var(--mario-coin)'
    accentBg: string         // Tailwind bg class
    accentHover: string      // Tailwind hover class
    accentText: string       // Tailwind text class
    accentBorder: string     // Tailwind border class
    cardBg: string
    cardBorder: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    navBg: string
    navBorder: string
  }

  // Sound mapping
  sounds: {
    demoStart: SoundName | null
    skillUnlock: SoundName | null
    demoComplete: SoundName | null
    victory: SoundName | null
    transition: SoundName | null
    hover: SoundName | null
    selection: SoundName | null
    retry: SoundName | null
    badgeEarned: SoundName | null
    locked: SoundName | null
    levelComplete: SoundName | null
    resultGood: SoundName | null
    resultGreat: SoundName | null
    resultOk: SoundName | null
  }

  // Layout Template Selection
  navLayout: NavLayout
  victoryLayout: VictoryLayout
  processingStyle: ProcessingStyle
  transitionStyle: TransitionStyle
  celebrationParticles: ParticleStyle

  // Map component key
  mapId: string

  // Behavioral booleans
  showMissionBrief: boolean
  showBeforeReaction: boolean
  useTransitions: boolean
  showGlossaryTips: boolean
}

const gallerySkin: SkinConfig = {
  id: 'gallery',

  // Labels
  skillLabel: 'Skill',
  skillLabelPlural: 'Skills',
  currencyLabel: 'demos',
  levelLabel: 'Level',
  briefingHeader: null,
  intelLabel: null,
  runButtonLabel: 'Run AI',
  runAgainLabel: 'Run Again with Skill',
  celebrationText: (n) => `Level ${n} Complete!`,
  victoryHeading: 'JOURNEY COMPLETE',
  skillUnlockLabel: 'Skill Unlocked',
  installLabel: 'Install Skill',
  installedLabel: 'Installed!',
  badgeEarnedLabel: 'Achievement Unlocked',
  lockedNodeText: (levelIndex) => levelIndex === 1 ? 'Complete Level 1 to unlock' : 'Complete Level 2 to unlock',
  skillInventoryTitle: 'Installed Skills',
  noSkillsText: 'No skills installed yet.',
  statsSkillLabel: 'Skills installed',
  statsDemoLabel: 'Demos completed',
  statsCompleteSuffix: 'complete',
  chooseTargetLabel: null,  // uses demo.choices.label
  choosePromptLabel: 'Choose your prompt strategy',
  tryThisPrefix: 'Try it yourself in CoWork',
  victorySkillsLabel: 'Skills Unlocked',
  victoryDemosLabel: 'Demos Completed',
  beforeReactionFallback: 'AI produced a result.',
  beforeReactionLine2Fallback: 'But is this actually impressive?',
  afterReactionFallback: "Now THAT'S what AI can do with the right skills.",
  levelCompleteSubtext: 'All demos finished. Well done.',
  skillUnlockIcon: '\u{1F3A8}',

  // Visual
  skinClass: 'skin-gallery',
  isDark: false,
  borderRadius: '2px',

  // Colors
  colors: {
    accent: 'amber-700',
    accentBg: 'bg-amber-600',
    accentHover: 'hover:bg-amber-500',
    accentText: 'text-amber-700',
    accentBorder: 'border-amber-200/60',
    cardBg: 'bg-white/80',
    cardBorder: 'border-amber-200/60',
    textPrimary: 'text-[var(--color-ink)]',
    textSecondary: 'text-[var(--color-muted)]',
    textMuted: 'text-[var(--color-faint)]',
    navBg: 'bg-white/90',
    navBorder: 'border-[var(--color-border)]',
  },

  // Sounds (gallery has no sounds)
  sounds: {
    demoStart: null,
    skillUnlock: null,
    demoComplete: null,
    victory: null,
    transition: null,
    hover: null,
    selection: null,
    retry: null,
    badgeEarned: null,
    locked: null,
    levelComplete: null,
    resultGood: null,
    resultGreat: null,
    resultOk: null,
  },

  // Layout
  navLayout: 'light-bar',
  victoryLayout: 'light-elegant',
  processingStyle: 'smooth-bar',
  transitionStyle: 'none',
  celebrationParticles: 'confetti',

  // Map
  mapId: 'gallery',

  // Booleans
  showMissionBrief: false,
  showBeforeReaction: false,
  useTransitions: false,
  showGlossaryTips: false,
}

const arcadeSkin: SkinConfig = {
  id: 'arcade',

  // Labels
  skillLabel: 'Power-Up',
  skillLabelPlural: 'Power-Ups',
  currencyLabel: 'stages',
  levelLabel: 'World',
  briefingHeader: '// MISSION BRIEFING //',
  intelLabel: '// INTEL //',
  runButtonLabel: 'HIT THE BLOCK',
  runAgainLabel: 'Run Again with Power-Up',
  celebrationText: (n) => `WORLD ${n} CLEAR!`,
  victoryHeading: 'GAME CLEAR!',
  skillUnlockLabel: 'POWER-UP UNLOCKED',
  installLabel: 'GRAB POWER-UP',
  installedLabel: 'POWER-UP!',
  badgeEarnedLabel: 'POWER-UP!',
  lockedNodeText: (levelIndex) => levelIndex === 1 ? 'Complete Level 1 to unlock' : 'Complete Level 2 to unlock',
  skillInventoryTitle: 'Power-Ups',
  noSkillsText: 'No power-ups yet.',
  statsSkillLabel: 'Power-ups',
  statsDemoLabel: 'Stages cleared',
  statsCompleteSuffix: 'clear',
  chooseTargetLabel: '// CHOOSE YOUR TARGET //',
  choosePromptLabel: '// CHOOSE YOUR PROMPT STRATEGY //',
  tryThisPrefix: 'BONUS AREA: Try it yourself in CoWork',
  victorySkillsLabel: 'Power-Ups',
  victoryDemosLabel: 'Stages Cleared',
  beforeReactionFallback: 'Not bad...',
  beforeReactionLine2Fallback: 'But not exactly super. Needs a power-up.',
  afterReactionFallback: "NOW we're talking!",
  levelCompleteSubtext: "All stages cleared. Let's-a go!",
  skillUnlockIcon: '\u{1F344}',

  // Visual
  skinClass: 'skin-arcade',
  isDark: true,
  borderRadius: '2px',

  // Colors
  colors: {
    accent: 'var(--mario-coin)',
    accentBg: 'bg-[var(--mario-block)]',
    accentHover: 'hover:bg-[#C07800]',
    accentText: 'text-[var(--mario-coin)]',
    accentBorder: 'border-[var(--mario-block)]',
    cardBg: 'bg-transparent',
    cardBorder: 'border-[var(--mario-block)]',
    textPrimary: 'text-white',
    textSecondary: 'text-white/60',
    textMuted: 'text-white/40',
    navBg: 'bg-[#1a1a2e]',
    navBorder: 'border-[#333]',
  },

  // Sounds
  sounds: {
    demoStart: 'blockHit',
    skillUnlock: 'powerUp',
    demoComplete: 'coin',
    victory: 'fanfare',
    transition: 'pipe',
    hover: null,
    selection: 'coin',
    retry: 'pipe',
    badgeEarned: 'oneUp',
    locked: null,
    levelComplete: 'oneUp',
    resultGood: 'coin',
    resultGreat: 'fanfare',
    resultOk: 'pipe',
  },

  // Layout
  navLayout: 'dark-hud',
  victoryLayout: 'dark-celebration',
  processingStyle: 'segmented-blocks',
  transitionStyle: 'iris-wipe',
  celebrationParticles: 'coins',

  // Map
  mapId: 'mario',

  // Booleans
  showMissionBrief: true,
  showBeforeReaction: true,
  useTransitions: true,
  showGlossaryTips: true,
}

const skins: Record<WorldId, SkinConfig> = {
  gallery: gallerySkin,
  arcade: arcadeSkin,
}

export function getSkin(world: WorldId): SkinConfig {
  return skins[world]
}
