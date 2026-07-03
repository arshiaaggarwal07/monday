// frontend/src/hooks/useBoardData.ts

import { useState, useEffect, useCallback } from 'react'
import type { Task, TaskType } from '../types'
import { taskApi } from '../api/tasks'

export interface BoardColumn {
  taskType: TaskType
  tasks:    Task[]
}

export function useBoardData() {
  const [columns, setColumns] = useState<BoardColumn[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [taskTypes, tasks] = await Promise.all([
        taskApi.getTaskTypes(),
        taskApi.getTasks({ completed: false }),
      ])

      const grouped: BoardColumn[] = taskTypes.map(taskType => ({
        taskType,
        tasks: tasks.filter(t => t.taskTypeId === taskType.id),
      }))

      setColumns(grouped)
    } catch (err) {
      console.error('Board load error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Mutate locally so UI updates instantly without a full reload
  const addTaskToColumn = useCallback((task: Task) => {
    setColumns(prev => prev.map(col =>
      col.taskType.id === task.taskTypeId
        ? { ...col, tasks: [...col.tasks, task] }
        : col
    ))
  }, [])

  const removeTaskFromColumn = useCallback((task: Task) => {
    setColumns(prev => prev.map(col =>
      col.taskType.id === task.taskTypeId
        ? { ...col, tasks: col.tasks.filter(t => t.id !== task.id) }
        : col
    ))
  }, [])

  const updateTaskInColumn = useCallback((task: Task) => {
    setColumns(prev => prev.map(col => ({
      ...col,
      tasks: col.taskType.id === task.taskTypeId
        ? [...col.tasks.filter(t => t.id !== task.id), task]
        : col.tasks.filter(t => t.id !== task.id),  // remove if moved to a different type
    })))
  }, [])

  // Completing a task removes it from the board (board only shows active tasks)
  const completeTaskInColumn = useCallback((task: Task) => {
    removeTaskFromColumn(task)
  }, [removeTaskFromColumn])

  return {
    columns,
    loading,
    reload: load,
    addTaskToColumn,
    removeTaskFromColumn,
    updateTaskInColumn,
    completeTaskInColumn,
  }
}