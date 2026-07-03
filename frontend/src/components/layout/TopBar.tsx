// frontend/src/components/layout/TopBar.tsx

import { useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import styles from './TopBar.module.css'

interface TopBarProps {
  onNewTask:    () => void
  onMenuToggle: () => void
}

function usePageTitle(): string {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const view = params.get('view')
  const list = params.get('list')

  if (view === 'calendar')  return 'Calendar'
  if (view === 'upcoming')  return 'Upcoming'
  if (view === 'today')     return 'Due Today'
  if (view === 'settings')  return 'Settings'
  if (list) return list.charAt(0).toUpperCase() + list.slice(1)
  return 'Dashboard'
}

export default function TopBar({ onNewTask, onMenuToggle }: TopBarProps) {
  const title = usePageTitle()

  return (
    <header className={styles.topBar}>
      {/* Hamburger — mobile only */}
      <button
        className={styles.menuBtn}
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        ☰
      </button>

      <h1 className={styles.title}>{title}</h1>

      <div className={styles.actions}>
        <Button size="sm" onClick={onNewTask}>
          New Task +
        </Button>
      </div>
    </header>
  )
}