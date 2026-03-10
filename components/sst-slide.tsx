interface SSTSlideProps {
  onBack: () => void
}

const roles = [
  {
    title: 'Summit',
    accent: '#D64C00',
    badge: 'Strategy',
    desc: 'Leadership decides what problems to solve. Sets direction, picks priorities, measures what matters.',
  },
  {
    title: 'Scouts',
    accent: '#2563EB',
    badge: 'Claude Code + IDE',
    desc: 'AI-literate people build skills in Claude Code. Turn SOPs into reusable capabilities anyone can run.',
  },
  {
    title: 'Trekkers',
    accent: '#1B8C3A',
    badge: 'Claude Cowork',
    desc: "Rest of team uses skills daily in Cowork. Drag, type, done. No coding, no prompt engineering.",
  },
]

export default function SSTSlide({ onBack }: SSTSlideProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <button
        onClick={onBack}
        className="self-start mb-8 text-[var(--color-faint)] hover:text-[var(--color-ink)] transition-colors text-sm"
      >
        &#8592; Back to problems
      </button>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 font-heading">
        How it works
      </h2>
      <p className="text-[var(--color-muted)] text-center mb-12 max-w-lg">
        Three roles. One system. AI adoption that actually sticks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
        {roles.map((role) => (
          <div
            key={role.title}
            className="bg-white border border-[var(--color-border)] rounded-[2px] p-6"
            style={{ borderTop: `3px solid ${role.accent}` }}
          >
            <h3 className="text-xl font-bold mb-1 font-heading">
              {role.title}
            </h3>
            <span
              className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[2px] mb-4"
              style={{
                color: role.accent,
                backgroundColor: `${role.accent}15`,
              }}
            >
              {role.badge}
            </span>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              {role.desc}
            </p>
          </div>
        ))}
      </div>

      <div
        className="max-w-3xl w-full p-6 rounded-[2px]"
        style={{
          borderLeft: '4px solid var(--color-brand-orange)',
          backgroundColor: 'var(--color-brand-orange-faint)',
        }}
      >
        <p className="text-lg md:text-xl font-medium text-[var(--color-ink)] leading-relaxed font-heading">
          &ldquo;Your scouts build the machine.
          <br />
          Your trekkers run it.
          <br />
          That&apos;s AI adoption that actually sticks.&rdquo;
        </p>
      </div>
    </div>
  )
}
