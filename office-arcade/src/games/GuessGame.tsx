import { useCallback, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

export default function GuessGame() {
  const { saveScore } = useScore()
  const [target, setTarget] = useState(0)
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState(0)
  const [hint, setHint] = useState('Guess a number 1–100')
  const [won, setWon] = useState(false)
  const [started, setStarted] = useState(false)

  const start = useCallback(() => {
    setTarget(Math.floor(Math.random() * 100) + 1)
    setGuess('')
    setGuesses(0)
    setHint('Guess a number 1–100')
    setWon(false)
    setStarted(true)
  }, [])

  const submit = () => {
    const n = parseInt(guess, 10)
    if (isNaN(n) || n < 1 || n > 100) return
    const g = guesses + 1
    setGuesses(g)
    if (n === target) {
      setWon(true)
      setHint(`Correct in ${g} guesses! 🎉`)
      saveScore('guess', g)
    } else if (n < target) setHint('Higher! ↑')
    else setHint('Lower! ↓')
    setGuess('')
  }

  return (
    <GameShell gameId="guess" score={won ? guesses : guesses || '—'} status={hint} onRestart={start}>
      <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
        {!started && <button onClick={start} className="btn-primary">New Game</button>}
        {started && !won && (
          <>
            <input
              type="number"
              min={1}
              max={100}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center text-2xl focus:outline-none focus:border-violet-500/50"
              placeholder="?"
            />
            <button onClick={submit} className="btn-primary w-full">Guess</button>
            <p className="text-white/40">Guesses: {guesses}</p>
          </>
        )}
        {won && <button onClick={start} className="btn-primary">Play Again</button>}
      </div>
    </GameShell>
  )
}
