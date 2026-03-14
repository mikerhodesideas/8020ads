'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useGame, useSkin } from '@/components/game-provider'
import { playSound } from '@/lib/sounds'

const GLOSSARY: Record<string, string> = {
  skill: 'A specialized instruction set that focuses AI on a specific task',
  prompt: 'The instruction you give AI to guide its output',
  context: 'Background information that helps AI understand your situation',
  'power-up': 'A skill, but for the Arcade world',
}

export default function GlossaryTip({
  termId,
}: {
  termId: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { openGlossaryTerm } = useGame()
  const skin = useSkin()

  const handleClick = useCallback(() => {
    if (!open) {
      openGlossaryTerm(termId)
      if (skin.sounds.glossaryOpen) playSound(skin.sounds.glossaryOpen)
    }
    setOpen((prev) => !prev)
  }, [open, openGlossaryTerm, termId, skin.sounds.glossaryOpen])

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!skin.showGlossaryTips) return null

  const definition = GLOSSARY[termId]
  if (!definition) return null

  return (
    <span className="relative inline-flex items-center" ref={ref}>
      <button
        onClick={handleClick}
        className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full text-[9px] font-bold leading-none ml-1 transition-colors"
        style={{
          border: '1px solid rgba(255,255,255,0.4)',
          color: 'rgba(255,255,255,0.4)',
          background: 'transparent',
        }}
        aria-label={`What is ${termId}?`}
      >
        i
      </button>
      {open && (
        <span
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs font-heading text-white whitespace-normal w-52 quest-fade-in"
          style={{
            background: 'var(--mario-dark)',
            border: '2px solid var(--mario-coin)',
          }}
        >
          {definition}
        </span>
      )}
    </span>
  )
}
