import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { mainRouter } from './routers/mainRouter'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <RouterProvider router={mainRouter} />
  </MantineProvider>
)
