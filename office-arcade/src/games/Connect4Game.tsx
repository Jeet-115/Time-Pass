import { useCallback, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const ROWS = 6, COLS = 7

type Cell = 0 | 1 | 2

function checkWin(board: Cell[][], player: 1 | 2): boolean {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) return true
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS - 3; r++)
      if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) return true
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) return true
      if (board[r+3][c] === player && board[r+2][c+1] === player && board[r+1][c+2] === player && board[r][c+3] === player) return true
    }
  return false
}

function drop(board: Cell[][], col: number, player: 1 | 2): Cell[][] | null {
  const b = board.map((r) => [...r])
  for (let r = ROWS - 1; r >= 0; r--) {
    if (b[r][col] === 0) { b[r][col] = player; return b }
  }
  return null
}

function aiCol(board: Cell[][]): number {
  for (let c = 0; c < COLS; c++) {
    const b = drop(board, c, 2)
    if (b && checkWin(b, 2)) return c
  }
  for (let c = 0; c < COLS; c++) {
    const b = drop(board, c, 1)
    if (b && checkWin(b, 1)) return c
  }
  const mid = [3, 2, 4, 1, 5, 0, 6]
  for (const c of mid) if (board[0][c] === 0) return c
  return 0
}

export default function Connect4Game() {
  const { saveScore, getBest } = useScore()
  const [board, setBoard] = useState<Cell[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]))
  const [wins, setWins] = useState(getBest('connect4'))
  const [status, setStatus] = useState('Your turn (red)')
  const [over, setOver] = useState(false)

  const reset = useCallback(() => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]))
    setStatus('Your turn (red)')
    setOver(false)
  }, [])

  const play = (col: number) => {
    if (over || board[0][col] !== 0) return
    let b = drop(board, col, 1)
    if (!b) return
    if (checkWin(b, 1)) {
      setBoard(b)
      setOver(true)
      const nw = wins + 1
      setWins(nw)
      saveScore('connect4', nw)
      setStatus('You win! 🎉')
      return
    }
    const ac = aiCol(b)
    b = drop(b, ac, 2)!
    setBoard(b)
    if (checkWin(b, 2)) { setOver(true); setStatus('Computer wins!') }
    else if (b.every((row) => row.every((c) => c !== 0))) { setOver(true); setStatus('Draw!') }
    else setStatus('Your turn (red)')
  }

  const colors = ['bg-white/5', 'bg-red-500', 'bg-yellow-400']

  return (
    <GameShell gameId="connect4" score={wins} status={status} onRestart={reset}>
      <div className="flex flex-col items-center gap-2">
        <div className="p-3 rounded-xl bg-blue-900/40 border border-blue-500/30">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {Array.from({ length: COLS }, (_, col) => (
              <button key={col} onClick={() => play(col)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 mb-1" />
            ))}
          </div>
          {board.map((row, r) => (
            <div key={r} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
              {row.map((cell, c) => (
                <div key={c} className={`w-10 h-10 rounded-full ${colors[cell]} border border-white/10`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </GameShell>
  )
}
