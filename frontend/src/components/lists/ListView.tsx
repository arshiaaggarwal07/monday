// frontend/src/components/lists/ListView.tsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Task } from '../../types'
import { taskApi } from '../../api/tasks'
import { useToast } from '../../contexts/ToastContext'
import { getTypeColor } from '../../config/taskTypeColors'
import { fadeUpStagger, viewportOnce } from '../../utils/motionVariants'
import styles from './ListView.module.css'

const REPEAT_LABELS: Record<string, string> = {
  NEVER: '', DAILY: 'Daily', WEEKDAYS: 'Weekdays', WEEKENDS: 'Weekends',
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed',
  THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
  CUSTOM: 'Custom',
}

interface ListViewProps {
  tasks:        Task[]
  loading:      boolean
  listLabel:    string
  taskTypeName: string | null
  onEditTask:   (task: Task) => void
  onTaskToggled:(task: Task) => void
  onTaskDeleted:(task: Task) => void
  onNewTask:    () => void
}

export default function ListView({
  tasks,
  loading,
  listLabel,
  taskTypeName,
  onEditTask,
  onTaskToggled,
  onTaskDeleted,
  onNewTask,
}: ListViewProps) {
  const toast = useToast()
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleToggle(task: Task) {
    setTogglingId(task.id)
    try {
      const updated = await taskApi.toggleComplete(task.id)
      onTaskToggled(updated)
      toast(updated.completed ? 'Marked complete' : 'Marked incomplete')
    } catch {
      toast('Failed to update task', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(task: Task) {
    setDeletingId(task.id)
    try {
      await taskApi.deleteTask(task.id)
      onTaskDeleted(task)
      toast('Task deleted')
    } catch {
      toast('Failed to delete task', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const pending   = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t =>  t.completed)

  if (loading) {
    return (
      <div className={styles.wrapper}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow} />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span
            className={styles.colorDot}
            style={{ background: getTypeColor(taskTypeName ?? '') }}
          />
          <h2 className={styles.title}>{listLabel}</h2>
          <span className={styles.count}>{pending.length} active</span>
        </div>
        <button className={styles.newBtn} onClick={onNewTask}>
          + New Task
        </button>
      </div>

      {/* Empty state */}
      {tasks.length === 0 && (
        <motion.div
          className={styles.empty}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={styles.emptyIcon}>✦</span>
          <p className={styles.emptyTitle}>No commitments yet</p>
          <p className={styles.emptyDesc}>
            Everything in "{listLabel}" will appear here.
          </p>
        </motion.div>
      )}

      {/* Active tasks */}
      {pending.length > 0 && (
        <motion.div
          className={styles.section}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          <AnimatePresence>
            {pending.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                togglingId={togglingId}
                deletingId={deletingId}
                onToggle={handleToggle}
                onEdit={onEditTask}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Completed tasks */}
      {completed.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Completed</p>
          <AnimatePresence>
            {completed.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                togglingId={togglingId}
                deletingId={deletingId}
                onToggle={handleToggle}
                onEdit={onEditTask}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// ── TaskRow sub-component ─────────────────────────────────────────────────────

interface TaskRowProps {
  task:       Task
  togglingId: string | null
  deletingId: string | null
  onToggle:   (task: Task) => void
  onEdit:     (task: Task) => void
  onDelete:   (task: Task) => void
}

function TaskRow({ task, togglingId, deletingId, onToggle, onEdit, onDelete }: TaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : '—'

  const repeatLabel = REPEAT_LABELS[task.repeatType] || ''

  return (
    <motion.div
      className={`${styles.row} ${task.completed ? styles.rowCompleted : ''}`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25 }}
    >
      {/* Checkbox */}
      <button
        className={`${styles.check} ${task.completed ? styles.checkDone : ''}`}
        onClick={() => onToggle(task)}
        disabled={togglingId === task.id}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && <span className={styles.checkMark}>✓</span>}
      </button>

      {/* Title */}
      <span
        className={styles.taskTitle}
        onClick={() => onEdit(task)}
      >
        {task.title}
      </span>

      {/* Category badge */}
      <span
        className={styles.badge}
        style={{ background: getTypeColor(task.taskType.name) }}
      >
        {task.taskType.name}
      </span>

      {/* Due date */}
      <span className={styles.dueDate}>{dueLabel}</span>

      {/* Repeat */}
      {repeatLabel && (
        <span className={styles.repeat}>↻ {repeatLabel}</span>
      )}

      {/* Reminder dot */}
      {task.reminderEnabled && (
        <span className={styles.reminderDot} title="Reminder on" />
      )}

      {/* Context menu */}
      <div className={styles.menuWrapper}>
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Task options"
        >
          ···
        </button>
        {menuOpen && (
          <>
            <div
              className={styles.menuOverlay}
              onClick={() => setMenuOpen(false)}
            />
            <div className={styles.menu}>
              <button
                className={styles.menuItem}
                onClick={() => { setMenuOpen(false); onEdit(task) }}
              >
                Edit
              </button>
              <button
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
                onClick={() => { setMenuOpen(false); onDelete(task) }}
                disabled={deletingId === task.id}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}