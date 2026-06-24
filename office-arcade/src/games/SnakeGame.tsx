import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const SIZE = 16
const CELL = 18

type Point = { x: number; y: number }

export default function SnakeGame() {
  const { saveScore } = useScore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const state = useRef({ snake: [{ x: 8, y: 8 }] as Point[], dir: { x: 1, y: 0 }, food: { x: 12, y: 8 }, score: 0 })

  const spawnFood = useCallback((snake: Point[]) => {
    let f: Point
    do {
      f = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) }
    } while (snake.some((s) => s.x === f.x && s.y === f.y))
    return f
  }, [])

  const reset = useCallback(() => {
    state.current = { snake: [{ x: 8, y: 8 }], dir: { x: 1, y: 0 }, food: { x: 12, y: 8 }, score: 0 }
    setScore(0)
    setGameOver(false)
    setStarted(true)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = state.current.dir
      if (e.key === 'ArrowUp' && d.y !== 1) state.current.dir = { x: 0, y: -1 }
      if (e.key === 'ArrowDown' && d.y !== -1) state.current.dir = { x: 0, y: 1 }
      if (e.key === 'ArrowLeft' && d.x !== 1) state.current.dir = { x: -1, y: 0 }
      if (e.key === 'ArrowRight' && d.x !== -1) state.current.dir = { x: 1, y: 0 }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!started || gameOver) return
    const id = setInterval(() => {
      const s = state.current
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y }
      if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE || s.snake.some((p) => p.x === head.x && p.y === head.y)) {
        setGameOver(true)
        saveScore('snake', s.score)
        return
      }
      const newSnake = [head, ...s.snake]
      if (head.x === s.food.x && head.y === s.food.y) {
        s.score += 10
        s.food = spawnFood(newSnake)
        setScore(s.score)
      } else {
        newSnake.pop()
      }
      s.snake = newSnake
    }, 120)
    return () => clearInterval(id)
  }, [started, gameOver, saveScore, spawnFood])

  useEffect(() => {
    if (!started) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const draw = () => {
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, SIZE * CELL, SIZE * CELL)
      const s = state.current
      ctx.fillStyle = '#a78bfa'
      s.snake.forEach((p, i) => {
        ctx.globalAlpha = 1 - i * 0.03
        ctx.fillRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2)
      })
      ctx.globalAlpha = 1
      ctx.fillStyle = '#f472b6'
      ctx.beginPath()
      ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
      ctx.fill()
      requestAnimationFrame(draw)
    }
    draw()
  }, [started])

  return (
    <GameShell gameId="snake" score={score} status={gameOver ? 'Game Over!' : started ? 'Use arrow keys' : 'Press Start'} onRestart={reset}>
      <div className="flex flex-col items-center gap-4">
        {!started && <button onClick={reset} className="btn-primary">Start Game</button>}
        <canvas ref={canvasRef} width={SIZE * CELL} height={SIZE * CELL} className="game-canvas" />
        {gameOver && <button onClick={reset} className="btn-primary">Play Again</button>}
      </div>
    </GameShell>
  )
}
