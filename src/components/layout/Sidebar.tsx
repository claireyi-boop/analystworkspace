import { HelpCircle, Bell } from 'lucide-react'

export function Sidebar() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 z-30">
      <div className="text-blue-600 font-bold text-2xl tracking-tighter">XM</div>
      <div className="flex items-center gap-4 text-gray-400">
        <button type="button" className="p-2 rounded hover:bg-gray-100 hover:text-gray-600" title="Help">
          <HelpCircle size={20} />
        </button>
        <button type="button" className="p-2 rounded hover:bg-gray-100 hover:text-gray-600" title="Notifications">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs font-medium">
          W
        </div>
      </div>
    </header>
  )
}
