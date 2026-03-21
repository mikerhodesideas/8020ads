'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useGame, useSkin } from '@/components/game-provider'
import { BadgeGrid } from '@/components/badge-system'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sounds'
import { track } from '@/lib/tracking'

function useAnimatedCounter(target: number, duration: number = 1200): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const pct = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3)
      setValue(Math.round(eased * target))
      if (pct < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

const BONUS_SKILLS = [
  { name: 'On-Page SEO Scorer', description: 'Score any URL against SEO best practices and AI-readiness criteria.' },
  { name: 'GEO Content Auditor', description: 'Audit content for AI citation potential across ChatGPT, Perplexity, and Google AI Overviews.' },
  { name: 'Meta Campaign Auditor', description: 'Full Meta Ads account audit from exported CSV data with scored HTML report.' },
  { name: 'Form Optimization Auditor', description: 'Analyze web form structure, field composition, and UX to estimate abandonment risk.' },
  { name: 'Content Repurposer', description: 'Turn one blog post into platform-specific content for LinkedIn, X, email, and more.' },
  { name: 'Client Onboarding Kit', description: 'Generate onboarding checklists, intake questionnaires, and kickoff agendas from a brief.' },
  { name: 'CSV Analyzer', description: 'Run real statistical analysis on any CSV with Python-powered charts and insights.' },
  { name: 'Reply Drafter', description: 'Draft replies in your tone, auto-detecting platform (email, LinkedIn, community).' },
  { name: 'Search Term Analyzer', description: 'Classify search terms by intent, flag waste, and generate negative keyword lists.' },
  { name: 'Landing Page Auditor', description: 'Audit landing pages against CRO best practices with scored evaluation and prioritized fixes.' },
]

const LEVEL_LEARNINGS = [
  { level: 1, tag: 'Raw AI', detail: 'Drag a file, type a prompt, get a result.' },
  { level: 2, tag: 'Skills', detail: 'One sentence. Finished work.' },
  { level: 3, tag: 'Connected', detail: 'Real tools. Real data. Real safety.' },
]

const AVATAR_CTA: Record<string, {
  headline: string
  primaryLabel: string
  primaryHref?: string
  pitch: string
  secondaryLabel?: string
  secondaryHref?: string
  showBossLetter?: boolean
}> = {
  freelancer: {
    headline: 'Turn Cowork into a service your clients pay for',
    primaryLabel: 'Join Ads to AI',
    primaryHref: 'https://ads2ai.com',
    pitch: "Inside Ads to AI, you'll build skills that make you indispensable. Skills for audits, reporting, campaign builds, and more. Plus a brain system that runs your freelance business.",
  },
  employee: {
    headline: 'Show your boss what AI can do for the team',
    primaryLabel: 'Show Your Boss',
    pitch: "You've seen what one person can do. Imagine your whole team. Ads to AI gives you the skills, the training path, and a letter to present to your manager.",
    secondaryLabel: 'Join Ads to AI',
    secondaryHref: 'https://ads2ai.com',
    showBossLetter: true,
  },
  agency: {
    headline: 'Give every team member an AI co-pilot',
    primaryLabel: 'Set Up Your Team',
    primaryHref: 'https://ads2ai.com',
    pitch: "You just played 9 demos. Your team could run these on real client data tomorrow. Ads to AI includes skills, a brain system, and a setup path for your entire agency.",
    secondaryLabel: 'Book a Strategy Call',
    secondaryHref: 'https://cal.com/ideas/a2ai',
  },
  business: {
    headline: 'Your entire business, powered by AI',
    primaryLabel: 'Join Ads to AI',
    primaryHref: 'https://ads2ai.com',
    pitch: "Email, content, meetings, data analysis, calendar, contacts. The brain system handles all of it. Not just marketing, everything.",
    secondaryLabel: 'Book a Strategy Call',
    secondaryHref: 'https://cal.com/ideas/a2ai',
  },
}

const BOSS_LETTER = `Subject: Proposal \u2014 Ads to AI Membership for AI Scouting

Hi [Manager's Name],

I'm writing to request support for an Ads to AI community membership. I want to propose something slightly different from a typical training request.

You've probably noticed AI is changing how marketing teams operate. The question isn't whether to adopt it \u2014 it's who figures out the right path first, us or our competitors.

That's where I come in.

The Scout role

Organisations that adopt AI well tend to follow a pattern: someone on the team runs ahead, experiments, builds the routes that work, and brings back proven methods for everyone else to implement. I want to be that person for us.

The Ads to AI community is where serious marketers and Google Ads professionals are doing exactly this \u2014 sharing what works, building tools, and documenting the paths. Joining gives me access to that intelligence and the skills to apply it across our work.

What the membership includes:

- The 8020brain system \u2014 a personal AI infrastructure for research, decision making, planning, and execution (works with Claude, ChatGPT, Gemini, and any code editor)
- Courses covering automated reporting, AI analysis, and building autonomous systems
- All Google Ads scripts (ready-to-use automation tools)
- Monthly Q&A calls with practitioners navigating the same challenges
- 1:1 strategy call
- Active community of marketers at the frontier of AI adoption

Business impact:

- Automate repetitive research, reporting, and monitoring tasks \u2014 freeing time for higher-value work
- Build custom tools tailored to our specific needs, without outsourcing
- Apply AI to decision making across campaigns, content, and strategy \u2014 not just one channel
- Surface insights we're currently missing or spending too long to find
- Stay ahead of how AI is reshaping marketing before our competitors do

Investment: \u20AC799/year

What I'll bring back:

I'll document what I learn, share the tools I build, and create simple guides for the team \u2014 turning my experiments into paths others can follow without the trial-and-error.

This isn't just professional development. It's us getting an early read on where marketing is heading, at a relatively low cost, with someone already on the payroll doing the legwork.

Happy to discuss further.

[Your name]`

// Simple SVG connector logos
function GmailLogo() { return <svg viewBox="0 0 24 24" className="w-8 h-8"><path d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20v12z" fill="#EA4335"/><path d="M3 6l9 6 9-6v12H3z" fill="none" stroke="#EA4335" strokeWidth="0"/><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="#666" strokeWidth="1.2"/></svg> }
function CalendarLogo() { return <svg viewBox="0 0 24 24" className="w-8 h-8"><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="#4285F4" strokeWidth="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#4285F4" strokeWidth="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/><text x="12" y="17.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#4285F4">31</text></svg> }
function HubSpotLogo() { return <svg viewBox="0 0 24 24" className="w-8 h-8"><circle cx="12" cy="12" r="3" fill="none" stroke="#FF7A59" strokeWidth="1.5"/><circle cx="12" cy="5" r="1.5" fill="#FF7A59"/><circle cx="12" cy="19" r="1.5" fill="#FF7A59"/><circle cx="5.5" cy="8.5" r="1.5" fill="#FF7A59"/><circle cx="18.5" cy="8.5" r="1.5" fill="#FF7A59"/><circle cx="5.5" cy="15.5" r="1.5" fill="#FF7A59"/><circle cx="18.5" cy="15.5" r="1.5" fill="#FF7A59"/><line x1="12" y1="6.5" x2="12" y2="9" stroke="#FF7A59" strokeWidth="1"/><line x1="12" y1="15" x2="12" y2="17.5" stroke="#FF7A59" strokeWidth="1"/></svg> }
function SlackLogo() { return <svg viewBox="0 0 24 24" className="w-8 h-8"><path d="M6 15a2 2 0 01-2-2 2 2 0 012-2h2v2a2 2 0 01-2 2zm3-2a2 2 0 012-2 2 2 0 012 2v5a2 2 0 01-2 2 2 2 0 01-2-2v-5z" fill="#E01E5A"/><path d="M11 6a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2v2h-2zm2 3a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2h-5a2 2 0 01-2-2 2 2 0 012-2h3z" fill="#36C5F0"/><path d="M18 11a2 2 0 012 2 2 2 0 01-2 2h-2v-2a2 2 0 012-2zm-3 2a2 2 0 01-2 2 2 2 0 01-2-2V8a2 2 0 012-2 2 2 0 012 2v5z" fill="#2EB67D"/><path d="M13 20a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2h-2v-2zm-2-3a2 2 0 01-2 2H4a2 2 0 01-2-2 2 2 0 012-2h5a2 2 0 012 2z" fill="#ECB22E"/></svg> }
function ExcelLogo() { return <svg viewBox="0 0 24 24" className="w-8 h-8"><rect x="4" y="3" width="16" height="18" rx="1" fill="none" stroke="#217346" strokeWidth="1.5"/><path d="M8 8l3.5 4L8 16M12.5 8L16 12l-3.5 4" stroke="#217346" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg> }
function NotionLogo() { return <svg viewBox="0 0 24 24" className="w-8 h-8"><path d="M4 4.5A1.5 1.5 0 015.5 3h9l5.5 5v11.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19.5v-15z" fill="none" stroke="#333" strokeWidth="1.3"/><path d="M14 3v5h5" fill="none" stroke="#333" strokeWidth="1.3"/><line x1="8" y1="12" x2="16" y2="12" stroke="#333" strokeWidth="1" opacity="0.5"/><line x1="8" y1="15" x2="14" y2="15" stroke="#333" strokeWidth="1" opacity="0.5"/></svg> }
function AsanaLogo() { return <svg viewBox="0 0 24 24" className="w-8 h-8"><circle cx="12" cy="7" r="3.5" fill="none" stroke="#F06A6A" strokeWidth="1.5"/><circle cx="6" cy="16" r="3.5" fill="none" stroke="#F06A6A" strokeWidth="1.5"/><circle cx="18" cy="16" r="3.5" fill="none" stroke="#F06A6A" strokeWidth="1.5"/></svg> }
function OutlookLogo() { return <svg viewBox="0 0 24 24" className="w-8 h-8"><rect x="3" y="5" width="18" height="14" rx="1" fill="none" stroke="#0078D4" strokeWidth="1.5"/><path d="M3 5l9 7 9-7" fill="none" stroke="#0078D4" strokeWidth="1.5"/></svg> }
function ClickUpLogo() { return <svg viewBox="0 0 24 24" className="w-8 h-8"><path d="M5 16l7-5 7 5" fill="none" stroke="#7B68EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 11l7-5 7 5" fill="none" stroke="#7B68EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/></svg> }

const CONNECTORS = [
  { name: 'Gmail', Logo: GmailLogo },
  { name: 'Calendar', Logo: CalendarLogo },
  { name: 'HubSpot', Logo: HubSpotLogo },
  { name: 'Slack', Logo: SlackLogo },
  { name: 'Asana', Logo: AsanaLogo },
  { name: 'ClickUp', Logo: ClickUpLogo },
  { name: 'Excel', Logo: ExcelLogo },
  { name: 'Outlook', Logo: OutlookLogo },
  { name: 'Notion', Logo: NotionLogo },
]

export default function VictoryScreen() {
  const router = useRouter()
  const { completed, skills, totalTimeSaved, totalStars, maxStars, isLevelComplete, resetGame, type } = useGame()
  const skin = useSkin()
  const [letterOpen, setLetterOpen] = useState(false)
  const [copyConfirm, setCopyConfirm] = useState(false)
  const [skillPackEmail, setSkillPackEmail] = useState('')
  const [skillPackSubmitting, setSkillPackSubmitting] = useState(false)
  const [skillPackSubmitted, setSkillPackSubmitted] = useState(false)

  const handleSkillPackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSkillPackSubmitting(true)
    try {
      await fetch('https://script.google.com/macros/s/AKfycbzlTFZ3XPRjgSRNbnYsXJxJlEsJ6Z0b0vGsQIgJrTxofJb59COeLu-5RPFdndrRXPHUow/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: skillPackEmail,
          timestamp: new Date().toISOString(),
          source: '8020skill - Skill Pack Claim',
          avatarType: type || 'unknown',
        }),
      })
      setSkillPackSubmitted(true)
      track({ eventType: 'skill_pack_claimed', metadata: { email: skillPackEmail, avatarType: type } })
    } catch (err) {
      console.error('Failed to submit skill pack email:', err)
    } finally {
      setSkillPackSubmitting(false)
    }
  }

  const isLight = skin.victoryLayout === 'light-elegant'
  const isDark = skin.victoryLayout === 'dark-celebration'

  const readinessScore = useMemo(() => {
    const demoPoints = completed.size * 8
    const skillPoints = Math.min(skills.size * 2, 16)
    let levelBonus = 0
    if (isLevelComplete(1)) levelBonus += 4
    if (isLevelComplete(2)) levelBonus += 4
    if (isLevelComplete(3)) levelBonus += 4
    return Math.min(demoPoints + skillPoints + levelBonus, 100)
  }, [completed.size, skills.size, isLevelComplete])

  const animatedScore = useAnimatedCounter(readinessScore, 2000)
  const scoreLabel = useMemo(() => {
    if (readinessScore >= 90) return 'AI-First Ready'
    if (readinessScore >= 70) return 'AI-Amplified'
    if (readinessScore >= 50) return 'AI-Assisted'
    return 'Getting Started'
  }, [readinessScore])


  useEffect(() => {
    track({ eventType: 'victory_reached', avatarType: type })
    if (skin.sounds.victory) {
      const t = setTimeout(() => playSound(skin.sounds.victory!), 400)
      return () => clearTimeout(t)
    }
  }, [skin.sounds.victory, type])

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(BOSS_LETTER)
    setCopyConfirm(true)
    setTimeout(() => setCopyConfirm(false), 2000)
  }

  const accent = 'var(--world-accent)'
  const textPrimary = 'var(--world-text)'
  const textSecondary = 'var(--world-text-secondary)'
  const textMuted = 'var(--world-text-muted)'
  const pageBg = isDark ? 'var(--world-dark)' : '#FAFAF8'
  const cardBg = isLight ? 'white' : 'var(--world-card-bg)'
  const borderColor = isLight ? 'var(--world-data-border)' : 'var(--world-accent)'
  const subtleBorder = isLight ? '#E8E4DF' : 'var(--world-text-muted)'

  return (
    <div className={cn('page-enter min-h-screen relative overflow-hidden', skin.skinClass)} style={{ background: pageBg }}>
      <style>{`
        @keyframes v-float { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-12px) scale(1.02); } }
        @keyframes v-fade-up { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes v-scale-pop { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
        @keyframes v-confetti {
          0% { transform: translateY(-20px) rotate(0deg); opacity:1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity:0; }
        }
        @keyframes v-pulse-glow { 0%,100% { opacity:0.3; } 50% { opacity:0.8; } }
        @keyframes v-draw-ring { from { stroke-dashoffset: 327; } }
        .v-hero-img { animation: v-scale-pop 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.1s both, v-float 5s ease-in-out 1.5s infinite; }
        .v-hero-h1 { animation: v-fade-up 0.6s ease-out 0.3s both; }
        .v-hero-sub { animation: v-fade-up 0.5s ease-out 0.45s both; }
        .v-hero-stats { animation: v-fade-up 0.5s ease-out 0.6s both; }
        .v-s1 { animation: v-fade-up 0.5s ease-out 0.8s both; }
        .v-s2 { animation: v-fade-up 0.5s ease-out 0.95s both; }
        .v-s3 { animation: v-fade-up 0.5s ease-out 1.1s both; }
        .v-s4 { animation: v-fade-up 0.5s ease-out 1.25s both; }
        .v-s5 { animation: v-fade-up 0.5s ease-out 1.4s both; }
        .v-s6 { animation: v-fade-up 0.5s ease-out 1.55s both; }
        .v-confetti-piece { position:fixed; top:-20px; pointer-events:none; z-index:50; animation: v-confetti linear forwards; }
        .v-connector:hover { transform: scale(1.15); }
        .v-connector { transition: transform 0.2s ease; }
        @media (max-width: 768px) {
          .v-level-grid { grid-template-columns: 1fr !important; }
          .v-skill-grid { grid-template-columns: 1fr !important; }
          .v-stat-row { flex-wrap: wrap; gap: 24px !important; }
        }
      `}</style>

      {/* Confetti */}
      {Array.from({ length: 40 }, (_, i) => {
        const colors = ['#D64C00','#1B8C3A','#2563EB','#D97706','#7C3AED','#EC4899','#F59E0B']
        const w = 5 + Math.random() * 10
        const h = 3 + Math.random() * 8
        return <div key={i} className="v-confetti-piece" style={{
          left: `${2 + Math.random() * 96}%`, background: colors[i % colors.length],
          width: w, height: h, animationDuration: `${3 + Math.random() * 4}s`,
          animationDelay: `${Math.random() * 2.5}s`, borderRadius: Math.random() > 0.5 ? '50%' : 0,
        }} />
      })}

      {/* Dark theme stars */}
      {isDark && <div className="absolute inset-0 pointer-events-none">{Array.from({ length: 60 }, (_, i) => (
        <div key={i} className="absolute" style={{
          width: 1 + Math.random() * 2, height: 1 + Math.random() * 2,
          left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
          background: textPrimary, opacity: 0.2 + Math.random() * 0.4,
          animation: `v-pulse-glow ${2+Math.random()*3}s ease-in-out ${Math.random()*2}s infinite`,
        }} />
      ))}</div>}

      <div className="relative z-10" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* ════════════════════════════════════════
            HERO: Big victory image, full-width feel
            ════════════════════════════════════════ */}
        <div className="flex flex-col items-center pt-8 sm:pt-12 pb-10 sm:pb-14">
          {/* Victory image, large and free */}
          <div className="v-hero-img relative w-48 h-48 sm:w-64 sm:h-64 mb-6">
            <Image src={skin.victoryImage} alt={skin.victoryHeading} fill className="object-contain" priority />
          </div>

          <h1
            className="v-hero-h1 font-heading font-extrabold text-center"
            style={{ color: textPrimary, fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: -2 }}
          >
            {skin.victoryHeading}
          </h1>
          <p className="v-hero-sub text-base sm:text-lg font-heading text-center mt-3 mb-10" style={{ color: textMuted, maxWidth: 500 }}>
            You completed all 3 levels. You now know more about AI than 95% of business owners.
          </p>

          {/* Score ring centered, big */}
          <div className="v-hero-stats flex flex-col items-center mb-10">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke={subtleBorder} strokeWidth="5" opacity={0.3} />
                <circle cx="60" cy="60" r="52" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="square"
                  strokeDasharray={`${2*Math.PI*52}`}
                  strokeDashoffset={`${2*Math.PI*52*(1-animatedScore/100)}`}
                  style={{ transition: 'stroke-dashoffset 0.1s ease-out', filter: isDark ? `drop-shadow(0 0 10px ${accent})` : 'none' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading font-extrabold" style={{ color: accent, fontSize: 'clamp(32px, 4vw, 48px)' }}>
                  {animatedScore}
                </span>
                <span className="text-[10px] font-heading font-bold tracking-widest uppercase" style={{ color: textMuted }}>
                  {scoreLabel}
                </span>
              </div>
            </div>

            {/* Stats row, spread out */}
            <div className="v-stat-row flex items-center gap-10 sm:gap-16">
              <StatPill label={skin.victorySkillsLabel} value={String(skills.size)} accent={accent} muted={textMuted} />
              <StatPill label={skin.victoryDemosLabel} value={`${Math.min(completed.size, 9)}/9`} accent={accent} muted={textMuted} />
              <StatPill label="Stars" value={`${totalStars}/${maxStars}`} accent={accent} muted={textMuted} />
              <StatPill label="Time saved" value={totalTimeSaved >= 1 ? `~${Math.round(totalTimeSaved)}h` : `~${Math.round(totalTimeSaved * 60)}m`} accent={accent} muted={textMuted} />
            </div>
          </div>

          {/* Level recap: 3 columns, clean */}
          <div className="v-s1 v-level-grid w-full grid grid-cols-3 gap-4 sm:gap-6">
            {LEVEL_LEARNINGS.map((item) => {
              const done = isLevelComplete(item.level)
              return (
                <div key={item.level} style={{ opacity: done ? 1 : 0.35 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ background: done ? accent : 'transparent', border: `2px solid ${done ? accent : subtleBorder}` }}>
                      {done && <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 7 6 10 11 4" /></svg>}
                    </div>
                    <span className="text-[10px] font-heading font-bold tracking-widest uppercase" style={{ color: done ? accent : textMuted }}>
                      {skin.levelLabel} {item.level}
                    </span>
                  </div>
                  <p className="text-sm font-heading font-bold mb-0.5" style={{ color: textPrimary }}>{item.tag}</p>
                  <p className="text-xs font-heading" style={{ color: textSecondary }}>{item.detail}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: subtleBorder, opacity: 0.5, margin: '0 0 48px' }} />

        {/* ════════════════════════════════════════
            SKILL PACK: the big reward
            ════════════════════════════════════════ */}
        <div className="v-s3 mb-12 p-6 sm:p-8" style={{ background: cardBg, border: `2px solid ${accent}` }}>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold mb-1" style={{ color: textPrimary }}>
              Your Free Skill Pack
            </h2>
            <p className="text-sm font-heading mb-4" style={{ color: textSecondary }}>
              10 Cowork skills + a course on building your own. Worth $99.
            </p>
            {skillPackSubmitted ? (
              <div className="flex items-center gap-3 px-4 py-3" style={{ background: `${accent}15`, border: `1px solid ${accent}40` }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-sm font-heading font-semibold" style={{ color: textPrimary }}>
                  You're in. We'll email you when the skill pack is ready to download.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSkillPackSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={skillPackEmail}
                  onChange={e => setSkillPackEmail(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm font-heading border focus:outline-none focus:ring-2"
                  style={{ borderColor: subtleBorder, color: textPrimary, background: 'transparent', focusRingColor: accent } as React.CSSProperties}
                />
                <button
                  type="submit"
                  disabled={skillPackSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-heading font-bold text-sm text-white transition-opacity hover:opacity-90 flex-shrink-0 disabled:opacity-50"
                  style={{ background: accent }}
                >
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 2v8" /><path d="M4 7l3 3 3-3" /><path d="M2 12h10" />
                  </svg>
                  {skillPackSubmitting ? 'Sending...' : 'Claim your free skill pack'}
                </button>
              </form>
            )}
          </div>

          <div className="v-skill-grid grid grid-cols-2 gap-x-8 gap-y-1">
            {BONUS_SKILLS.map((skill, i) => (
              <div key={skill.name} className="flex items-baseline gap-3 py-2" style={{ borderBottom: `1px solid ${subtleBorder}40` }}>
                <span className="text-[10px] font-heading font-bold tabular-nums flex-shrink-0" style={{ color: textMuted, minWidth: 18 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <span className="text-sm font-heading font-bold" style={{ color: textPrimary }}>{skill.name} </span>
                  <span className="text-xs font-heading" style={{ color: textMuted }}>{skill.description}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-3 mt-4 pt-3" style={{ borderTop: `1px solid ${subtleBorder}` }}>
            <span className="text-xs font-heading font-bold flex-shrink-0" style={{ color: accent }}>+</span>
            <div>
              <span className="text-sm font-heading font-bold" style={{ color: textPrimary }}>Build Your Own Skills </span>
              <span className="text-xs font-heading" style={{ color: textMuted }}>A short course on creating custom skills. No coding required.</span>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            AVATAR CTA
            ════════════════════════════════════════ */}
        {type && AVATAR_CTA[type] && (
          <div className="v-s4 mb-12 p-6 sm:p-8" style={{ background: cardBg, border: `1px solid ${subtleBorder}` }}>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold mb-2" style={{ color: accent }}>
              {AVATAR_CTA[type].headline}
            </h2>
            <p className="text-sm font-heading mb-6 leading-relaxed" style={{ color: textSecondary, maxWidth: 600 }}>
              {AVATAR_CTA[type].pitch}
            </p>

            {AVATAR_CTA[type].showBossLetter && (
              <div className="mb-6">
                <button
                  onClick={() => setLetterOpen(!letterOpen)}
                  className="w-full text-left px-4 py-3 font-heading font-semibold text-sm flex items-center justify-between"
                  style={{ border: `2px solid ${subtleBorder}`, color: textPrimary }}
                >
                  <span>{letterOpen ? 'Hide Letter' : 'View Pre-Written Letter for Your Boss'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('transition-transform', letterOpen && 'rotate-180')}><polyline points="4 6 8 10 12 6" /></svg>
                </button>
                {letterOpen && (
                  <div className="px-4 py-4 font-mono text-xs leading-relaxed whitespace-pre-wrap border-2 border-t-0" style={{ borderColor: subtleBorder, background: isDark ? 'rgba(0,0,0,0.3)' : '#FAFAF8', color: textSecondary }}>
                    {BOSS_LETTER}
                    <button onClick={handleCopyLetter} className="mt-4 px-4 py-2 font-heading font-bold text-xs text-white" style={{ background: accent }}>
                      {copyConfirm ? 'Copied!' : 'Copy Letter'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {AVATAR_CTA[type].primaryHref ? (
                <a href={AVATAR_CTA[type].primaryHref} target="_blank" rel="noopener noreferrer"
                  onClick={() => track({ eventType: 'cta_clicked', metadata: { label: AVATAR_CTA[type].primaryLabel, avatarType: type } })}
                  className="text-center px-8 py-3 font-heading font-bold text-sm text-white" style={{ background: accent }}>
                  {AVATAR_CTA[type].primaryLabel}
                </a>
              ) : (
                <button onClick={() => { track({ eventType: 'cta_clicked', metadata: { label: AVATAR_CTA[type].primaryLabel, avatarType: type } }); setLetterOpen(!letterOpen) }}
                  className="text-center px-8 py-3 font-heading font-bold text-sm text-white" style={{ background: accent }}>
                  {AVATAR_CTA[type].primaryLabel}
                </button>
              )}
              {AVATAR_CTA[type].secondaryLabel && AVATAR_CTA[type].secondaryHref && (
                <a href={AVATAR_CTA[type].secondaryHref} target="_blank" rel="noopener noreferrer"
                  onClick={() => track({ eventType: 'cta_clicked', metadata: { label: AVATAR_CTA[type].secondaryLabel, avatarType: type } })}
                  className="text-center px-8 py-3 font-heading font-bold text-sm" style={{ border: `2px solid ${subtleBorder}`, color: textPrimary }}>
                  {AVATAR_CTA[type].secondaryLabel}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Extra A2AI nudge */}
        {type && (!AVATAR_CTA[type]?.primaryHref || AVATAR_CTA[type].primaryHref !== 'https://ads2ai.com') && (
          <div className="v-s5 mb-12 py-8 text-center">
            <p className="text-sm font-heading mb-4" style={{ color: textSecondary }}>
              Get access to ready-made skills, training, and a community of people building with AI.
            </p>
            <a href="https://ads2ai.com" target="_blank" rel="noopener noreferrer"
              onClick={() => track({ eventType: 'cta_clicked', metadata: { label: 'Join Ads to AI', avatarType: type } })}
              className="inline-flex px-8 py-3 font-heading font-bold text-sm text-white" style={{ background: accent }}>
              Join Ads to AI
            </a>
          </div>
        )}

        {/* ════════════════════════════════════════
            CONNECTORS: Real logos, not boxes
            ════════════════════════════════════════ */}
        <div className="v-s5 mb-12">
          <p className="text-[10px] font-heading font-bold tracking-widest uppercase text-center mb-6" style={{ color: textMuted }}>
            Cowork connects to your tools
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {CONNECTORS.map(({ name, Logo }) => (
              <div key={name} className="v-connector flex flex-col items-center gap-1.5 cursor-default">
                <Logo />
                <span className="text-[10px] font-heading" style={{ color: textMuted }}>{name}</span>
              </div>
            ))}
          </div>
        </div>


        {/* ════════════════════════════════════════
            FOOTER
            ════════════════════════════════════════ */}
        <div className="flex items-center justify-center gap-4 pb-16 pt-4">
          <button onClick={() => router.push('/play')} className="px-6 py-3 font-heading font-bold text-sm" style={{ border: `2px solid ${subtleBorder}`, color: textPrimary }}>
            Back to Map
          </button>
          <button onClick={() => { resetGame(); router.push('/') }} className="px-6 py-3 font-heading text-sm" style={{ color: textMuted }}>
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}

function StatPill({ label, value, accent, muted }: { label: string; value: string; accent: string; muted: string }) {
  return (
    <div className="text-center">
      <p className="text-xl sm:text-2xl font-heading font-extrabold tabular-nums" style={{ color: accent, lineHeight: 1 }}>{value}</p>
      <p className="text-[9px] font-heading font-bold tracking-widest uppercase mt-1" style={{ color: muted }}>{label}</p>
    </div>
  )
}
