// frontend/src/components/landing/Footer.tsx

import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        <div className={styles.left}>
          <span className={styles.logo}>Monday</span>
          <p className={styles.copy}>
            Built for people who keep saying Monday.
          </p>
        </div>

        <p className={styles.legal}>
          © {new Date().getFullYear()} Monday. Show up.
        </p>

      </div>
    </footer>
  )
}