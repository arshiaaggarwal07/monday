// frontend/src/types/index.ts

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface ApiError {
  error: string
}

export interface TaskType {
  id: string
  name: string
}

export interface Task {
  id: string
  userId: string
  title: string
  description: string | null
  taskTypeId: string
  taskType: TaskType
  repeatType: RepeatType
  dueDate: string | null    // ISO string from API
  reminderEnabled: boolean
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type RepeatType =
  | 'NEVER'
  | 'DAILY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'
  | 'WEEKDAYS'
  | 'WEEKENDS'
  | 'CUSTOM'

export interface CreateTaskInput {
  title: string
  description?: string
  taskTypeId: string
  repeatType?: RepeatType
  dueDate?: string
  reminderEnabled?: boolean
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  taskTypeId?: string
  repeatType?: RepeatType
  dueDate?: string
  reminderEnabled?: boolean
}