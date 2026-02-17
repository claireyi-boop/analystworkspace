import { useState } from 'react'
import { Settings, Save } from 'lucide-react'

interface WidgetEditorProps {
  widgetId: string
  title: string
  onSave?: (updates: { title: string; chartType?: string }) => void
}

const CHART_TYPES = ['Bar', 'Line', 'Pie', 'Table', 'Feed'] as const

export function WidgetEditor({ title, onSave }: WidgetEditorProps) {
  const [editing, setEditing] = useState(false)
  const [localTitle, setLocalTitle] = useState(title)
  const [chartType, setChartType] = useState('Bar')

  const handleSave = () => {
    onSave?.({ title: localTitle, chartType })
    setEditing(false)
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">{localTitle}</span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Edit widget"
        >
          <Settings size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
      <label className="block text-xs font-bold text-gray-500 uppercase">Title</label>
      <input
        type="text"
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
      />
      <label className="block text-xs font-bold text-gray-500 uppercase">Chart type</label>
      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
      >
        {CHART_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
        >
          <Save size={14} /> Save
        </button>
      </div>
    </div>
  )
}
