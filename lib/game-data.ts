export type PlayerType = 'agency' | 'employee' | 'freelancer' | 'business'
export type WorldId = 'gallery' | 'arcade'

export interface World {
  id: WorldId
  name: string
  tagline: string
  image: string
}

export interface Demo {
  id: number
  icon: string
  title: string
  subtitle: string
  pain: string
  fix: string
  tryThis: string
  dataType: 'table' | 'file-list' | 'text' | 'html-preview'
  dataLabel?: string
  dataHeaders?: string[]
  dataRows?: { cells: string[]; highlight?: boolean; muted?: boolean }[]
  dataFiles?: string[]
  dataText?: string[]
  dragFile?: { name: string; path: string; mime: string }
  beforeFile?: string
  afterFile?: string
  skillId?: string
  wowStat?: string
  wowTime?: string
}

export interface Level {
  id: number
  name: string
  subtitle: string
  demos: Demo[]
  comingSoon?: boolean
}

export const worlds: World[] = [
  {
    id: 'gallery',
    name: 'The Gallery',
    tagline: 'Painterly landscapes, golden paths, elegant discovery',
    image: '/images/worlds/gallery.png',
  },
  {
    id: 'arcade',
    name: 'The Arcade',
    tagline: 'Bright colours, bold shapes, playful adventure',
    image: '/images/worlds/arcade.png',
  },
]

// Demo content - separated from presentation
const demoWebsite: Demo = {
  id: 1,
  icon: '\u{1F480}',
  title: 'My website is embarrassing',
  subtitle: "Every day it stays live, you're losing deals you'll never know about",
  pain: 'You know that moment when a prospect says "I checked out your website" and your stomach drops? Comic Sans. Stock photos from 2012. A "Under Construction" gif that\'s been there for three years. Every day it stays live, you\'re losing deals you\'ll never know about.',
  fix: 'Drop the current site into AI and get a complete teardown with specific fixes, priority-ranked. Then get a rebuilt version in minutes, not months.',
  tryThis: 'Use the frontend-design skill to review this website and rebuild it as a clean, modern single page. Keep the same content but make it professional.',
  dataType: 'html-preview',
  dataLabel: 'Current Website',
  dataText: [
    '\u{1F6A7} WELCOME TO THUNDERBOLT ELECTRICALS!!! \u{1F6A7}',
    'Your #1 Source for ALL Electrical Needs!!!!',
    '>>> CLICK HERE FOR SPECIALS <<<',
    'We do: \u2022 Wiring \u2022 Rewiring \u2022 More Wiring \u2022 Other Stuff',
    "Call NOW: 555-BOLT (but not between 12-2, that's lunch)",
    'Last updated: March 2019',
    '\u{1F477} Site best viewed in Internet Explorer 6.0 \u{1F477}',
  ],
  dragFile: {
    name: 'crappy-website.html',
    path: '/demo-assets/crappy-website/index.html',
    mime: 'text/html',
  },
  beforeFile: '/demo-assets/before-after/before-website.html',
  afterFile: '/demo-assets/before-after/after-website.html',
  skillId: 'website-designer',
  wowStat: 'Complete redesign in 47 seconds',
  wowTime: '47 seconds',
}

const demoSearchTerms: Demo = {
  id: 2,
  icon: '\u{1F525}',
  title: '2,000 search terms sitting untouched',
  subtitle: "The wasted spend is in there somewhere. You just can't find it.",
  pain: 'You exported 2,000 search terms last Tuesday. They\'re still sitting in the spreadsheet, untouched. Somewhere in there, "emergency plumber near me" is converting at $12 a lead while "how to fix a leaky tap DIY" burns $40 a click. You just don\'t know which is which.',
  fix: 'AI reads every row, flags the waste, finds the winners, and gives you the exact negatives to add and keywords to scale. In about 60 seconds.',
  tryThis: 'Use the search-term-analyzer skill to analyse these search terms. Find the wasted spend and give me a negative keyword list, plus the top performers to scale.',
  dataType: 'table',
  dataLabel: 'Search Terms Export',
  dataHeaders: ['Search term', 'Clicks', 'Cost', 'Conv.'],
  dataRows: [
    { cells: ['emergency plumber near me', '847', '$4,235', '71'] },
    { cells: ['24 hour plumber melbourne', '523', '$2,876', '44'] },
    { cells: ['how to fix leaky tap diy', '312', '$1,560', '0'], highlight: true },
    { cells: ['plumber salary australia', '89', '$445', '0'], highlight: true },
    { cells: ['plumbing memes funny', '67', '$335', '0'], highlight: true },
    { cells: ['blocked drain specialist', '234', '$1,404', '19'] },
    { cells: ['is plumbing hard to learn', '45', '$225', '0'], highlight: true },
    { cells: ['+ 239 more rows...', '', '', ''], muted: true },
  ],
  dragFile: {
    name: 'search-terms.csv',
    path: '/demo-assets/sample-csvs/search-terms.csv',
    mime: 'text/csv',
  },
  beforeFile: '/demo-assets/before-after/before-analysis.html',
  afterFile: '/demo-assets/before-after/after-analysis.html',
  skillId: 'data-analyst',
  wowStat: '210 search terms classified in 12 seconds',
  wowTime: '12 seconds',
}

const demoDataAnalysis: Demo = {
  id: 7,
  icon: '\u{1F4C9}',
  title: 'P&L arrives. You nod wisely and close it.',
  subtitle: "Revenue's up but profit's down. Not sure why.",
  pain: "Your accountant sends the P&L every month. You open it, see rows of numbers, nod wisely, and close it. Revenue's up but profit's down and you're not sure why. The spreadsheet has the answers but you'd need an MBA to decode it.",
  fix: "AI reads your P&L like a CFO, explains what's actually happening in plain English, spots the trends you'd miss, and tells you the three things you should do about it.",
  tryThis: "Use the csv-analyzer skill to analyse this P&L. Tell me in plain English: are we healthy? What's the trend? What should I be worried about? Give me 3 actions.",
  dataType: 'table',
  dataLabel: 'Monthly P&L',
  dataHeaders: ['Month', 'Revenue', 'Expenses', 'Profit', 'Margin'],
  dataRows: [
    { cells: ['Apr 2025', '$82,000', '$71,000', '$11,000', '13.4%'] },
    { cells: ['May 2025', '$85,000', '$74,000', '$11,000', '12.9%'] },
    { cells: ['Jun 2025', '$79,000', '$76,000', '$3,000', '3.8%'], highlight: true },
    { cells: ['Jul 2025', '$91,000', '$78,000', '$13,000', '14.3%'] },
    { cells: ['...', '...', '...', '...', '...'], muted: true },
    { cells: ['Mar 2026', '$103,000', '$89,000', '$14,000', '13.6%'] },
  ],
  dragFile: {
    name: 'monthly-pnl.csv',
    path: '/data/monthly-pnl.csv',
    mime: 'text/csv',
  },
  beforeFile: '/demo-assets/before-after/before-analysis.html',
  afterFile: '/demo-assets/before-after/after-analysis.html',
  skillId: 'data-analyst',
  wowStat: '12-month P&L decoded in 8 seconds',
  wowTime: '8 seconds',
}

const demoEmail: Demo = {
  id: 4,
  icon: '\u{1F4E8}',
  title: '50 emails by 9am Monday',
  subtitle: "There's a client escalation buried in there. Somewhere.",
  pain: "It's 8:47am Monday. You've got 50 unread emails. Somewhere in there is a client escalation that needed a response Friday, a board meeting agenda you haven't read, and a sales report with numbers you need for a 10am call. You're scrolling, scanning, guessing.",
  fix: "AI triages everything: what's urgent, what's informational, what can wait. You get a priority list with summaries so you can act on the right things first.",
  tryThis: "Use the inboxy skill to triage these 5 messages. Tell me what's urgent, what needs action today, and what can wait. Give me a priority order.",
  dataType: 'file-list',
  dataLabel: 'Monday Inbox (5 items)',
  dataFiles: [
    'urgent-escalation.txt',
    'sales-report-weekly.txt',
    'team-update-ellie.txt',
    'board-meeting-reminder.txt',
    'feature-request-feedback.txt',
  ],
  dragFile: {
    name: 'monday-inbox',
    path: '/data/monday-inbox',
    mime: 'application/octet-stream',
  },
  beforeFile: '/demo-assets/before-after/before-triage.html',
  afterFile: '/demo-assets/before-after/after-triage.html',
  skillId: 'inbox-commander',
  wowStat: '12 emails triaged in 8 seconds',
  wowTime: '8 seconds',
}

// Get Level 1 demos based on player type
// Search terms for agency/employee/freelancer, P&L for business
export function getLevel1Demos(type: PlayerType): Demo[] {
  const dataDemo = type === 'business' ? demoDataAnalysis : demoSearchTerms
  return [demoWebsite, dataDemo, demoEmail]
}

// Skill definitions per demo
export interface DemoSkill {
  id: string
  name: string
  capabilities: string[]
}

export const DEMO_SKILLS: Record<number, DemoSkill> = {
  1: { id: 'website-designer', name: 'Website Designer', capabilities: ['Layout understanding', 'Visual hierarchy', 'Conversion optimization', 'Brand consistency'] },
  2: { id: 'data-analyst', name: 'Data Analyst', capabilities: ['Pattern recognition', 'Waste detection', 'Actionable recommendations', 'Trend analysis'] },
  7: { id: 'data-analyst', name: 'Data Analyst', capabilities: ['Pattern recognition', 'Waste detection', 'Actionable recommendations', 'Trend analysis'] },
  4: { id: 'inbox-commander', name: 'Inbox Commander', capabilities: ['Priority scoring', 'Context awareness', 'Action extraction', 'Response drafting'] },
}

// Hours saved per demo (for stats display)
export const DEMO_TIME_SAVED: Record<number, number> = {
  1: 80,
  2: 4,
  7: 4,
  4: 0.7,
}

// All possible Level 1 demo IDs (varies by player type)
export const ALL_LEVEL_1_IDS = new Set([1, 2, 4, 7])

// Unique skill IDs in Level 1
export const LEVEL_1_SKILL_IDS = new Set(['website-designer', 'data-analyst', 'inbox-commander'])

export function getLevels(type: PlayerType): Level[] {
  return [
    {
      id: 1,
      name: 'First Light',
      subtitle: 'Zero setup. Instant results. See what AI can really do.',
      demos: getLevel1Demos(type),
    },
    {
      id: 2,
      name: 'Going Deeper',
      subtitle: 'More complex problems. Bigger payoffs.',
      demos: [],
      comingSoon: true,
    },
    {
      id: 3,
      name: 'The Real World',
      subtitle: 'Connect your own tools. Use your own data.',
      demos: [],
      comingSoon: true,
    },
  ]
}
