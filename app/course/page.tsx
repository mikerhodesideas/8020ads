import Link from 'next/link'

export default function CoursePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 font-[family-name:var(--font-heading)]">
        Claude Code for Client Delivery
      </h1>
      <p className="text-[var(--color-muted)] text-center max-w-md mb-2">
        8 modules. 26 lessons. From first skill to full deployment.
      </p>
      <p className="text-sm text-[var(--color-faint)] text-center mb-8">
        Videos coming soon.
      </p>
      <Link
        href="/"
        className="text-sm text-[var(--color-brand-orange)] hover:underline"
      >
        &#8592; Back to demo
      </Link>
    </div>
  )
}
