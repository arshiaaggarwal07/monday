// frontend/src/components/calendar/DatePopover.tsx

import { useEffect, useRef } from 'react'
import type { Task } from '../../types'
import { getTypeColor } from '../../config/taskTypeColors'
import styles from './DatePopover.module.css'

interface DatePopoverProps {
  date:       Date
  tasks:      Task[]
  position:   { top: number; left: number }
  onEditTask: (task: Task) => void
  onNewTask:  (date: Date) => void
  onClose:    () => void
}

export default function DatePopover({
  date,
  tasks,
  position,
  onEditTask,
  onNewTask,
  onClose,
}: DatePopoverProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div
      ref={ref}
      className={styles.popover}
      style={{ top: position.top, left: position.left }}
    >
      <div className={styles.header}>
        <span className={styles.dateLabel}>{dateLabel}</span>
        <button
          className={styles.addBtn}
          onClick={() => onNewTask(date)}
          aria-label="Add task"
        >
          +
        </button>
      </div>

      <div className={styles.list}>
        {tasks.length === 0 ? (
          <p className={styles.empty}>No commitments this day</p>
        ) : (
          tasks.map(task => (
            <button
              key={task.id}
              className={styles.taskRow}
              onClick={() => onEditTask(task)}
            >
              <span
                className={styles.dot}
                style={{ background: getTypeColor(task.taskType.name) }}
              />
              <span className={styles.taskTitle}>{task.title}</span>
              {task.dueDate && (
                <span className={styles.time}>
                  {new Date(task.dueDate).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: '2-digit',
                  })}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}