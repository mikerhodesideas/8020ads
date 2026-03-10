'use client'

import { useState, useCallback, useEffect } from 'react'
import PathChooser from '@/components/path-chooser'
import ProblemGrid from '@/components/problem-grid'
import ProblemDetail from '@/components/problem-detail'
import SSTSlide from '@/components/sst-slide'
import { problems, type Path, type Problem } from '@/lib/problems'

type View = 'chooser' | 'grid' | 'detail' | 'sst'

export default function Home() {
  const [view, setView] = useState<View>('chooser')
  const [path, setPath] = useState<Path>('agency')
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  const choosePath = useCallback((p: Path) => {
    setPath(p)
    setView('grid')
  }, [])

  const selectProblem = useCallback((problem: Problem) => {
    setCurrentProblem(problem)
    setView('detail')
  }, [])

  const backToGrid = useCallback(() => {
    if (currentProblem) {
      setCompleted((prev) => new Set(prev).add(currentProblem.id))
    }
    setCurrentProblem(null)
    setView('grid')
  }, [currentProblem])

  const showSST = useCallback(() => setView('sst'), [])
  const backToChooser = useCallback(() => setView('chooser'), [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view === 'detail' || view === 'sst') backToGrid()
        else if (view === 'grid') backToChooser()
      }
      if (e.key === 'ArrowLeft') {
        if (view === 'detail' || view === 'sst') backToGrid()
        else if (view === 'grid') backToChooser()
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (view === 'detail') {
          e.preventDefault()
          backToGrid()
        }
      }
      if (e.key === 'h' || e.key === 'H') {
        if (view !== 'chooser') {
          setView('grid')
        }
      }
      // Quick path keys on chooser
      if (view === 'chooser') {
        if (e.key === 'a' || e.key === 'A') choosePath('agency')
        if (e.key === 'b' || e.key === 'B') choosePath('business')
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [view, backToGrid, backToChooser, choosePath])

  return (
    <main className="min-h-screen">
      {view === 'chooser' && <PathChooser onChoose={choosePath} />}
      {view === 'grid' && (
        <ProblemGrid
          problems={problems}
          path={path}
          completed={completed}
          onSelect={selectProblem}
          onShowSST={showSST}
        />
      )}
      {view === 'detail' && currentProblem && (
        <ProblemDetail problem={currentProblem} onBack={backToGrid} />
      )}
      {view === 'sst' && <SSTSlide onBack={backToGrid} />}

      {/* Version footer */}
      <div className="fixed bottom-2 right-3 text-[10px] text-[var(--color-faint)] opacity-50">
        v{process.env.NEXT_PUBLIC_VERSION}
      </div>
    </main>
  )
}
