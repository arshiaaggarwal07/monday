// frontend/src/hooks/useCalendar.ts

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Task } from '../types'
import { taskApi } from '../api/tasks'
import {
  addDays,
  generateDateRange,
  toISODate,
  isSameDay,
} from '../utils/dates'

// How many days to render in the visible window at once
const WINDOW_SIZE    = 21
// How many days before today to start the window
const DAYS_BEFORE    = 7
// When the user scrolls within this many days of the edge, load more
const FETCH_THRESHOLD = 5

export interface CalendarDay {
  date:  Date
  tasks: Task[]
}

export function useCalendar() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // The start of our current rendered window
  const [windowStart, setWindowStart] = useState<Date>(
    addDays(today, -DAYS_BEFORE)
  )

  // All tasks fetched so far, keyed by ISO date string for O(1) lookup
  const [taskMap, setTaskMap] = useState<Record<string, Task[]>>({})

  const [loading,      setLoading]      = useState(true)
  const [fetchingMore, setFetchingMore] = useState(false)

  // Track which date ranges we've already fetched to avoid duplicate requests
  const fetchedRanges = useRef<Set<string>>(new Set())

  // Build the array of CalendarDay objects from the current window
  const dates = generateDateRange(windowStart, WINDOW_SIZE)

  const days: CalendarDay[] = dates.map(date => ({
    date,
    tasks: taskMap[toISODate(date)] ?? [],
  }))

  // ── Fetch tasks for a date range ─────────────────────────────────────────

  const fetchRange = useCallback(async (start: Date, end: Date) => {
    const key = `${toISODate(start)}_${toISODate(end)}`
    if (fetchedRanges.current.has(key)) return   // already have this range

    fetchedRanges.current.add(key)

    try {
      const tasks = await taskApi.getCalendarTasks(
        start.toISOString(),
        end.toISOString()
      )

      // Merge fetched tasks into taskMap, grouped by date
      setTaskMap(prev => {
        const next = { ...prev }

        // Clear existing entries for this range to avoid stale data
        const rangeSize = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        )
        for (let i = 0; i <= rangeSize; i++) {
          const key = toISODate(addDays(start, i))
          next[key] = []
        }

        // Populate with fetched tasks
        for (const task of tasks) {
          if (!task.dueDate) continue
          const dateKey = task.dueDate.split('T')[0]
          if (!next[dateKey]) next[dateKey] = []
          next[dateKey].push(task)
        }

        return next
      })
    } catch (err) {
      console.error('Calendar fetch error:', err)
      fetchedRanges.current.delete(key)  // allow retry on error
    }
  }, [])

  // ── Initial load ─────────────────────────────────────────────────────────

  useEffect(() => {
    async function initialLoad() {
      setLoading(true)
      const start = addDays(today, -DAYS_BEFORE)
      const end   = addDays(today,  WINDOW_SIZE)
      await fetchRange(start, end)
      setLoading(false)
    }

    initialLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Extend window forward (scroll down) ──────────────────────────────────

  const loadFuture = useCallback(async () => {
    if (fetchingMore) return
    setFetchingMore(true)

    const newEnd   = addDays(windowStart, WINDOW_SIZE + FETCH_THRESHOLD + 14)
    const fetchEnd = addDays(windowStart, WINDOW_SIZE + 14)

    await fetchRange(addDays(windowStart, WINDOW_SIZE), fetchEnd)

    setWindowStart(prev => addDays(prev, 7))   // slide window forward
    setFetchingMore(false)
  }, [windowStart, fetchingMore, fetchRange])

  // ── Extend window backward (scroll up) ───────────────────────────────────

  const loadPast = useCallback(async () => {
    if (fetchingMore) return
    setFetchingMore(true)

    const newStart  = addDays(windowStart, -14)
    await fetchRange(newStart, windowStart)

    setWindowStart(prev => addDays(prev, -7))  // slide window backward
    setFetchingMore(false)
  }, [windowStart, fetchingMore, fetchRange])

  // ── Mutate taskMap directly after CRUD operations ─────────────────────────

  const addTaskToMap = useCallback((task: Task) => {
    if (!task.dueDate) return
    const dateKey = task.dueDate.split('T')[0]
    setTaskMap(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] ?? []), task],
    }))
  }, [])

  const removeTaskFromMap = useCallback((task: Task) => {
    if (!task.dueDate) return
    const dateKey = task.dueDate.split('T')[0]
    setTaskMap(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] ?? []).filter(t => t.id !== task.id),
    }))
  }, [])

  const updateTaskInMap = useCallback((task: Task) => {
    removeTaskFromMap(task)
    addTaskToMap(task)
  }, [addTaskToMap, removeTaskFromMap])

  const toggleTaskInMap = useCallback((updatedTask: Task) => {
    if (!updatedTask.dueDate) return
    const dateKey = updatedTask.dueDate.split('T')[0]
    setTaskMap(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] ?? []).map(t =>
        t.id === updatedTask.id ? updatedTask : t
      ),
    }))
  }, [])

  return {
    days,
    loading,
    fetchingMore,
    loadFuture,
    loadPast,
    addTaskToMap,
    updateTaskInMap,
    removeTaskFromMap,
    toggleTaskInMap,
    today,
  }
}