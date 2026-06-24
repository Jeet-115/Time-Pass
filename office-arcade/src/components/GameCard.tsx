import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { GameMeta } from '../types'
import { useScore } from '../hooks/useScore'

interface GameCardProps {
  game: GameMeta
}

export function GameCard({ game }: GameCardProps) {
  const { getBest } = useScore()
  const best = getBest(game.id)

  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group">
      <Link
        to={`/play/${game.id}`}
        className="glass block p-5 h-full transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10"
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-4xl">{game.emoji}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60 capitalize">
            {game.category}
          </span>
        </div>
        <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-violet-300 transition-colors">
          {game.title}
        </h3>
        <p className="text-sm text-white/50 mb-4 line-clamp-2">{game.description}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40">Best {game.scoreLabel}</span>
          <span className="font-semibold text-violet-400">{best > 0 ? best : '—'}</span>
        </div>
      </Link>
    </motion.div>
  )
}
