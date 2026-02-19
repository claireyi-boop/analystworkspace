import { useState } from 'react'
import { ChevronLeft, ChevronRight, Minimize2, Maximize2 } from 'lucide-react'
import type { CustomerInteraction } from '@/types'
import type { ActiveFilter } from '@/types'
import { InteractionCard } from './InteractionCard'

interface StreamAreaProps {
  data: CustomerInteraction[]
  activeFilters: ActiveFilter[]
  onToggleFilter: (type: string, value: string) => void
  onSelect: (item: CustomerInteraction) => void
  onExpand?: () => void
  isExpanded?: boolean
  collectionItems: CustomerInteraction[]
  onAddToCollection: (item: CustomerInteraction, highlightedText?: string | null) => void
  onRemoveFromCollection: (id: number | string) => void
  isCompact?: boolean
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  /** Search query to highlight in card text (e.g. debounced search). */
  searchHighlight?: string
}

export function StreamArea({
  data,
  activeFilters: _activeFilters,
  onToggleFilter: _onToggleFilter,
  onSelect,
  onExpand,
  isExpanded,
  collectionItems,
  onAddToCollection,
  onRemoveFromCollection,
  isCompact = false,
  isCollapsed = false,
  onToggleCollapse,
  searchHighlight = '',
}: StreamAreaProps) {
  const [activeTab, setActiveTab] = useState<'stream' | 'collections'>('stream')

  const displayData = activeTab === 'stream' ? data : collectionItems

  if (isCompact && isCollapsed) {
    return (
      <div className="h-full bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded text-gray-500"
          title="Expand List"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-gray-50 h-full overflow-hidden transition-all duration-300">
      <div
        className={`px-4 border-b border-gray-200 bg-white flex items-center shadow-sm flex-shrink-0 ${
          isCompact ? 'py-2 justify-between' : 'py-3 justify-between'
        }`}
      >
        {!isCompact ? (
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('stream')}
                className={`py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
                  activeTab === 'stream'
                    ? 'border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All Interactions{' '}
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                  {data.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('collections')}
                className={`py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
                  activeTab === 'collections'
                    ? 'border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Collections{' '}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === 'collections'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {collectionItems.length}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Results
            </span>
            <span className="text-lg font-bold text-gray-800">{data.length}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isCompact && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="Collapse List"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {!isCompact && onExpand && (
            <button
              type="button"
              onClick={onExpand}
              className="text-gray-400 hover:text-blue-600 transition-colors ml-4"
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
        </div>
      </div>

      <div className={`flex-grow overflow-y-auto ${isCompact ? 'p-2 space-y-2' : 'p-6 space-y-3'}`}>
        {displayData.map((item) => (
          <InteractionCard
            key={String(item.id)}
            item={item}
            isCompact={isCompact}
            isInCollection={collectionItems.some((i) => i.id === item.id)}
            activeTab={activeTab}
            onSelect={onSelect}
            onAddToCollection={onAddToCollection}
            onRemoveFromCollection={onRemoveFromCollection}
            searchHighlight={searchHighlight}
          />
        ))}
        {displayData.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            {activeTab === 'stream'
              ? 'No records match current filters'
              : 'Your collection is empty. Bookmark items from the stream to add them here.'}
          </div>
        )}
      </div>
    </div>
  )
}
