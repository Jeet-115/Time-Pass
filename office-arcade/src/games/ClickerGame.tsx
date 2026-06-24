import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

export default function ClickerGame() {
  const { saveScore } = useScore()
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const saved = useRef(false)

  const start = useCallback(() => {
    setClicks(0)
    setTimeLeft(10)
    setPlaying(true)
    setDone(false)
    saved.current = false
  }, [])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setPlaying(false); setDone(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [playing])

  useEffect(() => {
    if (done && !saved.current) { saved.current = true; saveScore('clicker', clicks) }
  }, [done, clicks, saveScore])

  return (
    <GameShell gameId="clicker" score={clicks} status={playing ? `${timeLeft}s — CLICK!` : done ? 'Time\'s up!' : '10 second frenzy'} onRestart={start}>
      <div className="flex flex-col items-center gap-6">
        {!playing && !done && <button onClick={start} className="btn-primary">Start</button>}
        {playing && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setClicks((c) => c + 1)}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl font-bold shadow-2xl shadow-violet-500/40"
          >
            TAP!
          </motion.button>
        )}
        {done && <button onClick={start} className="btn-primary">Play Again</button>}
      </div>
    </GameShell>
  )
}
