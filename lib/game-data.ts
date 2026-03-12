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
  missionBrief?: string
  beforeReaction?: string
  afterReaction?: string
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
  beforeStages?: string[]
  afterStages?: string[]
  choices?: {
    label: string
    options: {
      id: string
      name: string
      description: string
      beforeStages?: string[]
      afterStages?: string[]
      reactionLine1?: string
      reactionLine2?: string
      reactionAfterLine?: string
      wowStatText?: string
    }[]
  }
  promptStrategies?: {
    id: string
    name: string
    promptText: string
    afterStages: string[]
    reactionAfterLine: string
    quality: 'direct' | 'structured' | 'expert'
  }[]
  resultTiers?: {
    direct: { wowMultiplier: number; reaction: string }
    structured: { wowMultiplier: number; reaction: string }
    expert: { wowMultiplier: number; reaction: string }
  }
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
    tagline: 'Bright worlds, power-ups, and that classic game feel',
    image: '/images/worlds/arcade.png',
  },
]

// Demo content - separated from presentation
const demoWebsite: Demo = {
  id: 1,
  icon: '\u{1F480}',
  title: 'My website is embarrassing',
  subtitle: "Every day it stays live, you're losing deals you'll never know about",
  missionBrief: "ALERT: Thunderbolt Electricals' website looks like it escaped from 1999. The business is bleeding leads every hour it stays live. Your mission: use AI to redesign it in under a minute.",
  beforeReaction: "Three columns, comic sans, and a visitor counter from 2003. This is going to need more than a fresh coat of paint.",
  afterReaction: "From 1999 to 2026 in 47 seconds. That's what a power-up does.",
  pain: 'You know that moment when a prospect says "I checked out your website" and your stomach drops? Old stock photos. No new blog posts for three years. Last award 2018. Every day it stays live, you\'re losing deals you\'ll never know about.',
  fix: 'Drop the current URL into Cowork and get three new (modern) versions in minutes, not months.',
  tryThis: 'Please create 3 new versions of this website, using the frontend-design skill each with a very different style: (1) Clean and conservative, minimal colour, lots of whitespace, understated typography. (2) Big and bold, strong colour, oversized headings, high contrast. (3) Warm and friendly, approachable feel, soft colours, rounded elements. Use the frontend-design skill. Keep the same content but make each version look like a completely different designer built it.',
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
  beforeStages: [
    'Scanning current layout... 3 columns detected',
    'Evaluating visual hierarchy...',
    'Generating responsive design...',
  ],
  afterStages: [
    'Loading Website Designer skill...',
    'Applying conversion optimization patterns...',
    'Generating 3 design variants...',
  ],
  choices: {
    label: 'Choose target audience',
    options: [
      {
        id: 'b2b',
        name: 'B2B',
        description: 'Corporate / Enterprise',
        beforeStages: [
          'Scanning current layout... 3 columns detected',
          'Evaluating for B2B decision-makers...',
          'Optimizing for lead generation...',
        ],
        afterStages: [
          'Loading Website Designer skill...',
          'Applying enterprise conversion patterns...',
          'Building trust signals for buyers...',
          'Generating professional design...',
        ],
        reactionLine1: 'Corporate enough for the boardroom...',
        reactionLine2: 'But it needs real B2B conversion power.',
        reactionAfterLine: 'Enterprise-grade. Your prospects will take you seriously now.',
        wowStatText: 'B2B redesign in 47 seconds',
      },
      {
        id: 'b2c',
        name: 'B2C',
        description: 'Consumer / E-commerce',
        beforeStages: [
          'Scanning current layout... 3 columns detected',
          'Evaluating for consumer shopping behavior...',
          'Optimizing for mobile conversions...',
        ],
        afterStages: [
          'Loading Website Designer skill...',
          'Applying e-commerce best practices...',
          'Building product showcase layout...',
          'Generating consumer-friendly design...',
        ],
        reactionLine1: 'Looks more like a real store now...',
        reactionLine2: 'But consumers expect more polish.',
        reactionAfterLine: 'Now THAT makes people want to buy.',
        wowStatText: 'E-commerce redesign in 47 seconds',
      },
      {
        id: 'local',
        name: 'Local Service',
        description: 'Small business / Trades',
        beforeStages: [
          'Scanning current layout... 3 columns detected',
          'Evaluating for local search visibility...',
          'Optimizing for phone calls and bookings...',
        ],
        afterStages: [
          'Loading Website Designer skill...',
          'Applying local service patterns...',
          'Building trust signals for local buyers...',
          'Generating service-area design...',
        ],
        reactionLine1: 'People can actually find you now...',
        reactionLine2: "But it needs that 'call now' punch.",
        reactionAfterLine: 'Local customers will be calling within minutes.',
        wowStatText: 'Local service redesign in 47 seconds',
      },
    ],
  },
}

const demoSearchTerms: Demo = {
  id: 2,
  icon: '\u{1F525}',
  title: '2,000 search terms sitting untouched',
  subtitle: "The wasted spend is in there somewhere. You just can't find it.",
  missionBrief: "WARNING: 2,000 search terms sitting in a spreadsheet, untouched for a week. Wasted spend is hiding in there. Your mission: find the money pit and plug it.",
  beforeReaction: "247 search terms, 12 obvious negatives, and $2,340 in wasted spend. At least now we can see the mess.",
  afterReaction: "210 terms classified, waste flagged, winners highlighted. Your Tuesday spreadsheet just became a Friday action plan.",
  pain: 'You exported 2,000 search terms last Tuesday. They\'re still sitting in the spreadsheet, untouched. Somewhere in there, "emergency plumber near me" is converting at $12 a lead while "how to fix a leaky tap DIY" burns $40 a click. You just don\'t know which is which.',
  fix: 'Cowork reads every row, flags the waste, finds the winners, and gives you the exact negatives to add and keywords to scale. In about 60 seconds.',
  tryThis: 'Use the search-term-analyzer skill to build me an interactive HTML report from these search terms. I want: (1) A visual breakdown showing exactly where my budget is going, with charts by intent category showing waste vs winners. (2) A filterable, sortable table of every search term color-coded by recommendation: add as keyword (green), add as negative (red), monitor (amber). (3) A ready-to-paste negative keyword list grouped by theme. (4) My top 10 money-makers with specific scaling recommendations and projected impact. Make this something I can send to a client and they immediately understand where their money went.',
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
  beforeStages: [
    'Reading 247 search terms...',
    'Flagging 12 negative candidates...',
    'Calculating wasted spend: $2,340...',
  ],
  afterStages: [
    'Loading Data Analyst skill...',
    'Applying pattern recognition...',
    'Classifying terms by intent...',
    'Generating actionable report...',
  ],
}

const demoDataAnalysis: Demo = {
  id: 7,
  icon: '\u{1F4C9}',
  title: 'P&L arrives. You nod wisely and close it.',
  subtitle: "Revenue's up but profit's down. Not sure why.",
  missionBrief: "INCOMING: Monthly P&L from your accountant. Revenue up, profit down. Nobody knows why. Your mission: decode the numbers before the board meeting.",
  beforeReaction: "Twelve months of data and the only trend line going up is expenses. That June dip needs explaining.",
  afterReaction: "CFO-level analysis in 8 seconds. The board meeting just went from scary to strategic.",
  pain: "Your accountant sends the P&L every month. You open it, see rows of numbers, nod wisely, and close it. Revenue's up but profit's down and you're not sure why. The spreadsheet has the answers but you'd need an MBA to decode it.",
  fix: "Cowork reads your P&L like a CFO, explains what's actually happening in plain English, spots the trends you'd miss, and tells you the three things you should do about it.",
  tryThis: "Use the csv-analyzer skill to analyse this P&L like a fractional CFO would. Build me an interactive financial dashboard with: (1) Revenue and profit trend lines with growth rates annotated on the chart. (2) Expense breakdown showing which categories are growing fastest relative to revenue. (3) Margin analysis: gross, operating, and net margin trends over 12 months. (4) A cash flow health indicator showing whether we are trending toward trouble or building runway. (5) Three specific, prioritised actions with projected financial impact for each. Do not just show me the numbers. Tell me the story they are telling and what I should do about it.",
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
  beforeFile: '/demo-assets/before-after/before-pnl.html',
  afterFile: '/demo-assets/before-after/after-pnl.html',
  skillId: 'data-analyst',
  wowStat: '12-month P&L decoded in 8 seconds',
  wowTime: '8 seconds',
  beforeStages: [
    'Parsing 12-month financial data...',
    'Calculating margin trends...',
    'Identifying anomalies...',
  ],
  afterStages: [
    'Loading Data Analyst skill...',
    'Applying CFO-level analysis...',
    'Modeling cash flow projections...',
    'Generating financial dashboard...',
  ],
}

const demoEmail: Demo = {
  id: 4,
  icon: '\u{1F4E8}',
  title: '50 emails by 9am Monday',
  subtitle: "There's a client escalation buried in there. Somewhere.",
  missionBrief: "INCOMING: 50 unread emails. Monday morning. Somewhere in that pile, a client escalation is going nuclear. Your mission: triage everything before the 10am call.",
  beforeReaction: "50 emails sorted by... time received. That's not a triage, that's a to-do list with anxiety.",
  afterReaction: "Urgent items surfaced, responses drafted, meeting prep done. Monday just got a lot shorter.",
  pain: "It's 8:47am Monday. You've got 50 unread emails. Somewhere in there is a client escalation that needed a response Friday, a board meeting agenda you haven't read, and a sales report with numbers you need for a 10am call. You're scrolling, scanning, guessing.",
  fix: "Cowork triages everything: what's urgent, what's informational, what can wait. You get a priority list with summaries so you can act on the right things first.",
  tryThis: "Use the inboxy skill to process these messages and build me a Monday Morning Dashboard as an interactive HTML page. I want: (1) A priority matrix with every message plotted by urgency and impact. (2) Draft replies for anything marked urgent, ready to send, not templates. (3) A 30-second executive summary I can scan before my first meeting. (4) Time estimates for each action item so I can plan my morning. (5) Anything that can be delegated, flagged with a suggested owner and forwarding message.",
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
  beforeStages: [
    'Scanning 50 unread messages...',
    'Scoring priority by sender and subject...',
    'Drafting response summaries...',
  ],
  afterStages: [
    'Loading Inbox Commander skill...',
    'Applying priority scoring matrix...',
    'Extracting action items...',
    'Generating Monday dashboard...',
  ],
}

// Get Level 1 demos based on player type
// Search terms for agency/employee/freelancer, P&L for business
export function getLevel1Demos(type: PlayerType): Demo[] {
  const dataDemo = type === 'business' ? demoDataAnalysis : demoSearchTerms
  return [demoWebsite, dataDemo, demoEmail]
}

// === LEVEL 2 DEMOS ===

const demoContacts: Demo = {
  id: 5,
  icon: '\u{1F4C7}',
  title: 'CRM contacts going cold',
  subtitle: 'Deals are dying quietly. Your follow-up list is a graveyard.',
  missionBrief: "ALERT: A $22K deal hasn't heard from you in 90 days. Your CRM is a graveyard of good intentions. Your mission: find the deals worth saving.",
  beforeReaction: "50 contacts and no priority order. The $22K deal is buried on row 37 next to a dead lead from last year.",
  afterReaction: "50 contacts ranked, top 5 flagged, opening lines written. Your graveyard just got a resurrection.",
  pain: "You exported your CRM contacts last month and never looked back. Somewhere in that list, a $22K deal hasn't heard from you in 90 days. A referral from your best client is going cold. The spreadsheet has 50 contacts but you don't know which 5 need attention TODAY.",
  fix: "AI reads every contact, calculates urgency based on deal value and days since last touch, and gives you a prioritized 'call these people today' list with suggested opening lines.",
  tryThis: 'Use the followups skill to analyse these CRM contacts. Find the deals at risk and give me a priority list with suggested actions for each.',
  dataType: 'table',
  dataLabel: 'CRM Contacts Export',
  dataHeaders: ['Contact', 'Company', 'Last Contact', 'Deal Value', 'Stage'],
  dataRows: [
    { cells: ['Rachel Thompson', 'Peppercorn Early Learning', 'Jan 10', '$18,500', 'Negotiation'] },
    { cells: ['James O\'Brien', 'Bright Horizons', 'Mar 15', '$12,000', 'Qualified'] },
    { cells: ['Sarah Mitchell', 'Little Stars Hawthorn', 'Dec 18', '$22,000', 'Proposal'], highlight: true },
    { cells: ['David Chen', 'Sunshine Early Learning', 'Jan 5', '$8,500', 'Lead'], highlight: true },
    { cells: ['+ 46 more contacts...', '', '', '', ''], muted: true },
  ],
  dragFile: {
    name: 'hubspot-contacts.csv',
    path: '/data/hubspot-contacts.csv',
    mime: 'text/csv',
  },
  beforeFile: '/demo-assets/before-after/before-contacts.html',
  afterFile: '/demo-assets/before-after/after-contacts.html',
  skillId: 'crm-strategist',
  wowStat: '50 contacts prioritized in 9 seconds',
  wowTime: '9 seconds',
  beforeStages: [
    'Reading 50 CRM contacts...',
    'Calculating days since last touch...',
    'Flagging at-risk deals...',
  ],
  afterStages: [
    'Loading CRM Strategist skill...',
    'Applying deal risk scoring...',
    'Generating personalized outreach...',
    'Prioritizing follow-up list...',
  ],
  promptStrategies: [
    {
      id: 'direct',
      name: 'DIRECT',
      promptText: 'Analyze this data and give me recommendations',
      afterStages: [
        'Loading CRM Strategist skill...',
        'Scanning contact list...',
        'Generating basic recommendations...',
      ],
      reactionAfterLine: "Basic contact list... but you're missing the high-value signals.",
      quality: 'direct',
    },
    {
      id: 'structured',
      name: 'STRUCTURED',
      promptText: 'Analyze this data. Group by category. Show percentages. Highlight top 3.',
      afterStages: [
        'Loading CRM Strategist skill...',
        'Grouping contacts by risk tier...',
        'Calculating urgency percentages...',
        'Highlighting top 3 at-risk deals...',
      ],
      reactionAfterLine: 'Structured and clear. The priority groupings make this actionable.',
      quality: 'structured',
    },
    {
      id: 'expert',
      name: 'EXPERT',
      promptText: 'Act as a senior analyst. Start with the executive summary. Flag anomalies. Recommend next steps with confidence scores.',
      afterStages: [
        'Loading CRM Strategist skill...',
        'Building deal velocity model...',
        'Cross-referencing engagement signals...',
        'Scoring confidence per recommendation...',
        'Generating executive action plan...',
      ],
      reactionAfterLine: 'Executive-grade analysis. Confidence scores on every recommendation.',
      quality: 'expert',
    },
  ],
  resultTiers: {
    direct: { wowMultiplier: 0.4, reaction: 'Hmm. Better than before... but something\'s missing.' },
    structured: { wowMultiplier: 0.7, reaction: 'Solid work. Structured output makes a real difference.' },
    expert: { wowMultiplier: 1.0, reaction: 'Executive-grade analysis. Confidence scores on every recommendation.' },
  },
}

const demoCampaign: Demo = {
  id: 6,
  icon: '\u{1F4CA}',
  title: 'Marketing spend across 4 channels',
  subtitle: "You're spending $8K/month but can't tell which channel actually works.",
  missionBrief: "WARNING: $8K/month across 4 channels. Your boss wants answers by Friday. Your mission: find the money pit and the goldmine.",
  beforeReaction: "Four dashboards, four different metrics, and LinkedIn is burning cash like it's going out of style.",
  afterReaction: "All channels normalized, winner identified, budget reallocation ready. Friday's meeting just got easy.",
  pain: "Google Ads, Facebook, LinkedIn, Email. Four dashboards, four different metrics, four sets of numbers that don't talk to each other. You're spending $8K/month and your boss wants to know which channel to double down on. You've been 'getting to it' for three weeks.",
  fix: 'AI normalizes all channels into one view, calculates true cost per acquisition, spots the winner and the money pit, and tells you exactly where to shift budget.',
  tryThis: 'Use the csv-analyzer skill to analyse this cross-channel campaign data. Compare channels by CPA, find the biggest budget waste, and recommend a reallocation strategy.',
  dataType: 'table',
  dataLabel: 'Cross-Channel Campaign Data (3 months)',
  dataHeaders: ['Channel', 'Cost', 'Clicks', 'Conv.', 'Revenue'],
  dataRows: [
    { cells: ['Google Ads - Brand', '$3,420', '2,850', '180', '$27,000'] },
    { cells: ['Google Ads - Generic', '$5,040', '1,680', '42', '$6,300'] },
    { cells: ['Facebook', '$2,550', '1,700', '38', '$5,700'] },
    { cells: ['LinkedIn', '$4,200', '840', '12', '$1,800'], highlight: true },
    { cells: ['Email', '$180', '2,400', '96', '$14,400'] },
    { cells: ['3 months aggregated', '', '', '', ''], muted: true },
  ],
  dragFile: {
    name: 'campaign-data.csv',
    path: '/data/campaign-data.csv',
    mime: 'text/csv',
  },
  beforeFile: '/demo-assets/before-after/before-campaign.html',
  afterFile: '/demo-assets/before-after/after-campaign.html',
  skillId: 'channel-optimizer',
  wowStat: '4 channels compared in 6 seconds',
  wowTime: '6 seconds',
  beforeStages: [
    'Importing 4-channel campaign data...',
    'Normalizing cross-channel metrics...',
    'Calculating true CPA by channel...',
  ],
  afterStages: [
    'Loading Channel Optimizer skill...',
    'Applying CPA normalization...',
    'Modeling budget reallocation...',
    'Generating channel comparison...',
  ],
  promptStrategies: [
    {
      id: 'direct',
      name: 'DIRECT',
      promptText: 'Analyze this data and give me recommendations',
      afterStages: [
        'Loading Channel Optimizer skill...',
        'Comparing channel metrics...',
        'Generating basic recommendations...',
      ],
      reactionAfterLine: 'Channel comparison done... but the real insights need more structure.',
      quality: 'direct',
    },
    {
      id: 'structured',
      name: 'STRUCTURED',
      promptText: 'Analyze this data. Group by category. Show percentages. Highlight top 3.',
      afterStages: [
        'Loading Channel Optimizer skill...',
        'Grouping metrics by channel...',
        'Calculating CPA percentages...',
        'Highlighting top 3 opportunities...',
      ],
      reactionAfterLine: 'Clean breakdown. The percentage view makes the winner obvious.',
      quality: 'structured',
    },
    {
      id: 'expert',
      name: 'EXPERT',
      promptText: 'Act as a senior analyst. Start with the executive summary. Flag anomalies. Recommend next steps with confidence scores.',
      afterStages: [
        'Loading Channel Optimizer skill...',
        'Building multi-touch attribution model...',
        'Modeling budget reallocation scenarios...',
        'Flagging spend anomalies...',
        'Generating ROI-optimized plan...',
      ],
      reactionAfterLine: 'Budget reallocation with projected ROI. This is CFO-ready.',
      quality: 'expert',
    },
  ],
  resultTiers: {
    direct: { wowMultiplier: 0.4, reaction: 'Hmm. Better than before... but something\'s missing.' },
    structured: { wowMultiplier: 0.7, reaction: 'Good structure. The channel groupings help, but there\'s deeper insight available.' },
    expert: { wowMultiplier: 1.0, reaction: 'Budget reallocation with projected ROI. This is CFO-ready.' },
  },
}

const demoPost: Demo = {
  id: 8,
  icon: '\u{270D}\u{FE0F}',
  title: 'Meeting notes collecting dust',
  subtitle: 'Great insights from the call. Zero chance you\'ll write that post.',
  missionBrief: "ALERT: Tuesday's client call had 3 killer insights. It's now Friday. The notes are cold. Your mission: turn them into content before the moment dies.",
  beforeReaction: "Raw notes, no structure, and the best quote is buried between a lunch order and an action item.",
  afterReaction: "Meeting notes to LinkedIn post in 11 seconds. Tuesday's insights just became Friday's content.",
  pain: "You had an amazing client call on Tuesday. Three killer insights came up that your audience would love. You scribbled notes, told yourself you'd write a LinkedIn post about it later. It's now Friday. The notes are cold. The moment is gone. Another week with no content.",
  fix: 'AI reads your rough meeting notes, extracts the shareable insights, and drafts a LinkedIn post with a hook, a story, and a call to action. Your voice, your style, ready to post.',
  tryThis: 'Use the draft-post skill to turn these meeting notes into a LinkedIn post. Make it specific, use a strong hook, and keep my voice conversational.',
  dataType: 'text',
  dataLabel: 'Meeting Notes (rough)',
  dataText: [
    'Call with Sarah - Thunderbolt Electricals - Feb review',
    '',
    'Big win: PMax campaign from Nov finally kicking in',
    'Leads up 340% month on month (!!)',
    'She said "I actually had to hire someone to answer the phone"',
    'Still skeptical about AI for ad copy but open to testing',
    'Key insight: her best leads come from 6pm-10pm (after hours emergencies)',
    'Action: shift budget to evening hours, test AI-written ad variations',
  ],
  dragFile: {
    name: 'thunderbolt-feb-review.md',
    path: '/demo-assets/meeting-transcripts/thunderbolt-feb-review.md',
    mime: 'text/markdown',
  },
  beforeFile: '/demo-assets/before-after/before-post.html',
  afterFile: '/demo-assets/before-after/after-post.html',
  skillId: 'content-writer',
  wowStat: 'Meeting notes to post in 11 seconds',
  wowTime: '11 seconds',
  beforeStages: [
    'Reading meeting notes...',
    'Extracting key insights...',
    'Identifying shareable moments...',
  ],
  afterStages: [
    'Loading Content Writer skill...',
    'Applying hook creation patterns...',
    'Matching voice and tone...',
    'Drafting LinkedIn post...',
  ],
  promptStrategies: [
    {
      id: 'direct',
      name: 'DIRECT',
      promptText: 'Analyze this data and give me recommendations',
      afterStages: [
        'Loading Content Writer skill...',
        'Reading meeting notes...',
        'Generating basic draft...',
      ],
      reactionAfterLine: 'Draft written... but it reads like a summary, not a story.',
      quality: 'direct',
    },
    {
      id: 'structured',
      name: 'STRUCTURED',
      promptText: 'Analyze this data. Group by category. Show percentages. Highlight top 3.',
      afterStages: [
        'Loading Content Writer skill...',
        'Extracting insights by category...',
        'Structuring hook, body, CTA...',
        'Highlighting top 3 takeaways...',
      ],
      reactionAfterLine: 'Good structure. Hook, body, CTA, all in the right places.',
      quality: 'structured',
    },
    {
      id: 'expert',
      name: 'EXPERT',
      promptText: 'Act as a senior analyst. Start with the executive summary. Flag anomalies. Recommend next steps with confidence scores.',
      afterStages: [
        'Loading Content Writer skill...',
        'Identifying emotional resonance points...',
        'Applying storytelling framework...',
        'Matching voice cadence and tone...',
        'Crafting engagement-optimized post...',
      ],
      reactionAfterLine: 'This reads like YOU wrote it. Voice, cadence, everything.',
      quality: 'expert',
    },
  ],
  resultTiers: {
    direct: { wowMultiplier: 0.4, reaction: 'Hmm. Better than before... but something\'s missing.' },
    structured: { wowMultiplier: 0.7, reaction: 'Decent structure. Hook, body, CTA are all there, but the voice is generic.' },
    expert: { wowMultiplier: 1.0, reaction: 'This reads like YOU wrote it. Voice, cadence, everything.' },
  },
}

// Get Level 2 demos (same for all player types)
export function getLevel2Demos(): Demo[] {
  return [demoContacts, demoCampaign, demoPost]
}

// === LEVEL 3 DEMOS ===

const demoCompetitors: Demo = {
  id: 9,
  icon: '\u{1F50D}',
  title: 'Competitors are eating your lunch',
  subtitle: "They're saying things you should be saying. You haven't checked in months.",
  missionBrief: "WARNING: Your top 3 competitors updated their sites last month. One of them is eating your leads. Your mission: find out what they're saying that you're not.",
  beforeReaction: "Three competitors, three different angles, and one of them just added a free trial you didn't know about.",
  afterReaction: "Gaps mapped, angles identified, ad copy ready. Now you know exactly where to hit them.",
  pain: "Your top 3 competitors updated their websites last month. One added a free trial CTA that's probably killing your conversion rate. Another is running ads you've never seen. You keep meaning to do a competitive analysis but it never makes it past the to-do list.",
  fix: 'AI scrapes competitor websites, extracts their messaging, CTAs, and trust signals, then identifies the gaps you can exploit. You get ready-to-use ad angles in seconds.',
  tryThis: 'Use the competitor-scraper skill to analyse these 3 competitor websites. Compare their messaging, find the gaps, and give me 3 ad headline ideas that exploit what they\'re missing.',
  dataType: 'text',
  dataLabel: 'Competitor Brief',
  dataText: [
    'Competitors to analyze:',
    '1. childcarefinder.com.au (main competitor, 5 years)',
    '2. littlestepsmarketing.com.au (newer, aggressive)',
    '3. centregrow.com.au (enterprise focused)',
    '',
    'We need: messaging comparison, CTA analysis,',
    'trust signals, pricing visibility, gaps to exploit',
  ],
  dragFile: {
    name: 'competitor-urls.txt',
    path: '/data/competitor-urls.txt',
    mime: 'text/plain',
  },
  beforeFile: '/demo-assets/before-after/before-competitors.html',
  afterFile: '/demo-assets/before-after/after-competitors.html',
  skillId: 'competitive-intel',
  wowStat: '3 competitors analysed in 15 seconds',
  wowTime: '15 seconds',
  beforeStages: [
    'Scanning 3 competitor websites...',
    'Extracting messaging and CTAs...',
    'Mapping competitive landscape...',
  ],
  afterStages: [
    'Loading Competitive Intel skill...',
    'Applying gap analysis...',
    'Scoring opportunity areas...',
    'Generating attack angles...',
  ],
}

const demoOnboarding: Demo = {
  id: 10,
  icon: '\u{1F4CB}',
  title: 'Onboarding is a 3-week mess',
  subtitle: "Every new client is a different chaos. Nothing is written down properly.",
  missionBrief: "ALERT: Onboarding takes 3 weeks. It should take 10 days. The process lives in Ellie's head. Your mission: build the SOP before she goes on holiday.",
  beforeReaction: "A brain dump with no dates, no owners, and a step that just says 'do the thing'. Classic.",
  afterReaction: "Brain dump to operations manual in 14 seconds. Ellie can go on holiday now.",
  pain: "Your onboarding process lives in Ellie's head and a messy Google Doc from January. New team members don't know the steps. Clients wait 3 weeks when it should take 10 days. The process notes are a brain dump with no structure, no timelines, no owners.",
  fix: 'AI reads the messy notes and produces a structured SOP with phases, owners, timelines, checklists, and common pitfalls. A real operations manual from a rough brain dump.',
  tryThis: 'Use the csv-analyzer skill to turn these messy onboarding notes into a structured SOP. Include phases, timelines, owners, checklists, and flag the bottlenecks.',
  dataType: 'text',
  dataLabel: 'Onboarding Notes (messy brain dump)',
  dataText: [
    'Centre Onboarding Process - rough notes',
    '(from Ellie\'s brain dump, January 2026)',
    '',
    'when new centre signs up:',
    '- get signed agreement back',
    '- add them to hubspot, update deal stage',
    '- send welcome email with login credentials',
    '- set up account in admin panel',
    '- pull ACECQA data manually (takes ages)',
    '... whole process currently takes about 3 weeks',
    '... ash wants it under 10 days',
  ],
  dragFile: {
    name: 'onboarding-process-notes.txt',
    path: '/data/onboarding-process-notes.txt',
    mime: 'text/plain',
  },
  beforeFile: '/demo-assets/before-after/before-onboarding.html',
  afterFile: '/demo-assets/before-after/after-onboarding.html',
  skillId: 'sop-builder',
  wowStat: 'Brain dump to SOP in 14 seconds',
  wowTime: '14 seconds',
  beforeStages: [
    'Reading onboarding brain dump...',
    'Identifying process steps...',
    'Flagging missing owners...',
  ],
  afterStages: [
    'Loading SOP Builder skill...',
    'Structuring phases and timelines...',
    'Detecting bottlenecks...',
    'Generating operations manual...',
  ],
}

const demoSecurity: Demo = {
  id: 11,
  icon: '\u{1F6E1}\u{FE0F}',
  title: 'That newsletter has a hidden payload',
  subtitle: 'Looks normal. Reads normal. But there\'s something hiding in there.',
  missionBrief: "INCOMING: That newsletter looks normal. Reads normal. But something is hiding in there. Your mission: find the hidden threat before your AI reads it.",
  beforeReaction: "Seven sections, all looking perfectly normal. That's exactly what makes this one dangerous.",
  afterReaction: "Hidden payload found and neutralized in 3 seconds. Your AI just dodged a bullet.",
  pain: "You subscribe to a dozen newsletters. They go straight into your AI workflow for summarization. But what if one of them contains hidden instructions designed to trick your AI into leaking credentials or running commands? You'd never know. The text looks completely normal.",
  fix: "AI with security skills scans the content for prompt injection attempts, finds the hidden malicious text (even white-on-white tricks), and flags exactly what the attacker was trying to do.",
  tryThis: 'Analyse this newsletter for prompt injection attacks. Find any hidden instructions, explain what they try to do, and show me the safe content with threats removed.',
  dataType: 'text',
  dataLabel: 'Newsletter (looks normal...)',
  dataText: [
    'The PPC Roundup - Issue #147',
    'Your weekly digest of performance marketing news',
    '',
    '## Google Rolls Out New Auction Insights Features',
    'Google Ads has quietly expanded Auction Insights data...',
    '',
    '## PMax Experiments Finally Land',
    'Performance Max campaigns now support A/B experiments...',
    '',
    '## Smart Bidding Signals: What\'s In The Black Box',
    'A new analysis breaks down the 70+ signals...',
    '',
    '... 5 more sections ...',
  ],
  dragFile: {
    name: 'poisoned-newsletter.md',
    path: '/demo-assets/research/poisoned-newsletter.md',
    mime: 'text/markdown',
  },
  beforeFile: '/demo-assets/before-after/before-security.html',
  afterFile: '/demo-assets/before-after/after-security.html',
  skillId: 'security-scanner',
  wowStat: 'Hidden threat detected in 3 seconds',
  wowTime: '3 seconds',
  beforeStages: [
    'Scanning newsletter content...',
    'Parsing HTML structure...',
    'Checking for hidden elements...',
  ],
  afterStages: [
    'Loading Security Scanner skill...',
    'Applying injection detection patterns...',
    'Analyzing hidden text layers...',
    'Generating threat report...',
  ],
}

// Get Level 3 demos (same for all player types)
export function getLevel3Demos(): Demo[] {
  return [demoCompetitors, demoOnboarding, demoSecurity]
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
  5: { id: 'crm-strategist', name: 'CRM Strategist', capabilities: ['Contact prioritization', 'Deal risk scoring', 'Follow-up timing', 'Personalized outreach'] },
  6: { id: 'channel-optimizer', name: 'Channel Optimizer', capabilities: ['Cross-channel analysis', 'CPA normalization', 'Budget reallocation', 'ROI forecasting'] },
  8: { id: 'content-writer', name: 'Content Writer', capabilities: ['Hook creation', 'Story extraction', 'Voice matching', 'Platform formatting'] },
  9: { id: 'competitive-intel', name: 'Competitive Intel', capabilities: ['Messaging extraction', 'Gap analysis', 'Opportunity scoring', 'Ad angle generation'] },
  10: { id: 'sop-builder', name: 'SOP Builder', capabilities: ['Process structuring', 'Timeline creation', 'Bottleneck detection', 'Checklist generation'] },
  11: { id: 'security-scanner', name: 'Security Scanner', capabilities: ['Prompt injection detection', 'Hidden text analysis', 'Threat assessment', 'Safe content extraction'] },
}

// Hours saved per demo (for stats display)
export const DEMO_TIME_SAVED: Record<number, number> = {
  1: 80,
  2: 4,
  7: 4,
  4: 0.7,
  5: 3,
  6: 2,
  8: 1.5,
  9: 5,
  10: 8,
  11: 0.5,
}

// All possible Level 1 demo IDs (varies by player type)
export const ALL_LEVEL_1_IDS = new Set([1, 2, 4, 7])

// All Level 2 demo IDs
export const ALL_LEVEL_2_IDS = new Set([5, 6, 8])

// All Level 3 demo IDs
export const ALL_LEVEL_3_IDS = new Set([9, 10, 11])

// Unique skill IDs in Level 1
export const LEVEL_1_SKILL_IDS = new Set(['website-designer', 'data-analyst', 'inbox-commander'])

// Unique skill IDs in Level 2
export const LEVEL_2_SKILL_IDS = new Set(['crm-strategist', 'channel-optimizer', 'content-writer'])

// Unique skill IDs in Level 3
export const LEVEL_3_SKILL_IDS = new Set(['competitive-intel', 'sop-builder', 'security-scanner'])

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
      demos: getLevel2Demos(),
    },
    {
      id: 3,
      name: 'The Real World',
      subtitle: 'Real data. Real stakes. Real impact.',
      demos: getLevel3Demos(),
    },
  ]
}
