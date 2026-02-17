import { useState } from 'react'
import {
  Smartphone,
  Twitter,
  Globe,
  Phone,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Minimize2,
  Maximize2,
} from 'lucide-react'
import { WORD_CLOUD } from '@/data/mockInteractions'
import type { CustomerInteraction } from '@/types'
import type { ActiveFilter } from '@/types'

function getChannelIcon(channel: string) {
  switch (channel) {
    case 'App':
      return <Smartphone size={14} className="text-blue-500" />
    case 'Social Media':
      return <Twitter size={14} className="text-sky-500" />
    case 'Google Reviews':
      return <Globe size={14} className="text-green-600" />
    case 'Phone':
      return <Phone size={14} className="text-purple-500" />
    default:
      return <MessageSquare size={14} className="text-gray-500" />
  }
}

interface StreamAreaProps {
  data: CustomerInteraction[]
  activeFilters: ActiveFilter[]
  onToggleFilter: (type: string, value: string) => void
  onSelect: (item: CustomerInteraction) => void
  onExpand?: () => void
  isExpanded?: boolean
  collectionItems: CustomerInteraction[]
  onAddToCollection: (item: CustomerInteraction, highlightedText?: string | null) => void
  onRemoveFromCollection: (id: number) => void
  isCompact?: boolean
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function StreamArea({
  data,
  activeFilters,
  onToggleFilter,
  onSelect,
  onExpand,
  isExpanded,
  collectionItems,
  onAddToCollection,
  onRemoveFromCollection,
  isCompact = false,
  isCollapsed = false,
  onToggleCollapse,
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

            {activeTab === 'stream' && (
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {WORD_CLOUD.map((w) => (
                  <button
                    key={w.text}
                    type="button"
                    onClick={() => onToggleFilter('Topic', w.text)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      activeFilters.some((f) => f.type === 'Topic' && f.value === w.text)
                        ? 'bg-blue-100 border-blue-300 text-blue-700 font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {w.text}
                  </button>
                ))}
              </div>
            )}
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
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(item)}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {getChannelIcon(item.channel)}
                {!isCompact && (
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    {item.channel} • {item.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{item.date}</span>
                {!isCompact && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (activeTab === 'stream') {
                        onAddToCollection(
                          item,
                          item.type === 'call' ? item.transcript : item.text
                        )
                      } else {
                        onRemoveFromCollection(item.id)
                      }
                    }}
                    className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                      activeTab === 'collections' ||
                      collectionItems.some((i) => i.id === item.id)
                        ? 'text-blue-600 fill-blue-600'
                        : 'text-gray-300 hover:text-blue-500'
                    }`}
                  >
                    <Bookmark
                      size={14}
                      fill={
                        activeTab === 'collections' ||
                        collectionItems.some((i) => i.id === item.id)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  </button>
                )}
              </div>
            </div>

            {!isCompact && (
              <p className="text-gray-800 text-sm font-medium line-clamp-2 mb-3">
                {item.type === 'call' ? item.transcript : item.text}
              </p>
            )}

            <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <div
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.sentiment === 'Negative'
                    ? 'bg-red-100 text-red-700'
                    : item.sentiment === 'Positive'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {item.sentiment}
              </div>
              {item.nps !== undefined && item.nps !== null && !isCompact && (
                <div className="text-xs text-gray-500 font-medium">NPS: {item.nps}</div>
              )}
              {!isCompact && (
                <div className="ml-auto text-blue-600 text-xs font-bold flex items-center gap-1">
                  Read <ChevronRight size={12} />
                </div>
              )}
            </div>
          </div>
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
