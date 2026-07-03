// frontend/src/api/tasks.ts

import api from './client'
import type { Task, TaskType, CreateTaskInput, UpdateTaskInput } from '../types'

export const taskApi = {
  getTaskTypes: async (): Promise<TaskType[]> => {
    const { data } = await api.get('/tasks/task-types')
    return data
  },

  getTasks: async (filters?: {
    taskTypeId?: string
    completed?: boolean
    dueAfter?: string
    dueBefore?: string
  }): Promise<Task[]> => {
    const { data } = await api.get('/tasks', { params: filters })
    return data
  },

  getTask: async (id: string): Promise<Task> => {
    const { data } = await api.get(`/tasks/${id}`)
    return data
  },

  createTask: async (input: CreateTaskInput): Promise<Task> => {
    const { data } = await api.post('/tasks', input)
    return data
  },

  updateTask: async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const { data } = await api.put(`/tasks/${id}`, input)
    return data
  },

  toggleComplete: async (id: string): Promise<Task> => {
    const { data } = await api.patch(`/tasks/${id}/complete`)
    return data
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },

  getCalendarTasks: async (start: string, end: string): Promise<Task[]> => {
    const { data } = await api.get('/tasks/calendar', {
      params: { start, end }
    })
    return data
  },
}