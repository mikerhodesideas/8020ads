'use client'

import Link from 'next/link'
import { useGame } from '@/components/game-provider'

const SUMMIT_COLOR = '#6D28D9'
const SCOUT_COLOR = '#D64C00'
const TREKKER_COLOR = '#1B8C3A'

/* ── Inline SVG icons ── */

function MountainIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21l4.5-13L17 21" />
      <path d="M2 21l5.5-9L12 21" />
      <path d="M15.5 15l3-5L22 21H2" />
    </svg>
  )
}

function CompassIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={`${color}20`} />
    </svg>
  )
}

function UsersIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

const testimonials = [
  {
    quote: 'It will definitely change the way I work this year.',
    name: 'Elaine Liaw',
  },
  {
    quote: 'The Brain now runs my actual workflow.',
    name: 'Benjamin Hantzschel',
  },
  {
    quote: 'Unbelievable stuff that has changed the way we operate.',
    name: 'Patrick Gilbert',
  },
]

const roles = [
  {
    title: 'Summit',
    subtitle: 'Leadership',
    color: SUMMIT_COLOR,
    icon: MountainIcon,
    tagline: 'Sets the destination',
    bullets: [
      'Picks which business problems AI should solve first',
      'Defines clear success metrics, not vague mandates',
      'Decides how time saved gets reinvested',
      'Protects the team from burnout and scope creep',
    ],
  },
  {
    title: 'Scouts',
    subtitle: 'Claude Code + IDE',
    color: SCOUT_COLOR,
    icon: CompassIcon,
    tagline: 'Builds the routes',
    bullets: [
      'Turns SOPs and workflows into reusable AI skills',
      'Tests with real data until output is reliable',
      'Packages skills so anyone can run them, no training needed',
      'Keeps exploring new capabilities and reporting back',
    ],
  },
  {
    title: 'Trekkers',
    subtitle: 'Claude Cowork',
    color: TREKKER_COLOR,
    icon: UsersIcon,
    tagline: 'Runs the skills daily',
    bullets: [
      'Drags in a file, types a short prompt, gets results',
      'Uses pre-built skills in Cowork every day',
      'No coding, no prompt engineering, no setup',
      'Focuses on their actual job, not on learning AI',
    ],
  },
]

const steps = [
  {
    num: '01',
    color: SUMMIT_COLOR,
    title: 'Summit identifies a problem',
    desc: '"Our team spends 6 hours a week turning campaign data into client reports."',
  },
  {
    num: '02',
    color: SCOUT_COLOR,
    title: 'A scout builds a skill',
    desc: 'Using Claude Code, they turn the existing SOP into a reusable skill. Test with real data. Refine until the output is consistently good.',
  },
  {
    num: '03',
    color: TREKKER_COLOR,
    title: 'Trekkers run it in Cowork',
    desc: 'Drag the CSV in. Type "run the campaign report skill." Polished report in two minutes instead of two hours. Every time.',
  },
  {
    num: '04',
    color: SUMMIT_COLOR,
    title: 'Summit measures, picks the next problem',
    desc: '6 hours drops to 40 minutes. The team reinvests that time into strategy and client work. The cycle repeats.',
  },
]

export default function HowItWorksPage() {
  const { completed } = useGame()
  const hasPlayed = completed.size > 0

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">

      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════ */}
      <section
        className="px-4 sm:px-6 pt-14 sm:pt-20 pb-12 sm:pb-16 text-center"
        style={{ backgroundColor: '#1a1a2e' }}
      >
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-[2px] mb-5 font-heading"
          style={{ color: '#D64C00', backgroundColor: '#D64C0018' }}
        >
          People Framework
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] mb-5 font-heading text-white max-w-3xl mx-auto">
          Summit. Scouts.{' '}
          <span style={{ color: '#D64C00' }}>Trekkers.</span>
        </h1>
        <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Three roles. Three tools. One system that turns AI experiments
          into daily team capability.
        </p>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 2 — THE 40% PROBLEM
          ═══════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--color-ink)] mb-6 text-center">
            The AI adoption problem
          </h2>

          <div
            className="bg-white border border-[var(--color-border)] rounded-[2px] p-6 sm:p-8 mb-5"
            style={{ borderLeft: '4px solid var(--color-pain-red)' }}
          >
            <p className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--color-pain-red)] mb-3">
              ~40%
            </p>
            <p className="text-sm sm:text-base text-[var(--color-ink)] leading-relaxed mb-3">
              <strong>of knowledge workers already use AI tools privately.</strong>{' '}
              They are building fragile prompts, keeping the results to themselves,
              and hoping no one asks how they got so fast.
            </p>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              The other 60% are watching and waiting. Neither group has a system.
              Leadership says &ldquo;use AI&rdquo; but gives no structure.
              Individuals experiment but nothing scales. The gap between
              &ldquo;trying AI&rdquo; and &ldquo;running the business on AI&rdquo;
              stays wide open.
            </p>
          </div>

          <div
            className="p-5 rounded-[2px]"
            style={{
              borderLeft: '4px solid var(--color-brand-orange)',
              backgroundColor: 'var(--color-brand-orange-faint)',
            }}
          >
            <p className="text-sm text-[var(--color-ink)] leading-relaxed">
              <strong className="font-heading">SST closes that gap.</strong>{' '}
              It gives each layer of your organisation a specific role, a specific tool,
              and a clear connection to the others. Nobody is left guessing
              what &ldquo;use AI&rdquo; means for them.
            </p>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 3 — THREE ROLE CARDS
          ═══════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--color-ink)] mb-8 text-center">
            Three roles. One system.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <div
                  key={role.title}
                  className="bg-white border border-[var(--color-border)] rounded-[2px] p-6 flex flex-col"
                  style={{ borderTop: `3px solid ${role.color}` }}
                >
                  {/* Icon + title row */}
                  <div className="flex items-center gap-3 mb-1">
                    <Icon color={role.color} />
                    <div>
                      <h3
                        className="text-xl font-bold font-heading leading-tight"
                        style={{ color: role.color }}
                      >
                        {role.title}
                      </h3>
                    </div>
                  </div>

                  {/* Badge */}
                  <span
                    className="inline-block self-start text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] mb-2 font-heading"
                    style={{
                      color: role.color,
                      backgroundColor: `${role.color}12`,
                    }}
                  >
                    {role.subtitle}
                  </span>

                  {/* Tagline */}
                  <p className="text-sm text-[var(--color-muted)] italic mb-4">
                    {role.tagline}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-2 mt-auto">
                    {role.bullets.map((b) => (
                      <li key={b} className="text-sm text-[var(--color-ink)] flex gap-2.5">
                        <span
                          className="w-1.5 h-1.5 mt-[7px] flex-shrink-0"
                          style={{ backgroundColor: role.color }}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 4 — HOW THE EXPEDITION WORKS (flow)
          ═══════════════════════════════════════════ */}
      <section
        className="px-4 sm:px-6 py-14 sm:py-20"
        style={{ backgroundColor: '#f5f4f1' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--color-ink)] mb-2 text-center">
            How the expedition works
          </h2>
          <p className="text-sm text-[var(--color-muted)] text-center mb-10 max-w-md mx-auto">
            A skill is a reusable AI capability. Built once by a scout,
            used every day by trekkers. That is the whole system.
          </p>

          <div className="relative">
            {/* Vertical connecting line */}
            <div
              className="absolute left-[19px] sm:left-[23px] top-6 bottom-6 w-px"
              style={{ backgroundColor: 'var(--color-border)' }}
            />

            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="relative flex gap-4 sm:gap-5">
                  {/* Number circle */}
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-base font-extrabold text-white font-heading flex-shrink-0 relative z-10"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.num}
                  </div>

                  {/* Content card */}
                  <div
                    className="flex-1 bg-white border border-[var(--color-border)] rounded-[2px] p-4 sm:p-5"
                    style={{ borderLeft: `3px solid ${step.color}` }}
                  >
                    <p className="text-sm font-semibold text-[var(--color-ink)] font-heading mb-1">
                      {step.title}
                    </p>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 5 — KEY INSIGHT CALLOUT
          ═══════════════════════════════════════════ */}
      <section
        className="px-4 sm:px-6 py-14 sm:py-20"
        style={{ backgroundColor: '#D64C00' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug font-heading mb-6">
            This isn&apos;t about individual AI adoption.
            <br className="hidden sm:block" />{' '}
            It&apos;s about coordinated expedition movement.
          </p>

          <div
            className="inline-block bg-white rounded-[2px] px-6 sm:px-8 py-5 text-left max-w-xl w-full"
          >
            <p className="text-sm sm:text-base text-[var(--color-ink)] leading-relaxed">
              Scouts pathfind. Trekkers follow proven routes. Summit maintains
              vision and pace. Everyone has a role, everyone moves forward
              together, and nobody gets left behind.
            </p>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 6 — DEMO CONNECTION (context-aware)
          ═══════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <div
            className="p-6 sm:p-8 rounded-[2px]"
            style={{
              borderLeft: '4px solid var(--color-brand-orange)',
              backgroundColor: 'var(--color-brand-orange-faint)',
            }}
          >
            <h2 className="text-lg sm:text-xl font-bold font-heading text-[var(--color-ink)] mb-3">
              {hasPlayed
                ? 'What you just experienced'
                : 'What the demo shows you'}
            </h2>
            <p className="text-sm text-[var(--color-ink)] leading-relaxed mb-4">
              {hasPlayed
                ? 'Every demo you ran was the trekker experience. You dragged in data, ran a skill, and got results. No coding. No prompt engineering. That is what daily AI use looks like when scouts have done their job.'
                : 'The demo puts you in the shoes of a trekker. You drag in real data, run pre-built skills, and see results instantly. This is what daily AI use looks like when a scout has done their job first.'}
            </p>
            {!hasPlayed && (
              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold font-heading text-white rounded-[2px] transition-colors"
                style={{ backgroundColor: 'var(--color-brand-orange)' }}
              >
                Play the demo
              </Link>
            )}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 7 — 90-DAY ROLLOUT
          ═══════════════════════════════════════════ */}
      <section
        className="px-4 sm:px-6 py-14 sm:py-20"
        style={{ backgroundColor: '#1a1a2e' }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mb-2 text-center">
            The 90-day rollout
          </h2>
          <p className="text-sm text-white/50 text-center mb-10 max-w-md mx-auto">
            You don&apos;t need a year-long transformation project.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                phase: 'Days 1-30',
                title: 'Build the first routes',
                items: [
                  'Summit picks 2-3 high-impact problems',
                  'Scouts build skills for those problems',
                  'Test with real data until reliable',
                ],
              },
              {
                phase: 'Days 31-60',
                title: 'Move the team',
                items: [
                  'Trekkers start using skills daily',
                  'Scouts refine based on feedback',
                  'Measure time saved, quality gained',
                ],
              },
              {
                phase: 'Days 61-90',
                title: 'Compound and expand',
                items: [
                  'Team has 5-10 skills running daily',
                  'Scouts start building the next batch',
                  'Summit picks new problems to solve',
                ],
              },
            ].map((col) => (
              <div
                key={col.phase}
                className="rounded-[2px] p-5 border"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1 font-heading">
                  {col.phase}
                </p>
                <p className="text-sm font-semibold text-white mb-3 font-heading">
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="text-xs text-white/60 flex gap-2">
                      <span className="w-1 h-1 mt-[6px] flex-shrink-0 bg-[#D64C00]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 8 — TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-[var(--color-border)] rounded-[2px] p-5"
              >
                <p className="text-sm text-[var(--color-ink)] leading-relaxed mb-3 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-xs font-semibold text-[var(--color-muted)] font-heading">
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          SECTION 9 — FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--color-ink)] mb-3">
            Start your team&apos;s AI expedition
          </h2>
          <p className="text-sm text-[var(--color-muted)] mb-6 max-w-md mx-auto leading-relaxed">
            Skills. Structure. A system that sticks. See how the Ads to AI
            community is helping teams move from experiments to execution.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://ads2ai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold font-heading text-white rounded-[2px] transition-colors"
              style={{ backgroundColor: '#D64C00' }}
            >
              Learn about Ads to AI
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold font-heading rounded-[2px] transition-colors border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)]"
            >
              &#8592; Back to demo
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
