import { useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

const CHOICES = ['rock', 'paper', 'scissors'] as const
const EMOJI = { rock: '🪨', paper: '📄', scissors: '✂️' }

function winner(a: string, b: string): 'player' | 'cpu' | 'draw' {
  if (a === b) return 'draw'
  if ((a === 'rock' && b === 'scissors') || (a === 'paper' && b === 'rock') || (a === 'scissors' && b === 'paper')) return 'player'
  return 'cpu'
}

export default function RPSGame() {
  const { saveScore, getBest } = useScore()
  const [playerWins, setPlayerWins] = useState(getBest('rps'))
  const [round, setRound] = useState(0)
  const [playerChoice, setPlayerChoice] = useState<string | null>(null)
  const [cpuChoice, setCpuChoice] = useState<string | null>(null)
  const [result, setResult] = useState('')

  const play = (choice: string) => {
    const cpu = CHOICES[Math.floor(Math.random() * 3)]
    setPlayerChoice(choice)
    setCpuChoice(cpu)
    const w = winner(choice, cpu)
    if (w === 'player') {
      const nw = playerWins + 1
      setPlayerWins(nw)
      saveScore('rps', nw)
      setResult('You win this round!')
    } else if (w === 'cpu') setResult('Computer wins!')
    else setResult('Draw!')
    setRound((r) => r + 1)
  }

  return (
    <GameShell gameId="rps" score={playerWins} status={result || 'Pick your move'} onRestart={() => { setPlayerChoice(null); setCpuChoice(null); setResult('') }}>
      <div className="flex justify-center gap-8 mb-6 text-5xl min-h-[60px]">
        <span>{playerChoice ? EMOJI[playerChoice as keyof typeof EMOJI] : '❓'}</span>
        <span className="text-white/30">vs</span>
        <span>{cpuChoice ? EMOJI[cpuChoice as keyof typeof EMOJI] : '❓'}</span>
      </div>
      <div className="flex justify-center gap-4">
        {CHOICES.map((c) => (
          <button key={c} onClick={() => play(c)} className="btn-secondary text-3xl p-4">
            {EMOJI[c]}
          </button>
        ))}
      </div>
      <p className="text-center text-white/40 mt-4 text-sm">Rounds played: {round}</p>
    </GameShell>
  )
}
