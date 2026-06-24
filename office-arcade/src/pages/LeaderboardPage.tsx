import { motion } from 'framer-motion'
import { GAMES } from '../data/games'
import { useScore } from '../hooks/useScore'

export function LeaderboardPage() {
  const { stats, resetAll } = useScore()

  const ranked = GAMES.map((game) => ({
    ...game,
    score: stats.scores[game.id],
  }))
    .filter((g) => g.score && g.score.plays > 0)
    .sort((a, b) => (b.score?.plays ?? 0) - (a.score?.plays ?? 0))

  const withBest = GAMES.map((game) => ({
    ...game,
    best: stats.scores[game.id]?.best ?? 0,
    plays: stats.scores[game.id]?.plays ?? 0,
  })).filter((g) => g.best > 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-3xl font-bold mb-2">🏆 Your Scores</h2>
        <p className="text-white/50 mb-8">All scores saved locally on this device.</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass p-4 text-center">
            <div className="text-2xl font-bold text-violet-400">{stats.totalPlays}</div>
            <div className="text-xs text-white/40">Total Plays</div>
          </div>
          <div className="glass p-4 text-center">
            <div className="text-2xl font-bold text-fuchsia-400">{withBest.length}</div>
            <div className="text-xs text-white/40">Games Played</div>
          </div>
          <div className="glass p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">{GAMES.length}</div>
            <div className="text-xs text-white/40">Available</div>
          </div>
        </div>

        <h3 className="font-display font-semibold text-lg mb-4">Best Scores</h3>
        <div className="space-y-2 mb-8">
          {withBest.length === 0 ? (
            <p className="text-white/40 text-center py-8">Play some games to see your scores here!</p>
          ) : (
            withBest
              .sort((a, b) => b.best - a.best)
              .map((g, i) => (
                <div key={g.id} className="glass p-4 flex items-center gap-4">
                  <span className="text-lg font-bold text-white/30 w-6">#{i + 1}</span>
                  <span className="text-2xl">{g.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium">{g.title}</div>
                    <div className="text-xs text-white/40">{g.plays} plays</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-violet-400">{g.best}</div>
                    <div className="text-xs text-white/40">{g.scoreLabel}</div>
                  </div>
                </div>
              ))
          )}
        </div>

        {ranked.length > 0 && (
          <>
            <h3 className="font-display font-semibold text-lg mb-4">Most Played</h3>
            <div className="space-y-2 mb-8">
              {ranked.slice(0, 5).map((g, i) => (
                <div key={g.id} className="glass p-4 flex items-center gap-4">
                  <span className="text-lg font-bold text-white/30 w-6">#{i + 1}</span>
                  <span className="text-2xl">{g.emoji}</span>
                  <div className="flex-1 font-medium">{g.title}</div>
                  <div className="font-bold text-fuchsia-400">{g.score?.plays} plays</div>
                </div>
              ))}
            </div>
          </>
        )}

        <button onClick={resetAll} className="btn-secondary text-sm text-red-400 border-red-500/20">
          Reset All Scores
        </button>
      </motion.div>
    </div>
  )
}
