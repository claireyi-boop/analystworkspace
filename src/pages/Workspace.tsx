import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Workbench } from '@/components/workspace/Workbench'
import type { ActiveFilter, GlobalFilter } from '@/types'

const WIDGET_TITLES: Record<string, string> = {
  rating: 'Review rating breakdown',
  sentiment: 'Review sentiment',
  issues: 'Top 5 Issues',
  strengths: 'Top 5 Strengths',
  feedback: 'Customer feedback',
}

function getEntryMode(widgetId: string): 'widget' | 'feedback' | 'segment' {
  if (widgetId === 'feedback') return 'feedback'
  return 'widget'
}

export function Workspace() {
  const { widgetId } = useParams<{ widgetId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { initialFilter?: ActiveFilter; dashboardFilters?: GlobalFilter[] } | null
  const initialFilter = state?.initialFilter
  const dashboardFilters = state?.dashboardFilters ?? []

  const id = widgetId ?? 'issues'
  const title = WIDGET_TITLES[id] ?? 'Workspace'
  const entryMode = getEntryMode(id)
  const focusOnData = id === 'feedback' || initialFilter != null

  const handleBack = () => navigate('/dashboard')

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow min-h-0">
        <Workbench
          widgetTitle={title}
          entryMode={entryMode}
          initialFilter={initialFilter}
          initialGlobalFilters={dashboardFilters}
          focusOnData={focusOnData}
          onBack={handleBack}
        />
      </div>
    </div>
  )
}
