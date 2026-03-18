'use client'

import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import pkg from '@/package.json'

export default function SiteFooter() {
  const router = useRouter()
  const { resetGame } = useGame()

  return (
    <footer
      className="font-heading"
      style={{ textAlign: 'center', padding: '12px 0', fontSize: '11px', color: '#bbb', letterSpacing: '0.5px' }}
    >
      <span>&copy; Mike Rhodes 2026 &middot; v{pkg.version}</span>
      <span style={{ margin: '0 8px' }}>&middot;</span>
      <button
        onClick={() => { resetGame(); router.push('/') }}
        className="hover:text-white/70 transition-colors"
        style={{ color: '#888', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.5px' }}
      >
        Reset all demos
      </button>
    </footer>
  )
}
