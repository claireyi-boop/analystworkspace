import { useState } from 'react'
import {
  ListOrdered,
  Tag,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  getChaptersForInteraction,
  getTopicsForInteraction,
  getMetadataForInteraction,
} from '@/data/mockInteractionContext'
import type { CustomerInteraction } from '@/types'

type ContextView = 'chapters' | 'topics' | 'metadata'

interface InteractionContextToolbarProps {
  item: CustomerInteraction
}

export function InteractionContextToolbar({ item }: InteractionContextToolbarProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeView, setActiveView] = useState<ContextView>('chapters')

  const chapters = getChaptersForInteraction(item.id)
  const topicGroups = getTopicsForInteraction(item.id)
  const metadata = getMetadataForInteraction(item.id, item.sentiment)

  const views: { id: ContextView; icon: typeof ListOrdered; label: string }[] = [
    { id: 'chapters', icon: ListOrdered, label: 'Chapters' },
    { id: 'topics', icon: Tag, label: 'Topics' },
    { id: 'metadata', icon: Database, label: 'Metadata' },
  ]

  return (
    <div className="h-full flex bg-white border-r border-gray-200 flex-shrink-0">
      {/* Icon strip */}
      <div className="w-12 flex flex-col items-center py-3 gap-1 border-r border-gray-100 bg-gray-50/80">
        {views.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              if (activeView === id) {
                setExpanded((e) => !e)
              } else {
                setActiveView(id)
                setExpanded(true)
              }
            }}
            title={label}
            className={`p-2.5 rounded-lg transition-colors ${
              expanded && activeView === id ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <Icon size={18} />
          </button>
        ))}
        <div className="mt-auto pt-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title={expanded ? 'Hide side panel' : 'Show side panel'}
          >
            {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable content panel */}
      {expanded && (
        <div className="w-72 flex flex-col overflow-hidden bg-white animate-in slide-in-from-left-2 duration-200">
          <div className="h-10 flex items-center justify-between px-3 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {activeView === 'chapters' && 'Chapters'}
              {activeView === 'topics' && 'Topics'}
              {activeView === 'metadata' && 'Metadata'}
            </span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="p-1.5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Hide side panel"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
            {activeView === 'chapters' && (
              <div className="space-y-4">
                {chapters.length === 0 ? (
                  <p className="text-sm text-gray-400">No chapters for this interaction.</p>
                ) : (
                  chapters.map((ch, i) => (
                    <div key={i} className="border-l-2 border-blue-200 pl-3 py-1">
                      {ch.timestamp && (
                        <span className="text-[10px] font-mono text-gray-400">{ch.timestamp}</span>
                      )}
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">{ch.title}</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{ch.summary}</p>
                    </div>
                  ))
                )}
              </div>
            )}
            {activeView === 'topics' && (
              <div className="space-y-4">
                {topicGroups.length === 0 ? (
                  <p className="text-sm text-gray-400">No topics for this interaction.</p>
                ) : (
                  topicGroups.map((group, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        {group.model}
                      </p>
                      {group.heading && (
                        <p className="text-xs font-semibold text-gray-700 mb-2">{group.heading}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {group.tags.map((tag, j) => (
                          <span
                            key={j}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs"
                          >
                            {tag.label} {tag.count != null && tag.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {activeView === 'metadata' && (
              <div className="space-y-3 text-sm">
                {Object.keys(metadata).length === 0 ? (
                  <p className="text-sm text-gray-400">No metadata for this interaction.</p>
                ) : (
                  <>
                    {metadata.emotion != null && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Emotion</span>
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium flex items-center gap-1">
                          {String(metadata.emotion)}
                          <span className="text-red-400 cursor-pointer">×</span>
                        </span>
                      </div>
                    )}
                    {metadata.csat != null && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">CSAT</span>
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium flex items-center gap-1">
                          {typeof metadata.csat === 'number' ? `Very low: ${metadata.csat}` : metadata.csat}
                          <span className="text-red-400 cursor-pointer">×</span>
                        </span>
                      </div>
                    )}
                    {metadata.orderId != null && (
                      <div>
                        <span className="text-xs text-gray-500 block">Order ID</span>
                        <span className="text-xs font-mono text-gray-800">{metadata.orderId}</span>
                      </div>
                    )}
                    {metadata.userId != null && (
                      <div>
                        <span className="text-xs text-gray-500 block">User ID</span>
                        <span className="text-xs font-mono text-gray-800">{metadata.userId}</span>
                      </div>
                    )}
                    {metadata.responseId != null && (
                      <div>
                        <span className="text-xs text-gray-500 block">Response ID</span>
                        <span className="text-xs font-mono text-gray-800">{metadata.responseId}</span>
                      </div>
                    )}
                    {metadata.dateCreated != null && (
                      <div>
                        <span className="text-xs text-gray-500 block">Date Created</span>
                        <span className="text-xs text-gray-800">{metadata.dateCreated}</span>
                      </div>
                    )}
                    {metadata.orderDate != null && (
                      <div>
                        <span className="text-xs text-gray-500 block">Order Date</span>
                        <span className="text-xs text-gray-800">{metadata.orderDate}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
