import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const WORDS = ['happy', 'office', 'coffee', 'puzzle', 'arcade', 'brain', 'quick', 'mouse', 'keyboard', 'lunch', 'break', 'music', 'design', 'coding', 'react']

function scramble(w: string): string {
  const a = w.split('')
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  const result = a.join('')
  return result === w ? scramble(w) : result
}

export default function ScrambleGame() {
  const { saveScore } = useScore()
  const [word, setWord] = useState('')
  const [scrambled, setScrambled] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const saved = useRef(false)

  const nextWord = useCallback(() => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)]
    setWord(w)
    setScrambled(scramble(w))
    setInput('')
  }, [])

  const start = useCallback(() => {
    setScore(0)
    setTimeLeft(60)
    setPlaying(true)
    setDone(false)
    saved.current = false
    nextWord()
  }, [nextWord])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { setPlaying(false); setDone(true); return 0 } return t - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [playing])

  useEffect(() => {
    if (done && !saved.current) { saved.current = true; saveScore('scramble', score) }
  }, [done, score, saveScore])

  const submit = () => {
    if (input.toLowerCase() === word) {
      setScore((s) => s + 1)
      nextWord()
    }
    setInput('')
  }

  return (
    <GameShell gameId="scramble" score={score} status={playing ? `${timeLeft}s` : 'Unscramble the word'} onRestart={start}>
      <div className="flex flex-col items-center gap-4">
        {!playing && !done && <button onClick={start} className="btn-primary">Start</button>}
        {playing && (
          <>
            <div className="text-3xl font-mono tracking-widest text-violet-400">{scrambled.toUpperCase()}</div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              autoFocus
              className="w-full max-w-xs px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center focus:outline-none"
              placeholder="Your answer..."
            />
          </>
        )}
        {done && <button onClick={start} className="btn-primary">Play Again</button>}
      </div>
    </GameShell>
  )
}
