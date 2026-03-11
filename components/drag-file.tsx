'use client'

import { useCallback } from 'react'
interface DragFileProps {
  file: { name: string; path: string; mime: string }
}

export default function DragFile({ file }: DragFileProps) {
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
    <div className="space-y-2">
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={handleDownload}
        className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[var(--color-brand-orange)]
          bg-[var(--color-brand-orange-faint)] rounded-[2px] cursor-grab active:cursor-grabbing
          active:scale-[0.98] transition-transform select-none hover:bg-[#fff8f3]"
      >
        <span className="text-[var(--color-brand-orange)] text-lg shrink-0">
          &#128196;
        </span>
        <span className="text-sm font-medium text-[var(--color-ink)] truncate font-heading">
          {file.name}
        </span>
        <span className="ml-auto text-xs text-[var(--color-brand-orange)] font-heading font-semibold shrink-0">
          &#8595; Save
        </span>
      </div>
      <p className="text-[10px] text-[var(--color-faint)] leading-relaxed">
        Click to save this file, then drag it from your desktop into Cowork.
      </p>
    </div>
  )
}
