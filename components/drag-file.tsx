'use client'

import { useCallback, useRef } from 'react'
import { useSkin } from '@/components/game-provider'
import { cn } from '@/lib/utils'

interface DragFileProps {
  file: { name: string; path: string; mime: string }
}

export default function DragFile({ file }: DragFileProps) {
  const skin = useSkin()
  const linkRef = useRef<HTMLAnchorElement>(null)

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      const fullUrl = `${window.location.origin}${file.path}`
      // Chrome DownloadURL format: mime:filename:url
      e.dataTransfer.setData(
        'DownloadURL',
        `${file.mime}:${file.name}:${fullUrl}`
      )
      e.dataTransfer.setData('text/uri-list', fullUrl)
      e.dataTransfer.setData('text/plain', fullUrl)
      e.dataTransfer.effectAllowed = 'copy'
    },
    [file]
  )

  const handleDownload = useCallback(() => {
    const link = document.createElement('a')
    link.href = file.path
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [file])

  return (
    <div className="space-y-2">
      <a ref={linkRef} href={file.path} download={file.name} className="hidden" />
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={handleDownload}
        className={cn(
          'flex items-center gap-4 px-6 py-5 border-2 border-dashed rounded-[2px] cursor-grab active:cursor-grabbing active:scale-[0.98] transition-transform select-none',
          skin.isDark
            ? 'border-[var(--mario-coin)] hover:bg-white/5'
            : 'border-[var(--color-brand-orange)] bg-[var(--color-brand-orange-faint)] hover:bg-[#fff8f3]'
        )}
        style={skin.isDark ? { background: 'rgba(255,215,0,0.08)' } : undefined}
      >
        <span className={cn('text-2xl shrink-0', skin.isDark ? '' : 'text-[var(--color-brand-orange)]')}>
          &#128196;
        </span>
        <span className={cn(
          'text-base font-medium truncate font-heading',
          skin.isDark ? 'text-white' : 'text-[var(--color-ink)]'
        )}>
          {file.name}
        </span>
        <span className={cn(
          'ml-auto text-sm font-heading font-bold shrink-0 px-4 py-2 rounded-[2px]',
          'text-white'
        )}
        style={skin.isDark ? { background: 'var(--mario-pipe)' } : { background: 'var(--color-brand-orange)' }}
        >
          &#8595; Save File
        </span>
      </div>
      <p className={cn(
        'text-xs leading-relaxed',
        skin.isDark ? 'text-white/40' : 'text-[var(--color-faint)]'
      )}>
        Drag to your desktop or click to save. Then open Cowork and drag the file in.
      </p>
    </div>
  )
}
