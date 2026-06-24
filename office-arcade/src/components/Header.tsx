import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useScore } from '../hooks/useScore'
import { GAMES } from '../data/games'

export function Header() {
  const { stats } = useScore()

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 rounded-none">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            className="text-2xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            🎮
          </motion.span>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight group-hover:text-violet-300 transition-colors">
              Office Arcade
            </h1>
            <p className="text-[10px] text-white/40 tracking-wider uppercase">Beat boredom!</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-white/40 text-xs">Games</div>
              <div className="font-semibold">{GAMES.length}</div>
            </div>
            <div className="text-center">
              <div className="text-white/40 text-xs">Plays</div>
              <div className="font-semibold">{stats.totalPlays}</div>
            </div>
          </div>
          <Link to="/leaderboard" className="btn-secondary text-sm">
            🏆 Scores
          </Link>
        </div>
      </div>
    </header>
  )
}
