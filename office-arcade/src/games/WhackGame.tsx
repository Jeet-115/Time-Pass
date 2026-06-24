import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const GRID = 9
const DURATION = 30

export default function WhackGame() {
  const { saveScore } = useScore()
  const [mole, setMole] = useState<number | null>(null)
  const [hits, setHits] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const start = useCallback(() => {
    setHits(0)
    setTimeLeft(DURATION)
    setPlaying(true)
    setDone(false)
  }, [])

  useEffect(() => {
    if (!playing) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPlaying(false)
          setDone(true)
          setMole(null)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [playing])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setMole(Math.floor(Math.random() * GRID)), 800)
    return () => clearInterval(id)
  }, [playing])

  useEffect(() => {
    if (done) saveScore('whack', hits)
  }, [done, hits, saveScore])

  const whack = (i: number) => {
    if (!playing || mole !== i) return
    setHits((h) => h + 1)
    setMole(null)
  }

  return (
    <GameShell gameId="whack" score={hits} status={playing ? `${timeLeft}s left` : done ? 'Time\'s up!' : 'Ready?'} onRestart={start}>
      <div className="flex flex-col items-center gap-4">
        {!playing && !done && <button onClick={start} className="btn-primary">Start ({DURATION}s)</button>}
        <div className="grid grid-cols-3 gap-3 max-w-xs w-full">
          {Array.from({ length: GRID }, (_, i) => (
            <button
              key={i}
              onClick={() => whack(i)}
              className="aspect-square rounded-xl bg-amber-900/40 border border-amber-700/30 relative overflow-hidden"
            >
              <AnimatePresence>
                {mole === i && (
                  <motion.span
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-4xl"
                  >
                    🐹
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
        {done && <button onClick={start} className="btn-primary">Play Again</button>}
      </div>
    </GameShell>
  )
}
