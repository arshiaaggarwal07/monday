// frontend/src/components/landing/ProcrastinationGrid.tsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUpStagger, viewportOnce } from '../../utils/motionVariants'
import styles from './ProcrastinationGrid.module.css'

const ITEMS = [
  { promise: "I'll start the gym",        days: 83, color: 'green'  },
  { promise: "I'll build that project",   days: 61, color: 'orange' },
  { promise: "I'll learn a new skill",    days: 104, color: 'yellow' },
]

function ProcrastinationCard({ item, index }: { item: typeof ITEMS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className={`${styles.card} ${styles[item.color]}`}
      variants={fadeUpStagger(index * 0.12)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
    >
      <motion.div
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className={styles.face}
      >
        <p className={styles.promise}>"{item.promise}"</p>
        <span className={styles.hint}>hover to check in →</span>
      </motion.div>

      <motion.div
        className={styles.faceBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <span className={styles.clockIcon}>⏰</span>
        <p className={styles.stillWaiting}>
          Still waiting after<br />
          <strong>{item.days} days</strong>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function ProcrastinationGrid() {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.inner}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.p variants={fadeUpStagger(0)} className={styles.eyebrow}>
          A small, honest experiment
        </motion.p>
        <motion.h2 variants={fadeUpStagger(0.05)} className={styles.heading}>
          Everyone has a Monday.
        </motion.h2>

        <div className={styles.grid}>
          {ITEMS.map((item, i) => (
            <ProcrastinationCard key={item.promise} item={item} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}