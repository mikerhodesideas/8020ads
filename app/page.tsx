import Link from 'next/link'

export default function Home() {
  return (
    <>
      <style>{FORK_STYLES}</style>

      <div className="fork-root">
        <div className="fork-spine" aria-hidden="true" />

        {/* HERO */}
        <section className="fork-hero">
          <div className="canvas">
            <h1>
              AI is much better when you give it <span className="em">skills</span>
              <span className="stop">.</span>
            </h1>
            <p className="fork-lede">
              A skill is one small file that teaches AI to do a real job properly. I&apos;ll show you one in action. Pick where you&apos;re starting from.
            </p>
          </div>
        </section>

        {/* THE FORK */}
        <section className="fork-choice">
          <div className="canvas fork-grid">

            {/* PATH A — has Claude */}
            <Link href="/start" className="path-card">
              <div className="path-eyebrow">You&apos;re set up</div>
              <h2>I&apos;ve got Claude and the app.</h2>
              <p>Skip the intro. Grab the skill, drop it into Cowork, and watch it turn a one-line prompt into finished work.</p>
              <span className="path-cta">Show me how skills help <span className="arr">&rarr;</span></span>
            </Link>

            {/* PATH B — no account yet */}
            <Link href="/proof/inbox" className="path-card">
              <div className="path-eyebrow">
                Just curious
                <span className="no-signup">No signup needed</span>
              </div>
              <h2>I don&apos;t have a Claude account yet.</h2>
              <p>No problem. Watch three quick demos of what skills actually do, right here in your browser, then decide if it&apos;s for you.</p>
              <span className="path-cta">Show me what skills can do <span className="arr">&rarr;</span></span>
            </Link>

          </div>
        </section>
      </div>
    </>
  )
}

const FORK_STYLES = `
  .fork-root {
    --bg: #FAFAF8;
    --paper: #FFFFFF;
    --ink: #0A0A0A;
    --ink-soft: #2A2A2A;
    --ink-mid: #555555;
    --ink-muted: #8A8A8A;
    --rule: #0A0A0A;
    --rule-faint: #E2DEDA;
    --orange: #D64C00;
    --orange-tint: #FFF1E8;
    --green-bright: #10b981;
    --canvas-max: 1600px;
    --canvas-pad: 48px;
    background: var(--bg);
    color: var(--ink);
    font-family: var(--font-inter), -apple-system, sans-serif;
    font-size: 15px;
    line-height: 1.55;
    min-height: 100vh;
    position: relative;
  }
  .fork-root ::selection { background: var(--ink); color: var(--orange); }
  .fork-root a { color: inherit; text-decoration: none; }
  .fork-spine {
    position: fixed; top: 0; bottom: 0; left: 0;
    width: 4px; background: var(--orange); z-index: 100;
  }
  .fork-root .canvas {
    max-width: var(--canvas-max);
    margin: 0 auto;
    padding: 0 var(--canvas-pad);
  }

  /* HERO */
  .fork-root .fork-hero { padding: 64px 0 40px; }
  .fork-root .fork-hero h1 {
    font-family: var(--font-oxanium), sans-serif; font-weight: 700;
    font-size: clamp(48px, 6.4vw, 96px);
    line-height: 0.96; letter-spacing: -0.035em; margin: 0;
    max-width: 16ch;
  }
  .fork-root .fork-hero h1 .em { color: var(--orange); }
  .fork-root .fork-lede {
    font-size: clamp(17px, 1.8vw, 21px); line-height: 1.5; color: var(--ink-soft);
    margin: 24px 0 0; max-width: 60ch;
    border-left: 4px solid var(--orange); padding-left: 20px;
  }

  /* THE FORK */
  .fork-root .fork-choice { padding: 24px 0 80px; }
  .fork-root .fork-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  }
  .fork-root .path-card {
    display: flex; flex-direction: column;
    background: var(--paper);
    border: 1px solid var(--rule-faint);
    border-left: 4px solid var(--orange);
    padding: 36px 36px 32px;
    min-height: 280px;
    transition: transform .15s, border-color .15s, box-shadow .15s;
  }
  .fork-root .path-card:hover {
    transform: translateY(-3px);
    border-color: var(--ink);
    border-left-color: var(--orange);
    box-shadow: 0 12px 30px rgba(10,10,10,0.08);
  }
  .fork-root .path-eyebrow {
    font-family: var(--font-oxanium), sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--orange);
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .fork-root .no-signup {
    font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: none;
    color: #047857; background: rgba(16,185,129,0.12);
    padding: 3px 9px; border-radius: 2px;
  }
  .fork-root .path-card h2 {
    font-family: var(--font-oxanium), sans-serif; font-weight: 700;
    font-size: clamp(26px, 2.6vw, 36px); line-height: 1.08;
    letter-spacing: -0.02em; color: var(--ink); margin: 0 0 14px;
  }
  .fork-root .path-card p {
    font-size: 16px; line-height: 1.55; color: var(--ink-mid);
    margin: 0 0 28px; max-width: 46ch;
  }
  .fork-root .path-cta {
    margin-top: auto;
    font-family: var(--font-oxanium), sans-serif; font-weight: 700; font-size: 15px;
    letter-spacing: 0.3px; color: var(--ink);
    display: inline-flex; align-items: center; gap: 8px;
  }
  .fork-root .path-card:hover .path-cta { color: var(--orange); }
  .fork-root .path-cta .arr { transition: transform .15s; }
  .fork-root .path-card:hover .path-cta .arr { transform: translateX(4px); }

  /* Responsive */
  @media (max-width: 900px) {
    .fork-root { --canvas-pad: 28px; }
    .fork-root .fork-hero { padding: 44px 0 28px; }
    .fork-root .fork-grid { grid-template-columns: 1fr; gap: 16px; }
    .fork-root .path-card { min-height: 0; padding: 28px 24px; }
  }
  @media (max-width: 600px) {
    .fork-root { --canvas-pad: 20px; }
    .fork-spine { width: 3px; }
  }
`
