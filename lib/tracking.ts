const TRACKING_URL = 'https://api.ads2ai.com/api/track'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('8020skill-session-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('8020skill-session-id', id)
  }
  return id
}

interface TrackingData {
  eventType: string
  avatarType?: string | null
  worldId?: string | null
  demoId?: number | null
  demoLevel?: number | null
  skillId?: string | null
  metadata?: Record<string, unknown> | null
}

export function track(data: TrackingData): void {
  const sessionId = getSessionId()
  if (!sessionId) return

  const payload = {
    sessionId,
    ...data,
  }

  fetch(TRACKING_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {
    // silently ignore tracking errors
  })
}
