// ============================================================
// 8020skill Sound Engine - Complete Procedural Audio
// ============================================================

export type SoundName =
  // Mario / Arcade
  | 'coin' | 'powerUp' | 'oneUp' | 'pipe' | 'blockHit' | 'fanfare' | 'blip' | 'whoosh' | 'thud' | 'bonk' | 'chime' | 'select' | 'retry'
  | 'arcade-level-clear' | 'arcade-star' | 'arcade-tick' | 'arcade-glossary' | 'arcade-prompt' | 'arcade-preview' | 'arcade-download' | 'arcade-speed'
  // Red Alert
  | 'ra-radar-ping' | 'ra-tech-researched' | 'ra-deploy' | 'ra-mission-accomplished' | 'ra-campaign-complete' | 'ra-alert-klaxon' | 'ra-command-blip' | 'ra-unit-ready' | 'ra-mission-failed' | 'ra-credits-collect'
  | 'ra-hover' | 'ra-level-clear' | 'ra-badge' | 'ra-result-great' | 'ra-star' | 'ra-tick' | 'ra-glossary' | 'ra-prompt' | 'ra-preview' | 'ra-download' | 'ra-speed'
  // Clair Obscur
  | 'co-technique-learn' | 'co-expedition-log' | 'co-execute' | 'co-chapter-clear' | 'co-expedition-complete' | 'co-page-chime' | 'co-hover-note' | 'co-select-confirm' | 'co-missed-beat' | 'co-lumina-collect'
  | 'co-locked' | 'co-badge' | 'co-result-great' | 'co-star' | 'co-tick' | 'co-glossary' | 'co-prompt' | 'co-preview' | 'co-download' | 'co-speed'
  // Tetris
  | 'tetris-piece-drop' | 'tetris-piece-rotate' | 'tetris-line-clear' | 'tetris-tetris-clear' | 'tetris-level-up' | 'tetris-high-score' | 'tetris-soft-drop' | 'tetris-hold-piece' | 'tetris-lock-delay' | 'tetris-points-collect'
  | 'tetris-hover' | 'tetris-demo-complete' | 'tetris-badge-combo' | 'tetris-locked' | 'tetris-star' | 'tetris-tick' | 'tetris-glossary' | 'tetris-prompt' | 'tetris-preview' | 'tetris-download' | 'tetris-speed'
  // Zelda
  | 'zelda-item-get' | 'zelda-chest-open' | 'zelda-secret-discovered' | 'zelda-quest-accepted' | 'zelda-sword-slash' | 'zelda-dungeon-clear' | 'zelda-heart-collect' | 'zelda-fairy-chime' | 'zelda-rupee-collect' | 'zelda-door-locked'
  | 'zelda-level-clear' | 'zelda-lock-rattle' | 'zelda-gem-collect' | 'zelda-treasure-reveal' | 'zelda-star' | 'zelda-tick' | 'zelda-glossary' | 'zelda-prompt' | 'zelda-preview' | 'zelda-download' | 'zelda-speed'
  // Elder Scrolls
  | 'es-quest-accept' | 'es-skill-unlock' | 'es-level-complete' | 'es-node-select' | 'es-victory' | 'es-ui-click'
  | 'es-whisper' | 'es-spell-fizzle' | 'es-ward' | 'es-septim' | 'es-quest-stage' | 'es-skill-increase' | 'es-minor-discovery' | 'es-dragon-soul' | 'es-star' | 'es-tick' | 'es-glossary' | 'es-prompt' | 'es-preview' | 'es-download' | 'es-speed'
  // Gallery
  | 'gallery-click' | 'gallery-hover'

// ---- Audio Engine ----

let audioCtx: AudioContext | null = null
let masterGainNode: GainNode | null = null
let masterVolume = 0.7
let muted = true

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function getMaster(): GainNode {
  const ctx = getCtx()
  if (!masterGainNode) {
    masterGainNode = ctx.createGain()
    masterGainNode.gain.value = masterVolume
    masterGainNode.connect(ctx.destination)
  }
  return masterGainNode
}

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('arcade-sound-muted')
  muted = stored === null ? true : stored === 'true'
  const vol = localStorage.getItem('arcade-sound-volume')
  if (vol !== null) masterVolume = parseFloat(vol)
}

export function isMuted(): boolean { return muted }

export function toggleMute(): void {
  muted = !muted
  if (typeof window !== 'undefined') localStorage.setItem('arcade-sound-muted', String(muted))
  if (muted) stopAmbient()
}

export function getVolume(): number { return masterVolume }

export function setVolume(v: number): void {
  masterVolume = Math.max(0, Math.min(1, v))
  if (masterGainNode) masterGainNode.gain.value = masterVolume
  if (typeof window !== 'undefined') localStorage.setItem('arcade-sound-volume', String(masterVolume))
}

// ---- Synthesis Helpers ----

// pt: Play tone with gain envelope, routed through master
function pt(freq: number, dur: number, type: OscillatorType = 'square', gain = 0.15, start = 0) {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(gain, ctx.currentTime + start)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
  osc.connect(g)
  g.connect(getMaster())
  osc.start(ctx.currentTime + start)
  osc.stop(ctx.currentTime + start + dur + 0.01)
}

// pf: Play filtered tone (lowpass)
function pf(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.1, start = 0, fc = 2000, q = 1) {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  osc.type = type
  osc.frequency.value = freq
  filter.type = 'lowpass'
  filter.frequency.value = fc
  filter.Q.value = q
  g.gain.setValueAtTime(gain, ctx.currentTime + start)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
  osc.connect(filter)
  filter.connect(g)
  g.connect(getMaster())
  osc.start(ctx.currentTime + start)
  osc.stop(ctx.currentTime + start + dur + 0.01)
}

// sw: Frequency sweep
function sw(f1: number, f2: number, dur: number, type: OscillatorType = 'square', gain = 0.15, start = 0) {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(f1, ctx.currentTime + start)
  osc.frequency.exponentialRampToValueAtTime(f2, ctx.currentTime + start + dur)
  g.gain.setValueAtTime(gain, ctx.currentTime + start)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
  osc.connect(g)
  g.connect(getMaster())
  osc.start(ctx.currentTime + start)
  osc.stop(ctx.currentTime + start + dur + 0.01)
}

// dc: Detuned chord (multiple slightly detuned oscillators)
function dc(freqs: number[], dur: number, type: OscillatorType = 'sine', gain = 0.04, start = 0, attack = 0) {
  const ctx = getCtx()
  const t = ctx.currentTime
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq * (1 + (i * 0.003 - freqs.length * 0.0015))
    if (attack > 0) {
      g.gain.setValueAtTime(0, t + start)
      g.gain.linearRampToValueAtTime(gain, t + start + attack)
      g.gain.setValueAtTime(gain, t + start + dur * 0.7)
    } else {
      g.gain.setValueAtTime(gain, t + start)
    }
    g.gain.exponentialRampToValueAtTime(0.001, t + start + dur)
    osc.connect(g)
    g.connect(getMaster())
    osc.start(t + start)
    osc.stop(t + start + dur + 0.01)
  })
}

// ---- Sound Definitions ----

const sounds: Record<SoundName, () => void> = {

  // =============== ARCADE / MARIO ===============

  coin: () => {
    pt(659.25, 0.08, 'square', 0.1)
    pt(987.77, 0.15, 'square', 0.1, 0.08)
    pt(1318.5, 0.1, 'sine', 0.03, 0.08) // shimmer overtone
    pt(329.63, 0.04, 'square', 0.04)     // sub punch
  },

  powerUp: () => {
    const notes = [261.63, 329.63, 392.0, 523.25]
    notes.forEach((f, i) => {
      pt(f, 0.12, 'square', 0.09, i * 0.1)
      pt(f * 2, 0.08, 'sine', 0.02, i * 0.1)
    })
    pt(130.81, 0.3, 'square', 0.03)
  },

  oneUp: () => {
    const notes: [number, number][] = [[330, 0.08], [392, 0.08], [659, 0.08], [523, 0.08], [587, 0.08], [784, 0.15]]
    let t = 0
    for (const [f, d] of notes) {
      pt(f, d, 'square', 0.09, t)
      pt(f * 2, d * 0.6, 'sine', 0.02, t)
      t += d
    }
  },

  pipe: () => {
    sw(200, 80, 0.2, 'square', 0.1)
    sw(400, 120, 0.15, 'square', 0.03)     // harmonic layer
    pt(60, 0.12, 'sine', 0.05)              // sub rumble
  },

  blockHit: () => {
    sw(400, 200, 0.06, 'square', 0.13)
    pt(800, 0.03, 'square', 0.06)           // crack overtone
    pt(100, 0.04, 'sine', 0.05)             // thump
  },

  fanfare: () => {
    const melody: [number, number][] = [
      [523, 0.12], [523, 0.12], [523, 0.12], [523, 0.2],
      [415, 0.15], [466, 0.15], [523, 0.12], [466, 0.08], [523, 0.3],
    ]
    let t = 0
    for (const [f, d] of melody) {
      pt(f, d, 'square', 0.09, t)
      pt(f * 0.5, d, 'square', 0.03, t)   // bass harmony
      t += d
    }
  },

  blip: () => {
    pt(1200, 0.03, 'square', 0.05)
    pt(2400, 0.02, 'sine', 0.015)
  },

  whoosh: () => {
    sw(1200, 200, 0.15, 'sawtooth', 0.06)
    sw(600, 100, 0.12, 'square', 0.02)
  },

  thud: () => {
    sw(80, 40, 0.08, 'sine', 0.12)
    pt(160, 0.04, 'square', 0.04)
  },

  bonk: () => {
    pt(100, 0.1, 'square', 0.08)
    sw(200, 80, 0.06, 'square', 0.04)
  },

  chime: () => {
    pt(523.25, 0.12, 'sine', 0.07)
    pt(659.25, 0.18, 'sine', 0.07, 0.1)
    pt(1046.5, 0.1, 'sine', 0.02, 0.1)   // octave sparkle
  },

  select: () => {
    sw(800, 1400, 0.06, 'square', 0.07)
    pt(1400, 0.04, 'sine', 0.03, 0.03)
  },

  retry: () => {
    pt(523.25, 0.08, 'square', 0.07)
    pt(440, 0.08, 'square', 0.07, 0.1)
    pt(349.23, 0.12, 'square', 0.07, 0.2)
    pt(174.61, 0.08, 'sine', 0.03, 0.2) // sad sub
  },

  'arcade-level-clear': () => {
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((f, i) => {
      pt(f, 0.1, 'square', 0.08, i * 0.08)
      pt(f * 0.5, 0.08, 'square', 0.03, i * 0.08)
    })
    pt(1046.5, 0.3, 'square', 0.06, 0.35)
    pt(523.25, 0.25, 'square', 0.03, 0.35)
  },

  'arcade-star': () => {
    pt(880, 0.12, 'square', 0.07)
    pt(1760, 0.08, 'sine', 0.02)
  },

  'arcade-tick': () => {
    pt(800, 0.015, 'square', 0.05)
  },

  'arcade-glossary': () => {
    sw(600, 900, 0.04, 'square', 0.05)
    sw(900, 600, 0.04, 'square', 0.04, 0.04)
  },

  'arcade-prompt': () => {
    pt(660, 0.04, 'square', 0.06)
    pt(880, 0.04, 'square', 0.06, 0.04)
    pt(1100, 0.06, 'square', 0.05, 0.08)
  },

  'arcade-preview': () => {
    const notes = [262, 330, 392, 523, 660]
    notes.forEach((f, i) => pt(f, 0.06, 'square', 0.06, i * 0.06))
  },

  'arcade-download': () => {
    sw(400, 1200, 0.1, 'square', 0.08)
    pt(1200, 0.15, 'square', 0.06, 0.08)
    pt(600, 0.08, 'sine', 0.03, 0.08)
  },

  'arcade-speed': () => {
    const notes = [523, 659, 784, 1047, 784, 659, 523]
    notes.forEach((f, i) => pt(f, 0.025, 'square', 0.06, i * 0.025))
  },

  // =============== RED ALERT ===============

  'ra-radar-ping': () => {
    sw(600, 1200, 0.12, 'sine', 0.1)
    pf(1200, 0.08, 'sine', 0.04, 0.02, 3000, 5)
    pt(300, 0.05, 'sine', 0.03)
  },

  'ra-tech-researched': () => {
    pt(440, 0.12, 'sawtooth', 0.07)
    pt(659.25, 0.12, 'sawtooth', 0.07, 0.1)
    pf(880, 0.08, 'sine', 0.03, 0.1, 2000)
    pt(220, 0.1, 'square', 0.03, 0.1)
  },

  'ra-deploy': () => {
    sw(400, 200, 0.08, 'sawtooth', 0.09)
    sw(800, 300, 0.06, 'square', 0.03)
    pt(100, 0.05, 'sine', 0.04)
  },

  'ra-mission-accomplished': () => {
    pt(261.63, 0.15, 'sawtooth', 0.07)
    pt(329.63, 0.15, 'sawtooth', 0.07, 0.15)
    pt(392.00, 0.15, 'sawtooth', 0.07, 0.30)
    pt(523.25, 0.3, 'sawtooth', 0.09, 0.45)
    pf(523.25, 0.2, 'sine', 0.03, 0.45, 1500)
    pt(130.81, 0.3, 'square', 0.03, 0.45)
  },

  'ra-campaign-complete': () => {
    const notes: [number, number, number][] = [
      [261.63, 0, 0.1], [261.63, 0.12, 0.1], [261.63, 0.24, 0.1],
      [392.00, 0.36, 0.15], [329.63, 0.53, 0.1], [392.00, 0.65, 0.35],
    ]
    for (const [freq, start, dur] of notes) {
      pt(freq, dur, 'sawtooth', 0.08, start)
      pt(freq * 0.5, dur, 'square', 0.02, start)
    }
    pf(130.81, 0.64, 'sawtooth', 0.04, 0.36, 600)
  },

  'ra-alert-klaxon': () => {
    for (let i = 0; i < 4; i++) {
      const f = i % 2 === 0 ? 440 : 520
      pt(f, 0.06, 'sawtooth', 0.09, i * 0.06)
      pt(f * 0.5, 0.05, 'square', 0.03, i * 0.06)
    }
  },

  'ra-command-blip': () => {
    pt(800, 0.025, 'square', 0.07)
    pt(1600, 0.015, 'sine', 0.02)
  },

  'ra-unit-ready': () => {
    sw(300, 600, 0.06, 'sawtooth', 0.08)
    pt(600, 0.04, 'square', 0.03, 0.03)
  },

  'ra-mission-failed': () => {
    pt(392, 0.15, 'sawtooth', 0.09)
    pt(261.63, 0.2, 'sawtooth', 0.09, 0.15)
    pt(130.81, 0.1, 'square', 0.04, 0.15)
  },

  'ra-credits-collect': () => {
    pt(1000, 0.04, 'square', 0.08)
    pt(1200, 0.04, 'square', 0.08, 0.03)
    pt(2000, 0.03, 'sine', 0.02, 0.03)
  },

  'ra-hover': () => {
    pt(900, 0.02, 'sawtooth', 0.04)
    pt(1800, 0.01, 'sine', 0.01)
  },

  'ra-level-clear': () => {
    const notes = [392, 440, 523, 659, 784]
    notes.forEach((f, i) => {
      pt(f, 0.12, 'sawtooth', 0.06, i * 0.1)
      pt(f * 0.5, 0.1, 'square', 0.02, i * 0.1)
    })
    pt(784, 0.4, 'sawtooth', 0.05, 0.5)
  },

  'ra-badge': () => {
    pt(440, 0.1, 'sawtooth', 0.06)
    pt(554, 0.1, 'sawtooth', 0.06, 0.1)
    pt(659, 0.2, 'sawtooth', 0.08, 0.2)
    pf(659, 0.15, 'sine', 0.03, 0.2, 2000)
  },

  'ra-result-great': () => {
    pt(523.25, 0.08, 'sawtooth', 0.07)
    pt(659.25, 0.08, 'sawtooth', 0.07, 0.08)
    pt(783.99, 0.15, 'sawtooth', 0.08, 0.16)
    pt(391.99, 0.1, 'square', 0.03, 0.16)
  },

  'ra-star': () => {
    sw(500, 800, 0.08, 'sawtooth', 0.06)
    pt(1600, 0.05, 'sine', 0.02, 0.03)
  },

  'ra-tick': () => {
    pt(200, 0.02, 'sawtooth', 0.04)
    pt(400, 0.01, 'square', 0.02)
  },

  'ra-glossary': () => {
    sw(400, 700, 0.05, 'sawtooth', 0.04)
    pt(700, 0.03, 'square', 0.02, 0.03)
  },

  'ra-prompt': () => {
    pt(500, 0.03, 'sawtooth', 0.05)
    pt(700, 0.05, 'sawtooth', 0.05, 0.03)
  },

  'ra-preview': () => {
    sw(200, 400, 0.2, 'sawtooth', 0.04)
    pt(400, 0.3, 'square', 0.03, 0.1)
    pf(800, 0.15, 'sine', 0.02, 0.15, 1200)
  },

  'ra-download': () => {
    sw(1200, 400, 0.15, 'sawtooth', 0.06)
    sw(600, 200, 0.12, 'square', 0.03)
    pt(400, 0.1, 'sawtooth', 0.04, 0.1)
  },

  'ra-speed': () => {
    sw(300, 900, 0.08, 'sawtooth', 0.06)
    sw(600, 1800, 0.06, 'sine', 0.02)
  },

  // =============== CLAIR OBSCUR ===============

  'co-technique-learn': () => {
    dc([261.63, 329.63, 392.00, 523.25], 0.7, 'sine', 0.06, 0, 0.15)
    pf(523.25, 0.35, 'triangle', 0.04, 0.35, 1500)
    pt(1046.5, 0.2, 'sine', 0.015, 0.4)
  },

  'co-expedition-log': () => {
    pf(392, 0.2, 'sine', 0.06, 0, 1200)
    pf(329.63, 0.25, 'sine', 0.05, 0.1, 1000)
    pt(784, 0.08, 'sine', 0.015, 0.1)
  },

  'co-execute': () => {
    dc([261.63, 329.63, 392.00], 0.18, 'sine', 0.06)
    pt(523.25, 0.1, 'triangle', 0.03, 0.05)
  },

  'co-chapter-clear': () => {
    dc([261.63, 329.63, 392.00], 0.8, 'triangle', 0.04, 0, 0.2)
    pf(523.25, 0.4, 'sine', 0.05, 0.35, 1500)
    pt(1046.5, 0.25, 'sine', 0.02, 0.5)
  },

  'co-expedition-complete': () => {
    dc([261.63, 392.00], 1.5, 'triangle', 0.035, 0, 0.4)
    pf(261.63, 0.5, 'sine', 0.06, 0.1, 1200)
    pf(329.63, 0.5, 'sine', 0.07, 0.3, 1200)
    pf(392.00, 0.5, 'sine', 0.08, 0.5, 1200)
    pf(523.25, 0.8, 'sine', 0.09, 0.7, 1500)
    pt(1046.5, 0.4, 'sine', 0.02, 0.9)
  },

  'co-page-chime': () => {
    pt(1046.50, 0.1, 'sine', 0.04)
    pt(2093, 0.06, 'sine', 0.01)
  },

  'co-hover-note': () => {
    pt(783.99, 0.035, 'sine', 0.02)
  },

  'co-select-confirm': () => {
    pf(659.25, 0.05, 'sine', 0.05, 0, 2000)
    pf(783.99, 0.07, 'sine', 0.06, 0.04, 2000)
  },

  'co-missed-beat': () => {
    pf(329.63, 0.14, 'sine', 0.05, 0, 800)
    pf(261.63, 0.18, 'sine', 0.04, 0.08, 600)
  },

  'co-lumina-collect': () => {
    const freqs = [523.25, 659.25, 783.99, 1046.50]
    freqs.forEach((f, i) => {
      pt(f, 0.08, 'sine', 0.04, i * 0.03)
      pt(f * 2, 0.05, 'sine', 0.01, i * 0.03)
    })
  },

  'co-locked': () => {
    pf(220, 0.15, 'triangle', 0.04, 0, 400)
    pf(196, 0.12, 'sine', 0.03, 0.05, 300)
  },

  'co-badge': () => {
    dc([392, 493.88, 587.33], 0.5, 'sine', 0.05, 0, 0.1)
    pf(783.99, 0.3, 'sine', 0.04, 0.2, 2000)
    pt(1567.98, 0.15, 'sine', 0.015, 0.3)
  },

  'co-result-great': () => {
    dc([523.25, 659.25, 783.99], 0.4, 'sine', 0.05, 0, 0.08)
    pf(1046.5, 0.25, 'sine', 0.04, 0.15, 2500)
  },

  'co-star': () => {
    pf(880, 0.15, 'sine', 0.04, 0, 2000)
    pt(1760, 0.08, 'sine', 0.015, 0.02)
  },

  'co-tick': () => {
    pt(660, 0.02, 'sine', 0.025)
  },

  'co-glossary': () => {
    pf(440, 0.06, 'sine', 0.03, 0, 1000)
    pf(523, 0.04, 'sine', 0.02, 0.04, 1200)
  },

  'co-prompt': () => {
    pf(523.25, 0.06, 'triangle', 0.04, 0, 1500)
    pf(659.25, 0.08, 'sine', 0.04, 0.05, 1500)
  },

  'co-preview': () => {
    dc([261.63, 329.63, 392], 0.6, 'sine', 0.03, 0, 0.3)
    pt(523.25, 0.2, 'triangle', 0.02, 0.3)
  },

  'co-download': () => {
    const freqs = [392, 523.25, 659.25, 783.99]
    freqs.forEach((f, i) => pf(f, 0.12, 'sine', 0.04, i * 0.06, 1500))
    pt(1046.5, 0.2, 'sine', 0.03, 0.3)
  },

  'co-speed': () => {
    const freqs = [523, 659, 784, 1047]
    freqs.forEach((f, i) => pt(f, 0.03, 'sine', 0.03, i * 0.02))
  },

  // =============== TETRIS ===============

  'tetris-piece-drop': () => {
    sw(200, 80, 0.05, 'square', 0.09)
    pt(400, 0.03, 'square', 0.04)
    pt(60, 0.04, 'sine', 0.05)
  },

  'tetris-piece-rotate': () => {
    pt(1000, 0.025, 'square', 0.06)
    pt(2000, 0.015, 'square', 0.02)
  },

  'tetris-line-clear': () => {
    sw(1200, 400, 0.15, 'square', 0.09)
    sw(2400, 800, 0.15, 'square', 0.03)
    pf(200, 0.1, 'square', 0.04, 0, 800)
  },

  'tetris-tetris-clear': () => {
    for (let i = 0; i < 4; i++) {
      sw(1200, 400, 0.12, 'square', 0.07, i * 0.05)
      pt(2400, 0.08, 'square', 0.02, i * 0.05)
    }
    const fanfare = [523.25, 659.25, 783.99, 1046.50]
    fanfare.forEach((f, i) => {
      pt(f, 0.1, 'square', 0.07, 0.25 + i * 0.08)
      pt(f * 0.5, 0.08, 'square', 0.02, 0.25 + i * 0.08)
    })
  },

  'tetris-level-up': () => {
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
    scale.forEach((f, i) => {
      pt(f, 0.06, 'square', 0.06, i * 0.05)
      pt(f * 2, 0.04, 'sine', 0.015, i * 0.05)
    })
  },

  'tetris-high-score': () => {
    const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]
    arpeggio.forEach((f, i) => pt(f, 0.05, 'square', 0.06, i * 0.04))
    dc([523.25, 659.25, 783.99], 0.4, 'square', 0.04, 0.30)
    pt(1046.5, 0.3, 'square', 0.03, 0.30)
  },

  'tetris-soft-drop': () => {
    sw(600, 400, 0.03, 'square', 0.06)
    pt(800, 0.02, 'square', 0.02)
  },

  'tetris-hold-piece': () => {
    pt(800, 0.035, 'square', 0.06)
    pt(1000, 0.035, 'square', 0.06, 0.03)
  },

  'tetris-lock-delay': () => {
    pf(150, 0.1, 'square', 0.06, 0, 400)
    pt(300, 0.05, 'square', 0.02)
  },

  'tetris-points-collect': () => {
    pt(880, 0.035, 'square', 0.06)
    pt(1200, 0.035, 'square', 0.06, 0.03)
    pt(1760, 0.02, 'sine', 0.02, 0.03)
  },

  'tetris-hover': () => {
    pt(1200, 0.015, 'square', 0.04)
  },

  'tetris-demo-complete': () => {
    sw(800, 1200, 0.1, 'square', 0.07)
    pt(1200, 0.12, 'square', 0.06, 0.08)
    pt(600, 0.06, 'square', 0.03, 0.08)
  },

  'tetris-badge-combo': () => {
    for (let i = 0; i < 3; i++) {
      sw(800 + i * 200, 400, 0.08, 'square', 0.06, i * 0.06)
    }
    pt(1400, 0.15, 'square', 0.07, 0.2)
    pt(700, 0.1, 'square', 0.03, 0.2)
  },

  'tetris-locked': () => {
    pt(120, 0.08, 'square', 0.07)
    sw(250, 100, 0.06, 'square', 0.04, 0.02)
  },

  'tetris-star': () => {
    pt(660, 0.08, 'square', 0.06)
    pt(1320, 0.05, 'sine', 0.02)
  },

  'tetris-tick': () => {
    pt(500, 0.012, 'square', 0.04)
  },

  'tetris-glossary': () => {
    pt(700, 0.03, 'square', 0.04)
    sw(700, 500, 0.03, 'square', 0.03, 0.03)
  },

  'tetris-prompt': () => {
    pt(500, 0.04, 'square', 0.05)
    pt(700, 0.05, 'square', 0.05, 0.04)
  },

  'tetris-preview': () => {
    const notes = [262, 294, 330, 392, 523]
    notes.forEach((f, i) => pt(f, 0.05, 'square', 0.05, i * 0.06))
  },

  'tetris-download': () => {
    sw(400, 800, 0.08, 'square', 0.06)
    pt(800, 0.12, 'square', 0.05, 0.06)
    pt(400, 0.06, 'square', 0.02, 0.06)
  },

  'tetris-speed': () => {
    const notes = [523, 659, 784, 1047, 784, 523]
    notes.forEach((f, i) => pt(f, 0.02, 'square', 0.05, i * 0.02))
  },

  // =============== ZELDA ===============

  'zelda-item-get': () => {
    const notes: [number, number][] = [[349.23, 0.12], [440, 0.12], [523.25, 0.12], [698.46, 0.45]]
    let t = 0
    for (const [f, d] of notes) {
      pt(f, d, 'triangle', 0.11, t)
      pt(f * 2, d * 0.5, 'sine', 0.03, t)
      t += 0.1
    }
    dc([698.46, 880, 1046.5], 0.3, 'sine', 0.015, 0.35)
  },

  'zelda-chest-open': () => {
    const notes = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23]
    notes.forEach((f, i) => {
      pt(f, 0.07, 'triangle', 0.04 + i * 0.015, i * 0.04)
      pt(f * 2, 0.04, 'sine', 0.01, i * 0.04)
    })
  },

  'zelda-secret-discovered': () => {
    const notes = [493.88, 698.46, 987.77, 698.46, 987.77, 1396.91]
    notes.forEach((f, i) => {
      pt(f, 0.12, 'triangle', 0.09, i * 0.06)
      pt(f * 2, 0.06, 'sine', 0.02, i * 0.06)
    })
  },

  'zelda-quest-accepted': () => {
    pt(392, 0.18, 'triangle', 0.1)
    pt(523.25, 0.22, 'triangle', 0.11, 0.1)
    pt(784, 0.1, 'sine', 0.02, 0.1)
  },

  'zelda-sword-slash': () => {
    sw(800, 200, 0.06, 'sawtooth', 0.11)
    sw(600, 100, 0.04, 'square', 0.05)
    pt(1600, 0.03, 'sine', 0.04) // blade ring
  },

  'zelda-dungeon-clear': () => {
    const ascend = [261.63, 329.63, 392, 523.25, 659.25, 783.99]
    ascend.forEach((f, i) => {
      pt(f, 0.14, 'triangle', 0.09, i * 0.08)
      pt(f * 2, 0.08, 'sine', 0.02, i * 0.08)
    })
    dc([523.25, 659.25, 783.99], 0.5, 'triangle', 0.06, ascend.length * 0.08)
  },

  'zelda-heart-collect': () => {
    pt(659.25, 0.14, 'triangle', 0.08)
    pt(880, 0.17, 'triangle', 0.08, 0.08)
    pt(1760, 0.08, 'sine', 0.02, 0.08)
  },

  'zelda-fairy-chime': () => {
    const freqs = [2200, 2800, 2400, 3000]
    freqs.forEach((f, i) => {
      pt(f, 0.06, 'sine', 0.03, i * 0.04)
      pt(f * 0.5, 0.04, 'sine', 0.01, i * 0.04)
    })
  },

  'zelda-rupee-collect': () => {
    pt(1500, 0.06, 'triangle', 0.09)
    pt(3000, 0.04, 'sine', 0.03)
    pt(750, 0.03, 'sine', 0.03)
  },

  'zelda-door-locked': () => {
    pt(100, 0.12, 'square', 0.09)
    pt(80, 0.08, 'square', 0.05, 0.02)
    sw(200, 80, 0.06, 'triangle', 0.03, 0.04)
  },

  'zelda-level-clear': () => {
    // Triumphant horn sequence distinct from dungeon-clear
    const melody = [392, 523.25, 659.25, 783.99, 1046.5]
    melody.forEach((f, i) => {
      pt(f, 0.1, 'triangle', 0.08, i * 0.1)
      pf(f * 0.5, 0.08, 'triangle', 0.03, i * 0.1, 600)
    })
    dc([783.99, 1046.5, 1318.5], 0.4, 'sine', 0.03, 0.5)
  },

  'zelda-lock-rattle': () => {
    // Chain/lock rattling sound distinct from door-locked
    for (let i = 0; i < 3; i++) {
      sw(300, 150, 0.04, 'square', 0.06, i * 0.05)
      pt(600, 0.02, 'triangle', 0.03, i * 0.05)
    }
  },

  'zelda-gem-collect': () => {
    // Gem sparkle - higher pitched than rupee
    pt(1800, 0.06, 'sine', 0.07)
    pt(2200, 0.08, 'sine', 0.06, 0.04)
    pt(3600, 0.04, 'sine', 0.02, 0.04)
  },

  'zelda-treasure-reveal': () => {
    // Dramatic reveal - chest opening leads to magical reveal
    dc([440, 523.25, 659.25], 0.4, 'triangle', 0.05, 0, 0.1)
    pf(880, 0.3, 'sine', 0.06, 0.2, 2000)
    pt(1760, 0.15, 'sine', 0.02, 0.3)
  },

  'zelda-star': () => {
    pt(880, 0.12, 'triangle', 0.06)
    pt(1760, 0.08, 'sine', 0.02, 0.02)
  },

  'zelda-tick': () => {
    pt(440, 0.02, 'triangle', 0.03)
  },

  'zelda-glossary': () => {
    pt(523, 0.04, 'triangle', 0.04)
    pt(659, 0.06, 'sine', 0.03, 0.03)
  },

  'zelda-prompt': () => {
    pt(440, 0.05, 'triangle', 0.05)
    pt(523, 0.06, 'triangle', 0.05, 0.04)
    pt(659, 0.04, 'sine', 0.02, 0.04)
  },

  'zelda-preview': () => {
    dc([261.63, 329.63, 392], 0.5, 'triangle', 0.04, 0, 0.2)
    pt(523.25, 0.3, 'sine', 0.03, 0.25)
  },

  'zelda-download': () => {
    const notes = [349.23, 440, 523.25, 659.25]
    notes.forEach((f, i) => pt(f, 0.1, 'triangle', 0.06, i * 0.08))
    pt(659.25, 0.25, 'sine', 0.04, 0.35)
  },

  'zelda-speed': () => {
    const notes = [880, 1047, 1319, 1568]
    notes.forEach((f, i) => pt(f, 0.03, 'sine', 0.03, i * 0.02))
  },

  // =============== ELDER SCROLLS ===============

  'es-quest-accept': () => {
    // Deep Dragonborn horn C3+G3
    dc([130.81, 196], 0.7, 'triangle', 0.07, 0, 0.08)
    pt(65.41, 0.5, 'sine', 0.04)              // sub-bass
    dc([130.81, 196, 261.63], 0.5, 'sine', 0.02, 0.1, 0.1) // choir pad
  },

  'es-skill-unlock': () => {
    // Constellation chime with choir pad
    pt(1046.50, 0.3, 'sine', 0.05)
    pt(1567.98, 0.25, 'sine', 0.03, 0.05)
    dc([329.63, 392, 493.88, 659.25], 0.9, 'sine', 0.03, 0.1, 0.15)
  },

  'es-level-complete': () => {
    // Nordic chant Dm -> C major
    dc([146.83, 174.61, 220, 293.66], 0.8, 'sine', 0.04, 0, 0.1)
    dc([130.81, 164.81, 196, 261.63], 0.9, 'sine', 0.05, 0.7, 0.12)
    pt(146.83, 0.6, 'triangle', 0.06)
    pt(130.81, 0.8, 'triangle', 0.07, 0.7)
  },

  'es-node-select': () => {
    // Stone rune activation
    sw(80, 40, 0.04, 'square', 0.07)
    pt(440, 0.2, 'triangle', 0.05, 0.01)
    pt(110, 0.08, 'sine', 0.03)
  },

  'es-victory': () => {
    // Epic Dragonborn fanfare
    dc([130.81], 0.35, 'triangle', 0.08, 0, 0.04) // horn
    dc([261.63, 329.63, 392, 523.25], 0.9, 'sine', 0.04, 0.3, 0.1) // choir
    dc([329.63, 415.30, 493.88, 659.25], 0.8, 'sine', 0.04, 1.1, 0.12) // resolution
    pt(130.81, 0.9, 'triangle', 0.04, 1.1)  // final bass
    pt(65.41, 0.6, 'sine', 0.03, 1.1)       // sub
  },

  'es-ui-click': () => {
    // Parchment rustle
    sw(150, 60, 0.03, 'square', 0.035)
    sw(400, 200, 0.02, 'square', 0.015)
  },

  'es-whisper': () => {
    // Ethereal hover - breathy shimmer
    pf(800, 0.04, 'sine', 0.02, 0, 1200)
    pt(1600, 0.025, 'sine', 0.008)
  },

  'es-spell-fizzle': () => {
    // Failed spell - descending with crackle
    sw(600, 150, 0.15, 'sawtooth', 0.05)
    sw(1200, 200, 0.1, 'square', 0.02)
    pt(80, 0.08, 'sine', 0.04, 0.08)
  },

  'es-ward': () => {
    // Sealed ward barrier - deep resonance with rejection
    pf(110, 0.15, 'triangle', 0.06, 0, 300)
    sw(400, 200, 0.1, 'square', 0.04, 0.02)
    pt(55, 0.1, 'sine', 0.04)
  },

  'es-septim': () => {
    // Coin clink - metallic with resonance
    pt(2000, 0.06, 'sine', 0.06)
    pt(3000, 0.04, 'sine', 0.03)
    pt(1000, 0.03, 'triangle', 0.03)
    pf(500, 0.08, 'triangle', 0.02, 0.02, 2000)
  },

  'es-quest-stage': () => {
    // Quest stage complete - shorter than quest-accept
    dc([196, 261.63], 0.4, 'triangle', 0.05, 0, 0.05)
    pt(130.81, 0.3, 'sine', 0.03)
    pt(523.25, 0.15, 'sine', 0.02, 0.2)
  },

  'es-skill-increase': () => {
    // Skill gained - ascending warmth
    dc([329.63, 392, 493.88], 0.5, 'sine', 0.04, 0, 0.08)
    pt(659.25, 0.2, 'triangle', 0.03, 0.25)
  },

  'es-minor-discovery': () => {
    // Small lore find - subtle
    pf(440, 0.15, 'triangle', 0.04, 0, 800)
    pt(880, 0.08, 'sine', 0.015, 0.05)
  },

  'es-dragon-soul': () => {
    // Dragon soul absorbed - epic swell
    dc([130.81, 164.81, 196, 261.63], 0.8, 'sine', 0.05, 0, 0.2)
    dc([261.63, 329.63, 392, 523.25], 0.6, 'sine', 0.04, 0.4, 0.15)
    pt(65.41, 0.8, 'triangle', 0.04)
    pt(1046.5, 0.3, 'sine', 0.02, 0.6)
  },

  'es-star': () => {
    // Constellation point - deep bell
    pf(440, 0.2, 'triangle', 0.04, 0, 1000)
    pt(880, 0.1, 'sine', 0.015, 0.02)
    pt(220, 0.08, 'sine', 0.02)
  },

  'es-tick': () => {
    // Arcane pulse
    pf(220, 0.025, 'triangle', 0.03, 0, 500)
  },

  'es-glossary': () => {
    // Ancient tome opening
    pf(330, 0.08, 'triangle', 0.03, 0, 600)
    sw(200, 400, 0.06, 'sine', 0.02)
  },

  'es-prompt': () => {
    // Spell school selection
    pf(392, 0.06, 'triangle', 0.04, 0, 800)
    pf(523, 0.08, 'sine', 0.03, 0.05, 1000)
  },

  'es-preview': () => {
    // Skyrim wind - distant atmosphere
    dc([110, 130.81, 164.81], 0.8, 'sine', 0.02, 0, 0.4)
    pf(65.41, 0.6, 'triangle', 0.03, 0, 200)
  },

  'es-download': () => {
    // Soul absorb - ethereal pull
    sw(400, 800, 0.3, 'sine', 0.04)
    dc([261.63, 329.63, 392], 0.4, 'sine', 0.03, 0.1, 0.1)
    pt(523.25, 0.2, 'triangle', 0.03, 0.25)
  },

  'es-speed': () => {
    // Shout power - quick ascending force
    dc([130.81, 196, 261.63], 0.15, 'triangle', 0.05, 0, 0.02)
    sw(200, 600, 0.1, 'sine', 0.03)
  },

  // =============== GALLERY ===============

  'gallery-click': () => {
    pt(800, 0.02, 'sine', 0.04)
  },

  'gallery-hover': () => {
    pt(1200, 0.012, 'sine', 0.02)
  },
}

// ---- File-based Sound Playback ----

// SoundRef: either a synthesized SoundName or a file path prefixed with "file:"
export type SoundRef = SoundName | `file:${string}`

// Cache for decoded audio buffers (on-demand loading)
const audioBufferCache = new Map<string, AudioBuffer>()
const fetchingBuffers = new Set<string>()

async function playSampleSound(filePath: string): Promise<void> {
  const ctx = getCtx()
  const master = getMaster()

  // Check cache first
  let buffer = audioBufferCache.get(filePath)
  if (!buffer) {
    // Avoid duplicate fetches for the same file
    if (fetchingBuffers.has(filePath)) return
    fetchingBuffers.add(filePath)
    try {
      const response = await fetch(filePath)
      const arrayBuffer = await response.arrayBuffer()
      buffer = await ctx.decodeAudioData(arrayBuffer)
      audioBufferCache.set(filePath, buffer)
    } catch {
      // Failed to load audio file
      return
    } finally {
      fetchingBuffers.delete(filePath)
    }
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(master)
  source.start()
}

// ---- Play Sound ----

export function playSound(name: SoundRef): void {
  if (muted) return
  if (typeof window === 'undefined') return
  try {
    if (typeof name === 'string' && name.startsWith('file:')) {
      const filePath = name.slice(5) // strip "file:" prefix
      playSampleSound(filePath)
    } else {
      sounds[name as SoundName]()
    }
  } catch {
    // Audio context may not be ready
  }
}

// ---- Star Reveal (dynamic ascending notes) ----

export function playStarReveal(count: number, worldId: string): void {
  if (muted || typeof window === 'undefined') return
  const worldScales: Record<string, { notes: number[], type: OscillatorType }> = {
    'arcade':        { notes: [523.25, 659.25, 783.99], type: 'square' },
    'red-alert':     { notes: [440, 554.37, 659.25],    type: 'sawtooth' },
    'clair-obscur':  { notes: [523.25, 659.25, 783.99], type: 'sine' },
    'tetris':        { notes: [523.25, 587.33, 659.25], type: 'square' },
    'zelda':         { notes: [440, 523.25, 659.25],    type: 'triangle' },
    'elder-scrolls': { notes: [261.63, 329.63, 392],    type: 'triangle' },
  }
  const config = worldScales[worldId] || worldScales['arcade']
  try {
    for (let i = 0; i < Math.min(count, 3); i++) {
      pt(config.notes[i], 0.2, config.type, 0.07, i * 0.18)
      pt(config.notes[i] * 2, 0.12, 'sine', 0.02, i * 0.18)
    }
    if (count >= 3) {
      pt(config.notes[2] * 2, 0.35, config.type, 0.04, 0.54)
    }
  } catch {}
}

// ---- Progress Tick (builds tempo during AI execution) ----

let tickTimer: ReturnType<typeof setTimeout> | null = null
let tickCount = 0

export function startProgressTick(soundName: SoundRef): void {
  stopProgressTick()
  if (muted) return
  tickCount = 0
  const baseTempo = 400
  const tick = () => {
    if (muted) { stopProgressTick(); return }
    tickCount++
    try { sounds[soundName]() } catch {}
    const tempo = Math.max(120, baseTempo - tickCount * 8)
    tickTimer = setTimeout(tick, tempo)
  }
  tickTimer = setTimeout(tick, baseTempo)
}

export function stopProgressTick(): void {
  if (tickTimer) clearTimeout(tickTimer)
  tickTimer = null
  tickCount = 0
}

// ---- Ambient (very subtle background loops) ----

let ambientNodes: { osc: OscillatorNode; gain: GainNode }[] = []
let ambientTimer: ReturnType<typeof setInterval> | null = null

export function startAmbient(worldId: string): void {
  stopAmbient()
  if (muted || typeof window === 'undefined') return
  const ctx = getCtx()
  const master = getMaster()
  const vol = 0.012 // barely perceptible

  const makeOsc = (freq: number, type: OscillatorType, g: number): void => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = g * vol
    osc.connect(gain)
    gain.connect(master)
    osc.start()
    ambientNodes.push({ osc, gain })
  }

  switch (worldId) {
    case 'arcade':
      makeOsc(110, 'square', 0.3)
      makeOsc(55, 'square', 0.2)
      break
    case 'red-alert':
      makeOsc(60, 'sawtooth', 0.4)
      makeOsc(120, 'square', 0.15)
      // Slow radar sweep modulation
      if (ambientNodes[0]) {
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.type = 'sine'
        lfo.frequency.value = 0.3
        lfoGain.gain.value = 0.005
        lfo.connect(lfoGain)
        lfoGain.connect(ambientNodes[0].gain.gain)
        lfo.start()
      }
      break
    case 'clair-obscur':
      makeOsc(220, 'sine', 0.2)
      makeOsc(330, 'sine', 0.1)
      break
    case 'tetris':
      makeOsc(82.41, 'square', 0.25) // low E
      makeOsc(123.47, 'square', 0.15) // B2
      break
    case 'zelda':
      makeOsc(196, 'triangle', 0.2)
      makeOsc(293.66, 'sine', 0.1)
      break
    case 'elder-scrolls':
      makeOsc(55, 'sine', 0.4)      // deep drone
      makeOsc(82.41, 'triangle', 0.2) // wind
      makeOsc(110, 'sine', 0.1)      // shimmer
      break
    default:
      // Gallery: silence
      break
  }
}

export function stopAmbient(): void {
  for (const { osc } of ambientNodes) {
    try { osc.stop() } catch {}
  }
  ambientNodes = []
  if (ambientTimer) { clearInterval(ambientTimer); ambientTimer = null }
}

// ---- Background Music (file-based, for clair-obscur demos) ----

const CLAIR_OBSCUR_BG_TRACKS = [
  '/sounds/clair-obscur/bg-lumiere.mp3',
  '/sounds/clair-obscur/bg-alicia.mp3',
  '/sounds/clair-obscur/bg-lune.mp3',
  '/sounds/clair-obscur/bg-sciel.mp3',
  '/sounds/clair-obscur/bg-paintress.mp3',
  '/sounds/clair-obscur/bg-contre-le-coeur.mp3',
  '/sounds/clair-obscur/bg-clea.mp3',
  '/sounds/clair-obscur/bg-beneath-blue-tree.mp3',
  '/sounds/clair-obscur/bg-numbers-the-hours.mp3',
  '/sounds/clair-obscur/bg-music-box.mp3',
]

let bgMusicSource: AudioBufferSourceNode | null = null
let bgMusicGain: GainNode | null = null
let bgMusicStopping = false

export function startBackgroundMusic(worldId: string, demoIndex: number): void {
  stopBackgroundMusic()
  if (worldId !== 'clair-obscur') return
  if (muted || typeof window === 'undefined') return

  const trackIndex = demoIndex % CLAIR_OBSCUR_BG_TRACKS.length
  const trackPath = CLAIR_OBSCUR_BG_TRACKS[trackIndex]

  const ctx = getCtx()
  const master = getMaster()

  // Create gain node for this background music at 20% of master
  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.connect(master)
  bgMusicGain = gainNode
  bgMusicStopping = false

  // Load and play the track
  const loadAndPlay = async () => {
    try {
      let buffer = audioBufferCache.get(trackPath)
      if (!buffer) {
        const response = await fetch(trackPath)
        const arrayBuffer = await response.arrayBuffer()
        buffer = await ctx.decodeAudioData(arrayBuffer)
        audioBufferCache.set(trackPath, buffer)
      }

      // Check if we were stopped while loading
      if (bgMusicStopping || bgMusicGain !== gainNode) return

      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(gainNode)
      source.start()
      bgMusicSource = source

      // Fade in over 2 seconds to 20% (0.2) relative volume
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 2)
    } catch {
      // Failed to load background music
    }
  }

  loadAndPlay()
}

export function stopBackgroundMusic(): void {
  bgMusicStopping = true
  if (bgMusicSource && bgMusicGain) {
    const ctx = getCtx()
    const source = bgMusicSource
    const gain = bgMusicGain

    // Fade out over 1 second
    gain.gain.cancelScheduledValues(ctx.currentTime)
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)

    // Stop the source after fade completes
    setTimeout(() => {
      try { source.stop() } catch {}
      try { gain.disconnect() } catch {}
    }, 1100)
  }
  bgMusicSource = null
  bgMusicGain = null
}
