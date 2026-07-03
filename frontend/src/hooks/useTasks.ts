// frontend/src/hooks/useTasks.ts

import { useState, useEffect } from 'react'
import type { Task, TaskType, CreateTaskInput, UpdateTaskInput } from '../types'
import { taskApi } from '../api/tasks'

export function useTaskTypes() {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    taskApi.getTaskTypes()
      .then(setTaskTypes)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { taskTypes, loading }
}

export function useTaskForm(existingTask: Task | null) {
  const [title,           setTitle]           = useState(existingTask?.title           ?? '')
  const [description,     setDescription]     = useState(existingTask?.description     ?? '')
  const [taskTypeId,      setTaskTypeId]      = useState(existingTask?.taskTypeId      ?? '')
  const [repeatType,      setRepeatType]      = useState(existingTask?.repeatType      ?? 'NEVER')
  const [dueDate,         setDueDate]         = useState(
    existingTask?.dueDate
      ? existingTask.dueDate.slice(0, 16)   // "2025-06-16T09:00" for datetime-local input
      : ''
  )
  const [reminderEnabled, setReminderEnabled] = useState(existingTask?.reminderEnabled ?? false)
  const [errors,          setErrors]          = useState<Record<string, string>>({})
  const [submitting,      setSubmitting]      = useState(false)

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!title.trim())  next.title      = 'Task name is required'
    if (!taskTypeId)    next.taskTypeId = 'Please select a category'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function submit(
    onSaved: (task: Task, isEdit: boolean) => void
  ) {
    if (!validate()) return
    setSubmitting(true)

    try {
      if (existingTask) {
        const input: UpdateTaskInput = {
          title:           title.trim(),
          description:     description.trim() || undefined,
          taskTypeId,
          repeatType,
          dueDate:         dueDate || undefined,
          reminderEnabled,
        }
        const updated = await taskApi.updateTask(existingTask.id, input)
        onSaved(updated, true)
      } else {
        const input: CreateTaskInput = {
          title:           title.trim(),
          description:     description.trim() || undefined,
          taskTypeId,
          repeatType,
          dueDate:         dueDate || undefined,
          reminderEnabled,
        }
        const created = await taskApi.createTask(input)
        onSaved(created, false)
      }
    } catch (err) {
        console.error('Task save error:', err)
        setErrors({ form: 'Something went wrong. Please try again.' })
    }
  }

  return {
    fields: { title, description, taskTypeId, repeatType, dueDate, reminderEnabled },
    setters: { setTitle, setDescription, setTaskTypeId, setRepeatType, setDueDate, setReminderEnabled },
    errors,
    submitting,
    submit,
  }
}