import { useCallback, useRef, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { useScore } from '../hooks/useScore'

type Phase = 'idle' | 'waiting' | 'ready' | 'clicked' | 'early'

export default function ReactionGame() {
  const { saveScore, getBest } = useScore()
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<number | null>(null)
  const [best, setBest] = useState(getBest('reaction') || Infinity)
  const startRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const start = useCallback(() => {
    setPhase('waiting')
    setResult(null)
    const delay = 1500 + Math.random() * 3000
    timeoutRef.current = setTimeout(() => {
      startRef.current = performance.now()
      setPhase('ready')
    }, delay)
  }, [])

  const click = () => {
    if (phase === 'waiting') {
      clearTimeout(timeoutRef.current)
      setPhase('early')
      return
    }
    if (phase === 'ready') {
      const ms = Math.round(performance.now() - startRef.current)
      setResult(ms)
      setPhase('clicked')
      if (ms < best) {
        setBest(ms)
        saveScore('reaction', ms)
      }
    }
    if (phase === 'idle' || phase === 'early' || phase === 'clicked') start()
  }

  const colors: Record<Phase, string> = {
    idle: 'bg-white/10',
    waiting: 'bg-red-500/80',
    ready: 'bg-emerald-500/80',
    clicked: 'bg-violet-500/80',
    early: 'bg-orange-500/80',
  }

  const messages: Record<Phase, string> = {
    idle: 'Click to start',
    waiting: 'Wait for green...',
    ready: 'CLICK NOW!',
    clicked: result !== null ? `${result} ms` : '',
    early: 'Too early! Click to retry',
  }

  return (
    <GameShell
      gameId="reaction"
      score={best < Infinity ? best : '—'}
      status={result !== null ? `Last: ${result}ms` : 'Lower is better'}
      onRestart={start}
    >
      <button
        onClick={click}
        className={`w-full h-64 rounded-2xl text-2xl font-bold transition-colors ${colors[phase]}`}
      >
        {messages[phase]}
      </button>
    </GameShell>
  )
}
