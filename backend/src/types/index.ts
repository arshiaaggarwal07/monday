// backend/src/types/index.ts

export interface JwtPayload {
  userId: string
  email: string
}

// RepeatType mirrors the Prisma enum exactly
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
  dueDate?: string        // ISO string from client, convert to Date in service
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

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}