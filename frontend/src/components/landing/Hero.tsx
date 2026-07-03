// frontend/src/components/landing/Hero.tsx

import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWordCycle } from '../../hooks/useWordCycle'
import PromiseCard from './PromiseCard'
import styles from './Hero.module.css'

const CYCLE_WORDS = ['Monday.', 'Tomorrow.', 'Next week.', 'Someday.']

export default function Hero() {
  const navigate = useNavigate()
  const word = useWordCycle(CYCLE_WORDS, 1500)

  // frontend/src/components/landing/Hero.tsx
// Only the JSX changes — imports and logic stay identical

return (
  <section id="top" className={styles.hero}>
    <div className={styles.inner}>

      <motion.div
        className={styles.left}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Eyebrow pill — new */}
        <div className={styles.eyebrow}>
          ✦ Stop negotiating with your future self
        </div>

        <h1 className={styles.headline}>
          That thing you said<br />
          you'd start on{' '}
          <span className={styles.wordSlot}>
            <AnimatePresence mode="wait">
              <motion.span
                key={word}
                className={styles.cyclingWord}
                initial={{ opacity: 0, y: 16, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -16, rotate: 3 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <p className={styles.subheadline}>
          Monday helps you stop negotiating with your future self.
        </p>

        <div className={styles.actions}>
          <motion.button
            className={styles.primaryBtn}
            onClick={() => navigate('/auth')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Start showing up →
          </motion.button>
          <a href="#how-it-works" className={styles.secondaryBtn}>
            See how it works ↓
          </a>
        </div>
      </motion.div>

      <motion.div
        className={styles.right}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <PromiseCard />
      </motion.div>

    </div>
  </section>
)
}