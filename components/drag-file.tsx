'use client'

import { useCallback } from 'react'
import type { DragFile as DragFileType } from '@/lib/problems'

interface DragFileProps {
  file: DragFileType
}

export default function DragFile({ file }: DragFileProps) {
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      const fullUrl = `${window.location.origin}${file.path}`
      e.dataTransfer.setData('DownloadURL', `${file.mime}:${file.name}:${fullUrl}`)
      e.dataTransfer.setData('text/plain', file.path)
      e.dataTransfer.effectAllowed = 'copy'
    },
    [file]
  )

  const handleClick = useCallback(() => {
    window.open(file.path, '_blank')
  }, [file])

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[var(--color-brand-orange)]
        bg-[var(--color-brand-orange-faint)] rounded-[2px] cursor-grab active:cursor-grabbing
        active:scale-[0.98] transition-transform select-none hover:bg-[#fff8f3]"
    >
      <span className="text-[var(--color-brand-orange)] text-lg shrink-0">
        &#128196;
      </span>
      <span className="text-sm font-medium text-[var(--color-ink)] truncate font-[family-name:var(--font-heading)]">
        {file.name}
      </span>
      <span className="ml-auto text-[var(--color-faint)] text-xs shrink-0">
        &#8942;&#8942;
      </span>
    </div>
  )
}
