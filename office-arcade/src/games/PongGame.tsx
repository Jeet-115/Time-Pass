import { useEffect, useRef, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

export default function PongGame() {
  const { saveScore, getBest } = useScore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [wins, setWins] = useState(getBest('pong'))
  const state = useRef({ py: 150, cy: 150, ball: { x: 250, y: 150, dx: 4, dy: 3 }, ps: 0, cs: 0 })

  const resetBall = () => {
    state.current.ball = { x: 250, y: 150, dx: (Math.random() > 0.5 ? 1 : -1) * 4, dy: (Math.random() - 0.5) * 6 }
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      state.current.py = Math.max(20, Math.min(280, e.clientY - rect.top - 40))
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const s = state.current
      const b = s.ball
      b.x += b.dx
      b.y += b.dy
      if (b.y <= 5 || b.y >= 295) b.dy *= -1
      s.cy += (b.y - s.cy) * 0.08
      s.cy = Math.max(20, Math.min(260, s.cy))
      if (b.x <= 25 && b.y >= s.py && b.y <= s.py + 80) { b.dx = Math.abs(b.dx); b.dy += (b.y - s.py - 40) * 0.05 }
      if (b.x >= 475 && b.y >= s.cy && b.y <= s.cy + 80) b.dx = -Math.abs(b.dx)
      if (b.x < 0) { s.cs++; resetBall(); if (s.cs >= 5) { s.ps = 0; s.cs = 0 } }
      if (b.x > 500) {
        s.ps++
        setPlayerScore(s.ps)
        resetBall()
        if (s.ps >= 5) {
          const nw = wins + 1
          setWins(nw)
          saveScore('pong', nw)
          s.ps = 0
          s.cs = 0
          setPlayerScore(0)
        }
      }
    }, 16)
    return () => clearInterval(id)
  }, [saveScore, wins])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const draw = () => {
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, 500, 300)
      const s = state.current
      ctx.fillStyle = '#a78bfa'
      ctx.fillRect(5, s.py, 10, 80)
      ctx.fillStyle = '#f472b6'
      ctx.fillRect(485, s.cy, 10, 80)
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(s.ball.x, s.ball.y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.font = '24px sans-serif'
      ctx.fillText(`${s.ps}`, 200, 30)
      ctx.fillText(`${s.cs}`, 280, 30)
      requestAnimationFrame(draw)
    }
    draw()
  }, [])

  return (
    <GameShell gameId="pong" score={wins} status={`Match: ${playerScore} - ${state.current.cs} (first to 5)`}>
      <canvas ref={canvasRef} width={500} height={300} className="game-canvas max-w-full mx-auto block" />
      <p className="text-center text-white/40 text-sm mt-2">Move mouse to control left paddle</p>
    </GameShell>
  )
}
