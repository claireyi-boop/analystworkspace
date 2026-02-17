import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 font-sans text-slate-800">
      <Sidebar />
      <main className="flex-grow relative overflow-hidden bg-gray-50 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
