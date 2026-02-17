import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Analyst Workspace</h1>
      <p className="text-gray-600 mb-6 max-w-md text-center">
        View dashboards, explore widgets, and drill down into customer interactions.
      </p>
      <Link
        to="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
