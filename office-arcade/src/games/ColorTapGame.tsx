import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const COLORS = [
  { name: 'RED', hex: '#ef4444' },
  { name: 'BLUE', hex: '#3b82f6' },
  { name: 'GREEN', hex: '#22c55e' },
  { name: 'YELLOW', hex: '#eab308' },
  { name: 'PURPLE', hex: '#a855f7' },
  { name: 'PINK', hex: '#ec4899' },
]

export default function ColorTapGame() {
  const { saveScore } = useScore()
  const [target, setTarget] = useState({ text: '', color: '' })
  const [options, setOptions] = useState<typeof COLORS>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const saved = useRef(false)

  const nextRound = useCallback(() => {
    const textColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    const displayColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    setTarget({ text: textColor.name, color: displayColor.hex })
    const opts = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 4)
    if (!opts.find((o) => o.hex === displayColor.hex)) opts[0] = displayColor
    setOptions(opts.sort(() => Math.random() - 0.5))
  }, [])

  const start = useCallback(() => {
    setScore(0)
    setTimeLeft(30)
    setPlaying(true)
    setDone(false)
    saved.current = false
    nextRound()
  }, [nextRound])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { setPlaying(false); setDone(true); return 0 } return t - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [playing])

  useEffect(() => {
    if (done && !saved.current) { saved.current = true; saveScore('colortap', score) }
  }, [done, score, saveScore])

  const tap = (hex: string) => {
    if (!playing) return
    if (hex === target.color) { setScore((s) => s + 1); nextRound() }
    else setScore((s) => Math.max(0, s - 1))
  }

  return (
    <GameShell gameId="colortap" score={score} status={playing ? `${timeLeft}s — tap the COLOR not the word` : 'Match the ink color!'} onRestart={start}>
      <div className="flex flex-col items-center gap-6">
        {!playing && !done && <button onClick={start} className="btn-primary">Start</button>}
        {playing && (
          <>
            <div className="text-4xl font-bold" style={{ color: target.color }}>{target.text}</div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {options.map((c) => (
                <button
                  key={c.name}
                  onClick={() => tap(c.hex)}
                  className="h-16 rounded-xl border-2 border-white/20"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </>
        )}
        {done && <button onClick={start} className="btn-primary">Play Again</button>}
      </div>
    </GameShell>
  )
}
