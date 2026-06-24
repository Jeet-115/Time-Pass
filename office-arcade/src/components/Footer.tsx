import { motion } from 'framer-motion'

const GITHUB_URL = 'https://github.com/Jeet-115'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white/50"
        >
          Created by{' '}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-400 hover:text-fuchsia-400 transition-colors underline-offset-4 hover:underline"
          >
            Jeet Mistry
          </a>
        </motion.p>
      </div>
    </footer>
  )
}
