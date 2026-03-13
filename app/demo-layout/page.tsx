'use client'

import { useState, useEffect, Fragment } from 'react'
import { cn } from '@/lib/utils'
import TetrisBackground from './tetris-bg'
import GalleryBackground from './gallery-bg'

type WorldSkin = 'mario' | 'tetris' | 'gallery'

const skinDisplayNames: Record<WorldSkin, string> = {
  mario: 'Super Mario',
  tetris: 'Tetris',
  gallery: 'Gallery',
}

const skins: Record<WorldSkin, {
  bg: string; accent: string; accentHex: string; text: string; muted: string;
  levelBg: string; cardBorder: string; lockedBg: string;
  progressBg: string; progressFill: string; glowClass: string;
}> = {
  mario: {
    bg: 'bg-transparent',
    accent: 'text-[#E8A000]',
    accentHex: '#E8A000',
    text: 'text-white',
    muted: 'text-white/80',
    levelBg: 'bg-[#1a1a2ed9]',
    cardBorder: 'border-[#E8A000]/25',
    lockedBg: 'bg-[#1a1a2e80]',
    progressBg: 'bg-white/20',
    progressFill: 'bg-[#E8A000]',
    glowClass: 'shadow-[0_0_24px_rgba(232,160,0,0.3)]',
  },
  tetris: {
    bg: 'bg-[#0a0a14]',
    accent: 'text-cyan-400',
    accentHex: '#22d3ee',
    text: 'text-white',
    muted: 'text-white/70',
    levelBg: 'bg-[#111125]',
    cardBorder: 'border-cyan-400/20',
    lockedBg: 'bg-[#08080f]',
    progressBg: 'bg-white/10',
    progressFill: 'bg-cyan-400',
    glowClass: 'shadow-[0_0_20px_rgba(34,211,238,0.15)]',
  },
  gallery: {
    bg: 'bg-[#f5f0e8]',
    accent: 'text-[#D64C00]',
    accentHex: '#D64C00',
    text: 'text-[#1a1a1a]',
    muted: 'text-[#777]',
    levelBg: 'bg-white',
    cardBorder: 'border-[#D64C00]/15',
    lockedBg: 'bg-[#eee8dd]',
    progressBg: 'bg-[#e0d8cc]',
    progressFill: 'bg-[#D64C00]',
    glowClass: 'shadow-lg',
  },
}

const skinLevelNames: Record<WorldSkin, string[]> = {
  mario: ['World 1', 'World 2', 'World 3'],
  tetris: ['Level 1', 'Level 5', 'Level 10'],
  gallery: ['Getting Started', 'Going Deeper', 'Advanced'],
}

const levelSubtitles = [
  'Zero setup. Instant results.',
  'More complex problems. Bigger payoffs.',
  'Real data. Real stakes. Real impact.',
]

const levels = [
  {
    id: 1,
    quests: [
      { id: 1, icon: '\u{1F480}', title: 'My website is embarrassing', pain: "Every day it stays live, you're losing deals", skill: 'Website Designer' },
      { id: 2, icon: '\u{1F525}', title: '2,000 search terms untouched', pain: "The wasted spend is in there somewhere", skill: 'Data Analyst' },
      { id: 4, icon: '\u{1F4E8}', title: '50 emails by 9am Monday', pain: "A client escalation is buried in there", skill: 'Email Strategist' },
    ],
  },
  {
    id: 2,
    quests: [
      { id: 5, icon: '\u{1F4C7}', title: 'CRM contacts going cold', pain: "Deals are dying quietly in your spreadsheet", skill: 'CRM Strategist' },
      { id: 6, icon: '\u{1F4CA}', title: 'Marketing spend across 4 channels', pain: "You can't tell which channel actually works", skill: 'Channel Optimizer' },
      { id: 8, icon: '\u{270D}\u{FE0F}', title: 'Meeting notes collecting dust', pain: "Great insights from the call. Zero posts written.", skill: 'Content Writer' },
    ],
  },
  {
    id: 3,
    quests: [
      { id: 9, icon: '\u{1F50D}', title: 'Competitors eating your lunch', pain: "They updated their sites. You haven't checked.", skill: 'Competitive Intel' },
      { id: 10, icon: '\u{1F4CB}', title: 'Onboarding is a 3-week mess', pain: "The process lives in someone's head", skill: 'SOP Builder' },
      { id: 11, icon: '\u{1F6E1}\u{FE0F}', title: 'Newsletter has a hidden payload', pain: "Looks normal. Something is hiding in there.", skill: 'Security Scanner' },
    ],
  },
]

/* ─── Background Components ─── */

function MarioCloud({ x, y, scale, className }: { x: string; y: string; scale: number; className?: string }) {
  return (
    <svg
      className={cn('absolute pointer-events-none', className)}
      style={{ left: x, top: y, width: `${scale * 120}px` }}
      viewBox="0 0 120 55"
    >
      <ellipse cx="35" cy="40" rx="28" ry="15" fill="white" opacity="0.9" />
      <ellipse cx="70" cy="38" rx="32" ry="18" fill="white" opacity="0.95" />
      <ellipse cx="52" cy="26" rx="22" ry="14" fill="white" />
      <ellipse cx="85" cy="42" rx="18" ry="12" fill="white" opacity="0.85" />
    </svg>
  )
}

function MarioHill({ x, w, h, opacity }: { x: string; w: number; h: number; opacity: number }) {
  return (
    <svg
      className="absolute pointer-events-none"
      style={{ left: x, bottom: '60px', width: `${w}px`, height: `${h}px` }}
      viewBox={`0 0 ${w} ${h}`}
    >
      <ellipse cx={w / 2} cy={h} rx={w / 2} ry={h * 0.85} fill="#00A800" opacity={opacity} />
      <ellipse cx={w / 2} cy={h} rx={w * 0.35} ry={h * 0.6} fill="#00C800" opacity={opacity * 0.5} />
    </svg>
  )
}

function MarioQuestionBlock({ x, y }: { x: string; y: string }) {
  return (
    <svg
      className="absolute pointer-events-none qblock-bob"
      style={{ left: x, top: y, width: '32px', height: '32px' }}
      viewBox="0 0 32 32"
    >
      <rect x="1" y="1" width="30" height="30" rx="2" fill="#E8A000" stroke="#C88000" strokeWidth="1.5" />
      <rect x="3" y="3" width="26" height="4" rx="1" fill="#FFD700" opacity="0.5" />
      <text x="16" y="22" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#C84C0C" fontFamily="monospace">?</text>
    </svg>
  )
}

function MarioPipe() {
  return (
    <div className="flex justify-center py-1">
      <svg width="44" height="44" viewBox="0 0 44 44" className="opacity-80">
        <rect x="5" y="2" width="34" height="12" rx="2" fill="#00B800" />
        <rect x="5" y="2" width="34" height="4" rx="2" fill="#4CE44C" opacity="0.6" />
        <rect x="9" y="14" width="26" height="28" fill="#00A800" />
        <rect x="9" y="14" width="3" height="28" fill="#008800" opacity="0.4" />
        <rect x="32" y="14" width="3" height="28" fill="#008800" opacity="0.4" />
      </svg>
    </div>
  )
}

function MarioBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#5C94FC' }}>
      {/* Sky gradient - slightly lighter at top */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #6BA4FF 0%, #5C94FC 30%, #4C84EC 100%)'
      }} />

      {/* Clouds at different depths */}
      <MarioCloud x="3%" y="6%" scale={1.2} className="cloud-float" />
      <MarioCloud x="55%" y="12%" scale={0.9} className="cloud-float-mid" />
      <MarioCloud x="30%" y="4%" scale={0.7} className="cloud-float-far" />
      <MarioCloud x="78%" y="18%" scale={1.0} className="cloud-float" />
      <MarioCloud x="15%" y="22%" scale={0.6} className="cloud-float-far" />

      {/* Question blocks floating in the sky */}
      <MarioQuestionBlock x="88%" y="15%" />
      <MarioQuestionBlock x="8%" y="35%" />

      {/* Hills */}
      <MarioHill x="-2%" w={280} h={120} opacity={0.7} />
      <MarioHill x="60%" w={200} h={90} opacity={0.55} />
      <MarioHill x="35%" w={140} h={70} opacity={0.4} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[60px]" style={{ backgroundColor: '#C84C0C' }}>
        <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ backgroundColor: '#E8A000' }} />
        <div className="absolute inset-0 mt-[5px]" style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(0,0,0,0.12) 31px, rgba(0,0,0,0.12) 33px),
            repeating-linear-gradient(0deg, transparent, transparent 26px, rgba(0,0,0,0.12) 26px, rgba(0,0,0,0.12) 28px)
          `
        }} />
      </div>
    </div>
  )
}

/* ─── UI Components ─── */

function ProgressBar({ current, total, skin }: { current: number; total: number; skin: typeof skins.mario }) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div className={cn('h-2 w-full rounded-full overflow-hidden', skin.progressBg)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700 ease-out', skin.progressFill)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* ─── Page ─── */

export default function DemoLayoutPage() {
  const [skin, setSkin] = useState<WorldSkin>('mario')
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [justCompleted, setJustCompleted] = useState<number | null>(null)
  const s = skins[skin]

  useEffect(() => {
    if (justCompleted !== null) {
      const t = setTimeout(() => setJustCompleted(null), 600)
      return () => clearTimeout(t)
    }
  }, [justCompleted])

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true
    const prevLevel = levels.find((l) => l.id === levelId - 1)
    if (!prevLevel) return false
    return prevLevel.quests.every((q) => completed.has(q.id))
  }

  const toggleComplete = (id: number) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else { next.add(id); setJustCompleted(id) }
      return next
    })
  }

  const totalComplete = completed.size

  return (
    <div className={cn('min-h-screen relative transition-colors duration-500', s.bg)}>
      {/* Themed backgrounds */}
      {skin === 'mario' && <MarioBackground />}
      {skin === 'tetris' && <TetrisBackground />}
      {skin === 'gallery' && <GalleryBackground />}

      {/* Content layer */}
      <div className="relative z-10">
        {/* Skin switcher */}
        <div className="sticky top-0 z-50 flex items-center justify-center gap-2 py-3 bg-black/30 backdrop-blur-sm">
          <span className="text-xs text-white/50 font-heading mr-2">Skin:</span>
          {(['mario', 'tetris', 'gallery'] as WorldSkin[]).map((sk) => (
            <button
              key={sk}
              onClick={() => setSkin(sk)}
              className={cn(
                'px-3 py-1 text-xs font-heading font-bold rounded-[2px] transition-all',
                skin === sk ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'
              )}
            >
              {skinDisplayNames[sk]}
            </button>
          ))}
          <span className="text-[10px] text-white/40 ml-3">(click quests to simulate)</span>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

          {/* Top HUD */}
          <div className={cn(
            'flex items-center justify-between mb-8 px-5 py-4 rounded-[2px]',
            skin === 'mario' && 'bg-[#1a1a2ed9] backdrop-blur-sm border border-[#E8A000]/15'
          )}>
            <div>
              <h1 className={cn('text-2xl sm:text-3xl font-extrabold font-heading tracking-tight', s.text)}>
                Quest Select
              </h1>
              <p className={cn('text-sm mt-1', s.muted)}>
                Complete all quests in a level to unlock the next
              </p>
            </div>
            <div className="text-right">
              <div className={cn('text-3xl sm:text-4xl font-extrabold font-heading tabular-nums', s.accent)}>
                {totalComplete}/9
              </div>
              <p className={cn('text-xs font-heading uppercase tracking-wider', s.muted)}>Quests cleared</p>
            </div>
          </div>

          {/* Overall progress */}
          <div className={cn(
            'mb-10',
            skin === 'mario' && 'px-2'
          )}>
            <ProgressBar current={totalComplete} total={9} skin={s} />
          </div>

          {/* Levels - vertical flow */}
          <div className={cn('flex flex-col', skin === 'mario' ? 'gap-6' : 'gap-4')}>
            {levels.map((level, levelIdx) => {
              const unlocked = isLevelUnlocked(level.id)
              const levelComplete = level.quests.every((q) => completed.has(q.id))
              const questsComplete = level.quests.filter((q) => completed.has(q.id)).length
              const levelName = skinLevelNames[skin][levelIdx]

              return (
                <Fragment key={level.id}>
                  {/* Decorative pipe between levels (mario only) */}
                  {skin === 'mario' && levelIdx > 0 && <MarioPipe />}

                  {/* Locked level - compact row */}
                  {!unlocked && (
                    <div
                      className={cn(
                        'flex items-center gap-3 px-5 py-3 border rounded-[2px] opacity-50',
                        skin === 'mario' ? 'bg-[#1a1a2e80] backdrop-blur-sm border-white/10'
                          : skin === 'gallery' ? 'border-[#ddd]'
                          : 'border-white/5',
                        skin !== 'mario' && s.lockedBg
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 flex items-center justify-center font-heading font-extrabold text-sm',
                        skin === 'gallery' ? 'bg-[#e0d8cc] text-[#999]' : 'bg-white/5 text-white/20'
                      )}>
                        {level.id}
                      </div>
                      <div className="flex-1">
                        <span className={cn('text-base font-bold font-heading', s.muted)}>{levelName}</span>
                        <span className={cn('text-sm ml-2', s.muted)}>{'\u00B7'} 3 quests</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.muted}>
                        <rect x="3" y="11" width="18" height="11" rx="1" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  )}

                  {/* Unlocked level with quests */}
                  {unlocked && (
                    <div
                      className={cn(
                        'border rounded-[2px] overflow-hidden transition-all duration-500',
                        s.cardBorder, s.levelBg,
                        skin === 'mario' && 'backdrop-blur-sm',
                        levelComplete && s.glowClass
                      )}
                    >
                      {/* Level header */}
                      <div className={cn('flex items-center gap-4 px-5 py-4 border-b', s.cardBorder)}>
                        <div
                          className={cn(
                            'w-10 h-10 flex items-center justify-center font-heading font-extrabold text-base',
                            'transition-all duration-300',
                            levelComplete ? 'bg-green-500 text-white' : 'text-white'
                          )}
                          style={!levelComplete ? { backgroundColor: s.accentHex } : undefined}
                        >
                          {levelComplete ? '\u2713' : level.id}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-3">
                            <h2 className={cn('text-lg sm:text-xl font-bold font-heading', s.text)}>
                              {levelName}
                            </h2>
                            <span className={cn('text-sm font-heading font-bold', s.accent)}>
                              {questsComplete}/3
                            </span>
                          </div>
                          <p className={cn('text-sm leading-snug', s.muted)}>{levelSubtitles[levelIdx]}</p>
                        </div>

                        <div className="hidden sm:block w-24">
                          <ProgressBar current={questsComplete} total={3} skin={s} />
                        </div>
                      </div>

                      {/* Quests */}
                      <div className="flex flex-col gap-1.5 p-1.5">
                        {level.quests.map((quest) => {
                          const done = completed.has(quest.id)
                          const justDone = justCompleted === quest.id

                          return (
                            <button
                              key={quest.id}
                              onClick={() => toggleComplete(quest.id)}
                              className={cn(
                                'w-full text-left flex items-center gap-4 sm:gap-5 px-4 py-3.5 rounded-[2px]',
                                'transition-all duration-300 relative overflow-hidden group cursor-pointer',
                                skin === 'gallery' ? 'bg-black/[0.03] hover:bg-black/[0.06]' : 'bg-white/[0.03] hover:bg-white/[0.06]',
                                justDone && 'quest-flash'
                              )}
                            >
                              {/* Flash overlay */}
                              {justDone && (
                                <div
                                  className="absolute inset-0 animate-pulse"
                                  style={{ backgroundColor: s.accentHex, opacity: 0.08 }}
                                />
                              )}

                              {/* Icon */}
                              <div className={cn(
                                'text-3xl sm:text-4xl flex-shrink-0 transition-transform duration-300',
                                done ? 'grayscale-0' : 'grayscale-[30%]',
                                'group-hover:scale-110'
                              )}>
                                {quest.icon}
                              </div>

                              {/* Title + pain */}
                              <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                  'text-base sm:text-lg font-bold font-heading leading-snug',
                                  done
                                    ? skin === 'gallery' ? 'text-[#aaa] line-through decoration-[#ccc]' : 'text-white/40 line-through decoration-white/20'
                                    : s.text
                                )}>
                                  {quest.title}
                                </h3>
                                <p className={cn(
                                  'text-sm leading-relaxed mt-0.5',
                                  done
                                    ? skin === 'gallery' ? 'text-[#bbb]' : 'text-white/25'
                                    : s.muted
                                )}>
                                  {quest.pain}
                                </p>
                              </div>

                              {/* Skill badge */}
                              <div className="flex-shrink-0">
                                <div className={cn(
                                  'inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-heading font-bold uppercase tracking-wider',
                                  'border rounded-[2px] transition-colors whitespace-nowrap',
                                  done
                                    ? 'border-green-500/30 text-green-400'
                                    : cn(s.cardBorder, s.accent, 'opacity-70')
                                )}>
                                  {done && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                  {quest.skill}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>

          {/* Bottom stats */}
          <div className={cn(
            'mt-10 flex items-center justify-center gap-8 py-4 border-t',
            skin === 'mario' ? 'border-white/15' : skin === 'gallery' ? 'border-[#ddd]' : 'border-white/10'
          )}>
            <div className="text-center">
              <div className={cn('text-xl font-extrabold font-heading tabular-nums', s.accent)}>
                {totalComplete}/9
              </div>
              <p className={cn('text-xs font-heading uppercase tracking-wider', s.muted)}>Quests</p>
            </div>
            <div className="text-center">
              <div className={cn('text-xl font-extrabold font-heading tabular-nums', s.accent)}>
                {totalComplete}/9
              </div>
              <p className={cn('text-xs font-heading uppercase tracking-wider', s.muted)}>Skills</p>
            </div>
            <div className="text-center">
              <div className={cn('text-xl font-extrabold font-heading tabular-nums', s.accent)}>
                {levels.filter((l) => l.quests.every((q) => completed.has(q.id))).length}/3
              </div>
              <p className={cn('text-xs font-heading uppercase tracking-wider', s.muted)}>Levels</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
