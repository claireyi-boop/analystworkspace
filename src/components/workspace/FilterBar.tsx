import { Filter, ChevronDown, X } from 'lucide-react'
import type { ActiveFilter } from '@/types'
import type { GlobalFilter } from '@/types'

interface FilterBarProps {
  activeFilters: ActiveFilter[]
  onToggleFilter: (type: string, value: string) => void
  globalFilters: GlobalFilter[]
  onRemoveGlobalFilter: (id: string) => void
  /** When true, render only the filter content without the outer bar wrapper (for use inside TopToolBar). */
  noWrapper?: boolean
}

export function FilterBar({
  activeFilters,
  onToggleFilter,
  globalFilters,
  onRemoveGlobalFilter,
  noWrapper = false,
}: FilterBarProps) {
  const content = (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Visual indicator of the filter context */}
      <Filter size={14} className="text-gray-400 shrink-0" />
      <div className="h-4 w-px bg-gray-300 shrink-0" />

      {/* Global/Inherited Filters: Outlined and Neutral */}
      {globalFilters.map((f) => (
        <div
          key={f.id}
          className="group flex items-center text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
        >
          <span className="text-gray-400 mr-1">{f.type}:</span>
          <span className="font-medium mr-1">{f.value}</span>
          <ChevronDown size={10} className="text-gray-400 mr-1" />

          {/* Interaction to remove dashboard-level constraints */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemoveGlobalFilter(f.id)
            }}
            className="hover:text-red-500 hover:bg-gray-200 rounded p-0.5 transition-all"
            aria-label={`Remove global filter ${f.type}`}
          >
            <X size={10} />
          </button>
        </div>
      ))}

      {/* Local/Active Filters: Blue and Filled */}
      {activeFilters.map((f, i) => (
        <span
          key={`local-${i}`}
          className="text-xs px-2 py-1 rounded bg-blue-50 border border-blue-100 text-blue-700 font-medium flex items-center gap-1 animate-in fade-in zoom-in duration-200"
        >
          {f.type}: {f.value}
          <button
            type="button"
            onClick={() => onToggleFilter(f.type, f.value)}
            className="hover:text-blue-900 ml-1"
          >
            <X size={10} />
          </button>
        </span>
      ))}
    </div>
  )

  if (noWrapper) return content
  return (
    <div className="min-h-[44px] px-6 py-3 border-b border-gray-100 flex items-center gap-3 flex-wrap bg-white flex-shrink-0">
      {content}
    </div>
  )
}
