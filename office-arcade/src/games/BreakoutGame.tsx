import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

export default function BreakoutGame() {
  const { saveScore } = useScore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const state = useRef({
    paddle: 200, ball: { x: 250, y: 300, dx: 3, dy: -3 },
    bricks: [] as { x: number; y: number; alive: boolean }[],
    score: 0,
  })

  const init = useCallback(() => {
    const bricks = []
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 8; c++)
        bricks.push({ x: c * 62 + 10, y: r * 24 + 40, alive: true })
    state.current = { paddle: 200, ball: { x: 250, y: 300, dx: 3, dy: -3 }, bricks, score: 0 }
    setScore(0)
    setLives(3)
    setGameOver(false)
    setWon(false)
  }, [])

  useEffect(() => init(), [init])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      state.current.paddle = Math.max(30, Math.min(470, e.clientX - rect.left - 40))
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    if (gameOver || won) return
    const id = setInterval(() => {
      const s = state.current
      const b = s.ball
      b.x += b.dx
      b.y += b.dy
      if (b.x <= 5 || b.x >= 495) b.dx *= -1
      if (b.y <= 5) b.dy *= -1
      if (b.y >= 380 && b.y <= 395 && b.x >= s.paddle && b.x <= s.paddle + 80) {
        b.dy = -Math.abs(b.dy)
        b.dx = (b.x - s.paddle - 40) * 0.1
      }
      if (b.y > 410) {
        setLives((l) => {
          if (l <= 1) { setGameOver(true); saveScore('breakout', s.score); return 0 }
          s.ball = { x: 250, y: 300, dx: 3, dy: -3 }
          return l - 1
        })
      }
      s.bricks.forEach((br) => {
        if (!br.alive) return
        if (b.x >= br.x && b.x <= br.x + 58 && b.y >= br.y && b.y <= br.y + 20) {
          br.alive = false
          b.dy *= -1
          s.score += 10
          setScore(s.score)
        }
      })
      if (s.bricks.every((br) => !br.alive)) { setWon(true); saveScore('breakout', s.score) }
    }, 16)
    return () => clearInterval(id)
  }, [gameOver, won, saveScore])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const draw = () => {
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, 500, 420)
      const s = state.current
      ctx.fillStyle = '#a78bfa'
      s.bricks.forEach((br) => { if (br.alive) ctx.fillRect(br.x, br.y, 58, 20) })
      ctx.fillStyle = '#c4b5fd'
      ctx.fillRect(s.paddle, 385, 80, 12)
      ctx.fillStyle = '#f472b6'
      ctx.beginPath()
      ctx.arc(s.ball.x, s.ball.y, 8, 0, Math.PI * 2)
      ctx.fill()
      requestAnimationFrame(draw)
    }
    draw()
  }, [])

  return (
    <GameShell gameId="breakout" score={score} status={won ? 'You won!' : gameOver ? 'Game Over' : `Lives: ${lives}`} onRestart={init}>
      <div className="flex flex-col items-center">
        <canvas ref={canvasRef} width={500} height={420} className="game-canvas max-w-full" />
      </div>
    </GameShell>
  )
}
