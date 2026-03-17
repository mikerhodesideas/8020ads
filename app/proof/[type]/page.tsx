import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PROOF_DEMOS, PROOF_TYPES } from '@/lib/proof-data'
import type { ProofType } from '@/lib/proof-data'
import ProofPageClient from './client'

interface PageProps {
  params: Promise<{ type: string }>
}

export async function generateStaticParams() {
  return PROOF_TYPES.map(type => ({ type }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params
  if (!PROOF_TYPES.includes(type as ProofType)) return {}

  const demo = PROOF_DEMOS[type as ProofType]
  return {
    title: demo.ogTitle,
    description: demo.ogDescription,
    openGraph: {
      title: demo.ogTitle,
      description: demo.ogDescription,
      type: 'website',
      url: `https://8020skill.com/proof/${type}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: demo.ogTitle,
      description: demo.ogDescription,
    },
  }
}

export default async function ProofRoutePage({ params }: PageProps) {
  const { type } = await params

  if (!PROOF_TYPES.includes(type as ProofType)) {
    notFound()
  }

  const demo = PROOF_DEMOS[type as ProofType]

  return <ProofPageClient demo={demo} />
}
