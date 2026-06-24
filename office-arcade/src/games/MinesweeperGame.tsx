import { useCallback, useEffect, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const ROWS = 8, COLS = 8, MINES = 10

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; count: number }

function buildBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }))
  )
  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (!board[r][c].mine) { board[r][c].mine = true; placed++ }
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (!board[r][c].mine) {
        let n = 0
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) n++
          }
        board[r][c].count = n
      }
  return board
}

export default function MinesweeperGame() {
  const { saveScore, getBest } = useScore()
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [wins, setWins] = useState(getBest('minesweeper'))

  const init = useCallback(() => {
    setBoard(buildBoard())
    setGameOver(false)
    setWon(false)
  }, [])

  useEffect(() => { init() }, [init])

  const reveal = (r: number, c: number, b: Cell[][]) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || b[r][c].revealed || b[r][c].flagged) return b
    b[r][c].revealed = true
    if (b[r][c].count === 0 && !b[r][c].mine)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          reveal(r + dr, c + dc, b)
    return b
  }

  const click = (r: number, c: number) => {
    if (gameOver || won || board[r][c].revealed || board[r][c].flagged) return
    const b = board.map((row) => row.map((cell) => ({ ...cell })))
    if (b[r][c].mine) {
      b.forEach((row) => row.forEach((cell) => { cell.revealed = true }))
      setBoard(b)
      setGameOver(true)
      return
    }
    reveal(r, c, b)
    setBoard(b)
    const safe = b.flat().filter((c) => !c.mine)
    if (safe.every((c) => c.revealed)) {
      setWon(true)
      const nw = wins + 1
      setWins(nw)
      saveScore('minesweeper', nw)
    }
  }

  const flag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault()
    if (gameOver || won || board[r][c].revealed) return
    setBoard((b) => b.map((row, ri) => row.map((cell, ci) =>
      ri === r && ci === c ? { ...cell, flagged: !cell.flagged } : cell
    )))
  }

  return (
    <GameShell gameId="minesweeper" score={wins} status={won ? 'You won!' : gameOver ? 'Boom!' : 'Left click reveal, right click flag'} onRestart={init}>
      <div className="inline-grid gap-0.5 mx-auto" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {board.flatMap((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => click(r, c)}
              onContextMenu={(e) => flag(e, r, c)}
              className={`w-8 h-8 text-xs font-bold rounded ${
                cell.revealed
                  ? cell.mine ? 'bg-red-500' : 'bg-white/10'
                  : 'bg-violet-500/30 hover:bg-violet-500/50'
              }`}
            >
              {cell.flagged ? '🚩' : cell.revealed ? (cell.mine ? '💣' : cell.count || '') : ''}
            </button>
          ))
        )}
      </div>
    </GameShell>
  )
}
