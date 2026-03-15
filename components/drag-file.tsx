'use client'

import { useCallback, useRef, useState } from 'react'
import { useSkin } from '@/components/game-provider'

interface DragFileProps {
  file: { name: string; path: string; mime: string }
}

export default function DragFile({ file }: DragFileProps) {
  const skin = useSkin()
  const linkRef = useRef<HTMLAnchorElement>(null)
  const [downloaded, setDownloaded] = useState(false)

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
    <div className="space-y-1">
      <a ref={linkRef} href={file.path} download={file.name} className="hidden" />
      <a
        href={file.path}
        download={file.name}
        onClick={(e) => {
          e.preventDefault()
          handleDownload()
        }}
        className="flex items-center gap-4 px-6 py-4 border-2 rounded-[2px] transition-all text-left"
        style={{
          borderColor: downloaded
            ? (skin.isDark ? 'rgba(16,185,129,0.6)' : '#10b981')
            : 'var(--world-download-border)',
          borderStyle: downloaded ? 'solid' : 'dashed',
          background: downloaded
            ? (skin.isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)')
            : 'var(--world-download-bg)',
        }}
        onMouseEnter={(e) => {
          if (!downloaded) {
            e.currentTarget.style.background = 'var(--world-download-hover-bg)'
          }
        }}
        onMouseLeave={(e) => {
          if (!downloaded) {
            e.currentTarget.style.background = 'var(--world-download-bg)'
          }
        }}
      >
        <span className="text-2xl shrink-0">
          {downloaded ? '\u2713' : '\uD83D\uDCC4'}
        </span>
        <span
          className="text-base font-medium truncate font-heading"
          style={{
            color: downloaded
              ? (skin.isDark ? '#6ee7b7' : '#059669')
              : 'var(--world-download-text)',
          }}
        >
          {downloaded ? `${file.name} - Downloaded` : file.name}
        </span>
        <span
          className="ml-auto text-sm font-heading font-bold shrink-0 px-4 py-2 rounded-[2px] text-white"
          style={{
            background: downloaded
              ? (skin.isDark ? '#059669' : '#10b981')
              : 'var(--world-download-badge-bg)',
          }}
        >
          {downloaded ? '\u2713 Done' : '\u2193 Download'}
        </span>
      </a>
      <p
        className="text-xs mt-1"
        style={{ color: 'var(--world-download-subtext)' }}
      >
        {downloaded
          ? 'File downloaded. Now open Cowork and drag the file in.'
          : 'Download the file, then drag it into Cowork.'
        }
      </p>
    </div>
  )
}
