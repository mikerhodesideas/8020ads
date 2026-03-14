'use client'

import { useCallback, useRef, useState } from 'react'
import { useSkin } from '@/components/game-provider'
import { cn } from '@/lib/utils'

interface DragFileProps {
  file: { name: string; path: string; mime: string }
}

export default function DragFile({ file }: DragFileProps) {
  const skin = useSkin()
  const linkRef = useRef<HTMLAnchorElement>(null)
  const [downloaded, setDownloaded] = useState(false)

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
      setDownloaded(true)
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
    setDownloaded(true)
  }, [file])

  return (
    <div className="space-y-2">
      <a ref={linkRef} href={file.path} download={file.name} className="hidden" />
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={handleDownload}
        className={cn(
          'flex items-center gap-4 px-6 py-5 border-2 rounded-[2px] cursor-grab active:cursor-grabbing active:scale-[0.98] transition-all select-none',
          downloaded
            ? (skin.isDark
              ? 'border-emerald-500/60'
              : 'border-emerald-500')
            : (skin.isDark
              ? 'border-dashed border-[var(--mario-coin)] hover:bg-white/5'
              : 'border-dashed border-[var(--color-brand-orange)] bg-[var(--color-brand-orange-faint)] hover:bg-[#fff8f3]')
        )}
        style={
          downloaded
            ? { background: skin.isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)' }
            : (skin.isDark ? { background: 'rgba(255,215,0,0.08)' } : undefined)
        }
      >
        <span className={cn('text-2xl shrink-0', !downloaded && !skin.isDark ? 'text-[var(--color-brand-orange)]' : '')}>
          {downloaded ? '\u2713' : '\uD83D\uDCC4'}
        </span>
        <span className={cn(
          'text-base font-medium truncate font-heading',
          downloaded
            ? (skin.isDark ? 'text-emerald-300' : 'text-emerald-700')
            : (skin.isDark ? 'text-white' : 'text-[var(--color-ink)]')
        )}>
          {downloaded ? `${file.name} - Saved` : file.name}
        </span>
        <span className={cn(
          'ml-auto text-sm font-heading font-bold shrink-0 px-4 py-2 rounded-[2px]',
          'text-white'
        )}
        style={
          downloaded
            ? { background: skin.isDark ? '#059669' : '#10b981' }
            : (skin.isDark ? { background: 'var(--mario-pipe)' } : { background: 'var(--color-brand-orange)' })
        }
        >
          {downloaded ? '\u2713 Done' : '\u2193 Save File'}
        </span>
      </div>
      <p className={cn(
        'text-xs leading-relaxed',
        skin.isDark ? 'text-white/40' : 'text-[var(--color-faint)]'
      )}>
        {downloaded
          ? 'File saved. Now open Cowork and drag the file in.'
          : 'Drag to your desktop or click to save. Then open Cowork and drag the file in.'
        }
      </p>
    </div>
  )
}
