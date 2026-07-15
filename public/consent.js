/*
 * a2ai-consent v1.1.0 — shared cookie-consent banner + Google Consent Mode v2 loader.
 *
 * CANONICAL COPY. Deployed copies live in each site repo's public/ folder:
 *   ads2ai, 8020brain, mikerhodes, 8020agent, 8020skill, 8020members.
 * Edit here first, then copy to the repos and redeploy. Keep the version line in sync.
 *
 * How it works:
 *  - Sets Consent Mode v2 defaults to denied, then decides what to load.
 *  - A stored decision (localStorage "a2ai_consent_v1") always wins.
 *  - Otherwise the visitor's country comes from same-origin /cdn-cgi/trace
 *    (every site sits behind Cloudflare), cached 24h in localStorage.
 *  - Visitors outside the EEA/UK/Switzerland get all tags immediately and never
 *    see a banner. Regulated visitors see the banner; Accept loads everything
 *    with granted consent signals, Decline loads nothing.
 *  - window.__cookiePrefs() reopens the banner (footer "Cookie preferences" link).
 *  - Fires a "a2ai-consent" CustomEvent on document and sets window.__a2aiConsent
 *    so app code (e.g. PostHog init) can react.
 *
 * Per-site config, set BEFORE this script loads:
 *   window.__CONSENT_CONFIG = {
 *     gtm: 'GTM-XXXXXXX',                  // optional: GTM container to load on grant
 *     gtag: ['G-XXXX', 'AW-XXXX'],         // optional: direct gtag.js IDs (sites with no GTM)
 *     meta: '1234567890',                  // optional: Meta pixel ID
 *     linkedin: '123456',                  // optional: LinkedIn partner ID
 *     refgrow: '996',                      // optional: Refgrow project ID
 *     openai: 'JLffJ...',                  // optional: OpenAI ads measurement pixel ID
 *     accent: '#D64C00',                   // banner button colour
 *     privacy: '/privacy',                 // privacy policy URL for the banner link
 *     siteName: 'ads2ai.com'               // shown in the banner heading
 *   };
 */
(function () {
  'use strict';

  var CFG = window.__CONSENT_CONFIG || {};
  var DECISION_KEY = 'a2ai_consent_v1';
  var GEO_KEY = 'a2ai_geo_v1';
  var GEO_TTL_MS = 24 * 60 * 60 * 1000;
  var REGULATED = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
    'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
    'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'
  ];

  function readJSON(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  var state = { regulated: null, granted: null, loadersRun: false };

  /* ---------- tag loaders ---------- */

  function insertScript(src, attrs) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (attrs) for (var k in attrs) s.setAttribute(k, attrs[k]);
    var first = document.getElementsByTagName('script')[0];
    if (first && first.parentNode) first.parentNode.insertBefore(s, first);
    else document.head.appendChild(s);
    return s;
  }

  function loadGTM(id) {
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    insertScript('https://www.googletagmanager.com/gtm.js?id=' + id);
  }

  function loadGtag(ids) {
    if (!ids || !ids.length) return;
    insertScript('https://www.googletagmanager.com/gtag/js?id=' + ids[0]);
    gtag('js', new Date());
    for (var i = 0; i < ids.length; i++) gtag('config', ids[i]);
  }

  function loadMeta(id) {
    if (window.fbq) return;
    var n = window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    insertScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', id);
    window.fbq('track', 'PageView');
  }

  function loadLinkedIn(pid) {
    window._linkedin_partner_id = pid;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(pid);
    if (!window.lintrk) {
      window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
      window.lintrk.q = [];
    }
    insertScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
  }

  function loadRefgrow(projectId) {
    insertScript('https://scripts.refgrowcdn.com/latest.js', { 'data-project-id': projectId });
  }

  function loadOaiq(pixelId) {
    if (window.oaiq) return;
    var q = function () { q.q.push(arguments); };
    q.q = [];
    window.oaiq = q;
    insertScript('https://bzrcdn.openai.com/sdk/oaiq.min.js');
    window.oaiq('init', { pixelId: pixelId });
  }

  function runLoaders() {
    if (state.loadersRun) return;
    state.loadersRun = true;
    if (CFG.gtm) loadGTM(CFG.gtm);
    if (CFG.gtag) loadGtag(CFG.gtag);
    if (CFG.meta) loadMeta(CFG.meta);
    if (CFG.linkedin) loadLinkedIn(CFG.linkedin);
    if (CFG.refgrow) loadRefgrow(CFG.refgrow);
    if (CFG.openai) loadOaiq(CFG.openai);
  }

  /* ---------- consent state ---------- */

  function announce() {
    window.__a2aiConsent = { granted: state.granted, regulated: state.regulated };
    try {
      document.dispatchEvent(new CustomEvent('a2ai-consent', { detail: window.__a2aiConsent }));
    } catch (e) {}
  }

  function grant() {
    state.granted = true;
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
    runLoaders();
    announce();
  }

  function deny() {
    state.granted = false;
    announce();
  }

  function clearKnownCookies() {
    var prefixes = ['_ga', '_gid', '_gcl', '_fbp', '_fbc', '_clck', '_clsk',
      'li_', 'ln_', 'refgrow_ref_code', 'ph_phc_'];
    var parts = document.cookie.split(';');
    var host = location.hostname;
    var base = host.split('.').slice(-2).join('.');
    for (var i = 0; i < parts.length; i++) {
      var name = parts[i].split('=')[0].replace(/^\s+/, '');
      for (var p = 0; p < prefixes.length; p++) {
        if (name.indexOf(prefixes[p]) === 0) {
          var exp = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          document.cookie = name + exp;
          document.cookie = name + exp + '; domain=' + host;
          document.cookie = name + exp + '; domain=.' + base;
          break;
        }
      }
    }
  }

  function choose(granted) {
    writeJSON(DECISION_KEY, { granted: granted, t: Date.now() });
    hideBanner();
    if (granted) {
      grant();
    } else if (state.loadersRun) {
      // Tags already ran this pageview (they accepted earlier, or they're an
      // exempt visitor opting out). Clear what we can and reload clean.
      clearKnownCookies();
      state.granted = false;
      location.reload();
    } else {
      deny();
    }
  }

  /* ---------- geo ---------- */

  function timezoneSaysEurope() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      return tz.indexOf('Europe/') === 0;
    } catch (e) { return true; }
  }

  function getCountry(cb) {
    var cached = readJSON(GEO_KEY);
    if (cached && cached.c && (Date.now() - cached.t) < GEO_TTL_MS) return cb(cached.c);
    var done = false;
    var timer = setTimeout(function () {
      if (!done) { done = true; cb(null); }
    }, 3000);
    try {
      fetch('/cdn-cgi/trace').then(function (r) { return r.text(); }).then(function (txt) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        var m = txt.match(/(?:^|\n)loc=([A-Z]{2})/);
        var c = m ? m[1] : null;
        if (c) writeJSON(GEO_KEY, { c: c, t: Date.now() });
        cb(c);
      }).catch(function () {
        if (!done) { done = true; clearTimeout(timer); cb(null); }
      });
    } catch (e) {
      if (!done) { done = true; clearTimeout(timer); cb(null); }
    }
  }

  /* ---------- banner UI ---------- */

  function banner() { return document.getElementById('a2ai-consent'); }
  function hideBanner() {
    var el = banner();
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function showBanner() {
    if (banner()) return;
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', showBanner);
      return;
    }
    var accent = CFG.accent || '#D64C00';
    var privacy = CFG.privacy || '/privacy';
    var el = document.createElement('div');
    el.id = 'a2ai-consent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-label', 'Cookie consent');
    el.innerHTML =
      '<style>' +
      '#a2ai-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;' +
      'max-width:420px;background:#fff;color:#1a1a1a;border:1px solid #e2e2e2;' +
      'border-left:4px solid ' + accent + ';border-radius:2px;padding:18px 20px;' +
      'box-shadow:0 4px 24px rgba(0,0,0,0.12);font-size:14px;line-height:1.5;font-family:inherit}' +
      '@media(min-width:480px){#a2ai-consent{left:auto}}' +
      '#a2ai-consent p{margin:0 0 12px}' +
      '#a2ai-consent a{color:' + accent + ';text-decoration:underline}' +
      '#a2ai-consent .a2ai-consent-btns{display:flex;gap:8px}' +
      '#a2ai-consent button{flex:1;cursor:pointer;font:inherit;font-weight:600;' +
      'padding:9px 14px;border-radius:2px;border:1px solid #1a1a1a;background:#fff;color:#1a1a1a}' +
      '#a2ai-consent button.a2ai-accept{background:' + accent + ';border-color:' + accent + ';color:#fff}' +
      '</style>' +
      '<p>This site uses cookies for analytics and to measure ads. If you decline, ' +
      'nothing is tracked and the site still works. ' +
      '<a href="' + privacy + '">Privacy policy</a></p>' +
      '<div class="a2ai-consent-btns">' +
      '<button type="button" class="a2ai-accept">Accept</button>' +
      '<button type="button" class="a2ai-decline">Decline</button>' +
      '</div>';
    document.body.appendChild(el);
    el.querySelector('.a2ai-accept').addEventListener('click', function () { choose(true); });
    el.querySelector('.a2ai-decline').addEventListener('click', function () { choose(false); });
  }

  window.__cookiePrefs = function () {
    if (state.regulated === null) state.regulated = true;
    showBanner();
  };

  // Any element with data-cookie-prefs reopens the banner (footer links).
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-cookie-prefs]') : null;
    if (t) {
      e.preventDefault();
      window.__cookiePrefs();
    }
  });

  /* ---------- boot ---------- */

  var stored = readJSON(DECISION_KEY);
  if (stored && typeof stored.granted === 'boolean') {
    state.regulated = true; // only regulated visitors (or opt-outs) have a stored decision
    stored.granted ? grant() : deny();
  } else {
    getCountry(function (country) {
      var regulated = country ? REGULATED.indexOf(country) !== -1 : timezoneSaysEurope();
      state.regulated = regulated;
      if (!regulated) {
        grant(); // exempt visitor: tags load, no banner, nothing stored
      } else {
        deny();
        showBanner();
      }
    });
  }
})();
