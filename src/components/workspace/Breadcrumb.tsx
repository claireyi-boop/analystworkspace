import { ChevronRight } from 'lucide-react'

export interface BreadcrumbProps {
  /** Segments in order: e.g. ['Top 5 Issues', 'All Interactions', 'REV-GGL-1024'] */
  segments: string[]
  /** Optional: call when a segment is clicked (index). Last segment typically not clickable. */
  onSegmentClick?: (index: number) => void
}

export function Breadcrumb({ segments, onSegmentClick }: BreadcrumbProps) {
  if (segments.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-600">
      {segments.map((label, i) => {
        const isLast = i === segments.length - 1
        const isClickable = !isLast && onSegmentClick != null
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight size={14} className="text-gray-400 shrink-0" aria-hidden />
            )}
            {isClickable ? (
              <button
                type="button"
                onClick={() => onSegmentClick(i)}
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {label}
              </button>
            ) : (
              <span className={isLast ? 'font-semibold text-gray-800' : 'font-medium text-gray-600'}>
                {label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
