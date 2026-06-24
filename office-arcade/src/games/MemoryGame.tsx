import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🥝', '🍑', '🍒']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryGame() {
  const { saveScore } = useScore()
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [lock, setLock] = useState(false)

  const init = useCallback(() => {
    const pairs = shuffle(EMOJIS.slice(0, 6))
    const deck = shuffle([...pairs, ...pairs].map((emoji, id) => ({ id, emoji, flipped: false, matched: false })))
    setCards(deck)
    setFlipped([])
    setMoves(0)
    setWon(false)
    setLock(false)
  }, [])

  useEffect(() => init(), [init])

  useEffect(() => {
    if (flipped.length !== 2) return
    setLock(true)
    setMoves((m) => m + 1)
    const [a, b] = flipped
    if (cards[a].emoji === cards[b].emoji) {
      setCards((c) => c.map((card, i) => (i === a || i === b ? { ...card, matched: true, flipped: true } : card)))
      setFlipped([])
      setLock(false)
    } else {
      setTimeout(() => {
        setCards((c) => c.map((card, i) => (i === a || i === b ? { ...card, flipped: false } : card)))
        setFlipped([])
        setLock(false)
      }, 700)
    }
  }, [flipped, cards])

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setWon(true)
      saveScore('memory', moves)
    }
  }, [cards, moves, saveScore])

  const flip = (i: number) => {
    if (lock || cards[i].flipped || cards[i].matched || flipped.length >= 2) return
    setCards((c) => c.map((card, idx) => (idx === i ? { ...card, flipped: true } : card)))
    setFlipped((f) => [...f, i])
  }

  return (
    <GameShell gameId="memory" score={moves} status={won ? '🎉 You won!' : 'Playing'} onRestart={init}>
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {cards.map((card, i) => (
          <motion.button
            key={card.id + '-' + i}
            whileTap={{ scale: 0.95 }}
            onClick={() => flip(i)}
            className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
              card.flipped || card.matched
                ? 'bg-violet-500/30 border-violet-500/50'
                : 'bg-white/10 hover:bg-white/15 cursor-pointer'
            } border border-white/10`}
          >
            {card.flipped || card.matched ? card.emoji : '?'}
          </motion.button>
        ))}
      </div>
    </GameShell>
  )
}
