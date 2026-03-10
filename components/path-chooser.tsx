'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const paths = [
  {
    id: 'agency',
    title: 'I run an agency',
    desc: 'Google Ads, SEO, campaign reporting, competitor analysis, client deliverables.',
    tagline: 'From manual grind to strategic clarity',
    image: '/images/agency-persona.png',
    accent: '#2563EB',
    gradient: 'from-blue-50 to-white',
  },
  {
    id: 'business',
    title: 'I run a business',
    desc: 'Inbox overload, meeting follow-ups, financial reporting, team onboarding.',
    tagline: 'From operational chaos to running smoothly',
    image: '/images/business-persona.png',
    accent: '#1B8C3A',
    gradient: 'from-green-50 to-white',
  },
]

export default function PathChooser() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-orange)] mb-4 font-heading">
          Live AI Demo
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] mb-5 font-heading text-[var(--color-ink)]">
          Watch AI solve
          <br />
          <span className="text-[var(--color-brand-orange)]">
            real problems
          </span>
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-muted)] max-w-md mx-auto leading-relaxed">
          Pick your world. Every problem gets solved live in Claude Cowork,
          right in front of you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl w-full">
        {paths.map((p) => (
          <Link
            key={p.id}
            href={`/cowork?path=${p.id}`}
            className={cn(
              'group relative text-left overflow-hidden',
              'bg-white border border-[var(--color-border)]',
              'rounded-[2px] transition-all duration-300 ease-out',
              'hover:shadow-lg hover:-translate-y-1',
              'cursor-pointer block'
            )}
            style={{
              borderTop: `3px solid ${p.accent}`,
            }}
          >
            <div
              className={cn(
                'relative w-full aspect-[4/3] overflow-hidden',
                `bg-gradient-to-b ${p.gradient}`
              )}
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="px-6 pb-6 pt-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 font-heading text-[var(--color-ink)]">
                {p.title}
              </h2>

              <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                {p.desc}
              </p>

              <p
                className="text-[10px] font-bold uppercase tracking-[0.15em] mb-5 font-heading"
                style={{ color: p.accent }}
              >
                {p.tagline}
              </p>

              <div
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-2.5',
                  'text-white text-sm font-semibold',
                  'rounded-[2px] transition-all duration-200',
                  'group-hover:gap-3',
                  'font-heading'
                )}
                style={{ backgroundColor: p.accent }}
              >
                Start Demo
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  &#8594;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-[10px] text-[var(--color-faint)] tracking-wide font-heading">
        Press{' '}
        <kbd className="px-1.5 py-0.5 bg-white border border-[var(--color-border)] rounded-[2px] text-[10px] font-mono">
          A
        </kbd>{' '}
        for agency &middot;{' '}
        <kbd className="px-1.5 py-0.5 bg-white border border-[var(--color-border)] rounded-[2px] text-[10px] font-mono">
          B
        </kbd>{' '}
        for business
      </p>
    </div>
  )
}
