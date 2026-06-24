import { useState } from 'react'
import { motion } from 'framer-motion'
import { GameCard } from '../components/GameCard'
import { GAMES, CATEGORIES } from '../data/games'

export function HomePage() {
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = GAMES.filter((g) => {
    const matchCat = category === 'all' || g.category === category
    const matchSearch =
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
          Beat Office Boredom
        </h2>
        <p className="text-white/50 max-w-xl mx-auto text-lg">
          {GAMES.length} mini games with scores, high scores, and endless fun. Pick a game and start playing!
        </p>
      </motion.section>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="search"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500/50 focus:outline-none transition-colors"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat.id
                  ? 'bg-violet-500/30 border border-violet-500/50 text-violet-200'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <GameCard game={game} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-white/40 py-12">No games match your search.</p>
      )}
    </div>
  )
}
