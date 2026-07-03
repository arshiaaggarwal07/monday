// frontend/src/components/landing/SocialProof.tsx

import { motion } from 'framer-motion'
import { fadeUpStagger, viewportOnce } from '../../utils/motionVariants'
import styles from './SocialProof.module.css'

const POSTPONED = [
  { label: 'DSA',         emoji: '📚' },
  { label: 'Gym',         emoji: '🏋️' },
  { label: 'Portfolio',   emoji: '💻' },
  { label: 'Reading',     emoji: '📖' },
  { label: 'Side project',emoji: '🚀' },
  { label: 'Journaling',  emoji: '✍️' },
]

export default function SocialProof() {
  return (
    <section id="stories" className={styles.section}>
      <motion.div
        className={styles.inner}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.p variants={fadeUpStagger(0)} className={styles.eyebrow}>
          Sound familiar?
        </motion.p>
        <motion.h2 variants={fadeUpStagger(0.05)} className={styles.heading}>
          Things people keep postponing.
        </motion.h2>

        <div className={styles.tags}>
          {POSTPONED.map((item, i) => (
            <motion.span
              key={item.label}
              className={styles.tag}
              variants={fadeUpStagger(0.1 + i * 0.06)}
              whileHover={{ scale: 1.06, rotate: i % 2 === 0 ? -2 : 2 }}
            >
              <span className={styles.emoji}>{item.emoji}</span>
              {item.label}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}