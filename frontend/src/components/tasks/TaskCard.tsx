// frontend/src/components/tasks/TaskCard.tsx

import { useState } from 'react'
import type { Task } from '../../types'
import { taskApi } from '../../api/tasks'
import styles from './TaskCard.module.css'

interface TaskCardProps {
  task:     Task
  onToggle: (task: Task) => void
  onEdit:   (task: Task) => void
  onDelete: (task: Task) => void
}

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [toggling, setToggling] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    if (toggling) return
    setToggling(true)
    try {
      const updated = await taskApi.toggleComplete(task.id)
      onToggle(updated)
    } catch (err) {
      console.error('Toggle error:', err)
    } finally {
      setToggling(false)
    }
  }

  return (
    <div
      className={`${styles.card} ${task.completed ? styles.completed : ''}`}
      onClick={() => onEdit(task)}
    >
      {/* Completion checkbox */}
      <button
        className={`${styles.check} ${task.completed ? styles.checkDone : ''}`}
        onClick={handleToggle}
        disabled={toggling}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed ? '✓' : ''}
      </button>

      {/* Task content */}
      <div className={styles.content}>
        <span className={styles.title}>{task.title}</span>
        <div className={styles.meta}>
          <span className={styles.type}>{task.taskType.name}</span>
          {task.reminderEnabled && (
            <span className={styles.reminderDot} title="Reminder on" />
          )}
          {task.repeatType !== 'NEVER' && (
            <span className={styles.repeat}>↻</span>
          )}
        </div>
      </div>

      {/* Context menu */}
      <div className={styles.menuWrapper}>
        <button
          className={styles.menuBtn}
          onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
          aria-label="Task options"
        >
          ···
        </button>
        {menuOpen && (
          <>
            {/* Click outside to close */}
            <div
              className={styles.menuOverlay}
              onClick={e => { e.stopPropagation(); setMenuOpen(false) }}
            />
            <div className={styles.menu}>
              <button
                className={styles.menuItem}
                onClick={e => { e.stopPropagation(); setMenuOpen(false); onEdit(task) }}
              >
                Edit
              </button>
              <button
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
                onClick={e => { e.stopPropagation(); setMenuOpen(false); onDelete(task) }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}