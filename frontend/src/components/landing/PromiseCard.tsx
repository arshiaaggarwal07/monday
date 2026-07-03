// frontend/src/components/landing/PromiseCard.tsx

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import styles from './PromiseCard.module.css'

const EXCUSES = [
  'waiting for the right time',
  'need a better roadmap',
  'too busy this week',
]

export default function PromiseCard() {
  const [excuseIndex, setExcuseIndex] = useState(0)
  const [daysDelayed, setDaysDelayed] = useState(47)

  // Cycle excuses, and let the delay counter creep up — a little dark joke
  useEffect(() => {
    const excuseTimer = setInterval(() => {
      setExcuseIndex(prev => (prev + 1) % EXCUSES.length)
    }, 2200)
    return () => clearInterval(excuseTimer)
  }, [])

  useEffect(() => {
    const dayTimer = setInterval(() => {
      setDaysDelayed(prev => prev + 1)
    }, 4000)
    return () => clearInterval(dayTimer)
  }, [])

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      animate={{
        opacity: 1, y: 0, rotate: -2,
      }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, y: -4 }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={styles.header}>
          <span className={styles.label}>Your promise</span>
          <span className={styles.statusDot} />
        </div>

        <h3 className={styles.promiseText}>"Learn React"</h3>

        <div className={styles.delayRow}>
          <span className={styles.delayIcon}>⏳</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={daysDelayed}
              className={styles.delayText}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              Delayed {daysDelayed} days
            </motion.span>
          </AnimatePresence>
        </div>

        <div className={styles.divider} />

        <p className={styles.excusesLabel}>Excuses collected</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={excuseIndex}
            className={styles.excuse}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.3 }}
          >
            "{EXCUSES[excuseIndex]}"
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Small floating badge, offset behind the card */}
      <motion.div
        className={styles.badge}
        animate={{ rotate: [0, 4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        Sound familiar?
      </motion.div>
    </motion.div>
  )
}