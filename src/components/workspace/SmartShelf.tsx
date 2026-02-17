import { Search, Star, Tag, Smartphone, Twitter, Globe, Phone, Users, ShoppingBag, Check } from 'lucide-react'
import { FilterAccordion } from './FilterAccordion'
import type { ActiveFilter } from '@/types'

interface SmartShelfProps {
  activeFilters: ActiveFilter[]
  onToggleFilter: (type: string, value: string) => void
  mode?: 'full' | 'rail' | 'hidden'
}

export function SmartShelf({
  activeFilters,
  onToggleFilter,
  mode = 'full',
}: SmartShelfProps) {
  const isActive = (type: string, value: string) =>
    activeFilters.some((f) => f.type === type && f.value === value)

  if (mode === 'hidden') return null

  const isCollapsed = mode === 'rail'

  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16 items-center' : 'w-64'
      }`}
    >
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Filter..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>
      )}

      <div className="flex-grow overflow-y-auto w-full scrollbar-hide">
        <FilterAccordion title="Experience" icon={Star} defaultOpen collapsed={isCollapsed}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Sentiment</label>
              <div className="flex rounded-md overflow-hidden h-6 cursor-pointer border border-gray-200 shadow-sm">
                {['Negative', 'Neutral', 'Positive'].map((s) => (
                  <div
                    key={s}
                    role="button"
                    tabIndex={0}
                    onClick={() => onToggleFilter('Sentiment', s)}
                    className={`flex-1 flex items-center justify-center border-r border-gray-200 last:border-0 transition-colors text-[10px] font-bold ${
                      isActive('Sentiment', s)
                        ? s === 'Negative'
                          ? 'bg-red-500 text-white'
                          : s === 'Neutral'
                            ? 'bg-gray-500 text-white'
                            : 'bg-green-500 text-white'
                        : s === 'Negative'
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : s === 'Neutral'
                            ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {s.substring(0, 3)}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">NPS Group</label>
              <div className="space-y-1">
                {[
                  { label: 'Detractor (0-6)', val: 'Detractor', color: 'bg-red-500' },
                  { label: 'Passive (7-8)', val: 'Passive', color: 'bg-yellow-500' },
                  { label: 'Promoter (9-10)', val: 'Promoter', color: 'bg-green-500' },
                ].map((opt) => (
                  <div
                    key={opt.val}
                    role="button"
                    tabIndex={0}
                    onClick={() => onToggleFilter('NPS Group', opt.val)}
                    className="flex items-center gap-2 cursor-pointer group p-1 rounded hover:bg-gray-50"
                  >
                    <div
                      className={`w-3 h-3 rounded-full border border-gray-200 flex-shrink-0 ${
                        isActive('NPS Group', opt.val) ? opt.color : 'bg-white'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isActive('NPS Group', opt.val)
                          ? 'font-bold text-gray-800'
                          : 'text-gray-600 group-hover:text-gray-900'
                      }`}
                    >
                      {opt.label}
                    </span>
                    {isActive('NPS Group', opt.val) && (
                      <Check size={12} className="ml-auto text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FilterAccordion>

        <FilterAccordion title="Topics" icon={Tag} defaultOpen collapsed={isCollapsed}>
          <div className="space-y-1">
            {[
              { name: 'Drive-Thru', count: 2 },
              { name: 'Coupons', count: 3 },
              { name: 'New Items', count: 3 },
              { name: 'Speed', count: 1 },
              { name: 'Login', count: 1 },
            ].map((topic) => (
              <div
                key={topic.name}
                role="button"
                tabIndex={0}
                onClick={() => onToggleFilter('Topic', topic.name)}
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isActive('Topic', topic.name)
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className="text-sm font-medium">{topic.name}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive('Topic', topic.name)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-400 bg-gray-100'
                  }`}
                >
                  {topic.count}
                </span>
              </div>
            ))}
          </div>
        </FilterAccordion>

        <FilterAccordion title="Channel" icon={Smartphone} defaultOpen={false} collapsed={isCollapsed}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'App', icon: Smartphone },
              { name: 'Social Media', icon: Twitter },
              { name: 'Google Reviews', icon: Globe },
              { name: 'Phone', icon: Phone },
            ].map((ch) => (
              <div
                key={ch.name}
                role="button"
                tabIndex={0}
                onClick={() => onToggleFilter('Channel', ch.name)}
                className={`flex flex-col items-center justify-center p-2 rounded border cursor-pointer transition-all ${
                  isActive('Channel', ch.name)
                    ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <ch.icon size={16} className="mb-1" />
                <span className="text-[10px] font-medium text-center leading-tight">
                  {ch.name}
                </span>
              </div>
            ))}
          </div>
        </FilterAccordion>

        <FilterAccordion
          title="Transaction"
          icon={ShoppingBag}
          defaultOpen={false}
          collapsed={isCollapsed}
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">Coupon Used</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFilter('Coupon', 'Yes')}
                  className={`flex-1 py-1.5 text-xs border rounded transition-colors ${
                    isActive('Coupon', 'Yes')
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFilter('Coupon', 'No')}
                  className={`flex-1 py-1.5 text-xs border rounded transition-colors ${
                    isActive('Coupon', 'No')
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </FilterAccordion>

        <FilterAccordion title="Customer" icon={Users} defaultOpen={false} collapsed={isCollapsed}>
          <div className="space-y-1">
            {['Gold Member', 'Silver Member', 'New Customer'].map((tier) => (
              <div
                key={tier}
                role="button"
                tabIndex={0}
                onClick={() => onToggleFilter('Loyalty', tier)}
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer ${
                  isActive('Loyalty', tier)
                    ? 'bg-purple-50 text-purple-700'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className="text-sm font-medium">{tier}</span>
                {isActive('Loyalty', tier) && (
                  <Check size={12} className="text-purple-600" />
                )}
              </div>
            ))}
          </div>
        </FilterAccordion>
      </div>
    </div>
  )
}
