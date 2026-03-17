'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'
import type { Demo } from '@/lib/game-data'
import type { SkinConfig } from '@/lib/skin-config'

interface TryItYourselfProps {
  demo: Demo
  skill: { id: string; name: string; capabilities: string[] } | null
  level: { id: number }
  isDark: boolean
  skin: SkinConfig
  copied: boolean
  done: boolean
  justCompleted: boolean
  onCopyPrompt: (text: string) => void
  onMarkComplete: () => void
  onNext?: () => void
  nextLabel?: string
}

function WalkthroughModal({ onClose, isDark }: { onClose: () => void; isDark: boolean }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2px] p-6 sm:p-8"
        style={{
          background: isDark ? '#1a1a2e' : '#fff',
          border: `2px solid ${isDark ? 'var(--world-accent)' : '#D64C00'}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg"
          style={{ color: isDark ? 'var(--world-text-muted)' : '#999' }}
        >
          &#10005;
        </button>
        <h3
          className="text-xl font-heading font-bold mb-4"
          style={{ color: isDark ? '#fff' : '#1a1a2e' }}
        >
          How to install a skill in Cowork
        </h3>
        <ol className="space-y-4">
          {[
            { step: 'Download the .zip file', detail: 'Click the download button. The file will save to your Downloads folder.' },
            { step: 'Open Cowork', detail: 'Launch the Claude desktop app. Make sure you\'re in Cowork mode (the toggle in the top right).' },
            { step: 'Go to Customize', detail: 'Click the gear icon or go to Customize in the sidebar.' },
            { step: 'Open Skills', detail: 'Click "Skills" in the Customize panel.' },
            { step: 'Click the + button', detail: 'This opens the file picker. Select the .zip file you downloaded.' },
            { step: 'Upload and confirm', detail: 'Cowork will install the skill. You\'ll see it appear in your skills list.' },
            { step: 'Drag in your data file', detail: 'Go back to the chat, drag the data file into the conversation, and copy and paste the prompt.' },
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-heading shrink-0 mt-0.5 text-white"
                style={{ background: isDark ? 'var(--world-accent)' : '#D64C00' }}
              >
                {i + 1}
              </span>
              <div>
                <p className="font-heading font-bold text-sm" style={{ color: isDark ? '#fff' : '#1a1a2e' }}>
                  {item.step}
                </p>
                <p className="text-sm mt-0.5" style={{ color: isDark ? 'var(--world-text-secondary)' : '#666' }}>
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default function TryItYourself({
  demo,
  skill,
  level,
  isDark,
  skin,
  copied,
  done,
  justCompleted,
  onCopyPrompt,
  onMarkComplete,
  onNext,
  nextLabel,
}: TryItYourselfProps) {
  const [downloadedItems, setDownloadedItems] = useState<Set<string>>(new Set())
  const [coworkDismissed, setCoworkDismissed] = useState(true)
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  const hasAutoCompleted = useRef(false)

  useEffect(() => {
    setCoworkDismissed(localStorage.getItem('cowork-card-dismissed') === '1')
  }, [])

  const isLevel3 = level.id >= 3
  const hasSkill = !!demo.skillZip
  const hasDataFile = !!demo.dragFile

  // Step completion tracking
  const dataDownloaded = hasDataFile ? downloadedItems.has(demo.dragFile!.path) : true
  const skillDownloaded = hasSkill && demo.skillZip ? downloadedItems.has(demo.skillZip.path) : true
  const allStepsDone = dataDownloaded && skillDownloaded && promptCopied

  // Auto-mark complete when all steps done (once only)
  useEffect(() => {
    if (allStepsDone && !done && !hasAutoCompleted.current) {
      hasAutoCompleted.current = true
      onMarkComplete()
    }
  }, [allStepsDone, done, onMarkComplete])

  // Build numbered steps
  const steps: { key: string; number: number }[] = []
  let stepNum = 1
  if (hasDataFile) steps.push({ key: 'data', number: stepNum++ })
  if (hasSkill) steps.push({ key: 'skill', number: stepNum++ })
  steps.push({ key: 'prompt', number: stepNum })

  const getStepNumber = (key: string) => steps.find(s => s.key === key)?.number || 0

  // Accent colors
  const accentBg = isDark ? 'bg-[var(--world-accent)]' : 'bg-[var(--color-brand-orange)]'
  const accentHover = isDark ? 'hover:brightness-110' : 'hover:bg-[#c04400]'

  const handleCopyPrompt = () => {
    onCopyPrompt(demo.tryThis)
    setPromptCopied(true)
  }

  return (
    <div id="try-it-yourself" className="mt-4 max-w-5xl mx-auto quest-phase-in scroll-mt-4">
      {showWalkthrough && (
        <WalkthroughModal onClose={() => setShowWalkthrough(false)} isDark={isDark} />
      )}
      <div
        className="p-5 sm:p-8 md:p-10 rounded-[2px]"
        style={{
          background: isDark ? 'var(--world-selection-bg)' : '#faf6f1',
          border: isDark ? '2px solid var(--world-accent)' : '2px solid #d4a574',
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-2xl sm:text-3xl font-heading font-bold mb-3"
            style={{ color: isDark ? 'var(--world-accent)' : '#8b5e3c' }}
          >
            {isLevel3 ? 'Now do it with your own data' : 'Your turn'}
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: isDark ? 'var(--world-text-secondary)' : '#5a4a3a' }}
          >
            {skill
              ? `Download the skill, add your own ${demo.dragFile?.name?.replace(/\.[^.]+$/, '') || 'data'}, and watch it work.`
              : demo.dragFile
                ? `Drop in your own file and paste the prompt. Same result, your data.`
                : `Copy the prompt, open Cowork, and see it work with your own content.`
            }
          </p>
        </div>

        {/* Cowork install help - compact, not pushy. Only show for Level 2+ demos that have skills */}
        {!coworkDismissed && hasSkill && (
          <div
            className="mb-6 px-4 py-3 rounded-[2px] flex items-center justify-between gap-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : '#f0ebe4',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #d4cfc7',
            }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-sm"
                style={{ color: isDark ? 'var(--world-text-secondary)' : '#6b5b4a' }}
              >
                Need help installing a skill?
              </span>
              <button
                onClick={() => setShowWalkthrough(true)}
                className="text-sm font-heading font-semibold underline transition-colors"
                style={{ color: isDark ? 'var(--world-accent)' : '#8b5e3c', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Step-by-step walkthrough
              </button>
              <a
                href="https://claude.com/download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-heading underline transition-colors"
                style={{ color: isDark ? 'var(--world-text-muted)' : '#8b7b6a' }}
              >
                Download Cowork
              </a>
            </div>
            <button
              onClick={() => {
                localStorage.setItem('cowork-card-dismissed', '1')
                setCoworkDismissed(true)
              }}
              className="text-xs shrink-0 transition-colors"
              style={{ color: isDark ? 'var(--world-text-muted)' : '#a09080' }}
              title="Dismiss"
            >
              &#10005;
            </button>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-4">
          {/* Step: Download data file */}
          {hasDataFile && (
            <div>
              <StepLabel
                number={getStepNumber('data')}
                text="Download the data file"
                isDark={isDark}
                completed={dataDownloaded}
              />
              <DownloadRow
                filePath={demo.dragFile!.path}
                fileName={demo.dragFile!.name}
                icon="&#128196;"
                downloaded={downloadedItems.has(demo.dragFile!.path)}
                isDark={isDark}
                onDownload={() => {
                  setDownloadedItems(prev => new Set(prev).add(demo.dragFile!.path))
                }}
              />
              <p
                className="text-xs mt-1.5 ml-1"
                style={{ color: isDark ? 'var(--world-text-muted)' : '#a09080' }}
              >
                Download the file, then drag it into Cowork.
              </p>
            </div>
          )}

          {/* Step: Download and install skill */}
          {hasSkill && demo.skillZip && (
            <div>
              <StepLabel
                number={getStepNumber('skill')}
                text="Download and install the skill"
                isDark={isDark}
                completed={skillDownloaded}
              />
              <DownloadRow
                filePath={demo.skillZip.path}
                fileName={demo.skillZip.name}
                icon="&#128230;"
                downloaded={downloadedItems.has(demo.skillZip.path)}
                isDark={isDark}
                onDownload={() => {
                  const snd = skin.sounds.skillDownload
                  if (snd) playSound(snd)
                  setDownloadedItems(prev => new Set(prev).add(demo.skillZip!.path))
                }}
              />
              <p
                className="text-xs mt-1.5 ml-1"
                style={{ color: isDark ? 'var(--world-download-subtext)' : '#a09080' }}
              >
                In Cowork: Customize &gt; Skills &gt; + &gt; Upload this file
              </p>
            </div>
          )}

          {/* Step: Paste the prompt */}
          <div>
            <StepLabel
              number={getStepNumber('prompt')}
              text="Copy and paste the prompt"
              isDark={isDark}
              completed={promptCopied}
            />
            <div
              onClick={handleCopyPrompt}
              className="flex items-center gap-4 px-5 py-4 border-2 rounded-[2px] transition-all text-left cursor-pointer active:scale-[0.99]"
              style={{
                borderColor: promptCopied
                  ? (isDark ? 'rgba(16,185,129,0.6)' : '#10b981')
                  : (isDark ? 'var(--world-download-border, var(--world-accent))' : '#D64C00'),
                borderStyle: promptCopied ? 'solid' : 'dashed',
                background: promptCopied
                  ? (isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)')
                  : (isDark ? 'rgba(214,76,0,0.06)' : 'rgba(214,76,0,0.04)'),
              }}
              title="Click to copy prompt"
            >
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: promptCopied
                  ? (isDark ? '#6ee7b7' : '#059669')
                  : (isDark ? 'var(--world-text, #e0e0e0)' : '#3a2820')
                }}
              >
                {demo.tryThis}
              </p>
              <span
                className="ml-auto text-sm font-heading font-bold shrink-0 px-4 py-2 rounded-[2px] text-white"
                style={{
                  background: promptCopied
                    ? (isDark ? '#059669' : '#10b981')
                    : (isDark ? 'var(--world-download-badge-bg, var(--world-accent))' : '#D64C00'),
                }}
              >
                {promptCopied ? '\u2713 Copied' : '\u{1F4CB} Copy'}
              </span>
            </div>
          </div>
        </div>

        {/* Completion state - only shows when all steps are done */}
        <div className="mt-8 space-y-3">
          {allStepsDone ? (
            <>
              <div className="flex justify-center">
                <div
                  className={cn(
                    'inline-flex items-center gap-3 px-8 sm:px-12 py-3 sm:py-4 text-lg font-heading font-bold rounded-[2px]',
                    isDark
                      ? 'border-2 border-emerald-500 text-emerald-400'
                      : 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300'
                  )}
                  style={isDark ? { background: 'rgba(16,185,129,0.1)' } : undefined}
                >
                  <span className="text-emerald-500">&#10003;</span>
                  Demo Complete
                </div>
              </div>
              {onNext && nextLabel && (
                <div className="flex justify-center">
                  <button
                    onClick={onNext}
                    className={cn(
                      'inline-flex items-center gap-2 px-6 py-2.5 text-white text-sm font-heading font-semibold rounded-[2px] transition-colors',
                      accentBg, accentHover
                    )}
                  >
                    {nextLabel} <span>&#8594;</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <p
              className="text-center text-sm"
              style={{ color: isDark ? 'var(--world-text-muted)' : '#a09080' }}
            >
              Complete all steps above to finish this demo
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function DownloadRow({ filePath, fileName, icon, downloaded, isDark, onDownload }: {
  filePath: string
  fileName: string
  icon: string
  downloaded: boolean
  isDark: boolean
  onDownload: () => void
}) {
  const doneBg = isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)'
  const defaultBg = isDark ? 'rgba(214,76,0,0.06)' : 'rgba(214,76,0,0.04)'
  return (
    <a
      href={filePath}
      download={fileName}
      className="flex items-center gap-4 px-5 py-4 border-2 rounded-[2px] transition-all text-left"
      style={{
        borderColor: downloaded
          ? (isDark ? 'rgba(16,185,129,0.6)' : '#10b981')
          : (isDark ? 'var(--world-download-border)' : '#D64C00'),
        borderStyle: downloaded ? 'solid' : 'dashed',
        background: downloaded ? doneBg : defaultBg,
      }}
      onClick={() => {
        if (!downloaded) onDownload()
      }}
    >
      <span className="text-2xl shrink-0" dangerouslySetInnerHTML={{ __html: downloaded ? '&#10003;' : icon }} />
      <span
        className="text-base font-medium truncate font-heading"
        style={{
          color: downloaded
            ? (isDark ? '#6ee7b7' : '#059669')
            : (isDark ? 'var(--world-download-text)' : '#3a2820'),
        }}
      >
        {downloaded ? `${fileName} - Downloaded` : fileName}
      </span>
      <span
        className="ml-auto text-sm font-heading font-bold shrink-0 px-4 py-2 rounded-[2px] text-white"
        style={{
          background: downloaded
            ? (isDark ? '#059669' : '#10b981')
            : (isDark ? 'var(--world-download-badge-bg)' : '#D64C00'),
        }}
      >
        {downloaded ? '\u2713 Done' : '\u2193 Download'}
      </span>
    </a>
  )
}

function StepLabel({ number, text, isDark, completed }: { number: number; text: string; isDark: boolean; completed: boolean }) {
  return (
    <div className="flex items-center gap-2.5 mb-2">
      <span
        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-heading shrink-0 text-white transition-colors duration-300"
        style={{ background: completed ? '#059669' : (isDark ? 'var(--world-accent)' : '#8b5e3c') }}
      >
        {completed ? '\u2713' : number}
      </span>
      <span
        className="text-sm font-heading font-bold uppercase tracking-wide transition-colors duration-300"
        style={{ color: completed ? '#059669' : (isDark ? 'var(--world-text-muted)' : '#6b5b4a') }}
      >
        {text}
      </span>
    </div>
  )
}
