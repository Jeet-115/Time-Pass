import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { GAMES } from '../data/games'
import { useScore } from '../hooks/useScore'

interface GameShellProps {
  gameId: string
  children: ReactNode
  score?: number | string
  status?: string
  onRestart?: () => void
}

export function GameShell({ gameId, children, score, status, onRestart }: GameShellProps) {
  const game = GAMES.find((g) => g.id === gameId)
  const { getBest } = useScore()
  const best = getBest(gameId)

  if (!game) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="btn-secondary text-sm py-2 px-3">
          ← Back
        </Link>
        <div className="flex-1">
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <span>{game.emoji}</span> {game.title}
          </h2>
          <p className="text-sm text-white/50">{game.description}</p>
        </div>
        {onRestart && (
          <button onClick={onRestart} className="btn-secondary text-sm">
            ↺ Restart
          </button>
        )}
      </div>

      <div className="glass p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-6">
          {score !== undefined && (
            <div>
              <div className="text-xs text-white/40">{game.scoreLabel}</div>
              <motion.div
                key={String(score)}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-violet-400"
              >
                {score}
              </motion.div>
            </div>
          )}
          <div>
            <div className="text-xs text-white/40">Best</div>
            <div className="text-2xl font-bold text-fuchsia-400">{best > 0 ? best : '—'}</div>
          </div>
        </div>
        {status && (
          <div className="text-sm font-medium px-3 py-1.5 rounded-lg bg-white/10">{status}</div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-6">
        {children}
      </motion.div>
    </div>
  )
}
