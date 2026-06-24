import { useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

type Cell = 'X' | 'O' | null

function checkWinner(b: Cell[]): Cell | 'draw' | null {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  for (const [a,b2,c] of lines) {
    if (b[a] && b[a] === b[b2] && b[a] === b[c]) return b[a]
  }
  return b.every(Boolean) ? 'draw' : null
}

function aiMove(board: Cell[]): number {
  const empty = board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0)
  for (const i of empty) {
    const t = [...board]; t[i] = 'O'
    if (checkWinner(t) === 'O') return i
  }
  for (const i of empty) {
    const t = [...board]; t[i] = 'X'
    if (checkWinner(t) === 'X') return i
  }
  if (empty.includes(4)) return 4
  const corners = empty.filter((i) => [0,2,6,8].includes(i))
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)]
  return empty[Math.floor(Math.random() * empty.length)]
}

export default function TicTacToeGame() {
  const { saveScore, getBest } = useScore()
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [wins, setWins] = useState(getBest('tictactoe'))
  const [status, setStatus] = useState('Your turn (X)')

  const play = (i: number) => {
    if (board[i] || checkWinner(board)) return
    const next = [...board]
    next[i] = 'X'
    const w = checkWinner(next)
    if (w) {
      setBoard(next)
      if (w === 'X') { setWins((w) => w + 1); saveScore('tictactoe', wins + 1); setStatus('You win! 🎉') }
      else setStatus('Draw!')
      return
    }
    const ai = aiMove(next)
    next[ai] = 'O'
    const w2 = checkWinner(next)
    setBoard(next)
    if (w2 === 'O') setStatus('Computer wins!')
    else if (w2 === 'draw') setStatus('Draw!')
    else setStatus('Your turn (X)')
  }

  const reset = () => { setBoard(Array(9).fill(null)); setStatus('Your turn (X)') }

  return (
    <GameShell gameId="tictactoe" score={wins} status={status} onRestart={reset}>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className="aspect-square rounded-xl text-3xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <span className={cell === 'X' ? 'text-violet-400' : 'text-fuchsia-400'}>{cell}</span>
          </button>
        ))}
      </div>
    </GameShell>
  )
}
