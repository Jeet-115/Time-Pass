# Office Arcade 🎮

A beautiful mini-games website with **20 games**, scoring, and local leaderboards — perfect for beating office boredom!

Built with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion** (inspired by your Resources bookmarks: Motion, Magic UI, shadcn-style design).

## Games Included

| Game | Type | Score |
|------|------|-------|
| Memory Match | Puzzle | Fewest moves |
| Snake | Arcade | Points |
| Whack-a-Mole | Reflex | Hits in 30s |
| Tic Tac Toe | Classic | Wins vs CPU |
| Reaction Time | Reflex | Fastest ms |
| Simon Says | Brain | Levels cleared |
| Breakout | Arcade | Brick score |
| Hangman | Brain | Words guessed |
| Rock Paper Scissors | Classic | Round wins |
| Guess the Number | Brain | Fewest guesses |
| Math Blitz | Brain | Correct in 60s |
| Sliding Puzzle | Puzzle | Fewest moves |
| Pong | Arcade | Match wins |
| Word Scramble | Brain | Words in 60s |
| Color Tap | Reflex | Stroop score |
| Minesweeper | Puzzle | Games won |
| Typing Sprint | Reflex | WPM |
| Click Frenzy | Reflex | Clicks in 10s |
| Flappy Jump | Arcade | Pipes passed |
| Connect Four | Classic | Wins vs CPU |

## Quick Start

```bash
cd office-arcade
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Production Build

```bash
npm run build
npm run preview
```

The built site is in `dist/` — deploy to Netlify, Vercel, GitHub Pages, or any static host.

### Deploy on Vercel

**Option A — deploy the whole repo (recommended):** Import the GitHub repo on [Vercel](https://vercel.com). The root `vercel.json` is already configured to build `office-arcade/`.

**Option B — subdirectory only:** Set **Root Directory** to `office-arcade` in Vercel project settings. The `office-arcade/vercel.json` handles SPA routing.

Both options include rewrites so game routes like `/play/snake` work on refresh.

## Features

- 🎯 **20 mini games** across puzzle, arcade, reflex, brain, and classic categories
- 🏆 **Local scoring** — best scores saved in browser (localStorage)
- 🔍 **Search & filter** games by category
- ✨ **Smooth animations** with Framer Motion
- 📱 **Responsive** — works on desktop and mobile
- 🌙 **Dark theme** with glassmorphism UI

Made with love for your sister! 💜
