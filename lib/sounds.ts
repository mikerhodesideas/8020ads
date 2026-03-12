type SoundName = 'coin' | 'powerUp' | 'oneUp' | 'pipe' | 'blockHit' | 'fanfare' | 'blip' | 'whoosh' | 'thud' | 'bonk' | 'chime' | 'select' | 'retry'

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
