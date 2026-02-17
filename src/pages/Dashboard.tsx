import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Filter,
  Search,
  Sliders,
  Edit3,
  Settings,
  Play,
  Download,
  Share2,
  Star,
  ListFilter,
  ChevronDown,
} from 'lucide-react'
import { WidgetCard } from '@/components/dashboard/WidgetCard'
import {
  ISSUES_DATA,
  STRENGTHS_DATA,
  FEEDBACK_DATA,
  SENTIMENT_DATA,
} from '@/data/mockInteractions'
import type { IssuesRow } from '@/types'

// Rating breakdown widget content
function RatingBreakdownContent() {
  return (
    <div className="flex items-start gap-8">
      <div className="flex flex-col">
        <span className="text-5xl font-light text-gray-800">3.93</span>
        <div className="flex text-blue-600 my-2">
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
          <Star size={16} />
        </div>
        <span className="text-xs text-gray-500">353 Responses</span>
      </div>
      <div className="flex-grow space-y-2 mt-1">
        {[
          { l: '5 stars', w: '40%', c: 'bg-blue-600' },
          { l: '4 stars', w: '30%', c: 'bg-blue-600' },
          { l: '3 stars', w: '20%', c: 'bg-blue-600' },
          { l: '2 stars', w: '5%', c: 'bg-blue-600' },
          { l: '1 stars', w: '5%', c: 'bg-blue-600' },
          { l: '0 stars', w: '0%', c: 'bg-blue-600' },
        ].map((r) => (
          <div key={r.l} className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-12">{r.l}</span>
            <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${r.c}`} style={{ width: r.w }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Review sentiment pie widget content
function ReviewSentimentContent() {
  return (
    <div className="flex-grow relative min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={SENTIMENT_DATA}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {SENTIMENT_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-10 right-0 text-[10px] font-bold text-gray-600">
        Extremely satisfied 33%
      </div>
      <div className="absolute bottom-10 right-10 text-[10px] font-bold text-gray-600">
        Very satisfied 25%
      </div>
      <div className="absolute bottom-10 left-10 text-[10px] font-bold text-gray-600">
        Satisfied 21%
      </div>
      <div className="absolute top-10 left-10 text-[10px] text-gray-500">Neutral 12%</div>
      <div className="absolute top-2 left-1/2 text-[10px] text-gray-500">Dissatisfied 5%</div>
    </div>
  )
}

// Issues table widget content
function IssuesTableContent({
  data,
  colors,
  onDrill,
}: {
  data: IssuesRow[]
  colors: { pos: string; neu: string; neg: string }
  onDrill?: (name: string) => void
}) {
  return (
    <div className="w-full">
      <div className="flex text-xs font-bold text-gray-400 mb-2 border-b border-gray-100 pb-2">
        <div className="w-1/3">Topics</div>
        <div className="w-20 text-right">Count</div>
        <div className="flex-grow pl-8 flex items-center gap-1">
          Sentiment <ListFilter size={10} />
        </div>
      </div>
      <div className="space-y-3">
        {data.map((row, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            className="flex items-center text-sm group/row cursor-pointer"
            onClick={() => onDrill?.(row.name)}
            onKeyDown={(e) => e.key === 'Enter' && onDrill?.(row.name)}
          >
            <div className="w-1/3 font-bold text-gray-700 group-hover/row:text-blue-600 transition-colors">
              {row.name}
            </div>
            <div className="w-20 text-right font-bold text-gray-800 pr-4">{row.count}</div>
            <div className="flex-grow h-4 flex gap-0.5 opacity-90 group-hover/row:opacity-100">
              <div
                style={{ width: `${row.positive ?? 0}%` }}
                className={colors.pos}
              />
              <div
                style={{ width: `${row.neutral ?? 0}%` }}
                className={colors.neu}
              />
              <div
                style={{ width: `${row.negative ?? 0}%` }}
                className={colors.neg}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Customer feedback feed content
function CustomerFeedbackContent() {
  return (
    <div className="flex-grow space-y-6 overflow-y-auto pr-2">
      {FEEDBACK_DATA.map((fb) => (
        <div key={fb.id} className="flex gap-4">
          <div
            className={`w-8 h-8 rounded-full ${fb.color} text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1`}
          >
            {fb.score}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-gray-800">{fb.name}</span>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {fb.source} • {fb.time}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">{fb.text}</p>
            {fb.text.length > 50 && (
              <span className="text-[10px] text-blue-500 cursor-pointer">... more</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()

  const handleDrillToWorkspace = (widgetId: string, filter?: { type: string; value: string }) => {
    navigate(`/workspace/${widgetId}`, { state: filter ? { initialFilter: filter } : undefined })
  }

  return (
    <div className="bg-gray-50 h-full flex flex-col overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-normal text-gray-800 mr-4">
            Nom nom express CX <ChevronDown size={14} className="inline ml-1 text-gray-400" />
          </h1>
          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            <Filter size={14} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600 font-medium">Filters</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 font-medium flex items-center gap-1">
                Survey metadata <ChevronDown size={10} />
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 font-medium flex items-center gap-1">
                Call metadata <ChevronDown size={10} />
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 font-medium flex items-center gap-1">
                Social channels <ChevronDown size={10} />
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <span className="text-xs font-medium text-blue-600 flex items-center gap-1 cursor-pointer mr-2">
            <Sliders size={12} /> Hide Filters (3)
          </span>
          <Edit3 size={18} className="cursor-pointer hover:text-gray-600" />
          <Settings size={18} className="cursor-pointer hover:text-gray-600" />
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <Search size={18} className="cursor-pointer hover:text-gray-600" />
          <Play size={18} className="cursor-pointer hover:text-gray-600" />
          <Download size={18} className="cursor-pointer hover:text-gray-600" />
          <Share2 size={18} className="cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      <div className="flex-grow p-6 overflow-y-auto">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-6 h-80 mb-6">
          <WidgetCard widgetId="rating" title="Review rating breakdown">
            <RatingBreakdownContent />
          </WidgetCard>
          <WidgetCard widgetId="sentiment" title="Review sentiment">
            <ReviewSentimentContent />
          </WidgetCard>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-6 h-[600px]">
          <div className="flex flex-col gap-6">
            <WidgetCard
              widgetId="issues"
              title="Top 5 Issues"
              drillLabel="Category"
            >
              <IssuesTableContent
                data={ISSUES_DATA}
                colors={{ pos: 'bg-gray-200', neu: 'bg-red-300', neg: 'bg-red-800' }}
                onDrill={(name) => handleDrillToWorkspace('issues', { type: 'Category', value: name })}
              />
            </WidgetCard>
            <WidgetCard widgetId="strengths" title="Top 5 Strengths">
              <IssuesTableContent
                data={STRENGTHS_DATA}
                colors={{ pos: 'bg-green-700', neu: 'bg-green-400', neg: 'bg-gray-200' }}
              />
            </WidgetCard>
          </div>
          <div className="h-full">
            <WidgetCard widgetId="feedback" title="Customer feedback">
              <CustomerFeedbackContent />
            </WidgetCard>
          </div>
        </div>
      </div>
    </div>
  )
}
