'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const paths = [
  {
    id: 'agency',
    title: 'I run an agency',
    desc: 'Client reporting, competitor analysis, deliverables',
    image: '/images/business-persona.png',
    accent: '#2563EB',
  },
  {
    id: 'employee',
    title: 'I work in an agency',
    desc: 'Campaign management, search terms, content',
    image: '/images/employee-persona.png',
    accent: '#0D9488',
  },
  {
    id: 'freelancer',
    title: "I'm a freelancer",
    desc: 'Solo client work, prospecting, reporting',
    image: '/images/freelancer-persona.png',
    accent: '#7C3AED',
  },
  {
    id: 'business',
    title: 'I run a business',
    desc: 'Inbox, meetings, financials, onboarding',
    image: '/images/business-owner-persona.png',
    accent: '#1B8C3A',
  },
]

export default function PathChooser() {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent, pathId: string) => {
    const seen = localStorage.getItem('cowork-seen')
    if (seen) {
      e.preventDefault()
      router.push(`/${pathId}`)
    }
    // If not seen, the Link navigates to /cowork?path=... normally
  }

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full">
        {paths.map((p) => (
          <Link
            key={p.id}
            href={`/cowork?path=${p.id}`}
            onClick={(e) => handleClick(e, p.id)}
            className={cn(
              'group relative text-left overflow-hidden',
              'border border-[var(--color-border)]',
              'rounded-[2px] transition-all duration-300 ease-out',
              'hover:shadow-lg hover:-translate-y-1',
              'cursor-pointer block',
              'aspect-[3/4]'
            )}
          >
            {/* Background image */}
            <Image
              src={p.image}
              alt={p.title}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority
            />

            {/* Dark gradient overlay from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Accent top border line */}
            <div
              className="absolute top-0 inset-x-0 h-[3px]"
              style={{ backgroundColor: p.accent }}
            />

            {/* Text content at bottom */}
            <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
              <h2 className="text-lg sm:text-xl font-bold mb-1.5 font-heading text-white leading-tight">
                {p.title}
              </h2>

              <p className="text-xs text-white/70 leading-relaxed mb-4">
                {p.desc}
              </p>

              <div
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2',
                  'text-white text-xs font-semibold',
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
        agency &middot;{' '}
        <kbd className="px-1.5 py-0.5 bg-white border border-[var(--color-border)] rounded-[2px] text-[10px] font-mono">
          E
        </kbd>{' '}
        employee &middot;{' '}
        <kbd className="px-1.5 py-0.5 bg-white border border-[var(--color-border)] rounded-[2px] text-[10px] font-mono">
          F
        </kbd>{' '}
        freelancer &middot;{' '}
        <kbd className="px-1.5 py-0.5 bg-white border border-[var(--color-border)] rounded-[2px] text-[10px] font-mono">
          B
        </kbd>{' '}
        business
      </p>
    </div>
  )
}
