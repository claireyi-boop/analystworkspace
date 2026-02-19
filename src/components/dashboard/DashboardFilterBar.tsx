import { Filter, ChevronDown, X } from 'lucide-react'
import type { GlobalFilter } from '@/types'

export interface DashboardFilterBarProps {
  filters: GlobalFilter[]
  onRemoveFilter: (id: string) => void
  onEditFilter?: (id: string) => void
}

export function DashboardFilterBar({
  filters,
  onRemoveFilter,
  onEditFilter,
}: DashboardFilterBarProps) {
  return (
    <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
      <Filter size={14} className="text-gray-500 shrink-0" />
      <span className="text-sm text-gray-600 font-medium shrink-0">Filters</span>
      <div className="flex items-center gap-2 ml-2 flex-wrap">
        {filters.map((f) => (
          <span
            key={f.id}
            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 font-medium flex items-center gap-1 inline-flex"
          >
            {f.value}
            {onEditFilter ? (
              <button
                type="button"
                onClick={() => onEditFilter(f.id)}
                className="p-0.5 rounded hover:bg-blue-100 text-blue-600"
                aria-label={`Edit ${f.value}`}
              >
                <ChevronDown size={10} />
              </button>
            ) : (
              <ChevronDown size={10} className="text-blue-500/70" />
            )}
            <button
              type="button"
              onClick={() => onRemoveFilter(f.id)}
              className="p-0.5 rounded hover:bg-blue-100 hover:text-blue-900 transition-colors"
              aria-label={`Remove ${f.value}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
