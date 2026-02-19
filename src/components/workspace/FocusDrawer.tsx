import { useState } from 'react'
import {
  X,
  Smartphone,
  Twitter,
  Globe,
  Phone,
  MessageSquare,
  Highlighter,
  Plus,
  MoreVertical,
} from 'lucide-react'
import type { CustomerInteraction, CallTranscript, TranscriptEntry } from '@/types'
import { highlightMatches } from '@/utils/highlight'

function getChannelIcon(channel: string) {
  switch (channel) {
    case 'App':
      return <Smartphone size={16} />
    case 'Social Media':
      return <Twitter size={16} />
    case 'Google Reviews':
      return <Globe size={16} />
    case 'Phone':
      return <Phone size={16} />
    default:
      return <MessageSquare size={16} />
  }
}

function getInteractionTitle(item: CustomerInteraction): string {
  const typeLabel =
    item.type === 'call'
      ? 'Customer Support Call'
      : item.type === 'survey'
        ? 'Post purchase survey'
        : item.type === 'review'
          ? 'Google Review'
          : 'Social post'
  return `${typeLabel} - ${item.id}`
}

function getCallTranscriptText(item: CallTranscript): string {
  if (typeof item.transcript === 'string') return item.transcript
  if (Array.isArray(item.transcript))
    return item.transcript.map((t) => `${t.speaker}: ${t.text}`).join('\n\n')
  return item.rawText ?? ''
}

interface FocusDrawerProps {
  item: CustomerInteraction
  onClose: () => void
  onAddToNotebook: (item: CustomerInteraction, highlightedText?: string | null) => void
  isInline?: boolean
  /** Search query to highlight in transcript/text. */
  searchHighlight?: string
}

export function FocusDrawer({
  item,
  onClose,
  onAddToNotebook,
  isInline = false,
  searchHighlight = '',
}: FocusDrawerProps) {
  const [activeTab, setActiveTab] = useState<'interaction' | 'tickets' | 'history'>('interaction')

  const textContent =
    item.type === 'call' ? getCallTranscriptText(item as CallTranscript) : item.text
  const title = getInteractionTitle(item)

  const tabs = [
    { id: 'interaction' as const, label: 'Interaction' },
    { id: 'tickets' as const, label: 'Tickets' },
    { id: 'history' as const, label: 'Interaction history' },
  ]

  return (
    <div
      className={`${
        isInline
          ? 'flex-grow h-full border-l border-gray-200 min-w-0 flex flex-col'
          : 'absolute top-0 right-0 h-full w-[600px] shadow-2xl border-l border-gray-200 z-50'
      } bg-white flex flex-col animate-in slide-in-from-right duration-300`}
    >
      {/* Tabs + title row */}
      <div className="flex-shrink-0 border-b border-gray-100 bg-white">
        <div className="flex px-6 pt-4 gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-6 pb-4">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded ${
                item.type === 'call' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
              }`}
            >
              {getChannelIcon(item.channel)}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{title}</h2>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="More options"
            >
              <MoreVertical size={18} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto flex flex-col">
        {activeTab === 'interaction' && (
          <>
            <div className="flex-grow overflow-y-auto px-6 py-4">
              <div className="flex gap-3 mb-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.sentiment === 'Negative'
                      ? 'bg-red-100 text-red-700'
                      : item.sentiment === 'Positive'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Sentiment: {item.sentiment}
                </span>
                {(item.nps != null && item.nps !== undefined) && (
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    NPS: {item.nps}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                  {item.channel}
                </span>
              </div>

              {item.type === 'call' ? (
                <div className="space-y-4">
                  {(() => {
                    const call = item as CallTranscript
                    const entries: TranscriptEntry[] =
                      typeof call.transcript === 'string'
                        ? []
                        : Array.isArray(call.transcript)
                          ? call.transcript
                          : []
                    if (entries.length === 0) {
                      return (
                        <div className="bg-gray-50 rounded-lg px-4 py-4 text-sm text-gray-800 leading-relaxed border-l-2 border-gray-200 whitespace-pre-wrap">
                          {highlightMatches(getCallTranscriptText(call), searchHighlight)}
                        </div>
                      )
                    }
                    return entries.map((entry, i) => {
                      const isCustomer = entry.type === 'customer'
                      return (
                        <div key={`${entry.time}-${i}`} className="flex gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex-shrink-0 ${
                              isCustomer ? 'bg-blue-200' : 'bg-gray-200'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-0.5">
                              {entry.time} · {entry.speaker}
                            </p>
                            <div
                              className={`rounded-lg px-4 py-3 text-sm text-gray-800 ${
                                isCustomer
                                  ? 'bg-blue-50 border-l-2 border-blue-300'
                                  : 'bg-gray-50'
                              }`}
                            >
                              {highlightMatches(entry.text, searchHighlight)}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg px-4 py-4 text-sm text-gray-800 leading-relaxed border-l-2 border-gray-200">
                  &quot;{highlightMatches(textContent, searchHighlight)}&quot;
                </div>
              )}

              {item.type === 'call' && (
                <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <Highlighter size={16} />
                    <span>Save this call transcript to your notebook.</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onAddToNotebook(item, getCallTranscriptText(item as CallTranscript))
                    }
                    className="inline-flex items-center gap-1.5 bg-slate-800 text-white text-xs px-3 py-1.5 rounded shadow hover:bg-slate-700"
                  >
                    <Plus size={12} /> Add to Notebook
                  </button>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Analyst Notes
              </label>
              <textarea
                className="w-full h-20 p-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="Add observations here..."
              />
            </div>
          </>
        )}
        {activeTab === 'tickets' && (
          <div className="flex-grow flex items-center justify-center text-gray-400 text-sm p-8">
            No tickets linked to this interaction.
          </div>
        )}
        {activeTab === 'history' && (
          <div className="flex-grow flex items-center justify-center text-gray-400 text-sm p-8">
            No prior interaction history.
          </div>
        )}
      </div>
    </div>
  )
}
