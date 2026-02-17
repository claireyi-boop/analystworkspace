import { Search, Calendar, ChevronDown } from 'lucide-react'
import { WORD_CLOUD } from '@/data/mockInteractions'
import type { CustomerInteraction } from '@/types'
import type { ActiveFilter } from '@/types'

interface FacetRibbonProps {
  data: CustomerInteraction[]
  activeFilters: ActiveFilter[]
  onToggleFilter: (type: string, value: string) => void
}

export function FacetRibbon({ data, activeFilters, onToggleFilter }: FacetRibbonProps) {
  const sentiments = { Negative: 0, Neutral: 0, Positive: 0 }
  let total = 0
  data.forEach((d) => {
    if (sentiments[d.sentiment as keyof typeof sentiments] !== undefined) {
      sentiments[d.sentiment as keyof typeof sentiments]++
      total++
    }
  })

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-6 shadow-sm z-20 h-20 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 border border-transparent hover:border-gray-300 transition-all"
        >
          <Calendar size={14} /> Last 7 Days <ChevronDown size={12} />
        </button>
        <span className="text-sm text-gray-500 font-medium">{total} items</span>
      </div>

      <div className="flex-grow max-w-md flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span>Negative</span>
          <span>Positive</span>
        </div>
        <div className="h-4 flex rounded-full overflow-hidden cursor-pointer shadow-inner">
          <div
            style={{ width: `${total ? (sentiments.Negative / total) * 100 : 0}%` }}
            className={`bg-red-400 transition-colors ${
              activeFilters.some((f) => f.value === 'Negative') ? 'bg-red-600' : 'hover:bg-red-500'
            }`}
            onClick={() => onToggleFilter('Sentiment', 'Negative')}
            title="Filter Negative"
            role="button"
            tabIndex={0}
          />
          <div
            style={{ width: `${total ? (sentiments.Neutral / total) * 100 : 0}%` }}
            className={`bg-gray-200 transition-colors ${
              activeFilters.some((f) => f.value === 'Neutral') ? 'bg-gray-400' : 'hover:bg-gray-300'
            }`}
            onClick={() => onToggleFilter('Sentiment', 'Neutral')}
            title="Filter Neutral"
            role="button"
            tabIndex={0}
          />
          <div
            style={{ width: `${total ? (sentiments.Positive / total) * 100 : 0}%` }}
            className={`bg-green-400 transition-colors ${
              activeFilters.some((f) => f.value === 'Positive') ? 'bg-green-600' : 'hover:bg-green-500'
            }`}
            onClick={() => onToggleFilter('Sentiment', 'Positive')}
            title="Filter Positive"
            role="button"
            tabIndex={0}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {WORD_CLOUD.slice(0, 3).map((w) => (
          <button
            key={w.text}
            type="button"
            onClick={() => onToggleFilter('Topic', w.text)}
            className={`text-xs px-2 py-1.5 rounded-full border transition-all ${
              activeFilters.some((f) => f.value === w.text)
                ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {w.text}
          </button>
        ))}
        <div className="relative group">
          <Search
            size={12}
            className="absolute left-2.5 top-2 text-gray-400 group-hover:text-blue-500"
          />
          <input
            type="text"
            placeholder="+ Find topic..."
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-full w-32 focus:w-48 transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement
                onToggleFilter('Topic', target.value)
                target.value = ''
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
