'use client'

import Link from 'next/link'
import { useState } from 'react'

const PROMPT_TEXT = 'Analyse the CSV I just uploaded using the csv-analyzer skill.'

export default function Home() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT_TEXT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <>
      <style>{HOMEPAGE_STYLES}</style>

      <div className="home-root">
        {/* Orange spine */}
        <div className="home-spine" aria-hidden="true" />

        {/* Topbar */}
        <header className="topbar">
          <div className="canvas topbar-inner">
            <Link href="/" className="wordmark">
              <span className="num">80</span>
              <span className="slash">/</span>
              <span className="num">20</span>
              <span className="word">skill</span>
            </Link>
            <nav className="topnav">
              <a href="#next">More demos</a>
              <Link href="/play">Level map</Link>
            </nav>
          </div>
        </header>

        {/* §01 HERO + PREMISE */}
        <section className="hero">
          <div className="canvas">
            <div className="section-marker reveal r1">
              <span className="sect-num">§01</span>
              <span className="sect-label">The premise</span>
              <span className="sect-meta">about 4 minutes · one skill, one CSV, one prompt</span>
            </div>
            <div className="hero-grid">
              <h1 className="reveal r2">
                AI is much better when you give it <span className="em">skills</span>
                <span className="stop">.</span>
              </h1>
              <div className="hero-side reveal r3">
                <p>Here&apos;s the deal. I made a skill, one small file, that knows how to analyse a spreadsheet properly. I&apos;ll give you the skill, some sample data, and the prompt to use.</p>
                <p>The whole point: you <span className="pull">don&apos;t need a 15-paragraph magic prompt</span>. All the cleverness lives in the skill file. Anyone can write one of these. I&apos;ll show you one.</p>
                <p>It takes about four minutes. You&apos;ll need Claude Cowork if you haven&apos;t got it; that&apos;s two more.</p>
              </div>
            </div>
            <div className="hero-spec reveal r4">
              <div className="cell">
                <div className="k">Cost</div>
                <div className="v">Free<span className="accent">.</span></div>
              </div>
              <div className="cell">
                <div className="k">Total time</div>
                <div className="v">~4 min</div>
              </div>
              <div className="cell">
                <div className="k">What you&apos;ll need</div>
                <div className="v">Claude Cowork</div>
              </div>
              <div className="cell">
                <div className="k">What you&apos;ll see</div>
                <div className="v">AI, but useful</div>
              </div>
            </div>
          </div>
        </section>

        {/* §02 THE DEMO */}
        <section className="steps-section">
          <div className="canvas">
            <div className="section-marker reveal r1">
              <span className="sect-num">§02</span>
              <span className="sect-label">The demo</span>
              <span className="sect-meta">04 steps · sequential</span>
            </div>
            <div className="steps-grid">

              <div className="step reveal r2">
                <div className="step-num">01<span className="of">/04</span></div>
                <h3>Get Claude Cowork</h3>
                <p>The Anthropic desktop app where you&apos;ll drop the skill and run the demo. Free to install, takes about two minutes to set up and sign in.</p>
                <div className="step-actions">
                  <a href="https://claude.ai/download" className="btn" target="_blank" rel="noopener">Download Cowork <span className="arrow">↗</span></a>
                  <a href="#step-2" className="alt">I already have it →</a>
                </div>
                <div className="step-meta">
                  <span><span className="dot">●</span> Desktop app</span>
                  <span>macOS, Windows</span>
                </div>
              </div>

              <div className="step reveal r3" id="step-2">
                <div className="step-num">02<span className="of">/04</span></div>
                <h3>Download the skill</h3>
                <p>This is the magic. One small zip. Drop it into Cowork and tell Claude to install it. The whole brain of this demo sits inside this file.</p>
                <div className="step-actions">
                  <a href="/skills/csv-analyzer.zip" className="btn ghost" download>csv-analyzer.zip <span className="arrow">↓</span></a>
                </div>
                <div className="step-meta">
                  <span><span className="dot">●</span> ~4 KB</span>
                  <span>skill bundle</span>
                </div>
              </div>

              <div className="step reveal r4">
                <div className="step-num">03<span className="of">/04</span></div>
                <h3>Download the sample data</h3>
                <p>So you don&apos;t have to find a spreadsheet. A made-up ecommerce sales export. Drop it into Cowork the same way you dropped the skill.</p>
                <div className="step-actions">
                  <a href="/demo-assets/sample-csvs/sales-by-product-ecom.csv" className="btn ghost" download>sample.csv <span className="arrow">↓</span></a>
                </div>
                <div className="step-meta">
                  <span><span className="dot">●</span> ~8 KB</span>
                  <span>fake but realistic</span>
                </div>
              </div>

              <div className="step reveal r5">
                <div className="step-num">04<span className="of">/04</span></div>
                <h3>Copy this prompt, paste it in</h3>
                <p>One line. Cowork will pick up the skill and the CSV and run the whole analysis on its own.</p>
                <div className="prompt">
                  <span className="cmd-prefix">&gt;</span> <span>{PROMPT_TEXT}</span>
                  <button
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="step-meta">
                  <span><span className="dot">●</span> 1 line</span>
                  <span>that&apos;s the whole prompt</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* §03 THE POINT */}
        <section className="point-section">
          <div className="canvas">
            <div className="section-marker reveal r1">
              <span className="sect-num">§03</span>
              <span className="sect-label">The point</span>
              <span className="sect-meta">why this matters</span>
            </div>
            <div className="point-grid">
              <div className="point-quote reveal r2">
                <span className="ink-line">You didn&apos;t need a</span>
                <span className="orange-line">magic prompt.</span>
              </div>
              <div className="point-body reveal r3">
                <p>All the cleverness is in <span className="pull-mark">the skill file</span>. The one-line prompt was enough because the skill knows what to do, in what order, with which script, and how to present the result.</p>
                <p>Anyone can write one of these. I wrote the one you just used. There&apos;s a small library of them below if you want to keep going.</p>
              </div>
            </div>
          </div>
        </section>

        {/* §04 WHAT NOW */}
        <section className="next-section" id="next">
          <div className="canvas">
            <div className="section-marker reveal r1">
              <span className="sect-num">§04</span>
              <span className="sect-label">What next</span>
              <span className="sect-meta">if you want more</span>
            </div>
            <div className="next-grid">

              <Link href="/world" className="next-card reveal r2">
                <div className="level-tag"><span className="lvl-num">LV 2</span> More skills</div>
                <h4>Pick your job role. I&apos;ll show you eight more.</h4>
                <p>Same shape, different skills, tailored to your work. The one you just ran is already ticked off for you.</p>
                <div className="next-arrow">Continue <span className="a-glyph">→</span></div>
              </Link>

              <Link href="/world" className="next-card reveal r3">
                <div className="level-tag"><span className="lvl-num">LV 3</span> Your own data</div>
                <h4>Connectors, plugins, staying safe.</h4>
                <p>Hook Cowork into Gmail, calendars, design tools. Same kind of skills, running on your real stuff.</p>
                <div className="next-arrow">Continue <span className="a-glyph">→</span></div>
              </Link>

            </div>
          </div>
        </section>
      </div>
    </>
  )
}

const HOMEPAGE_STYLES = `
  .home-root {
    --bg: #FAFAF8;
    --paper: #FFFFFF;
    --ink: #0A0A0A;
    --ink-soft: #2A2A2A;
    --ink-mid: #555555;
    --ink-muted: #8A8A8A;
    --rule: #0A0A0A;
    --rule-faint: #E2DEDA;
    --orange: #D64C00;
    --orange-deep: #B33A00;
    --orange-tint: #FFF1E8;
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
  .home-root ::selection { background: var(--ink); color: var(--orange); }
  .home-root a { color: inherit; text-decoration: none; }

  .home-spine {
    position: fixed; top: 0; bottom: 0; left: 0;
    width: 4px; background: var(--orange); z-index: 100;
  }

  .home-root .canvas {
    max-width: var(--canvas-max);
    margin: 0 auto;
    padding: 0 var(--canvas-pad);
  }

  .home-root .topbar {
    border-bottom: 1px solid var(--rule);
    background: var(--bg);
    position: sticky; top: 0; z-index: 20;
  }
  .home-root .topbar-inner {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 0;
  }
  .home-root .wordmark {
    font-family: var(--font-oxanium), sans-serif; font-weight: 800; font-size: 18px;
    letter-spacing: -0.02em; display: flex; align-items: baseline; gap: 1px;
  }
  .home-root .wordmark .num { font-variant-numeric: tabular-nums; }
  .home-root .wordmark .slash { color: var(--orange); font-weight: 700; padding: 0 1px; }
  .home-root .wordmark .word { letter-spacing: 0.01em; }
  .home-root .topnav { display: flex; gap: 28px; }
  .home-root .topnav a {
    font-family: var(--font-oxanium), sans-serif; font-size: 12px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 1.5px; color: var(--ink-muted);
    border-bottom: 1px solid transparent; padding-bottom: 2px;
    transition: color .15s, border-color .15s;
  }
  .home-root .topnav a:hover { color: var(--ink); border-bottom-color: var(--orange); }

  .home-root .section-marker {
    display: flex; align-items: baseline; gap: 14px;
    padding: 18px 0 14px;
    border-bottom: 1px solid var(--rule);
  }
  .home-root .section-marker .sect-num {
    font-family: var(--font-oxanium), sans-serif; font-weight: 700; font-size: 11px;
    color: var(--orange); letter-spacing: 2px; font-variant-numeric: tabular-nums;
  }
  .home-root .section-marker .sect-label {
    font-family: var(--font-oxanium), sans-serif; font-weight: 600; font-size: 11px;
    color: var(--ink); letter-spacing: 2.5px; text-transform: uppercase;
  }
  .home-root .section-marker .sect-meta {
    margin-left: auto; font-family: var(--font-terminal), monospace; font-size: 12px;
    color: var(--ink-muted); letter-spacing: 0.5px;
  }

  .home-root .hero { padding: 56px 0 64px; }
  .home-root .hero-grid {
    display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 64px; align-items: end;
  }
  .home-root .hero h1 {
    font-family: var(--font-oxanium), sans-serif; font-weight: 700;
    font-size: clamp(56px, 8.5vw, 124px);
    line-height: 0.92; letter-spacing: -0.035em; margin: 0;
  }
  .home-root .hero h1 .em { color: var(--orange); display: inline-block; }
  .home-root .hero h1 .stop { color: var(--ink); }
  .home-root .hero-side {
    border-left: 4px solid var(--orange);
    padding-left: 24px; align-self: end;
  }
  .home-root .hero-side p {
    font-size: 17px; line-height: 1.55; color: var(--ink-soft);
    font-weight: 400; max-width: 480px; margin-bottom: 14px;
  }
  .home-root .hero-side p:last-child { margin-bottom: 0; }
  .home-root .hero-side .pull {
    color: var(--ink); font-weight: 600;
    background: var(--orange-tint); padding: 0 4px;
  }

  .home-root .hero-spec {
    display: grid; grid-template-columns: repeat(4, 1fr);
    margin-top: 56px;
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
  }
  .home-root .hero-spec .cell {
    padding: 18px 0; padding-right: 24px;
    border-right: 1px solid var(--rule-faint);
  }
  .home-root .hero-spec .cell:last-child { border-right: none; padding-right: 0; }
  .home-root .hero-spec .k {
    font-family: var(--font-oxanium), sans-serif; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 2px; color: var(--ink-muted);
    margin-bottom: 6px;
  }
  .home-root .hero-spec .v {
    font-family: var(--font-oxanium), sans-serif; font-size: 20px; font-weight: 600;
    color: var(--ink); font-variant-numeric: tabular-nums; letter-spacing: -0.01em;
  }
  .home-root .hero-spec .v .accent { color: var(--orange); }

  .home-root .steps-section { padding: 48px 0 64px; }
  .home-root .steps-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    margin-top: 32px;
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
  }
  .home-root .step {
    border-right: 1px solid var(--rule-faint);
    padding: 32px 28px 28px;
    display: flex; flex-direction: column;
    background: var(--paper);
    position: relative; min-height: 420px;
  }
  .home-root .step:last-child { border-right: none; }
  .home-root .step::before {
    content: ''; position: absolute; left: 0; top: 0; height: 5px; width: 100%;
    background: var(--orange);
    transform: scaleX(0); transform-origin: left;
    transition: transform .35s ease;
  }
  .home-root .step:hover::before { transform: scaleX(1); }
  .home-root .step-num {
    font-family: var(--font-oxanium), sans-serif; font-weight: 700;
    font-size: 88px; line-height: 0.85; color: var(--ink);
    letter-spacing: -0.04em; font-variant-numeric: tabular-nums;
    margin-bottom: 8px;
  }
  .home-root .step-num .of {
    color: var(--ink-muted); font-size: 14px; font-weight: 500;
    letter-spacing: 0.5px; margin-left: 6px;
    font-variant-numeric: tabular-nums;
  }
  .home-root .step h3 {
    font-family: var(--font-oxanium), sans-serif; font-weight: 600; font-size: 22px;
    line-height: 1.2; letter-spacing: -0.01em; margin-bottom: 10px; color: var(--ink);
  }
  .home-root .step p {
    font-size: 14px; line-height: 1.55; color: var(--ink-mid);
    margin-bottom: 18px;
  }
  .home-root .step .step-actions { margin-top: auto; }
  .home-root .step-meta {
    margin-top: 14px; padding-top: 12px;
    border-top: 1px dashed var(--rule-faint);
    display: flex; gap: 14px;
    font-family: var(--font-terminal), monospace; font-size: 12px;
    color: var(--ink-muted);
  }
  .home-root .step-meta .dot { color: var(--orange); }

  .home-root .btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-oxanium), sans-serif; font-weight: 600; font-size: 13px;
    letter-spacing: 0.5px; padding: 11px 18px;
    border: 1px solid var(--ink); background: var(--ink); color: var(--bg);
    border-radius: 2px; cursor: pointer;
    transition: background .12s, color .12s, border-color .12s;
  }
  .home-root .btn:hover { background: var(--orange); border-color: var(--orange); color: #fff; }
  .home-root .btn.ghost { background: transparent; color: var(--ink); border-color: var(--ink); }
  .home-root .btn.ghost:hover { background: var(--ink); color: var(--bg); }
  .home-root .btn .arrow { font-family: var(--font-terminal), monospace; font-weight: 500; }
  .home-root .alt {
    display: inline-block; font-family: var(--font-oxanium), sans-serif; font-size: 12px;
    color: var(--ink-muted); margin-top: 10px; letter-spacing: 0.3px;
    border-bottom: 1px dotted var(--ink-muted); padding-bottom: 1px;
  }
  .home-root .alt:hover { color: var(--ink); border-bottom-color: var(--ink); }

  .home-root .prompt {
    background: var(--ink); color: var(--bg);
    padding: 14px 16px;
    font-family: var(--font-terminal), monospace; font-size: 13px;
    line-height: 1.55; position: relative; margin-bottom: 14px; border-radius: 2px;
  }
  .home-root .prompt .cmd-prefix { color: var(--orange); }
  .home-root .copy-btn {
    position: absolute; top: 8px; right: 8px;
    background: var(--bg); color: var(--ink);
    font-family: var(--font-oxanium), sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 6px 10px; border: none; cursor: pointer; border-radius: 2px;
  }
  .home-root .copy-btn:hover { background: var(--orange); color: #fff; }
  .home-root .copy-btn.copied { background: var(--orange); color: #fff; }

  .home-root .point-section { padding: 64px 0; background: var(--bg); }
  .home-root .point-grid {
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 64px; align-items: start; margin-top: 36px;
  }
  .home-root .point-quote {
    font-family: var(--font-oxanium), sans-serif; font-weight: 700;
    font-size: clamp(40px, 5.5vw, 76px);
    line-height: 0.98; letter-spacing: -0.03em; color: var(--ink);
  }
  .home-root .point-quote .ink-line {
    display: block; padding-bottom: 6px;
    border-bottom: 1px solid var(--rule); margin-bottom: 12px;
  }
  .home-root .point-quote .orange-line { color: var(--orange); display: block; }
  .home-root .point-body { padding-top: 14px; border-top: 4px solid var(--ink); }
  .home-root .point-body p {
    font-size: 18px; line-height: 1.55; color: var(--ink-soft); margin-bottom: 16px;
  }
  .home-root .point-body p:last-child { margin-bottom: 0; }
  .home-root .point-body .pull-mark { color: var(--orange); font-weight: 600; }

  .home-root .next-section { padding: 56px 0 80px; }
  .home-root .next-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 32px;
  }
  .home-root .next-card {
    display: block; padding: 36px 32px;
    background: var(--paper);
    border: 1px solid var(--rule);
    border-left: 4px solid var(--orange);
    transition: transform .15s, border-color .15s;
    position: relative;
  }
  .home-root .next-card:hover { transform: translateY(-2px); }
  .home-root .next-card .level-tag {
    font-family: var(--font-oxanium), sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--orange);
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .home-root .next-card .level-tag .lvl-num {
    background: var(--orange); color: #fff; padding: 2px 8px;
    font-variant-numeric: tabular-nums; border-radius: 2px;
  }
  .home-root .next-card h4 {
    font-family: var(--font-oxanium), sans-serif; font-weight: 600; font-size: 28px;
    line-height: 1.15; letter-spacing: -0.015em; margin-bottom: 14px; color: var(--ink);
  }
  .home-root .next-card p {
    font-size: 15px; line-height: 1.55; color: var(--ink-mid); margin-bottom: 22px;
  }
  .home-root .next-card .next-arrow {
    font-family: var(--font-oxanium), sans-serif; font-weight: 600; font-size: 13px;
    color: var(--ink); letter-spacing: 0.5px;
    display: inline-flex; gap: 8px; align-items: center;
  }
  .home-root .next-card .next-arrow .a-glyph {
    font-family: var(--font-terminal), monospace; transition: transform .2s;
  }
  .home-root .next-card:hover .next-arrow .a-glyph { transform: translateX(4px); color: var(--orange); }

  .home-root .reveal { opacity: 0; transform: translateY(12px); animation: homeFadeUp .6s ease forwards; }
  .home-root .r1 { animation-delay: 0.05s; }
  .home-root .r2 { animation-delay: 0.18s; }
  .home-root .r3 { animation-delay: 0.30s; }
  .home-root .r4 { animation-delay: 0.42s; }
  .home-root .r5 { animation-delay: 0.54s; }
  @keyframes homeFadeUp { to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 1100px) {
    .home-root { --canvas-pad: 32px; }
    .home-root .hero-grid { grid-template-columns: 1fr; gap: 36px; }
    .home-root .steps-grid { grid-template-columns: repeat(2, 1fr); }
    .home-root .step:nth-child(2) { border-right: none; }
    .home-root .step:nth-child(1),
    .home-root .step:nth-child(2) { border-bottom: 1px solid var(--rule-faint); }
    .home-root .point-grid { grid-template-columns: 1fr; gap: 32px; }
    .home-root .next-grid { grid-template-columns: 1fr; }
    .home-root .hero-spec { grid-template-columns: repeat(2, 1fr); }
    .home-root .hero-spec .cell:nth-child(2) { border-right: none; }
    .home-root .hero-spec .cell:nth-child(1),
    .home-root .hero-spec .cell:nth-child(2) { border-bottom: 1px solid var(--rule-faint); }
  }
  @media (max-width: 640px) {
    .home-root { --canvas-pad: 20px; }
    .home-spine { width: 3px; }
    .home-root .steps-grid { grid-template-columns: 1fr; }
    .home-root .step { border-right: none; border-bottom: 1px solid var(--rule-faint); min-height: auto; }
    .home-root .step:last-child { border-bottom: none; }
    .home-root .hero-spec { grid-template-columns: 1fr; }
    .home-root .hero-spec .cell { border-right: none; border-bottom: 1px solid var(--rule-faint); padding-right: 0; }
    .home-root .hero-spec .cell:last-child { border-bottom: none; }
  }
`
