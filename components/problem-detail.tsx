import DragFile from './drag-file'
import DataPreview from './data-preview'
import type { Problem } from '@/lib/problems'

interface ProblemDetailProps {
  problem: Problem
  position: number
  total: number
  onBack: () => void
  onNext: (() => void) | null
}

export default function ProblemDetail({
  problem,
  position,
  total,
  onBack,
  onNext,
}: ProblemDetailProps) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col px-4 sm:px-6 py-8 sm:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-orange)] mb-2 font-heading">
          Problem {position} of {total}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold font-heading leading-tight text-[var(--color-ink)]">
          {problem.title}
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          {problem.subtitle}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 flex-1">
        {/* Left: Pain / Fix / Try This */}
        <div className="space-y-5">
          <ContextBox
            label="Pain"
            text={problem.pain}
            borderColor="var(--color-pain-red)"
            bgColor="var(--color-pain-bg)"
          />
          <ContextBox
            label="Fix"
            text={problem.fix}
            borderColor="var(--color-fix-green)"
            bgColor="var(--color-fix-bg)"
          />
          <ContextBox
            label="Try This in Cowork"
            text={problem.tryThis}
            borderColor="var(--color-brand-orange)"
            bgColor="var(--color-brand-orange-faint)"
          />
        </div>

        {/* Right: Data preview + drag file */}
        <div className="space-y-5">
          <div className="bg-white border border-[var(--color-border)] rounded-[2px] p-5">
            <DataPreview data={problem.data} />
          </div>
          {problem.dragFile && <DragFile file={problem.dragFile} />}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--color-border)]">
        <button
          onClick={onBack}
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-heading"
        >
          &#8592; All problems
        </button>
        {onNext && (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white text-sm font-heading font-semibold rounded-[2px] transition-colors"
          >
            Next problem
            <span>&#8594;</span>
          </button>
        )}
      </div>
    </div>
  )
}

function ContextBox({
  label,
  text,
  borderColor,
  bgColor,
}: {
  label: string
  text: string
  borderColor: string
  bgColor: string
}) {
  return (
    <div
      className="p-4 sm:p-5 rounded-[2px]"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        backgroundColor: bgColor,
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-2 font-heading"
        style={{ color: borderColor }}
      >
        {label}
      </p>
      <p className="text-sm text-[var(--color-ink)] leading-relaxed">{text}</p>
    </div>
  )
}
