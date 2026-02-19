import type { ReactNode } from 'react'

/**
 * Wraps case-insensitive query matches in bold + light opaque highlight.
 * Use for search result highlighting in list and detail views.
 */
export function highlightMatches(text: string, query: string): ReactNode {
  if (!query || !query.trim() || !text) return text
  const q = query.trim().toLowerCase()
  const segments: ReactNode[] = []
  const lower = text.toLowerCase()
  let pos = 0
  let key = 0
  while (pos < text.length) {
    const i = lower.indexOf(q, pos)
    if (i === -1) {
      segments.push(<span key={key++}>{text.slice(pos)}</span>)
      break
    }
    if (i > pos) segments.push(<span key={key++}>{text.slice(pos, i)}</span>)
    segments.push(
      <mark key={key++} className="font-bold bg-yellow-200/70 rounded-sm">
        {text.slice(i, i + q.length)}
      </mark>
    )
    pos = i + q.length
  }
  return <>{segments}</>
}
