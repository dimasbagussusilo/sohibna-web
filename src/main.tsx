import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import { App } from './App'

// Route table mirrors the RN app's expo-router file tree (src/app/**):
//   /            → redirect to /home
//   /(tabs)      → home, calendar, quran, rulings, me (TabBar + AppShell)
//   stack screens → login, register, surah/:id, ... (no tab bar)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter([{ path: '/', element: <App /> }])} />
  </StrictMode>,
)
