'use client'

import ProofPage from '@/components/proof-page'
import type { ProofDemo } from '@/lib/proof-data'

export default function ProofPageClient({ demo }: { demo: ProofDemo }) {
  return <ProofPage demo={demo} />
}
