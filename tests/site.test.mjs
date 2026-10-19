// Fast checks that run before `next build`, locally (pre-push hook) and in CI.
// Each one guards a mistake that has shipped here before or would break a page
// without failing the build. Run with `npm test`.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = (p) => readFileSync(join(root, p), 'utf8')

function walk(dir, exts) {
  const out = []
  for (const name of readdirSync(join(root, dir))) {
    const rel = join(dir, name)
    if (statSync(join(root, rel)).isDirectory()) out.push(...walk(rel, exts))
    else if (exts.includes(extname(name))) out.push(rel)
  }
  return out
}

// Source that ends up in the site: app/, components/, and only the lib/ files
// something actually imports (lib/course-data-scout.ts is a draft nothing loads).
function shippedSource() {
  const files = [...walk('app', ['.ts', '.tsx']), ...walk('components', ['.ts', '.tsx'])]
  const seen = new Set(files)
  const queue = [...files]
  while (queue.length) {
    const src = read(queue.pop())
    for (const [, mod] of src.matchAll(/from ['"]@\/lib\/([\w-]+)['"]/g)) {
      const f = `lib/${mod}.ts`
      if (!seen.has(f) && existsSync(join(root, f))) { seen.add(f); queue.push(f) }
    }
  }
  return [...seen]
}

// Comments never reach a visitor, so they're allowed to break the copy rules.
const stripComments = (src) =>
  src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const routes = () => {
  const dirs = walk('app', ['.tsx']).filter((f) => f.endsWith('page.tsx')).map((f) => '/' + relative('app', f).replace(/\/?page\.tsx$/, ''))
  return dirs.map((d) => (d === '/' ? '/' : d.replace(/\/$/, '')))
}

test('the key pages exist', () => {
  const have = new Set(routes())
  for (const r of ['/', '/start', '/faq', '/how-it-works', '/course', '/course/[lesson]', '/skills-course', '/skills-course/[lesson]', '/play', '/play/[id]', '/proof/[type]', '/setup', '/world', '/victory', '/cowork']) {
    assert.ok(have.has(r), `page missing: ${r}`)
  }
})

test('every internal link and redirect points at a page that exists', () => {
  const have = routes()
  const matches = (path) => have.some((r) => {
    const a = r.split('/'), b = path.split('/')
    return a.length === b.length && a.every((seg, i) => seg.startsWith('[') || seg === b[i])
  })
  const bad = []
  for (const f of shippedSource()) {
    const src = read(f)
    for (const [, path] of src.matchAll(/(?:href=|push\(|replace\()\{?["'`](\/[^"'`?#$]*)["'`?#]/g)) {
      if (/\.\w+$/.test(path)) continue // files under public/, checked below
      if (!matches(path.replace(/\/$/, '') || '/')) bad.push(`${f}: ${path}`)
    }
  }
  assert.deepEqual(bad, [], 'links to pages that do not exist')
})

test('fixed lesson and proof links match real lesson ids and proof types', () => {
  const lessonIds = new Set([...read('lib/course-data.ts').matchAll(/id: "(\d+-\d+)"/g)].map((m) => m[1]))
  const proofTypes = read('lib/proof-data.ts').match(/PROOF_TYPES: ProofType\[\] = \[([^\]]+)\]/)[1].match(/'[\w-]+'/g).map((s) => s.slice(1, -1))
  assert.ok(lessonIds.size > 10, 'could not read lesson ids from lib/course-data.ts')
  const bad = []
  for (const f of shippedSource()) {
    for (const [, id] of read(f).matchAll(/["'`]\/course\/(\d+-\d+)["'`]/g)) if (!lessonIds.has(id)) bad.push(`${f}: /course/${id}`)
    for (const [, t] of read(f).matchAll(/["'`]\/proof\/([\w-]+)["'`]/g)) if (!proofTypes.includes(t)) bad.push(`${f}: /proof/${t}`)
  }
  assert.deepEqual(bad, [])
})

test('lesson ids are unique in each course', () => {
  for (const f of ['lib/course-data.ts', 'lib/course-data-skills-course.ts']) {
    const ids = [...read(f).matchAll(/^\s+id: ["']([\w-]+)["'],/gm)].map((m) => m[1])
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    assert.deepEqual(dupes, [], `${f} has duplicate lesson ids`)
  }
})

test('every file the site links to or downloads is in public/', () => {
  const missing = new Set()
  for (const f of shippedSource()) {
    for (const [, path] of read(f).matchAll(/["'`(](\/(?:skills|data|images|sounds|demo-assets|music|fonts)\/[^"'`)\s${}]+\.\w+)/g)) {
      if (!existsSync(join(root, 'public', decodeURI(path)))) missing.add(`${f}: ${path}`)
    }
  }
  assert.deepEqual([...missing], [])
})

test('JSON files in public/ parse', () => {
  for (const f of walk('public', ['.json'])) assert.doesNotThrow(() => JSON.parse(read(f)), `${f} is not valid JSON`)
})

test('the brand is spelled Ads2AI in shipped copy', () => {
  const bad = []
  for (const f of [...shippedSource(), ...walk('public', ['.html', '.js'])]) {
    read(f).split('\n').forEach((line, i) => {
      if (/ads to ai|adstoai|ads 2 ai/i.test(line)) bad.push(`${f}:${i + 1}: ${line.trim().slice(0, 100)}`)
    })
  }
  assert.deepEqual(bad, [], 'write it as "Ads2AI"')
})

test('no em dashes in shipped copy', () => {
  const bad = []
  for (const f of [...shippedSource(), ...walk('public', ['.html'])]) {
    const src = f.endsWith('.html') ? read(f).replace(/<!--[\s\S]*?-->/g, '') : stripComments(read(f))
    src.split('\n').forEach((line, i) => { if (/—|\\u2014|&mdash;|&#8212;/.test(line)) bad.push(`${f}: ${line.trim().slice(0, 100)}`) })
  }
  assert.deepEqual(bad, [], 'use a comma, full stop or brackets instead of an em dash')
})

test('fonts are bundled, never fetched from Google at build time', () => {
  // A Google Fonts download failing mid-build once broke a deploy (v1.0.68).
  const bad = shippedSource().filter((f) => read(f).includes('next/font/google'))
  assert.deepEqual(bad, [])
})

test('TypeScript compiles (next build skips type errors in this repo)', () => {
  try {
    execFileSync(join(root, 'node_modules/.bin/tsc'), ['--noEmit', '-p', root], { cwd: root, encoding: 'utf8', stdio: 'pipe' })
  } catch (e) {
    assert.fail(`tsc --noEmit failed:\n${(e.stdout || '') + (e.stderr || '')}`.slice(0, 4000))
  }
})
