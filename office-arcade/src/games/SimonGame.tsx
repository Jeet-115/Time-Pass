import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const COLORS = [
  { name: 'red', bg: 'bg-red-500' },
  { name: 'blue', bg: 'bg-blue-500' },
  { name: 'green', bg: 'bg-green-500' },
  { name: 'yellow', bg: 'bg-yellow-500' },
]

export default function SimonGame() {
  const { saveScore } = useScore()
  const [sequence, setSequence] = useState<number[]>([])
  const [playerIdx, setPlayerIdx] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  const [level, setLevel] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [inputting, setInputting] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const playSequence = useCallback(async (seq: number[]) => {
    setPlaying(true)
    setInputting(false)
    for (const c of seq) {
      setActive(c)
      await new Promise((r) => setTimeout(r, 500))
      setActive(null)
      await new Promise((r) => setTimeout(r, 200))
    }
    setPlaying(false)
    setInputting(true)
    setPlayerIdx(0)
  }, [])

  const start = useCallback(() => {
    const first = Math.floor(Math.random() * 4)
    const seq = [first]
    setSequence(seq)
    setLevel(1)
    setGameOver(false)
    playSequence(seq)
  }, [playSequence])

  const tap = (i: number) => {
    if (!inputting || playing) return
    if (sequence[playerIdx] !== i) {
      setGameOver(true)
      setInputting(false)
      saveScore('simon', level - 1)
      return
    }
    setActive(i)
    setTimeout(() => setActive(null), 200)
    const next = playerIdx + 1
    if (next === sequence.length) {
      const newSeq = [...sequence, Math.floor(Math.random() * 4)]
      setSequence(newSeq)
      setLevel((l) => l + 1)
      setTimeout(() => playSequence(newSeq), 600)
    } else {
      setPlayerIdx(next)
    }
  }

  return (
    <GameShell gameId="simon" score={level} status={gameOver ? 'Wrong!' : level === 0 ? 'Press Start' : `Level ${level}`} onRestart={start}>
      <div className="flex flex-col items-center gap-6">
        {level === 0 && !gameOver && <button onClick={start} className="btn-primary">Start</button>}
        <div className="grid grid-cols-2 gap-4 max-w-xs w-full">
          {COLORS.map((c, i) => (
            <motion.button
              key={c.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => tap(i)}
              className={`aspect-square rounded-2xl ${c.bg} ${active === i ? 'brightness-150 ring-4 ring-white' : 'brightness-75'} transition-all`}
            />
          ))}
        </div>
        {(gameOver || level > 0) && <button onClick={start} className="btn-primary">Play Again</button>}
      </div>
    </GameShell>
  )
}
