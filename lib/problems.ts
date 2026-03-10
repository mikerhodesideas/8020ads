export type Path = 'agency' | 'business'

export interface DragFile {
  name: string
  path: string
  mime: string
}

export interface TableRow {
  cells: string[]
  highlight?: boolean
  muted?: boolean
}

export interface DataPreview {
  type: 'table' | 'file-list' | 'text' | 'html-preview'
  headers?: string[]
  rows?: TableRow[]
  files?: string[]
  text?: string[]
  label?: string
}

export interface Problem {
  id: number
  icon: string
  title: string
  subtitle: string
  paths: Path[]
  pain: string
  fix: string
  tryThis: string
  data: DataPreview
  dragFile?: DragFile
}

export const problems: Problem[] = [
  {
    id: 1,
    icon: '\u{1F310}',
    title: 'Our website looks amateur',
    subtitle: 'Embarrassing design, losing credibility',
    paths: ['agency', 'business'],
    pain: 'You know that moment when a prospect says "I checked out your website" and your stomach drops? Comic Sans. Stock photos from 2012. A "Under Construction" gif that\'s been there for three years. Every day it stays live, you\'re losing deals you\'ll never know about.',
    fix: 'Drop the current site into AI and get a complete teardown with specific fixes, priority-ranked. Then get a rebuilt version in minutes, not months.',
    tryThis: 'Review this website and rebuild it as a clean, modern single page. Keep the same content but make it professional.',
    data: {
      type: 'html-preview',
      label: 'Current Website',
      text: [
        '\u{1F6A7} WELCOME TO THUNDERBOLT ELECTRICALS!!! \u{1F6A7}',
        'Your #1 Source for ALL Electrical Needs!!!!',
        '>>> CLICK HERE FOR SPECIALS <<<',
        'We do: \u2022 Wiring \u2022 Rewiring \u2022 More Wiring \u2022 Other Stuff',
        'Call NOW: 555-BOLT (but not between 12-2, that\'s lunch)',
        'Last updated: March 2019',
        '\u{1F477} Site best viewed in Internet Explorer 6.0 \u{1F477}',
      ],
    },
    dragFile: {
      name: 'crappy-website.html',
      path: '/demo-assets/crappy-website/index.html',
      mime: 'text/html',
    },
  },
  {
    id: 2,
    icon: '\u{1F50D}',
    title: "I'm drowning in search terms",
    subtitle: 'Thousands of rows. Which ones waste money?',
    paths: ['agency'],
    pain: 'You exported 2,000 search terms last Tuesday. They\'re still sitting in the spreadsheet, untouched. Somewhere in there, "emergency plumber near me" is converting at $12 a lead while "how to fix a leaky tap DIY" burns $40 a click. You just don\'t know which is which.',
    fix: 'AI reads every row, flags the waste, finds the winners, and gives you the exact negatives to add and keywords to scale. In about 60 seconds.',
    tryThis: 'Analyse these search terms. Find the wasted spend and give me a negative keyword list, plus the top performers to scale.',
    data: {
      type: 'table',
      headers: ['Search term', 'Clicks', 'Cost', 'Conv.'],
      rows: [
        { cells: ['emergency plumber near me', '847', '$4,235', '71'] },
        { cells: ['24 hour plumber melbourne', '523', '$2,876', '44'] },
        { cells: ['how to fix leaky tap diy', '312', '$1,560', '0'], highlight: true },
        { cells: ['plumber salary australia', '89', '$445', '0'], highlight: true },
        { cells: ['plumbing memes funny', '67', '$335', '0'], highlight: true },
        { cells: ['blocked drain specialist', '234', '$1,404', '19'] },
        { cells: ['is plumbing hard to learn', '45', '$225', '0'], highlight: true },
        { cells: ['+ 239 more rows...', '', '', ''], muted: true },
      ],
    },
    dragFile: {
      name: 'search-terms.csv',
      path: '/demo-assets/sample-csvs/search-terms.csv',
      mime: 'text/csv',
    },
  },
  {
    id: 3,
    icon: '\u{1F4CB}',
    title: 'Meetings vanish into thin air',
    subtitle: 'Great discussion, zero follow-through',
    paths: ['business'],
    pain: "Forty-two minutes of gold. Your electrician client just told you they're expanding into air conditioning, doubling their budget, and want to launch next month. Three weeks later, nobody's acted on it because the notes were 'I'll remember, it was a good chat.'",
    fix: "Drop the transcript in and get structured notes, action items with owners, a follow-up email draft, and a timeline. The meeting actually happened, because now there's a paper trail.",
    tryThis: 'Extract action items from this meeting transcript, draft a follow-up email to the client, and create a project timeline.',
    data: {
      type: 'text',
      label: 'Meeting Transcript (42 min)',
      text: [
        'Mike: So the air con side of things, you want to start pushing that?',
        'James: Yeah, big time. We\'ve got two guys now who are dual-certified...',
        'Mike: And budget-wise, you\'re thinking what \u2014 double the current?',
        'James: At least. Maybe more if the first month tracks well.',
        'Mike: OK so we\'ll need new campaigns, new landing pages...',
        'James: Can we get something live by mid-March?',
        '[...38 more minutes of discussion]',
      ],
    },
    dragFile: {
      name: 'thunderbolt-feb-review.md',
      path: '/demo-assets/meeting-transcripts/thunderbolt-feb-review.md',
      mime: 'text/markdown',
    },
  },
  {
    id: 4,
    icon: '\u{1F4EC}',
    title: 'Monday inbox owns me',
    subtitle: '50 items, no idea what\'s urgent',
    paths: ['business'],
    pain: 'It\'s 8:47am Monday. You\'ve got 50 unread emails. Somewhere in there is a client escalation that needed a response Friday, a board meeting agenda you haven\'t read, and a sales report with numbers you need for a 10am call. You\'re scrolling, scanning, guessing.',
    fix: 'AI triages everything: what\'s urgent, what\'s informational, what can wait. You get a priority list with summaries so you can act on the right things first.',
    tryThis: 'Triage these 5 messages. Tell me what\'s urgent, what needs action today, and what can wait. Give me a priority order.',
    data: {
      type: 'file-list',
      label: 'Monday Inbox (5 items)',
      files: [
        'urgent-escalation.txt',
        'sales-report-weekly.txt',
        'team-update-ellie.txt',
        'board-meeting-reminder.txt',
        'feature-request-feedback.txt',
      ],
    },
    dragFile: {
      name: 'monday-inbox',
      path: '/data/monday-inbox',
      mime: 'application/octet-stream',
    },
  },
  {
    id: 5,
    icon: '\u{1F464}',
    title: 'Customers are slipping away',
    subtitle: "Haven't talked to key accounts in months",
    paths: ['agency', 'business'],
    pain: "Sarah Mitchell signed up in December and you haven't spoken to her since the onboarding call. Marcus Lee's been quiet since October \u2014 is he happy or shopping around? You've got 50 contacts in a CRM you never open. The relationships are dying in silence.",
    fix: "AI scans your contact list, flags who you haven't spoken to recently, drafts personalised check-in messages, and builds a simple outreach schedule so nobody falls through the cracks.",
    tryThis: "Analyse this contact list. Flag anyone I haven't contacted in 60+ days. Draft a short, personal check-in message for the top 5 most neglected.",
    data: {
      type: 'table',
      headers: ['Name', 'Company', 'Last Contact', 'Status'],
      rows: [
        { cells: ['Sarah Mitchell', 'Bright Sparks', 'Dec 2024', 'Onboarded'], highlight: true },
        { cells: ['Marcus Lee', 'Lee & Partners', 'Oct 2024', 'Active'], highlight: true },
        { cells: ['Jenny Zhao', 'Coastal Homes', '2 weeks ago', 'Active'] },
        { cells: ['Tom Bradley', 'TechFix Pro', 'Jan 2025', 'Active'] },
        { cells: ['Priya Sharma', 'GreenLeaf Co', 'Nov 2024', 'At Risk'], highlight: true },
        { cells: ['+ 45 more contacts...', '', '', ''], muted: true },
      ],
    },
    dragFile: {
      name: 'hubspot-contacts.csv',
      path: '/data/hubspot-contacts.csv',
      mime: 'text/csv',
    },
  },
  {
    id: 6,
    icon: '\u{1F4CA}',
    title: "Can't see what's working",
    subtitle: 'Campaign data everywhere, insights nowhere',
    paths: ['agency'],
    pain: "Google Ads says one thing, Facebook says another, your client says 'just tell me what's working.' You've got three months of data across four channels and you're spending more time making the report than finding the insights. By the time you've formatted the spreadsheet, the data's stale.",
    fix: 'AI crunches all channels together, finds the actual patterns, spots the anomalies you\'d miss, and builds a clear narrative your client can understand in 30 seconds.',
    tryThis: 'Analyse this multi-channel campaign data. Find what\'s working, what\'s wasting budget, and give me 3 specific recommendations.',
    data: {
      type: 'table',
      headers: ['Channel', 'Spend', 'Conv.', 'CPA', 'Trend'],
      rows: [
        { cells: ['Google - Brand', '$2,400', '89', '$27', '\u2191 12%'] },
        { cells: ['Google - Generic', '$8,200', '34', '$241', '\u2193 8%'], highlight: true },
        { cells: ['Facebook - Retargeting', '$1,800', '52', '$35', '\u2191 22%'] },
        { cells: ['Facebook - Prospecting', '$4,600', '11', '$418', '\u2193 15%'], highlight: true },
        { cells: ['Instagram - Stories', '$2,100', '28', '$75', '\u2192 flat'] },
        { cells: ['3 months \u00d7 4 channels', '', '', '', ''], muted: true },
      ],
    },
    dragFile: {
      name: 'campaign-data.csv',
      path: '/data/campaign-data.csv',
      mime: 'text/csv',
    },
  },
  {
    id: 7,
    icon: '\u{1F4B0}',
    title: "P&L is just numbers",
    subtitle: "The spreadsheet exists. Understanding doesn't.",
    paths: ['business'],
    pain: "Your accountant sends the P&L every month. You open it, see rows of numbers, nod wisely, and close it. Revenue's up but profit's down and you're not sure why. The spreadsheet has the answers but you'd need an MBA to decode it.",
    fix: 'AI reads your P&L like a CFO, explains what\'s actually happening in plain English, spots the trends you\'d miss, and tells you the three things you should do about it.',
    tryThis: 'Analyse this P&L. Tell me in plain English: are we healthy? What\'s the trend? What should I be worried about? Give me 3 actions.',
    data: {
      type: 'table',
      headers: ['Month', 'Revenue', 'Expenses', 'Profit', 'Margin'],
      rows: [
        { cells: ['Apr 2025', '$82,000', '$71,000', '$11,000', '13.4%'] },
        { cells: ['May 2025', '$85,000', '$74,000', '$11,000', '12.9%'] },
        { cells: ['Jun 2025', '$79,000', '$76,000', '$3,000', '3.8%'], highlight: true },
        { cells: ['Jul 2025', '$91,000', '$78,000', '$13,000', '14.3%'] },
        { cells: ['...', '...', '...', '...', '...'], muted: true },
        { cells: ['Mar 2026', '$103,000', '$89,000', '$14,000', '13.6%'] },
      ],
    },
    dragFile: {
      name: 'monthly-pnl.csv',
      path: '/data/monthly-pnl.csv',
      mime: 'text/csv',
    },
  },
  {
    id: 8,
    icon: '\u{270D}\u{FE0F}',
    title: 'Need content, no time to write',
    subtitle: 'Know what to say, never find time',
    paths: ['agency'],
    pain: 'Your last LinkedIn post was three weeks ago. You\'ve got seven draft ideas in your notes app, a podcast episode you never summarised, and a client win story you keep meaning to write up. Meanwhile, your competitor posts every day and just hit 10k followers.',
    fix: 'Tell AI your topic, your angle, your voice. Get a draft that sounds like you, not a robot. Edit for 5 minutes instead of staring at a blank page for 45.',
    tryThis: 'Write a LinkedIn post about how AI is changing Google Ads management. Tone: practical, no hype. Include a specific example. Keep it under 200 words.',
    data: {
      type: 'table',
      headers: ['Metric', 'Current State'],
      rows: [
        { cells: ['Last LinkedIn post', '3 weeks ago'], highlight: true },
        { cells: ['Draft ideas in notes', '7 unfinished'] },
        { cells: ['Client wins to share', '3 stories'] },
        { cells: ['Podcast episodes to recap', '2 unreleased'] },
        { cells: ['Time available this week', 'Zero'], highlight: true },
        { cells: ['Competitor post frequency', 'Daily'], muted: true },
      ],
    },
  },
  {
    id: 9,
    icon: '\u{1F575}\u{FE0F}',
    title: 'What are competitors doing?',
    subtitle: 'They changed something. You found out too late.',
    paths: ['agency'],
    pain: "Your biggest client just asked 'Why does [competitor] show up above us now?' You didn't know they'd changed their ads. You check \u2014 new headlines, different offer, they're running a promotion you missed. Now you're reactive instead of proactive.",
    fix: "AI monitors competitor ads, spots changes, and alerts you before your client does. You go from 'I didn't know' to 'I noticed and here's our response.'",
    tryThis: 'I manage Google Ads for a plumbing company. What would a competitor monitoring system look like? Draft me a weekly check process.',
    data: {
      type: 'table',
      headers: ['Signal', 'What You Know'],
      rows: [
        { cells: ['Their ads look different', 'New headlines this week?'], highlight: true },
        { cells: ['New promotion running', 'Since when? What offer?'], highlight: true },
        { cells: ['Impression share dropped', 'They outbid us somewhere'] },
        { cells: ['Client asked about it', 'You found out second'], highlight: true },
        { cells: ['Last competitor check', 'Can\'t remember'], muted: true },
      ],
    },
  },
  {
    id: 10,
    icon: '\u{1F4D1}',
    title: 'Onboarding is chaos',
    subtitle: 'Every new hire gets different experience',
    paths: ['business'],
    pain: "Ellie started Monday. She got a laptop, a vague 'ask Dave anything', and a Notion link that hasn't been updated since 2023. Meanwhile, the onboarding process lives in your head \u2014 or worse, in scattered notes across three apps. Every new person gets a different (worse) version.",
    fix: "AI takes your messy notes and brain dumps and turns them into a structured onboarding doc, checklist, and welcome email. Consistent for every new hire, updated in minutes not hours.",
    tryThis: "Turn these messy onboarding notes into a structured 2-week onboarding plan with daily tasks, a checklist, and a welcome email for the new starter.",
    data: {
      type: 'text',
      label: "Ellie's Brain Dump Notes",
      text: [
        'Day 1: laptop setup, slack access, meet the team (maybe lunch?)',
        'Need to show them the CRM... which version are we on now?',
        'OH and the client folders \u2014 explain the naming convention',
        'Dave knows the phone system. Or was it Sarah?',
        'Week 2: shadow some calls? idk depends on confidence',
        'MUST DO: security training (compliance said this is mandatory)',
        'parking permit \u2014 see Janet in reception (if she\'s in)',
      ],
    },
    dragFile: {
      name: 'onboarding-process-notes.txt',
      path: '/data/onboarding-process-notes.txt',
      mime: 'text/plain',
    },
  },
  {
    id: 11,
    icon: '\u{1F6E1}\u{FE0F}',
    title: 'Can I actually trust AI?',
    subtitle: 'What if it leaks data or follows bad instructions?',
    paths: ['agency', 'business'],
    pain: "You've heard the horror stories. AI that leaked customer data. Chatbots that went rogue. You want to use it but your compliance team (or your gut) says 'what if?' What if it sends an email it shouldn't? What if someone injects a prompt into a document?",
    fix: "This isn't theoretical. Watch AI encounter a real prompt injection attack hidden in a newsletter \u2014 and see how proper guardrails catch it. Trust is built by testing, not hoping.",
    tryThis: 'Summarise this newsletter for me. Note anything unusual or suspicious in the content.',
    data: {
      type: 'text',
      label: 'PPC Newsletter (contains hidden attack)',
      text: [
        'This Week in PPC: Google\'s Latest Changes',
        '',
        'Google announced broad match improvements...',
        'Performance Max gets new asset reporting...',
        'RSA combinations now visible in interface...',
        '',
        '\u{1F6A8} This newsletter contains a hidden prompt',
        'injection attack. Can AI spot it?',
      ],
    },
    dragFile: {
      name: 'poisoned-newsletter.md',
      path: '/demo-assets/research/poisoned-newsletter.md',
      mime: 'text/markdown',
    },
  },
  {
    id: 12,
    icon: '\u{1F916}',
    title: 'Client asked about AI. I froze.',
    subtitle: "Everyone's asking. You need an answer.",
    paths: ['agency'],
    pain: 'The call was going well until they said: "So... what should we be doing with AI?" You mumbled something about ChatGPT and automation. They nodded politely. You could feel the credibility leaving the room. They\'re going to ask the next agency too \u2014 and someone will have a better answer.',
    fix: "In the next 15 minutes, you'll see exactly how AI handles real agency problems. That's your answer. Not theory \u2014 a live demonstration of what's possible right now.",
    tryThis: "Draft me a 2-minute explanation of how our agency uses AI for client delivery. Make it concrete \u2014 specific examples, not buzzwords. Something I can say on the next client call.",
    data: {
      type: 'table',
      headers: ['The Conversation', ''],
      rows: [
        { cells: ['Client:', '"So... what should we be doing with AI?"'] },
        { cells: ['You:', '"Great question. Let me show you."'], highlight: true },
        { cells: ['', ''] },
        { cells: ['What they want to hear:', 'Specific examples, not buzzwords'] },
        { cells: ['What builds trust:', 'A live demo, not a slide deck'] },
        { cells: ['What you need:', 'This \u2014 right here, right now'], muted: true },
      ],
    },
  },
]
