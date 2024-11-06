import { lazy } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'

export const mainRouter = createHashRouter([
  {
    path: '/',
    Component: lazy(() => import('@app/views/App')),
    children: [
      {
        path: '/editor',
        Component: lazy(() => import('@app/views/editor/NodeEditor')),
      },
      {
        index: true,
        Component: lazy(() => import('@app/views/dashboard/HomePage')),
      },
    ],
  },
])
