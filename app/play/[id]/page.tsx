import { DEMO_SKILLS } from '@/lib/game-data'
import PlayDemoClient from './client'

export function generateStaticParams() {
  return Object.keys(DEMO_SKILLS).map((id) => ({ id }))
}

export default function Page() {
  return <PlayDemoClient />
}
