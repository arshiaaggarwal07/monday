// frontend/src/components/calendar/DayColumn.tsx

import { useRef, useEffect } from 'react'
import type { Task } from '../../types'
import type { CalendarDay } from '../../hooks/useCalendar'
import { formatDayLabel, isToday, isPast } from '../../utils/dates'
import TaskCard from '../tasks/TaskCard'
import styles from './DayColumn.module.css'

interface DayColumnProps {
  day:          CalendarDay
  scrollToMe?:  boolean       // true for today's column on initial load
  onNewTask:    (date: Date) => void
  onEditTask:   (task: Task)  => void
  onDeleteTask: (task: Task)  => void
  onToggleTask: (task: Task)  => void
}

export default function DayColumn({
  day,
  scrollToMe,
  onNewTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
}: DayColumnProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Scroll this column into view on mount if it's today
  useEffect(() => {
    if (scrollToMe && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [scrollToMe])

  const today    = isToday(day.date)
  const past     = isPast(day.date)
  const hasItems = day.tasks.length > 0

  return (
    <div
      ref={ref}
      className={`
        ${styles.column}
        ${today ? styles.today    : ''}
        ${past  ? styles.past     : ''}
        ${!hasItems ? styles.empty : ''}
      `}
    >
      {/* Date header */}
      <div className={styles.header}>
        <div className={styles.dateLabel}>
          {today && <span className={styles.todayPip} />}
          <span className={today ? styles.dateLabelToday : ''}>
            {formatDayLabel(day.date)}
          </span>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => onNewTask(day.date)}
          aria-label={`Add task on ${formatDayLabel(day.date)}`}
        >
          +
        </button>
      </div>

      {/* Tasks */}
      <div className={styles.tasks}>
        {day.tasks.length === 0 ? (
          <p className={styles.emptyHint}>No commitments</p>
        ) : (
          day.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  )
}