'use client'

import { useState } from 'react'
import { useGame } from '@/components/game-provider'
import type { PlayerType, WorldId } from '@/lib/game-data'

const AVATARS: { id: PlayerType; label: string }[] = [
  { id: 'freelancer', label: 'Free' },
  { id: 'agency', label: 'Agency' },
  { id: 'employee', label: 'Emp' },
  { id: 'business', label: 'Biz' },
]

const WORLDS: { id: WorldId; label: string }[] = [
  { id: 'clair-obscur', label: 'Clair' },
  { id: 'arcade', label: 'Mario' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'red-alert', label: 'RedAlert' },
  { id: 'tetris', label: 'Tetris' },
  { id: 'zelda', label: 'Zelda' },
  { id: 'elder-scrolls', label: 'Elder' },
]

const LEVEL_PRESETS = [
  { label: 'L0', desc: 'Nothing done', completed: [] as number[], skills: [] as string[] },
  { label: 'L1 mid', desc: '1 of 3 done', completed: [1], skills: [] },
  { label: 'L1 done', desc: 'Level 1 clear', completed: [1, 2, 3], skills: [] },
  { label: 'L2 mid', desc: 'L1 + 1 of L2', completed: [1, 2, 3, 4], skills: ['content-repurposer'] },
  { label: 'L2 done', desc: 'Level 2 clear', completed: [1, 2, 3, 4, 5, 6, 10], skills: ['content-repurposer', 'meeting-intelligence', 'csv-analyzer', 'search-term-analyzer'] },
  { label: 'L3 mid', desc: 'L2 + 1 of L3', completed: [1, 2, 3, 4, 5, 6, 10, 7], skills: ['content-repurposer', 'meeting-intelligence', 'csv-analyzer', 'search-term-analyzer'] },
  { label: 'All', desc: 'Everything done', completed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], skills: ['content-repurposer', 'meeting-intelligence', 'csv-analyzer', 'search-term-analyzer'] },
]

export default function DevBar() {
  const { type, world, completed, setType, setWorld } = useGame()
  const [collapsed, setCollapsed] = useState(false)

  // Apply a level preset by writing directly to localStorage and reloading
  const applyPreset = (preset: typeof LEVEL_PRESETS[0]) => {
    const raw = localStorage.getItem('cowork-game')
    const state = raw ? JSON.parse(raw) : {}
    state.completed = preset.completed
    state.skills = preset.skills
    // Generate some choice scores for completed demos
    const scores: Record<number, number> = {}
    preset.completed.forEach((id) => { scores[id] = Math.ceil(Math.random() * 3) })
    state.choiceScores = scores
    state.totalTimeSaved = preset.completed.length * 0.5
    localStorage.setItem('cowork-game', JSON.stringify(state))
    window.location.reload()
  }

  const switchWorld = (w: WorldId) => {
    setWorld(w)
    // Force reload to pick up new skin
    const raw = localStorage.getItem('cowork-game')
    const state = raw ? JSON.parse(raw) : {}
    state.world = w
    localStorage.setItem('cowork-game', JSON.stringify(state))
    window.location.reload()
  }

  const switchAvatar = (t: PlayerType) => {
    setType(t)
    const raw = localStorage.getItem('cowork-game')
    const state = raw ? JSON.parse(raw) : {}
    state.type = t
    localStorage.setItem('cowork-game', JSON.stringify(state))
    window.location.reload()
  }

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-2 left-2 z-[9999] w-8 h-8 flex items-center justify-center text-xs font-bold rounded-sm"
        style={{ background: '#222', color: '#0f0', border: '1px solid #444' }}
        title="Open dev bar"
      >
        D
      </button>
    )
  }

  const btnBase = 'px-2 py-1 text-[10px] font-bold border transition-colors'
  const btnActive = 'bg-[#0f0] text-black border-[#0f0]'
  const btnInactive = 'bg-[#333] text-[#aaa] border-[#555] hover:bg-[#444] hover:text-white'

  return (
    <div
      className="fixed bottom-0 left-0 z-[9999] p-2 flex flex-col gap-1.5 max-w-[420px]"
      style={{
        background: 'rgba(17, 17, 17, 0.95)',
        borderTop: '1px solid #333',
        borderRight: '1px solid #333',
        backdropFilter: 'blur(8px)',
        fontFamily: 'ui-monospace, monospace',
        fontSize: '10px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-0.5">
        <span className="text-[#0f0] font-bold text-[11px]">DEV</span>
        <span className="text-[#666] text-[9px]">
          {type || '?'} / {world || '?'} / {completed.size} done
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-[#666] hover:text-white text-xs leading-none"
        >
          x
        </button>
      </div>

      {/* Avatar row */}
      <div className="flex items-center gap-1">
        <span className="text-[#666] w-10 shrink-0">Avatar</span>
        <div className="flex gap-1 flex-wrap">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              onClick={() => switchAvatar(a.id)}
              className={`${btnBase} ${type === a.id ? btnActive : btnInactive}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* World row */}
      <div className="flex items-center gap-1">
        <span className="text-[#666] w-10 shrink-0">World</span>
        <div className="flex gap-1 flex-wrap">
          {WORLDS.map((w) => (
            <button
              key={w.id}
              onClick={() => switchWorld(w.id)}
              className={`${btnBase} ${world === w.id ? btnActive : btnInactive}`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Level preset row */}
      <div className="flex items-center gap-1">
        <span className="text-[#666] w-10 shrink-0">Level</span>
        <div className="flex gap-1 flex-wrap">
          {LEVEL_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className={`${btnBase} ${btnInactive}`}
              title={p.desc}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
