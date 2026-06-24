import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ScoreProvider } from './hooks/useScore'
import { Header } from './components/Header'
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScoreProvider>
        <Header />
        <App />
      </ScoreProvider>
    </BrowserRouter>
  </StrictMode>
)
