// frontend/src/components/landing/MirrorPreview.tsx

import { motion } from 'framer-motion'
import { fadeUpStagger, viewportOnce } from '../../utils/motionVariants'
import styles from './MirrorPreview.module.css'

export default function MirrorPreview() {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.inner}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.p variants={fadeUpStagger(0)} className={styles.eyebrow}>
          The Mirror
        </motion.p>
        <motion.h2 variants={fadeUpStagger(0.05)} className={styles.heading}>
          Looking at your past self<br />is uncomfortable. That's the point.
        </motion.h2>

        <div className={styles.timeline}>

          <motion.div
            className={styles.snapshot}
            variants={fadeUpStagger(0.15)}
          >
            <span className={styles.date}>You on January 5</span>
            <p className={styles.quote}>"I'll start tomorrow."</p>
          </motion.div>

          <motion.div
            className={styles.arrow}
            variants={fadeUpStagger(0.25)}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.div>

          <motion.div
            className={`${styles.snapshot} ${styles.snapshotLater}`}
            variants={fadeUpStagger(0.35)}
          >
            <span className={styles.date}>You on February 20</span>
            <p className={styles.quote}>"I'll start tomorrow."</p>
          </motion.div>

        </div>

        <motion.p variants={fadeUpStagger(0.45)} className={styles.footnote}>
          46 days. Same sentence. Monday remembers what you'd rather forget.
        </motion.p>
      </motion.div>
    </section>
  )
}