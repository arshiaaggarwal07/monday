// frontend/src/components/calendar/MonthCalendar.tsx

import { useState } from 'react'
import type { Task } from '../../types'
import type { MonthCell } from '../../utils/monthGrid'
import { formatMonthLabel } from '../../utils/monthGrid'
import { getTypeColor } from '../../config/taskTypeColors'
import DatePopover from './DatePopover'
import styles from './MonthCalendar.module.css'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MAX_VISIBLE_CHIPS = 3

interface MonthCalendarProps {
  monthDate:       Date
  grid:            MonthCell[]
  loading:         boolean
  getTasksForDate: (date: Date) => Task[]
  goNext:          () => void
  goPrev:          () => void
  goToday:         () => void
  onNewTask:       (date: Date) => void
  onEditTask:      (task: Task) => void
}

export default function MonthCalendar({
  monthDate,
  grid,
  loading,
  getTasksForDate,
  goNext,
  goPrev,
  goToday,
  onNewTask,
  onEditTask,
}: MonthCalendarProps) {
  const [activePopover, setActivePopover] = useState<{
    date: Date
    position: { top: number; left: number }
  } | null>(null)

  function handleCellClick(cell: MonthCell, e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setActivePopover({
      date: cell.date,
      position: {
        top:  rect.bottom + 8,
        left: Math.min(rect.left, window.innerWidth - 320),
      },
    })
  }

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className={styles.skeletonCell} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>

      {/* Month nav */}
      <div className={styles.nav}>
        <button className={styles.navBtn} onClick={goPrev} aria-label="Previous month">‹</button>
        <h2 className={styles.monthLabel}>{formatMonthLabel(monthDate)}</h2>
        <button className={styles.navBtn} onClick={goNext} aria-label="Next month">›</button>
        <button className={styles.todayBtn} onClick={goToday}>Today</button>
      </div>

      {/* Weekday header row */}
      <div className={styles.weekHeader}>
        {WEEKDAY_LABELS.map((d, i) => (
          <span
            key={d}
            className={`${styles.weekdayLabel} ${i === 0 || i === 6 ? styles.weekendLabel : ''}`}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {grid.map(cell => {
          const tasks    = getTasksForDate(cell.date)
          const visible  = tasks.slice(0, MAX_VISIBLE_CHIPS)
          const overflow = tasks.length - visible.length
          const dayOfWeek = cell.date.getDay()   // 0 = Sun, 6 = Sat
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

          return (
            <div
              key={cell.date.toISOString()}
              className={`
                ${styles.cell}
                ${!cell.isCurrentMonth ? styles.outsideMonth : ''}
                ${cell.isToday ? styles.today : ''}
                ${isWeekend ? styles.weekend : ''}
                ${tasks.length > 0 ? styles.hasTasks : ''}
              `}
              onClick={(e) => handleCellClick(cell, e)}
            >
              <span className={styles.dateNumber}>{cell.date.getDate()}</span>
              <div className={styles.chips}>
                {visible.map(task => (
                  <span
                    key={task.id}
                    className={styles.chip}
                    style={{ background: getTypeColor(task.taskType.name) }}
                  >
                    {task.title}
                  </span>
                ))}
                {overflow > 0 && (
                  <span className={styles.overflow}>+{overflow} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {activePopover && (
        <DatePopover
          date={activePopover.date}
          tasks={getTasksForDate(activePopover.date)}
          position={activePopover.position}
          onEditTask={(task) => { onEditTask(task); setActivePopover(null) }}
          onNewTask={(date) => { onNewTask(date); setActivePopover(null) }}
          onClose={() => setActivePopover(null)}
        />
      )}
    </div>
  )
}