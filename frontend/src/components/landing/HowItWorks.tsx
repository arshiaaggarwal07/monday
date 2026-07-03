// frontend/src/components/landing/HowItWorks.tsx

import { motion } from 'framer-motion'
import { fadeUpStagger, viewportOnce } from '../../utils/motionVariants'
import styles from './HowItWorks.module.css'

const STEPS = [
  {
    number: '01',
    icon:   '🤝',
    title:  'Make a promise',
    quote:  "I'll start this.",
    color:  'green',
  },
  {
    number: '02',
    icon:   '⏱️',
    title:  'Make a deal',
    quote:  'Just 5 minutes today.',
    color:  'orange',
  },
  {
    number: '03',
    icon:   '🪞',
    title:  'Meet yourself',
    quote:  'See your patterns.',
    color:  'yellow',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <motion.div
        className={styles.inner}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.p variants={fadeUpStagger(0)} className={styles.eyebrow}>
          How it works
        </motion.p>
        <motion.h2 variants={fadeUpStagger(0.05)} className={styles.heading}>
          Three small shifts.
        </motion.h2>

        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className={`${styles.card} ${styles[step.color]}`}
              variants={fadeUpStagger(0.1 + i * 0.12)}
              whileHover={{ y: -8, rotate: i % 2 === 0 ? -1 : 1 }}
            >
              <span className={styles.number}>{step.number}</span>
              <span className={styles.icon}>{step.icon}</span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.quote}>"{step.quote}"</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}