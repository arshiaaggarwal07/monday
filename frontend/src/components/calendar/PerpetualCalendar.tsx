// frontend/src/components/calendar/PerpetualCalendar.tsx

import { useRef, useEffect, useCallback } from 'react'
import type { Task } from '../../types'
import type { CalendarDay } from '../../hooks/useCalendar'
import { isToday } from '../../utils/dates'
import DayColumn from './DayColumn'
import styles from './PerpetualCalendar.module.css'

interface PerpetualCalendarProps {
  days:         CalendarDay[]
  loading:      boolean
  fetchingMore: boolean
  onLoadFuture: () => void
  onLoadPast:   () => void
  onNewTask:    (date?: Date) => void
  onEditTask:   (task: Task)  => void
  onDeleteTask: (task: Task)  => void
  onToggleTask: (task: Task)  => void
}

export default function PerpetualCalendar({
  days,
  loading,
  fetchingMore,
  onLoadFuture,
  onLoadPast,
  onNewTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
}: PerpetualCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Infinite scroll detection ─────────────────────────────────────────────

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el || fetchingMore) return

    const { scrollTop, scrollHeight, clientHeight } = el

    // Near bottom — load future dates
    if (scrollHeight - scrollTop - clientHeight < 300) {
      onLoadFuture()
    }

    // Near top — load past dates
    if (scrollTop < 200) {
      onLoadPast()
    }
  }, [fetchingMore, onLoadFuture, onLoadPast])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className={styles.loadingState}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonDate} />
            <div className={styles.skeletonTask} />
            {i % 2 === 0 && <div className={styles.skeletonTask} style={{ width: '60%' }} />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={styles.container}>

      {/* Top sentinel — visual indicator when loading past */}
      {fetchingMore && (
        <div className={styles.fetchingIndicator}>
          <span className={styles.fetchingDot} />
          <span className={styles.fetchingDot} style={{ animationDelay: '0.15s' }} />
          <span className={styles.fetchingDot} style={{ animationDelay: '0.30s' }} />
        </div>
      )}

      {/* Calendar days */}
      {days.map(day => (
        <DayColumn
          key={day.date.toISOString()}
          day={day}
          scrollToMe={isToday(day.date)}
          onNewTask={onNewTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onToggleTask={onToggleTask}
        />
      ))}

      {/* Bottom sentinel */}
      {fetchingMore && (
        <div className={styles.fetchingIndicator}>
          <span className={styles.fetchingDot} />
          <span className={styles.fetchingDot} style={{ animationDelay: '0.15s' }} />
          <span className={styles.fetchingDot} style={{ animationDelay: '0.30s' }} />
        </div>
      )}

    </div>
  )
}