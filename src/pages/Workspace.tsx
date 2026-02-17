import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { WidgetEditor } from '@/components/workspace/WidgetEditor'
import { Workbench } from '@/components/workspace/Workbench'
import type { ActiveFilter } from '@/types'

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
  const initialFilter = (location.state as { initialFilter?: ActiveFilter } | null)?.initialFilter

  const id = widgetId ?? 'issues'
  const title = WIDGET_TITLES[id] ?? 'Workspace'
  const entryMode = getEntryMode(id)
  const focusOnData = id === 'feedback' || initialFilter != null

  const handleBack = () => navigate('/dashboard')

  const handleSaveWidget = (_updates: { title: string; chartType?: string }) => {
    // Could persist to state/API; for prototype we only support local state in editor
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <WidgetEditor
          widgetId={id}
          title={title}
          onSave={handleSaveWidget}
        />
        <span className="text-xs text-gray-500">
          Edit widget above · Raw data in the list below (survey, call, social, reviews)
        </span>
      </div>
      <div className="flex-grow min-h-0">
        <Workbench
          entryMode={entryMode}
          initialFilter={initialFilter}
          focusOnData={focusOnData}
          onBack={handleBack}
        />
      </div>
    </div>
  )
}
