// frontend/src/components/landing/Navbar.tsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

const LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features',     href: '#features'     },
  { label: 'Stories',      href: '#stories'      },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.inner}>

        <a href="#top" className={styles.logo}>
          <span className={styles.logoIcon}>👋</span>
          Monday
        </a>

        <div className={styles.links}>
          {LINKS.map(link => (
            <a key={link.href} href={link.href} className={styles.link}>
              {link.label}
              <span className={styles.linkUnderline} />
            </a>
          ))}
        </div>

        <motion.button
          className={styles.signIn}
          onClick={() => navigate('/auth')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Sign in
        </motion.button>

      </div>
    </motion.nav>
  )
}