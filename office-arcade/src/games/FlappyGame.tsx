import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

export default function FlappyGame() {
  const { saveScore } = useScore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const state = useRef({
    bird: { y: 200, vy: 0 },
    pipes: [] as { x: number; gap: number }[],
    score: 0,
  })

  const reset = useCallback(() => {
    state.current = { bird: { y: 200, vy: 0 }, pipes: [{ x: 400, gap: 120 + Math.random() * 80 }], score: 0 }
    setScore(0)
    setGameOver(false)
    setStarted(true)
  }, [])

  const flap = useCallback(() => {
    if (!started || gameOver) { reset(); return }
    state.current.bird.vy = -6
  }, [started, gameOver, reset])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); flap() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flap])

  useEffect(() => {
    if (!started || gameOver) return
    const id = setInterval(() => {
      const s = state.current
      s.bird.vy += 0.4
      s.bird.y += s.bird.vy
      s.pipes.forEach((p) => { p.x -= 3 })
      if (s.pipes[0].x < -60) {
        s.pipes.shift()
        s.pipes.push({ x: 400, gap: 80 + Math.random() * 100 })
        s.score++
        setScore(s.score)
      }
      const bird = s.bird
      if (bird.y < 0 || bird.y > 400) { setGameOver(true); saveScore('flappy', s.score); return }
      for (const p of s.pipes) {
        if (p.x < 50 && p.x > 10) {
          if (bird.y < p.gap - 50 || bird.y > p.gap + 50) {
            setGameOver(true)
            saveScore('flappy', s.score)
          }
        }
      }
    }, 20)
    return () => clearInterval(id)
  }, [started, gameOver, saveScore])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const draw = () => {
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, 400, 400)
      const s = state.current
      ctx.fillStyle = '#22c55e'
      s.pipes.forEach((p) => {
        ctx.fillRect(p.x, 0, 40, p.gap - 50)
        ctx.fillRect(p.x, p.gap + 50, 40, 400)
      })
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(50, s.bird.y, 15, 0, Math.PI * 2)
      ctx.fill()
      requestAnimationFrame(draw)
    }
    draw()
  }, [started])

  return (
    <GameShell gameId="flappy" score={score} status={gameOver ? 'Game Over!' : 'Space or click to flap'} onRestart={reset}>
      <div className="flex flex-col items-center gap-4">
        {!started && <button onClick={reset} className="btn-primary">Start</button>}
        <canvas ref={canvasRef} width={400} height={400} onClick={flap} className="game-canvas cursor-pointer max-w-full" />
        {gameOver && <button onClick={reset} className="btn-primary">Play Again</button>}
      </div>
    </GameShell>
  )
}
