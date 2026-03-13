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

let audioCtx: AudioContext | null = null
let muted = true // muted by default

// Init on first interaction
function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

// Load mute state from localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('arcade-sound-muted')
  muted = stored === null ? true : stored === 'true'
}

export function isMuted(): boolean {
  return muted
}

export function toggleMute(): void {
  muted = !muted
  if (typeof window !== 'undefined') {
    localStorage.setItem('arcade-sound-muted', String(muted))
  }
}

function playTone(freq: number, duration: number, type: OscillatorType = 'square', gainVal = 0.15, startTime = 0) {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(gainVal, ctx.currentTime + startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime + startTime)
  osc.stop(ctx.currentTime + startTime + duration)
}

const sounds: Record<SoundName, () => void> = {
  // Short rising two-tone (E5-B5)
  coin: () => {
    playTone(659.25, 0.08, 'square', 0.12) // E5
    playTone(987.77, 0.15, 'square', 0.12, 0.08) // B5
  },

  // Rising arpeggio (C4-E4-G4-C5)
  powerUp: () => {
    playTone(261.63, 0.1, 'square', 0.1) // C4
    playTone(329.63, 0.1, 'square', 0.1, 0.1) // E4
    playTone(392.0, 0.1, 'square', 0.1, 0.2) // G4
    playTone(523.25, 0.2, 'square', 0.12, 0.3) // C5
  },

  // Classic 1-UP melody
  oneUp: () => {
    playTone(330, 0.08, 'square', 0.1) // E4
    playTone(392, 0.08, 'square', 0.1, 0.08) // G4
    playTone(659, 0.08, 'square', 0.1, 0.16) // E5
    playTone(523, 0.08, 'square', 0.1, 0.24) // C5
    playTone(587, 0.08, 'square', 0.1, 0.32) // D5
    playTone(784, 0.15, 'square', 0.12, 0.4) // G5
  },

  // Low descending tone for page transitions
  pipe: () => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.25)
  },

  // Short percussive pop
  blockHit: () => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.06)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  },

  // 4-bar celebration melody
  fanfare: () => {
    const notes = [
      [523, 0.12], // C5
      [523, 0.12], // C5
      [523, 0.12], // C5
      [523, 0.2],  // C5 (held)
      [415, 0.15], // Ab4
      [466, 0.15], // Bb4
      [523, 0.12], // C5
      [466, 0.08], // Bb4
      [523, 0.3],  // C5 (held)
    ]
    let time = 0
    for (const [freq, dur] of notes) {
      playTone(freq as number, dur as number, 'square', 0.1, time)
      time += dur as number
    }
  },

  // Tiny high chirp for button hover
  blip: () => {
    playTone(1200, 0.03, 'sine', 0.06)
  },

  // Quick sweep high to low for phase transitions
  whoosh: () => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  },

  // Low sine wave hit for result appearing
  thud: () => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  },

  // Dull low square wave for locked node click
  bonk: () => {
    playTone(100, 0.1, 'square', 0.08)
  },

  // Two gentle sine tones ascending for page load
  chime: () => {
    playTone(523.25, 0.1, 'sine', 0.08) // C5
    playTone(659.25, 0.15, 'sine', 0.08, 0.1) // E5
  },

  // Quick rising chirp for choice/option selected
  select: () => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.06)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.06)
  },

  // Three descending tones for retry prompt
  retry: () => {
    playTone(523.25, 0.08, 'sine', 0.08) // C5
    playTone(440, 0.08, 'sine', 0.08, 0.1) // A4
    playTone(349.23, 0.12, 'sine', 0.08, 0.2) // F4
  },

  // ============ RED ALERT SOUNDS ============

  // Radar ping - rising sine sweep 600->1200Hz
  'ra-radar-ping': () => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.11)
  },

  // Tech researched - ascending two-tone A4->E5 (square)
  'ra-tech-researched': () => {
    playTone(440, 0.1, 'square', 0.08)
    playTone(659.25, 0.1, 'square', 0.08, 0.1)
  },

  // Deploy - quick descending sawtooth burst 400->200Hz
  'ra-deploy': () => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.09)
  },

  // Mission accomplished - C4-E4-G4 ascending + held C5
  'ra-mission-accomplished': () => {
    playTone(261.63, 0.15, 'square', 0.08)
    playTone(329.63, 0.15, 'square', 0.08, 0.15)
    playTone(392.00, 0.15, 'square', 0.08, 0.30)
    playTone(523.25, 0.3, 'square', 0.1, 0.45)
  },

  // Campaign complete - military bugle fanfare
  'ra-campaign-complete': () => {
    const notes: [number, number, number][] = [
      [261.63, 0, 0.1], [261.63, 0.12, 0.1], [261.63, 0.24, 0.1],
      [392.00, 0.36, 0.15], [329.63, 0.53, 0.1], [392.00, 0.65, 0.35],
    ]
    for (const [freq, start, dur] of notes) {
      playTone(freq, dur, 'square', 0.09, start)
    }
    playTone(130.81, 0.64, 'sawtooth', 0.04, 0.36)
  },

  // Alert klaxon - two alternating tones played twice
  'ra-alert-klaxon': () => {
    playTone(440, 0.06, 'sawtooth', 0.1)
    playTone(520, 0.06, 'sawtooth', 0.1, 0.06)
    playTone(440, 0.06, 'sawtooth', 0.1, 0.12)
    playTone(520, 0.06, 'sawtooth', 0.1, 0.18)
  },

  // Command blip - tiny square wave blip
  'ra-command-blip': () => {
    playTone(800, 0.02, 'square', 0.08)
  },

  // Unit ready - ascending chirp 300->600Hz
  'ra-unit-ready': () => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.06)
  },

  // Mission failed - descending two notes G4->C4
  'ra-mission-failed': () => {
    playTone(392.00, 0.15, 'sawtooth', 0.1)
    playTone(261.63, 0.15, 'sawtooth', 0.1, 0.15)
  },

  // Credits collect - quick double-blip
  'ra-credits-collect': () => {
    playTone(1000, 0.03, 'square', 0.09)
    playTone(1200, 0.03, 'square', 0.09, 0.03)
  },

  // ============ CLAIR OBSCUR SOUNDS ============

  // Technique learn - ascending piano arpeggio C4-E4-G4-C5
  'co-technique-learn': () => {
    playTone(261.63, 0.35, 'sine', 0.08)
    playTone(329.63, 0.35, 'sine', 0.09, 0.12)
    playTone(392.00, 0.35, 'sine', 0.10, 0.24)
    playTone(523.25, 0.45, 'sine', 0.11, 0.36)
  },

  // Expedition log - two gentle descending piano notes G4-E4
  'co-expedition-log': () => {
    playTone(392.00, 0.18, 'sine', 0.06)
    playTone(329.63, 0.22, 'sine', 0.05, 0.10)
  },

  // Execute - quick decisive piano chord (C4+E4+G4 simultaneous)
  'co-execute': () => {
    playTone(261.63, 0.15, 'sine', 0.07)
    playTone(329.63, 0.15, 'sine', 0.07)
    playTone(392.00, 0.15, 'sine', 0.07)
  },

  // Chapter clear - string pad swell with piano resolution
  'co-chapter-clear': () => {
    const ctx = getCtx()
    // Triangle wave string pads with slow attack
    const pads: [number, number][] = [[261.63, 0], [329.63, 0.05], [392.00, 0.10]]
    for (const [freq, start] of pads) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime + start)
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + start + 0.24)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.8)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + 0.81)
    }
    // Piano resolution at the peak
    playTone(523.25, 0.4, 'sine', 0.06, 0.35)
  },

  // Expedition complete - full arpeggio with sustained string harmony
  'co-expedition-complete': () => {
    const ctx = getCtx()
    // String pad foundation
    const stringPads: [number, number][] = [[261.63, 0], [392.00, 0]]
    for (const [freq] of stringPads) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.45)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 1.51)
    }
    // Piano arpeggio over the top
    playTone(261.63, 0.5, 'sine', 0.08, 0.1)
    playTone(329.63, 0.5, 'sine', 0.09, 0.3)
    playTone(392.00, 0.5, 'sine', 0.10, 0.5)
    playTone(523.25, 0.8, 'sine', 0.12, 0.7)
  },

  // Page chime - single clear bell tone C6
  'co-page-chime': () => {
    playTone(1046.50, 0.08, 'sine', 0.04)
  },

  // Hover note - tiny grace note G5
  'co-hover-note': () => {
    playTone(783.99, 0.03, 'sine', 0.02)
  },

  // Select confirm - two quick ascending notes E5-G5
  'co-select-confirm': () => {
    playTone(659.25, 0.04, 'sine', 0.05)
    playTone(783.99, 0.06, 'sine', 0.06, 0.04)
  },

  // Missed beat - descending minor third E4-C4
  'co-missed-beat': () => {
    playTone(329.63, 0.12, 'sine', 0.06)
    playTone(261.63, 0.15, 'sine', 0.05, 0.08)
  },

  // Lumina collect - gentle harp glissando C5-E5-G5-C6
  'co-lumina-collect': () => {
    playTone(523.25, 0.06, 'sine', 0.04)
    playTone(659.25, 0.06, 'sine', 0.04, 0.03)
    playTone(783.99, 0.06, 'sine', 0.05, 0.06)
    playTone(1046.50, 0.10, 'sine', 0.05, 0.09)
  },

  // ============ TETRIS SOUNDS ============

  // Piece drop - quick thud 200->80Hz
  'tetris-piece-drop': () => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.06)
  },

  // Piece rotate - tiny click at 1000Hz
  'tetris-piece-rotate': () => {
    playTone(1000, 0.02, 'square', 0.06)
  },

  // Line clear - satisfying sweep 1200->400Hz with harmonic
  'tetris-line-clear': () => {
    const ctx = getCtx()
    // Main sweep
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'square'
    osc1.frequency.setValueAtTime(1200, ctx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15)
    gain1.gain.setValueAtTime(0.1, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.16)
    // Second harmonic
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(2400, ctx.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15)
    gain2.gain.setValueAtTime(0.04, ctx.currentTime)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime)
    osc2.stop(ctx.currentTime + 0.16)
  },

  // Tetris clear - four-line clear special with ascending fanfare
  'tetris-tetris-clear': () => {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Four rapid line clear sweeps
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(1200, t + i * 0.05)
      osc.frequency.exponentialRampToValueAtTime(400, t + i * 0.05 + 0.12)
      gain.gain.setValueAtTime(0.08, t + i * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t + i * 0.05)
      osc.stop(t + i * 0.05 + 0.13)
    }
    // Ascending fanfare C5-E5-G5-C6
    const fanfare = [523.25, 659.25, 783.99, 1046.50]
    fanfare.forEach((freq, i) => {
      playTone(freq, 0.08, 'square', 0.09, 0.25 + i * 0.08)
    })
  },

  // Level up - ascending C major scale
  'tetris-level-up': () => {
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
    scale.forEach((freq, i) => {
      playTone(freq, 0.05, 'square', 0.07, i * 0.05)
    })
  },

  // High score - fast arpeggio + held chord
  'tetris-high-score': () => {
    const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]
    arpeggio.forEach((freq, i) => {
      playTone(freq, 0.04, 'square', 0.07, i * 0.04)
    })
    // Held chord
    playTone(523.25, 0.4, 'square', 0.06, 0.30)
    playTone(659.25, 0.4, 'square', 0.05, 0.30)
    playTone(783.99, 0.4, 'square', 0.05, 0.30)
  },

  // Soft drop - quick descending blip 600->400Hz
  'tetris-soft-drop': () => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03)
    gain.gain.setValueAtTime(0.07, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.04)
  },

  // Hold piece - two alternating tones
  'tetris-hold-piece': () => {
    playTone(800, 0.03, 'square', 0.07)
    playTone(1000, 0.03, 'square', 0.07, 0.03)
  },

  // Lock delay - low warning hum
  'tetris-lock-delay': () => {
    playTone(150, 0.08, 'square', 0.06)
  },

  // Points collect - ascending two-note 880->1200Hz
  'tetris-points-collect': () => {
    playTone(880, 0.03, 'square', 0.07)
    playTone(1200, 0.03, 'square', 0.07, 0.03)
  },

  // ============ ZELDA SOUNDS ============

  // Item get - THE iconic ascending 4-note jingle F4-A4-C5-F5
  'zelda-item-get': () => {
    const notes: [number, number, number][] = [
      [349.23, 0.12, 0], [440.00, 0.12, 0.1], [523.25, 0.12, 0.2], [698.46, 0.45, 0.3],
    ]
    for (const [freq, dur, start] of notes) {
      playTone(freq, dur, 'triangle', start === 0.3 ? 0.15 : 0.12, start)
    }
    // Subtle sine harmonic on final note
    playTone(698.46 * 2, 0.27, 'sine', 0.04, 0.3)
  },

  // Chest open - ascending chromatic run building anticipation
  'zelda-chest-open': () => {
    const notes = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23]
    notes.forEach((freq, i) => {
      playTone(freq, 0.06, 'sine', 0.04 + i * 0.02, i * 0.04)
    })
  },

  // Secret discovered - classic flourish B4-F5-B5-F5-B5-F6
  'zelda-secret-discovered': () => {
    const notes = [493.88, 698.46, 987.77, 698.46, 987.77, 1396.91]
    notes.forEach((freq, i) => {
      playTone(freq, 0.1, 'triangle', 0.1, i * 0.06)
    })
  },

  // Quest accepted - two warm tones G4->C5
  'zelda-quest-accepted': () => {
    playTone(392.00, 0.15, 'triangle', 0.1)
    playTone(523.25, 0.2, 'triangle', 0.12, 0.1)
  },

  // Sword slash - quick noise burst with pitch sweep
  'zelda-sword-slash': () => {
    const ctx = getCtx()
    // Main sweep
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(800, ctx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.06)
    gain1.gain.setValueAtTime(0.12, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.07)
    // Noise burst
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(600, ctx.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04)
    gain2.gain.setValueAtTime(0.06, ctx.currentTime)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime)
    osc2.stop(ctx.currentTime + 0.06)
  },

  // Dungeon clear - triumphant ascending fanfare with held chord
  'zelda-dungeon-clear': () => {
    const ascend = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]
    ascend.forEach((freq, i) => {
      playTone(freq, 0.12, 'triangle', 0.1, i * 0.08)
    })
    // Held chord
    const chordStart = ascend.length * 0.08
    playTone(523.25, 0.5, 'triangle', 0.1, chordStart)
    playTone(659.25, 0.5, 'triangle', 0.08, chordStart)
    playTone(783.99, 0.5, 'triangle', 0.08, chordStart)
  },

  // Heart collect - gentle ascending E5->A5
  'zelda-heart-collect': () => {
    playTone(659.25, 0.12, 'sine', 0.08)
    playTone(880.00, 0.15, 'sine', 0.08, 0.08)
  },

  // Fairy chime - tiny high sparkle
  'zelda-fairy-chime': () => {
    const freqs = [2200, 2800, 2400, 3000]
    freqs.forEach((freq, i) => {
      playTone(freq, 0.05, 'sine', 0.04, i * 0.04)
    })
  },

  // Rupee collect - quick bright blip with sparkle overtone
  'zelda-rupee-collect': () => {
    playTone(1500, 0.05, 'sine', 0.1)
    playTone(3000, 0.03, 'sine', 0.03)
  },

  // Door locked - low thud
  'zelda-door-locked': () => {
    playTone(100, 0.1, 'square', 0.1)
    playTone(80, 0.08, 'square', 0.06, 0.02)
  },

  // ============ ELDER SCROLLS SOUNDS ============

  // Quest accept - deep Dragonborn horn call C3+G3
  'es-quest-accept': () => {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Primary horn C3
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'triangle'
    osc1.frequency.value = 130.81
    gain1.gain.setValueAtTime(0, t)
    gain1.gain.linearRampToValueAtTime(0.1, t + 0.08)
    gain1.gain.setValueAtTime(0.09, t + 0.42)
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.7)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(t)
    osc1.stop(t + 0.71)
    // Harmonic fifth G3
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.value = 196.00
    gain2.gain.setValueAtTime(0, t + 0.03)
    gain2.gain.linearRampToValueAtTime(0.06, t + 0.13)
    gain2.gain.setValueAtTime(0.054, t + 0.39)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.63)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(t + 0.03)
    osc2.stop(t + 0.64)
    // Sub-bass
    playTone(65.41, 0.5, 'sine', 0.05)
  },

  // Skill unlock - constellation chime with vibrato + rising choir pad
  'es-skill-unlock': () => {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Chime with vibrato C6
    const chime = ctx.createOscillator()
    const chimeGain = ctx.createGain()
    const vibrato = ctx.createOscillator()
    const vibratoGain = ctx.createGain()
    chime.type = 'sine'
    chime.frequency.value = 1046.50
    vibrato.type = 'sine'
    vibrato.frequency.value = 6
    vibratoGain.gain.value = 10
    vibrato.connect(vibratoGain)
    vibratoGain.connect(chime.frequency)
    chimeGain.gain.setValueAtTime(0.06, t)
    chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    chime.connect(chimeGain)
    chimeGain.connect(ctx.destination)
    chime.start(t)
    vibrato.start(t)
    chime.stop(t + 0.35)
    vibrato.stop(t + 0.35)
    // Secondary chime G6
    playTone(1567.98, 0.25, 'sine', 0.03, 0.05)
    // Rising choir pad E4+G4+B4+E5
    const choirFreqs = [329.63, 392.00, 493.88, 659.25]
    choirFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq * (1 + (i * 0.003 - choirFreqs.length * 0.0015))
      gain.gain.setValueAtTime(0, t + 0.1)
      gain.gain.linearRampToValueAtTime(0.04, t + 0.25)
      gain.gain.setValueAtTime(0.04, t + 0.73)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t + 0.1)
      osc.stop(t + 1.01)
    })
  },

  // Level complete - Nordic chant Dm -> C major
  'es-level-complete': () => {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Dm chord voices
    const dm = [146.83, 174.61, 220.00, 293.66]
    dm.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq * (1 + (i * 0.003 - dm.length * 0.0015))
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.05, t + 0.1)
      gain.gain.setValueAtTime(0.05, t + 0.56)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.81)
    })
    // C major resolution
    const cmaj = [130.81, 164.81, 196.00, 261.63]
    cmaj.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq * (1 + (i * 0.003 - cmaj.length * 0.0015))
      gain.gain.setValueAtTime(0, t + 0.7)
      gain.gain.linearRampToValueAtTime(0.06, t + 0.82)
      gain.gain.setValueAtTime(0.06, t + 1.4)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.7)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t + 0.7)
      osc.stop(t + 1.71)
    })
    // Horn accent on D3 and C3
    playTone(146.83, 0.6, 'triangle', 0.07)
    playTone(130.81, 0.8, 'triangle', 0.08, 0.7)
  },

  // Node select - stone rune activation (percussive hit + resonant tail)
  'es-node-select': () => {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Percussive stone hit
    const noise = ctx.createOscillator()
    const noiseGain = ctx.createGain()
    noise.type = 'square'
    noise.frequency.setValueAtTime(80, t)
    noise.frequency.exponentialRampToValueAtTime(40, t + 0.04)
    noiseGain.gain.setValueAtTime(0.08, t)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04)
    noise.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(t)
    noise.stop(t + 0.05)
    // Resonant tone A4
    playTone(440.00, 0.2, 'triangle', 0.06, 0.01)
    // Sub-thud
    playTone(110.00, 0.08, 'sine', 0.04)
  },

  // Victory - epic Dragonborn fanfare (horn + choir + resolution)
  'es-victory': () => {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Phase 1: Horn call
    const horn1 = ctx.createOscillator()
    const horn1Gain = ctx.createGain()
    horn1.type = 'triangle'
    horn1.frequency.value = 130.81
    horn1Gain.gain.setValueAtTime(0, t)
    horn1Gain.gain.linearRampToValueAtTime(0.1, t + 0.04)
    horn1Gain.gain.setValueAtTime(0.09, t + 0.21)
    horn1Gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    horn1.connect(horn1Gain)
    horn1Gain.connect(ctx.destination)
    horn1.start(t)
    horn1.stop(t + 0.36)
    // Phase 2: Choir chord C4+E4+G4+C5
    const choirFreqs = [261.63, 329.63, 392.00, 523.25]
    choirFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq * (1 + (i * 0.003 - choirFreqs.length * 0.0015))
      gain.gain.setValueAtTime(0, t + 0.3)
      gain.gain.linearRampToValueAtTime(0.06, t + 0.4)
      gain.gain.setValueAtTime(0.06, t + 0.94)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t + 0.3)
      osc.stop(t + 1.21)
    })
    // Phase 3: Rising resolution E4+G#4+B4+E5
    const riseFreqs = [329.63, 415.30, 493.88, 659.25]
    riseFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq * (1 + (i * 0.003 - riseFreqs.length * 0.0015))
      gain.gain.setValueAtTime(0, t + 1.1)
      gain.gain.linearRampToValueAtTime(0.05, t + 1.22)
      gain.gain.setValueAtTime(0.05, t + 1.66)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.9)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t + 1.1)
      osc.stop(t + 1.91)
    })
    // Final sub-bass
    playTone(130.81, 0.9, 'triangle', 0.05, 1.1)
  },

  // UI click - parchment rustle (filtered noise burst)
  'es-ui-click': () => {
    const ctx = getCtx()
    const t = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'square'
    osc1.frequency.setValueAtTime(150, t)
    osc1.frequency.exponentialRampToValueAtTime(60, t + 0.03)
    gain1.gain.setValueAtTime(0.04, t)
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.035)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(t)
    osc1.stop(t + 0.04)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(400, t)
    osc2.frequency.exponentialRampToValueAtTime(200, t + 0.02)
    gain2.gain.setValueAtTime(0.02, t)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.025)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(t)
    osc2.stop(t + 0.03)
  },
}

export function playSound(name: SoundName): void {
  if (muted) return
  if (typeof window === 'undefined') return
  try {
    sounds[name]()
  } catch {
    // Audio context may not be ready yet
  }
}
