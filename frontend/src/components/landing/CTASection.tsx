// frontend/src/components/landing/CTASection.tsx

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { fadeUpStagger, viewportOnce } from '../../utils/motionVariants'
import styles from './CTASection.module.css'

export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.inner}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.h2 variants={fadeUpStagger(0)} className={styles.heading}>
          Stop waiting for the<br />perfect Monday.
        </motion.h2>

        <motion.div variants={fadeUpStagger(0.15)}>
          <motion.button
            className={styles.button}
            onClick={() => navigate('/auth')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Start today
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}