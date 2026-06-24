import { useCallback, useEffect, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const SIZE = 4

function shuffleBoard(): number[] {
  const arr = Array.from({ length: SIZE * SIZE - 1 }, (_, i) => i + 1)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  arr.push(0)
  return arr
}

function isSolved(board: number[]) {
  return board.slice(0, -1).every((v, i) => v === i + 1) && board[15] === 0
}

export default function SlideGame() {
  const { saveScore } = useScore()
  const [board, setBoard] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)

  const init = useCallback(() => {
    setBoard(shuffleBoard())
    setMoves(0)
    setWon(false)
  }, [])

  useEffect(() => init(), [init])

  const move = (i: number) => {
    const empty = board.indexOf(0)
    const row = Math.floor(i / SIZE), col = i % SIZE
    const er = Math.floor(empty / SIZE), ec = empty % SIZE
    if ((Math.abs(row - er) === 1 && col === ec) || (Math.abs(col - ec) === 1 && row === er)) {
      const next = [...board]
      ;[next[i], next[empty]] = [next[empty], next[i]]
      setBoard(next)
      setMoves((m) => m + 1)
      if (isSolved(next)) { setWon(true); saveScore('slide', moves + 1) }
    }
  }

  return (
    <GameShell gameId="slide" score={moves} status={won ? 'Solved! 🎉' : 'Slide tiles to order 1–15'} onRestart={init}>
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {board.map((n, i) => (
          <button
            key={i}
            onClick={() => move(i)}
            disabled={n === 0}
            className={`aspect-square rounded-xl text-lg font-bold transition-all ${
              n === 0 ? 'invisible' : 'bg-violet-500/30 hover:bg-violet-500/50 border border-violet-500/30'
            }`}
          >
            {n || ''}
          </button>
        ))}
      </div>
    </GameShell>
  )
}
