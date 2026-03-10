'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'

function CoworkContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const path = searchParams.get('path') || 'agency'
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        router.push(`/${path}`)
      }
      if (e.key === 'Escape') {
        router.push('/')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [path, router])

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Mobile warning — full width banner */}
      {isMobile && (
        <div className="bg-[var(--color-brand-orange-faint)] border-b border-[var(--color-brand-orange)] px-6 py-4">
          <div className="max-w-5xl mx-auto">
            <p className="font-heading font-bold text-[var(--color-brand-orange)] text-xs uppercase tracking-widest mb-1">
              Desktop Required
            </p>
            <p className="text-sm text-[var(--color-ink)] leading-relaxed">
              This demo uses Claude Cowork, a desktop app. Open this page on your
              laptop or desktop to follow along.
            </p>
          </div>
        </div>
      )}

      {/* Hero section */}
      <section className="px-6 pt-20 sm:pt-28 pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-orange)] mb-6 font-heading">
            Before We Start
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6 font-heading text-[var(--color-ink)]">
            This demo uses<br />
            <span className="text-[var(--color-brand-orange)]">Claude Cowork</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto">
            Cowork is a desktop app where you drag in files, type what you need,
            and get real answers back. No coding. No prompt engineering.
          </p>
        </div>
      </section>

      {/* Steps — wide cards like Claude download page */}
      <section className="px-6 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-0 border border-[var(--color-border)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
          {[
            {
              num: '1',
              icon: '🎯',
              title: 'Pick a problem',
              desc: 'Choose a real business scenario from the grid. Each one maps to something agencies deal with every week.',
            },
            {
              num: '2',
              icon: '📂',
              title: 'Save the file',
              desc: 'Each problem comes with sample data. Save it to your desktop, then drag it into Cowork.',
            },
            {
              num: '3',
              icon: '⚡',
              title: 'Watch AI solve it',
              desc: 'Type the prompt, hit enter, and watch Claude work through the problem with your data.',
            },
          ].map((step) => (
            <div key={step.num} className="p-8 sm:p-10">
              <div className="text-3xl mb-4">{step.icon}</div>
              <h3 className="font-heading font-bold text-base mb-2 text-[var(--color-ink)]">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Download callout — wider, more spacious */}
      <section className="px-6 pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto bg-white border border-[var(--color-border)] p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1">
              <p className="font-heading font-bold text-[var(--color-ink)] text-lg mb-2">
                Get Claude Desktop
              </p>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                To follow along with the demos, download Claude Desktop. Cowork is
                built right in — open the app, switch to Cowork mode, and you're ready.
              </p>
              <a
                href="https://claude.ai/download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange-hover)] transition-colors"
              >
                Download Claude Desktop &#8599;
              </a>
            </div>
            <div className="hidden sm:flex items-center justify-center w-20 h-20 bg-[var(--color-cream)] border border-[var(--color-border)]">
              <span className="text-3xl">🖥️</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 sm:pb-32 text-center">
        <Link
          href={`/${path}`}
          className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white font-heading font-semibold rounded-[2px] transition-colors text-base"
        >
          Start Demo
          <span>&#8594;</span>
        </Link>
        <p className="mt-5 text-[11px] text-[var(--color-faint)] font-heading">
          Press{' '}
          <kbd className="px-1.5 py-0.5 bg-white border border-[var(--color-border)] rounded-[2px] text-[10px] font-mono">
            Enter
          </kbd>{' '}
          to continue
        </p>
      </section>
    </div>
  )
}

export default function CoworkPage() {
  return (
    <Suspense>
      <CoworkContent />
    </Suspense>
  )
}
