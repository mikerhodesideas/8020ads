import { cn } from '@/lib/utils'
import type { DataPreview as DataPreviewType } from '@/lib/problems'

interface DataPreviewProps {
  data: DataPreviewType
}

export default function DataPreview({ data }: DataPreviewProps) {
  if (data.type === 'table' && data.headers && data.rows) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {data.headers.map((h, i) => (
                <th
                  key={i}
                  className="text-left py-2 px-2 text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wide font-heading"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  'border-b border-[var(--color-border)] last:border-0',
                  row.highlight && 'text-[var(--color-pain-red)]',
                  row.muted && 'text-[var(--color-faint)] italic'
                )}
              >
                {row.cells.map((cell, j) => (
                  <td key={j} className="py-1.5 px-2 text-xs">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.type === 'file-list' && data.files) {
    return (
      <div className="space-y-2">
        {data.label && (
          <p className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wide mb-3 font-heading">
            {data.label}
          </p>
        )}
        {data.files.map((file, i) => (
          <div
            key={i}
            className="flex items-center gap-2 py-2 px-3 bg-[var(--color-cream)] rounded-[2px] text-sm"
          >
            <span className="text-[var(--color-faint)]">&#128196;</span>
            <span>{file}</span>
          </div>
        ))}
      </div>
    )
  }

  if (data.type === 'text' && data.text) {
    return (
      <div>
        {data.label && (
          <p className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wide mb-3">
            {data.label}
          </p>
        )}
        <div className="space-y-2 text-sm text-[var(--color-muted)] leading-relaxed">
          {data.text.map((line, i) => (
            <p key={i} className={cn(!line && 'h-2')}>
              {line}
            </p>
          ))}
        </div>
      </div>
    )
  }

  if (data.type === 'html-preview' && data.text) {
    return (
      <div>
        {data.label && (
          <p className="text-xs font-semibold text-[var(--color-faint)] uppercase tracking-wide mb-3">
            {data.label}
          </p>
        )}
        <div className="bg-white border border-[var(--color-border)] p-4 rounded-[2px] space-y-2 text-sm">
          {data.text.map((line, i) => (
            <p
              key={i}
              className={cn(
                i === 0 && 'text-base font-bold text-[var(--color-pain-red)]',
                i === 1 && 'text-sm font-semibold',
                i >= 2 && 'text-xs text-[var(--color-muted)]'
              )}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    )
  }

  return null
}
