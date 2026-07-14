'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { track } from '@/lib/tracking'
import pkg from '@/package.json'

export default function SiteFooter() {
  const router = useRouter()
  const { resetGame } = useGame()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handlePackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Reuse the existing feedback-sheet Apps Script endpoint (tab=skill-pack).
      // It auto-emails the pack + course and marks the row SENT, so fulfilment
      // needs no new infrastructure. Same endpoint the old victory screen used.
      const params = new URLSearchParams()
      params.append('tab', 'skill-pack')
      params.append('email', email)
      params.append('feature', '[SKILL-PACK] source=footer')
      await fetch(`https://script.google.com/macros/s/AKfycbxM-7kMQaAmqsdp9AhI9tyLh13XUBmG17-QpvtIv_bej9cgJv9rOIaD27Z-ymYg5bboyg/exec?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
      })
      setSubmitted(true)
      track({ eventType: 'skill_pack_claimed', metadata: { email, source: 'footer' } })
    } catch (err) {
      console.error('Failed to submit skill pack email:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer className="site-foot font-heading">
      <style>{FOOTER_STYLES}</style>

      {/* Quiet pack capture — low hierarchy, sits at the bottom of every page */}
      <div className="foot-capture">
        {submitted ? (
          <p className="foot-capture-done">On its way. Check your inbox in the next few minutes.</p>
        ) : (
          <form className="foot-capture-form" onSubmit={handlePackSubmit}>
            <label className="foot-capture-label" htmlFor="foot-email">
              Want the full pack? 10 Cowork skills plus a short course, free.
            </label>
            <span className="foot-capture-row">
              <input
                id="foot-email"
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="foot-capture-input"
              />
              <button type="submit" disabled={submitting} className="foot-capture-btn">
                {submitting ? 'Sending…' : 'Send it'}
              </button>
            </span>
          </form>
        )}
      </div>

      {/* Existing meta row */}
      <div className="foot-meta">
        <span>&copy; Mike Rhodes 2026 &middot; v{pkg.version}</span>
        <span style={{ margin: '0 8px' }}>&middot;</span>
        <button
          onClick={() => { resetGame(); router.push('/') }}
          className="foot-reset"
        >
          Reset all demos
        </button>
        <span style={{ margin: '0 8px' }}>&middot;</span>
        <a href="#" data-cookie-prefs className="foot-reset" style={{ textDecoration: 'none' }}>
          Cookie preferences
        </a>
      </div>
    </footer>
  )
}

const FOOTER_STYLES = `
  .site-foot { --foot-orange: #D64C00; }
  .site-foot .foot-capture {
    border-top: 1px solid #E2DEDA;
    padding: 18px 16px 14px;
    text-align: center;
  }
  .site-foot .foot-capture-form {
    display: inline-flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .site-foot .foot-capture-label {
    font-size: 12px; color: #888; letter-spacing: 0.3px;
  }
  .site-foot .foot-capture-row { display: inline-flex; gap: 6px; }
  .site-foot .foot-capture-input {
    font-size: 12px; padding: 7px 10px; width: 200px;
    border: 1px solid #d9d4cf; border-radius: 2px;
    background: #fff; color: #2A2A2A;
  }
  .site-foot .foot-capture-input:focus {
    outline: none; border-color: var(--foot-orange);
  }
  .site-foot .foot-capture-btn {
    font-family: inherit; font-size: 12px; font-weight: 700; letter-spacing: 0.4px;
    padding: 7px 14px; border: 1px solid #c8c3bd; border-radius: 2px;
    background: #fff; color: #555; cursor: pointer;
    transition: background .12s, color .12s, border-color .12s;
  }
  .site-foot .foot-capture-btn:hover {
    background: var(--foot-orange); border-color: var(--foot-orange); color: #fff;
  }
  .site-foot .foot-capture-btn:disabled { opacity: .5; cursor: default; }
  .site-foot .foot-capture-done {
    font-size: 12px; color: #059669; margin: 0; letter-spacing: 0.3px;
  }
  .site-foot .foot-meta {
    text-align: center; padding: 12px 0; font-size: 11px; color: #bbb; letter-spacing: 0.5px;
  }
  .site-foot .foot-reset {
    color: #888; font-size: 11px; background: none; border: none; cursor: pointer;
    letter-spacing: 0.5px; transition: color .12s;
  }
  .site-foot .foot-reset:hover { color: rgba(0,0,0,0.5); }
`
