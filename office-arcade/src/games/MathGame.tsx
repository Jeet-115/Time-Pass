import { useCallback, useEffect, useRef, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

function genProblem() {
  const ops = ['+', '-', '×'] as const
  const op = ops[Math.floor(Math.random() * 3)]
  let a = Math.floor(Math.random() * 12) + 1
  let b = Math.floor(Math.random() * 12) + 1
  if (op === '-' && b > a) [a, b] = [b, a]
  if (op === '×') { a = Math.floor(Math.random() * 10) + 1; b = Math.floor(Math.random() * 10) + 1 }
  const answer = op === '+' ? a + b : op === '-' ? a - b : a * b
  return { text: `${a} ${op} ${b}`, answer }
}

export default function MathGame() {
  const { saveScore } = useScore()
  const [problem, setProblem] = useState(genProblem)
  const [input, setInput] = useState('')
  const [correct, setCorrect] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const saved = useRef(false)

  const start = useCallback(() => {
    setCorrect(0)
    setTimeLeft(60)
    setPlaying(true)
    setDone(false)
    saved.current = false
    setProblem(genProblem())
    setInput('')
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
    if (done && !saved.current) { saved.current = true; saveScore('math', correct) }
  }, [done, correct, saveScore])

  const check = () => {
    if (!playing) return
    if (parseInt(input, 10) === problem.answer) {
      setCorrect((c) => c + 1)
      setProblem(genProblem())
    }
    setInput('')
  }

  return (
    <GameShell gameId="math" score={correct} status={playing ? `${timeLeft}s` : done ? 'Time\'s up!' : '60 second challenge'} onRestart={start}>
      <div className="flex flex-col items-center gap-6">
        {!playing && !done && <button onClick={start} className="btn-primary">Start</button>}
        {playing && (
          <>
            <div className="text-4xl font-bold">{problem.text} = ?</div>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && check()}
              autoFocus
              className="w-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center text-2xl focus:outline-none"
            />
          </>
        )}
        {done && <button onClick={start} className="btn-primary">Play Again</button>}
      </div>
    </GameShell>
  )
}
