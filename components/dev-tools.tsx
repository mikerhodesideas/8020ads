'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useGame, useSkin } from './game-provider'
import { LevelTransition } from './level-transition'
import type { PlayerType, WorldId } from '@/lib/game-data'

const WORLDS: { id: WorldId; label: string }[] = [
  { id: 'gallery', label: 'Classic' },
  { id: 'arcade', label: 'Mario' },
  { id: 'red-alert', label: 'Red Alert' },
  { id: 'clair-obscur', label: 'Clair Obs' },
  { id: 'tetris', label: 'Tetris' },
  { id: 'zelda', label: 'Zelda' },
  { id: 'elder-scrolls', label: 'Elder S' },
]

const AVATARS: { id: PlayerType; label: string }[] = [
  { id: 'agency', label: 'Agency' },
  { id: 'employee', label: 'Employee' },
  { id: 'freelancer', label: 'Freelancer' },
  { id: 'business', label: 'Business' },
]

const DEMOS = [
  { id: 1, level: 1, label: 'Website' },
  { id: 2, level: 1, label: 'Email' },
  { id: 3, level: 1, label: 'Data' },
  { id: 4, level: 2, label: 'Content' },
  { id: 5, level: 2, label: 'Meeting' },
  { id: 6, level: 2, label: 'Search' },
  { id: 10, level: 2, label: 'CSV' },
  { id: 7, level: 3, label: 'Connect' },
  { id: 8, level: 3, label: 'Web v2' },
  { id: 9, level: 3, label: 'Security' },
]

const PAGES = [
  { path: '/', label: 'Home' },
  { path: '/world', label: 'Worlds' },
  { path: '/play', label: 'Map' },
  { path: '/victory', label: 'Victory' },
  { path: '/how-it-works', label: 'How' },
  { path: '/course', label: 'Course' },
]

export default function DevTools() {
  const [open, setOpen] = useState(false)
  const [showTransition, setShowTransition] = useState<number | null>(null)
  const { type, world, completed, setType, setWorld, toggleComplete, resetGame, markComplete, isLevelComplete } = useGame()
  const skin = useSkin()
  const router = useRouter()
  const pathname = usePathname()

  if (process.env.NODE_ENV !== 'development') return null

  const allLevelIds = [1, 2, 3]
  const levelDemos: Record<number, number[]> = {
    1: [1, 2, 3],
    2: [4, 5, 6, 10],
    3: [7, 8, 9],
  }

  function completeLevel(level: number) {
    levelDemos[level].forEach(id => {
      if (!completed.has(id)) markComplete(id)
    })
  }

  function uncompleteLevel(level: number) {
    levelDemos[level].forEach(id => {
      if (completed.has(id)) toggleComplete(id)
    })
  }

  return (
    <>
      {showTransition !== null && (
        <LevelTransition
          fromLevel={showTransition}
          onContinue={() => setShowTransition(null)}
          skin={skin}
        />
      )}

      <div style={{
        position: 'fixed',
        bottom: 12,
        left: 12,
        zIndex: 9998,
        fontFamily: 'system-ui, sans-serif',
        fontSize: 12,
      }}>
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            style={{
              background: '#1a1a2e',
              color: '#e94560',
              border: '1px solid #e94560',
              borderRadius: 2,
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 600,
              opacity: 0.7,
            }}
          >
            DEV
          </button>
        ) : (
          <div style={{
            background: '#1a1a2e',
            border: '1px solid #e94560',
            borderRadius: 2,
            padding: 10,
            color: '#eee',
            width: 300,
            maxHeight: '85vh',
            overflowY: 'auto',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#e94560', fontWeight: 700, fontSize: 12 }}>DEV TOOLS</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>x</button>
            </div>

            {/* Status bar */}
            <div style={{ marginBottom: 8, color: '#888', fontSize: 10, lineHeight: 1.4 }}>
              {type || '-'} / {world || '-'} / {completed.size}/10 done / {pathname}
            </div>

            {/* Pages */}
            <Section title="Navigate">
              <Row>
                {PAGES.map(p => (
                  <Btn key={p.path} label={p.label} active={pathname === p.path} onClick={() => router.push(p.path)} />
                ))}
              </Row>
            </Section>

            {/* Avatar + World on same row */}
            <Section title="Avatar">
              <Row>
                {AVATARS.map(a => (
                  <Btn key={a.id} label={a.label} active={type === a.id} onClick={() => setType(a.id)} />
                ))}
              </Row>
            </Section>

            <Section title="World">
              <Row>
                {WORLDS.map(w => (
                  <Btn key={w.id} label={w.label} active={world === w.id} onClick={() => setWorld(w.id)} />
                ))}
              </Row>
            </Section>

            {/* Level Transitions */}
            <Section title="Level Transitions">
              <Row>
                <Btn label="L1 -> L2" onClick={() => setShowTransition(1)} />
                <Btn label="L2 -> L3" onClick={() => setShowTransition(2)} />
              </Row>
            </Section>

            {/* Demos with toggle */}
            <Section title="Demos (click name=go, check=toggle done)">
              {allLevelIds.map(level => (
                <div key={level} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: '#888' }}>
                      Level {level} {isLevelComplete(level) ? '(complete)' : ''}
                    </span>
                    <Btn label="All on" onClick={() => completeLevel(level)} small />
                    <Btn label="All off" onClick={() => uncompleteLevel(level)} small />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {DEMOS.filter(d => d.level === level).map(d => (
                      <DemoBtn
                        key={d.id}
                        id={d.id}
                        label={d.label}
                        done={completed.has(d.id)}
                        active={pathname === `/play/${d.id}`}
                        onNavigate={() => router.push(`/play/${d.id}`)}
                        onToggle={() => toggleComplete(d.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </Section>

            {/* Quick Actions */}
            <Section title="Actions">
              <Row>
                <Btn label="Complete All" onClick={() => DEMOS.forEach(d => { if (!completed.has(d.id)) markComplete(d.id) })} />
                <Btn label="Clear All" onClick={() => DEMOS.forEach(d => { if (completed.has(d.id)) toggleComplete(d.id) })} />
                <Btn label="Reset Game" onClick={() => { resetGame(); router.push('/'); }} danger />
              </Row>
            </Section>
          </div>
        )}
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: '#e94560', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.8 }}>{title}</div>
      {children}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>{children}</div>
}

function Btn({ label, active, done, danger, small, onClick }: {
  label: string
  active?: boolean
  done?: boolean
  danger?: boolean
  small?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? '1px 5px' : '2px 6px',
        fontSize: small ? 9 : 10,
        border: `1px solid ${danger ? '#ff4444' : active ? '#e94560' : '#444'}`,
        borderRadius: 2,
        background: active ? '#e94560' : danger ? 'transparent' : done ? '#1e3a2e' : 'transparent',
        color: active ? '#fff' : danger ? '#ff4444' : done ? '#4ade80' : '#ccc',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

function DemoBtn({ id, label, done, active, onNavigate, onToggle }: {
  id: number
  label: string
  done: boolean
  active: boolean
  onNavigate: () => void
  onToggle: () => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1px solid ${active ? '#e94560' : '#444'}`, borderRadius: 2 }}>
      <button
        onClick={onToggle}
        title={done ? 'Mark incomplete' : 'Mark complete'}
        style={{
          padding: '2px 4px',
          fontSize: 10,
          background: done ? '#1e3a2e' : 'transparent',
          color: done ? '#4ade80' : '#666',
          border: 'none',
          borderRight: `1px solid ${active ? '#e94560' : '#333'}`,
          cursor: 'pointer',
        }}
      >
        {done ? '\u2713' : '\u2717'}
      </button>
      <button
        onClick={onNavigate}
        style={{
          padding: '2px 5px',
          fontSize: 10,
          background: active ? '#e94560' : 'transparent',
          color: active ? '#fff' : done ? '#4ade80' : '#ccc',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {id}:{label}
      </button>
    </div>
  )
}
