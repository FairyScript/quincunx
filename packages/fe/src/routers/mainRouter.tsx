import { lazy } from 'react'
import { createHashRouter } from 'react-router-dom'

export const mainRouter = createHashRouter([
  {
    path: '/',
    Component: lazy(() => import('@app/views/App')),
  },
])
