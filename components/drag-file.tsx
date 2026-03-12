'use client'

import { useCallback } from 'react'
import { useGame } from '@/components/game-provider'
import { cn } from '@/lib/utils'

interface DragFileProps {
  file: { name: string; path: string; mime: string }
}

export default function DragFile({ file }: DragFileProps) {
  const { world } = useGame()
  const isArcade = world === 'arcade'

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      const fullUrl = `${window.location.origin}${file.path}`
      e.dataTransfer.setData(
        'DownloadURL',
        `${file.mime}:${file.name}:${fullUrl}`
      )
      e.dataTransfer.setData('text/plain', file.path)
      e.dataTransfer.effectAllowed = 'copy'
    },
    [file]
  )

  const handleDownload = useCallback(() => {
    const link = document.createElement('a')
    link.href = file.path
    link.download = file.name
    link.click()
  }, [file])

  return (
    <div className="space-y-3">
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={handleDownload}
        className={cn(
          'flex items-center gap-4 px-6 py-5 border-2 border-dashed rounded-[2px] cursor-grab active:cursor-grabbing active:scale-[0.98] transition-transform select-none',
          isArcade
            ? 'border-[var(--mario-coin)] hover:bg-white/5'
            : 'border-[var(--color-brand-orange)] bg-[var(--color-brand-orange-faint)] hover:bg-[#fff8f3]'
        )}
        style={isArcade ? { background: 'rgba(255,215,0,0.08)' } : undefined}
      >
        <span className={cn('text-2xl shrink-0', isArcade ? '' : 'text-[var(--color-brand-orange)]')}>
          &#128196;
        </span>
        <span className={cn(
          'text-base font-medium truncate font-heading',
          isArcade ? 'text-white' : 'text-[var(--color-ink)]'
        )}>
          {file.name}
        </span>
        <span className={cn(
          'ml-auto text-sm font-heading font-bold shrink-0 px-4 py-2 rounded-[2px]',
          isArcade ? 'text-white' : 'text-white'
        )}
        style={isArcade ? { background: 'var(--mario-pipe)' } : { background: 'var(--color-brand-orange)' }}
        >
          &#8595; Save File
        </span>
      </div>
      <p className={cn(
        'text-xs leading-relaxed',
        isArcade ? 'text-white/40' : 'text-[var(--color-faint)]'
      )}>
        Click to save this file. Then drag it from your desktop into CoWork to get started.
      </p>
    </div>
  )
}
