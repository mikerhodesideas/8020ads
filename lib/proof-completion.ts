const STORAGE_KEY = '8020skill-completed-proofs'

export function getCompletedProofs(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

export function markProofCompleted(type: string): void {
  if (typeof window === 'undefined') return
  const completed = getCompletedProofs()
  completed.add(type)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]))
}

export function allProofsCompleted(): boolean {
  const completed = getCompletedProofs()
  return completed.has('inbox') && completed.has('website') && completed.has('data')
}
