import { FilterBar } from './FilterBar'
import { SearchBar } from './SearchBar'
import type { ActiveFilter, GlobalFilter } from '@/types'

interface TopToolBarProps {
  activeFilters: ActiveFilter[]
  onToggleFilter: (type: string, value: string) => void
  globalFilters: GlobalFilter[]
  onRemoveGlobalFilter: (id: string) => void
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
}

export function TopToolBar({
  activeFilters,
  onToggleFilter,
  globalFilters,
  onRemoveGlobalFilter,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: TopToolBarProps) {
  return (
    <div className="min-h-[44px] px-6 py-3 border-b border-gray-100 flex items-center gap-3 flex-wrap bg-white flex-shrink-0">
      <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
        <FilterBar
          noWrapper
          activeFilters={activeFilters}
          onToggleFilter={onToggleFilter}
          globalFilters={globalFilters}
          onRemoveGlobalFilter={onRemoveGlobalFilter}
        />
      </div>
      <div className="shrink-0 w-64 sm:w-72">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
    </div>
  )
}
