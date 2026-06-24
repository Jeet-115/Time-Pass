import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const WORDS = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'office', 'arcade', 'game', 'play', 'fun', 'code', 'react']

export default function TypingGame() {
  const { saveScore } = useScore()
  const [words, setWords] = useState<string[]>([])
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [typed, setTyped] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const startTime = useRef(0)
  const saved = useRef(false)

  const start = useCallback(() => {
    setWords([...WORDS].sort(() => Math.random() - 0.5))
    setIdx(0)
    setInput('')
    setTyped(0)
    setTimeLeft(60)
    setPlaying(true)
    setDone(false)
    saved.current = false
    startTime.current = Date.now()
  }, [])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { setPlaying(false); setDone(true); return 0 } return t - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [playing])

  useEffect(() => {
    if (done && !saved.current) {
      saved.current = true
      const minutes = (Date.now() - startTime.current) / 60000
      const wpm = Math.round((typed / 5) / minutes) || 0
      saveScore('typing', wpm)
    }
  }, [done, typed, saveScore])

  const onChange = (val: string) => {
    if (!playing) return
    setInput(val)
    const word = words[idx]
    if (val === word + ' ') {
      setTyped((t) => t + word.length + 1)
      setIdx((i) => (i + 1) % words.length)
      setInput('')
    }
  }

  const wpm = playing || done ? Math.round((typed / 5) / ((60 - timeLeft) / 60 || 1)) : 0

  return (
    <GameShell gameId="typing" score={done ? wpm : wpm} status={playing ? `${timeLeft}s` : 'Type the words!'} onRestart={start}>
      <div className="flex flex-col items-center gap-4">
        {!playing && !done && <button onClick={start} className="btn-primary">Start (60s)</button>}
        {playing && (
          <>
            <div className="text-2xl font-mono p-4 rounded-xl bg-white/5 w-full text-center">
              {words[idx]}
            </div>
            <input
              value={input}
              onChange={(e) => onChange(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-mono focus:outline-none"
            />
          </>
        )}
        {done && <button onClick={start} className="btn-primary">Play Again</button>}
      </div>
    </GameShell>
  )
}
