export type ProofType = 'inbox' | 'website' | 'data'

export interface ProofDemo {
  type: ProofType
  // Card content (homepage)
  cardHeadline: string
  cardSubtext: string
  // Proof page content
  proofHeadline: string
  proofHow: string
  // Before/after
  beforeLabel: string
  afterLabel: string
  beforeFile: string
  afterFile: string
  resultLine: string
  resultDetail: string
  // Meta
  ogTitle: string
  ogDescription: string
}

export const PROOF_DEMOS: Record<ProofType, ProofDemo> = {
  inbox: {
    type: 'inbox',
    cardHeadline: '50 emails by 9am Monday',
    cardSubtext: 'Your inbox is a war zone. AI can triage it in seconds.',
    proofHeadline: 'Monday morning. 50 emails. Sorted before your coffee goes cold.',
    proofHow: 'You drag one file into Cowork. It reads every email, ranks them by urgency, flags what needs a reply, and tells you exactly where to start. The whole thing takes seconds.',
    beforeLabel: 'What ChatGPT gives you',
    afterLabel: 'What Cowork builds',
    beforeFile: '/demo-assets/before-after/before-triage.html',
    afterFile: '/demo-assets/before-after/after-triage.html',
    resultLine: 'Every email read, ranked, and action-planned.',
    resultDetail: 'And all you had to do was drag in your inbox.',
    ogTitle: '10 emails triaged in 8 seconds',
    ogDescription: 'See what happens when AI actually triages your inbox',
  },
  website: {
    type: 'website',
    cardHeadline: "Your website hasn't been updated since...",
    cardSubtext: "You know it needs work. You just don't have 40 hours to do it.",
    proofHeadline: 'One URL in. A full redesign out. No designer required.',
    proofHow: "You paste your website URL into Cowork. It looks at what you have, asks a couple of questions about what you want, and builds a completely new design. You talk, it builds.",
    beforeLabel: 'Before',
    afterLabel: 'After Cowork',
    beforeFile: '/demo-assets/before-after/before-website.html',
    afterFile: '/demo-assets/before-after/after-website.html',
    resultLine: "Same business. Same content. Completely redesigned.",
    resultDetail: "And all you had to do was share a URL.",
    ogTitle: 'Share a URL. Get a professional redesign.',
    ogDescription: 'See what AI builds from a single webpage URL',
  },
  data: {
    type: 'data',
    cardHeadline: 'Three spreadsheets. Zero insights.',
    cardSubtext: 'The data is there. The connections between them are not.',
    proofHeadline: 'Three spreadsheets you never had time to connect. Now they talk to each other automatically.',
    proofHow: 'You drag three CSV files into Cowork. It reads all of them, spots the connections between them, and builds a fully interactive dashboard with insights that would normally take hours to piece together.',
    beforeLabel: 'What ChatGPT gives you',
    afterLabel: 'What Cowork builds',
    beforeFile: '/demo-assets/before-after/before-data-leadgen.html',
    afterFile: '/demo-assets/before-after/after-data-leadgen.html',
    resultLine: 'Patterns across three files, visualized and explained.',
    resultDetail: 'And all you had to do was drag in your data.',
    ogTitle: '3 spreadsheets. 8 seconds. Full analysis.',
    ogDescription: 'See AI find connections across three spreadsheets in 8 seconds',
  },
}

// Ordered sequence for demo navigation
export const PROOF_ORDER: ProofType[] = ['inbox', 'data', 'website']
export const PROOF_TYPES: ProofType[] = ['inbox', 'website', 'data']

export function getProofIndex(current: ProofType): number {
  return PROOF_ORDER.indexOf(current)
}

export function getNextProof(current: ProofType): ProofDemo | null {
  const idx = PROOF_ORDER.indexOf(current)
  if (idx < 0 || idx >= PROOF_ORDER.length - 1) return null
  return PROOF_DEMOS[PROOF_ORDER[idx + 1]]
}

// Find the next uncompleted demo (skipping the current one)
export function getNextUncompletedProof(current: ProofType, completed: Set<string>): ProofDemo | null {
  // Check all demos in order, wrapping around, skipping current
  for (const t of PROOF_ORDER) {
    if (t !== current && !completed.has(t)) {
      return PROOF_DEMOS[t]
    }
  }
  return null // all done
}

export function getOtherProofs(current: ProofType): ProofDemo[] {
  return PROOF_ORDER.filter(t => t !== current).map(t => PROOF_DEMOS[t])
}
