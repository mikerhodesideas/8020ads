'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/cowork', label: 'About Cowork' },
  { href: '/course', label: 'Course' },
  { href: '/how-it-works', label: 'How It Works' },
]

export default function Navbar() {
  const pathname = usePathname()

  // Detect if we're on an agency or business route
  const isAgency = pathname.startsWith('/agency')
  const isBusiness = pathname.startsWith('/business')
  const activePath = isAgency ? 'agency' : isBusiness ? 'business' : null

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-bold text-lg tracking-tight"
        >
          <span className="text-[var(--color-brand-orange)]">Cowork</span>
          <span className="text-[var(--color-ink)]">26</span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-7">
          {activePath && (
            <Link
              href={`/${activePath}`}
              className={cn(
                'text-xs sm:text-sm font-heading font-semibold transition-colors',
                pathname === `/${activePath}`
                  ? 'text-[var(--color-brand-orange)]'
                  : 'text-[var(--color-ink)] hover:text-[var(--color-brand-orange)]'
              )}
            >
              {activePath === 'agency' ? 'Agency' : 'Business'} Demos
            </Link>
          )}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-xs sm:text-sm font-heading font-medium transition-colors',
                pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href))
                  ? 'text-[var(--color-brand-orange)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
