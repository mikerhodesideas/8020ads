import DragFile from './drag-file'
import DataPreview from './data-preview'
import type { Problem } from '@/lib/problems'

interface ProblemDetailProps {
  problem: Problem
  onBack: () => void
}

export default function ProblemDetail({ problem, onBack }: ProblemDetailProps) {
  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <button
          onClick={onBack}
          className="shrink-0 mt-1 text-[var(--color-faint)] hover:text-[var(--color-ink)] transition-colors text-sm"
        >
          &#8592; Back
        </button>
        <div className="flex items-start gap-4">
          <span className="text-4xl opacity-15 font-bold font-[family-name:var(--font-heading)] leading-none">
            {String(problem.id).padStart(2, '0')}
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)] leading-tight">
              {problem.title}
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">{problem.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 flex-1">
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
            label="Try This"
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
      className="p-4 rounded-[2px]"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        backgroundColor: bgColor,
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-2 font-[family-name:var(--font-heading)]"
        style={{ color: borderColor }}
      >
        {label}
      </p>
      <p className="text-sm text-[var(--color-ink)] leading-relaxed">{text}</p>
    </div>
  )
}
