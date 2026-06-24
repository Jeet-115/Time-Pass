export type ScoreDirection = 'higher' | 'lower'

export interface GameMeta {
  id: string
  title: string
  description: string
  emoji: string
  category: 'puzzle' | 'arcade' | 'reflex' | 'brain' | 'classic'
  scoreDirection: ScoreDirection
  scoreLabel: string
}

export interface GameScore {
  gameId: string
  best: number
  last: number
  plays: number
  totalScore: number
}

export interface PlayerStats {
  scores: Record<string, GameScore>
  totalPlays: number
  favoriteGame: string | null
}
