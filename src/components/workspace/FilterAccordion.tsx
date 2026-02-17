import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface FilterAccordionProps {
  title: string
  icon?: LucideIcon
  children: React.ReactNode
  defaultOpen?: boolean
  collapsed?: boolean
}

export function FilterAccordion({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  collapsed = false,
}: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  if (collapsed) {
    return (
      <div className="py-4 border-b border-gray-100 flex justify-center group relative">
        {Icon && (
          <Icon
            size={20}
            className="text-gray-400 group-hover:text-blue-600 transition-colors cursor-pointer"
          />
        )}
        <div className="absolute left-full top-2 ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
          {title}
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-gray-400" />}
          {title}
        </div>
        {isOpen ? (
          <ChevronUp size={14} className="text-gray-400" />
        ) : (
          <ChevronDown size={14} className="text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-1 fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
