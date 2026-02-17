import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Dashboard } from '@/pages/Dashboard'
import { Workspace } from '@/pages/Workspace'

const basePath = (import.meta.env.VITE_BASE_PATH ?? '/').replace(/\/+$/, '') || ''

export const router = createBrowserRouter(
  [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'workspace/:widgetId', element: <Workspace /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
],
  basePath ? { basename: basePath } : undefined
)
