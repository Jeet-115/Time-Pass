import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ScoreProvider } from './hooks/useScore'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScoreProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <App />
          </main>
          <Footer />
        </div>
      </ScoreProvider>
    </BrowserRouter>
  </StrictMode>
)
