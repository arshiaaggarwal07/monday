// frontend/src/hooks/useMonthCalendar.ts

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Task } from '../types'
import { taskApi } from '../api/tasks'
import { buildMonthGrid, startOfMonth, endOfMonth, addMonths } from '../utils/monthGrid'

// ── Local date key helper ─────────────────────────────────────────────────────
// NEVER use isoString.split('T')[0] or toISOString().slice(0,10)
// Those give the UTC date, which is wrong for anyone not in UTC±0.
// IST is UTC+5:30, so anything before 5:30am IST is "yesterday" in UTC.
function toLocalDateKey(isoString: string): string {
  const date = new Date(isoString)
  const year  = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day   = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ── Grid cell date key ────────────────────────────────────────────────────────
// Same principle: read LOCAL date parts from the Date object
function cellDateKey(date: Date): string {
  const year  = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day   = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function useMonthCalendar() {
  const [monthDate, setMonthDate] = useState(new Date())
  const [taskMap,   setTaskMap]   = useState<Record<string, Task[]>>({})
  const [loading,   setLoading]   = useState(true)

  const grid = useMemo(() => buildMonthGrid(monthDate), [monthDate])

  const fetchMonth = useCallback(async (date: Date) => {
    setLoading(true)
    try {
      const start = new Date(startOfMonth(date))
      start.setDate(start.getDate() - 7)
      const end = new Date(endOfMonth(date))
      end.setDate(end.getDate() + 7)

      const tasks = await taskApi.getCalendarTasks(
        start.toISOString(),
        end.toISOString()
      )

      const map: Record<string, Task[]> = {}
      for (const task of tasks) {
        if (!task.dueDate) continue
        const key = toLocalDateKey(task.dueDate)  // ← LOCAL date, not UTC
        if (!map[key]) map[key] = []
        map[key].push(task)
      }
      setTaskMap(map)
    } catch (err) {
      console.error('Month calendar fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMonth(monthDate)
  }, [monthDate, fetchMonth])

  const goNext  = useCallback(() => setMonthDate(prev => addMonths(prev, 1)), [])
  const goPrev  = useCallback(() => setMonthDate(prev => addMonths(prev, -1)), [])
  const goToday = useCallback(() => setMonthDate(new Date()), [])

  // Uses LOCAL date key for lookup — matches how tasks are stored in the map
  const getTasksForDate = useCallback((date: Date): Task[] => {
    return taskMap[cellDateKey(date)] ?? []
  }, [taskMap])

  const addTask = useCallback((task: Task) => {
    if (!task.dueDate) return
    const key = toLocalDateKey(task.dueDate)   // ← LOCAL date
    setTaskMap(prev => ({
      ...prev,
      [key]: [...(prev[key] ?? []), task]
    }))
  }, [])

  const removeTask = useCallback((task: Task) => {
    if (!task.dueDate) return
    const key = toLocalDateKey(task.dueDate)   // ← LOCAL date
    setTaskMap(prev => ({
      ...prev,
      [key]: (prev[key] ?? []).filter(t => t.id !== task.id)
    }))
  }, [])

  const updateTask = useCallback((task: Task) => {
    removeTask(task)
    addTask(task)
  }, [addTask, removeTask])

  return {
    monthDate,
    grid,
    loading,
    goNext,
    goPrev,
    goToday,
    getTasksForDate,
    addTask,
    removeTask,
    updateTask,
  }
}