import { useCallback, useEffect, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const WORDS = ['PYTHON', 'REACT', 'CODING', 'OFFICE', 'ARCADE', 'PUZZLE', 'BRAIN', 'MOUSE', 'KEYBOARD', 'COFFEE', 'LUNCH', 'MEETING', 'EMAIL', 'DESIGN', 'MUSIC']

export default function HangmanGame() {
  const { saveScore, getBest } = useScore()
  const [word, setWord] = useState('')
  const [guessed, setGuessed] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState(0)
  const [wins, setWins] = useState(getBest('hangman'))

  const newGame = useCallback(() => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)])
    setGuessed(new Set())
    setWrong(0)
  }, [])

  useEffect(() => { newGame() }, [newGame])

  const guess = (letter: string) => {
    if (guessed.has(letter) || wrong >= 6) return
    const next = new Set(guessed)
    next.add(letter)
    setGuessed(next)
    if (!word.includes(letter)) {
      const w = wrong + 1
      setWrong(w)
      if (w >= 6) return
    }
    if (word.split('').every((l) => next.has(l))) {
      setWins((w) => { saveScore('hangman', w + 1); return w + 1 })
    }
  }

  const lost = wrong >= 6
  const won = word && word.split('').every((l) => guessed.has(l))

  return (
    <GameShell gameId="hangman" score={wins} status={lost ? 'You lost!' : won ? 'Correct!' : `${6 - wrong} lives left`} onRestart={newGame}>
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{['😊', '😐', '😟', '😰', '😱', '💀', '☠️'][wrong]}</div>
        <div className="text-3xl font-mono tracking-widest">
          {word.split('').map((l, i) => (
            <span key={i} className="mx-1">{guessed.has(l) || lost ? l : '_'}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => (
          <button
            key={l}
            onClick={() => guess(l)}
            disabled={guessed.has(l) || lost || !!won}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-30 text-sm font-medium"
          >
            {l}
          </button>
        ))}
      </div>
    </GameShell>
  )
}
