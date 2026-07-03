// frontend/src/hooks/useListView.ts

import { useState, useEffect, useCallback } from 'react'
import type { Task, TaskType } from '../types'
import { taskApi } from '../api/tasks'
import { getTaskTypeName } from '../config/listMapping'

export function useListView(listParam: string) {
  const [tasks,     setTasks]     = useState<Task[]>([])
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([])
  const [loading,   setLoading]   = useState(true)

  const taskTypeName = getTaskTypeName(listParam)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [allTypes, allTasks] = await Promise.all([
        taskApi.getTaskTypes(),
        taskApi.getTasks(),
      ])
      setTaskTypes(allTypes)

      // Filter by matching task type name
      const matchingType = allTypes.find(
        t => t.name.toLowerCase() === taskTypeName?.toLowerCase()
      )

      if (matchingType) {
        setTasks(allTasks.filter(t => t.taskTypeId === matchingType.id))
      } else {
        setTasks(allTasks)  // fallback: show everything if mapping not found
      }
    } catch (err) {
      console.error('List view load error:', err)
    } finally {
      setLoading(false)
    }
  }, [taskTypeName])

  useEffect(() => { load() }, [load])

  const removeTask = useCallback((task: Task) => {
    setTasks(prev => prev.filter(t => t.id !== task.id))
  }, [])

  const updateTask = useCallback((task: Task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t))
  }, [])

  const addTask = useCallback((task: Task) => {
    const matchingType = taskTypes.find(
      t => t.name.toLowerCase() === taskTypeName?.toLowerCase()
    )
    // Only add to local state if it belongs to this list's type
    if (matchingType && task.taskTypeId === matchingType.id) {
      setTasks(prev => [...prev, task])
    }
  }, [taskTypes, taskTypeName])

  return { tasks, loading, taskTypeName, removeTask, updateTask, addTask }
}