import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { X } from 'lucide-react'
import { CHART_DATA_MAPPED } from '@/data/mockInteractions'
import type { ActiveFilter } from '@/types'

interface ChartAreaProps {
  activeFilters: ActiveFilter[]
  onToggleFilter: (type: string, value: string) => void
  onBarClick?: (name: string) => void
}

export function ChartArea({
  activeFilters,
  onToggleFilter,
  onBarClick,
}: ChartAreaProps) {
  return (
    <div className="h-full w-full bg-white p-6 relative flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="font-bold text-gray-700 text-lg">Volume by Category</h3>
        {activeFilters.length > 0 && (
          <div className="flex gap-2">
            {activeFilters.map((f, i) => (
              <div
                key={`${f.type}-${f.value}-${i}`}
                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100"
              >
                {f.value}{' '}
                <button
                  type="button"
                  onClick={() => onToggleFilter(f.type, f.value)}
                  className="hover:opacity-80"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CHART_DATA_MAPPED}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#f8fafc' }} />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              onClick={(d: { name: string }) =>
                onBarClick ? onBarClick(d.name) : onToggleFilter('Category', d.name)
              }
              style={{ cursor: 'pointer' }}
            >
              {CHART_DATA_MAPPED.map((entry, index) => {
                const isSelected = activeFilters.some(
                  (f) => f.type === 'Category' && f.value === entry.name
                )
                const isDimmed =
                  activeFilters.some((f) => f.type === 'Category') && !isSelected
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isSelected ? '#3b82f6' : entry.color}
                    opacity={isDimmed ? 0.2 : 1}
                    cursor="pointer"
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
