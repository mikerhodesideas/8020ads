import type { WorldId, DemoType } from './game-data'

type SoundName =
  // Mario / Arcade
  | 'coin' | 'powerUp' | 'oneUp' | 'pipe' | 'blockHit' | 'fanfare' | 'blip' | 'whoosh' | 'thud' | 'bonk' | 'chime' | 'select' | 'retry'
  // Red Alert
  | 'ra-radar-ping' | 'ra-tech-researched' | 'ra-deploy' | 'ra-mission-accomplished' | 'ra-campaign-complete' | 'ra-alert-klaxon' | 'ra-command-blip' | 'ra-unit-ready' | 'ra-mission-failed' | 'ra-credits-collect'
  // Clair Obscur
  | 'co-technique-learn' | 'co-expedition-log' | 'co-execute' | 'co-chapter-clear' | 'co-expedition-complete' | 'co-page-chime' | 'co-hover-note' | 'co-select-confirm' | 'co-missed-beat' | 'co-lumina-collect'
  // Tetris
  | 'tetris-piece-drop' | 'tetris-piece-rotate' | 'tetris-line-clear' | 'tetris-tetris-clear' | 'tetris-level-up' | 'tetris-high-score' | 'tetris-soft-drop' | 'tetris-hold-piece' | 'tetris-lock-delay' | 'tetris-points-collect'
  // Zelda
  | 'zelda-item-get' | 'zelda-chest-open' | 'zelda-secret-discovered' | 'zelda-quest-accepted' | 'zelda-sword-slash' | 'zelda-dungeon-clear' | 'zelda-heart-collect' | 'zelda-fairy-chime' | 'zelda-rupee-collect' | 'zelda-door-locked'
  // Elder Scrolls
  | 'es-quest-accept' | 'es-skill-unlock' | 'es-level-complete' | 'es-node-select' | 'es-victory' | 'es-ui-click'

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

  // Victory image path (per-world)
  victoryImage: string

  // Demo type icons (maps demo type to image path; only worlds with actual icon images)
  demoIcons?: Partial<Record<DemoType, string>>

  // Level preview images (maps level number to image path; only worlds with actual images)
  levelImages?: Partial<Record<1 | 2 | 3, string>>

  // Background effect
  backgroundEffect: 'pixel-stars' | 'radar-grid' | 'grid-lines' | 'nebula' | null

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
  tryThisPrefix: 'Try it yourself in Cowork',
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

  // Victory image
  victoryImage: '/images/victory/gallery-victory.png',

  // Demo type icons
  demoIcons: {
    website: '/images/icons/gallery-icon-website.png',
    email: '/images/icons/gallery-icon-email.png',
    data: '/images/icons/gallery-icon-data.png',
    search: '/images/icons/gallery-icon-search.png',
  },

  // Level preview images
  levelImages: {
    1: '/images/levels/gallery-level-1.png',
    2: '/images/levels/gallery-level-2.png',
    3: '/images/levels/gallery-level-3.png',
  },

  // Background
  backgroundEffect: null,

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
  tryThisPrefix: 'BONUS AREA: Try it yourself in Cowork',
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

  // Victory image
  victoryImage: '/images/victory/arcade-victory.png',

  // Demo type icons
  demoIcons: {
    website: '/images/icons/arcade-icon-website.png',
    email: '/images/icons/arcade-icon-email.png',
    data: '/images/icons/arcade-icon-data.png',
    search: '/images/icons/arcade-icon-search.png',
  },

  // Level preview images
  levelImages: {
    1: '/images/levels/arcade-level-1.png',
    2: '/images/levels/arcade-level-2.png',
    3: '/images/levels/arcade-level-3.png',
  },

  // Background
  backgroundEffect: 'pixel-stars',

  // Booleans
  showMissionBrief: true,
  showBeforeReaction: true,
  useTransitions: true,
  showGlossaryTips: true,
}

const redAlertSkin: SkinConfig = {
  id: 'red-alert',

  // Labels
  skillLabel: 'Technology',
  skillLabelPlural: 'Technologies',
  currencyLabel: 'credits',
  levelLabel: 'Sector',
  briefingHeader: '// MISSION BRIEFING //',
  intelLabel: '// INTEL //',
  runButtonLabel: 'DEPLOY',
  runAgainLabel: 'Re-Deploy with Technology',
  celebrationText: (n) => `SECTOR ${n} CLEAR`,
  victoryHeading: 'CAMPAIGN COMPLETE',
  skillUnlockLabel: 'TECHNOLOGY RESEARCHED',
  installLabel: 'RESEARCH COMPLETE',
  installedLabel: 'RESEARCHED',
  badgeEarnedLabel: 'COMMENDATION',
  lockedNodeText: (levelIndex) => levelIndex === 1 ? 'CLASSIFIED - Complete Sector 1' : 'CLASSIFIED - Complete Sector 2',
  skillInventoryTitle: 'Technologies',
  noSkillsText: 'No technologies researched.',
  statsSkillLabel: 'Technologies',
  statsDemoLabel: 'Missions complete',
  statsCompleteSuffix: 'clear',
  chooseTargetLabel: '// SELECT TARGET //',
  choosePromptLabel: '// SELECT STRATEGY //',
  tryThisPrefix: 'FIELD OPS: Deploy in Cowork',
  victorySkillsLabel: 'Technologies',
  victoryDemosLabel: 'Missions Cleared',
  beforeReactionFallback: 'Target acquired.',
  beforeReactionLine2Fallback: 'Awaiting technology deployment.',
  afterReactionFallback: 'Mission accomplished.',
  levelCompleteSubtext: 'All missions cleared. Sector secure.',
  skillUnlockIcon: '\u{1F6E1}\u{FE0F}',

  // Visual
  skinClass: 'skin-red-alert',
  isDark: true,
  borderRadius: '0px',

  // Colors
  colors: {
    accent: 'var(--ra-green)',
    accentBg: 'bg-[var(--ra-panel)]',
    accentHover: 'hover:bg-[var(--ra-grid)]',
    accentText: 'text-[var(--ra-green)]',
    accentBorder: 'border-[var(--ra-green)]',
    cardBg: 'bg-[var(--ra-panel)]',
    cardBorder: 'border-[var(--ra-green)]',
    textPrimary: 'text-[var(--ra-text)]',
    textSecondary: 'text-[var(--ra-text)]/60',
    textMuted: 'text-[var(--ra-text)]/40',
    navBg: 'bg-[var(--ra-dark)]',
    navBorder: 'border-[var(--ra-green)]',
  },

  // Sounds
  sounds: {
    demoStart: 'ra-radar-ping',
    skillUnlock: 'ra-tech-researched',
    demoComplete: 'ra-mission-accomplished',
    victory: 'ra-campaign-complete',
    transition: 'ra-deploy',
    hover: null,
    selection: 'ra-unit-ready',
    retry: 'ra-mission-failed',
    badgeEarned: 'ra-mission-accomplished',
    locked: 'ra-alert-klaxon',
    levelComplete: 'ra-mission-accomplished',
    resultGood: 'ra-credits-collect',
    resultGreat: 'ra-mission-accomplished',
    resultOk: 'ra-command-blip',
  },

  // Layout
  navLayout: 'dark-hud',
  victoryLayout: 'dark-celebration',
  processingStyle: 'smooth-bar',
  transitionStyle: 'none',
  celebrationParticles: 'confetti',

  // Map
  mapId: 'red-alert',

  // Victory image
  victoryImage: '/images/victory/red-alert-victory.png',

  // Background
  backgroundEffect: 'radar-grid',

  // Booleans
  showMissionBrief: true,
  showBeforeReaction: true,
  useTransitions: false,
  showGlossaryTips: true,
}

const clairObscurSkin: SkinConfig = {
  id: 'clair-obscur',

  // Labels
  skillLabel: 'Technique',
  skillLabelPlural: 'Techniques',
  currencyLabel: 'lumina',
  levelLabel: 'Chapter',
  briefingHeader: null,
  intelLabel: null,
  runButtonLabel: 'Execute',
  runAgainLabel: 'Execute with Technique',
  celebrationText: (n) => `Chapter ${n} Clear`,
  victoryHeading: 'EXPEDITION COMPLETE',
  skillUnlockLabel: 'New Technique',
  installLabel: 'Learn Technique',
  installedLabel: 'Learned!',
  badgeEarnedLabel: 'Technique Mastered',
  lockedNodeText: (levelIndex) => levelIndex === 1 ? 'Complete Chapter 1 to continue' : 'Complete Chapter 2 to continue',
  skillInventoryTitle: 'Mastered Techniques',
  noSkillsText: 'No techniques mastered yet.',
  statsSkillLabel: 'Techniques mastered',
  statsDemoLabel: 'Stages completed',
  statsCompleteSuffix: 'complete',
  chooseTargetLabel: null,
  choosePromptLabel: 'Choose your approach',
  tryThisPrefix: 'Try it yourself in Cowork',
  victorySkillsLabel: 'Techniques',
  victoryDemosLabel: 'Stages Completed',
  beforeReactionFallback: 'A result, though unremarkable.',
  beforeReactionLine2Fallback: 'This calls for a more refined technique.',
  afterReactionFallback: 'Elegant. Precisely what was needed.',
  levelCompleteSubtext: 'Chapter complete. The expedition continues.',
  skillUnlockIcon: '\u{2728}',

  // Visual
  skinClass: 'skin-clair-obscur',
  isDark: false,
  borderRadius: '1px',

  // Colors
  colors: {
    accent: 'var(--co-gold)',
    accentBg: 'bg-[var(--co-gold)]',
    accentHover: 'hover:bg-[var(--co-glow)]',
    accentText: 'text-[var(--co-gold)]',
    accentBorder: 'border-[var(--co-border)]',
    cardBg: 'bg-[var(--co-card)]',
    cardBorder: 'border-[var(--co-gold)]',
    textPrimary: 'text-[var(--co-black)]',
    textSecondary: 'text-[var(--co-slate)]',
    textMuted: 'text-[var(--co-slate)]/60',
    navBg: 'bg-[var(--co-cream)]',
    navBorder: 'border-[var(--co-border)]',
  },

  // Sounds
  sounds: {
    demoStart: 'co-execute',
    skillUnlock: 'co-technique-learn',
    demoComplete: 'co-lumina-collect',
    victory: 'co-expedition-complete',
    transition: 'co-page-chime',
    hover: 'co-hover-note',
    selection: 'co-select-confirm',
    retry: 'co-missed-beat',
    badgeEarned: 'co-technique-learn',
    locked: null,
    levelComplete: 'co-chapter-clear',
    resultGood: 'co-lumina-collect',
    resultGreat: 'co-technique-learn',
    resultOk: 'co-expedition-log',
  },

  // Layout
  navLayout: 'light-bar',
  victoryLayout: 'light-elegant',
  processingStyle: 'smooth-bar',
  transitionStyle: 'none',
  celebrationParticles: 'confetti',

  // Map
  mapId: 'clair-obscur',

  // Victory image
  victoryImage: '/images/victory/clair-obscur-victory.png',

  // Background
  backgroundEffect: null,

  // Booleans
  showMissionBrief: false,
  showBeforeReaction: false,
  useTransitions: false,
  showGlossaryTips: false,
}

const tetrisSkin: SkinConfig = {
  id: 'tetris',

  // Labels
  skillLabel: 'Line Clear',
  skillLabelPlural: 'Line Clears',
  currencyLabel: 'points',
  levelLabel: 'Level',
  briefingHeader: 'NEXT PIECE',
  intelLabel: null,
  runButtonLabel: 'DROP',
  runAgainLabel: 'Drop Again with Line Clear',
  celebrationText: (n) => `LEVEL ${n} CLEAR!`,
  victoryHeading: 'HIGH SCORE!',
  skillUnlockLabel: 'LINE CLEAR!',
  installLabel: 'LOCK IN',
  installedLabel: 'LOCKED IN',
  badgeEarnedLabel: 'COMBO!',
  lockedNodeText: (levelIndex) => levelIndex === 1 ? 'Clear Level 1 to unlock' : 'Clear Level 2 to unlock',
  skillInventoryTitle: 'Line Clears',
  noSkillsText: 'No line clears yet.',
  statsSkillLabel: 'Line clears',
  statsDemoLabel: 'Pieces dropped',
  statsCompleteSuffix: 'clear',
  chooseTargetLabel: 'SELECT PIECE',
  choosePromptLabel: 'SELECT STRATEGY',
  tryThisPrefix: 'BONUS ROUND: Try in Cowork',
  victorySkillsLabel: 'Line Clears',
  victoryDemosLabel: 'Pieces Dropped',
  beforeReactionFallback: 'Piece placed.',
  beforeReactionLine2Fallback: 'Not a perfect fit. Needs a line clear.',
  afterReactionFallback: 'TETRIS! Perfect placement.',
  levelCompleteSubtext: 'All lines cleared. Level up!',
  skillUnlockIcon: '\u{1F7E6}',

  // Visual
  skinClass: 'skin-tetris',
  isDark: true,
  borderRadius: '0px',

  // Colors
  colors: {
    accent: 'var(--tetris-i)',
    accentBg: 'bg-[var(--tetris-i)]',
    accentHover: 'hover:bg-[var(--tetris-o)]',
    accentText: 'text-[var(--tetris-i)]',
    accentBorder: 'border-[var(--tetris-i)]',
    cardBg: 'bg-[#0E0E1A]',
    cardBorder: 'border-[var(--tetris-i)]',
    textPrimary: 'text-white',
    textSecondary: 'text-white/60',
    textMuted: 'text-white/40',
    navBg: 'bg-[#060610]',
    navBorder: 'border-[var(--tetris-grid)]',
  },

  // Sounds
  sounds: {
    demoStart: 'tetris-piece-drop',
    skillUnlock: 'tetris-line-clear',
    demoComplete: 'tetris-line-clear',
    victory: 'tetris-high-score',
    transition: 'tetris-soft-drop',
    hover: null,
    selection: 'tetris-hold-piece',
    retry: 'tetris-lock-delay',
    badgeEarned: 'tetris-tetris-clear',
    locked: 'tetris-lock-delay',
    levelComplete: 'tetris-level-up',
    resultGood: 'tetris-points-collect',
    resultGreat: 'tetris-tetris-clear',
    resultOk: 'tetris-piece-rotate',
  },

  // Layout
  navLayout: 'dark-hud',
  victoryLayout: 'dark-celebration',
  processingStyle: 'segmented-blocks',
  transitionStyle: 'none',
  celebrationParticles: 'confetti',

  // Map
  mapId: 'tetris',

  // Victory image
  victoryImage: '/images/victory/tetris-victory.png',

  // Background
  backgroundEffect: 'grid-lines',

  // Booleans
  showMissionBrief: true,
  showBeforeReaction: true,
  useTransitions: false,
  showGlossaryTips: false,
}

const zeldaSkin: SkinConfig = {
  id: 'zelda',

  // Labels
  skillLabel: 'Treasure',
  skillLabelPlural: 'Treasures',
  currencyLabel: 'rupees',
  levelLabel: 'Dungeon',
  briefingHeader: 'DUNGEON MAP',
  intelLabel: 'DUNGEON INTEL',
  runButtonLabel: 'Enter Dungeon',
  runAgainLabel: 'Re-enter with Treasure',
  celebrationText: (n) => `Dungeon ${n} Clear!`,
  victoryHeading: 'TRIFORCE COMPLETE',
  skillUnlockLabel: 'Treasure Found!',
  installLabel: 'Take Item',
  installedLabel: 'Obtained!',
  badgeEarnedLabel: 'Heart Container!',
  lockedNodeText: (levelIndex) => levelIndex === 1 ? 'Sealed. Clear Dungeon 1 first.' : 'Sealed. Clear Dungeon 2 first.',
  skillInventoryTitle: 'Treasures',
  noSkillsText: 'No treasures found yet.',
  statsSkillLabel: 'Treasures found',
  statsDemoLabel: 'Rooms cleared',
  statsCompleteSuffix: 'clear',
  chooseTargetLabel: null,
  choosePromptLabel: 'Choose your path',
  tryThisPrefix: 'Adventure Mode: Try in Cowork',
  victorySkillsLabel: 'Treasures',
  victoryDemosLabel: 'Dungeons Cleared',
  beforeReactionFallback: 'The room has been cleared.',
  beforeReactionLine2Fallback: 'But something more powerful awaits.',
  afterReactionFallback: 'You obtained a powerful treasure!',
  levelCompleteSubtext: 'Dungeon cleared. The quest continues.',
  skillUnlockIcon: '\u{1F3C6}',

  // Visual
  skinClass: 'skin-zelda',
  isDark: true,
  borderRadius: '2px',

  // Colors
  colors: {
    accent: 'var(--zelda-gold)',
    accentBg: 'bg-[var(--zelda-dark)]',
    accentHover: 'hover:bg-[var(--zelda-gold)]',
    accentText: 'text-[var(--zelda-gold)]',
    accentBorder: 'border-[var(--zelda-gold)]',
    cardBg: 'bg-[var(--zelda-parchment)]',
    cardBorder: 'border-[var(--zelda-dark)]',
    textPrimary: 'text-white',
    textSecondary: 'text-[var(--zelda-stone)]',
    textMuted: 'text-white/40',
    navBg: 'bg-[var(--zelda-dark)]',
    navBorder: 'border-[var(--zelda-grass)]',
  },

  // Sounds
  sounds: {
    demoStart: 'zelda-sword-slash',
    skillUnlock: 'zelda-item-get',
    demoComplete: 'zelda-rupee-collect',
    victory: 'zelda-dungeon-clear',
    transition: 'zelda-quest-accepted',
    hover: 'zelda-fairy-chime',
    selection: 'zelda-heart-collect',
    retry: 'zelda-door-locked',
    badgeEarned: 'zelda-secret-discovered',
    locked: 'zelda-door-locked',
    levelComplete: 'zelda-dungeon-clear',
    resultGood: 'zelda-rupee-collect',
    resultGreat: 'zelda-item-get',
    resultOk: 'zelda-chest-open',
  },

  // Layout
  navLayout: 'dark-hud',
  victoryLayout: 'dark-celebration',
  processingStyle: 'segmented-blocks',
  transitionStyle: 'none',
  celebrationParticles: 'confetti',

  // Map
  mapId: 'zelda',

  // Victory image
  victoryImage: '/images/victory/zelda-victory.png',

  // Background
  backgroundEffect: null,

  // Booleans
  showMissionBrief: true,
  showBeforeReaction: true,
  useTransitions: false,
  showGlossaryTips: true,
}

const elderScrollsSkin: SkinConfig = {
  id: 'elder-scrolls',

  // Labels
  skillLabel: 'Perk',
  skillLabelPlural: 'Perks',
  currencyLabel: 'septims',
  levelLabel: 'Quest Line',
  briefingHeader: 'QUEST JOURNAL',
  intelLabel: 'LORE',
  runButtonLabel: 'Cast Spell',
  runAgainLabel: 'Invoke with Perk',
  celebrationText: (n) => `Quest Line ${n} Complete`,
  victoryHeading: 'DRAGONBORN',
  skillUnlockLabel: 'Perk Activated',
  installLabel: 'Activate Perk',
  installedLabel: 'Activated',
  badgeEarnedLabel: 'Dragon Soul Absorbed',
  lockedNodeText: (levelIndex) => levelIndex === 1 ? 'Undiscovered. Complete Quest Line 1.' : 'Undiscovered. Complete Quest Line 2.',
  skillInventoryTitle: 'Constellation Perks',
  noSkillsText: 'No perks activated yet.',
  statsSkillLabel: 'Perks activated',
  statsDemoLabel: 'Quests completed',
  statsCompleteSuffix: 'complete',
  chooseTargetLabel: null,
  choosePromptLabel: 'Choose your approach',
  tryThisPrefix: 'Free Roam: Try in Cowork',
  victorySkillsLabel: 'Perks',
  victoryDemosLabel: 'Quests Completed',
  beforeReactionFallback: 'A result, but unremarkable.',
  beforeReactionLine2Fallback: 'Your constellation has more to offer.',
  afterReactionFallback: 'Your skill increases. The stars align.',
  levelCompleteSubtext: 'Quest line complete. The path reveals itself.',
  skillUnlockIcon: '\u{2B50}',

  // Visual
  skinClass: 'skin-elder-scrolls',
  isDark: true,
  borderRadius: '2px',

  // Colors
  colors: {
    accent: 'var(--es-gold)',
    accentBg: 'bg-[var(--es-dark-leather)]',
    accentHover: 'hover:bg-[rgba(201,168,76,0.15)]',
    accentText: 'text-[var(--es-gold)]',
    accentBorder: 'border-[var(--es-gold)]',
    cardBg: 'bg-[var(--es-dark-leather)]',
    cardBorder: 'border-[rgba(201,168,76,0.3)]',
    textPrimary: 'text-[var(--es-star-white)]',
    textSecondary: 'text-[var(--es-steel)]',
    textMuted: 'text-[var(--es-steel)]/60',
    navBg: 'bg-[#0A0A14]',
    navBorder: 'border-[rgba(201,168,76,0.2)]',
  },

  // Sounds
  sounds: {
    demoStart: 'es-node-select',
    skillUnlock: 'es-skill-unlock',
    demoComplete: 'es-node-select',
    victory: 'es-victory',
    transition: 'es-ui-click',
    hover: null,
    selection: 'es-ui-click',
    retry: 'es-ui-click',
    badgeEarned: 'es-skill-unlock',
    locked: null,
    levelComplete: 'es-level-complete',
    resultGood: 'es-node-select',
    resultGreat: 'es-skill-unlock',
    resultOk: 'es-ui-click',
  },

  // Layout
  navLayout: 'dark-hud',
  victoryLayout: 'dark-celebration',
  processingStyle: 'segmented-blocks',
  transitionStyle: 'none',
  celebrationParticles: 'confetti',

  // Map
  mapId: 'elder-scrolls',

  // Victory image
  victoryImage: '/images/victory/elder-scrolls-victory.png',

  // Background
  backgroundEffect: 'nebula',

  // Booleans
  showMissionBrief: true,
  showBeforeReaction: true,
  useTransitions: false,
  showGlossaryTips: false,
}

const skins: Record<WorldId, SkinConfig> = {
  gallery: gallerySkin,
  arcade: arcadeSkin,
  'red-alert': redAlertSkin,
  'clair-obscur': clairObscurSkin,
  tetris: tetrisSkin,
  zelda: zeldaSkin,
  'elder-scrolls': elderScrollsSkin,
}

export function getSkin(world: WorldId): SkinConfig {
  return skins[world]
}
