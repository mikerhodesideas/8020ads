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
    localStorage.setItem('cowork-seen', '1')
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
      {/* Mobile warning */}
      {isMobile && (
        <div className="bg-[var(--color-brand-orange-faint)] border-b border-[var(--color-brand-orange)] px-6 py-3">
          <div className="max-w-5xl mx-auto">
            <p className="font-heading font-bold text-[var(--color-brand-orange)] text-xs uppercase tracking-widest mb-0.5">
              Desktop Required
            </p>
            <p className="text-xs text-[var(--color-ink)] leading-relaxed">
              This demo uses Claude Cowork, a desktop app. Open this on your desktop to follow along.
            </p>
          </div>
        </div>
      )}

      {/* Compact hero + Start Demo button top-right */}
      <section className="px-6 pt-10 pb-8">
        <div className="max-w-5xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-orange)] mb-3 font-heading">
              Before We Start
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.1] mb-3 font-heading text-[var(--color-ink)]">
              This demo uses{' '}
              <span className="text-[var(--color-brand-orange)]">Claude Cowork</span>
            </h1>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-xl">
              A desktop app where you drag in files, type what you need,
              and get real answers back. No coding. No prompt engineering.
            </p>
          </div>
          <Link
            href={`/${path}`}
            className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white font-heading font-semibold rounded-[2px] transition-colors text-sm shrink-0 ml-8"
          >
            Start Demo
            <span>&#8594;</span>
          </Link>
        </div>
      </section>

      {/* 4-column card grid */}
      <section className="px-6 pb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[var(--color-border)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
          <a
            href="https://claude.com/download"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 hover:bg-[var(--color-cream)] transition-colors group"
          >
            <div className="text-2xl mb-3">&#128421;&#65039;</div>
            <h3 className="font-heading font-bold text-sm mb-1.5 text-[var(--color-ink)]">
              Get Claude Desktop
            </h3>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-3">
              Download the app. Cowork is built right in — switch to Cowork mode and you're ready.
            </p>
            <span className="text-xs font-heading font-semibold text-[var(--color-brand-orange)] group-hover:text-[var(--color-brand-orange-hover)] transition-colors">
              Download &#8599;
            </span>
          </a>
          {[
            {
              icon: '\uD83C\uDFAF',
              title: 'Pick a problem',
              desc: 'Choose a real scenario from the grid. Each one maps to something you deal with every week.',
            },
            {
              icon: '\uD83D\uDCC2',
              title: 'Save the file',
              desc: 'Each problem comes with sample data. Save it to your desktop, then drag it into Cowork.',
            },
            {
              icon: '\u26A1',
              title: 'Watch AI solve it',
              desc: 'Type the prompt, hit enter, and watch Claude work through the problem with your data.',
            },
          ].map((step) => (
            <div key={step.title} className="p-6">
              <div className="text-2xl mb-3">{step.icon}</div>
              <h3 className="font-heading font-bold text-sm mb-1.5 text-[var(--color-ink)]">
                {step.title}
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-16 text-center">
        <Link
          href={`/${path}`}
          className="inline-flex items-center gap-3 px-10 py-3.5 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white font-heading font-semibold rounded-[2px] transition-colors text-sm"
        >
          Start Demo
          <span>&#8594;</span>
        </Link>
        <p className="mt-3 text-[10px] text-[var(--color-faint)] font-heading">
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
