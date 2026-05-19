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
        <div className="home-spine" aria-hidden="true" />

        <header className="topbar">
          <div className="canvas topbar-inner">
            <Link href="/" className="wordmark">
              <span className="num">80</span>
              <span className="slash">/</span>
              <span className="num">20</span>
              <span className="word">skill</span>
            </Link>
            <nav className="topnav">
              <Link href="/play">Level map</Link>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="canvas hero-grid">
            <h1>
              AI is much better when you give it <span className="em">skills</span>
              <span className="stop">.</span>
            </h1>
            <div className="hero-side">
              <p>Here&apos;s the deal. I made a skill, one small file, that knows how to analyse a spreadsheet properly. I&apos;ll give you the skill, some sample data, and the prompt to use.</p>
              <p>You <span className="pull">don&apos;t need a 15-paragraph magic prompt</span>. All the cleverness lives in the skill file. Anyone can write one. I&apos;ll show you one.</p>
            </div>
          </div>
        </section>

        {/* STEPS — vertical, sequential */}
        <section className="steps">
          <div className="canvas">

            <div id="step-1" className="step-row">
              <div className="step-num">01</div>
              <div className="step-body">
                <h3>Get Claude Cowork</h3>
                <p>The Anthropic desktop app. Free, takes a couple of minutes to install and sign in. This is where you&apos;ll drop the skill and the data.</p>
              </div>
              <div className="step-action">
                <a href="https://claude.ai/download" className="btn" target="_blank" rel="noopener">Download Cowork ↗</a>
                <a href="#step-2" className="alt">I already have it →</a>
              </div>
            </div>

            <div id="step-2" className="step-row">
              <div className="step-num">02</div>
              <div className="step-body">
                <h3>Download the skill</h3>
                <p>One small zip. Drop it into Cowork and say &ldquo;install this skill&rdquo;. This file is where the magic lives.</p>
              </div>
              <div className="step-action">
                <a href="/skills/csv-analyzer.zip" className="btn ghost" download>csv-analyzer.zip ↓</a>
              </div>
            </div>

            <div id="step-3" className="step-row">
              <div className="step-num">03</div>
              <div className="step-body">
                <h3>Download the sample data</h3>
                <p>So you don&apos;t need to find a spreadsheet. A made-up ecommerce sales export. Drop it into Cowork too.</p>
              </div>
              <div className="step-action">
                <a href="/demo-assets/sample-csvs/sales-by-product-ecom.csv" className="btn ghost" download>sample.csv ↓</a>
              </div>
            </div>

            <div id="step-4" className="step-row step-row-prompt">
              <div className="step-num">04</div>
              <div className="step-body">
                <h3>Copy this prompt, paste it in</h3>
                <p>One line. Cowork picks up the skill and the CSV, and runs the whole analysis on its own.</p>
                <div className="prompt">
                  <span className="cmd-prefix">&gt;</span>
                  <span className="prompt-text">{PROMPT_TEXT}</span>
                  <button
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* THE POINT */}
        <section className="point">
          <div className="canvas point-grid">
            <div className="point-quote">
              <span className="ink-line">You didn&apos;t need a</span>
              <span className="orange-line">magic prompt.</span>
            </div>
            <div className="point-body">
              <p>All the cleverness is in <span className="pull-mark">the skill file</span>. The one-line prompt was enough because the skill already knows what to do.</p>
              <p>Anyone can write one. I wrote the one you just used. There&apos;s a small library of them below if you want more.</p>
            </div>
          </div>
        </section>

        {/* WHAT NEXT */}
        <section className="next">
          <div className="canvas next-grid">
            <Link href="/world" className="next-card">
              <div className="level-tag"><span className="lvl-num">LV 2</span> More skills</div>
              <h4>Pick your job role. I&apos;ll show you eight more.</h4>
              <p>Same shape, different skills, tailored to your work.</p>
            </Link>
            <Link href="/world" className="next-card">
              <div className="level-tag"><span className="lvl-num">LV 3</span> Your own data</div>
              <h4>Connectors, plugins, staying safe.</h4>
              <p>Hook Cowork into Gmail, calendars, design tools. Real stuff.</p>
            </Link>
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

  /* TOPBAR */
  .home-root .topbar {
    border-bottom: 1px solid var(--rule);
    background: var(--bg);
    position: sticky; top: 0; z-index: 20;
  }
  .home-root .topbar-inner {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 0;
  }
  .home-root .wordmark {
    font-family: var(--font-oxanium), sans-serif; font-weight: 800; font-size: 18px;
    letter-spacing: -0.02em; display: flex; align-items: baseline;
  }
  .home-root .wordmark .num { font-variant-numeric: tabular-nums; }
  .home-root .wordmark .slash { color: var(--orange); font-weight: 700; padding: 0 1px; }
  .home-root .wordmark .word { letter-spacing: 0.01em; }
  .home-root .topnav { display: flex; gap: 24px; }
  .home-root .topnav a {
    font-family: var(--font-oxanium), sans-serif; font-size: 12px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 1.5px; color: var(--ink-muted);
    border-bottom: 1px solid transparent; padding-bottom: 2px;
    transition: color .15s, border-color .15s;
  }
  .home-root .topnav a:hover { color: var(--ink); border-bottom-color: var(--orange); }

  /* HERO */
  .home-root .hero { padding: 48px 0 40px; }
  .home-root .hero-grid {
    display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 56px; align-items: end;
  }
  .home-root .hero h1 {
    font-family: var(--font-oxanium), sans-serif; font-weight: 700;
    font-size: clamp(52px, 7vw, 104px);
    line-height: 0.95; letter-spacing: -0.035em; margin: 0;
  }
  .home-root .hero h1 .em { color: var(--orange); display: inline-block; }
  .home-root .hero h1 .stop { color: var(--ink); }
  .home-root .hero-side {
    border-left: 4px solid var(--orange);
    padding-left: 20px; align-self: end;
  }
  .home-root .hero-side p {
    font-size: 16px; line-height: 1.5; color: var(--ink-soft);
    margin-bottom: 12px;
  }
  .home-root .hero-side p:last-child { margin-bottom: 0; }
  .home-root .hero-side .pull {
    color: var(--ink); font-weight: 600;
    background: var(--orange-tint); padding: 0 4px;
  }

  /* STEPS — vertical rows */
  .home-root .steps { padding: 24px 0 32px; border-top: 1px solid var(--rule); }
  .home-root .step-row {
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr) auto;
    gap: 32px;
    align-items: center;
    padding: 24px 0;
    border-bottom: 1px solid var(--rule-faint);
    scroll-margin-top: 88px;
  }
  .home-root .step-row:last-child { border-bottom: none; }
  .home-root .step-num {
    font-family: var(--font-oxanium), sans-serif; font-weight: 700;
    font-size: 76px; line-height: 0.85; color: var(--ink);
    letter-spacing: -0.04em; font-variant-numeric: tabular-nums;
  }
  .home-root .step-body h3 {
    font-family: var(--font-oxanium), sans-serif; font-weight: 600; font-size: 24px;
    line-height: 1.2; letter-spacing: -0.01em; margin-bottom: 6px; color: var(--ink);
  }
  .home-root .step-body p {
    font-size: 15px; line-height: 1.5; color: var(--ink-mid); max-width: 640px;
    margin: 0;
  }
  .home-root .step-action {
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
    min-width: 220px;
  }

  /* Step 4: prompt block lives in the body column, action column collapses */
  .home-root .step-row-prompt {
    grid-template-columns: 120px minmax(0, 1fr);
    align-items: start;
    padding-top: 28px; padding-bottom: 28px;
  }

  /* Buttons */
  .home-root .btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-oxanium), sans-serif; font-weight: 600; font-size: 13px;
    letter-spacing: 0.5px; padding: 11px 18px;
    border: 1px solid var(--ink); background: var(--ink); color: var(--bg);
    border-radius: 2px; cursor: pointer; white-space: nowrap;
    transition: background .12s, color .12s, border-color .12s;
  }
  .home-root .btn:hover { background: var(--orange); border-color: var(--orange); color: #fff; }
  .home-root .btn.ghost { background: transparent; color: var(--ink); }
  .home-root .btn.ghost:hover { background: var(--ink); color: var(--bg); }
  .home-root .alt {
    font-family: var(--font-oxanium), sans-serif; font-size: 12px; font-weight: 500;
    color: var(--ink-muted); letter-spacing: 0.3px;
    border-bottom: 1px dotted var(--ink-muted); padding-bottom: 1px;
  }
  .home-root .alt:hover { color: var(--ink); border-bottom-color: var(--ink); }

  /* Prompt block */
  .home-root .prompt {
    margin-top: 14px;
    background: var(--ink); color: var(--bg);
    padding: 14px 110px 14px 16px;
    font-family: var(--font-terminal), monospace; font-size: 14px;
    line-height: 1.55; position: relative; border-radius: 2px;
    max-width: 720px;
  }
  .home-root .prompt .cmd-prefix { color: var(--orange); margin-right: 8px; }
  .home-root .copy-btn {
    position: absolute; top: 8px; right: 8px;
    background: var(--bg); color: var(--ink);
    font-family: var(--font-oxanium), sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 6px 14px; border: none; cursor: pointer; border-radius: 2px;
  }
  .home-root .copy-btn:hover { background: var(--orange); color: #fff; }
  .home-root .copy-btn.copied { background: var(--orange); color: #fff; }

  /* THE POINT */
  .home-root .point { padding: 56px 0 48px; border-top: 1px solid var(--rule); }
  .home-root .point-grid {
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
    gap: 48px; align-items: start;
  }
  .home-root .point-quote {
    font-family: var(--font-oxanium), sans-serif; font-weight: 700;
    font-size: clamp(36px, 4.5vw, 64px);
    line-height: 1; letter-spacing: -0.03em; color: var(--ink);
  }
  .home-root .point-quote .ink-line {
    display: block; padding-bottom: 4px;
    border-bottom: 1px solid var(--rule); margin-bottom: 10px;
  }
  .home-root .point-quote .orange-line { color: var(--orange); display: block; }
  .home-root .point-body { padding-top: 8px; border-top: 4px solid var(--ink); }
  .home-root .point-body p {
    font-size: 17px; line-height: 1.5; color: var(--ink-soft); margin-bottom: 12px;
  }
  .home-root .point-body p:last-child { margin-bottom: 0; }
  .home-root .point-body .pull-mark { color: var(--orange); font-weight: 600; }

  /* WHAT NEXT */
  .home-root .next { padding: 40px 0 48px; border-top: 1px solid var(--rule); }
  .home-root .next-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  }
  .home-root .next-card {
    display: block; padding: 24px 28px;
    background: var(--paper);
    border: 1px solid var(--rule-faint);
    border-left: 4px solid var(--orange);
    transition: transform .15s, border-color .15s;
    position: relative;
  }
  .home-root .next-card:hover { transform: translateY(-2px); border-color: var(--ink); border-left-color: var(--orange); }
  .home-root .next-card .level-tag {
    font-family: var(--font-oxanium), sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--orange);
    margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .home-root .next-card .level-tag .lvl-num {
    background: var(--orange); color: #fff; padding: 2px 8px;
    font-variant-numeric: tabular-nums; border-radius: 2px;
  }
  .home-root .next-card h4 {
    font-family: var(--font-oxanium), sans-serif; font-weight: 600; font-size: 22px;
    line-height: 1.2; letter-spacing: -0.01em; margin-bottom: 8px; color: var(--ink);
  }
  .home-root .next-card p {
    font-size: 14px; line-height: 1.5; color: var(--ink-mid); margin: 0;
  }

  /* Responsive */
  @media (max-width: 1100px) {
    .home-root { --canvas-pad: 32px; }
    .home-root .hero-grid { grid-template-columns: 1fr; gap: 28px; }
    .home-root .hero { padding: 40px 0 32px; }
    .home-root .step-row { grid-template-columns: 90px minmax(0, 1fr); gap: 24px; }
    .home-root .step-num { font-size: 56px; }
    .home-root .step-action {
      grid-column: 1 / -1;
      flex-direction: row; align-items: center; justify-content: flex-start;
      gap: 18px; padding-left: 114px; min-width: 0;
    }
    .home-root .step-row-prompt { grid-template-columns: 90px minmax(0, 1fr); }
    .home-root .point-grid { grid-template-columns: 1fr; gap: 24px; }
    .home-root .next-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .home-root { --canvas-pad: 20px; }
    .home-spine { width: 3px; }
    .home-root .step-row { grid-template-columns: 1fr; gap: 8px; padding: 20px 0; }
    .home-root .step-num { font-size: 44px; }
    .home-root .step-action { padding-left: 0; flex-direction: column; align-items: flex-start; }
  }
`
