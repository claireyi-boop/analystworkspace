import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, Database, Settings, Layout, Columns } from 'lucide-react'
import { SmartShelf } from './SmartShelf'
import { ChartArea } from './ChartArea'
import { FacetRibbon } from './FacetRibbon'
import { StreamArea } from './StreamArea'
import { InteractionContextToolbar } from './InteractionContextToolbar'
import { FocusDrawer } from './FocusDrawer'
import { ALL_DATA } from '@/data/mockInteractions'
import type { CustomerInteraction, CallTranscript } from '@/types'
import type { ActiveFilter, GlobalFilter } from '@/types'

function getSearchableTranscript(d: CustomerInteraction): string {
  if (d.type !== 'call') return ''
  const call = d as CallTranscript
  if (typeof call.transcript === 'string') return call.transcript
  if (Array.isArray(call.transcript))
    return call.transcript.map((t) => t.text).filter(Boolean).join(' ')
  return call.rawText ?? ''
}

function getSearchableText(d: CustomerInteraction): string {
  const text = d.type === 'call' ? getSearchableTranscript(d) : (d as { text?: string }).text ?? ''
  const meta = [d.category, d.topic, d.channel, d.sentiment].filter(Boolean).join(' ')
  return `${text} ${meta}`.toLowerCase()
}
import { TopToolBar } from './TopToolBar'

const DEFAULT_DASHBOARD_FILTERS: GlobalFilter[] = [
  { id: 'survey-meta', type: 'Dataset', value: 'Survey metadata' },
  { id: 'call-meta', type: 'Dataset', value: 'Call metadata' },
  { id: 'social-ch', type: 'Dataset', value: 'Social channels' },
]

interface WorkbenchProps {
  entryMode: 'widget' | 'feedback' | 'segment'
  initialFilter?: ActiveFilter | null
  initialGlobalFilters?: GlobalFilter[]
  focusOnData?: boolean
  onBack: () => void
}

export function Workbench({
  entryMode,
  initialFilter,
  initialGlobalFilters = [],
  focusOnData = false,
  onBack,
}: WorkbenchProps) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [globalFilters, setGlobalFilters] = useState<GlobalFilter[]>(() => {
    const fromDashboard =
      initialGlobalFilters.length > 0 ? initialGlobalFilters : DEFAULT_DASHBOARD_FILTERS
    const fromDrill = initialFilter
      ? [{ id: 'initial', type: initialFilter.type, value: initialFilter.value }]
      : []
    return [...fromDashboard, ...fromDrill]
  })
  const [selectedItem, setSelectedItem] = useState<CustomerInteraction | null>(null)
  const [notebookItems, setNotebookItems] = useState<CustomerInteraction[]>([])

  const [layoutMode, setLayoutMode] = useState<'tabs' | 'split'>('split')
  const [activeTab, setActiveTab] = useState<'viz' | 'data'>(focusOnData ? 'data' : 'viz')
  const [isSplitExpanded, setIsSplitExpanded] = useState(focusOnData)
  const [streamCollapsed, setStreamCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchQuery(searchQuery), 1500)
    return () => clearTimeout(t)
  }, [searchQuery])

  const isFeedbackMode = entryMode === 'feedback'
  const isReading = selectedItem !== null
  const isCompactStream = isReading
  const shelfMode = isReading ? 'hidden' : 'full'

  const getStreamContainerClass = () => {
    if (isCompactStream) {
      return streamCollapsed
        ? 'w-12 border-r border-gray-200'
        : 'w-80 border-r border-gray-200'
    }
    return 'w-full'
  }

  const hasCategoryFilter = activeFilters.some((f) => f.type === 'Category') ||
    globalFilters.some((f) => f.type === 'Category')
  const showFacetRibbon = useMemo(() => {
    if (layoutMode === 'tabs' && activeTab === 'data') return true
    if (layoutMode === 'split' && (isFeedbackMode || hasCategoryFilter)) return true
    return false
  }, [layoutMode, activeTab, isFeedbackMode, hasCategoryFilter])

  const applyFilters = (data: CustomerInteraction[], filters: { type: string; value: string }[]) => {
    let result = [...data]
    filters.forEach((filter) => {
      if (filter.type === 'Category') {
        result = result.filter(
          (d) => d.category.toLowerCase() === filter.value.toLowerCase()
        )
      }
      if (filter.type === 'Topic') {
        if (filter.value === 'Drive-Thru')
          result = result.filter((d) => d.topic === 'Drive-Thru')
        else if (filter.value === 'Coupon')
          result = result.filter((d) => d.topic === 'Coupons')
        else if (filter.value === 'Wait')
          result = result.filter(
            (d) =>
              (d as { text?: string }).text?.toLowerCase().includes('wait') ||
              getSearchableTranscript(d).toLowerCase().includes('wait')
          )
        else
          result = result.filter((d) =>
            JSON.stringify(d).toLowerCase().includes(filter.value.toLowerCase())
          )
      }
      if (filter.type === 'Sentiment') result = result.filter((d) => d.sentiment === filter.value)
      if (filter.type === 'Channel') result = result.filter((d) => d.channel === filter.value)
      if (filter.type === 'NPS Group') {
        if (filter.value === 'Detractor')
          result = result.filter((d) => d.nps != null && d.nps <= 6)
        if (filter.value === 'Passive')
          result = result.filter((d) => d.nps != null && d.nps >= 7 && d.nps <= 8)
        if (filter.value === 'Promoter')
          result = result.filter((d) => d.nps != null && d.nps >= 9)
      }
      if (filter.type === 'Coupon' && filter.value === 'Yes') {
        result = result.filter(
          (d) =>
            d.topic === 'Coupons' ||
            (d as { text?: string }).text?.toLowerCase().includes('coupon') ||
            getSearchableTranscript(d).toLowerCase().includes('coupon')
        )
      }
    })
    return result
  }

  const filteredData = useMemo(() => {
    const afterGlobal = applyFilters(ALL_DATA, globalFilters)
    const afterActive = applyFilters(afterGlobal, activeFilters)
    const q = debouncedSearchQuery.trim().toLowerCase()
    if (!q) return afterActive
    return afterActive.filter((d) => getSearchableText(d).includes(q))
  }, [activeFilters, globalFilters, debouncedSearchQuery])

  const removeGlobalFilter = (id: string) => {
    setGlobalFilters(globalFilters.filter((f) => f.id !== id))
  }

  const toggleFilter = (type: string, value: string) => {
    const exists = activeFilters.find((f) => f.type === type && f.value === value)
    if (exists) {
      setActiveFilters(activeFilters.filter((f) => f !== exists))
    } else {
      if (type === 'Topic') setActiveFilters([...activeFilters, { type, value }])
      else {
        const others = activeFilters.filter((f) => f.type !== type)
        setActiveFilters([...others, { type, value }])
      }
    }
  }

  const handleBarClick = (category: string) => {
    toggleFilter('Category', category)
    if (layoutMode === 'tabs') setActiveTab('data')
  }

  const addToNotebook = (item: CustomerInteraction, _highlightedText?: string | null) => {
    if (!notebookItems.some((i) => i.id === item.id)) {
      setNotebookItems([...notebookItems, item])
    }
  }

  const removeFromNotebook = (id: number | string) => {
    setNotebookItems(notebookItems.filter((i) => i.id !== id))
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
      <div className="h-14 bg-white border-b border-gray-200 flex justify-between items-center px-4 shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <Database size={16} className="text-blue-500" />
            Analysis: {isFeedbackMode ? 'Customer Feedback' : 'Top Issues'}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <span className="uppercase tracking-wider">Layout:</span>
            <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
              <button
                type="button"
                onClick={() => setLayoutMode('tabs')}
                className={`px-2 py-1 rounded flex items-center gap-1 ${
                  layoutMode === 'tabs' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-gray-700'
                }`}
              >
                <Layout size={12} /> Tabs
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('split')}
                className={`px-2 py-1 rounded flex items-center gap-1 ${
                  layoutMode === 'split' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-gray-700'
                }`}
              >
                <Columns size={12} /> Split
              </button>
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="p-2 text-gray-400 hover:text-gray-600">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <TopToolBar
        activeFilters={activeFilters}
        onToggleFilter={toggleFilter}
        globalFilters={globalFilters}
        onRemoveGlobalFilter={removeGlobalFilter}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search interactions..."
      />

      <div className="flex-grow flex overflow-hidden">
        <SmartShelf
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
          mode={shelfMode}
        />

        <div className="flex-grow flex flex-col min-w-0 bg-gray-50 h-full relative transition-all duration-300">
          {layoutMode === 'tabs' && (
            <>
              <div className="bg-white border-b border-gray-200 flex px-6 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('viz')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 ${
                    activeTab === 'viz'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Visualize
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('data')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 ${
                    activeTab === 'data'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Interactions
                </button>
              </div>
              <div className="flex-grow flex overflow-hidden relative">
                {activeTab === 'viz' && (
                  <ChartArea
                    data={filteredData}
                    activeFilters={activeFilters}
                    onToggleFilter={toggleFilter}
                    onBarClick={handleBarClick}
                  />
                )}
                {activeTab === 'data' && (
                  <div className="flex-grow flex flex-col h-full overflow-hidden w-full">
                    {!isReading && showFacetRibbon && (
                      <FacetRibbon
                        data={filteredData}
                        activeFilters={activeFilters}
                        onToggleFilter={toggleFilter}
                      />
                    )}
                    <div className="flex-grow flex overflow-hidden">
                      <div
                        className={`${getStreamContainerClass()} flex-shrink-0 transition-all duration-300 bg-gray-50 flex flex-col`}
                      >
                        <StreamArea
                          data={filteredData}
                          activeFilters={activeFilters}
                          onToggleFilter={toggleFilter}
                          onSelect={setSelectedItem}
                          collectionItems={notebookItems}
                          onAddToCollection={addToNotebook}
                          onRemoveFromCollection={removeFromNotebook}
                          isCompact={isCompactStream}
                          isCollapsed={streamCollapsed}
                          onToggleCollapse={() => setStreamCollapsed(!streamCollapsed)}
                          searchHighlight={debouncedSearchQuery}
                        />
                      </div>
                      {isReading && selectedItem && (
                        <>
                          <InteractionContextToolbar item={selectedItem} />
                          <div className="flex-grow min-w-0 bg-white animate-in fade-in slide-in-from-right-4 duration-300">
                            <FocusDrawer
                              item={selectedItem}
                              onClose={() => setSelectedItem(null)}
                              onAddToNotebook={addToNotebook}
                              isInline
                              searchHighlight={debouncedSearchQuery}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {layoutMode === 'split' && (
            <div className="h-full flex flex-col">
              {!isSplitExpanded && !isReading && (
                <div className="h-1/2 border-b border-gray-200">
                  <ChartArea
                    data={filteredData}
                    activeFilters={activeFilters}
                    onToggleFilter={toggleFilter}
                    onBarClick={handleBarClick}
                  />
                </div>
              )}
              <div className={isSplitExpanded || isReading ? 'h-full' : 'h-1/2'}>
                <div className="flex h-full overflow-hidden">
                  <div
                    className={`${getStreamContainerClass()} flex-shrink-0 transition-all duration-300 bg-gray-50 flex flex-col`}
                  >
                    <StreamArea
                      data={filteredData}
                      activeFilters={activeFilters}
                      onToggleFilter={toggleFilter}
                      onSelect={setSelectedItem}
                      onExpand={() => setIsSplitExpanded(!isSplitExpanded)}
                      isExpanded={isSplitExpanded}
                      collectionItems={notebookItems}
                      onAddToCollection={addToNotebook}
                      onRemoveFromCollection={removeFromNotebook}
                      isCompact={isCompactStream}
                      isCollapsed={streamCollapsed}
                      onToggleCollapse={() => setStreamCollapsed(!streamCollapsed)}
                      searchHighlight={debouncedSearchQuery}
                    />
                  </div>
                  {isReading && selectedItem && (
                    <>
                      <InteractionContextToolbar item={selectedItem} />
                      <div className="flex-grow min-w-0 bg-white animate-in fade-in slide-in-from-right-4 duration-300">
                        <FocusDrawer
                          item={selectedItem}
                          onClose={() => setSelectedItem(null)}
                          onAddToNotebook={addToNotebook}
                          isInline
                          searchHighlight={debouncedSearchQuery}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
