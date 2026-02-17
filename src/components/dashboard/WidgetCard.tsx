import { useNavigate } from 'react-router-dom'
import { Maximize2 } from 'lucide-react'

interface WidgetCardProps {
  widgetId: string
  title: string
  children: React.ReactNode
  onDrill?: (name: string) => void
  drillLabel?: string
}

export function WidgetCard({
  widgetId,
  title,
  children,
  onDrill,
  drillLabel,
}: WidgetCardProps) {
  const navigate = useNavigate()

  const handleExplore = () => {
    navigate(`/workspace/${widgetId}`)
  }

  return (
    <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 relative group/widget h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-600 font-normal">{title}</h3>
        <button
          type="button"
          onClick={handleExplore}
          className="bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-2 opacity-0 group-hover/widget:opacity-100 transition-opacity hover:bg-blue-50 z-20"
        >
          <Maximize2 size={12} /> Explore
        </button>
      </div>
      <div className="flex-grow min-h-0">
        {children}
      </div>
      {drillLabel && onDrill && (
        <p className="text-[10px] text-gray-400 mt-2">
          Click a row to drill: {drillLabel}
        </p>
      )}
    </div>
  )
}
