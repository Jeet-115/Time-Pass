import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LeaderboardPage } from './pages/LeaderboardPage'

const games: Record<string, ReturnType<typeof lazy>> = {
  memory: lazy(() => import('./games/MemoryGame')),
  snake: lazy(() => import('./games/SnakeGame')),
  whack: lazy(() => import('./games/WhackGame')),
  tictactoe: lazy(() => import('./games/TicTacToeGame')),
  reaction: lazy(() => import('./games/ReactionGame')),
  simon: lazy(() => import('./games/SimonGame')),
  breakout: lazy(() => import('./games/BreakoutGame')),
  hangman: lazy(() => import('./games/HangmanGame')),
  rps: lazy(() => import('./games/RPSGame')),
  guess: lazy(() => import('./games/GuessGame')),
  math: lazy(() => import('./games/MathGame')),
  slide: lazy(() => import('./games/SlideGame')),
  pong: lazy(() => import('./games/PongGame')),
  scramble: lazy(() => import('./games/ScrambleGame')),
  colortap: lazy(() => import('./games/ColorTapGame')),
  minesweeper: lazy(() => import('./games/MinesweeperGame')),
  typing: lazy(() => import('./games/TypingGame')),
  clicker: lazy(() => import('./games/ClickerGame')),
  flappy: lazy(() => import('./games/FlappyGame')),
  connect4: lazy(() => import('./games/Connect4Game')),
}

function GameLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-white/50 animate-pulse">Loading game...</div>
    </div>
  )
}

export function App() {
  return (
    <Suspense fallback={<GameLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        {Object.entries(games).map(([id, Component]) => (
          <Route key={id} path={`/play/${id}`} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
