'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export default function WipeTest() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPos, setSliderPos] = useState(30) // Start at 30%
  const isDragging = useRef(false)

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100))
    setSliderPos(pct)
  }, [])

  const handleMouseDown = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    // Jump slider to click position
    if (e && containerRef.current) {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as React.MouseEvent).clientX
      if (clientX !== undefined) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const pct = Math.max(2, Math.min(98, (x / rect.width) * 100))
        setSliderPos(pct)
      }
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX)
    }
    const onEnd = () => handleMouseUp()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [handleMove, handleMouseUp])

  return (
    <div style={{ background: '#111', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#f59e0b', marginBottom: 8 }}>
            Before vs After
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Drag to compare
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8' }}>
            The left side shows the original. The right shows what AI built in under a minute.
          </p>
        </div>

        {/* Comparison container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          style={{
            position: 'relative',
            width: '100%',
            height: 1000,
            overflow: 'hidden',
            border: '2px solid #333',
            cursor: 'col-resize',
          }}
        >
          {/* AFTER layer (full width, sits behind) */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
            <AfterWebsite />
          </div>

          {/* BEFORE layer (clipped to slider position, overlaid on top) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
              overflow: 'hidden',
            }}
          >
            <div style={{ filter: 'grayscale(100%) brightness(0.85)', width: '100%' }}>
              <BeforeWebsite />
            </div>
          </div>

          {/* Labels */}
          <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            zIndex: 10,
            pointerEvents: 'none',
          }}>
            Before
          </div>
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(245,158,11,0.9)',
            color: '#0f172a',
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            zIndex: 10,
            pointerEvents: 'none',
          }}>
            After
          </div>

          {/* Slider line (visible) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${sliderPos}%`,
              transform: 'translateX(-50%)',
              width: 3,
              height: '100%',
              background: '#f59e0b',
              zIndex: 20,
              pointerEvents: 'none',
              boxShadow: '0 0 8px rgba(245,158,11,0.4)',
            }}
          />

          {/* Slider grab zone (wide invisible hit area, covers full height) */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            style={{
              position: 'absolute',
              top: 0,
              left: `${sliderPos}%`,
              transform: 'translateX(-50%)',
              width: 32,
              height: '100%',
              cursor: 'col-resize',
              zIndex: 25,
              touchAction: 'none',
            }}
          />

          {/* Small handle indicator (centered on line) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${sliderPos}%`,
              transform: 'translate(-50%, -50%)',
              width: 36,
              height: 36,
              background: '#f59e0b',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
              pointerEvents: 'none',
              boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8 5l-5 7 5 7" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 5l5 7-5 7" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Before Website (inline render, not iframe) ─── */
function BeforeWebsite() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f5f5', color: '#333' }}>
      {/* Header */}
      <div style={{ background: '#2c3e50', padding: 20, textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 32, margin: 0 }}>Thunderbolt Electricals</h1>
        <p style={{ color: '#ccc', fontSize: 13, marginTop: 5 }}>Est. 2003 - ABN 12 345 678 901 - Lic. No. EC12345</p>
      </div>

      {/* Nav */}
      <div style={{ background: '#34495e', padding: 10, textAlign: 'center' }}>
        {['HOME', 'SERVICES', 'ABOUT US', 'GALLERY', 'CONTACT'].map(item => (
          <span key={item} style={{ color: '#ecf0f1', margin: '0 15px', fontSize: 15 }}>{item}</span>
        ))}
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white' }}>
        <h2 style={{ color: '#2c3e50', fontSize: 28, marginBottom: 10 }}>Welcome to Thunderbolt Electricals</h2>
        <p style={{ color: '#666', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.5 }}>
          Melbourne&apos;s Most Trusted Electrician Since 2003. We do all kinds of electrical work. Big jobs, small jobs, medium jobs. If it&apos;s got wires, we&apos;re your guys!
        </p>
      </div>

      {/* Services */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <h2 style={{ color: '#2c3e50' }}>Our Services</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15, justifyContent: 'center', margin: '20px 0' }}>
          {[
            { name: 'House Rewiring', desc: "Old wires? We'll replace em!", price: 'From $2,500' },
            { name: 'Hot Water', desc: 'Electric hot water systems installed', price: 'From $800' },
            { name: 'Ceiling Fans', desc: 'Beat the heat mate!', price: 'From $150' },
            { name: 'Switchboard Upgrades', desc: 'Safety switches and RCDs', price: 'From $450' },
            { name: 'LED Lighting', desc: 'Save money on your bill!', price: 'From $50/light' },
            { name: 'Emergency Call Out', desc: '24/7 - we never sleep', price: 'From $180' },
          ].map(s => (
            <div key={s.name} style={{ background: 'white', border: '1px solid #ddd', padding: 20, width: 220, textAlign: 'center' }}>
              <h3 style={{ color: '#2c3e50', fontSize: 16, marginTop: 0 }}>{s.name}</h3>
              <p style={{ color: '#666', fontSize: 14, margin: '5px 0' }}>{s.desc}</p>
              <p style={{ color: '#e67e22', fontWeight: 'bold' }}>{s.price}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: '#e67e22', color: 'white', textAlign: 'center', padding: 20, margin: '20px 0' }}>
          <p>Call Bruce Now</p>
          <p style={{ fontSize: 28, fontWeight: 'bold' }}>0412 345 678</p>
          <p>or email: bruce@thunderboltelectricals.com.au</p>
        </div>

        {/* Why Choose Us */}
        <h2 style={{ color: '#2c3e50' }}>Why Choose Us?</h2>
        <table style={{ borderCollapse: 'collapse', width: '100%', margin: '20px 0' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left', background: '#f8f8f8' }}>Feature</th>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left', background: '#f8f8f8' }}>Us</th>
              <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left', background: '#f8f8f8' }}>Other Guys</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Licensed', 'YES!', 'Maybe?'],
              ['Insured', 'Fully', 'Who knows'],
              ['On Time', 'Always*', 'Rarely'],
              ['Clean Up', 'Spotless', "Don't count on it"],
              ['Price', 'Fair dinkum', 'Through the roof'],
            ].map(row => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td key={i} style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 11, color: '#999' }}>*Subject to traffic conditions and acts of God</p>

        {/* Testimonials */}
        <h2 style={{ color: '#2c3e50' }}>Happy Customers</h2>
        {[
          { quote: 'Bruce fixed our switchboard in no time. Top bloke!', author: 'Margaret T., Kew' },
          { quote: "They showed up when they said they would. That's rare for a tradie!", author: 'Dave S., Richmond' },
          { quote: 'Not the cheapest but definitely the best. Would recommend.', author: 'Jenny L., Hawthorn' },
        ].map(t => (
          <div key={t.author} style={{ background: 'white', border: '1px solid #ddd', padding: 15, margin: '10px 0' }}>
            <p><em>&ldquo;{t.quote}&rdquo;</em></p>
            <p><strong>- {t.author}</strong></p>
          </div>
        ))}

        {/* Areas */}
        <h2 style={{ color: '#2c3e50' }}>Service Areas</h2>
        <p>We cover all of Melbourne&apos;s inner east: Kew, Hawthorn, Richmond, Camberwell, Balwyn, Surrey Hills, Canterbury, Box Hill, Glen Iris, Malvern, and surrounding suburbs.</p>
      </div>

      {/* Bottom CTA */}
      <div style={{ background: '#e67e22', color: 'white', textAlign: 'center', padding: 20 }}>
        <p>Don&apos;t Get Left in the Dark!</p>
        <p>Call Thunderbolt Electricals Today</p>
        <p style={{ fontSize: 28, fontWeight: 'bold' }}>0412 345 678</p>
      </div>

      {/* Footer */}
      <div style={{ background: '#2c3e50', color: '#999', textAlign: 'center', padding: 15, fontSize: 12 }}>
        <p>Copyright 2019 Thunderbolt Electricals. All rights reserved.</p>
      </div>
    </div>
  )
}

/* ─── After Website (inline render, not iframe) ─── */
function AfterWebsite() {
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", color: '#1a1a2e', lineHeight: 1.6, background: '#fff' }}>
      {/* Topbar */}
      <div style={{ background: '#0f172a', color: '#94a3b8', fontSize: 13, padding: '8px 0', textAlign: 'center' }}>
        <span style={{ margin: '0 16px' }}><strong style={{ color: '#f59e0b' }}>24/7 Emergency Service</strong></span>
        <span style={{ margin: '0 16px' }}>Lic. No. EC12345</span>
        <span style={{ margin: '0 16px' }}>Serving Melbourne since 2003</span>
        <span style={{ margin: '0 16px' }}><strong style={{ color: '#f59e0b' }}>0412 345 678</strong></span>
      </div>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: -0.5 }}>
            Thunderbolt<span style={{ color: '#f59e0b' }}>.</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {['Services', 'About', 'Reviews', 'Areas'].map(item => (
              <span key={item} style={{ color: '#475569', fontSize: 14, fontWeight: 500 }}>{item}</span>
            ))}
            <span style={{ background: '#f59e0b', color: '#0f172a', padding: '10px 20px', fontWeight: 600, fontSize: 14 }}>Get a Free Quote</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1, marginBottom: 20 }}>
              Melbourne&apos;s most reliable <span style={{ color: '#f59e0b' }}>electrician</span>
            </h1>
            <p style={{ fontSize: 18, color: '#cbd5e1', marginBottom: 32, lineHeight: 1.7 }}>
              Licensed, insured, and on time. From emergency repairs to full home rewiring, Thunderbolt Electricals has been keeping Melbourne&apos;s lights on for over 20 years.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
              <span style={{ background: '#f59e0b', color: '#0f172a', padding: '14px 28px', fontSize: 16, fontWeight: 700 }}>Call 0412 345 678</span>
              <span style={{ background: 'transparent', color: 'white', padding: '14px 28px', fontSize: 16, fontWeight: 600, border: '2px solid #475569' }}>Get a Free Quote</span>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Licensed EC12345', 'Fully insured', 'Same-day service'].map(item => (
                <span key={item} style={{ color: '#94a3b8', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>&#10003;</span> {item}
                </span>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                { num: '20+', label: 'Years Experience' },
                { num: '4,700+', label: 'Jobs Completed' },
                { num: '4.9', label: 'Google Rating' },
                { num: '24/7', label: 'Emergency Service' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#f59e0b' }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, color: '#f59e0b', marginBottom: 8 }}>What we do</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 12, letterSpacing: -0.5 }}>Electrical services for every need</div>
          <div style={{ fontSize: 16, color: '#64748b', marginBottom: 48, maxWidth: 500 }}>From a single light fitting to a full home rewire. Fixed pricing, no surprises.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: '&#9889;', name: 'House Rewiring', desc: 'Complete rewiring for older homes. We bring your wiring up to current Australian standards with minimal disruption.', price: 'From $2,500' },
              { icon: '&#9748;', name: 'Hot Water Systems', desc: 'Electric hot water system installation and replacement. Energy-efficient options to reduce your bills.', price: 'From $800' },
              { icon: '&#127744;', name: 'Ceiling Fans', desc: 'Stay cool in summer, warm in winter. Professional installation of ceiling fans in any room.', price: 'From $150' },
              { icon: '&#9878;', name: 'Switchboard Upgrades', desc: 'Safety switches and RCDs to protect your family. Essential for homes with older switchboards.', price: 'From $450' },
              { icon: '&#128161;', name: 'LED Lighting', desc: 'Cut your lighting costs by up to 80%. We design and install LED solutions for homes and businesses.', price: 'From $50/light' },
              { icon: '&#128680;', name: 'Emergency Call Out', desc: "Power out? Sparks? Burning smell? We're available 24/7 for electrical emergencies across Melbourne.", price: 'From $180' },
            ].map(s => (
              <div key={s.name} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '32px 24px' }}>
                <div style={{ width: 48, height: 48, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 24 }} dangerouslySetInnerHTML={{ __html: s.icon }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{s.name}</h3>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>{s.desc}</p>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>{s.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, color: '#f59e0b', marginBottom: 8 }}>What customers say</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 48, letterSpacing: -0.5 }}>Trusted by thousands of Melbourne homes</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { quote: 'Bruce fixed our switchboard in no time. Explained everything clearly, cleaned up after himself, and the price was exactly what he quoted. Top bloke!', author: 'Margaret T.', loc: 'Kew' },
              { quote: "They showed up when they said they would. That's rare for a tradie! The LED upgrade has already saved us money on our power bill. Highly recommend.", author: 'Dave S.', loc: 'Richmond' },
              { quote: 'Not the cheapest but definitely the best. Bruce found a wiring issue the previous sparky missed completely. Worth every cent for the peace of mind.', author: 'Jenny L.', loc: 'Hawthorn' },
            ].map(t => (
              <div key={t.author} style={{ border: '1px solid #e2e8f0', padding: 28 }}>
                <div style={{ color: '#f59e0b', fontSize: 16, marginBottom: 12, letterSpacing: 2 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <blockquote style={{ fontSize: 15, color: '#334155', lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</blockquote>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{t.author}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{t.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section style={{ padding: '80px 24px', background: '#0f172a', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, color: '#f59e0b', marginBottom: 8 }}>The Thunderbolt difference</div>
          <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 48, letterSpacing: -0.5 }}>Why 4,700+ customers choose us</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {[
              { icon: '&#128737;', title: 'Licensed & Insured', desc: 'Fully licensed (EC12345) and comprehensively insured. Your home is protected.' },
              { icon: '&#9200;', title: 'On Time, Every Time', desc: 'We give you a 30-minute arrival window and stick to it. Your time matters.' },
              { icon: '&#128176;', title: 'Fixed Pricing', desc: 'No hourly rates, no surprises. You know the cost before we start any work.' },
              { icon: '&#128736;', title: 'Clean & Tidy', desc: 'We leave your home cleaner than we found it. That\'s our guarantee.' },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{item.title}</h4>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section style={{ padding: '60px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, color: '#f59e0b', marginBottom: 8 }}>Service areas</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 24, letterSpacing: -0.5 }}>Covering Melbourne&apos;s inner east and beyond</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {['Kew', 'Hawthorn', 'Richmond', 'Camberwell', 'Balwyn', 'Surrey Hills', 'Canterbury', 'Box Hill', 'Glen Iris', 'Malvern', 'Brighton', 'Prahran', 'South Yarra', 'Toorak', '+ surrounding suburbs'].map(area => (
              <span key={area} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '6px 14px', fontSize: 13, color: '#475569' }}>{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Ready to get it sorted?</h2>
        <p style={{ fontSize: 18, color: '#451a03', marginBottom: 32 }}>Free quotes for all non-emergency work. Same-day emergency service available.</p>
        <div style={{ fontSize: 48, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>0412 345 678</div>
        <div style={{ color: '#451a03', fontSize: 16 }}>or email bruce@thunderboltelectricals.com.au</div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#64748b', padding: '32px 24px', textAlign: 'center', fontSize: 13 }}>
        <p>&copy; 2024 Thunderbolt Electricals. ABN 12 345 678 901. Licensed Electrical Contractor EC12345.</p>
      </footer>
    </div>
  )
}
