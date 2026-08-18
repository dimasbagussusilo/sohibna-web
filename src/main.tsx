import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { App } from './App'

// BrowserRouter + declarative <Routes> in App.tsx (route table mirrors the
// RN app's expo-router file tree: / → home; (tabs) under the shell; stack
// screens like /surah/:id render without the tab bar).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
