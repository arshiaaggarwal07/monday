// frontend/src/pages/Auth.tsx

import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './Auth.module.css'

type Mode = 'login' | 'register'

const QUOTES = [
  { text: "The best time to start was Monday. The second best time is now.", author: "Monday" },
  { text: "You don't need more motivation. You need fewer excuses.", author: "Monday" },
  { text: "Your future self is watching. Show up for them.", author: "Monday" },
]

export default function Auth() {
  const [mode, setMode]         = useState<Mode>('login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  // Cycle quotes on the left panel
  useEffect(() => {
    const t = setInterval(() => {
      setQuoteIndex(i => (i + 1) % QUOTES.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      navigate('/dashboard')
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Left panel ── */}
      <div className={styles.left}>
        {/* Decorative blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />

        <div className={styles.leftContent}>
          <a href="/" className={styles.brandMark}>
            <span className={styles.brandIcon}>👋</span>
            Monday
          </a>

          <div className={styles.quoteBlock}>
            <div className={styles.quoteMark}>"</div>
            <p className={styles.quoteText}>{QUOTES[quoteIndex].text}</p>
            <span className={styles.quoteAuthor}>— {QUOTES[quoteIndex].author}</span>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>∞</span>
              <span className={styles.statLabel}>Commitments tracked</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>More excuses needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className={styles.right}>
        <div className={styles.card}>

          <div className={styles.cardHeader}>
            <h1 className={styles.cardTitle}>
              {mode === 'login' ? 'Welcome back.' : 'Start showing up.'}
            </h1>
            <p className={styles.cardSub}>
              {mode === 'login'
                ? 'Sign in to your commitments.'
                : 'Create your account in seconds.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className={styles.tabs}>
            <button
              className={mode === 'login' ? styles.activeTab : styles.tab}
              onClick={() => { setMode('login'); setError('') }}
            >
              Sign In
            </button>
            <button
              className={mode === 'register' ? styles.activeTab : styles.tab}
              onClick={() => { setMode('register'); setError('') }}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {mode === 'register' && (
              <div className={styles.field}>
                <label htmlFor="name">Your name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Arshia"
                  required
                />
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading
                ? 'Please wait...'
                : mode === 'login' ? 'Sign in →' : 'Create account →'}
            </button>
          </form>

          <p className={styles.switchHint}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className={styles.switchBtn}
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}