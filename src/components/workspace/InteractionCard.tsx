import {
  Smartphone,
  Twitter,
  Globe,
  Phone,
  MessageSquare,
  ChevronRight,
  Bookmark,
} from 'lucide-react'
import type { CustomerInteraction, CallTranscript } from '@/types'
import { highlightMatches } from '@/utils/highlight'

function getChannelIcon(channel: string) {
  switch (channel) {
    case 'App':
      return <Smartphone size={14} className="text-blue-500" />
    case 'Social Media':
    case 'Twitter':
      return <Twitter size={14} className="text-sky-500" />
    case 'Google Reviews':
      return <Globe size={14} className="text-green-600" />
    case 'Phone':
      return <Phone size={14} className="text-purple-500" />
    case 'Instagram':
    case 'Reddit':
    case 'Email':
      return <MessageSquare size={14} className="text-gray-500" />
    default:
      return <MessageSquare size={14} className="text-gray-500" />
  }
}

function getPreviewText(item: CustomerInteraction): string {
  if (item.type === 'call') {
    const call = item as CallTranscript
    if (call.rawText) return call.rawText
    if (typeof call.transcript === 'string') return call.transcript
    if (Array.isArray(call.transcript))
      return call.transcript.map((t) => t.text).filter(Boolean).join(' ') || ''
  }
  return 'text' in item ? item.text : ''
}

function getHighlightText(item: CustomerInteraction): string | null {
  if (item.type === 'call') {
    const call = item as CallTranscript
    if (typeof call.transcript === 'string') return call.transcript
    if (Array.isArray(call.transcript))
      return call.transcript.map((t) => t.text).filter(Boolean).join('\n') || null
    return call.rawText ?? null
  }
  return (item as { text?: string }).text ?? null
}

export interface InteractionCardProps {
  item: CustomerInteraction
  isCompact?: boolean
  isInCollection?: boolean
  activeTab: 'stream' | 'collections'
  onSelect: (item: CustomerInteraction) => void
  onAddToCollection: (item: CustomerInteraction, highlightedText?: string | null) => void
  onRemoveFromCollection: (id: number | string) => void
  /** Search query used to highlight matching text (e.g. debounced search). */
  searchHighlight?: string
}

export function InteractionCard({
  item,
  isCompact = false,
  isInCollection = false,
  activeTab,
  onSelect,
  onAddToCollection,
  onRemoveFromCollection,
  searchHighlight = '',
}: InteractionCardProps) {
  const preview = getPreviewText(item)
  const attrs = item.attributes
  const highlight = (s: string) => highlightMatches(s, searchHighlight)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(item)}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group p-4"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {getChannelIcon(item.channel)}
          {!isCompact && (
            <span className="text-xs font-bold text-gray-500 uppercase">
              {highlight(`${item.channel} • ${item.category}`)}
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
                  onAddToCollection(item, getHighlightText(item))
                } else {
                  onRemoveFromCollection(item.id)
                }
              }}
              className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                isInCollection ? 'text-blue-600 fill-blue-600' : 'text-gray-300 hover:text-blue-500'
              }`}
              aria-label={isInCollection ? 'Remove from collection' : 'Add to collection'}
            >
              <Bookmark size={14} fill={isInCollection ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      {!isCompact && (
        <p className="text-gray-800 text-sm font-medium line-clamp-2 mb-3">
          {highlight(preview)}
        </p>
      )}

      {!isCompact && attrs && (attrs.orderItem || attrs.loyaltyTier) && (
        <p className="text-[10px] text-gray-400 mb-2">
          {highlight([attrs.loyaltyTier, attrs.orderItem].filter(Boolean).join(' · '))}
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
  )
}
