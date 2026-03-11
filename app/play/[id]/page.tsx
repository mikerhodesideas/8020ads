'use client'

import { useParams } from 'next/navigation'
import GameDemoDetail from '@/components/game-demo-detail'

export default function PlayDemoPage() {
  const params = useParams()
  const id = parseInt(params.id as string)

  return <GameDemoDetail demoId={id} />
}
