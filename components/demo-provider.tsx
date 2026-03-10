'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface DemoContextType {
  completed: Set<number>
  markComplete: (id: number) => void
}

const DemoContext = createContext<DemoContextType>({
  completed: new Set(),
  markComplete: () => {},
})

export function DemoProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  const markComplete = useCallback((id: number) => {
    setCompleted((prev) => new Set(prev).add(id))
  }, [])

  return (
    <DemoContext.Provider value={{ completed, markComplete }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  return useContext(DemoContext)
}
