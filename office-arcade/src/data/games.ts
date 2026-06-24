import type { GameMeta } from '../types'

export const GAMES: GameMeta[] = [
  { id: 'memory', title: 'Memory Match', description: 'Flip cards and find matching pairs.', emoji: '🃏', category: 'puzzle', scoreDirection: 'lower', scoreLabel: 'Moves' },
  { id: 'snake', title: 'Snake', description: 'Eat food, grow longer, don\'t crash!', emoji: '🐍', category: 'arcade', scoreDirection: 'higher', scoreLabel: 'Points' },
  { id: 'whack', title: 'Whack-a-Mole', description: 'Smash moles before they hide!', emoji: '🔨', category: 'reflex', scoreDirection: 'higher', scoreLabel: 'Hits' },
  { id: 'tictactoe', title: 'Tic Tac Toe', description: 'Beat the computer in X vs O.', emoji: '⭕', category: 'classic', scoreDirection: 'higher', scoreLabel: 'Wins' },
  { id: 'reaction', title: 'Reaction Time', description: 'Click when the screen turns green!', emoji: '⚡', category: 'reflex', scoreDirection: 'lower', scoreLabel: 'ms (best)' },
  { id: 'simon', title: 'Simon Says', description: 'Repeat the color sequence.', emoji: '🎨', category: 'brain', scoreDirection: 'higher', scoreLabel: 'Level' },
  { id: 'breakout', title: 'Breakout', description: 'Break all bricks with your paddle.', emoji: '🧱', category: 'arcade', scoreDirection: 'higher', scoreLabel: 'Score' },
  { id: 'hangman', title: 'Hangman', description: 'Guess the hidden word letter by letter.', emoji: '🪢', category: 'brain', scoreDirection: 'higher', scoreLabel: 'Wins' },
  { id: 'rps', title: 'Rock Paper Scissors', description: 'Best of 5 against the computer.', emoji: '✊', category: 'classic', scoreDirection: 'higher', scoreLabel: 'Wins' },
  { id: 'guess', title: 'Guess the Number', description: 'Find the secret number 1–100.', emoji: '🔢', category: 'brain', scoreDirection: 'lower', scoreLabel: 'Guesses' },
  { id: 'math', title: 'Math Blitz', description: 'Solve as many problems in 60 seconds.', emoji: '🧮', category: 'brain', scoreDirection: 'higher', scoreLabel: 'Correct' },
  { id: 'slide', title: 'Sliding Puzzle', description: 'Slide tiles into the correct order.', emoji: '🧩', category: 'puzzle', scoreDirection: 'lower', scoreLabel: 'Moves' },
  { id: 'pong', title: 'Pong', description: 'Classic paddle vs AI — first to 5 wins.', emoji: '🏓', category: 'arcade', scoreDirection: 'higher', scoreLabel: 'Wins' },
  { id: 'scramble', title: 'Word Scramble', description: 'Unscramble words before time runs out.', emoji: '🔤', category: 'brain', scoreDirection: 'higher', scoreLabel: 'Words' },
  { id: 'colortap', title: 'Color Tap', description: 'Tap the tile matching the word color.', emoji: '🎯', category: 'reflex', scoreDirection: 'higher', scoreLabel: 'Score' },
  { id: 'minesweeper', title: 'Minesweeper', description: 'Clear the board without hitting mines.', emoji: '💣', category: 'puzzle', scoreDirection: 'higher', scoreLabel: 'Wins' },
  { id: 'typing', title: 'Typing Sprint', description: 'Type words as fast as you can!', emoji: '⌨️', category: 'reflex', scoreDirection: 'higher', scoreLabel: 'WPM' },
  { id: 'clicker', title: 'Click Frenzy', description: 'Click as many times in 10 seconds!', emoji: '👆', category: 'reflex', scoreDirection: 'higher', scoreLabel: 'Clicks' },
  { id: 'flappy', title: 'Flappy Jump', description: 'Tap to fly through the gaps!', emoji: '🐦', category: 'arcade', scoreDirection: 'higher', scoreLabel: 'Pipes' },
  { id: 'connect4', title: 'Connect Four', description: 'Drop discs — connect 4 to win!', emoji: '🔴', category: 'classic', scoreDirection: 'higher', scoreLabel: 'Wins' },
]

export const CATEGORIES = [
  { id: 'all', label: 'All Games', emoji: '🎮' },
  { id: 'arcade', label: 'Arcade', emoji: '👾' },
  { id: 'puzzle', label: 'Puzzle', emoji: '🧩' },
  { id: 'reflex', label: 'Reflex', emoji: '⚡' },
  { id: 'brain', label: 'Brain', emoji: '🧠' },
  { id: 'classic', label: 'Classic', emoji: '🏆' },
] as const
