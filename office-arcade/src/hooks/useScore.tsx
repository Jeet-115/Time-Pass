import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { GAMES } from '../data/games'
import type { GameScore, PlayerStats } from '../types'

const STORAGE_KEY = 'office-arcade-stats'

const defaultStats = (): PlayerStats => ({
  scores: {},
  totalPlays: 0,
  favoriteGame: null,
})

function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as PlayerStats
  } catch {
    /* ignore */
  }
  return defaultStats()
}

interface ScoreContextValue {
  stats: PlayerStats
  saveScore: (gameId: string, score: number) => void
  getBest: (gameId: string) => number
  resetAll: () => void
}

const ScoreContext = createContext<ScoreContextValue | null>(null)

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<PlayerStats>(loadStats)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  }, [stats])

  const saveScore = useCallback((gameId: string, score: number) => {
    setStats((prev) => {
      const existing = prev.scores[gameId] ?? {
        gameId,
        best: 0,
        last: 0,
        plays: 0,
        totalScore: 0,
      }
      const gameMeta = GAMES.find((g) => g.id === gameId)
      const higherIsBetter = gameMeta?.scoreDirection !== 'lower'
      const best = existing.plays === 0
        ? score
        : higherIsBetter
          ? Math.max(existing.best, score)
          : Math.min(existing.best, score)
      const updated: GameScore = {
        gameId,
        last: score,
        plays: existing.plays + 1,
        totalScore: existing.totalScore + score,
        best,
      }
      const scores = { ...prev.scores, [gameId]: updated }
      const favoriteGame =
        Object.entries(scores).sort((a, b) => b[1].plays - a[1].plays)[0]?.[0] ?? null
      return { scores, totalPlays: prev.totalPlays + 1, favoriteGame }
    })
  }, [])

  const getBest = useCallback((gameId: string) => stats.scores[gameId]?.best ?? 0, [stats])

  const resetAll = useCallback(() => {
    setStats(defaultStats())
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <ScoreContext.Provider value={{ stats, saveScore, getBest, resetAll }}>
      {children}
    </ScoreContext.Provider>
  )
}

export function useScore() {
  const ctx = useContext(ScoreContext)
  if (!ctx) throw new Error('useScore must be used within ScoreProvider')
  return ctx
}
